# Account

## Propósito
Gestionar el perfil del usuario autenticado (datos personales, preferencias y direcciones) consumiendo los endpoints `/users/me` del backend.

## Responsabilidades
- Obtener y mapear el perfil completo (`/users/me`) con direcciones, estado y preferencias.
- Actualizar perfil (`PATCH /users/me`) y direcciones (`POST/PATCH/DELETE /users/me/addresses`).
- Exponer servicios reutilizables para UI/composables sin duplicar lógica de mapeo.
- Compartir tipos (`UserProfile`, `UserAddress`, `UserStatus`) con otros dominios como auth.

## Estructura
- api/: llamadas HTTP con axiosAdapter (`accountApi`).
- interfaces/: tipos de perfil/direcciones y payloads de update.
- services/: funciones de dominio que normalizan/mapean respuestas.
- composables/: hooks Vue Query (`useAccountProfile`, mutaciones de direcciones/perfil).

## Lo que podría faltar
- Configuraciones de cuenta: cambiar contraseña, preferencias de notificación, idioma.
- Integración con Auth: refresco de sesión y estado (roles, status).
- Estados de usuario: ACTIVE / SUSPENDED / DELETED → mostrar badges o restricciones en la UI.
- Seguridad básica: cerrar sesión, gestionar tokens.

## Resumen operativo
- Propósito: gestionar perfil y direcciones del usuario autenticado.
- Endpoints usados: `GET/PATCH /users/me`, `POST/PATCH/DELETE /users/me/addresses`.
- Roles requeridos: usuario autenticado.
- Estados posibles: loading, error, perfil cargado; usuario con status ACTIVE/SUSPENDED/DELETED.
