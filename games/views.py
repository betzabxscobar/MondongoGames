import json
import mimetypes
import os
import re
import unicodedata
from datetime import date
from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib import messages
from django.contrib.auth.decorators import login_required, user_passes_test
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from django.http import JsonResponse
from django.contrib.auth.forms import UserChangeForm
from .forms import EditProfileForm, ProfileForm
from .models import Juego, Partida, Profile, Usuario, FriendRequest, Friendship, DirectMessage
from .roles import ROLE_ADMIN, ROLE_DESARROLLADOR, ROLE_JUGADOR, get_user_role, is_admin, is_desarrollador, is_jugador
from django.db.models import Sum, Count
from django.utils import timezone
from django.views.decorators.http import require_http_methods
from django.db.models import Q
from django.contrib.auth import get_user_model
from django.conf import settings
from django.db import connection
from django.db.models import Avg, Count
from supabase_cliente import (
    get_public_storage_url,
    insert_support_ticket,
    list_support_tickets,
    upload_profile_avatar,
    upload_support_screenshot,
    update_support_ticket_status,
)
User = get_user_model()


def _support_games_options() -> list[str]:
    # Opciones de juegos para Soporte.
    # Se leen desde BD para no editar el HTML cada vez que se agrega un juego.
    return list(Juego.objects.order_by("titulo").values_list("titulo", flat=True))


def _insert_support_ticket_via_db(payload: dict) -> None:
    # Fallback cuando Supabase REST bloquea por RLS: inserta directo por SQL.
    table = os.getenv("SUPABASE_SUPPORT_TABLE", "soporte")
    if not re.fullmatch(r"[A-Za-z_][A-Za-z0-9_]*", table):
        raise ValueError("Nombre de tabla de soporte invalido")

    sql = (
        f"INSERT INTO {table} "
        "(user_id, username, email, tipo, game, motivo, screenshot_name, estado, created_at) "
        "VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)"
    )
    values = (
        payload.get("user_id"),
        payload.get("username"),
        payload.get("email"),
        payload.get("tipo"),
        payload.get("game"),
        payload.get("motivo"),
        payload.get("screenshot_name"),
        payload.get("estado"),
        payload.get("created_at"),
    )
    with connection.cursor() as cursor:
        cursor.execute(sql, values)


def _list_support_tickets_via_db(*, only_game_issues: bool = False, limit: int = 200) -> list[dict]:
    table = os.getenv("SUPABASE_SUPPORT_TABLE", "soporte")
    if not re.fullmatch(r"[A-Za-z_][A-Za-z0-9_]*", table):
        raise ValueError("Nombre de tabla de soporte invalido")

    where_sql = "WHERE tipo = %s" if only_game_issues else ""
    params = ["juego"] if only_game_issues else []
    params.append(int(limit))
    sql = (
        f"SELECT id, created_at, user_id, username, email, tipo, game, motivo, screenshot_name, estado "
        f"FROM {table} {where_sql} ORDER BY created_at DESC LIMIT %s"
    )
    with connection.cursor() as cursor:
        cursor.execute(sql, params)
        cols = [c[0] for c in cursor.description]
        return [dict(zip(cols, row)) for row in cursor.fetchall()]


def _update_support_ticket_status_via_db(
    ticket_id: int, estado: str, *, only_game_issues: bool = False
) -> int:
    table = os.getenv("SUPABASE_SUPPORT_TABLE", "soporte")
    if not re.fullmatch(r"[A-Za-z_][A-Za-z0-9_]*", table):
        raise ValueError("Nombre de tabla de soporte invalido")

    extra = " AND tipo = %s" if only_game_issues else ""
    params = [estado, int(ticket_id)]
    if only_game_issues:
        params.append("juego")
    sql = f"UPDATE {table} SET estado = %s WHERE id = %s{extra}"
    with connection.cursor() as cursor:
        cursor.execute(sql, params)
        return cursor.rowcount


