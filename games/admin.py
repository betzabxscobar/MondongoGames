from django.contrib import admin
from .models import Juego, Partida, Profile, Usuario

admin.site.register(Profile)
admin.site.register(Usuario)
admin.site.register(Juego)
admin.site.register(Partida)