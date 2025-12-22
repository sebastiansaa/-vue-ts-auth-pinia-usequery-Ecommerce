import { cartApi } from "../api/cartApi";
import { mapCartListDTO, type Cart } from "./cartMapper";
import { logger } from "@/shared/services/logger";

export interface ListCartsParams {
    userId?: string;
    page?: number;
    limit?: number;
}

export interface ListCartsResult {
    carts: Cart[];
    total: number;
}

export const listCarts = async (params: ListCartsParams = {}): Promise<ListCartsResult> => {
    try {
        const res = await cartApi.list(params);
        return res.data ? mapCartListDTO(res.data) : { carts: [], total: 0 };
    } catch (error) {
        logger.error("Error listing carts", error as Error);
        throw error;
    }
};
