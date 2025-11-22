import { useQuery } from '@tanstack/vue-query'
import { useTimeoutFn } from '@vueuse/core'
import { computed } from 'vue'
import { useOrdersStore } from '../stores/ordersStore'
import { loadOrdersFromStorage } from '../helpers/ordersPersistence'
import { logger } from '@/shared/services/logger'
import type { Order } from '../interfaces/types'

export function useOrders() {
  const store = useOrdersStore()

  const query = useQuery<Order[], Error>({
    queryKey: ['orders'],
    queryFn: async () => {
      logger.debug('[useOrders] Fetching orders from storage')
      return loadOrdersFromStorage()
    },
    staleTime: 1000 * 60 * 5, // 5 minutos
    gcTime: 1000 * 60 * 10,   // 10 minutos (antes cacheTime)
    retry: 1,
    refetchOnWindowFocus: false,
  })

  // Timer único para ocultar el mensaje de éxito
  const { start: startSuccessTimer } = useTimeoutFn(() => {
    store.setShowSuccess(false)
  }, 5000, { immediate: false })

  // Cuando se establezca showSuccess en true, iniciar/reiniciar el timer
  function watchSuccess() {
    if (!store.showSuccess) return
    logger.debug('[useOrders] Starting success message timer')
    startSuccessTimer()
  }

  /**
   * Limpia el historial de pedidos tanto en el store/storage como en la caché de la query.
   */
  function clearHistory() {
    logger.debug('[useOrders] Clearing order history')
    store.clearOrders()
    // Invalidamos la query para que refleje el estado vacío inmediatamente
    void query.refetch()
  }

  const orders = computed(() => query.data.value ?? [])
  const isLoading = computed(() => query.isLoading.value)
  const isError = computed(() => query.isError.value)
  const error = computed(() => query.error.value)

  return {
    // State
    orders,
    isLoading,
    isError,
    error,

    // Actions
    refetch: query.refetch,
    watchSuccess,
    clearHistory,
  }
}

export default useOrders
