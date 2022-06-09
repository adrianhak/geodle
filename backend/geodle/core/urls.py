from django.urls import path
from . import views

urlpatterns = [
    path('play/', views.play, name='play'),
    path('guess/', views.guess, name='guess'),
    path('fetchimage/',views.get_sat_image,name='get_sat_image')
]