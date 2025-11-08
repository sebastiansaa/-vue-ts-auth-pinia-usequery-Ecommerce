// Construyen rutas y navega a otras vistas, no se hace  fetch ni manipulación de datos (Por eso no usa VueQuery)

import type { ProductInterface } from '../interfaces'
import { useRouter } from 'vue-router'

export function useProductNavigation() {
  const router = useRouter()


  const navigateToProduct = (product: ProductInterface) => {
    router.push({
      name: 'productDetail',
      params: {
        category: product.category.slug,
        id: product.id.toString(),
      },
    })
  }

  const navigateToCategory = (categorySlug: string) => {
    router.push({
      name: 'productsByCategory',
      params: { category: categorySlug },
    })
  }

  return {
    navigateToProduct,
    navigateToCategory,
  }
}
