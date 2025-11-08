// Obtener las categorías desde la API, filtrarlas y exponerlas reactivamente para que el nav

import { computed } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { categoriesApi } from '../api/categoriesApi'
import type { CategoryInterface } from '../interfaces'
import { PRODUCTS_CONFIG } from '../../config/products.config'

const MAIN_CATEGORY_SLUGS = ['clothes', 'electronics', 'furniture', 'shoes', 'miscellaneous']

export function useCategories() {

  const query = useQuery<CategoryInterface[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await categoriesApi.getAll()
      return response.data
    },
    staleTime: PRODUCTS_CONFIG.cache.staleTime,
    gcTime: PRODUCTS_CONFIG.cache.gcTime,
    retry: PRODUCTS_CONFIG.cache.retry,
  })

  const filteredCategories = computed(() =>
    (query.data.value || []).filter(cat => MAIN_CATEGORY_SLUGS.includes(cat.name.toLowerCase()))
  )

  return {
    categories: filteredCategories,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  }
}
