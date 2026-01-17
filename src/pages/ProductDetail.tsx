import { useState, useEffect } from "react";
import { ArrowLeft, Heart, ShoppingCart, Share2, Star, Check, Minus, Plus, Info } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { useParams, useNavigate } from "react-router-dom";
import type { Product } from "@/types";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductReviews from "@/components/ProductReviews";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import SEO from "@/components/SEO";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeImage, setActiveImage] = useState<string>("");

  const { addToCart, getTotalItems, toggleCart } = useCartStore();
  const { items: wishlistItems, addToWishlist, removeFromWishlist } = useWishlistStore();

  const productId = id ? parseInt(id) : 0;
  const isWishlisted = wishlistItems.some(item => item.id === productId);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, 'products', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const productData = { id: docSnap.id, ...docSnap.data() } as Product;
          setProduct(productData);
          // Set initial active image
          if (productData.images && productData.images.length > 0) {
            setActiveImage(productData.images[0]);
          } else if (productData.image) {
            setActiveImage(productData.image);
          }
        } else {
          // Try finding by query if ID is number-like but stored differently or fallback
          navigate('/catalog');
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

  // Structured Data (Product Schema)
  const productSchema = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.name,
    "image": product.images || [product.image],
    "description": product.metaDescription || product.description,
    "sku": product.id,
    "offers": {
      "@type": "Offer",
      "url": window.location.href,
      "priceCurrency": "TRY",
      "price": product.price,
      "availability": product.stock && product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "itemCondition": "https://schema.org/NewCondition"
    },
    "aggregateRating": product.rating ? {
      "@type": "AggregateRating",
      "ratingValue": product.rating,
      "reviewCount": product.reviews || 0
    } : undefined
  };

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title={product.metaTitle || product.name}
        description={product.metaDescription || product.description}
        keywords={product.keywords}
        image={product.image}
        canonical={`/product/${product.id}`}
        type="product"
        schema={productSchema}
      />
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <a href="/catalog" className="inline-flex items-center text-dark-600 hover:text-primary-600 mb-8">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Kataloğa Dön
        </a>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div>
            <div className="bg-white rounded-lg aspect-square flex items-center justify-center mb-4 relative overflow-hidden border border-gray-100">
              {activeImage && (activeImage.startsWith('http') || activeImage.startsWith('data:')) ? (
                <img src={activeImage} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-9xl">{activeImage || product.image}</span>
              )}

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

            {/* Thumbnails */}
            {(product.images && product.images.length > 0) ? (
              <div className="grid grid-cols-4 gap-3">
                {product.images.map((img, idx) => (
                  <div
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`aspect-square rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${activeImage === img ? 'border-primary-600 opacity-100' : 'border-transparent opacity-70 hover:opacity-100'}`}
                  >
                    {img.startsWith('http') || img.startsWith('data:') ? (
                      <img src={img} alt={`${product.name} ${idx}`} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-primary-50 flex items-center justify-center text-2xl">{img}</div>
                    )}
                  </div>
                ))}
              </div>
            ) : null}

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
                <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
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


          </div>
        </div>

        <div className="mb-16">
          <div className="py-6">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-neutral-50 rounded-lg p-4">
                  <h4 className="font-semibold text-dark-800 mb-2">Kategori</h4>
                  <p className="text-dark-600">{product.category || '-'}</p>
                </div>
                <div className="bg-neutral-50 rounded-lg p-4">
                  <h4 className="font-semibold text-dark-800 mb-2">Stok Durumu</h4>
                  <p className="text-dark-600">{product.stock || 0} adet</p>
                </div>
                <div className="bg-neutral-50 rounded-lg p-4">
                  <h4 className="font-semibold text-dark-800 mb-2">Teslimat Ücreti</h4>
                  <p className="text-dark-600">300 ₺ üzeri ücretsiz</p>
                </div>
                <div className="bg-neutral-50 rounded-lg p-4">
                  <h4 className="font-semibold text-dark-800 mb-2">Teslimat Süresi</h4>
                  <p className="text-dark-600">60 dakika (Şehir içi)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
