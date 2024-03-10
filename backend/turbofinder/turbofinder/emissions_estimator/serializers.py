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
        extra_kwargs = {
            'user': {'required': False}
        }

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
            'user',
        ]

    emissions_estimate = serializers.SerializerMethodField()
    user = serializers.SerializerMethodField()

    def get_emissions_estimate(self, instance):
        emission_estimate = instance.emissions_estimate
        model = emission_estimate.model
        current_user = self.context['request'].user

        serialized_emissions_estimate = {
            'id': emission_estimate.id,
            'model': {
                'id': model.id,
                'make': {
                    'id': model.make.id,
                    'name': model.make.name,
                },
                'name': model.name,
                'year': model.year,
                'uuid': model.uuid,
            },
            'estimated_at': emission_estimate.estimated_at,
            'unit_id': emission_estimate.unit_id.id,
        }

        if (
            emission_estimate.estimated_by == current_user
            or instance.user == current_user
        ):
            serialized_emissions_estimate['carbon_grams'] = emission_estimate.carbon_grams
            serialized_emissions_estimate['distance_scale'] = emission_estimate.distance_scale

        return serialized_emissions_estimate
    
    def get_user(self, instance):
        user = instance.user
        return {
            'id': user.id,
            'username': user.username,
        }


class DistanceUnitSerializer(serializers.ModelSerializer):
    class Meta:
        model = DistanceUnit
        fields = '__all__'

class TurboFinderUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = TurboFinderUser
        fields = ['credits']