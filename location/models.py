from django.db import models


class Location(models.Model):
    address = models.TextField()
    latitude = models.FloatField()
    longitude = models.FloatField()
    landmark = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.address
