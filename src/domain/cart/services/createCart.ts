import { cartApi } from "../api/cartApi";
import { mapCartDTO, type Cart } from "./cartMapper";
import { logger } from "@/shared/services/logger";

export const createCart = async (userId: string, id?: string): Promise<Cart | null> => {
    try {
        const res = await cartApi.create(userId, id);
        return res.data ? mapCartDTO(res.data) : null;
    } catch (error) {
        logger.error("Error creating cart", error as Error);
        throw error;
    }
};
