import type { CategoryInterface } from "./CategoryInterface";


export interface ProductInterface {
  id: number;
  title: string;
  slug: string;
  price: number;
  description: string;
  category: CategoryInterface;
  images: string[];
  stock: number;
  active: boolean;
  deletedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}