# LOGIN
def login_view(request):
    if request.user.is_authenticated:
        return redirect("dashboard")


    if request.method == "POST":
        username_or_email = request.POST.get("username")
        password = request.POST.get("password")

        # Permitir login con email
        if "@" in username_or_email:
            try:
                user_obj = User.objects.get(email=username_or_email)
                username = user_obj.username
            except User.DoesNotExist:
                messages.error(request, "Usuario no encontrado")
                return redirect("login")
        else:
            username = username_or_email

        user = authenticate(request, username=username, password=password)

        if user is not None:
            login(request, user)
            return redirect("dashboard")
        else:
            messages.error(request, "Credenciales incorrectas")

    return render(request, "games/login.html")


# REGISTER
def register_view(request):

    if request.method == "POST":
        username = request.POST.get("username")
        email = request.POST.get("email")
        password1 = request.POST.get("password1")
        password2 = request.POST.get("password2")

        if password1 != password2:
            messages.error(request, "Las contraseÃ±as no coinciden")
            return redirect("register")

        try:
            validate_password(password1)
        except ValidationError as e:
            for error in e.messages:
                messages.error(request, error)
            return redirect("register")

        if User.objects.filter(username=username).exists():
            messages.error(request, "El usuario ya existe")
            return redirect("register")

        if User.objects.filter(email=email).exists():
            messages.error(request, "El correo ya estÃ¡ registrado")
            return redirect("register")

        user = User.objects.create_user(
            username=username,
            email=email,
            password=password1
        )

        login(request, user)
        return redirect("home")

    return render(request, "games/register.html")

@login_required
@user_passes_test(is_jugador)
def dashboard_user(request):
    def normalizar_categoria(valor):
        txt = str(valor or "").strip().lower()
        txt = unicodedata.normalize("NFD", txt)
        return "".join(ch for ch in txt if unicodedata.category(ch) != "Mn")

    # Mapa rapido para cards del dashboard (imagen por titulo).
    # Aqui tambien se mapean los juegos externos agregados por ZIP.
    imagenes_por_titulo = {
        "space invaders": "games/img/game1.png",
        "wall blood": "games/img/game2.png",
        "regular show: fist punch": "games/img/game3.png",
        "regular show: battle of the behemoths": "games/img/game3.png",
        "sky streaker": "games/img/game1.png",
        "escaping the prison": "games/img/game2.png",
        "extreme pamplona": "games/img/game3.png",
        "agent p: rebel spy": "games/img/game3.png",
    }
    # Categoria forzada para titulos externos o legacy.
    categoria_por_titulo = {
        "space invaders": "Aventura",
        "wall blood": "Accion",
        "regular show: fist punch": "Arcade",
        "regular show: battle of the behemoths": "Arcade",
        "sky streaker": "Arcade",
        "escaping the prison": "Arcade",
        "extreme pamplona": "Arcade",
        "agent p: rebel spy": "Arcade",
    }

    juegos = []
    for juego_db in Juego.objects.only("titulo", "genero").order_by("id_juego"):
        titulo = juego_db.titulo
        juegos.append(
            {
                "nombre": titulo,
                "categoria": categoria_por_titulo.get(titulo.lower(), juego_db.genero),
                "imagen": imagenes_por_titulo.get(titulo.lower(), "games/img/game1.png"),
            }
        )

    # Fallback: mostrar juegos externos aunque aun no exista el registro en BD.
    fallback_titles = [
        "Regular Show: Fist Punch",
        "Regular Show: Battle of the Behemoths",
        "Sky Streaker",
        "Escaping the Prison",
        "Extreme Pamplona",
        "Agent P: Rebel Spy",
    ]
    for title in fallback_titles:
        if any(j["nombre"].lower() == title.lower() for j in juegos):
            continue
        juegos.append(
            {
                "nombre": title,
                "categoria": categoria_por_titulo[title.lower()],
                "imagen": imagenes_por_titulo[title.lower()],
            }
        )

    # FILTRO BUSCADOR
    q = request.GET.get("q")
    if q:
        juegos = [j for j in juegos if q.lower() in j["nombre"].lower()]

    # FILTRO CATEGORIA
    categoria = request.GET.get("categoria")
    if categoria:
        categoria_norm = normalizar_categoria(categoria)
        juegos = [
            j for j in juegos
            if normalizar_categoria(j["categoria"]) == categoria_norm
        ]

    return render(request, "games/dashboard.html", {"juegos": juegos})
