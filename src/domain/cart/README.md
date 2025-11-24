# Cart Domain

Este dominio gestiona toda la lógica relacionada con el carrito de compras de la aplicación. Sigue los principios de **Clean Architecture** y **Encapsulamiento Estricto** definidos en el proyecto.

## Estructura

- **stores/**: Contiene los stores de Pinia que manejan el estado reactivo.
- **helpers/**: Funciones puras para lógica auxiliar (persistencia, cálculos complejos si los hubiera).
- **interface/**: Definiciones de tipos TypeScript.
- **components/**: Componentes Vue específicos del dominio (MiniCart, etc.).

## Stores

### 1. `cartStore`

Maneja la lista de productos en el carrito y el cálculo de totales.

- **Responsabilidad**:
  - Mantener el estado de los items (`CartItem[]`).
  - Calcular el precio total y la cantidad de items.
  - Persistir el carrito en `localStorage` automáticamente.
- **Estado Privado**:
  - `_cartItems`: Lista mutable de items.
- **API Pública (Readonly)**:
  - `cartItems`: Computed array.
  - `totalPrice`: Computed number (derivado puro).
  - `count`: Computed number (cantidad total de items).
- **Acciones**:
  - `addToCart(product)`: Agrega o incrementa cantidad.
  - `removeFromCart(id)`: Elimina un item.
  - `updateQuantity(id, quantity)`: Actualiza cantidad (elimina si es 0).
  - `clearCart()`: Vacía el carrito.
- **Automatización**:
  - Utiliza un `watch` profundo sobre `_cartItems` para guardar en `localStorage` cada vez que hay cambios.

### 2. `useMiniCartStore`

Controla la visibilidad y el estado visual del "Mini Cart" (el drawer lateral).

- **Estados**: `'closed' | 'mini' | 'expanded'`
- **Acciones**: `openMini()`, `openExpanded()`, `close()`, `resetStore()`.

## Helpers

### `cartPersistence.ts`

Encapsula la lógica de interacción con `localStorage`.

- `loadCartFromStorage()`: Recupera el carrito guardado o devuelve un array vacío. Valida errores con `try/catch` y loguea advertencias.
- `saveCartToStorage(items)`: Guarda el estado actual del carrito.

## Interfaces

- **`CartItem`**: `{ product: ProductInterface, quantity: number }`
- **`MiniCartState`**: Tipo unión para los estados del drawer.

## Uso

```typescript
import { cartStore } from '@/domain/cart/stores/cartStore'

const cart = cartStore()

// Agregar
cart.addToCart(myProduct)

// Leer (Reactivo)
console.log(cart.totalPrice)
```

## Convenciones del Dominio

### Stores

- **Encapsulación**: El estado (`ref`) es siempre privado (prefijo `_`). Se expone solo a través de `computed` (read-only).
- **Acciones**: Todas las mutaciones de estado ocurren dentro de acciones exportadas.
- **Reset**: Cada store debe implementar un método `resetStore` para limpiar su estado.

### Helpers

- **Pureza**: Funciones puras sin efectos secundarios.
- **Ubicación**: Lógica compleja o reutilizable se mueve a `helpers/`.

### Tipado

- **Estricto**: No usar `any`. Definir interfaces en `interfaces/`.
