from datetime import datetime
from http.client import responses
from django.http import HttpResponse
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from django.utils.decorators import method_decorator
from rest_framework.response import Response
from rest_framework.generics import ListAPIView, RetrieveAPIView, CreateAPIView
from geodle.core.services import getSatImage
from . import serializers
from . import models
from geodle.settings import MAX_GUESSES

# Create/Retrieve game
class GameRoundRetrieveAPIView(RetrieveAPIView):
    queryset = models.GameRound.objects.filter(date=datetime.date(datetime.now()))
    serializer_class = serializers.GameRoundSerializer

    def get_object(self):
        instance = self.queryset.first()
        if instance is None:
            instance = models.GameRound.objects.create_game_round()
            instance.add_locations()
            instance.save()
            instance = models.GameRound.objects.get(id=instance.id)
        return instance

@method_decorator(name='post', decorator=swagger_auto_schema(
    request_body=serializers.GuessCreateSerializer(),
    responses={201: serializers.GuessSerializer()}
))
class GuessCreateAPIView(CreateAPIView):
    queryset = models.Guess.objects.filter(game_round=models.GameRound.objects.filter(date=datetime.date(datetime.now())).first())
    serializer_class = serializers.GuessCreateSerializer
    
    def perform_create(self, serializer):
        serializer.save(user_agent=self.request.META['HTTP_USER_AGENT'], game_round=models.GameRound.objects.filter(date=datetime.date(datetime.now())).first())

    def create(self, request, *args, **kwargs):
        write_serializer = serializers.GuessCreateSerializer(data=request.data)
        write_serializer.is_valid(raise_exception=True)
        self.perform_create(write_serializer)
        instance = write_serializer.instance
        isDone = instance.location == instance.game_round.answer or instance.guessNumber >= MAX_GUESSES-1
        read_serializer = serializers.GuessSerializer(instance, context={'isDone': isDone})
        return Response(read_serializer.data)


class GetSatImageView(RetrieveAPIView):
    @swagger_auto_schema(
        manual_parameters=[
            openapi.Parameter(name='n', in_=openapi.IN_QUERY, type=openapi.TYPE_INTEGER),
            openapi.Parameter(name='l', in_=openapi.IN_QUERY, type=openapi.TYPE_BOOLEAN),
        ]
    )
    def get(self, request, *args, **kwargs):
        guessCount = int(request.query_params.get('n'))
        show_labels = request.query_params.get('l')
        gameRound = models.GameRound.objects.filter(date=datetime.date(datetime.now())).first()
        return HttpResponse(getSatImage(gameRound.locations.all()[guessCount].lat, gameRound.locations.all()[guessCount].long, show_labels=show_labels), content_type='image/jpeg')

@method_decorator(name='get', decorator=swagger_auto_schema(
    manual_parameters=[openapi.Parameter(name='c', in_=openapi.IN_QUERY, type=openapi.TYPE_STRING)]
))
class GameRoundResultsAPIView(ListAPIView):
    queryset = models.GameRound.objects.all().order_by('-id')
    serializer_class = serializers.ExtendedGameRoundSerializer
    def get_serializer_context(self):
        lastRound = self.queryset.first()
        context = super(GameRoundResultsAPIView,self).get_serializer_context()
        print(context)
        context['lastId'] = lastRound.id
        return context
