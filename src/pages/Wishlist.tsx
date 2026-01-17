import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import { useWishlistStore } from "@/store/wishlistStore";
import { useCartStore } from "@/store/cartStore";
import { Link, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Wishlist() {
  const navigate = useNavigate();
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

  const handleRemove = (id: string | number) => {
    removeFromWishlist(id);
  };

  const handleClearAll = () => {
    if (confirm('Tüm favorileri temizlemek istediğinize emin misiniz?')) {
      clearWishlist();
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col">
      <Header />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Page Title */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            Favorilerim
            <span className="text-sm font-normal text-gray-500 bg-gray-100 px-3 py-1 rounded-full">{items.length} Ürün</span>
          </h1>
          {items.length > 0 && (
            <button
              onClick={handleClearAll}
              className="text-sm text-red-500 hover:text-red-700 font-medium flex items-center gap-1 transition-colors"
            >
              <Trash2 className="w-4 h-4" /> Temizle
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
              <Heart className="w-10 h-10 text-gray-300" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Favori listeniz henüz boş</h2>
            <p className="text-gray-500 max-w-md mx-auto mb-8">
              Beğendiğiniz ürünleri kalp ikonuna tıklayarak buraya ekleyebilir ve dilediğiniz zaman satın alabilirsiniz.
            </p>
            <Link
              to="/catalog"
              className="px-8 py-3 bg-primary-600 text-white rounded-full font-bold hover:bg-primary-700 transition-all shadow-lg shadow-primary-600/20"
            >
              Alışverişe Başla
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
            {items.map((item) => (
              <div
                key={item.id}
                className="group relative flex flex-col"
              >
                {/* Image */}
                <div
                  className="relative aspect-[4/5] bg-gray-100 rounded-xl overflow-hidden mb-4 cursor-pointer"
                  onClick={() => navigate(`/product/${item.id}`)}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Remove Action */}
                  <button
                    onClick={(e) => { e.stopPropagation(); handleRemove(item.id); }}
                    className="absolute top-2 right-2 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-white transition-colors shadow-sm z-10"
                    title="Kaldır"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Info */}
                <div className="flex flex-col flex-1">
                  <h3 onClick={() => navigate(`/product/${item.id}`)} className="text-sm font-medium text-gray-900 line-clamp-2 cursor-pointer hover:text-primary-600 mb-1">
                    {item.name}
                  </h3>
                  <div className="text-lg font-bold text-gray-900 mb-3">
                    {item.price.toLocaleString('tr-TR')} TL
                  </div>

                  <button
                    onClick={(e) => handleAddToCart(item, e)}
                    className="mt-auto w-full py-2.5 border border-primary-600 text-primary-600 font-bold text-sm rounded-lg hover:bg-primary-600 hover:text-white transition-colors flex items-center justify-center gap-2"
                  >
                    <ShoppingBag className="w-4 h-4" /> Sepete Ekle
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
