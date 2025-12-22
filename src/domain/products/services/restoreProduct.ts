import { productsApi } from "../api/productsApi";
import { mapProductDTO } from "./mapperBackendShapeProduct";
import type { ProductInterface } from "../interfaces";
import { logger } from "@/shared/services/logger";
import { assertAdmin } from "./assertAdmin";

export const restoreProduct = async (id: number): Promise<ProductInterface> => {
  try {
    assertAdmin();
    const response = await productsApi.restore(id);
    return mapProductDTO(response.data);
  } catch (error) {
    logger.error('Error restoring product:', error as Error);
    throw error;
  }
};
