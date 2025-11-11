//Navega entre productos y categorías

import type { ProductInterface } from '../interfaces'
import { useRouter } from 'vue-router'

export function useProductNavigation() {
  const router = useRouter()


  const navigateToProduct = (product: ProductInterface) => {
    router.push({
      name: 'productDetail',
      params: {
        categoryId: product.category.id.toString(),
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
