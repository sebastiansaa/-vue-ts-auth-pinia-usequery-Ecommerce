// store para busqueda global de productos por título
// con debounce y min de char para realizar la búsqueda

import { computed, ref, unref, type Ref } from "vue";
import { watchDebounced } from '@vueuse/core'
import { useSearchStore } from "../stores/searchStore"
import { useProductsStore } from "../../products/stores/productsStore";
import { SEARCH_CONFIG } from "../config/search.config";
import { logger } from "../../../shared/services/logger";

//"{ debounceMs }" => el retardo antes de lanzar búsqueda
// minChars puede ser un number o un Ref<number> para permitir reactividad desde fuera
export const useSearch = ({
  debounceMs = SEARCH_CONFIG.DEBOUNCE_MS as number,
  minChars = SEARCH_CONFIG.MIN_CHARS as number | Ref<number>
} = {}) => {

  const searchStore = useSearchStore();
  const productsStore = useProductsStore();

  // debouncedTerm evita lanzar filtros en cada pulsación
  const debouncedTerm = ref(unref(searchStore.searchTerm));

  // Actualiza debouncedTerm con retardo usando watchDebounced de VueUse
  watchDebounced(
    () => searchStore.searchTerm,
    (val) => {
      debouncedTerm.value = unref(val);
      logger.debug(`[useSearch] Debounced term updated: ${debouncedTerm.value}`);
    },
    { debounce: debounceMs }
  );

  const normalizedTerm = computed(() => debouncedTerm.value?.trim() ?? '');
  const enabled = computed(() => normalizedTerm.value.length >= unref(minChars));

  const filtered = computed(() => {
    if (!enabled.value) return [];
    const term = normalizedTerm.value.toLowerCase();
    const list = productsStore.productsList;
    if (!list.length) {
      logger.debug('[useSearch] No products available in store to filter');
      return [];
    }
    return list.filter((product) => {
      const title = product.title?.toLowerCase() ?? '';
      const description = product.description?.toLowerCase() ?? '';
      const slug = product.slug?.toLowerCase() ?? '';
      return (
        title.includes(term) ||
        description.includes(term) ||
        slug.includes(term)
      );
    });
  });

  const results = computed(() => filtered.value.slice(0, SEARCH_CONFIG.INITIAL_RESULTS_SHOWN));
  const total = computed(() => filtered.value.length);

  const isLoading = computed(() => false);
  const isError = computed(() => false);
  const error = computed(() => null);
  const retry = () => {
    logger.info('[useSearch] Retry called but search is local-only');
    return filtered.value;
  };

  const setSearchTerm = (term: string) => {
    searchStore.setSearchTerm(term);
  };

  const clearSearch = () => {
    logger.debug('[useSearch] Clearing search');
    searchStore.resetStore();
  };

  return {
    results,
    total,
    isLoading,
    isError,
    error,
    retry,
    searchTerm: computed(() => searchStore.searchTerm),
    setSearchTerm,
    clearSearch
  };
}
