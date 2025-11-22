# Cart Summary Domain

Este dominio se encarga de la vista previa y resumen del carrito antes de proceder al pago (Checkout). Muestra los productos seleccionados, el total a pagar y permite iniciar el flujo de compra.

## Estructura

- **components/**: Componentes de presentación (UI) para mostrar el resumen.
- **composables/**: Lógica de negocio y navegación encapsulada.
- **views/**: Vistas principales del dominio.

## Composables

### `usePaymentNavigation`

Gestiona la lógica de navegación hacia el checkout y la validación del estado del carrito.

- **Responsabilidad**:
  - Sincronizar el `productId` desde la URL (query params).
  - Verificar si el carrito tiene items antes de permitir el pago.
  - Construir la query string para la navegación al checkout.
- **Estado Privado**:
  - `_productId`: ID del producto seleccionado (si aplica).
- **API Pública (Readonly)**:
  - `items`: Lista de items del carrito (desde `cartStore`).
  - `productId`: Computed readonly.
  - `canBeginPayment`: Computed boolean.
  - `goToCheckout(opts)`: Navega a `/checkout`.
  - `setProductId(id)`: Modifica el ID seleccionado.

## Componentes

- **`OrderSummary.vue`**: Muestra la lista de items y el total.
- **`CartItemRow.vue`**: Item individual en la lista de resumen.
- **`PaymentActions.vue`**: Botones de acción (Pagar) y manejo de estados de carga/error.
- **`PaymentHeader.vue`**: Encabezado simple.

## Vistas

### `PaymentView.vue`

Vista principal que orquesta los componentes de resumen y acciones. Se conecta con `cartStore` y `usePaymentNavigation`.

## Uso

```typescript
import { usePaymentNavigation } from '@/domain/cart-summary/composables/usePaymentNavigation'

const { goToCheckout, canBeginPayment } = usePaymentNavigation()

if (canBeginPayment.value) {
  goToCheckout()
}
```
