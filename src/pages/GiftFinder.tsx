import { useState } from 'react'
import { ArrowRight, Heart, Gift, Sparkles, Calendar, MapPin, User } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { db } from '@/lib/firebase'
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore'
import type { Product } from '@/types'

export default function GiftFinder() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [suggestions, setSuggestions] = useState<Product[]>([])

  const [formData, setFormData] = useState({
    deliveryLocation: '',
    recipient: '',
    occasion: '',
    message: '',
  })
  const deliveryLocations = [
    { id: 'home', name: 'Ev', icon: '🏠' },
    { id: 'office', name: 'Ofis', icon: '🏢' },
    { id: 'hospital', name: 'Hastane', icon: '🏥' },
    { id: 'school', name: 'Okul', icon: '🎓' },
  ]

  const recipients = [
    { id: 'partner', name: 'Sevgili/Eş', icon: '❤️' },
    { id: 'friend', name: 'Arkadaş', icon: '👯' },
    { id: 'mother', name: 'Anne', icon: '👩' },
    { id: 'father', name: 'Baba', icon: '👨' },
    { id: 'colleague', name: 'İş Arkadaşı', icon: '🤝' },
    { id: 'relative', name: 'Akraba', icon: '👨‍👩‍👧‍👦' },
  ]

  const occasions = [
    { id: 'birthday', name: 'Doğum Günü', icon: '🎂' },
    { id: 'anniversary', name: 'Yıldönümü', icon: '💍' },
    { id: 'new_job', name: 'Yeni İş', icon: '💼' },
    { id: 'get_well', name: 'Geçmiş Olsun', icon: '🩹' },
    { id: 'congratulations', name: 'Tebrik', icon: '🎉' },
    { id: 'love', name: 'İçimden Geldi', icon: '💝' },
  ]

  const handleFindGift = async () => {
    setLoading(true)
    try {
      // Logic for suggestions could be improved with better filtering if we had tagging
      // For now, mirroring previous logic effectively: latest active products
      const q = query(
        collection(db, 'products'),
        where('isActive', '==', true),
        orderBy('createdAt', 'desc'),
        limit(6)
      )

      const querySnapshot = await getDocs(q)
      const products: Product[] = []
      querySnapshot.forEach(doc => {
        products.push({ id: doc.id, ...doc.data() } as unknown as Product)
      })

      setSuggestions(products)
      setStep(3)
    } catch (error) {
      console.error('Gift finder error:', error)
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setStep(1)
    setFormData({
      deliveryLocation: '',
      recipient: '',
      occasion: '',
      message: '',
    })
    setSuggestions([])
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <Header />

      <main className="max-w-6xl mx-auto px-4 py-12">
        {step === 1 && (
          <div className="animate-fade-in-up">
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full mb-6 shadow-xl">
                <Gift className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Mükemmel Hediye Bul
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Size en uygun çiçek aranjmanını bulmak için birkaç sorumuz var
              </p>
            </div>

            <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-3xl mx-auto">
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Teslimat Yeri</h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {deliveryLocations.map((location) => (
                    <button
                      key={location.id}
                      onClick={() => setFormData({ ...formData, deliveryLocation: location.id })}
                      className={`p-6 rounded-2xl border-2 transition-all duration-300 ${formData.deliveryLocation === location.id
                        ? 'border-pink-500 bg-pink-50 shadow-lg scale-105'
                        : 'border-gray-200 hover:border-pink-300 hover:shadow-md'
                        }`}
                    >
                      <span className="text-4xl block mb-2">{location.icon}</span>
                      <span className="font-semibold text-gray-900">{location.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => setStep(2)}
                  disabled={!formData.deliveryLocation}
                  className="px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold rounded-full hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
                >
                  Devam Et
                  <ArrowRight className="ml-2 w-5 h-5 inline-block" />
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-fade-in-up">
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full mb-6 shadow-xl">
                <Heart className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Kime Göndermek İstiyorsunuz?
              </h1>
            </div>

            <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-3xl mx-auto">
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Alıcı</h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {recipients.map((recipient) => (
                    <button
                      key={recipient.id}
                      onClick={() => setFormData({ ...formData, recipient: recipient.id })}
                      className={`p-6 rounded-2xl border-2 transition-all duration-300 ${formData.recipient === recipient.id
                        ? 'border-pink-500 bg-pink-50 shadow-lg scale-105'
                        : 'border-gray-200 hover:border-pink-300 hover:shadow-md'
                        }`}
                    >
                      <span className="text-4xl block mb-2">{recipient.icon}</span>
                      <span className="font-semibold text-gray-900">{recipient.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Özel Gün</h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {occasions.map((occasion) => (
                    <button
                      key={occasion.id}
                      onClick={() => setFormData({ ...formData, occasion: occasion.id })}
                      className={`p-6 rounded-2xl border-2 transition-all duration-300 ${formData.occasion === occasion.id
                        ? 'border-pink-500 bg-pink-50 shadow-lg scale-105'
                        : 'border-gray-200 hover:border-pink-300 hover:shadow-md'
                        }`}
                    >
                      <span className="text-4xl block mb-2">{occasion.icon}</span>
                      <span className="font-semibold text-gray-900">{occasion.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Kişisel Mesaj (İsteğe Bağlı)</h2>
                </div>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Çiçeğe eklemek istediğiniz mesajı yazın..."
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all duration-300 resize-none"
                  rows={4}
                  maxLength={200}
                />
                <p className="text-sm text-gray-500 mt-2">{formData.message.length}/200 karakter</p>
              </div>

              <div className="flex gap-4 justify-between">
                <button
                  onClick={() => setStep(1)}
                  className="px-8 py-4 bg-gray-200 text-gray-700 font-bold rounded-full hover:bg-gray-300 transition-all duration-300"
                >
                  Geri
                </button>
                <button
                  onClick={handleFindGift}
                  disabled={!formData.recipient || !formData.occasion || loading}
                  className="px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold rounded-full hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
                >
                  {loading ? 'Aranıyor...' : 'Hediye Bul'}
                  <Sparkles className="ml-2 w-5 h-5 inline-block" />
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="animate-fade-in-up">
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full mb-6 shadow-xl">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Size Özel Öneriler
              </h1>
              <p className="text-lg text-gray-600">
                Seçimlerinize göre en uygun çiçek aranjmanları
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {suggestions.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-105 group"
                >
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={product.image || product.images?.[0] || 'https://via.placeholder.com/400x400?text=Çiçek'}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {product.featured && (
                      <div className="absolute top-4 left-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                        Öne Çıkan
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{product.name}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-2xl font-bold text-pink-600">₺{product.price}</span>
                        {product.compareAtPrice && (
                          <span className="text-gray-400 line-through ml-2">₺{product.compareAtPrice}</span>
                        )}
                      </div>
                      <button
                        onClick={() => navigate(`/product/${product.id}`)}
                        className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold rounded-full hover:shadow-lg transition-all duration-300 hover:scale-105"
                      >
                        İncele
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center">
              <button
                onClick={resetForm}
                className="px-8 py-4 bg-white border-2 border-pink-500 text-pink-600 font-bold rounded-full hover:bg-pink-50 transition-all duration-300"
              >
                Yeni Arama Yap
              </button>
              <button
                onClick={() => navigate('/catalog')}
                className="ml-4 px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold rounded-full hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                Tüm Katalog
                <ArrowRight className="ml-2 w-5 h-5 inline-block" />
              </button>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
