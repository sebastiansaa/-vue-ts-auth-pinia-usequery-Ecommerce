import { serverAdapter } from '@/shared/api/serverAdapter'
import { FORCE_MOCK_PAYMENTS } from '@/shared/config/config'
import { logger } from '@/shared/services/logger'
import { CreatePaymentIntentResponseSchema, CompleteCheckoutResponseSchema } from '@/domain/checkout/schema/paymentResponses'
import type { CreatePaymentIntentResponse, CompleteCheckoutResponse, CompleteCheckoutPayload } from '@/domain/checkout/interfaces/types'
import { normalizeApiError } from '@/shared/helpers/error'

/**
 * Crea un PaymentIntent en el backend para iniciar el proceso de pago.
 */
export async function createPaymentIntent(
  amount: number,
  currency = 'eur',
): Promise<CreatePaymentIntentResponse> {
  // Modo Mock: Simulación para desarrollo/tests
  if (FORCE_MOCK_PAYMENTS) {
    logger.debug('[paymentService] Mocking createPaymentIntent')
    return { client_secret: `cs_mock_${Date.now()}` }
  }

  try {
    logger.info('[paymentService] createPaymentIntent request', { amount, currency })

    const resp = await serverAdapter.post('/api/create-payment-intent', { amount, currency })

    // Validación de esquema en runtime (Seguridad de tipos)
    const parsed = CreatePaymentIntentResponseSchema.safeParse(resp.data)
    if (!parsed.success) {
      logger.error('[paymentService] Invalid response schema', { errors: parsed.error.format() })
      throw new Error('Respuesta del servidor inválida')
    }

    return parsed.data as CreatePaymentIntentResponse
  } catch (err: unknown) {
    // Normalización de errores para manejo consistente
    const norm = normalizeApiError(err)
    logger.error('[paymentService] createPaymentIntent failed', { error: norm })
    throw new Error(norm.message || 'Error al iniciar el pago')
  }
}

/**
 * Finaliza el proceso de checkout enviando el payload completo al backend.
 */
export async function completeCheckout(payload: CompleteCheckoutPayload): Promise<CompleteCheckoutResponse> {
  if (FORCE_MOCK_PAYMENTS) {
    logger.debug('[paymentService] Mocking completeCheckout')
    return { success: true, orderId: `order_mock_${Date.now()}` }
  }

  try {
    logger.info('[paymentService] completeCheckout request', { customer: payload.customer.email }) // Log seguro (solo email)

    const resp = await serverAdapter.post('/api/complete-checkout', payload)

    const parsed = CompleteCheckoutResponseSchema.safeParse(resp.data)
    if (!parsed.success) {
      logger.error('[paymentService] Invalid completeCheckout response', { errors: parsed.error.format() })
      throw new Error('Respuesta de confirmación inválida')
    }

    return parsed.data as CompleteCheckoutResponse
  } catch (err: unknown) {
    const norm = normalizeApiError(err)
    logger.error('[paymentService] completeCheckout failed', { error: norm })
    throw new Error(norm.message || 'Error al completar la orden')
  }
}
