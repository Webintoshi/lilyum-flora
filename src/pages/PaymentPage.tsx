import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, PaymentElement } from '@stripe/react-stripe-js'
import StripePayment from '@/components/StripePayment'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { ShoppingCart, ArrowLeft, CheckCircle } from 'lucide-react'

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || '')

export default function PaymentPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [amount, setAmount] = useState<number>(0)
  const [loading, setLoading] = useState(true)
  const [success, setSuccess] = useState(false)

  const amountParam = searchParams.get('amount')
  const orderId = searchParams.get('orderId')

  useEffect(() => {
    if (amountParam) {
      setAmount(parseFloat(amountParam))
      createPaymentIntent(parseFloat(amountParam))
    }
  }, [amountParam])

  const createPaymentIntent = async (amount: number) => {
    try {
      setLoading(true)
      
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, orderId }),
      })

      if (!response.ok) throw new Error('Ödeme oluşturulamadı')

      const data = await response.json()
      setClientSecret(data.clientSecret)
    } catch (error) {
      console.error('Payment intent error:', error)
      navigate('/checkout?error=payment_failed')
    } finally {
      setLoading(false)
    }
  }

  const handlePaymentSuccess = () => {
    setSuccess(true)
    setTimeout(() => {
      navigate('/profile/orders')
    }, 3000)
  }

  const handlePaymentError = (error: string) => {
    console.error('Payment error:', error)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Ödeme sayfası yükleniyor...</p>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-md mx-auto px-4 py-16">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-500" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Ödeme Başarılı!</h1>
            <p className="text-gray-600 mb-6">Siparişiniz başarıyla oluşturuldu.</p>
            <p className="text-sm text-gray-500">Siparişler sayfasına yönlendiriliyorsunuz...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate('/checkout')}
          className="flex items-center text-gray-600 hover:text-gray-800 mb-6"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Sepete Dön
        </button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Ödeme</h1>
          <p className="text-gray-600">Güvenli ödeme işlemini tamamlayın</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-pink-500" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-800">Sipariş Özeti</h2>
              <p className="text-sm text-gray-500">{amount.toFixed(2)} ₺</p>
            </div>
          </div>
        </div>

        {clientSecret ? (
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <StripePayment
              amount={amount}
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
            />
          </Elements>
        ) : (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-600">Ödeme başlatılamadı. Lütfen tekrar deneyin.</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
