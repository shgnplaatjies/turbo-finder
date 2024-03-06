from django.contrib import admin

from .models import VehicleMake, VehicleModel

admin.site.register(VehicleMake)
admin.site.register(VehicleModel)