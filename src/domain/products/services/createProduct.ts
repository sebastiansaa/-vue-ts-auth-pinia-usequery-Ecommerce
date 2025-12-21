import { productsApi } from "../api/productsApi";
import { mapProductToCreateDTO, mapProductDTO } from "./mapperBackendShape";
import type { ProductInterface } from "../interfaces";
import { logger } from "@/shared/services/logger";

export const createProduct = async (product: ProductInterface): Promise<ProductInterface> => {
  try {
    const dto = mapProductToCreateDTO(product);
    const response = await productsApi.create(dto);
    return mapProductDTO(response.data);
  } catch (error) {
    logger.error("Error creating product:", error as Error);
    throw error;
  }
};
