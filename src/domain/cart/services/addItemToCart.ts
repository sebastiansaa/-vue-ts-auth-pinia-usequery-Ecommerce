import { cartApi } from "../api/cartApi";
import { mapCartDTO, type Cart } from "./cartMapper";
import { logger } from "@/shared/services/logger";

export const addItemToCart = async (
    productId: number,
    quantity = 1,
): Promise<Cart | null> => {
    try {
        const res = await cartApi.addItem({ productId, quantity });
        return res.data ? mapCartDTO(res.data) : null;
    } catch (error) {
        logger.error("Error adding item to cart", error as Error);
        throw error;
    }
};
