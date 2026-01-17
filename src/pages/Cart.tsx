import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useNavigate } from "react-router-dom";

export default function Cart() {
  const navigate = useNavigate();
  const { items, removeFromCart, updateQuantity, getTotalPrice, clearCart } = useCartStore();

  const handleRemove = (id: string | number) => {
    removeFromCart(id);
  };

  const handleUpdateQuantity = (id: string | number, newQuantity: number) => {
    if (newQuantity > 0) {
      updateQuantity(id, newQuantity);
    }
  };

  const handleClearCart = () => {
    if (confirm('Sepeti temizlemek istediğinize emin misiniz?')) {
      clearCart();
    }
  };

  const handleCheckout = () => {
    if (items.length === 0) {
      alert('Sepetiniz boş');
      return;
    }
    navigate('/checkout');
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white flex flex-col font-sans">
        <Header />
        <div className="flex-grow flex items-center justify-center py-16">
          <div className="text-center p-8 max-w-md mx-auto">
            <div className="w-24 h-24 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-10 h-10 text-primary-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Sepetiniz Boş</h1>
            <p className="text-gray-500 mb-8 text-lg">
              Sepetinizde henüz ürün bulunmuyor. Harika çiçeklerimizi keşfetmek için kataloğumuza göz atın.
            </p>
            <button
              onClick={() => navigate('/catalog')}
              className="bg-primary-600 text-white px-8 py-3 rounded-full font-bold hover:bg-primary-700 transition-colors shadow-lg shadow-primary-600/20 inline-flex items-center gap-2"
            >
              <ShoppingBag className="w-5 h-5" />
              Alışverişe Başla
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Alışveriş Sepeti ({items.length})</h1>
          <button
            onClick={handleClearCart}
            className="text-gray-500 hover:text-red-500 text-sm font-medium transition-colors flex items-center gap-1"
          >
            <Trash2 className="w-4 h-4" /> Sepeti Temizle
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-6">
            {items.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 flex flex-col sm:flex-row gap-6 group hover:border-primary-100 transition-colors">

                {/* Image */}
                <div className="w-full sm:w-32 h-32 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0 border border-gray-100">
                  {item.image.startsWith('http') || item.image.startsWith('data:') ? (
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                      Resim Yok
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-primary-600 transition-colors cursor-pointer" onClick={() => navigate(`/product/${item.id}`)}>
                        {item.name}
                      </h3>
                      <p className="text-sm text-gray-500">Ürün Kodu: #{item.id}</p>
                    </div>
                    <button
                      onClick={() => handleRemove(item.id)}
                      className="text-gray-400 hover:text-red-500 p-2 hover:bg-red-50 rounded-lg transition-all"
                      title="Sepetten Kaldır"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="flex items-end justify-between mt-4">
                    {/* Quantity Controls */}
                    <div className="flex items-center bg-gray-50 rounded-lg p-1 border border-gray-200">
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 rounded-md bg-white text-gray-600 hover:bg-red-50 hover:text-red-600 flex items-center justify-center transition-colors shadow-sm disabled:opacity-50"
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-12 text-center font-bold text-gray-900">{item.quantity}</span>
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 rounded-md bg-white text-gray-600 hover:bg-green-50 hover:text-green-600 flex items-center justify-center transition-colors shadow-sm"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Price */}
                    <div className="text-right">
                      <div className="text-xs text-gray-500">Birim Fiyat: {item.price.toLocaleString('tr-TR')} ₺</div>
                      <div className="text-xl font-bold text-primary-600">{(item.price * item.quantity).toLocaleString('tr-TR')} ₺</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Cart Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 sticky top-24">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Sipariş Özeti</h3>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Ara Toplam</span>
                  <span className="font-medium">{getTotalPrice().toLocaleString('tr-TR')} ₺</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Teslimat Ücreti</span>
                  <span className="text-green-600 font-medium">Ücretsiz</span>
                </div>
                <div className="pt-4 border-t border-gray-100 flex justify-between text-2xl font-bold text-gray-900">
                  <span>Toplam</span>
                  <span className="text-primary-600">{getTotalPrice().toLocaleString('tr-TR')} ₺</span>
                </div>
              </div>

              {/* Coupon - Simplified for UI consistency */}
              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">
                  İndirim Kuponu
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Kupon Kodu"
                    className="flex-1 px-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                  />
                  <button className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors text-sm font-semibold">
                    Uygula
                  </button>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full bg-primary-600 text-white py-4 rounded-xl hover:bg-primary-700 transition-colors font-bold text-lg shadow-lg shadow-primary-600/30 flex items-center justify-center gap-2 group"
              >
                Siparişi Tamamla
              </button>

              <a href="/catalog" className="block w-full mt-4 text-center text-gray-600 hover:text-pink-500">
                Alışverişe Devam Et
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}