// Obtiene un producto específico por ID
// unref: Para que el composable acepte tanto un número directo como un Ref<number>. Mayor flexibilidad.

import { useQuery } from "@tanstack/vue-query"
import type { ProductInterface } from "../interfaces"
import { PRODUCTS_CONFIG } from "../../config/products.config"
import { getProductById } from "../services"
import { unref } from "vue"
import type { Ref } from "vue"

export const useProductById = (id: Ref<number> | number) => {
  return useQuery<ProductInterface>({
    queryKey: ['product', id],
    queryFn: () => getProductById(unref(id)),
    staleTime: PRODUCTS_CONFIG.cache.staleTime,
    gcTime: PRODUCTS_CONFIG.cache.gcTime,
    retry: PRODUCTS_CONFIG.cache.retry,
  })
}
