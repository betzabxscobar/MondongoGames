from pathlib import Path

from django.conf import settings
from django.core.management.base import BaseCommand

from supabase_cliente import get_supabase_client


class Command(BaseCommand):
    help = "Sube audios de UI desde static/games/sounds al bucket de Supabase Storage."

    def add_arguments(self, parser):
        parser.add_argument(
            "--bucket",
            default="ui-audio",
            help="Nombre del bucket de destino (default: ui-audio).",
        )
        parser.add_argument(
            "--prefix",
            default="ui",
            help="Prefijo/carpeta en el bucket (default: ui).",
        )
        parser.add_argument(
            "--upsert",
            action="store_true",
            help="Sobrescribe archivos existentes.",
        )

    def handle(self, *args, **options):
        bucket = options["bucket"]
        prefix = options["prefix"].strip("/")
        upsert = bool(options["upsert"])

        # Origen local de audios UI.
        sounds_dir = Path(settings.BASE_DIR) / "games" / "static" / "games" / "sounds"
        if not sounds_dir.exists():
            self.stderr.write(self.style.ERROR(f"No existe carpeta: {sounds_dir}"))
            return

        files = sorted(sounds_dir.glob("*.mp3"))
        if not files:
            self.stdout.write(self.style.WARNING("No se encontraron .mp3 para subir."))
            return

        client = get_supabase_client()
        storage = client.storage.from_(bucket)

        uploaded = 0
        for file_path in files:
            # Destino en bucket: <prefix>/<filename>.
            object_path = f"{prefix}/{file_path.name}"
            data = file_path.read_bytes()
            try:
                storage.upload(
                    object_path,
                    data,
                    file_options={"upsert": str(upsert).lower(), "content-type": "audio/mpeg"},
                )
                uploaded += 1
                self.stdout.write(f"OK {object_path}")
            except Exception as exc:
                self.stderr.write(self.style.ERROR(f"FAIL {object_path}: {exc}"))

        self.stdout.write(self.style.SUCCESS(f"Subidos: {uploaded}/{len(files)}"))