# LOGOUT
def logout_view(request):
    logout(request)
    return redirect("login")

def home_redirect(request):
    return redirect("dashboard")


@login_required
def home_view(request):
    return render(request, 'games/home.html')

@login_required
@user_passes_test(is_jugador)
def juego(request, nombre):
    juego_db = Juego.objects.filter(titulo__iexact=nombre).first()
    return render(
        request,
        "games/juego.html",
        {
            "nombre": nombre,
            "juego_id": juego_db.id_juego if juego_db else None,
            # En vista de juego se desactiva UI en tiempo real para liberar CPU.
            "disable_realtime_ui": True,
        },
    )

@login_required
@user_passes_test(is_jugador)
def catalogo(request):
    return render(request, "games/catalogo.html")

@login_required
@user_passes_test(is_jugador)
def mis_juegos(request):
    return render(request, "games/mis_juegos.html")

@login_required
def edit_profile(request):
    profile, created = Profile.objects.get_or_create(user=request.user)

    if request.method == "POST":
        user_form = EditProfileForm(request.POST, instance=request.user)
        profile_form = ProfileForm(
            request.POST,
            request.FILES,
            instance=profile
        )

        if user_form.is_valid() and profile_form.is_valid():
            user_form.save()
            avatar = request.FILES.get("avatar")
            if avatar:
                # Validaciones basicas del avatar antes de subirlo a Storage.
                max_size = 3 * 1024 * 1024
                if avatar.size > max_size:
                    messages.error(request, "El avatar excede el limite de 3MB.", extra_tags="profile")
                    return render(request, "games/edit_profile.html", {
                        "user_form": user_form,
                        "profile_form": profile_form
                    }, status=400)

                allowed_types = {"image/jpeg", "image/png", "image/webp", "image/gif"}
                detected_type = (avatar.content_type or "").lower().strip()
                if detected_type not in allowed_types:
                    guessed, _ = mimetypes.guess_type(avatar.name or "")
                    detected_type = (guessed or "").lower()
                    if detected_type not in allowed_types:
                        messages.error(
                            request,
                            "Formato de avatar no valido. Usa JPG, PNG, WEBP o GIF.",
                            extra_tags="profile",
                        )
                        return render(request, "games/edit_profile.html", {
                            "user_form": user_form,
                            "profile_form": profile_form
                        }, status=400)

                try:
                    avatar_bytes = avatar.read()
                    avatar_path, _ = upload_profile_avatar(
                        user_id=request.user.id,
                        original_name=avatar.name or "avatar.bin",
                        content=avatar_bytes,
                        content_type=detected_type,
                    )
                    # En DB guardamos path (profiles/...) en lugar de URL completa.
                    profile.avatar = avatar_path
                    profile.save(update_fields=["avatar"])
                except Exception as exc:
                    messages.error(
                        request,
                        f"No se pudo subir el avatar a Supabase Storage: {exc}",
                        extra_tags="profile",
                    )
                    return render(request, "games/edit_profile.html", {
                        "user_form": user_form,
                        "profile_form": profile_form
                    }, status=502)
            else:
                profile_form.save()
            return redirect("dashboard")
    else:
        user_form = EditProfileForm(instance=request.user)
        profile_form = ProfileForm(instance=profile)

    return render(request, "games/edit_profile.html", {
        "user_form": user_form,
        "profile_form": profile_form
    })

