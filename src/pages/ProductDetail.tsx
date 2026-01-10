import { useState, useEffect } from "react";
import { ArrowLeft, Heart, ShoppingCart, Share2, Star, Check, Minus, Plus, Info } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { useParams, useNavigate } from "react-router-dom";
import type { Product } from "@/types";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"description" | "info" | "reviews">("description");
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const { addToCart, getTotalItems, toggleCart } = useCartStore();
  const { items: wishlistItems, addToWishlist, removeFromWishlist } = useWishlistStore();
  
  const productId = id ? parseInt(id) : 0;
  const isWishlisted = wishlistItems.some(item => item.id === productId);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*, categories(name, slug)')
          .eq('id', id)
          .single();
        
        if (error) throw error;
        if (!data) {
          navigate('/catalog');
        } else {
          setProduct(data);
        }
      } catch (error) {
        console.error('Product fetch error:', error);
        navigate('/catalog');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id, navigate]);

  const handleWishlistToggle = () => {
    if (!product) return;
    if (isWishlisted) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
      });
    }
  };

  const handleAddToCart = (event?: any) => {
    if (!product) return;
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: quantity,
    }, event);
  };

  const handleWhatsAppClick = () => {
    if (!product) return;
    const message = `Merhaba, ${product.name} ürününden ${quantity} adet sipariş etmek istiyorum. Toplam Tutar: ${product.price * quantity} ₺`;
    const whatsappUrl = `https://wa.me/905551234567?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-xl text-dark-600">Ürün bulunamadı</p>
      </div>
    );
  }

  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <a href="/catalog" className="inline-flex items-center text-dark-600 hover:text-primary-600 mb-8">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Kataloğa Dön
        </a>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div>
            <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-lg h-96 flex items-center justify-center mb-4 relative overflow-hidden">
              <span className="text-9xl">{product.image}</span>
              
              <div className="absolute top-4 right-4 space-y-2">
                <button
                  onClick={handleWishlistToggle}
                  className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all"
                >
                  <Heart
                    className={`w-6 h-6 ${isWishlisted ? "fill-primary-600 text-primary-600" : "text-dark-700"}`}
                  />
                </button>
                <button className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all">
                  <Share2 className="w-6 h-6 text-dark-700" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-3">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="bg-gradient-to-br from-primary-50 to-primary-100 rounded h-20 flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
                >
                  <span className="text-3xl">{product.image}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Check className="w-5 h-5 text-green-500" />
                <span className="font-semibold text-green-800">Bugün Teslimat</span>
              </div>
              <p className="text-green-700 text-sm">Şehir içi siparişleriniz aynı gün, 60 dakikada kapınızda</p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-dark-800 mb-4">{product.name}</h1>
              
              <div className="flex items-center space-x-4 mb-6">
                <div className="flex items-center text-yellow-400">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className={`w-5 h-5 ${star <= (product.rating || 0) ? "fill-current" : ""}`} />
                  ))}
                </div>
                <span className="text-dark-600">({product.reviews || 0} değerlendirme)</span>
              </div>

              <div className="flex items-end space-x-4 mb-6">
                <span className="text-4xl font-bold text-primary-600">{product.price} ₺</span>
                {product.originalPrice && (
                  <>
                    <span className="text-2xl text-dark-400 line-through mb-2">{product.originalPrice} ₺</span>
                    {discountPercentage > 0 && (
                      <span className="bg-red-100 text-red-600 px-3 py-1 rounded-lg text-sm font-semibold mb-2">
                        %{discountPercentage} İndirim
                      </span>
                    )}
                  </>
                )}
              </div>

              <p className="text-dark-600 leading-relaxed">
                {product.description || 'Ürün açıklaması henüz eklenmemiş.'}
              </p>

              <div className="mb-6">
                <h3 className="font-semibold text-dark-800 mb-3">Miktar</h3>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-12 rounded-lg border-2 border-neutral-300 flex items-center justify-center hover:border-primary-600 transition-colors"
                  >
                    <Minus className="w-5 h-5 text-dark-700" />
                  </button>
                  <span className="w-16 text-center text-2xl font-semibold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-12 h-12 rounded-lg border-2 border-neutral-300 flex items-center justify-center hover:border-primary-600 transition-colors"
                  >
                    <Plus className="w-5 h-5 text-dark-700" />
                  </button>
                  <span className="text-dark-500 ml-4">
                    Stokta {product.stock || 0} adet mevcut
                  </span>
                </div>
              </div>

              <div className="bg-neutral-50 rounded-lg p-4 mb-6">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold text-dark-800">Stok Durumu</h3>
                  <span className="text-sm text-dark-500">{product.stock || 0} adet kaldı</span>
                </div>
                <div className="w-full bg-neutral-200 rounded-full h-3">
                  <div 
                    className="bg-primary-500 h-3 rounded-full transition-all duration-300" 
                    style={{ width: `${Math.min((product.stock || 0) / 20 * 100, 100)}%` }} 
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <button
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  window.dispatchEvent(new CustomEvent('magic-dust', {
                    detail: {
                      x: rect.left + rect.width / 2,
                      y: rect.top + rect.height / 2,
                    },
                  }));
                  handleAddToCart(e);
                }}
                className="w-full bg-primary-600 text-white py-4 rounded-lg hover:bg-primary-700 transition-colors font-semibold flex items-center justify-center text-lg"
              >
                <ShoppingCart className="w-6 h-6 mr-2" />
                Sepete Ekle
              </button>
              
              <button
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  window.dispatchEvent(new CustomEvent('magic-dust', {
                    detail: {
                      x: rect.left + rect.width / 2,
                      y: rect.top + rect.height / 2,
                    },
                  }));
                  handleWhatsAppClick();
                }}
                className="w-full bg-[#25D366] text-white py-4 rounded-lg hover:bg-[#128C7E] transition-colors font-semibold flex items-center justify-center text-lg"
              >
                <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-5.46-4.45-9.91-9.91-9.91zM6.98 15.23c-.09-.16-.47-.86-.68-1.04-.23-.19-.55-.12-.74-.06-.29.12-1.36.81-1.55.95-.25.19-.44.08-.69-.17-.39-.24-1.28-.84-1.32-.88-.04-.04-.09-.07-.15-.07-.31 0-.61.32-.61.32-.37 0-.68-.02-.87-.08-.19-.06-.37-.16-.53-.28-.28-.77-.52-1.07-.84-.3-.32-.6-.75-1.18-1.39-.57-.62-.94-1.44-1.44-2.37-.5-.93-.86-1.78-1.07-2.57-.21-.79-.31-1.52-.31-2.19 0-1.76.46-3.45 1.31-4.94.85-1.49 2.08-2.31 3.44-2.31 1.35 0 2.59.82 3.44 2.31.85 1.49 1.31 3.18 1.31 4.94 0 .67-.1 1.4-.31 2.19-.21.79-.57 1.64-1.07 2.57-.5.93-.93 1.75-1.44 2.37-.62.57-1.44 1.07-2.37 1.39-.57.31-1.81.46-2.57.46z"/>
                </svg>
                WhatsApp ile Sipariş
              </button>
              
              <button
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  window.dispatchEvent(new CustomEvent('magic-dust', {
                    detail: {
                      x: rect.left + rect.width / 2,
                      y: rect.top + rect.height / 2,
                    },
                  }));
                  handleWishlistToggle();
                }}
                className="w-full border-2 border-primary-600 text-primary-600 py-4 rounded-lg hover:bg-primary-50 transition-colors font-semibold flex items-center justify-center text-lg"
              >
                <Heart
                  className={`w-6 h-6 mr-2 ${isWishlisted ? "fill-primary-600" : ""}`}
                />
                {isWishlisted ? "Favorilerden Çıkar" : "Favorilere Ekle"}
              </button>
            </div>

            <div className="space-y-2 text-sm text-dark-600 mb-6">
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-green-500" />
                <span>Taze çiçek garantisi</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-green-500" />
                <span>Özel kutulu paketleme</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-green-500" />
                <span>Kart mesajı ücretsiz</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-green-500" />
                <span>Güvenli ödeme</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-green-500" />
                <span>60 dakikada teslimat</span>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-blue-800 mb-1">Kargo Ücreti</h4>
                  <p className="text-blue-700 text-sm">
                    300 ₺ ve üzeri siparişlerde kargo ücretsiz. Altındaki siparişlerde 35 ₺ kargo ücreti uygulanır.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-16">
          <div className="flex space-x-4 mb-6 border-b border-neutral-300">
            <button
              onClick={() => setActiveTab("description")}
              className={`px-6 py-3 font-semibold transition-colors ${
                activeTab === "description"
                  ? "text-primary-600 border-b-2 border-primary-600"
                  : "text-dark-600 hover:text-dark-800"
              }`}
            >
              Açıklama
            </button>
            <button
              onClick={() => setActiveTab("info")}
              className={`px-6 py-3 font-semibold transition-colors ${
                activeTab === "info"
                  ? "text-primary-600 border-b-2 border-primary-600"
                  : "text-dark-600 hover:text-dark-800"
              }`}
            >
              Ek Bilgi
            </button>
            <button
              onClick={() => setActiveTab("reviews")}
              className={`px-6 py-3 font-semibold transition-colors ${
                activeTab === "reviews"
                  ? "text-primary-600 border-b-2 border-primary-600"
                  : "text-dark-600 hover:text-dark-800"
              }`}
            >
              Değerlendirmeler (0)
            </button>
          </div>

          <div className="py-6">
            {activeTab === "description" && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-dark-800 mb-4">Ürün Detayları</h3>
                  <p className="text-dark-600 leading-relaxed">
                    {product.description || 'Ürün açıklaması henüz eklenmemiş.'}
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-dark-800 mb-4">Paketleme ve Teslimat</h3>
                  <ul className="space-y-2 text-dark-600">
                    <li className="flex items-start space-x-2">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>Premium hediye kutusunda gönderilir</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>Özel sulama sistemi ile taze kalması sağlanır</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>Şehir içi 60 dakikada teslimat</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>Ücretsiz kart mesajı</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-dark-800 mb-4">Bakım Talimatları</h3>
                  <ul className="space-y-2 text-dark-600">
                    <li className="flex items-start space-x-2">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>Suyu günlük olarak değiştirin</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>Direkt güneş ışığından kaçının</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>Sapları 45 derecelik açı ile kesin</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>Vazoda taze besin solüsyonu kullanın</span>
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {activeTab === "info" && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-neutral-50 rounded-lg p-4">
                    <h4 className="font-semibold text-dark-800 mb-2">Kategori</h4>
                    <p className="text-dark-600">{product.categories?.name || '-'}</p>
                  </div>
                  <div className="bg-neutral-50 rounded-lg p-4">
                    <h4 className="font-semibold text-dark-800 mb-2">Stok Durumu</h4>
                    <p className="text-dark-600">{product.stock || 0} adet</p>
                  </div>
                  <div className="bg-neutral-50 rounded-lg p-4">
                    <h4 className="font-semibold text-dark-800 mb-2">Kargo Ücreti</h4>
                    <p className="text-dark-600">300 ₺ üzeri ücretsiz</p>
                  </div>
                  <div className="bg-neutral-50 rounded-lg p-4">
                    <h4 className="font-semibold text-dark-800 mb-2">Teslimat Süresi</h4>
                    <p className="text-dark-600">60 dakika (Şehir içi)</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-dark-800">Değerlendirmeler</h3>
                </div>

                <div className="text-center py-8 text-dark-600">
                  Henüz değerlendirme yok. İlk değerlendirmeyi siz yapın!
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
