import { productsApi } from "../api/productsApi";
import { logger } from "@/shared/services/logger";
import { assertAdmin } from "./assertAdmin";

export const deleteProduct = async (id: number, soft = true): Promise<void> => {
    try {
        assertAdmin();
        await productsApi.delete(id, soft);
    } catch (error) {
        logger.error('Error deleting product:', error as Error);
        throw error;
    }
};
