from rest_framework import serializers
from .models import ViewableEmissionEstimates, EmissionEstimate, DistanceUnit, TurboFinderUser
from vehicle.serializers import VehicleModelSerializer

class EmissionEstimateSerializer(serializers.ModelSerializer):
  model = VehicleModelSerializer()
  class Meta:
    model = EmissionEstimate
    fields = '__all__'

class ViewableEmissionEstimatesSerializer(serializers.ModelSerializer):
  emissions_estimate = EmissionEstimateSerializer()
  class Meta:
    model = ViewableEmissionEstimates
    fields = '__all__'

  def to_representation(self, instance):
      representation = super().to_representation(instance)
      representation['emissions_estimate'] = EmissionEstimateSerializer(instance.emissions_estimate).data
      return representation

class DistanceUnitSerializer(serializers.ModelSerializer):
  class Meta:
    model = DistanceUnit
    fields = '__all__'

class TurboFinderUserSerializer(serializers.ModelSerializer):
  class Meta:
    model = TurboFinderUser
    fields = ['credits']