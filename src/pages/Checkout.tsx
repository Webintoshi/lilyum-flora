import { useState } from "react";
import { ArrowLeft, CreditCard, MapPin, Clock, AlertCircle, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Checkout() {
  const navigate = useNavigate();
  const { items, clearCart, getTotalPrice } = useCartStore();
  const { user, token } = useAuthStore();
  const [formData, setFormData] = useState({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ')[1] || '',
    phone: user?.phone || '',
    address: '',
    district: '',
    city: '',
    deliveryDate: '',
    deliveryTime: '09:00 - 12:00',
    paymentMethod: 'card',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    if (items.length === 0) {
      setError('Sepetinizde ürün bulunmamaktadır');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          items,
          shipping: {
            name: `${formData.firstName} ${formData.lastName}`,
            phone: formData.phone,
            address: formData.address,
            district: formData.district,
            city: formData.city,
            deliveryDate: formData.deliveryDate,
            deliveryTime: formData.deliveryTime,
          },
          paymentMethod: formData.paymentMethod,
          totalAmount: getTotalPrice(),
        }),
      });

      if (!response.ok) {
        throw new Error('Sipariş oluşturulamadı');
      }

      const data = await response.json();
      setSuccess('Siparişiniz başarıyla oluşturuldu!');
      clearCart();
      setTimeout(() => {
        navigate(`/checkout/success?order=${data.orderId}`);
      }, 1500);
    } catch (error) {
      console.error('Checkout error:', error);
      setError('Sipariş oluşturulamadı. Lütfen tekrar deneyin.');
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Sepetiniz Boş</h1>
          <p className="text-gray-600 mb-8">Sipariş oluşturmak için sepetinize ürün ekleyin</p>
          <button
            onClick={() => navigate('/catalog')}
            className="bg-pink-500 text-white px-8 py-3 rounded-lg hover:bg-pink-600 transition-colors"
          >
            Alışverişe Dön
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <a href="/cart" className="inline-flex items-center text-gray-600 hover:text-pink-500 mb-8">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Sepete Dön
        </a>

        <h1 className="text-3xl font-bold text-gray-800 mb-8">Ödeme</h1>

        {error && (
          <div className="mb-8 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <span className="text-red-700">{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-8 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
            <span className="text-green-700">{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="space-y-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-pink-500" />
              Teslimat Bilgileri
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ad
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Adınız"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Soyad
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Soyadınız"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Telefon Numarası
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="05XX XXX XX XX"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Teslimat Adresi
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Adres detayları"
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  İlçe
                </label>
                <select 
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                >
                  <option>Seçiniz</option>
                  <option>Kadıköy</option>
                  <option>Beşiktaş</option>
                  <option>Şişli</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Şehir
                </label>
                <select 
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                >
                  <option>Seçiniz</option>
                  <option>İstanbul</option>
                  <option>Ankara</option>
                  <option>İzmir</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Teslimat Tarihi
                </label>
                <input
                  type="date"
                  name="deliveryDate"
                  value={formData.deliveryDate}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Teslimat Saati
                </label>
                <select 
                  name="deliveryTime"
                  value={formData.deliveryTime}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                >
                  <option>09:00 - 12:00</option>
                  <option>12:00 - 15:00</option>
                  <option>15:00 - 18:00</option>
                  <option>18:00 - 21:00</option>
                </select>
              </div>
            </div>

            <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <Clock className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-green-800 mb-1">60 Dakikada Teslimat</h4>
                  <p className="text-green-700 text-sm">Şehir içi siparişleriniz aynı gün, 60 dakikada kapınızda</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
              <CreditCard className="w-5 h-5 mr-2 text-pink-500" />
              Ödeme Yöntemi
            </h2>

            <div className="space-y-4">
              <label className="flex items-center p-4 border-2 border-pink-500 rounded-lg cursor-pointer">
                <input 
                  type="radio" 
                  name="payment" 
                  value="card"
                  checked={formData.paymentMethod === 'card'}
                  onChange={handleChange}
                  className="w-4 h-4 text-pink-500" 
                />
                <span className="ml-3 font-medium">Kredi Kartı / Banka Kartı</span>
                <span className="ml-auto text-sm text-gray-500">Visa, Mastercard</span>
              </label>
              <label className="flex items-center p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-pink-500">
                <input 
                  type="radio" 
                  name="payment" 
                  value="bank"
                  checked={formData.paymentMethod === 'bank'}
                  onChange={handleChange}
                  className="w-4 h-4 text-pink-500" 
                />
                <span className="ml-3 font-medium">Havale / EFT</span>
              </label>
              <label className="flex items-center p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-pink-500">
                <input 
                  type="radio" 
                  name="payment" 
                  value="cod"
                  checked={formData.paymentMethod === 'cod'}
                  onChange={handleChange}
                  className="w-4 h-4 text-pink-500" 
                />
                <span className="ml-3 font-medium">Kapıda Ödeme</span>
              </label>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Sipariş Özeti</h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Ara Toplam ({items.length} ürün)</span>
                <span>{getTotalPrice()} ₺</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Kargo Ücreti</span>
                <span className="text-green-600">Ücretsiz</span>
              </div>
              <hr />
              <div className="flex justify-between text-xl font-bold text-gray-800">
                <span>Toplam</span>
                <span className="text-pink-500">{getTotalPrice()} ₺</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-pink-500 text-white py-4 rounded-lg hover:bg-pink-600 transition-colors font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Sipariş Oluşturuluyor...' : 'Siparişi Tamamla'}
            </button>

            <p className="mt-4 text-sm text-gray-500 text-center">
              Siparişinizi tamamladığınızda e-posta adresinize onay bilgisi gönderilecektir.
            </p>
          </div>
        </div>
        </form>
      </main>

      <Footer />
    </div>
  );
}