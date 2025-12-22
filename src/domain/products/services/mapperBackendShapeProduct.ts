import type { CategoryDTO, ProductDTO, ProductListDTO } from "../interfaces";
import type { ProductInterface } from "../interfaces/ProductInterface";
import type { CategoryInterface } from "../interfaces/CategoryInterface";

// Types para creación/actualización (frontend -> backend)
export type CreateProductDTO = Omit<ProductDTO, "id" | "createdAt" | "updatedAt" | "deletedAt">;
export type UpdateProductDTO = CreateProductDTO & { id: number };

// Map CategoryDTO -> CategoryInterface
export function mapCategoryDTO(d: CategoryDTO): CategoryInterface {
  return {
    id: d.id,
    name: d.title ?? "",
    slug: d.slug ?? "",
    image: d.image ?? "",
    createdAt: d.createdAt ?? "",
    updatedAt: d.updatedAt ?? "",
  };
}

// Map ProductDTO -> ProductInterface
export function mapProductDTO(
  d: ProductDTO,
  categoryLookup?: Record<number, CategoryInterface>
): ProductInterface {
  const category = categoryLookup?.[d.categoryId] ??

  // fallback mínimo cuando no hay datos de categoría completos
  {
    id: d.categoryId,
    name: "",
    slug: "",
    image: "",
    createdAt: "",
    updatedAt: "",
  };

  return {
    id: d.id,
    title: d.title,
    slug: d.slug,
    price: d.price,
    description: d.description,
    category,
    images: d.images ?? [],
    stock: d.stock,
    active: d.active,
    deletedAt: d.deletedAt ?? null,
    createdAt: d.createdAt,
    updatedAt: d.updatedAt,
  };
}

// Map de lista (útil si la API devuelve { products, total })
export function mapProductListDTO(
  payload: ProductListDTO,
  categoryLookup?: Record<number, CategoryInterface>
): { products: ProductInterface[]; total: number } {
  return {
    total: payload.total,
    products: payload.products.map((p) => mapProductDTO(p, categoryLookup)),
  };
}

// Map ProductInterface (dominio) -> CreateProductDTO (backend)
export function mapProductToCreateDTO(p: ProductInterface): CreateProductDTO {
  if (!p.category || typeof p.category.id !== "number") {
    throw new Error("Missing required field: categoryId");
  }
  if (!p.images || p.images.length === 0) {
    throw new Error("Missing required field: images (must include at least one image)");
  }

  return {
    title: p.title,
    slug: p.slug,
    price: p.price,
    description: p.description ?? "",
    stock: p.stock ?? 0,
    active: p.active ?? true,
    images: p.images,
    categoryId: p.category.id,
  };
}

export function mapProductToUpdateDTO(id: number, p: ProductInterface): UpdateProductDTO {
  if (!p.category || typeof p.category.id !== "number") {
    throw new Error("Missing required field: categoryId");
  }
  if (!p.images || p.images.length === 0) {
    throw new Error("Missing required field: images (must include at least one image)");
  }

  return {
    id,
    title: p.title,
    slug: p.slug,
    price: p.price,
    description: p.description ?? "",
    stock: p.stock ?? 0,
    active: p.active ?? true,
    images: p.images,
    categoryId: p.category.id,
  };
}
