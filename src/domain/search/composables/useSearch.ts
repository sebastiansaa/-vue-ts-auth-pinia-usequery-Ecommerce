// store para busqueda global de productos por título
// con debounce y min de char para realizar la búsqueda

import { useSearchStore } from "../stores/searchStore"
import { useQuery } from "@tanstack/vue-query";
import { computed, ref, unref, type Ref } from "vue";
import { watchDebounced } from '@vueuse/core'
import { getProducts } from "../../products/services/getProducts";
import type { ProductInterface } from "../../products/interfaces";
import { SEARCH_CONFIG } from "../config/search.config";
import { logger } from "../../../shared/services/logger";

//"{ debounceMs }" => el retardo antes de lanzar búsqueda
// minChars puede ser un number o un Ref<number> para permitir reactividad desde fuera
export const useSearch = ({
  debounceMs = SEARCH_CONFIG.DEBOUNCE_MS as number,
  minChars = SEARCH_CONFIG.MIN_CHARS as number | Ref<number>
} = {}) => {

  const searchStore = useSearchStore() // Estado global

  // debouncedTerm evita lanzar la query en cada pulsación
  const debouncedTerm = ref(unref(searchStore.searchTerm))

  // Actualiza debouncedTerm con retardo usando watchDebounced de VueUse
  watchDebounced(
    () => searchStore.searchTerm,
    (val) => {
      debouncedTerm.value = unref(val)
      logger.debug(`[useSearch] Debounced term updated: ${debouncedTerm.value}`)
    },
    { debounce: debounceMs }
  )

  // Usa la misma queryKey que el prefetch en App.vue
  const {
    data: allProducts,
    isLoading: queryLoading,
    isError: queryIsError,
    error: queryError,
    refetch: queryRefetch,
  } = useQuery({
    queryKey: ['products'],
    queryFn: () => getProducts(),
    staleTime: SEARCH_CONFIG.QUERY_STALE_TIME,
  })

  // Filtra localmente sin hacer nuevas requests. CaseInsensitive
  const results = computed(() => {
    const term = debouncedTerm.value?.toLowerCase().trim()
    // Si no hay término, o el término no llega al mínimo de caracteres, o no hay productos, devolver vacío
    if (!term || term.length < unref(minChars) || !allProducts.value) {
      return []
    }
    const filtered = allProducts.value.filter((product: ProductInterface) =>
      product.title.toLowerCase().includes(term)
    )
    logger.debug(`[useSearch] Filtered ${filtered.length} results for term: ${term}`)
    return filtered
  })

  // isLoading defensivo: usa optional chaining y el parámetro minChars
  // isLoading: combinar el estado de la query con el umbral de minChars
  const isLoading = computed(() => (queryLoading.value ?? false) && (debouncedTerm.value?.length ?? 0) > unref(minChars))

  // Exponer estado de error y una función de reintento (refetch)
  const isError = computed(() => !!queryIsError.value)
  const error = queryError
  const retry = () => {
    logger.info('[useSearch] Retrying search query')
    return queryRefetch()
  }

  const setSearchTerm = (term: string) => {
    searchStore.setSearchTerm(term)
  }

  const clearSearch = () => {
    logger.debug('[useSearch] Clearing search')
    searchStore.resetStore()
  }

  return {
    results,
    isLoading,
    isError,
    error,
    retry,
    searchTerm: computed(() => searchStore.searchTerm),
    setSearchTerm,
    clearSearch
  }
}
