from django.db import models

class VehicleMake(models.Model):
  """
  Model class representing a vehicle make.

  Attributes:
      name (CharField): The name of the vehicle make.
      uuid (CharField): The unique identifier for the vehicle make.

  Methods:
      __str__: Returns a human-readable string representation of the model.
  """
  name = models.CharField(max_length=150, unique=True)
  uuid = models.CharField(max_length=36, unique=True)
  
  def __str__(self):
      return self.name

class VehicleModel(models.Model):
  """
    Model class representing a vehicle model.

    Attributes:
        make (ForeignKey): The foreign key relationship to the associated vehicle make.
        name (CharField): The name of the vehicle model.
        uuid (CharField): The unique identifier for the vehicle model.
        year (DateTimeField): The manufacturing year of the vehicle model.

    Methods:
        __str__: Returns a human-readable string representation of the model.
    """
  make = models.ForeignKey(VehicleMake, on_delete=models.CASCADE)
  name = models.CharField(max_length=150)
  uuid = models.CharField(max_length=36, unique=True)
  year = models.DateTimeField()
  
  def __str__(self):
      return f"{self.make.name} {self.name} {self.year.year}"
  