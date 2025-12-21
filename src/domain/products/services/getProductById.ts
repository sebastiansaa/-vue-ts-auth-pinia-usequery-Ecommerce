//Obtener los productos desde la API filtrados por ID

import { productsApi } from "../api/productsApi";
import type { ProductInterface } from "../interfaces";
import { logger } from "@/shared/services/logger";
import { mapProductDTO } from "./mapperBackendShape";

export const getProductById = async (id: number): Promise<ProductInterface> => {
  try {
    const response = await productsApi.getById(id)
    return mapProductDTO(response.data);
  } catch (error) {
    logger.error("Error fetching product by ID:", error as Error);
    throw error;
  }

}
