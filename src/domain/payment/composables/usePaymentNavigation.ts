import { cartStore } from '@/domain/cart/stores/cartStore'
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
/**
 * Composable que gestiona la navegación hacia el flujo de pago.
 * Sincroniza el productId desde la ruta o valor inicial, verifica si el carrito tiene productos,
  */
export const usePaymentNavigation = (initialProductId?: number) => {
  const router = useRouter()
  const route = useRoute()
  const store = cartStore()

  const items = computed(() => store.cartItems)

  const productId = ref<number | null>(
    initialProductId ?? (route.query.productId ? Number(route.query.productId) : null)
  )

  // sincronizar si la ruta cambia (convierte a number)
  watch(
    () => route.query.productId,
    (v) => {
      const n = v ? Number(v) : NaN
      productId.value = !isNaN(n) ? n : null
    }
  )

  const canBeginPayment = computed(() => items.value.length > 0)

  const productIdString = computed(() => (productId.value !== null && productId.value !== undefined ? String(productId.value) : ''))

  const setProductId = (id?: number | null) => {
    productId.value = typeof id === 'number' ? id : null
  }

  const goToCheckout = (opts?: { returnTo?: string }) => {
    if (!canBeginPayment.value) return
    const query: Record<string, string> = {}
    if (productId.value !== null) query.productId = String(productId.value)
    if (opts?.returnTo) query.returnTo = opts.returnTo
    router.push({ path: '/checkout', query })
  }

  return {
    items,           // productos actuales en el carrito (reactivo)
    productId,       // ID del producto seleccionado (reactivo y editable)
    productIdString, // versión string útil para props/queries
    setProductId,    // función para actualizar el ID manualmente
    canBeginPayment, // booleano reactivo para habilitar el botón de pago
    goToCheckout     // función que navega a /checkout con parámetros
  }
}




