import { z } from 'zod'

export const CreatePaymentIntentResponseSchema = z.object({
    client_secret: z.string(),
})

export const CompleteCheckoutResponseSchema = z.object({
    success: z.boolean(),
    orderId: z.string().optional(),
})

export type CreatePaymentIntentResponse = z.infer<typeof CreatePaymentIntentResponseSchema>
export type CompleteCheckoutResponse = z.infer<typeof CompleteCheckoutResponseSchema>

export default {
    CreatePaymentIntentResponseSchema,
    CompleteCheckoutResponseSchema,
}
