// Obtener todas las categorías desde la API

import { categoriesApi } from "../api/categoriesApi";
import type { CategoryInterface } from "../interfaces";
import { logger } from "@/shared/services/logger";

export const getCategories = async (): Promise<CategoryInterface[]> => {
  try {
    const response = await categoriesApi.getAll();
    return response.data;
  } catch (error) {
    logger.error("Error fetching categories:", error as Error);
    throw error;
  }
}
