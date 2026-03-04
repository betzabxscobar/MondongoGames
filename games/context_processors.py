import os

from django.templatetags.static import static

from supabase_cliente import get_public_storage_url


def current_user_avatar(request):
    # Expone avatar listo para usar en todas las plantillas.
    avatar_url = None
    try:
        user = getattr(request, "user", None)
        if not user or not user.is_authenticated:
            return {"current_user_avatar_url": None}

        if hasattr(user, "profile") and user.profile.avatar:
            name = user.profile.avatar.name or ""
            if name.startswith("http://") or name.startswith("https://"):
                avatar_url = name
            elif name.startswith("profiles/"):
                # Si guardamos path de Storage, lo convertimos a URL publica.
                bucket = os.getenv("SUPABASE_STORAGE_BUCKET_AVATARS", "avatars")
                avatar_url = get_public_storage_url(bucket_name=bucket, object_path=name)
            else:
                # Compatibilidad con avatar legacy en media local.
                avatar_url = user.profile.avatar.url
    except Exception:
        avatar_url = None

    return {"current_user_avatar_url": avatar_url}


def ui_audio_urls(request):
    # URLs de audio para UI: intenta Storage y cae a static local si falla.
    bucket = os.getenv("SUPABASE_STORAGE_BUCKET_AUDIO", "ui-audio")
    files = {
        "click_editar_perfil": "click_editar_perfil.mp3",
        "click_cerrar_sesion": "click_cerrar_sesion.mp3",
        "hover_card": "hover_card.mp3",
        "bg_music": "bg-music.mp3",
        "dashboard_sonido": "dashboard_sonido.mp3",
        "login_bg": "login_bg.mp3",
        "mouse_pass": "mouse_pass.mp3",
        "register_bg": "register_bg.mp3",
    }

    urls = {}
    for key, filename in files.items():
        fallback = static(f"games/sounds/{filename}")
        try:
            urls[key] = get_public_storage_url(
                bucket_name=bucket,
                object_path=f"ui/{filename}",
            )
        except Exception:
            urls[key] = fallback

    return {"ui_audio": urls}
