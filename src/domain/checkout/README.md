Checkout domain
===============

Visión general
--------------
- El backend es la fuente de verdad: crea (o genera) la orden, inicia y confirma el pago vía `/api/payments`. El front solo orquesta, no confirma intents en cliente.
- Stripe/mock: el front sigue tokenizando la tarjeta, pero envía el token al backend, que decide el estado final (`PENDING` → `PAID`/`FAILED`).
- Lógica separada: store orquesta, services llaman al backend, helpers/composables preparan datos; validaciones siguen en schemas.

Piezas principales
------------------
- **Store**: [stores/checkoutStore.ts](stores/checkoutStore.ts) mantiene `customer`, `payment`, flags y errores; `handlePayment` debe tokenizar (si falta) y delegar confirmación al backend.
- **Composables**: validación de formulario (`useCheckoutForm`), coordinación de sidebar (`useCheckoutSidebar`), tokenización Stripe/mock (`usePaymentCard`, ahora solo tokeniza), navegación/resumen.
- **Services**: `paymentService` debe usar los nuevos endpoints `/api/payments/initiate` y `/api/payments/:id/confirm` (contratos abajo). Los antiguos `create-payment-intent` / `complete-checkout` quedan obsoletos.
- **Helpers**: tokenización defensiva (`cardTokenization`), carga Stripe/mock (`stripe`), persistencia de la última orden (`persistence`).
- **Vista**: `CheckoutView.vue` monta resumen + sidebar y resetea store al salir.

Flujo resumido (backend-driven)
--------------------------------
1. Usuario completa formulario → `useCheckoutForm` valida y envía datos al store.
2. Selecciona método → guardado en store.
3. Si tarjeta → `PaymentCardForm` expone `tokenizePayload` e `isFilled` (sin confirmar intent en cliente).
4. Botón “Pagar” → `handlePayment` debe:
	 - Tokenizar si falta.
	 - Llamar a `/api/payments/initiate` con `{ orderId?: string; amount; currency?; paymentMethodToken?; items? }`.
	 - Recibir `{ paymentId, orderId, amount, status, clientSecret? }`.
	 - Llamar a `/api/payments/{paymentId}/confirm` (reenviando `paymentMethodToken` si aplica) hasta obtener `status === 'PAID'`.
5. En éxito → persistir `orderId`/`paymentId` para la UI, limpiar carrito y redirigir a `/orders`. La orden real vive en el backend.

Contratos
---------
- Endpoints (JWT):
	- POST `/api/payments/initiate` body `{ orderId?: string; amount: number; currency?: string; paymentMethodToken?: string; items?: any[] }` → `{ paymentId, orderId, amount, status, clientSecret?, provider, createdAt, updatedAt }`.
	- POST `/api/payments/:id/confirm` body `{ paymentMethodToken?: string }` → mismo DTO con `status` actualizado (`PAID` esperado).
- Totales: backend usa decimal; enviar `amount` numérico (migrar a cents pendiente).
- `CardFormRef`: requiere `tokenizePayload()` e `isFilled`; no confirmar intents en cliente.
- Mock vs Stripe: `FORCE_MOCK_PAYMENTS=true` activa proveedor fake; `STRIPE_PUBLISHABLE_KEY`/`VITE_STRIPE_PK` habilitan Elements en modo test.
- Persistencia local: `persistOrder` mantiene último orderId/paymentId para la UI; la orden real la genera el backend (si no se entrega `orderId`).

Extensión y pruebas
-------------------
- Actualizar `checkoutStore.handlePayment`, `paymentService` y tests para cubrir `initiate` + `confirm` con estados `PENDING`→`PAID`/`FAILED`.
- Para nuevos métodos, extender `PaymentMethodId` y ajustar payloads enviados al backend.
- E2E: stubear red de Stripe/backend; no ejecutar cargos reales.
