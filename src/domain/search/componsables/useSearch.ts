// store para busqueda global de productos por título

import { useSearchStore } from "../stores/searchStore"
import { useQuery, useQueryClient } from "@tanstack/vue-query";
import { computed, ref, unref, watch } from "vue";
import { getProducts } from "../../products/products/services/getProducts";
import type { ProductInterface } from "../../products/products/interfaces";

//"{ debounceMs }"  configura el retardo para debounce. (tiempo de espera antes de lanzar búsqueda)
export const useSearch = ({ debounceMs = 200 } = {}) => {

  const searchStore = useSearchStore() // Estado global
  const queryClient = useQueryClient()

  // debouncedTerm evita lanzar la query en cada pulsación
  const debouncedTerm = ref(unref(searchStore.searchTerm))
  let timer: ReturnType<typeof setTimeout> | null = null

  // Actualiza debouncedTerm con retardo.
  watch(() => searchStore.searchTerm, (val) => {
    const term = unref(val)
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      debouncedTerm.value = term
    }, debounceMs)
  })

  // Usa la misma queryKey que el prefetch en App.vue
  const { data: allProducts } = useQuery({
    queryKey: ['products'],
    queryFn: () => getProducts(),
    staleTime: 1000 * 60 * 30, // 30 minutos
  })

  // Filtra localmente sin hacer nuevas requests. CaseInsensitive
  const results = computed(() => {
    const term = debouncedTerm.value?.toLowerCase().trim()
    if (!term || term.length < 2 || !allProducts.value) {
      return []
    }
    return allProducts.value.filter((product: ProductInterface) =>
      product.title.toLowerCase().includes(term)
    )
  })

  const isLoading = computed(() => !allProducts.value && debouncedTerm.value.length > 1)

  return {
    results,
    isLoading,
    searchTerm: searchStore.searchTerm,
    setSearchTerm: searchStore.setSearchTerm,
    clearSearch: searchStore.clearSearchTerm
  }
}
