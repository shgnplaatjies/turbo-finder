from rest_framework import serializers
from .models import VehicleMake

class VehicleMakeSerializer(serializers.ModelSerializer):
  class Meta:
    model = VehicleMake
    fields = '__all__'
