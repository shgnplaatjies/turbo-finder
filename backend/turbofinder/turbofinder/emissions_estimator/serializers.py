from rest_framework import serializers
from .models import ViewableEmissionEstimates, EmissionEstimate, DistanceUnit, TurboFinderUser

class ViewableEmissionEstimatesSerializer(serializers.ModelSerializer):
  class Meta:
    model = ViewableEmissionEstimates
    fields = '__all__'

class EmissionEstimateSerializer(serializers.ModelSerializer):
  class Meta:
    model = EmissionEstimate
    fields = '__all__'

class DistanceUnitSerializer(serializers.ModelSerializer):
  class Meta:
    model = DistanceUnit
    fields = '__all__'

class TurboFinderUserSerializer(serializers.ModelSerializer):
  class Meta:
    model = TurboFinderUser
    fields = ['credits']