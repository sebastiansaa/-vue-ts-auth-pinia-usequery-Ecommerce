# Orders

## Propósito
Mostrar el historial real de órdenes del usuario autenticado desde el backend.

## Responsabilidades
- Consultar órdenes vía `/orders` y exponer estados de carga/error.
- Mostrar lista de órdenes y estados con formato legible.
- Gestionar mensaje temporal de éxito post-compra.

## Estructura
- composables/: `useOrders` (Vue Query) para obtener órdenes.
- stores/: `ordersStore` maneja bandera de éxito en UI.
- helpers/: `formatters.ts` para fecha y etiquetas de estado.
- views/: `OrdersListView` renderiza el historial.
- components/: `OrdersList`, `OrderCard`.

## Notas
- Requiere auth (JWT) para acceder a `/orders`; backend es la única fuente de verdad.

## Resumen operativo
- Propósito: mostrar historial real de órdenes del usuario.
- Endpoints usados: `GET /orders`, `GET /orders/:id` (y acciones opcionales cancel/pay/complete si se habilitan en UI).
- Roles requeridos: usuario autenticado.
- Estados posibles: loading, error, lista vacía, órdenes con estados `pending|paid|completed|cancelled`.
