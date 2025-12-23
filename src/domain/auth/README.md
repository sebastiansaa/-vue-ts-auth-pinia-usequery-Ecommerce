# Auth

## Propósito
Gestionar autenticación del usuario (login/registro) y proveer estado/guardas para el resto de dominios.

## Responsabilidades
- Autenticar usuarios contra API (login/register) y manejar tokens/session.
- Exponer estado de usuario y helpers de autorización a otros dominios.
- Proteger rutas con guardas (`authGuard`, `adminGuard`) y helper `requireAuth`.
- Interceptar solicitudes HTTP para adjuntar credenciales y manejar expiración.
- Sincronizar perfil desde `/users/me` (usando `roles` de auth + perfil/account para UI).
- Validar y tipar payloads con esquemas.

## Estructura
- services/: llamadas a API de auth y manejo de tokens.
- stores/: estado de sesión y usuario (Pinia).
- guards/: `authGuard`, `adminGuard` para navegación.
- interceptors/: configuración axios para auth headers y refresh.
- composables/: helpers de UI/estado (login/register flows).
- schemas/ interfaces/: validaciones y tipos de payloads.
- views/ components/: pantallas y formularios de auth.

## Notas
- Requiere backend de auth JWT; guardas se usan por dominios como admin, orders y checkout.
- El perfil enriquecido (direcciones, estado) se obtiene desde el dominio account usando `/users/me`.

## Resumen operativo
- Propósito: autenticar usuarios y exponer identidad/roles.
- Endpoints usados: `POST /auth/login`, `POST /auth/register`, `POST /auth/refresh`, `POST /auth/logout`, `GET /auth/me`.
- Roles requeridos: ninguno para login/registro; admin para rutas protegidas según RolesGuard.
- Estados posibles: autenticado/no autenticado, token expirado/refresh, usuario con roles y status.
