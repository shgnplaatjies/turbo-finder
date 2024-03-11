from django.shortcuts import get_object_or_404
from rest_framework import generics, views, status, permissions
from rest_framework.throttling import UserRateThrottle
from rest_framework.response import Response
from .models import DistanceUnit, EmissionEstimate, ViewableEmissionEstimates, TurboFinderUser, VehicleModel
from .serializers import DistanceUnitSerializer, EmissionEstimateSerializer, ViewableEmissionEstimatesSerializer, TurboFinderUserSerializer, TurboFinderUserInfoSerializer, SimplifiedViewableEmissionEstimatesSerializer
import requests
from decouple import config
from datetime import datetime, timedelta, timezone
from rest_framework.authentication import TokenAuthentication
from django.middleware.csrf import get_token
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from rest_framework.views import APIView
from django.db import IntegrityError
from django.db.models import Max
from django.db.models import F

@method_decorator(csrf_exempt, name='dispatch')
class CSRFGeneratorView(generics.ListAPIView):

    def get(self, request, *args, **kwargs):
        csrf_token = get_token(request)
        return Response({'csrf_token': csrf_token})


class DistanceUnitListCreateView(generics.ListCreateAPIView):
    queryset = DistanceUnit.objects.all()
    serializer_class = DistanceUnitSerializer
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [TokenAuthentication]

class DistanceUnitRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = DistanceUnit.objects.all()
    serializer_class = DistanceUnitSerializer
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [TokenAuthentication]

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()

        if instance.emissionestimate_set.exists():
            return Response(
                {"error": "Cannot delete distance unit with associated emission estimates."},
                status=status.HTTP_409_CONFLICT
            )

        return super().destroy(request, *args, **kwargs)
    
class UserInfoListView(generics.ListAPIView):
    queryset = TurboFinderUser.objects.all()
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = TurboFinderUserInfoSerializer
    authentication_classes = [TokenAuthentication]

    def get_queryset(self):
        return TurboFinderUser.objects.filter(username=self.request.user.username)

class UserListCreditsView(generics.ListAPIView):
    queryset = TurboFinderUser.objects.all()
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = TurboFinderUserSerializer
    authentication_classes = [TokenAuthentication]

    def get_queryset(self):
        return TurboFinderUser.objects.filter(username=self.request.user.username)

class UserAddCreditsView(generics.RetrieveUpdateAPIView):
    queryset = TurboFinderUser.objects.all()
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = TurboFinderUserSerializer
    authentication_classes = [TokenAuthentication]
    
    throttle_classes = [UserRateThrottle]
    
    def get_queryset(self):
        if self.request.user.is_superuser:
            return TurboFinderUser.objects.all()
        return TurboFinderUser.objects.filter(user=self.request.user)
    
    def get(self, request, *args, **kwargs):
        user = self.request.user
        serializer = self.get_serializer(user)
        
        response = Response(serializer.data, status=status.HTTP_200_OK)
        
        return response

    def patch(self, request, *args, **kwargs):
        user = self.request.user
        credits_to_add = 5

        user.credits += credits_to_add
        user.save()
        serializer = self.get_serializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)

