from django.contrib import admin
from .models import ViewableEmissionEstimates,DistanceUnit,EmissionEstimate, TurboFinderUser

admin.site.register(ViewableEmissionEstimates)
admin.site.register(EmissionEstimate)
admin.site.register(DistanceUnit)
admin.site.register(TurboFinderUser)