
// Backend shapes (DTO)
export interface ProductDTO {
  id: number;
  title: string;
  slug: string;
  price: number;
  description: string;
  stock: number;
  active: boolean;
  images: string[];
  categoryId: number;
  createdAt: string; // ISO
  updatedAt: string; // ISO
}

export interface CategoryDTO {
  id: number;
  title: string;
  slug: string;
  image?: string | null;
  description?: string | null;
  active: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface ProductListDTO {
  products: ProductDTO[];
  total: number;
}
