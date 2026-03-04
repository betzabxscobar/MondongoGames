from __future__ import annotations

import os
import shutil
import zipfile
from datetime import date
from pathlib import Path

from django.conf import settings
from django.core.management.base import BaseCommand, CommandError

from games.models import Juego


def _win_long_path(path: Path) -> str:
    # En Windows evita fallos por rutas largas al extraer ZIPs grandes.
    raw = str(path)
    if os.name == "nt" and not raw.startswith("\\\\?\\"):
        return "\\\\?\\" + raw
    return raw


class Command(BaseCommand):
    help = "Importa un ZIP de juego externo a static y registra el juego en la tabla juego."

    def add_arguments(self, parser):
        parser.add_argument("--zip", dest="zip_path", required=True, help="Ruta al archivo .zip")
        parser.add_argument("--slug", required=True, help="Slug de destino (carpeta en external)")
        parser.add_argument("--title", required=True, help='Titulo del juego, ej: "Agent P: Rebel Spy"')
        parser.add_argument("--genre", default="Arcade", help="Genero para la tabla juego")
        parser.add_argument("--developer", default="External", help="Desarrollador para la tabla juego")
        parser.add_argument(
            "--release-date",
            default=str(date.today()),
            help="Fecha YYYY-MM-DD para la tabla juego",
        )
        parser.add_argument(
            "--entry",
            default="",
            help="Ruta interna de entrada (index.html o .swf) relativa al ZIP extraido",
        )

    def handle(self, *args, **options):
        # 1) Resolver ruta del ZIP.
        base_dir = Path(settings.BASE_DIR)
        zip_path = Path(options["zip_path"])
        if not zip_path.is_absolute():
            zip_path = base_dir / zip_path
        if not zip_path.exists():
            raise CommandError(f"No existe ZIP: {zip_path}")

        slug = options["slug"].strip().lower().replace(" ", "_")
        if not slug:
            raise CommandError("slug invalido")

        # 2) Limpiar destino previo y crear carpeta nueva.
        dest = base_dir / "games" / "static" / "games" / "external" / slug
        if dest.exists():
            shutil.rmtree(dest)
        dest.mkdir(parents=True, exist_ok=True)

        # Extraccion robusta para rutas largas en Windows.
        with zipfile.ZipFile(zip_path, "r") as zf:
            # 3) Extraer contenido con soporte de rutas largas.
            for info in zf.infolist():
                out = dest / info.filename
                out_win = Path(_win_long_path(out))
                if info.is_dir():
                    out_win.mkdir(parents=True, exist_ok=True)
                    continue
                out_win.parent.mkdir(parents=True, exist_ok=True)
                with zf.open(info, "r") as src, open(out_win, "wb") as dst:
                    dst.write(src.read())

            detected_entry = ""
            if options["entry"]:
                detected_entry = options["entry"].strip().replace("\\", "/")
            else:
                # 4) Detectar entry automaticamente (index.html o .swf).
                names = [n for n in zf.namelist() if not n.endswith("/")]
                html = [n for n in names if n.lower().endswith("index.html")]
                swf = [n for n in names if n.lower().endswith(".swf")]
                detected_entry = html[0] if html else (swf[0] if swf else "")

        try:
            release_date = date.fromisoformat(options["release_date"])
        except ValueError as exc:
            raise CommandError(f"release-date invalida: {exc}") from exc

        title = options["title"].strip()
        genre = options["genre"].strip() or "Arcade"
        developer = options["developer"].strip() or "External"

        _, created = Juego.objects.update_or_create(
            titulo=title,
            defaults={
                "genero": genre,
                "desarrollador": developer,
                "fecha_lanzamiento": release_date,
            },
        )

        self.stdout.write(self.style.SUCCESS(f"ZIP extraido en: {dest}"))
        self.stdout.write(self.style.SUCCESS(f"Juego {'creado' if created else 'actualizado'}: {title}"))

        if detected_entry:
            # 5) Imprimir snippet para integracion rapida en juego.html.
            static_entry = f"games/external/{slug}/{detected_entry}"
            self.stdout.write(f"Entry detectada: {detected_entry}")
            self.stdout.write("Snippet iframe sugerido para juego.html:")
            self.stdout.write(
                f"""<iframe src="{{% static '{static_entry}' %}}" title="{title}" """
                """style="width:100%;max-width:1200px;height:720px;border:0;display:block;margin:0 auto;background:#000;overflow:hidden;" """
                """scrolling="no" allowfullscreen></iframe>"""
            )
        else:
            self.stdout.write(self.style.WARNING("No se detecto index.html/.swf automaticamente. Usa --entry."))
