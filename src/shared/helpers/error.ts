export type ApiErrorNormalized = {
    message: string
    status?: number
    raw?: any
}

export type StripeErrorNormalized = {
    message: string
    code?: string
    raw?: any
}

export function normalizeApiError(err: unknown): ApiErrorNormalized {
    const raw = err as any
    let message = 'Ha ocurrido un error inesperado.'
    let status: number | undefined

    if (raw?.response) {
        status = raw.response?.status
        // intentar obtener mensaje desde body
        if (raw.response.data && (typeof raw.response.data === 'string' || typeof raw.response.data.message === 'string')) {
            message = raw.response.data.message ?? String(raw.response.data)
        } else if (raw.response.statusText) {
            message = `${raw.response.status}: ${raw.response.statusText}`
        }
    } else if (raw?.message) {
        message = raw.message
    } else if (typeof raw === 'string') {
        message = raw
    }

    return { message, status, raw }
}

export function normalizeStripeError(err: unknown): StripeErrorNormalized {
    const raw = err as any
    // Stripe errors often come as { error: { message, code, type } } or as Error with message
    if (raw?.error && (raw.error.message || raw.error.code)) {
        return { message: raw.error.message ?? String(raw.error), code: raw.error.code, raw }
    }

    if (raw?.code || raw?.message) {
        return { message: raw.message ?? String(raw), code: raw.code, raw }
    }

    if (typeof raw === 'string') {
        return { message: raw, raw }
    }

    return { message: 'Error en el pago con tarjeta.', raw }
}

export default { normalizeApiError, normalizeStripeError }