@login_required
def soporte(request):
    # Flag para mostrar mensaje visual de envio exitoso en la plantilla.
    # support_games alimenta el select dinamico de juegos en soporte.html.
    context = {"support_saved": False, "support_games": _support_games_options()}

    if request.method == "POST":
        # Mensajes de este modulo van con tag "support" para no mezclarlos.
        tipo = (request.POST.get("tipo") or "").strip().lower()
        motivo = (request.POST.get("motivo") or "").strip()
        juego = (request.POST.get("game") or "").strip()
        screenshot = request.FILES.get("screenshot")

        if tipo not in {"juego", "plataforma"}:
            messages.error(request, "Selecciona un tipo de problema valido.", extra_tags="support")
            return render(request, "games/soporte.html", context, status=400)

        if len(motivo) < 10:
            messages.error(request, "Describe el problema con al menos 10 caracteres.", extra_tags="support")
            return render(request, "games/soporte.html", context, status=400)

        if tipo == "juego" and not juego:
            messages.error(request, "Debes indicar en que juego ocurrio el problema.", extra_tags="support")
            return render(request, "games/soporte.html", context, status=400)

        screenshot_url = None
        if screenshot:
            # La captura tambien se valida y sube a Supabase Storage.
            max_size = 5 * 1024 * 1024
            if screenshot.size > max_size:
                messages.error(request, "La captura excede el limite de 5MB.", extra_tags="support")
                return render(request, "games/soporte.html", context, status=400)

            allowed_types = {"image/jpeg", "image/png", "image/webp", "image/gif"}
            detected_type = (screenshot.content_type or "").lower().strip()
            if detected_type not in allowed_types:
                guessed, _ = mimetypes.guess_type(screenshot.name or "")
                detected_type = (guessed or "").lower()
                if detected_type not in allowed_types:
                    messages.error(
                        request,
                        "Formato de captura no valido. Usa JPG, PNG, WEBP o GIF.",
                        extra_tags="support",
                    )
                    return render(request, "games/soporte.html", context, status=400)

            try:
                screenshot_bytes = screenshot.read()
                _, screenshot_url = upload_support_screenshot(
                    user_id=request.user.id,
                    original_name=screenshot.name or "screenshot.bin",
                    content=screenshot_bytes,
                    content_type=detected_type,
                )
            except Exception:
                messages.error(request, "No se pudo subir la captura a Supabase Storage.", extra_tags="support")
                return render(request, "games/soporte.html", context, status=502)

        payload = {
            "user_id": request.user.id,
            "username": request.user.username,
            "email": request.user.email,
            "tipo": tipo,
            "game": juego if tipo == "juego" else None,
            "motivo": motivo,
            "screenshot_name": screenshot_url,
            "estado": "pendiente",
            "created_at": timezone.now().isoformat(),
        }

        try:
            # Persistencia del ticket en Supabase (tabla soporte por defecto).
            insert_support_ticket(payload)
        except Exception as exc:
            err_text = str(exc).lower()
            if "row-level security policy" in err_text:
                try:
                    _insert_support_ticket_via_db(payload)
                    messages.success(request, "Tu reporte fue enviado correctamente.", extra_tags="support")
                    context["support_saved"] = True
                    return render(request, "games/soporte.html", context)
                except Exception:
                    messages.error(
                        request,
                        "No se pudo enviar el reporte: la clave de Supabase no tiene permisos de escritura (RLS).",
                        extra_tags="support",
                    )
            else:
                messages.error(request, "No se pudo enviar el reporte a soporte.", extra_tags="support")
            return render(request, "games/soporte.html", context, status=502)

        messages.success(request, "Tu reporte fue enviado correctamente.", extra_tags="support")
        context["support_saved"] = True

    return render(request, "games/soporte.html", context)

@login_required
def registrar_partida(request):
    if request.method != "POST":
        return JsonResponse({"ok": False, "error": "Metodo no permitido"}, status=405)

    try:
        data = json.loads(request.body.decode("utf-8"))
    except (json.JSONDecodeError, UnicodeDecodeError):
        return JsonResponse({"ok": False, "error": "JSON invalido"}, status=400)

    juego_id = data.get("id_juego")
    score = data.get("score", 0)
    tiempo_juego = data.get("tiempo_juego", 0)

    if not juego_id:
        return JsonResponse({"ok": False, "error": "id_juego es requerido"}, status=400)

    try:
        juego = Juego.objects.get(pk=int(juego_id))
    except (ValueError, TypeError, Juego.DoesNotExist):
        return JsonResponse({"ok": False, "error": "Juego no encontrado"}, status=404)

    usuario, _ = Usuario.objects.get_or_create(
        id_usuario=request.user.id,
        defaults={
            "nombre": request.user.username,
            "email": request.user.email,
            "fecha_registro": request.user.date_joined.date(),
            "es_superusuario": request.user.is_superuser,
        },
    )

    try:
        score_int = max(0, int(score))
        tiempo_int = max(0, int(tiempo_juego))
    except (ValueError, TypeError):
        return JsonResponse({"ok": False, "error": "score/tiempo_juego invalidos"}, status=400)

    partida = Partida.objects.create(
        id_usuario_id=usuario.id_usuario,
        id_juego_id=juego.id_juego,
        tiempo_juego=tiempo_int,
        score=score_int,
        fecha_partida=date.today(),
    )

    return JsonResponse({"ok": True, "id_partida": partida.id_partida})

