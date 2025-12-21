// Obtener los productos desde la API filtrados por categoría

import { productsApi } from "../api/productsApi";
import type { ProductInterface } from "../interfaces";
import { logger } from "@/shared/services/logger";
import { mapProductListDTO } from "./mapperBackendShape";

export const getProducts = async (categoryId?: number): Promise<ProductInterface[]> => {
  try {
    const response = await productsApi.getAll(categoryId);
    const mapped = mapProductListDTO(response.data);
    return mapped.products;
  } catch (error) {
    logger.error("Error fetching products:", error as Error);
    throw error;
  }
}
