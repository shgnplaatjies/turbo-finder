# turbofinder/vehicle/urls.py
from django.urls import path
from .views import VehicleMakeListCreateView, VehicleMakeRetrieveUpdateDestroyView, VehicleModelCreateView

urlpatterns = [
    path('vehicle-makes/', VehicleMakeListCreateView.as_view(), name='vehicle-make-list-create'),
    path('vehicle-makes/<int:pk>/', VehicleMakeRetrieveUpdateDestroyView.as_view(), name='vehicle-make-retrieve-update-destroy'),
    path('vehicle-make/<str:make_uuid>/models/', VehicleModelCreateView.as_view(), name='vehicle-model-list-create')
]
