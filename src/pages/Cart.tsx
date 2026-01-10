import { Trash2, Plus, Minus, ShoppingBag, ShoppingBag as Bag } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useNavigate } from "react-router-dom";

export default function Cart() {
  const navigate = useNavigate();
  const { items, removeFromCart, updateQuantity, getTotalPrice, clearCart } = useCartStore();

  const handleRemove = (id: number) => {
    removeFromCart(id);
  };

  const handleUpdateQuantity = (id: number, newQuantity: number) => {
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
      <div className="min-h-screen bg-gray-50">
        <Header />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">Alışveriş Sepeti</h1>

          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Sepetiniz Boş</h2>
            <p className="text-gray-600 mb-6">
              Sepetinizde ürün bulunmuyor. Alışverişe devam etmek için kataloğa göz atın.
            </p>
            <button
              onClick={() => navigate('/catalog')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors font-semibold"
            >
              <Bag className="w-5 h-5" />
              Alışverişe Başla
            </button>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Alışveriş Sepeti</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-gradient-to-br from-pink-100 to-pink-200 rounded w-32 h-32 flex items-center justify-center flex-shrink-0 overflow-hidden">
                    <span className="text-4xl">{item.image}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      {item.name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 rounded bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-12 text-center font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 rounded bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <span className="text-xl font-bold text-pink-500">{item.price * item.quantity} ₺</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemove(item.id)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div>
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">Sipariş Özeti</h3>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Ara Toplam ({items.length} ürün)</span>
                  <span>{getTotalPrice()} ₺</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Kargo Ücreti</span>
                  <span className="text-green-600">Ücretsiz</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>İndirim</span>
                  <span className="text-green-600">-0 ₺</span>
                </div>
                <hr />
                <div className="flex justify-between text-xl font-bold text-gray-800">
                  <span>Toplam</span>
                  <span className="text-pink-500">{getTotalPrice()} ₺</span>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kupon Kodu
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Kupon kodunu girin"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                  <button className="px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors">
                    Uygula
                  </button>
                </div>
              </div>

              <button
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  window.dispatchEvent(new CustomEvent('magic-dust', {
                    detail: {
                      x: rect.left + rect.width / 2,
                      y: rect.top + rect.height / 2,
                    },
                  }));
                  handleCheckout();
                }}
                className="block w-full bg-pink-500 text-white py-4 rounded-lg hover:bg-pink-600 transition-colors font-semibold text-center"
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