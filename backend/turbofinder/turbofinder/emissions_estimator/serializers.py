from rest_framework import serializers
from .models import ViewableEmissionEstimates, EmissionEstimate, DistanceUnit, TurboFinderUser
from vehicle.serializers import VehicleModelSerializer


class TurboFinderUserInfoSerializer(serializers.ModelSerializer):
    """
    Serializer class for the TurboFinderUser model, including additional information.

    Attributes:
        Meta (Meta): Meta class for defining the model and fields for serialization.
    """
    class Meta:
        """
        Meta class for defining the model and fields for serialization.
        """
        model = TurboFinderUser
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'credits']

class TurboFinderUserSerializer(serializers.ModelSerializer):
    """
    Serializer class for the TurboFinderUser model, specifically for credits.

    Attributes:
        Meta (Meta): Meta class for defining the model and fields for serialization.
    """
    class Meta:
        """
        Meta class for defining the model and fields for serialization.
        """

        model = TurboFinderUser
        fields = ['credits']

class EmissionEstimateSerializer(serializers.ModelSerializer):
    """
    Serializer class for the EmissionEstimate model.

    Attributes:
        model (VehicleModelSerializer): Serializer for the associated vehicle model.
    """
    model = VehicleModelSerializer()
    class Meta:
        model = EmissionEstimate
        fields = '__all__'

class ViewableEmissionEstimatesSerializer(serializers.ModelSerializer):
    """
    Serializer class for the ViewableEmissionEstimates model.

    Attributes:
        emissions_estimate (EmissionEstimateSerializer): Serializer for the associated emission estimate.
    """
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
    """
    Serializer class for simplified viewable emission estimates.
    """
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
            'estimated_by' : {
                'username': emission_estimate.estimated_by.username,
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
            'username': user.username,
        }


class DistanceUnitSerializer(serializers.ModelSerializer):
    """
    Serializer class for the DistanceUnit model.

    Attributes:
        Meta (Meta): Meta class for defining the model and fields for serialization.
    """
    class Meta:
        """
        Meta class for defining the model and fields for serialization.
        """
        model = DistanceUnit
        fields = '__all__'

