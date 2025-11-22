# Dominio `checkout`

## Resumen

Este directorio contiene la implementación del flujo de pago (checkout) de la aplicación.
Está organizado para separar responsabilidades en `composables`, `helpers`, `services`, `stores`, `components`, `schema` e `interfaces`.

## Objetivos

- Mantener la lógica de negocio (creación de PaymentIntent, confirmación y persistencia) separada de la UI.
- Aplicar validaciones en el cliente para las respuestas del backend (Zod).
- Facilitar la prueba y el mantenimiento mediante helpers puros y composables pequeños.
- Mejorar UX y accesibilidad en el flujo de pago.

## Arquitectura del Dominio

A continuación se detalla la responsabilidad de cada capa y archivo clave dentro del dominio:

### 📦 Stores (`stores/`)

Gestión del estado reactivo global del dominio.

- **`checkoutStore.ts`**: Orquestador principal. Gestiona los datos del cliente, el método de pago seleccionado y el estado de la transacción (loading, error, success).
  - _Responsabilidad_: Coordinar el flujo, pero delegar la lógica compleja a helpers y services.
  - _Encapsulación_: Expone estado de solo lectura (`computed`) y acciones controladas.

### 🧩 Composables (`composables/`)

Encapsulan lógica de estado y comportamiento de UI reutilizable.

- **`useCheckout.ts`**: Maneja la mutación final hacia el servidor (completar orden) y los efectos secundarios post-compra (persistencia, redirección). Integra **Vue Query**.
- **`usePaymentCard.ts`**: Gestiona la integración con **Stripe Elements** (o Mock), la tokenización de la tarjeta y la validación del formulario de pago.
- **`useCheckoutForm.ts`**: Maneja la validación reactiva del formulario de datos del cliente usando **Vee-Validate** y Zod.
- **`useCheckoutSidebar.ts`**: Controlador de la vista lateral; conecta el store con la UI, gestionando la interacción del botón de pago y los mensajes de error.

### 🔌 Services (`services/`)

Capa de comunicación externa y validación de datos.

- **`paymentService.ts`**: Responsable de las llamadas HTTP al backend (`createPaymentIntent`, `completeCheckout`).
  - _Seguridad_: **Valida estrictamente las respuestas** usando Zod (`schema/`) para garantizar que los datos del servidor coincidan con los tipos de TypeScript en runtime.

### 🛠️ Helpers (`helpers/`)

Funciones puras y utilidades específicas del dominio.

- **`performCardPayment.ts`**: Ejecuta el flujo atómico de pago con tarjeta: Validar -> Crear Intent -> Confirmar con Stripe.
- **`cardTokenization.ts`**: Lógica aislada para obtener el token de la tarjeta desde el formulario.
- **`stripe.ts`**: Maneja la carga diferida (**lazy loading**) del SDK de Stripe para optimizar el rendimiento inicial de la app.
- **`persistence.ts`**: Gestiona el guardado de la orden en `localStorage` (simulando sesión anónima) y la limpieza del carrito.

### 📄 Interfaces y Schemas

- **`interfaces/`**: Definiciones de tipos TypeScript (`Customer`, `PaymentMethod`, `Order`).
- **`schema/`**: Validadores Zod (`checkoutSchema`, `paymentResponses`) para formularios y API.

## Puntos importantes

- Stripe
  - Stripe se carga de forma lazy (helper `stripe.ts`) y se prefetch-a al montar `CheckoutView` para reducir latencia.
  - Nunca realizar cargos reales en entornos de test; usar `VITE_STRIPE_PK` en modo `test`.

- Tokenización y confirmación
  - La tokenización se encapsula en `usePaymentCard` / `PaymentCardForm.vue`.
  - La confirmación del pago (cliente) no se reintenta automáticamente desde el frontend para evitar duplicados; si hay un fallo el usuario debe reintentar manualmente (botón `Reintentar`).

- Validación y manejo de errores
  - Las respuestas del backend se validan con Zod en `paymentService` antes de ser consumidas.
  - Errores se normalizan con `normalizeApiError` / `normalizeStripeError` y el UI muestra mensajes accesibles (`role="alert"`, `aria-live`).

- UX y accesibilidad
  - Botones de pago se deshabilitan durante `processing` y muestran spinner.
  - Mensajes de error reciben `focus()` al aparecer para ayudar a usuarios con teclado/lector de pantalla.

## Cómo usar / integrar

- Importante: configurar env vars en `.env`:
  - `VITE_STRIPE_PK` — clave pública de Stripe (modo `test` en staging).
  - `VITE_FORCE_MOCK_PAYMENTS` — si `true` usa la ruta de mock para pruebas locales.

- Flujo típico desde la UI:
  1. Usuario completa `CheckoutForm`.
  2. Se sincroniza `cardFormRef` y se tokeniza la tarjeta desde `PaymentCardForm` (si se usa tarjeta).
  3. `checkoutStore.handlePayment` llama a `paymentService.createPaymentIntent` y luego realiza `stripe.confirmCardPayment` o la lógica equivalente.
  4. En caso de error durante confirmación, se muestra mensaje y el usuario puede reintentar.

## Notas para desarrolladores

- Añadir idempotency-keys en el backend para permitir reintentos seguros del lado servidor.
- Las pruebas E2E se deben implementar con network stubs (Playwright/Cypress). Evitar cargos reales; usar fixtures o modo test de Stripe.
- Mantener los helpers puros en `helpers/` para facilitar tests unitarios cuando se implementen.

## Checklist de calidad antes de producción

- Asegurar que `STRIPE_PUBLISHABLE_KEY` en staging está en modo test.
- Revisar `persistOrder` y su schema para evitar inconsistencias.
- Añadir observabilidad (Sentry o logs estructurados) para errores de pago.
- Incluir E2E que cubran el flujo feliz y errores críticos.

---

Archivo generado automáticamente: `src/domain/checkout/README.md` — mantenlo actualizado cuando cambies la arquitectura.
