import { cartApi } from "../api/cartApi";
import type { Cart } from "./cartMapper";
import { logger } from "@/shared/services/logger";

export const clearCart = async (): Promise<Cart | null> => {
    try {
        await cartApi.clearCart();
        return null;
    } catch (error) {
        logger.error("Error clearing cart", error as Error);
        throw error;
    }
};
