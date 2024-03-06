# turbofinder/vehicle/urls.py
from django.urls import path
from .views import VehicleMakeListCreateView, VehicleMakeRetrieveUpdateDestroyView

urlpatterns = [
    path('vehicle-makes/', VehicleMakeListCreateView.as_view(), name='vehicle-make-list-create'),
    path('vehicle-makes/<int:pk>/', VehicleMakeRetrieveUpdateDestroyView.as_view(), name='vehicle-make-retrieve-update-destroy')
]
