from django.db import OperationalError, ProgrammingError

ROLE_ADMIN = "admin"
ROLE_DESARROLLADOR = "desarrollador"
ROLE_JUGADOR = "jugador"


def get_user_role(user):
    if not user or not user.is_authenticated:
        return None

    if user.is_superuser:
        return ROLE_ADMIN

    try:
        from .models import Usuario

        row = (
            Usuario.objects.filter(id_usuario=user.id)
            .values("rol", "desarrollador", "es_superusuario")
            .first()
        )
        if row and (row.get("es_superusuario") or row.get("rol") == ROLE_ADMIN):
            return ROLE_ADMIN
        if row and (row.get("desarrollador") or row.get("rol") == ROLE_DESARROLLADOR):
            return ROLE_DESARROLLADOR
        if row and row.get("rol") == ROLE_JUGADOR:
            return ROLE_JUGADOR
    except (ProgrammingError, OperationalError):
        pass

    group_names = set(user.groups.values_list("name", flat=True))
    if ROLE_ADMIN in group_names:
        return ROLE_ADMIN
    if ROLE_DESARROLLADOR in group_names:
        return ROLE_DESARROLLADOR
    if ROLE_JUGADOR in group_names:
        return ROLE_JUGADOR

    return ROLE_JUGADOR


def is_admin(user):
    role = get_user_role(user)
    return bool(user and user.is_authenticated and (user.is_superuser or role == ROLE_ADMIN))


def is_desarrollador(user):
    role = get_user_role(user)
    return bool(
        user
        and user.is_authenticated
        and (user.is_superuser or role in (ROLE_ADMIN, ROLE_DESARROLLADOR))
    )


def is_jugador(user):
    role = get_user_role(user)
    return bool(
        user
        and user.is_authenticated
        and (user.is_superuser or role in (ROLE_ADMIN, ROLE_DESARROLLADOR, ROLE_JUGADOR))
    )
