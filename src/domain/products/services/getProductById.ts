//Obtener los productos desde la API filtrados por ID

import axios from "axios";
import { productsApi } from "../api/productsApi";
import type { ProductInterface } from "../interfaces";
import { logger } from "@/shared/services/logger";
import { mapProductDTO } from "./mapperBackendShapeProduct";

export const getProductById = async (id: number): Promise<ProductInterface | null> => {
  try {
    const response = await productsApi.getById(id);
    if (!response.data) return null;
    return mapProductDTO(response.data);
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return null;
    }
    logger.error("Error fetching product by ID:", error as Error);
    throw error;
  }
}
