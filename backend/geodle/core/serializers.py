from rest_framework import serializers

from .models import GameRound

class GameRoundSerializer(serializers.ModelSerializer):
    class Meta:
        model = GameRound
        fields = ('id', 'date')

class FullGameRoundSerializer(serializers.ModelSerializer):
    class Meta:
        model = GameRound
        fields = '__all__'