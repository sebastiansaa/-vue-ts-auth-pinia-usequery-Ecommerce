import { cartApi } from "../api/cartApi";
import { mapCartDTO, type Cart } from "./cartMapper";
import { logger } from "@/shared/services/logger";

export const removeItemFromCart = async (
    productId: number
): Promise<Cart | null> => {
    try {
        const res = await cartApi.removeItem(productId);
        return res.data ? mapCartDTO(res.data) : null;
    } catch (error) {
        logger.error("Error removing item from cart", error as Error);
        throw error;
    }
};
