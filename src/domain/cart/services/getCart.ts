import { cartApi } from "../api/cartApi";
import { mapCartDTO, type Cart } from "./cartMapper";
import { logger } from "@/shared/services/logger";

export const getCart = async (): Promise<Cart | null> => {
    try {
        const res = await cartApi.get();
        return res.data ? mapCartDTO(res.data) : null;
    } catch (error) {
        logger.error("Error fetching cart", error as Error);
        throw error;
    }
};
