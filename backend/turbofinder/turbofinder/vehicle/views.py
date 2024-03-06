from django.shortcuts import render
from rest_framework import generics, status
from rest_framework.response import Response

from .models import VehicleMake
from .serializers import VehicleMakeSerializer

class VehicleMakeListCreateView(generics.ListCreateAPIView):
  queryset = VehicleMake.objects.all()
  serializer_class = VehicleMakeSerializer
  
  def create(self, request, *args, **kwargs):
    serializer = self.get_serializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    
    serializer.save()

    return Response(
      serializer.data,
      status=status.HTTP_201_CREATED
    )

class VehicleMakeRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
  queryset = VehicleMake.objects.all()
  serializer_class = VehicleMakeSerializer
  
  def update(self, request, *args, **kwargs):
    pk = kwargs.get('pk')

    if not pk:
      return Response(
        {'error': 'Primary key is required in the URL parameters'},
        status=status.HTTP_400_BAD_REQUEST
      )
      
    instance = self.get_object()
    
    serializer = self.get_serializer(instance, data=request.data, partial=True)
    serializer.is_valid(raise_exception=True)

    serializer.save()
    
    return Response(
      serializer.data,
      status=status.HTTP_202_ACCEPTED
      )
      
  def destroy(self, request, *args, **kwargs):
    instance = self.get_object()
    
    if instance.vehiclemodel_set.exists():
          return Response(
            {"error": "Cannot delete vehicle make with vehicle models associated with it."},
            status=status.HTTP_400_BAD_REQUEST
          )

    self.perform_destroy(instance)

    return Response(status=status.HTTP_204_NO_CONTENT)