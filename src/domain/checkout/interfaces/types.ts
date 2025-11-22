// Tipos de dominio para el dominio `checkout`

export type PaymentMethodId = 'card'

import type { CartItem } from '@/domain/cart/interface'

export interface CardTokenPayload {
  token: string
  last4?: string | null
  brand?: string | null
  cardholder?: string | null
}

export interface PaymentMethod {
  method: PaymentMethodId
  details?: CardTokenPayload
}

export interface Customer {
  fullName: string
  address: string
  phone: string
  email: string
  [key: string]: any
}

export interface PaymentIntent {
  id?: string
  status?: string
  [key: string]: any
}

export interface Order {
  id?: string
  total?: number
  items?: CartItem[]
  [key: string]: any
}

export interface CompleteCheckoutPayload {
  customer: Customer
  payment: PaymentMethod
  paymentIntent?: PaymentIntent | null
}

export type CardFormRef = {
  confirmPayment: (clientSecret: string) => Promise<{ paymentIntent?: PaymentIntent; error?: any }>
  tokenizePayload?: () => Promise<CardTokenPayload | { error: any } | undefined>
  isFilled?: boolean | { value: boolean } // Puede ser ref o valor directo
} | null

export default {} as const

// Respuestas/proyecciones usadas por servicios de pago
export interface CreatePaymentIntentResponse {
  client_secret: string
}

export interface CompleteCheckoutResponse {
  success: boolean
  orderId?: string
}
