from django.urls import path, re_path
from rest_framework.schemas import get_schema_view
from .views import GameRoundResultsAPIView, GameRoundRetrieveAPIView, GuessCreateAPIView, GetSatImageView
from . import views
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

schema_view = get_schema_view(
   openapi.Info(
      title="Geodle API",
      default_version='v1',
   ),
   public=False,
)

urlpatterns = [
    re_path(r'^swagger(?P<format>\.json|\.yaml)$', schema_view.without_ui(cache_timeout=0), name='schema-json'),
    re_path(r'^swagger/$', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    re_path(r'^redoc/$', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
    path('gameround/', GameRoundRetrieveAPIView.as_view(), name='gameround'),
    path('guess/', GuessCreateAPIView.as_view(), name='guess'),
    path('fetchimage/',GetSatImageView.as_view(),name='get_sat_image'),
    path('results/',GameRoundResultsAPIView.as_view(),name='get_round_results'),
]