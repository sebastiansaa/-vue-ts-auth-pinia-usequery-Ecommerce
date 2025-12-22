import { productsApi } from "../api/productsApi";
import { mapProductToCreateDTO, mapProductDTO } from "./mapperBackendShapeProduct";
import type { ProductInterface } from "../interfaces";
import { logger } from "@/shared/services/logger";
import { assertAdmin } from "./assertAdmin";

export const createProduct = async (product: ProductInterface): Promise<ProductInterface> => {
  try {
    assertAdmin();
    const dto = mapProductToCreateDTO(product);
    const response = await productsApi.save(dto);
    return mapProductDTO(response.data);
  } catch (error) {
    logger.error("Error creating product:", error as Error);
    throw error;
  }
};
