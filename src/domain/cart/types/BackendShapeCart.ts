export interface CartItemDTO {
  productId: number;
  quantity: number;
  price: number;
  lineTotal: number;
}

export interface CartDTO {
  id: string;
  userId: string;
  items: CartItemDTO[];
  total: number;
  createdAt: string;
  updatedAt: string;
}

import type { ProductResponse } from '@/domain/products/types'

export type CartItem = CartItemDTO & {
  product?: ProductResponse;
};