@login_required
def dashboard_router(request):
    role = get_user_role(request.user)

    if request.user.is_superuser or role == ROLE_ADMIN:
        return redirect("dashboard_admin")
    if role == ROLE_DESARROLLADOR:
        return redirect("dashboard_dev")
    return redirect("dashboard_user")

@login_required
@user_passes_test(is_admin)
def dashboard_admin(request):
    # Contadores
    total_users = User.objects.count()
    total_admins = User.objects.filter(is_superuser=True).count()

    total_games = Juego.objects.count()
    total_partidas = Partida.objects.count()

    # Ãšltimas partidas (10) -> con FK listas (usuario y juego)
    ultimas_partidas = (
        Partida.objects
        .select_related("id_usuario", "id_juego")
        .order_by("-id_partida")[:10]
    )

    # Top jugadores por score acumulado
    top_jugadores = (
        Partida.objects
        .values("id_usuario", "id_usuario__nombre")  # trae nombre desde Usuario
        .annotate(total_score=Sum("score"), partidas=Count("id_partida"))
        .order_by("-total_score")[:5]
    )

    context = {
        "total_users": total_users,
        "total_admins": total_admins,
        "total_games": total_games,
        "total_partidas": total_partidas,
        "ultimas_partidas": ultimas_partidas,
        "top_jugadores": top_jugadores,
    }
    return render(request, "games/dashboard_admin.html", context)
@login_required
@user_passes_test(is_desarrollador)
def dashboard_dev(request):
    hoy = timezone.localdate()

    # Métricas “hoy”
    partidas_hoy = Partida.objects.filter(fecha_partida=hoy)
    partidas_hoy_count = partidas_hoy.count()

    usuarios_activos_hoy = (
        partidas_hoy.values("id_usuario_id").distinct().count()
    )

    score_promedio_hoy = partidas_hoy.aggregate(avg=Avg("score"))["avg"] or 0
    score_promedio_global = Partida.objects.aggregate(avg=Avg("score"))["avg"] or 0

    # Juego más jugado (hoy y global)
    juego_top_hoy = (
        partidas_hoy.values("id_juego__titulo")
        .annotate(n=Count("id_partida"))
        .order_by("-n")
        .first()
    )
    juego_top_global = (
        Partida.objects.values("id_juego__titulo")
        .annotate(n=Count("id_partida"))
        .order_by("-n")
        .first()
    )

    # Actividad reciente
    actividad = (
        Partida.objects
        .select_related("id_usuario", "id_juego")
        .order_by("-id_partida")[:15]
    )

    # Estado del sistema (solo info)
    system_info = {
        "server_time": timezone.now(),
        "debug": settings.DEBUG,
        "db_vendor": connection.vendor,
    }

    context = {
        "hoy": hoy,
        "partidas_hoy_count": partidas_hoy_count,
        "usuarios_activos_hoy": usuarios_activos_hoy,
        "score_promedio_hoy": round(float(score_promedio_hoy), 2),
        "score_promedio_global": round(float(score_promedio_global), 2),
        "juego_top_hoy": juego_top_hoy["id_juego__titulo"] if juego_top_hoy else "—",
        "juego_top_hoy_count": juego_top_hoy["n"] if juego_top_hoy else 0,
        "juego_top_global": juego_top_global["id_juego__titulo"] if juego_top_global else "—",
        "juego_top_global_count": juego_top_global["n"] if juego_top_global else 0,
        "actividad": actividad,
        "system_info": system_info,
    }
    return render(request, "games/dashboard_dev.html", context)

