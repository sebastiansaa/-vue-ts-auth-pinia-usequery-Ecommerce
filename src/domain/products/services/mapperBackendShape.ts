import type { CategoryDTO, ProductDTO, ProductListDTO } from "../interfaces";
import type { ProductInterface } from "../interfaces/ProductInterface";
import type { CategoryInterface } from "../interfaces/CategoryInterface";

// Types para creación/actualización (frontend -> backend)
export type CreateProductDTO = Omit<ProductDTO, "id" | "createdAt" | "updatedAt">;
export type UpdateProductDTO = Partial<CreateProductDTO>;

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
    description: d.description ?? "",
    category,
    images: d.images ?? [],
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
  return {
    title: p.title,
    slug: p.slug,
    price: p.price,
    description: p.description ?? "",
    stock: 0,
    active: true,
    images: p.images ?? [],
    categoryId: p.category?.id ?? 0,
  };
}

export function mapProductToUpdateDTO(p: Partial<ProductInterface>): UpdateProductDTO {
  const dto: UpdateProductDTO = {};
  if (p.title !== undefined) dto.title = p.title;
  if (p.slug !== undefined) dto.slug = p.slug;
  if (p.price !== undefined) dto.price = p.price;
  if (p.description !== undefined) dto.description = p.description;
  if (p.images !== undefined) dto.images = p.images;
  if (p.category?.id !== undefined) dto.categoryId = p.category.id;
  return dto;
}
