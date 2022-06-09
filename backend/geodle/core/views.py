from datetime import datetime
import time
from django.http import HttpResponse, JsonResponse, HttpResponseNotFound
from django.core.serializers import serialize
from geodle.core.services import getSatImage
from geodle.settings import MAX_GUESSES
from .serializers import FullGameRoundSerializer, GameRoundSerializer
from .models import GameRound

def play(request):
    # Check if there is a game round in the database for the current date
    gameRound = GameRound.objects.filter(date=datetime.date(datetime.now())).first()
    if gameRound is None:
        gameRound = GameRound.objects.create_game_round()
        gameRound.save() # TODO: Exception handling for duplicate row
        gameRound.add_locations()
        gameRound = GameRound.objects.get(id=gameRound.id)
    return JsonResponse({'gameRound': GameRoundSerializer(gameRound).data})

def guess(request):
    guessedCode = request.GET.get('c')
    guessCount = int(request.GET.get('n'))
    gameRound = GameRound.objects.filter(date=datetime.date(datetime.now())).first()
    if gameRound is None:
        return HttpResponseNotFound()
    if guessedCode == gameRound.answer or guessCount >= MAX_GUESSES-1:
        # TODO: Include global stats as well
        return JsonResponse({'isDone':True, 'guess':{'locationCode': guessedCode, 'distance': 0}, 'gameRound': FullGameRoundSerializer(gameRound).data})
    else:
        return JsonResponse({'guess':{'locationCode': guessedCode, 'distance': gameRound.distance_to_answer(guessedCode)}})

def get_sat_image(request):
    guessCount = int(request.GET.get('n'))
    show_labels = request.GET.get('l')

    gameRound = GameRound.objects.filter(date=datetime.date(datetime.now())).first()
    if gameRound is None:
        return HttpResponseNotFound()
    return HttpResponse(getSatImage(gameRound.locations.all()[guessCount].lat, gameRound.locations.all()[guessCount].long, show_labels=show_labels), content_type='image/jpeg')