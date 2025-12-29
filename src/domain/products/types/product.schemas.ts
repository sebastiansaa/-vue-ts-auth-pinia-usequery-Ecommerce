import { z } from 'zod'

export const createProductSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    price: z.number().positive('Price must be positive'),
    stock: z.number().int().min(0, 'Stock must be non-negative'),
    description: z.string().optional(),
    imageUrl: z.string().url().optional(),
})

export const updateStockSchema = z.object({
    quantity: z.number().int().min(0, 'Quantity must be non-negative'),
})
