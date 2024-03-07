from django.shortcuts import get_object_or_404
from rest_framework import generics, status, permissions
from rest_framework.throttling import UserRateThrottle
from rest_framework.response import Response
from .models import DistanceUnit, EmissionEstimate, ViewableEmissionEstimates, TurboFinderUser, VehicleModel
from .serializers import DistanceUnitSerializer, EmissionEstimateSerializer, ViewableEmissionEstimatesSerializer, TurboFinderUserSerializer
import requests
from decouple import config
from datetime import datetime, timedelta, timezone

class DistanceUnitListCreateView(generics.ListCreateAPIView):
    queryset = DistanceUnit.objects.all()
    serializer_class = DistanceUnitSerializer
    permission_classes = [permissions.IsAuthenticated]

class DistanceUnitRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = DistanceUnit.objects.all()
    serializer_class = DistanceUnitSerializer
    permission_classes = [permissions.IsAuthenticated]

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()

        if instance.emissionestimate_set.exists():
            return Response(
                {"error": "Cannot delete distance unit with associated emission estimates."},
                status=status.HTTP_409_CONFLICT
            )

        return super().destroy(request, *args, **kwargs)

class UserAddCreditsView(generics.RetrieveUpdateAPIView):
    queryset = TurboFinderUser.objects.all()
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = TurboFinderUserSerializer
    
    throttle_classes = [UserRateThrottle]
    
    def get_queryset(self):
        if self.request.user.is_superuser:
            return TurboFinderUser.objects.all()
        return TurboFinderUser.objects.filter(user_id=self.request.user)
    
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

        
        viewable_estimate = ViewableEmissionEstimates(emissions_estimate=emission_estimate, user_id=user)
        viewable_estimate.save()

        serializer = self.get_serializer(emission_estimate)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class ViewableEmissionEstimatesListCreateView(generics.ListCreateAPIView):
    queryset = ViewableEmissionEstimates.objects.all()
    serializer_class = ViewableEmissionEstimatesSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        if self.request.user.is_superuser:
            return ViewableEmissionEstimates.objects.all()
        return ViewableEmissionEstimates.objects.filter(user_id=self.request.user)


    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        emission_estimate = EmissionEstimate.objects.get(pk=request.data.get('emission_estimate'))

        credits_to_subtract = 3

        if self.request.user.credits >= credits_to_subtract:
            self.request.user.credits -= credits_to_subtract
            self.request.user.save()
            serializer.save(user=self.request.user, emission_estimate=emission_estimate)

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(
                {"error": "Insufficient credits."},
                status=status.HTTP_400_BAD_REQUEST
            )

class ViewableEmissionEstimatesRetrieveDestroyView(generics.RetrieveDestroyAPIView):
    queryset = ViewableEmissionEstimates.objects.all()
    serializer_class = ViewableEmissionEstimatesSerializer
    permission_classes = [permissions.IsAuthenticated]

    def destroy(self, request, *args, **kwargs):
        self.check_permissions(request)

        instance = self.get_object()

        instance.delete()

        return Response(status=status.HTTP_204_NO_CONTENT)
