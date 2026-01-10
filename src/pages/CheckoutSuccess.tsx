import { CheckCircle, ShoppingBag, Home } from "lucide-react";

export default function CheckoutSuccess() {
  return (
    <div className="min-h-screen bg-white">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <a href="/" className="text-2xl font-bold text-pink-500">Lilyum Flora</a>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="/" className="text-gray-700 hover:text-pink-500 transition-colors">Ana Sayfa</a>
              <a href="/catalog" className="text-gray-700 hover:text-pink-500 transition-colors">Katalog</a>
              <a href="/contact" className="text-gray-700 hover:text-pink-500 transition-colors">İletişim</a>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-lg shadow-lg p-12 text-center">
          <div className="mb-8">
            <CheckCircle className="w-24 h-24 text-green-500 mx-auto" />
          </div>
          
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Siparişiniz Başarıyla Alındı!
          </h1>
          
          <p className="text-xl text-gray-600 mb-8">
            Sipariş numaranız: <span className="font-bold text-pink-500">#LF12345</span>
          </p>

          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
            <h2 className="text-lg font-semibold text-green-800 mb-2">
              Teslimat Bilgileri
            </h2>
            <p className="text-green-700">
              Siparişiniz <strong>bugün</strong> hazırlanacak ve <strong>60 dakika içinde</strong> kapınıza teslim edilecektir.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 text-left">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-semibold text-gray-800 mb-3">Sipariş Detayları</h3>
              <div className="space-y-2 text-gray-600">
                <p><strong>Sipariş No:</strong> #LF12345</p>
                <p><strong>Tarih:</strong> 08.01.2024</p>
                <p><strong>Ödeme Yöntemi:</strong> Kredi Kartı</p>
                <p><strong>Toplam Tutar:</strong> 900 ₺</p>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-semibold text-gray-800 mb-3">Teslimat Adresi</h3>
              <div className="space-y-2 text-gray-600">
                <p><strong>Ad Soyad:</strong> Ahmet Yılmaz</p>
                <p><strong>Telefon:</strong> 0532 123 45 67</p>
                <p><strong>Adres:</strong> Kadıköy, İstanbul</p>
                <p><strong>Teslimat:</strong> Bugün, 12:00-15:00</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a
              href="/order/LF12345"
              className="flex items-center justify-center bg-pink-500 text-white px-8 py-4 rounded-lg hover:bg-pink-600 transition-colors font-semibold"
            >
              <ShoppingBag className="w-5 h-5 mr-2" />
              Siparişi Takip Et
            </a>
            <a
              href="/"
              className="flex items-center justify-center border-2 border-pink-500 text-pink-500 px-8 py-4 rounded-lg hover:bg-pink-50 transition-colors font-semibold"
            >
              <Home className="w-5 h-5 mr-2" />
              Ana Sayfaya Dön
            </a>
          </div>

          <p className="mt-8 text-sm text-gray-500">
            Onay bilgileri e-posta adresinize gönderildi. Sorularınız için bize ulaşabilirsiniz.
          </p>
        </div>
      </main>

      <footer className="bg-gray-800 text-white py-8 px-4">
        <div className="max-w-7xl mx-auto text-center text-gray-400">
          <p>&copy; 2024 Lilyum Flora. Tüm hakları saklıdır.</p>
        </div>
      </footer>
    </div>
  );
}