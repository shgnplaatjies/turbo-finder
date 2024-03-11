from rest_framework import serializers
from .models import VehicleMake, VehicleModel

class VehicleMakeSerializer(serializers.ModelSerializer):
  """
  Serializer class for the VehicleMake model.

  Attributes:
      Meta (Meta): Meta class for defining the model and fields for serialization.
  """
  class Meta:
    """
    Meta class for defining the model and fields for serialization.
    """
    model = VehicleMake
    fields = '__all__'

class VehicleModelSerializer(serializers.ModelSerializer):
  """
  Serializer class for the VehicleModel model.

  Attributes:
      make (VehicleMakeSerializer): The serializer for the associated vehicle make.
  """
  make = VehicleMakeSerializer()
  class Meta:
    """
    Meta class for defining the model and fields for serialization.
    """
    model = VehicleModel
    fields = '__all__'