import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { performCardPayment, type PerformCardPaymentError } from '@/domain/checkout/helpers/performCardPayment'
import { autoTokenizeCard } from '@/domain/checkout/helpers/cardTokenization'
import type { CardFormRef } from '@/domain/checkout/interfaces/types'
import { useErrorHandler } from '@/shared/composables/useErrorHandler'
import type { Customer, PaymentMethod, CompleteCheckoutPayload } from '@/domain/checkout/interfaces/types'
import { logger } from '@/shared/services/logger'
import { TokenizeReasons, CheckoutFailureReasons } from '@/domain/checkout/types/reasons'
import type { Result } from '@/shared/types'

//Orquesta el flujo de checkout para pagos

export const useCheckoutStore = defineStore('checkout', () => {
  // Estado reactivo (Privado)
  const _customer = ref<Customer | null>(null)
  const _payment = ref<PaymentMethod | null>(null)
  const _errorMessage = ref<string | null>(null)
  const _isProcessing = ref(false)
  const _success = ref(false)

  const { handleError, handleSuccess } = useErrorHandler()

  // Getters (Públicos - Readonly)
  const customer = computed(() => _customer.value)
  const payment = computed(() => _payment.value)
  const errorMessage = computed(() => _errorMessage.value)
  const isProcessing = computed(() => _isProcessing.value)
  const success = computed(() => _success.value)

  // Indica si el checkout está listo para pagar
  const isCheckoutReady = computed(() => !!_customer.value && !!_payment.value?.method)

  // Guarda datos del comprador
  function onCustomerConfirm(payload: Customer) {
    _customer.value = payload
  }

  // Guarda método de pago
  function onPaymentSelect(payload: PaymentMethod) {
    _payment.value = payload
  }

  /* Ejecuta el pago completo con tokenización automática.
   * - Valida datos, Tokeniza , Crea y confirma el PaymentIntent - Devuelve payload completo o null   */
  async function handlePayment(total: number, cardFormRef: CardFormRef): Promise<Result<CompleteCheckoutPayload>> {
    if (!isCheckoutReady.value) return { ok: false, reason: CheckoutFailureReasons.NOT_READY }

    // Precondición explícita: si se intenta pagar con tarjeta, la ref debe
    // contener `tokenizePayload`.
    if (_payment.value?.method === 'card' && !cardFormRef?.tokenizePayload) {
      return { ok: false, reason: CheckoutFailureReasons.INVALID_CARD_FORM, details: 'cardFormRef missing tokenizePayload' }
    }

    logger.info('[checkoutStore] handlePayment start', { total, hasCustomer: !!_customer.value, paymentMethod: _payment.value?.method ?? null })

    resetErrors()
    _isProcessing.value = true
    _success.value = false

    try {
      if (!_customer.value) throw new Error('Cliente no establecido')
      if (!_payment.value) throw new Error('Método de pago no establecido')

      const currentCustomer = _customer.value
      let currentPayment = _payment.value

      // Tokenizar si es tarjeta y no tiene detalles
      if (currentPayment.method === 'card' && !currentPayment.details) {
        logger.info('[checkoutStore] tokenization - starting', { currentPayment: currentPayment.method })
        const tokenResult = await autoTokenizeCard(cardFormRef)
        logger.info('[checkoutStore] tokenization - result', { tokenResult })
        if (!tokenResult.ok) {
          // Diferenciar mensajes según causa
          if (tokenResult.reason === TokenizeReasons.NO_FORM) {
            _errorMessage.value = 'Formulario de tarjeta no disponible.'
            return { ok: false, reason: CheckoutFailureReasons.INVALID_CARD_FORM }
          }
          _errorMessage.value = `Error al tokenizar tarjeta: ${String(tokenResult.error ?? 'unknown')}`
          return { ok: false, reason: CheckoutFailureReasons.TOKENIZATION_FAILED, details: tokenResult.error }
        }

        // Asignar detalles tokenizados
        _payment.value = { ...currentPayment, details: tokenResult.payload }
        currentPayment = _payment.value
      }

      // Procesar pago con tarjeta
      if (currentPayment.method === 'card') {
        const activePayment = _payment.value as PaymentMethod
        logger.info('[checkoutStore] calling performCardPayment', { total, customer: !!currentCustomer, paymentMethod: activePayment.method })
        const res = await performCardPayment({
          customer: currentCustomer,
          payment: activePayment,
          cardForm: cardFormRef,
          total,
        })
        logger.info('[checkoutStore] performCardPayment result', { res })

        if (!res.success) {
          _errorMessage.value = `Pago en estado: ${String(res.paymentIntent?.status ?? 'unknown')}`
          return { ok: false, reason: CheckoutFailureReasons.PAYMENT_INCOMPLETE, details: res.paymentIntent?.status }
        }

        // Asegurarse de que el paymentIntent indica éxito real
        const succeeded = res.paymentIntent?.status === 'succeeded'
        if (!succeeded) {
          _errorMessage.value = `Pago no completado: ${String(res.paymentIntent?.status ?? 'unknown')}`
          return { ok: false, reason: CheckoutFailureReasons.PAYMENT_NOT_SUCCEEDED, details: res.paymentIntent?.status }
        }

        handleSuccess('Pago confirmado. Completando orden...')
        _success.value = true

        return {
          ok: true, payload: {
            customer: currentCustomer,
            payment: activePayment,
            paymentIntent: res.paymentIntent,
          }
        }
      }

      // Otros métodos aún no implementados: no marcar success hasta implementar
      return {
        ok: true, payload: {
          customer: currentCustomer,
          payment: _payment.value,
        }
      }
    } catch (err: any) {
      logger.error('[checkoutStore] handlePayment error', { err })

      // Manejo específico de errores de dominio
      if ((err as PerformCardPaymentError)?.stage) {
        const pErr = err as PerformCardPaymentError
        _errorMessage.value = `Error (${pErr.stage}): ${pErr.message}`
        _success.value = false
        return { ok: false, reason: CheckoutFailureReasons.EXCEPTION, details: pErr }
      }

      const info = handleError(err, 'CheckoutStore')
      // Enriquecer mensaje con contexto mínimo
      _errorMessage.value = `Error en pago: ${info.message}`
      _success.value = false
      return { ok: false, reason: CheckoutFailureReasons.EXCEPTION, details: info }
    } finally {
      _isProcessing.value = false
    }
  }

  // Limpia el estado del checkout
  function resetCheckout() {
    resetErrors()
    resetPaymentState()
    _customer.value = null
  }

  function resetErrors() {
    _errorMessage.value = null
    _isProcessing.value = false
  }

  function resetPaymentState() {
    _payment.value = null
    _success.value = false
  }

  return {
    customer,
    payment,
    errorMessage,
    isProcessing,
    success,
    isCheckoutReady,
    onCustomerConfirm,
    onPaymentSelect,
    handlePayment,
    resetCheckout,
  }
})

export default useCheckoutStore
