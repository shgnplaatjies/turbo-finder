from django.db import models
from vehicle.models import VehicleModel
from django.contrib.auth.models import AbstractUser


class DistanceUnit(models.Model):
  """
  Model class representing a distance unit.

  Attributes:
      name (CharField): The name of the distance unit.
      symbol (CharField): The symbol representing the distance unit.
      in_metric (DecimalField): The conversion factor to the metric system.
  """
  name = models.CharField(max_length=20, unique=True)
  symbol = models.CharField(max_length=3, unique=True)
  in_metric = models.DecimalField(decimal_places=5, max_digits=20)

class TurboFinderUser(AbstractUser):
  """
  Model class representing a user in the TurboFinder application.

  Attributes:
      credits (IntegerField): The user's credits.
  """

  credits = models.IntegerField(default=0)
  
  def __str__(self):
    """
    Returns a human-readable string representation of the user.
    """
    return self.username

class EmissionEstimate(models.Model):
  """
  Model class representing an emission estimate.

  Attributes:
      model (ForeignKey): The foreign key relationship to the associated vehicle model.
      unit_id (ForeignKey): The foreign key relationship to the associated distance unit.
      estimated_by (ForeignKey): The foreign key relationship to the user who estimated the emission.
      estimated_at (DateTimeField): The datetime of the emission estimate.
      carbon_grams (DecimalField): The amount of carbon in grams.
      distance_scale (DecimalField): The distance scale used in the estimate.
  """
  model = models.ForeignKey(VehicleModel, on_delete=models.CASCADE)
  unit_id= models.ForeignKey(DistanceUnit,on_delete=models.DO_NOTHING)
  estimated_by = models.ForeignKey(TurboFinderUser, null=True,on_delete=models.SET_NULL)

  estimated_at = models.DateTimeField()
  carbon_grams = models.DecimalField(decimal_places=5, max_digits=20)
  distance_scale = models.DecimalField(decimal_places=5, max_digits=20)
  
  def __str__(self):
      return f"{self.estimated_at} | {self.model.name}: {self.carbon_grams}g / {self.distance_scale}m"

class ViewableEmissionEstimates(models.Model):
  """
  Model class representing viewable emission estimates.

  Attributes:
      emissions_estimate (ForeignKey): The associated emission estimate.
      user (ForeignKey): The user who can view the emission estimate.
  """
  emissions_estimate = models.ForeignKey(EmissionEstimate, on_delete=models.CASCADE)
  user = models.ForeignKey(TurboFinderUser, on_delete=models.CASCADE)
  class Meta:
      unique_together = ('user', 'emissions_estimate')

  def __str__(self):
    return f"{self.emissions_estimate.model.make.name} {self.emissions_estimate.model.name} {self.emissions_estimate.model.year.year} - User: {self.user.username}"
