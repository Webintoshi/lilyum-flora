import { useState, useEffect } from 'react'
import { useStripe, useElements, PaymentElement, CardElement } from '@stripe/react-stripe-js'
import { CreditCard, Lock, AlertCircle, CheckCircle } from 'lucide-react'
import { stripeElementsOptions } from '@/lib/stripe'

interface StripePaymentProps {
  amount: number
  onSuccess: () => void
  onError: (error: string) => void
}

export default function StripePayment({ amount, onSuccess, onError }: StripePaymentProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [cardComplete, setCardComplete] = useState(false)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const { error: submitError } = await elements.submit()

      if (submitError) {
        throw new Error(submitError.message)
      }

      const { error: confirmError, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment/success`,
          payment_method_data: {
            billing_details: {
              name: 'Müşteri Adı',
            },
          },
        },
        redirect: 'if_required',
      })

      if (confirmError) {
        throw new Error(confirmError.message)
      }

      if (paymentIntent?.status === 'succeeded') {
        onSuccess()
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ödeme başarısız oldu'
      setError(errorMessage)
      onError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (event: any) => {
    setCardComplete(event.complete)
    setError(null)
  }

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#9e2146',
        iconColor: '#9e2146',
      },
    },
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
            <CreditCard className="w-5 h-5 text-pink-500" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">Kart Bilgileri</h3>
            <p className="text-sm text-gray-500">Güvenli ödeme işlemi</p>
          </div>
          <Lock className="w-5 h-5 text-gray-400 ml-auto" />
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kart Numarası
            </label>
            <CardElement
              options={cardElementOptions}
              onChange={handleChange}
              className="p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>

          {error && (
            <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
              <AlertCircle className="w-5 h-5" />
              <span className="text-sm">{error}</span>
            </div>
          )}
        </div>
      </div>

      <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Ödenecek Tutar</span>
          <span className="text-2xl font-bold text-pink-500">{amount.toFixed(2)} ₺</span>
        </div>
      </div>

      <button
        type="submit"
        disabled={!stripe || !elements || isLoading || !cardComplete}
        className="w-full bg-pink-500 text-white py-4 rounded-lg hover:bg-pink-600 transition-colors font-semibold flex items-center justify-center space-x-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            <span>İşleniyor...</span>
          </>
        ) : (
          <>
            <Lock className="w-5 h-5" />
            <span>{amount.toFixed(2)} ₺ Öde</span>
          </>
        )}
      </button>

      <div className="space-y-2 text-xs text-gray-500">
        <div className="flex items-center space-x-2">
          <CheckCircle className="w-4 h-4 text-green-500" />
          <span>256-bit SSL şifreleme ile güvenli ödeme</span>
        </div>
        <div className="flex items-center space-x-2">
          <CheckCircle className="w-4 h-4 text-green-500" />
          <span>Kart bilgileri asla kaydedilmez</span>
        </div>
        <div className="flex items-center space-x-2">
          <CheckCircle className="w-4 h-4 text-green-500" />
          <span>Tüm kartlar kabul edilir (Visa, Mastercard, Amex)</span>
        </div>
      </div>
    </form>
  )
}
