# Admin

## Propósito
Panel administrativo para gestionar catálogos y operaciones clave (categorías, inventario, órdenes) consumiendo endpoints protegidos.

## Responsabilidades
- Proteger rutas admin y verificar permisos antes de ejecutar acciones.
- Consumir API admin para listar/editar categorías, inventario, órdenes y usuarios (prefijo `/admin/*`).
- Exponer composables y servicios con Vue Query/axios para datos y mutaciones.
- Renderizar paneles y formularios de administración reutilizables.
- Invalidar caches y mostrar feedback en operaciones (toast, loading states).

## Estructura
- api/: `adminApi` con endpoints protegidos.
- services/: wrappers y mapeos (`adminOrdersService`, `adminInventoryService`, etc.).
- composables/: hooks de datos/acciones (p.ej. `useAdminOrderActions`, `useAdminInventoryPanel`).
- components/: paneles y formularios (categorías, inventario, badges, guard).
- guards/ helpers/: validación de rol admin; permissions utilities.
- stores/: estado de selección y UI admin.
- views/: dashboard/layout admin.

## Notas
- Requiere sesión con rol admin; comparte axiosAdapter y guardas con el dominio auth.
- Endpoints deben usar el prefijo `/admin`: usuarios (`/admin/users`, `/admin/users/:id/status`), productos (`/admin/products`), inventario (`/admin/inventory`, `/admin/inventory/:productId/adjust`), órdenes (`/admin/orders`, acciones `/admin/orders/:id/cancel|ship|complete`), pagos (`/admin/payments`), categorías (`/admin/categories`).

## Resumen operativo
- Propósito: gestionar recursos críticos (usuarios, productos, inventario, órdenes, pagos, categorías).
- Endpoints usados: `/admin/users`, `/admin/products`, `/admin/orders`, `/admin/payments`, `/admin/inventory`, `/admin/categories`.
- Roles requeridos: admin (JWT + RolesGuard).
- Estados posibles: loading/error por recurso; entidades con estados propios (usuarios ACTIVE/SUSPENDED/DELETED; órdenes pending/paid/completed/cancelled; pagos pending/succeeded/failed).
- Estados de usuario: `ACTIVE | SUSPENDED | DELETED`.
