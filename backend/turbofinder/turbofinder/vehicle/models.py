from django.db import models

class VehicleMake(models.Model):
  name = models.CharField(max_length=150) # arbitrary length for names
  carbon_io_id = models.CharField(max_length=36) # uuid length from carbon-interface
  
  def __str__(self):
      return self.name

class VehicleModel(models.Model):
  make = models.ForeignKey(VehicleMake, on_delete=models.CASCADE) # deleting make deletes assoc models
  name = models.CharField(max_length=150)
  carbon_io_id = models.CharField(max_length=36)
  year = models.DateTimeField() # converts year to datetime format
  
  def __str__(self):
      return f"{self.make.name} {self.name} {self.year.year}"
  