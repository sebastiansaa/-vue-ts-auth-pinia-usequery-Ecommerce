# Checkout

## Propósito
Orquestar el flujo de pago: captura datos de cliente y método, tokeniza si aplica, y delega creación/confirmación de pago al backend.

## Responsabilidades
- Mantener estado de checkout (cliente, método, procesamiento, errores).
- Tokenizar tarjeta y enviar payload seguro al backend.
- Iniciar y confirmar pagos vía `/payments/initiate` y `/payments/:id/confirm` y redirigir tras éxito.
- Coordinar UI de resumen y sidebar de pago.
- Limpiar estado y carrito al finalizar.

## Estructura
- stores/: `checkoutStore` maneja flujo de pago y estados.
- composables/: `useCheckoutForm`, `useCheckoutSidebar`, `usePaymentCard`, etc., para validar y orquestar UI.
- services/: `paymentService` llama a `/api/payments/initiate|confirm`.
- services/: `paymentService` llama a `/payments/initiate|confirm`.
- components/: formularios y sidebar de checkout.
- views/: `CheckoutView.vue` monta el flujo completo.

## Notas
- Requiere usuario autenticado (JWT) y depende de endpoints de pagos del backend; no se confirma intents en cliente.

## Resumen operativo
- Propósito: orquestar pago y confirmación de orden.
- Endpoints usados: `POST /payments/initiate`, `POST /payments/:id/confirm`, opcional `POST /payments/:id/fail`.
- Roles requeridos: usuario autenticado.
- Estados posibles: idle, processing, paid/succeeded, failed, error de validación.
