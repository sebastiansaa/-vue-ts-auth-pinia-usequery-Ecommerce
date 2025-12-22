// Obtener los productos desde la API filtrados por categoría

import { productsApi } from "../api/productsApi";
import type { ProductInterface } from "../interfaces";
import { logger } from "@/shared/services/logger";
import { mapProductListDTO } from "./mapperBackendShapeProduct";

export const getProducts = async (params?: { page?: number; limit?: number; categoryId?: number }): Promise<{ products: ProductInterface[]; total: number }> => {
  try {
    const response = await productsApi.getAll(params);
    return mapProductListDTO(response.data);
  } catch (error) {
    logger.error("Error fetching products:", error as Error);
    throw error;
  }
}
