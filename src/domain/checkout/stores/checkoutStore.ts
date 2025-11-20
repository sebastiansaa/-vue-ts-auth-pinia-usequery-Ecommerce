import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { performCardPayment, type CardFormRef } from '@/domain/checkout/helpers/performCardPayment'
import { useErrorHandler } from '@/shared/composables/useErrorHandler'
import type { Customer, PaymentMethod, CompleteCheckoutPayload, PaymentIntent } from '@/domain/checkout/interfaces/types'

export const useCheckoutStore = defineStore('checkout', () => {
  const customer = ref<Customer | null>(null)
  const payment = ref<PaymentMethod | null>(null)
  const cardForm = ref<CardFormRef>(null)
  const errorMessage = ref<string | null>(null)
  const isProcessing = ref(false)
  const success = ref(false)

  const { handleError, handleSuccess } = useErrorHandler()

  function onCustomerConfirm(payload: Customer) {
    customer.value = payload
  }

  function onPaymentSelect(payload: PaymentMethod) {
    payment.value = payload
  }

  /**
   * Tokeniza la tarjeta automáticamente antes de procesar el pago.
   */
  async function autoTokenizeCard() {
    if (!cardForm.value?.tokenizePayload) {
      return null
    }
    const res = await cardForm.value.tokenizePayload()
    if (!res || 'error' in res) return null
    return res
  }

  function setCardForm(refValue: CardFormRef) {
    cardForm.value = refValue
  }

  /**
   * Maneja el flujo completo de pago con TOKENIZACIÓN AUTOMÁTICA.
   *
   * Responsabilidades:
   * 1. Valida que existan customer y payment
   * 2. Tokeniza la tarjeta automáticamente si falta (para método 'card')
   * 3. Crea y confirma el PaymentIntent
   * 4. Maneja estados: isProcessing, success, errorMessage
   * 5. Devuelve CompleteCheckoutPayload con customer, payment y paymentIntent
   *
   * El usuario solo necesita:
   * - Llenar campos de usuario y tarjeta
   * - Hacer clic en "Pagar ahora"
   * - El sistema tokeniza y procesa todo automáticamente
   *
   * @param total - Monto total a pagar
   * @returns CompleteCheckoutPayload si exitoso, null si falla
   */
  async function handlePayment(total: number): Promise<CompleteCheckoutPayload | null> {
    // Validaciones iniciales
    if (!customer.value || !payment.value?.method) {
      return null
    }

    errorMessage.value = null
    isProcessing.value = true
    success.value = false

    try {
      // TOKENIZACIÓN AUTOMÁTICA: Si el método es tarjeta y no está tokenizada
      if (payment.value.method === 'card' && !payment.value.details) {
        const tokenData = await autoTokenizeCard()
        if (tokenData) {
          payment.value = { method: 'card', details: tokenData }
        }
      }

      // Procesar pago con tarjeta
      if (payment.value.method === 'card') {
        const res = await performCardPayment({
          customer: customer.value,
          payment: payment.value,
          cardForm: cardForm.value,
          total,
        })

        if (!res.success) {
          errorMessage.value = `Pago en estado: ${String(res.paymentIntent?.status ?? 'unknown')}`
          return null
        }

        handleSuccess('Pago confirmado. Completando orden...')
        success.value = true

        return {
          customer: customer.value,
          payment: payment.value,
          paymentIntent: res.paymentIntent,
        }
      }

      // Otros métodos de pago (futuro)
      success.value = true
      return {
        customer: customer.value,
        payment: payment.value,
      }
    } catch (err: any) {
      const info = handleError(err, 'CheckoutStore')
      errorMessage.value = info.message
      success.value = false
      return null
    } finally {
      isProcessing.value = false
    }
  }

  /**
   * Resetea el estado del checkout a sus valores iniciales.
   *
   * Útil para:
   * - Limpiar el estado al salir de la vista de checkout
   * - Preparar un nuevo checkout después de completar uno exitoso
   * - Evitar que mensajes de éxito persistan al volver al carrito
   */
  function resetCheckout() {
    customer.value = null
    payment.value = null
    cardForm.value = null
    errorMessage.value = null
    isProcessing.value = false
    success.value = false
  }

  return {
    customer,
    payment,
    cardForm,
    errorMessage,
    isProcessing,
    success,
    onCustomerConfirm,
    onPaymentSelect,
    setCardForm,
    handlePayment,
    resetCheckout,
  }
})

export default useCheckoutStore
