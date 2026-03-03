import os
from typing import Any

from dotenv import load_dotenv
from supabase import Client, create_client

load_dotenv()

_supabase_client: Client | None = None


def get_supabase_client() -> Client:
    global _supabase_client

    # Reutiliza el cliente para evitar recrearlo en cada request.
    if _supabase_client is not None:
        return _supabase_client

    url = os.environ.get("SUPABASE_URL", "")
    # En backend se recomienda usar la service role key para operaciones con RLS.
    key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY") or os.environ.get("SUPABASE_KEY", "")
    if not url or not key:
        raise RuntimeError(
            "SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY (o SUPABASE_KEY) deben estar configuradas en .env"
        )

    _supabase_client = create_client(url, key)
    return _supabase_client


def insert_support_ticket(payload: dict[str, Any], table_name: str | None = None):
    # Inserta un ticket de soporte desde el formulario web.
    table = table_name or os.environ.get("SUPABASE_SUPPORT_TABLE", "soporte")
    client = get_supabase_client()
    return client.table(table).insert(payload).execute()


def list_support_tickets(
    *,
    only_game_issues: bool = False,
    limit: int = 100,
    table_name: str | None = None,
):
    # Lista tickets ordenados por fecha; opcionalmente filtra solo incidencias de juego.
    table = table_name or os.environ.get("SUPABASE_SUPPORT_TABLE", "soporte")
    client = get_supabase_client()
    query = client.table(table).select("*").order("created_at", desc=True).limit(limit)
    if only_game_issues:
        query = query.eq("tipo", "juego")
    return query.execute()


def update_support_ticket_status(
    ticket_id: int,
    estado: str,
    *,
    only_game_issues: bool = False,
    table_name: str | None = None,
):
    # Actualiza estado de ticket; en modo dev solo permite tocar tickets de tipo juego.
    table = table_name or os.environ.get("SUPABASE_SUPPORT_TABLE", "soporte")
    client = get_supabase_client()
    query = client.table(table).update({"estado": estado}).eq("id", ticket_id)
    if only_game_issues:
        query = query.eq("tipo", "juego")
    return query.execute()
