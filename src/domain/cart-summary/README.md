# Cart Summary

## Propósito
Presentar el resumen del carrito previo al checkout y conducir al flujo de pago.

## Responsabilidades
- Mostrar items seleccionados y total a pagar.
- Validar que el carrito tenga contenido antes de iniciar pago.
- Orquestar navegación hacia `/checkout` con parámetros necesarios.
- Exponer acciones de pago/continuar desde UI de resumen.

## Estructura
- components/: UI de resumen (OrderSummary, CartItemRow, PaymentActions, PaymentHeader).
- composables/: `usePaymentNavigation` coordina validación y navegación.
- views/: `PaymentView.vue` monta el flujo de resumen previo al checkout.

## Notas
- Depende de `cartStore` para items y totales; no duplica estado de carrito.

## Resumen operativo
- Propósito: validar carrito y conducir al checkout.
- Endpoints usados: ninguno directo; lee `cartStore` y navega a `/checkout`.
- Roles requeridos: ninguno, aunque checkout exige autenticación.
- Estados posibles: carrito vacío/bloqueado, ready para checkout.
