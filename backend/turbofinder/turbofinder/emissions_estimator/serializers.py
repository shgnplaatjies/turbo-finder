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
    

class SimplifiedViewableEmissionEstimatesSerializer(serializers.ModelSerializer):
    class Meta:
        model = ViewableEmissionEstimates
        fields = [
            'id',
            'emissions_estimate',
            'user_id',
        ]

    emissions_estimate = serializers.SerializerMethodField()

    def get_emissions_estimate(self, instance):
        emission_estimate = instance.emissions_estimate
        model = emission_estimate.model
        current_user = self.context['request'].user

        serialized_data = {
            'id': emission_estimate.id,
            'model': {
                'id': model.id,
                'make': {
                    'id': model.make.id,
                    'name': model.make.name,
                },
                'name': model.name,
                'year': model.year,
            },
            'estimated_at': emission_estimate.estimated_at,
            'unit_id': emission_estimate.unit_id.id,  # Serialize the DistanceUnit ID
        }

        # Conditionally include fields if the user is associated with the estimate
        if emission_estimate.estimated_by == current_user:
            serialized_data['carbon_grams'] = emission_estimate.carbon_grams
            serialized_data['distance_scale'] = emission_estimate.distance_scale

        return serialized_data


class DistanceUnitSerializer(serializers.ModelSerializer):
  class Meta:
    model = DistanceUnit
    fields = '__all__'

class TurboFinderUserSerializer(serializers.ModelSerializer):
  class Meta:
    model = TurboFinderUser
    fields = ['credits']