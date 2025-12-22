import { useMutation, useQueryClient } from "@tanstack/vue-query";
import type { AdjustStockDto } from "../interfaces";
import { adjustAdminInventory } from "../services";

export const useAdminAdjustInventory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ productId, body }: { productId: number; body: AdjustStockDto }) =>
            adjustAdminInventory(productId, body),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: ["admin", "inventory"] });
            queryClient.invalidateQueries({ queryKey: ["admin", "inventory", variables.productId] });
            queryClient.invalidateQueries({ queryKey: ["admin", "products", variables.productId] });
        },
    });
};
