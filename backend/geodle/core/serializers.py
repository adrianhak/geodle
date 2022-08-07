from importlib.metadata import distribution
from rest_framework import serializers
from geodle.settings import MAX_GUESSES
from .models import GameRound, GameRoundLocation, Guess

class GameRoundSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField()
    class Meta:
        model = GameRound
        fields = ('id', 'date')

class FullGameRoundSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField()
    class Meta:
        model = GameRound
        fields = ('id', 'date', 'answer')

class GameRoundLocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = GameRoundLocation
        fields = ('id','lat','long')

class CommonLocation(serializers.Serializer):
    location = serializers.CharField()
    share = serializers.FloatField()

class ExtendedGameRoundSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField()
    locations = GameRoundLocationSerializer(many=True, read_only=True)
    answer = serializers.PrimaryKeyRelatedField(read_only=True)
    play_count = serializers.IntegerField()
    distribution = serializers.ListField(child=serializers.IntegerField())
    avg_distance = serializers.FloatField()
    most_common_location = CommonLocation(read_only=True)
    class Meta:
        model = GameRound
        fields = ('id','date','answer','locations','play_count','distribution', 'avg_distance','most_common_location')
    
    # Only include answer if correct context is given
    def to_representation(self, instance):
        rep = super().to_representation(instance)
        if not self.context['request'].query_params.get('c') == instance.answer.id and instance.id == self.context['lastId']:
            rep.pop('answer')
            rep.pop('locations')
            rep.pop('most_common_location')
        return rep

class GuessCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Guess
        fields = ('location', 'guessNumber')

class GuessSerializer(serializers.ModelSerializer):
    # TODO Add optional game_round 
    id = serializers.IntegerField()
    distance = serializers.IntegerField() # Required for proper codegen
    game_round = FullGameRoundSerializer(read_only=True)
    class Meta:
        model = Guess
        fields = ('id', 'location', 'guessNumber', 'distance', 'game_round')

    def to_representation(self, instance):
        rep =  super().to_representation(instance)
        if not self.context['isDone']:
            rep.pop('game_round')
        return rep
