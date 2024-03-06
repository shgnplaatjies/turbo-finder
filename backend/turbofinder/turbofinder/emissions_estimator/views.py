from rest_framework import generics, status, permissions
from rest_framework.response import Response
from .models import DistanceUnit, EmissionEstimate, ViewableEmissionEstimates, TurboFinderUser
from .serializers import DistanceUnitSerializer, EmissionEstimateSerializer, ViewableEmissionEstimatesSerializer, TurboFinderUserSerializer
import requests

class DistanceUnitListCreateView(generics.ListCreateAPIView):
    queryset = DistanceUnit.objects.all()
    serializer_class = DistanceUnitSerializer

class DistanceUnitRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = DistanceUnit.objects.all()
    serializer_class = DistanceUnitSerializer

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

    def patch(self, request, *args, **kwargs):
        user = self.request.user
        credits_to_add = 5

        try:
            user.credits += credits_to_add
            user.save()
            serializer = self.get_serializer(user)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except:
            return Response( status=status.HTTP_400_BAD_REQUEST)

class EmissionEstimateCreateView(generics.CreateAPIView):
    queryset = EmissionEstimate.objects.all()
    serializer_class = EmissionEstimateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request, *args, **kwargs):
        self.check_permissions(request)

        emissions_estimate_serializer = self.get_serializer(data=request.data)
        emissions_estimate_serializer.is_valid(raise_exception=True)

        credits_to_subtract = 5

        if self.request.user.credits >= credits_to_subtract:
            self.request.user.credits -= credits_to_subtract

            viewable_emission_estimate = ViewableEmissionEstimates(
                user=self.request.user,
                emission_estimate=emissions_estimate_serializer
            )

            viewable_emission_estimate.save()
            self.request.user.save()
            emissions_estimate_serializer.save()

            return Response(emissions_estimate_serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(
                {"error": "Insufficient credits."},
                status=status.HTTP_400_BAD_REQUEST
            )

class ViewableEmissionEstimatesListCreateView(generics.ListCreateAPIView):
    queryset = ViewableEmissionEstimates.objects.all()
    serializer_class = ViewableEmissionEstimatesSerializer
    permission_classes = [permissions.IsAuthenticated]

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
