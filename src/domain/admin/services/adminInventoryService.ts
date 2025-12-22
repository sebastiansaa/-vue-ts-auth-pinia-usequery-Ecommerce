import { adminApi } from "../api/adminApi";
import { mapAdminInventory } from "./mappers";
import type { AdminListQuery, AdjustStockDto } from "../interfaces";
import { requireAdmin } from "../helpers/permissions";

export const getAdminInventory = async (query?: AdminListQuery) => {
    requireAdmin();
    const response = await adminApi.getInventory(query);
    return response.data.map(mapAdminInventory);
};

export const getAdminInventoryByProductId = async (productId: number) => {
    requireAdmin();
    const response = await adminApi.getInventoryByProductId(productId);
    return mapAdminInventory(response.data);
};

export const adjustAdminInventory = async (productId: number, body: AdjustStockDto) => {
    requireAdmin();
    const response = await adminApi.adjustInventory(productId, body);
    return mapAdminInventory(response.data);
};
