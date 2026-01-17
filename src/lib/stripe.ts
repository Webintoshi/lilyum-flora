import { loadStripe, Stripe } from '@stripe/stripe-js'

let stripePromise: Promise<Stripe | null>

export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || '')
  }
  return stripePromise
}

export const stripeElementsOptions = {
  appearance: {
    theme: 'stripe',
    variables: {
      colorPrimary: '#ec4899',
      colorBackground: '#ffffff',
      colorText: '#1a1a1a',
    },
  },
  locale: 'tr',
} as const

export interface PaymentIntent {
  clientSecret: string
  id: string
}

export async function createPaymentIntent(amount: number, orderId: number): Promise<PaymentIntent> {
  try {
    const response = await fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount, orderId }),
    })

    if (!response.ok) {
      throw new Error('Ödeme oluşturulamadı')
    }

    const data = await response.json()
    return {
      clientSecret: data.clientSecret,
      id: data.id,
    }
  } catch (error) {
    console.error('Create payment intent error:', error)
    throw error
  }
}
