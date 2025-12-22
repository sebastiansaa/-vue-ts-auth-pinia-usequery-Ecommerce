import { productsApi } from "../api/productsApi";
import { mapProductListDTO } from "./mapperBackendShapeProduct";
import type { ProductInterface } from "../interfaces";
import { logger } from "@/shared/services/logger";

export const searchProducts = async (term: string, params?: { page?: number; limit?: number }): Promise<{ products: ProductInterface[]; total: number }> => {
  try {
    const response = await productsApi.search(term, params);
    return mapProductListDTO(response.data);
  } catch (error) {
    logger.error('Error searching products:', error as Error);
    throw error;
  }
};
