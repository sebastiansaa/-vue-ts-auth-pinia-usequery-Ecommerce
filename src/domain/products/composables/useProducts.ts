// Encargado de obtener los productos por categoría
// unref: Para que el composable acepte tanto un número directo como un Ref<number>. Mayor flexibilidad.

import { useQuery } from "@tanstack/vue-query"
import type { ProductInterface } from "../interfaces"
import { getProducts } from "../services/getProducts"
import { PRODUCTS_CONFIG } from "../config/products.config"
import { unref, computed } from 'vue'
import type { Ref } from 'vue'
import { logger } from "@/shared/services/logger"

export const useProducts = (categoryId: Ref<number> | number) => {
  const catId = unref(categoryId)
  logger.debug(`[useProducts] Initializing for categoryId: ${catId}`)

  const query = useQuery<{ products: ProductInterface[]; total: number }>({
    queryKey: ['products', categoryId],
    queryFn: () => getProducts({ categoryId: unref(categoryId) }),
    staleTime: PRODUCTS_CONFIG.cache.staleTime,
    gcTime: PRODUCTS_CONFIG.cache.gcTime,
    retry: PRODUCTS_CONFIG.cache.retry,
  })

  return {
    // Compatibilidad: `data` sigue siendo la lista de productos para los componentes actuales
    ...query,
    data: computed(() => query.data?.products ?? []),
    total: computed(() => query.data?.total ?? 0),
  }
}



