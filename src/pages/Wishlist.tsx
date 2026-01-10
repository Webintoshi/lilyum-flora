import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import { useWishlistStore } from "@/store/wishlistStore";
import { useCartStore } from "@/store/cartStore";
import { Link } from "react-router-dom";

export default function Wishlist() {
  const { items, removeFromWishlist, clearWishlist } = useWishlistStore();
  const { addToCart } = useCartStore();

  const handleAddToCart = (item: any, event?: any) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      quantity: 1,
    }, event);
  };

  const handleRemove = (id: number) => {
    removeFromWishlist(id);
  };

  const handleClearAll = () => {
    if (confirm('Tüm favorileri temizlemek istediğinize emin misiniz?')) {
      clearWishlist();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <Heart className="w-6 h-6 text-pink-500" />
              <h1 className="text-2xl font-bold text-gray-800">Favorilerim</h1>
              <span className="bg-pink-500 text-white text-sm px-3 py-1 rounded-full">
                {items.length}
              </span>
            </div>
            <Link
              to="/catalog"
              className="text-gray-600 hover:text-pink-500 transition-colors"
            >
              Alışverişe Devam Et
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {items.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <Heart className="w-24 h-24 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Favorileriniz boş</h2>
            <p className="text-gray-600 mb-6">
              Beğendiğiniz ürünleri favorilere ekleyin ve daha sonra kolayca satın alın.
            </p>
            <Link
              to="/catalog"
              className="inline-flex items-center gap-2 px-6 py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors font-semibold"
            >
              Ürünleri Keşfet
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-gray-600">
                <span className="font-semibold">{items.length}</span> ürün favorilerinizde
              </p>
              {items.length > 0 && (
                <button
                  onClick={handleClearAll}
                  className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Tümünü Temizle
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group"
                >
                  <div className="relative">
                    <div className="aspect-square bg-gradient-to-br from-pink-50 to-pink-100 flex items-center justify-center overflow-hidden">
                      <span className="text-8xl group-hover:scale-110 transition-transform duration-300">{item.image}</span>
                    </div>

                    <button
                      onClick={() => handleRemove(item.id)}
                      className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-red-100 transition-colors opacity-0 group-hover:opacity-100"
                      title="Favorilerden kaldır"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>

                  <div className="p-4">
                    <Link to={`/product/${item.id}`} className="block">
                      <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2 min-h-[3rem] hover:text-pink-500 transition-colors">
                        {item.name}
                      </h3>
                    </Link>

                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-pink-500">{item.price} ₺</span>
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
                        handleAddToCart(item, e);
                      }}
                      className="w-full mt-3 bg-pink-500 text-white py-3 rounded-lg hover:bg-pink-600 transition-colors font-semibold flex items-center justify-center gap-2"
                    >
                      <ShoppingBag className="w-5 h-5" />
                      Sepete Ekle
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <footer className="bg-gray-800 text-white py-8 px-4">
        <div className="max-w-7xl mx-auto text-center text-gray-400">
          <p>© 2024 Lilyum Flora. Tüm hakları saklıdır.</p>
        </div>
      </footer>
    </div>
  );
}
