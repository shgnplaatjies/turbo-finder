from django.db import models
from vehicle.models import VehicleModel
from django.contrib.auth.models import User


class DistanceUnit(models.Model):
  name = models.CharField(max_length=20)
  symbol = models.CharField(max_length=3, null=True)
  in_metric = models.DecimalField(decimal_places=5, max_digits=20)


class EmissionEstimate(models.Model):
  model = models.ForeignKey(VehicleModel, on_delete=models.CASCADE)
  unit_id= models.ForeignKey(DistanceUnit,on_delete=models.DO_NOTHING)
  estimated_by = models.ForeignKey(User, null=True,on_delete=models.SET_NULL)

  estimated_at = models.DateTimeField()
  carbon_grams = models.DecimalField(decimal_places=5, max_digits=20)
  distance_scale = models.DecimalField(decimal_places=5, max_digits=20)
  
  def __str__(self):
      return f"{self.estimated_at} | {self.model.name}: {self.carbon_grams}g / {self.distance_scale}m"

class ViewableEmissionEstimates(models.Model):
  emissions_estimate = models.ForeignKey(EmissionEstimate, on_delete=models.CASCADE)
  user_id = models.ForeignKey(User, on_delete=models.CASCADE)

  
  def __str__(self):
      return f"{self.make.name} {self.name} {self.year.year}"
  