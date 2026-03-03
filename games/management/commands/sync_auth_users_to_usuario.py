from django.contrib.auth.models import User
from django.core.management.base import BaseCommand

from games.models import Usuario


class Command(BaseCommand):
    help = "Sincroniza auth_user hacia la tabla usuario."

    def handle(self, *args, **options):
        total = 0

        for user in User.objects.all().iterator():
            Usuario.objects.update_or_create(
                id_usuario=user.id,
                defaults={
                    "nombre": user.username,
                    "email": user.email,
                    "fecha_registro": user.date_joined.date(),
                    "es_superusuario": user.is_superuser,
                },
            )
            total += 1

        self.stdout.write(
            self.style.SUCCESS(f"Sincronizacion completada. Usuarios procesados: {total}")
        )

