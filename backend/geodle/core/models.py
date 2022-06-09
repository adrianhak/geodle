from datetime import datetime
import random
from django.db import models
from django.utils.timezone import make_aware
from geopy import distance

from geodle.settings import MAX_GUESSES
from .services import getRandomCoordsInLocation

class GameRoundManager(models.Manager):
    def create_game_round(self):
        locations = list(Location.objects.all())
        location = random.choice(locations)
        while location.id in [x.answer.id for x in GameRound.objects.all().order_by('-date')[:30]]:
            location = random.choice(locations)
        game_round = self.create(date=datetime.date(make_aware(datetime.now())), answer=location)
        return game_round

class GameRound(models.Model):
    id = models.AutoField(primary_key=True)
    date = models.DateTimeField()
    answer = models.ForeignKey('Location', on_delete=models.CASCADE)

    objects = GameRoundManager()

    class Meta:
        constraints = [models.UniqueConstraint(fields=['date'], name='unique_game_round')]

    def add_locations(self):
        for i in range(MAX_GUESSES):
            lat, long = getRandomCoordsInLocation(self.answer.name)
            l = GameRoundLocation.objects.create(game_round=self, lat=lat, long=long)
            l.save()


    def distance_to_answer(self, guess):
        location = Location.objects.get(id=guess)
        if not location:
            return None
        return distance.distance((self.answer.lat, self.answer.long), (location.lat, location.long)).km

class GameRoundLocation(models.Model):
    game_round = models.ForeignKey('GameRound', on_delete=models.CASCADE, related_name='locations')
    lat = models.FloatField()
    long = models.FloatField()

    class Meta:
        unique_together=(('game_round', 'lat', 'long'),)

class Location(models.Model):
    id = models.CharField(max_length=10, primary_key=True)
    name = models.CharField(max_length=255)
    lat = models.FloatField()
    long = models.FloatField()

