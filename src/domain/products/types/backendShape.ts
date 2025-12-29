export interface ProductResponse {
  id: number;
  name: string;
  description?: string;
  price: number;
  stock: number;
  imageUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateProductDto {
  name: string;
  description?: string;
  price: number;
  stock: number;
  imageUrl?: string;
}

export type UpdateStockDto = { quantity: number };

export interface ListProductResponse {
  products: ProductResponse[];
  total: number;
}

