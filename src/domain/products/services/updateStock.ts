import { productsApi } from "../api/productsApi";
import { mapProductDTO } from "./mapperBackendShapeProduct";
import type { ProductInterface } from "../interfaces";
import { logger } from "@/shared/services/logger";
import { assertAdmin } from "./assertAdmin";

export const updateStock = async (id: number, quantity: number): Promise<ProductInterface> => {
    try {
        assertAdmin();
        const response = await productsApi.updateStock(id, { quantity });
        return mapProductDTO(response.data);
    } catch (error) {
        logger.error('Error updating stock:', error as Error);
        throw error;
    }
};
