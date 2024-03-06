from django.contrib import admin
from .models import ViewableEmissionEstimates,DistanceUnit,EmissionEstimate

admin.site.register(ViewableEmissionEstimates)
admin.site.register(EmissionEstimate)
admin.site.register(DistanceUnit)