@login_required
@user_passes_test(is_admin)
def soporte_admin(request):
    # Estados habilitados para gestion operativa del ticket.
    allowed_status = {"pendiente", "en_proceso", "cerrado"}

    if request.method == "POST":
        ticket_id_raw = (request.POST.get("ticket_id") or "").strip()
        estado = (request.POST.get("estado") or "").strip().lower()

        if not ticket_id_raw.isdigit() or estado not in allowed_status:
            messages.error(request, "Datos invalidos para actualizar ticket.")
            return redirect("soporte_admin")

        try:
            # Admin puede actualizar cualquier ticket.
            resp = update_support_ticket_status(int(ticket_id_raw), estado)
            if resp.data:
                messages.success(request, "Estado de ticket actualizado.")
            else:
                # Algunas policies RLS responden [] en lugar de error.
                updated = _update_support_ticket_status_via_db(int(ticket_id_raw), estado)
                if updated:
                    messages.success(request, "Estado de ticket actualizado.")
                else:
                    messages.error(request, "Ticket no encontrado.")
        except Exception as exc:
            if "row-level security policy" in str(exc).lower():
                try:
                    updated = _update_support_ticket_status_via_db(int(ticket_id_raw), estado)
                    if updated:
                        messages.success(request, "Estado de ticket actualizado.")
                    else:
                        messages.error(request, "Ticket no encontrado.")
                except Exception:
                    messages.error(request, "No se pudo actualizar el ticket en soporte.")
            else:
                messages.error(request, "No se pudo actualizar el ticket en Supabase.")
        return redirect("soporte_admin")

    tickets = []
    try:
        # Admin visualiza todos los tickets de soporte.
        resp = list_support_tickets(limit=200)
        tickets = resp.data or []
        if not tickets:
            # Algunas policies RLS devuelven lista vacia sin lanzar excepcion.
            tickets = _list_support_tickets_via_db(limit=200)
    except Exception as exc:
        if "row-level security policy" in str(exc).lower():
            try:
                tickets = _list_support_tickets_via_db(limit=200)
            except Exception:
                messages.error(request, "No se pudieron cargar tickets de soporte.")
        else:
            messages.error(request, "No se pudieron cargar tickets de soporte.")

    return render(
        request,
        "games/soporte_admin.html",
        {"tickets": tickets, "allowed_status": sorted(allowed_status)},
    )


@login_required
@user_passes_test(is_desarrollador)
def soporte_dev(request):
    # Dev usa el mismo flujo de tickets que admin (juego y plataforma).
    allowed_status = {"pendiente", "en_proceso", "cerrado"}

    if request.method == "POST":
        ticket_id_raw = (request.POST.get("ticket_id") or "").strip()
        estado = (request.POST.get("estado") or "").strip().lower()

        if not ticket_id_raw.isdigit() or estado not in allowed_status:
            messages.error(request, "Datos invalidos para actualizar ticket.")
            return redirect("soporte_dev")

        try:
            resp = update_support_ticket_status(
                int(ticket_id_raw),
                estado,
            )
            if resp.data:
                messages.success(request, "Estado de ticket actualizado.")
            else:
                # Algunas policies RLS responden []: intentar fallback SQL.
                updated = _update_support_ticket_status_via_db(
                    int(ticket_id_raw),
                    estado,
                )
                if updated:
                    messages.success(request, "Estado de ticket actualizado.")
                else:
                    messages.error(request, "Ticket no encontrado.")
        except Exception as exc:
            if "row-level security policy" in str(exc).lower():
                try:
                    updated = _update_support_ticket_status_via_db(
                        int(ticket_id_raw),
                        estado,
                    )
                    if updated:
                        messages.success(request, "Estado de ticket actualizado.")
                    else:
                        messages.error(request, "Ticket no encontrado.")
                except Exception:
                    messages.error(request, "No se pudo actualizar el ticket en soporte.")
            else:
                messages.error(request, "No se pudo actualizar el ticket en Supabase.")
        return redirect("soporte_dev")

    tickets = []
    try:
        # Panel de desarrollo: mostrar todos los tickets de soporte.
        resp = list_support_tickets(limit=200)
        tickets = resp.data or []
        if not tickets:
            # Algunas policies RLS devuelven lista vacia sin excepcion.
            tickets = _list_support_tickets_via_db(limit=200)
    except Exception as exc:
        if "row-level security policy" in str(exc).lower():
            try:
                tickets = _list_support_tickets_via_db(limit=200)
            except Exception:
                messages.error(request, "No se pudieron cargar tickets de soporte.")
        else:
            messages.error(request, "No se pudieron cargar tickets de soporte.")

    return render(
        request,
        "games/soporte_dev.html",
        {"tickets": tickets, "allowed_status": sorted(allowed_status)},
    )

