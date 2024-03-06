from rest_framework import serializers
from .models import VehicleMake, VehicleModel

class VehicleMakeSerializer(serializers.ModelSerializer):
  class Meta:
    model = VehicleMake
    fields = '__all__'

class VehicleModelSerializer(serializers.ModelSerializer):
  make = VehicleMakeSerializer()
  class Meta:
    model = VehicleModel
    fields = '__all__'