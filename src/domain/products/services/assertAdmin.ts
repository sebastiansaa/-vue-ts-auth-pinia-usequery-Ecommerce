import { useAuthStore } from '@/domain/auth/stores/authStore';
import { useToast } from 'vue-toastification';

export class AdminRequiredError extends Error {
    code = 'ADMIN_REQUIRED';
    constructor(message = 'Admin role required to perform this action') {
        super(message);
        this.name = 'AdminRequiredError';
    }
}

/** Throws if current user is not admin and notifies the user. */
export function assertAdmin(): void {
    const auth = useAuthStore();
    if (!auth.isAdmin) {
        const error = new AdminRequiredError();
        try {
            useToast().error('Acción restringida: requiere rol administrador');
        } catch {
            // noop: toast no disponible (tests/ssr)
        }
        throw error;
    }
}
