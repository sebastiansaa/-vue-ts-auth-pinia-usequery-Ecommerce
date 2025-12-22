import { productsApi } from "../api/productsApi";
import { mapProductToUpdateDTO, mapProductDTO } from "./mapperBackendShapeProduct";
import type { ProductInterface } from "../interfaces";
import { logger } from "@/shared/services/logger";
import { assertAdmin } from "./assertAdmin";

export const updateProduct = async (id: number, product: ProductInterface): Promise<ProductInterface> => {
  try {
    assertAdmin();
    const dto = mapProductToUpdateDTO(id, product);
    const response = await productsApi.save(dto);
    return mapProductDTO(response.data);
  } catch (error) {
    logger.error("Error updating product:", error as Error);
    throw error;
  }
};