#Mensajes


@login_required
def api_friends_list(request):
    friend_ids = list(_friend_ids(request.user))
    friends = User.objects.filter(id__in=friend_ids).order_by("username")
    return JsonResponse({"ok": True, "friends": [_serialize_user(u) for u in friends]})

@login_required
def api_friend_requests(request):
    incoming = FriendRequest.objects.filter(to_user=request.user, status="pending").select_related("from_user").order_by("-created_at")
    outgoing = FriendRequest.objects.filter(from_user=request.user, status="pending").select_related("to_user").order_by("-created_at")

    return JsonResponse({
        "ok": True,
        "incoming": [{"id": fr.id, "from_user": _serialize_user(fr.from_user), "created_at": fr.created_at.isoformat()} for fr in incoming],
        "outgoing": [{"id": fr.id, "to_user": _serialize_user(fr.to_user), "created_at": fr.created_at.isoformat()} for fr in outgoing],
    })

@login_required
@require_http_methods(["POST"])
def api_friend_request_send(request):
    try:
        data = json.loads(request.body.decode("utf-8"))
    except Exception:
        data = {}

    query = (data.get("q") or "").strip()
    if not query:
        return JsonResponse({"ok": False, "error": "q requerido"}, status=400)

    to_user = User.objects.filter(email__iexact=query).first() if "@" in query else User.objects.filter(username__iexact=query).first()
    if not to_user:
        return JsonResponse({"ok": False, "error": "Usuario no encontrado"}, status=404)
    if to_user.id == request.user.id:
        return JsonResponse({"ok": False, "error": "No puedes agregarte a ti misma"}, status=400)
    if Friendship.are_friends(request.user, to_user):
        return JsonResponse({"ok": False, "error": "Ya son amigos"}, status=400)

    inverse = FriendRequest.objects.filter(from_user=to_user, to_user=request.user, status="pending").first()
    if inverse:
        inverse.status = "accepted"
        inverse.save(update_fields=["status"])
        u1, u2 = Friendship.normalize_pair(request.user, to_user)
        Friendship.objects.get_or_create(user1=u1, user2=u2)
        return JsonResponse({"ok": True, "auto_accepted": True})

    fr, _ = FriendRequest.objects.get_or_create(from_user=request.user, to_user=to_user, defaults={"status": "pending"})
    return JsonResponse({"ok": True, "request_id": fr.id})

@login_required
@require_http_methods(["POST"])
def api_friend_request_accept(request, request_id: int):
    fr = FriendRequest.objects.filter(id=request_id, to_user=request.user).select_related("from_user").first()
    if not fr or fr.status != "pending":
        return JsonResponse({"ok": False, "error": "Solicitud no vÃ¡lida"}, status=404)

    fr.status = "accepted"
    fr.save(update_fields=["status"])
    u1, u2 = Friendship.normalize_pair(request.user, fr.from_user)
    Friendship.objects.get_or_create(user1=u1, user2=u2)
    return JsonResponse({"ok": True})

@login_required
@require_http_methods(["POST"])
def api_friend_request_decline(request, request_id: int):
    fr = FriendRequest.objects.filter(id=request_id, to_user=request.user).first()
    if not fr or fr.status != "pending":
        return JsonResponse({"ok": False, "error": "Solicitud no vÃ¡lida"}, status=404)
    fr.status = "declined"
    fr.save(update_fields=["status"])
    return JsonResponse({"ok": True})



