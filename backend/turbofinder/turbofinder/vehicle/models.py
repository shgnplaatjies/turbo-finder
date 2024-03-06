from django.db import models

class VehicleMake(models.Model):
  name = models.CharField(max_length=150, unique=True) # arbitrary length for names
  uuid = models.CharField(max_length=36, unique=True) # uuid length from carbon-interface
  
  def __str__(self):
      return self.name

class VehicleModel(models.Model):
  make = models.ForeignKey(VehicleMake, on_delete=models.CASCADE) # deleting make deletes assoc models
  name = models.CharField(max_length=150)
  uuid = models.CharField(max_length=36, unique=True)
  year = models.DateTimeField() # converts year to datetime format
  
  def __str__(self):
      return f"{self.make.name} {self.name} {self.year.year}"
  