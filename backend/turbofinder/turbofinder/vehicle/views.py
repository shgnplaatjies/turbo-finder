from django.shortcuts import render
from rest_framework import generics, status, permissions
from rest_framework.response import Response
from globalUrls import CARBON_EMISSIONS_API_URL
from rest_framework.throttling import UserRateThrottle
from .models import VehicleMake, VehicleModel
from .serializers import VehicleMakeSerializer, VehicleModelSerializer
from decouple import config
from datetime import datetime
import requests
from rest_framework.authentication import TokenAuthentication

class VehicleMakeListCreateView(generics.ListCreateAPIView):
  """
  API View for listing and creating vehicle makes.

  """
  queryset = VehicleMake.objects.all()
  serializer_class = VehicleMakeSerializer
  permission_classes = [permissions.IsAuthenticated]
  authentication_classes = [TokenAuthentication]
  throttle_classes = [UserRateThrottle]
  
  def create(self, request, *args, **kwargs):
    """
    Handles POST requests to create a new vehicle make.

    Parameters:
        request: The HTTP request object.

    Returns:
        Response: The HTTP response indicating the success or failure of the request.
            - 201_CREATED: Successfully created a new vehicle make.
                Example: {"status": "success", "message": "Vehicle make created successfully."}
    """
    serializer = self.get_serializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    
    serializer.save()

    return Response(
      serializer.data,
      status=status.HTTP_201_CREATED
    )

class VehicleModelCreateView(generics.ListCreateAPIView):
  """
    API View for creating and listing vehicle models associated with a specific vehicle make.

    """
  serializer_class = VehicleModelSerializer
  permission_classes = [permissions.IsAuthenticated]
  authentication_classes = [TokenAuthentication]
  throttle_classes = [UserRateThrottle]
  
  def get_offset_limit(self, request):
      """
        Retrieves the offset and limit values from the request data.

        Parameters:
            request: The HTTP request object.

        Returns:
            tuple: A tuple containing offset and limit values.
        """
      try:
          offset = int(request.data.get('offset', 0))
          limit = int(request.data.get('limit', 100))
      except ValueError:
          offset = 0
          limit = 100
      return offset, limit

  def get(self, request, *args, **kwargs):
      """
        Handles GET requests to retrieve a paginated list of vehicle models for a specific make.

        Parameters:
            request: The HTTP request object.

        Returns:
            Response: The HTTP response containing a paginated list of serialized vehicle models.
        """
      offset, limit = self.get_offset_limit(request)
      queryset = self.get_queryset()[offset:offset+limit]
      serializer = self.get_serializer(queryset, many=True)
      return Response(serializer.data)
  
  def get_queryset(self):
    """
        Retrieves the queryset for filtering vehicle models based on the associated make's UUID.

        Returns:
            QuerySet: The queryset for vehicle models.
        """
    uuid = self.kwargs.get('make_uuid')
    return VehicleModel.objects.filter(make__uuid = uuid)
  
  def create(self, request, *args, **kwargs):
    """
        Handles POST requests to create new vehicle models associated with a specific make.

        Parameters:
            request: The HTTP request object.

        Returns:
            Response: The HTTP response indicating the success or failure of the request.
                - 201_CREATED: Successfully created new vehicle models.
                    Example: {"status": "success", "message": "Vehicle models created successfully."}
                - 206_PARTIAL_CONTENT: Some models were updated, and others were created.
                    Example: {"status": "partial_success", "message": "Some models updated, some created."}
                - 403_FORBIDDEN: User does not have permission to perform the action.
                    Example: {"error": "You do not have permission to perform this action."}
                - 404_NOT_FOUND: Vehicle make with the specified UUID does not exist.
                    Example: {"error": "Vehicle Make with UUID:{make_uuid} does not exist."}
                - 409_CONFLICT: Conflicts in the request, such as duplicate models or make already existing.
                    Example: {"error": "This Make already exists in the database"}
                - 424_FAILED_DEPENDENCY: Error fetching data from the external API.
                    Example: {"Internal Error": "Error fetching data from external API."}
        """
    response_status = status.HTTP_500_INTERNAL_SERVER_ERROR
    
    if not request.user.is_staff:
            return Response(
                {"error": "You do not have permission to perform this action."},
                status=status.HTTP_403_FORBIDDEN
            )
    self.check_permissions(request)
            
    make_uuid = self.kwargs.get('make_uuid')

    
    try:
        VehicleMake.objects.get(uuid=make_uuid).id
    except VehicleMake.DoesNotExist:
        return Response(
            {"error": f"Vehicle Make with UUID:{make_uuid} does not exist."},
            status=status.HTTP_404_NOT_FOUND
        )

    
    existing_make = VehicleMake.objects.filter(uuid=make_uuid).first();
    
    if existing_make:
      return Response(
        {'error': 'This Make already exists in the database'},
        status=status.HTTP_409_CONFLICT
      )

    
    carbon_api_url = f"{CARBON_EMISSIONS_API_URL}/vehicle_makes/{make_uuid}/vehicle_models"
    
    api_headers = {
      "Authorization": f"Bearer {config('CARBON_INTERFACE_API_KEY')}",
      "Content-Type":"application/json"
    }
    
    response = requests.get(carbon_api_url, headers=api_headers)
    
    if response.status_code == 200:
      data = response.json()
      
      vehicle_models = []
      
      for element in data:
        element_data = element.get('data', {})
        attributes = element_data.get('attributes', {})
        
        uuid = element_data['id']
        name = attributes.get('name')
        year = attributes.get('year')
        
        year_datetime = datetime(year, 1, 1)
        
        existing = VehicleModel.objects.filter(uuid=uuid).first();
        
        if existing:
          existing.name = name
          existing.year = datetime(year, 1, 1)
          existing.save()
          response_status = status.HTTP_206_PARTIAL_CONTENT
        
        elif name and year:
            vehicle_models.append({
                'make': VehicleMake.objects.get(uuid=make_uuid),
                'name': name,
                'uuid': uuid,
                'year': year_datetime,
            })

      if vehicle_models:
        VehicleModel.objects.bulk_create([VehicleModel(**vehicle_models) for vehicle_models in vehicle_models])
    
      serializer = self.get_serializer(data=vehicle_models, many=True)
      serializer.is_valid(raise_exception=True)
            
      if response_status == status.HTTP_206_PARTIAL_CONTENT and vehicle_models == []:
        return Response(
          serializer.data,
          status=status.HTTP_409_CONFLICT
        )
      elif response_status == status.HTTP_206_PARTIAL_CONTENT:
        return Response(
          serializer.data,
          status=status.HTTP_206_PARTIAL_CONTENT
        )
      
      return Response(
        serializer.data,
        status=status.HTTP_201_CREATED
      )
    
    
    return Response(
      {"Internal Error": "Error fetching data from external API."},
      status=status.HTTP_424_FAILED_DEPENDENCY
    )

class VehicleMakeRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
  """
  API View for updating and deleting vehicle makes.

  """
  queryset = VehicleMake.objects.all()
  serializer_class = VehicleMakeSerializer
  authentication_classes = [TokenAuthentication]
  permission_classes= [permissions.IsAuthenticated, permissions.IsAdminUser]
  throttle_classes = [UserRateThrottle]
  
  
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
    serializer = self.get_serializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    
    if instance.vehiclemodel_set.exists():
          return Response(
            {"error": "Cannot delete vehicle make with vehicle models associated with it."},
            status=status.HTTP_400_BAD_REQUEST
          )

    serializer.perform_destroy(instance)

    return Response(status=status.HTTP_204_NO_CONTENT)
  