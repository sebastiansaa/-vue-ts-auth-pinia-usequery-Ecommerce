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

export interface ListProductResponse {
  products: ProductResponse[]
  total: number
}

export type ListProductsRequest = {
  page?: number
  limit?: number
  categoryId?: number
}

export type SearchProductsRequest = {
  query: string
  page?: number
  limit?: number
}

export type CreateProductRequest = {
  id?: number
  title: string
  slug: string
  price: number
  description?: string
  stock?: number
  active?: boolean
  images: string[]
  categoryId: number
}

export type UpdateStockRequest = {
  quantity: number
}

