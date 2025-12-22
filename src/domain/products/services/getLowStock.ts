import { productsApi } from "../api/productsApi";
import { mapProductDTO } from "./mapperBackendShapeProduct";
import type { ProductInterface } from "../interfaces";
import { logger } from "@/shared/services/logger";
import { assertAdmin } from "./assertAdmin";

export const getLowStockProducts = async (threshold = 5): Promise<ProductInterface[]> => {
    try {
        assertAdmin();
        const response = await productsApi.lowStock(threshold);
        return response.data.map((p) => mapProductDTO(p));
    } catch (error) {
        logger.error('Error fetching low stock products:', error as Error);
        throw error;
    }
};
