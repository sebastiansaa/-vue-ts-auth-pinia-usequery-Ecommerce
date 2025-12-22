import { cartApi } from "../api/cartApi";
import { mapCartDTO, type Cart } from "./cartMapper";
import { logger } from "@/shared/services/logger";

export const updateCartItemQuantity = async (
    productId: number,
    quantity: number
): Promise<Cart | null> => {
    try {
        const res = await cartApi.updateQuantity(productId, quantity);
        return res.data ? mapCartDTO(res.data) : null;
    } catch (error) {
        logger.error("Error updating cart item quantity", error as Error);
        throw error;
    }
};
