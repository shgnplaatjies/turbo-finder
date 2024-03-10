from django.db import models
from vehicle.models import VehicleModel
from django.contrib.auth.models import AbstractUser


class DistanceUnit(models.Model):
  name = models.CharField(max_length=20, unique=True)
  symbol = models.CharField(max_length=3, unique=True)
  in_metric = models.DecimalField(decimal_places=5, max_digits=20)

class TurboFinderUser(AbstractUser):
  credits = models.IntegerField(default=0)
  
  def __str__(self):
    return self.username

class EmissionEstimate(models.Model):
  model = models.ForeignKey(VehicleModel, on_delete=models.CASCADE)
  unit_id= models.ForeignKey(DistanceUnit,on_delete=models.DO_NOTHING)
  estimated_by = models.ForeignKey(TurboFinderUser, null=True,on_delete=models.SET_NULL)

  estimated_at = models.DateTimeField()
  carbon_grams = models.DecimalField(decimal_places=5, max_digits=20)
  distance_scale = models.DecimalField(decimal_places=5, max_digits=20)
  
  def __str__(self):
      return f"{self.estimated_at} | {self.model.name}: {self.carbon_grams}g / {self.distance_scale}m"

class ViewableEmissionEstimates(models.Model):
  emissions_estimate = models.ForeignKey(EmissionEstimate, on_delete=models.CASCADE)
  user = models.ForeignKey(TurboFinderUser, on_delete=models.CASCADE)
  class Meta:
      unique_together = ('user', 'emissions_estimate')

  def __str__(self):
    return f"{self.emissions_estimate.model.make.name} {self.emissions_estimate.model.name} {self.emissions_estimate.model.year.year} - User: {self.user.username}"
