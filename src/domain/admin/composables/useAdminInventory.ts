import { computed, unref } from "vue";
import type { Ref } from "vue";
import { useQuery } from "@tanstack/vue-query";
import type { AdminInventoryDTO, AdminListQuery } from "../interfaces";
import { getAdminInventory } from "../services";
import { ADMIN_CONFIG } from "../config/admin.config";

export const useAdminInventory = (query?: Ref<AdminListQuery | undefined> | AdminListQuery) => {
    const queryRef = computed(() => unref(query));

    const q = useQuery<AdminInventoryDTO[]>({
        queryKey: ["admin", "inventory", queryRef],
        queryFn: () => getAdminInventory(queryRef.value),
        staleTime: ADMIN_CONFIG.cache.staleTime,
        gcTime: ADMIN_CONFIG.cache.gcTime,
        retry: ADMIN_CONFIG.cache.retry,
    });

    return {
        ...q,
        inventory: computed(() => q.data.value ?? []),
    };
};
