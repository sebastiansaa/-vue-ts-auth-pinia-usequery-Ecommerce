import type { ProductInterface } from '@/domain/products/interfaces'

/**
 * Ítem de carrito enriquecido para la UI. Puede venir de backend (solo productId y pricing)
 * o de la cache de productos (product completo). Si `product` no está presente, los valores
 * de `price` y `lineTotal` se usan como fallback para renderizar.
 */
export interface CartItem {
  productId: number
  product?: ProductInterface
  quantity: number
  price?: number
  lineTotal?: number
}
