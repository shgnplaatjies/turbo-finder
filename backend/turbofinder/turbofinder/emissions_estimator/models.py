from django.db import models
# from vehicle.models import VehicleModel

# class EmmissionEstimate(models.Model):
#   name = models.CharField(max_length=150) # arbitrary length for names
#   model = models.ForeignKey(VehicleModel, on_delete=models.CASCADE) # deleting make deletes assoc models
#   estimated_by = models.
  
#   def __str__(self):
#       return self.name

# class ViewableEmissionEstimates(models.Model):
#   emissions_estimate = models.ForeignKey(EmmissionEstimate, on_delete=models.CASCADE) # deleting make deletes assoc models
  
#   def __str__(self):
#       return f"{self.make.name} {self.name} {self.year.year}"
  