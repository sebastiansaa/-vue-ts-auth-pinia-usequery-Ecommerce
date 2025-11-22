# Orders Domain

Este dominio gestiona la visualización del historial de pedidos del usuario (simulado). Sigue los principios de **Clean Architecture** y **Encapsulamiento Estricto**.

## Estructura

- **stores/**: `ordersStore` maneja el estado de la UI (mensajes de éxito).
- **composables/**: `useOrders` maneja la obtención de datos con Vue Query.
- **helpers/**: Funciones puras para persistencia y formateo.
- **views/**: `OrdersListView` muestra la lista de pedidos.

## Composables

### `useOrders`

Encapsula la consulta de pedidos utilizando TanStack Vue Query.

- **Responsabilidad**:
  - Obtener la lista de pedidos desde el almacenamiento local (simulando una API).
  - Gestionar el estado de carga y error.
  - Manejar el temporizador para el mensaje de éxito post-compra.
- **API Pública (Readonly)**:
  - `orders`: Computed array (lista de pedidos).
  - `isLoading`: Computed boolean.
  - `isError`: Computed boolean.
  - `error`: Computed error object.
  - `refetch()`: Función para recargar datos manualmente.
  - `watchSuccess()`: Inicia el temporizador para ocultar el mensaje de éxito.

## Stores

### `useOrdersStore`

Store ligero para estado de UI global del dominio.

- **Estado Privado**:
  - `_showSuccess`: Booleano para mostrar/ocultar el mensaje de "Compra exitosa".
- **API Pública**:
  - `showSuccess`: Computed boolean.
- **Acciones**:
  - `setShowSuccess(val)`: Setter con logging.
  - `clearOrders()`: Limpia el historial (y el storage).
  - `resetStore()`: Resetea el estado de la UI a sus valores iniciales.

## Helpers

### `ordersPersistence.ts`

Maneja la interacción con `localStorage`.

- `loadOrdersFromStorage()`: Lee y parsea pedidos de `localStorage`.
- `saveOrdersToStorage(orders)`: Guarda pedidos (usado por Checkout).
- `clearOrdersFromStorage()`: Elimina los pedidos guardados.

### `formatters.ts`

Funciones puras para formateo de datos.

- `formatDate(date)`: Formatea fechas a string local (es-ES).
- `getStatusLabel(status)`: Traduce el estado del pedido a español.

## Uso

```typescript
import { useOrders } from '@/domain/orders/composables/useOrders'

const { orders, isLoading } = useOrders()
```