class EmissionEstimateCreateView(generics.CreateAPIView):
    queryset = EmissionEstimate.objects.all()
    serializer_class = EmissionEstimateSerializer
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [TokenAuthentication]
    
    throttle_classes = [UserRateThrottle]

    def create(self, request, *args, **kwargs):
        self.check_permissions(request)

        user = self.request.user
        vehicle_uuid = request.data.get('uuid')
        distance_unit = 'km'

        recent_estimate = EmissionEstimate.objects.filter(model__uuid=vehicle_uuid, estimated_at__gte=datetime.now(timezone.utc) - timedelta(hours=12)).first()
        
        if recent_estimate:
            serializer  = self.get_serializer(recent_estimate)
            return Response(serializer.data, status=status.HTTP_304_NOT_MODIFIED)
        
        credits_to_subtract = 5
        if user.credits < credits_to_subtract:
            return Response({'error': f'Insufficient funds, available credits:{user.credits}, required credits:{credits_to_subtract}'}, status=status.HTTP_402_PAYMENT_REQUIRED)
        
        vehicle_model = VehicleModel.objects.filter(uuid = vehicle_uuid).first()
        
        if not vehicle_model:
            return Response({"error":"Invalid model UUID"}, status=status.HTTP_404_NOT_FOUND)

        distance_value = 100
        carbon_api_url = config('CARBON_INTERFACE_API_V1')+'/estimates'
        api_headers = {
            "Authorization": f"Bearer {config('CARBON_INTERFACE_API_KEY')}",
            "Content-Type": "application/json"
        }
        payload = {
            "type": "vehicle",
            "distance_unit": distance_unit,
            "distance_value": distance_value,
            "vehicle_model_id": vehicle_uuid
        }

        response = requests.post(carbon_api_url, headers=api_headers, json=payload)
        
        if 200 >= response.status_code and response.status_code >= 300:
            print(response, carbon_api_url, api_headers)
            return Response({"Error": "Internal Server Error, cannot reach external API", "status":response.status_code}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        response_data = response.json()

        carbon_grams = response_data['data']['attributes']['carbon_g']
        estimated_at = response_data['data']['attributes']['estimated_at']
        
        estimated_at_datetime = datetime.strptime(estimated_at, "%Y-%m-%dT%H:%M:%S.%fZ")

        
        user.credits -= credits_to_subtract
        user.save()

        unit_id = ''

        try:
            unit_id = DistanceUnit.objects.get(symbol=distance_unit)
        except DistanceUnit.DoesNotExist:
            return Response(
                {"error": f"DistanceUnit with name '{distance_unit}' does not exist."},
                status=status.HTTP_400_BAD_REQUEST
            )

        emission_estimate = EmissionEstimate.objects.create(
            model=vehicle_model,
            unit_id=unit_id,
            estimated_by=user,
            estimated_at=estimated_at_datetime,
            carbon_grams=carbon_grams,
            distance_scale=distance_value
        )

        
        viewable_estimate = ViewableEmissionEstimates(emissions_estimate=emission_estimate, user=user)
        viewable_estimate.save()

        serializer = self.get_serializer(emission_estimate)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class ViewableEmissionEstimatesListCreateView(generics.ListCreateAPIView):
    queryset = ViewableEmissionEstimates.objects.all()
    serializer_class = ViewableEmissionEstimatesSerializer
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [TokenAuthentication]
    
    def create(self, request, *args, **kwargs):
        emission_estimate_id = request.data.get('emissions_estimate', {}).get('id')

        if not emission_estimate_id:
            return Response(
                {"error": "emissions_estimate.id field is required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            emissions_estimate = EmissionEstimate.objects.get(pk=emission_estimate_id)
        except EmissionEstimate.DoesNotExist:
            return Response(
                {"error": f"Emission Estimate with ID {emission_estimate_id} does not exist."},
                status=status.HTTP_404_NOT_FOUND
            )

        user_id = request.data.get('user', {}).get('id', None)

        if user_id is not None:
            try:
                user = TurboFinderUser.objects.get(pk=user_id)
            except TurboFinderUser.DoesNotExist:
                return Response(
                    {"error": f"User with ID {user_id} does not exist."},
                    status=status.HTTP_404_NOT_FOUND
                )
        else:
            user = self.request.user


        credits_to_subtract = 3
        if user.credits <= credits_to_subtract:
            return Response(
                {"error": f"Insufficient credits. Required: {credits_to_subtract}, Available: {user.credits}"},
                status=status.HTTP_402_PAYMENT_REQUIRED
            )


        existing_viewable_estimate = ViewableEmissionEstimates.objects.filter(user=user, emissions_estimate=emissions_estimate).first()

        if existing_viewable_estimate:
            return Response(
                {'error': 'You already have access to this estimate.'},
                status=status.HTTP_409_CONFLICT
            )

        viewable_estimate = ViewableEmissionEstimates.objects.create(
            emissions_estimate=emissions_estimate,
            user=user
        )

        user.credits -= credits_to_subtract
        user.save()

        serializer = self.get_serializer(viewable_estimate)

        return Response(serializer.data, status=status.HTTP_201_CREATED)


class AllViewableEmissionEstimates(generics.ListAPIView):
    queryset = ViewableEmissionEstimates.objects.all()
    serializer_class = SimplifiedViewableEmissionEstimatesSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        current_user = self.request.user

        unique_estimates = {}

        # O(n) way to filter out redundant items
        for viewable_estimate in ViewableEmissionEstimates.objects.all():
            emission_estimate = viewable_estimate.emissions_estimate

            if emission_estimate.id in unique_estimates:
                if (
                    viewable_estimate.user == current_user
                    and viewable_estimate.id > unique_estimates[emission_estimate.id].id
                ):
                    unique_estimates[emission_estimate.id] = viewable_estimate
            else:
                unique_estimates[emission_estimate.id] = viewable_estimate

        return unique_estimates.values()



class ViewableEmissionEstimatesRetrieveDestroyView(generics.RetrieveDestroyAPIView):
    queryset = ViewableEmissionEstimates.objects.all()
    serializer_class = ViewableEmissionEstimatesSerializer
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [TokenAuthentication]

    def destroy(self, request, *args, **kwargs):
        self.check_permissions(request)

        instance = self.get_object()

        instance.delete()

        return Response(status=status.HTTP_204_NO_CONTENT)