@login_required
def api_message_threads(request):
    friend_ids = list(_friend_ids(request.user))
    if not friend_ids:
        return JsonResponse({"ok": True, "threads": []})

    friends = list(User.objects.filter(id__in=friend_ids).only("id", "username", "email").order_by("username"))
    friends_by_id = {friend.id: friend for friend in friends}

    last_by_friend_id = {}
    last_messages = (
        DirectMessage.objects
        .filter(
            Q(sender=request.user, receiver_id__in=friend_ids)
            | Q(sender_id__in=friend_ids, receiver=request.user)
        )
        .values("sender_id", "receiver_id", "body", "created_at")
        .order_by("-created_at")
    )
    for row in last_messages:
        other_id = row["receiver_id"] if row["sender_id"] == request.user.id else row["sender_id"]
        if other_id in last_by_friend_id:
            continue
        last_by_friend_id[other_id] = {
            "body": row["body"],
            "created_at": row["created_at"].isoformat(),
            "from_me": row["sender_id"] == request.user.id,
        }

    threads = []
    for friend_id, friend in friends_by_id.items():
        threads.append({
            "user": _serialize_user(friend),
            "last_message": last_by_friend_id.get(friend_id),
        })

    # ordenar: chats con mensaje arriba
    threads.sort(
        key=lambda t: (t["last_message"]["created_at"] if t["last_message"] else ""),
        reverse=True,
    )
    return JsonResponse({"ok": True, "threads": threads})


@login_required
def api_message_thread_detail(request, user_id: int):
    other = User.objects.filter(id=user_id).first()
    if not other:
        return JsonResponse({"ok": False, "error": "Usuario no existe"}, status=404)

    if not Friendship.are_friends(request.user, other):
        return JsonResponse({"ok": False, "error": "No son amigos"}, status=403)

    msgs = (DirectMessage.objects
            .filter(Q(sender=request.user, receiver=other) | Q(sender=other, receiver=request.user))
            .order_by("created_at"))

    # Marcar como leÃ­do lo que te enviaron
    DirectMessage.objects.filter(sender=other, receiver=request.user, is_read=False).update(is_read=True)

    return JsonResponse({
        "ok": True,
        "other": _serialize_user(other),
        "messages": [
            {"id": m.id, "body": m.body, "created_at": m.created_at.isoformat(), "from_me": m.sender_id == request.user.id}
            for m in msgs
        ],
    })


@login_required
@require_http_methods(["POST"])
def api_message_send(request, user_id: int):
    other = User.objects.filter(id=user_id).first()
    if not other:
        return JsonResponse({"ok": False, "error": "Usuario no existe"}, status=404)

    if not Friendship.are_friends(request.user, other):
        return JsonResponse({"ok": False, "error": "No son amigos"}, status=403)

    data = json.loads(request.body.decode("utf-8")) if request.body else {}
    body = (data.get("body") or "").strip()
    if not body:
        return JsonResponse({"ok": False, "error": "Mensaje vacÃ­o"}, status=400)

    msg = DirectMessage.objects.create(sender=request.user, receiver=other, body=body)

    return JsonResponse({
        "ok": True,
        "message": {"id": msg.id, "body": msg.body, "created_at": msg.created_at.isoformat(), "from_me": True}
    })

#Helpers
def _avatar_url(user):
    # Convierte el valor guardado en avatar a una URL util para frontend.
    try:
        if hasattr(user, "profile") and user.profile.avatar:
            name = user.profile.avatar.name or ""
            if name.startswith("http://") or name.startswith("https://"):
                return name
            bucket = os.getenv("SUPABASE_STORAGE_BUCKET_AVATARS", "avatars")
            if name.startswith("profiles/"):
                # Nuevo formato: path interno en bucket de Supabase.
                return get_public_storage_url(bucket_name=bucket, object_path=name)
            # Formato legacy: archivo local en media/.
            return user.profile.avatar.url
    except Exception:
        pass
    return None

def _serialize_user(user):
    return {"id": user.id, "username": user.username, "email": user.email, "avatar": _avatar_url(user)}

def _friend_ids(me):
    pairs = Friendship.objects.filter(Q(user1=me) | Q(user2=me)).values_list("user1_id", "user2_id")
    ids = set()
    for a, b in pairs:
        ids.add(b if a == me.id else a)
    return ids


@login_required
def api_messages_unread_count(request):
    c = DirectMessage.objects.filter(receiver=request.user, is_read=False).count()
    return JsonResponse({"ok": True, "count": c})
