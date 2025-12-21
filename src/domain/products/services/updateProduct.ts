import { productsApi } from "../api/productsApi";
import { mapProductToUpdateDTO, mapProductDTO } from "./mapperBackendShape";
import type { ProductInterface } from "../interfaces";
import { logger } from "@/shared/services/logger";

export const updateProduct = async (id: number, product: Partial<ProductInterface>): Promise<ProductInterface> => {
    try {
        const dto = mapProductToUpdateDTO(product);
        const response = await productsApi.update(id, dto);
        return mapProductDTO(response.data);
    } catch (error) {
        logger.error("Error updating product:", error as Error);
        throw error;
    }
};
