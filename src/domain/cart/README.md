# Cart

## Propósito
Gestiona el carrito de compras: items, totales y sincronización con backend/local según sesión.

## Responsabilidades
- Añadir, actualizar y eliminar items del carrito.
- Calcular total y conteo de items en tiempo real.
- Persistir carrito local para usuarios no autenticados; sincronizar con API cuando hay sesión.
- Mantener cache de productos para hidratar precios/detalles.
- Exponer estado de carga para operaciones de carrito.

## Estructura
- stores/: `cartStore` (Pinia) con lógica de carrito y sincronización.
- services/: llamadas a API (`addItemToCart`, `getCart`, etc.).
- helpers/: adaptadores de almacenamiento local y utilidades.
- interface/: contratos y tipos de carrito.
- components/: UI específica (ej. MiniCart).

## Notas
- Requiere auth para operar contra API; en invitados usa snapshot local con hydration de productos.

## Resumen operativo
- Propósito: gestionar carrito, totales y sincronización.
- Endpoints usados: `GET /cart`, `POST /cart/items`, `PUT /cart/items/:productId`, `DELETE /cart/items/:productId`, `DELETE /cart`.
- Roles requeridos: usuario autenticado para API; invitados usan storage local.
- Estados posibles: loading/sync, error, carrito vacío/lleno.
