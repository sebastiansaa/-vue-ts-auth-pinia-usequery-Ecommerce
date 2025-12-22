import { useAuthStore } from "@/domain/auth/stores/authStore";
import { useToast } from "vue-toastification";

/** Fuente única de verdad para rol admin en frontend. */
export const isAdmin = (): boolean => {
    const auth = useAuthStore();
    return !!auth.isAdmin;
};

/** Lanza si no es admin y muestra feedback. */
export const requireAdmin = (): void => {
    if (!isAdmin()) {
        try { useToast().error("Acción requiere rol admin"); } catch { /* noop */ }
        const error = new Error("ADMIN_REQUIRED");
        error.name = "AdminRequiredError";
        throw error;
    }
};
