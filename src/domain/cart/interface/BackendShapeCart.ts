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
