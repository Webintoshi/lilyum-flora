import { useState, useEffect } from "react";
import { ArrowRight, Heart, Star, Gift, ShoppingBag, Truck, Clock, Shield, CheckCircle, Facebook, Instagram, Twitter, MapPin, Phone, Mail } from "lucide-react";
import SizeCarousel from "@/components/SizeCarousel";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { useNavigate } from "react-router-dom";
import type { HeroBanner, Category } from "@/types";
import { supabase } from "@/lib/supabase";

export default function Home() {
  const navigate = useNavigate();
  const { addToCart, getTotalItems } = useCartStore();
  const { addToWishlist, items: wishlistItems } = useWishlistStore();
  const [heroBanner, setHeroBanner] = useState<HeroBanner | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [addToCartId, setAddToCartId] = useState<number | null>(null);

  useEffect(() => {
    const fetchHeroBanner = async () => {
      try {
        const { data, error } = await supabase
          .from('hero_banners')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();
        
        if (error) throw error;
        setHeroBanner(data);
      } catch (error) {
        console.error('Hero banner fetch error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .eq('is_active', true)
          .order('name', { ascending: true });
        
        if (error) throw error;
        setCategories(data || []);
      } catch (error) {
        console.error('Categories fetch error:', error);
      }
    };

    fetchHeroBanner();
    fetchCategories();
  }, []);

  const handleAddToWishlist = (item: any, event?: any) => {
    console.log('Favoriye ekleniyor:', item);
    addToWishlist(item);
    navigate('/wishlist');
  };

  const handleAddToCart = (product: any, event?: any) => {
    addToCart({ ...product, quantity: 1 }, event);
    setAddToCartId(product.id);
    setTimeout(() => setAddToCartId(null), 1000);
  };
  
  return (
    <div className="min-h-screen bg-neutral-50">
      <Header />

      <main>
        {isLoading ? (
          <section className="relative w-full h-[75vh] md:h-[85vh] overflow-hidden bg-neutral-200 animate-pulse">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-dark-600">Yükleniyor...</p>
              </div>
            </div>
          </section>
        ) : heroBanner ? (
          <section className="relative w-full h-[85vh] md:h-[90vh] overflow-hidden">
            <picture className="w-full h-full">
              <source media="(max-width: 768px)" srcSet={heroBanner.mobileImage} />
              <img 
                src={heroBanner.desktopImage} 
                alt="Taze çiçekler" 
                className="w-full h-full object-cover"
              />
            </picture>
            
            <div 
              className="absolute inset-0 flex flex-col items-center justify-center px-4"
              style={{ backgroundColor: `rgba(0, 0, 0, ${heroBanner.overlayOpacity || 0.45})` }}
            >
              <div className="max-w-4xl mx-auto text-center space-y-6">
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
                  {heroBanner.title}
                </h1>
                
                {heroBanner.subtitle && (
                  <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
                    {heroBanner.subtitle}
                  </p>
                )}
                
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-center pt-4">
                  <a 
                    onClick={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      window.dispatchEvent(new CustomEvent('magic-dust', {
                        detail: {
                          x: rect.left + rect.width / 2,
                          y: rect.top + rect.height / 2,
                        },
                      }));
                    }}
                    href="/catalog" 
                    className="group inline-flex items-center justify-center px-8 py-4 text-base md:text-lg font-bold text-white bg-primary-600 rounded-full shadow-xl hover:shadow-2xl hover:bg-primary-700 transition-all duration-300 hover:scale-105"
                  >
                    Alışverişe Başla
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </a>
                  
                  <a 
                    onClick={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      window.dispatchEvent(new CustomEvent('magic-dust', {
                        detail: {
                          x: rect.left + rect.width / 2,
                          y: rect.top + rect.height / 2,
                        },
                      }));
                    }}
                    href="/gift-finder" 
                    className="group inline-flex items-center justify-center px-8 py-4 text-base md:text-lg font-bold text-white bg-white/10 backdrop-blur-sm border-2 border-white rounded-full shadow-xl hover:shadow-2xl hover:bg-white hover:text-dark-900 transition-all duration-300"
                  >
                    <Gift className="mr-2 w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                    Hediye Bulucu
                  </a>
                </div>

                <div className="grid grid-cols-3 gap-6 md:gap-12 pt-8">
                  <div className="flex flex-col items-center text-white">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-2">
                      <Truck className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-semibold">60 Dakikada</p>
                    <p className="text-xs text-white/80">Teslimat</p>
                  </div>
                  <div className="flex flex-col items-center text-white">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-2">
                      <Shield className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-semibold">%100 Taze</p>
                    <p className="text-xs text-white/80">Garantisi</p>
                  </div>
                  <div className="flex flex-col items-center text-white">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-2">
                      <Clock className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-semibold">7/24</p>
                    <p className="text-xs text-white/80">Destek</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        ) : null}

        <section className="py-16 px-4 md:px-8 bg-gradient-to-b from-neutral-50 to-white">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-dark-900 mb-2">En Çok Satanlar</h2>
                <p className="text-dark-600">En popüler ve beğenilen ürünlerimiz</p>
              </div>
              <a href="/catalog" className="hidden md:flex items-center gap-2 px-6 py-3 bg-white border-2 border-primary-600 rounded-full font-semibold text-primary-600 hover:bg-primary-50 transition-colors">
                Tümünü Görüntüle
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>

            <div className="text-center py-16">
              <p className="text-dark-600 text-lg">Ürünler admin panelinden yüklenecek</p>
            </div>

            <div className="mt-8 md:hidden text-center">
              <a href="/catalog" className="inline-flex items-center gap-2 px-6 py-3 bg-white border-2 border-primary-600 rounded-full font-semibold text-primary-600 hover:bg-primary-50 transition-colors">
                Tümünü Görüntüle
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </div>
        </section>

        <section className="py-16 px-4 md:px-8 bg-gradient-to-r from-primary-600 to-primary-700">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8 text-white">
              <div className="text-center md:text-left">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto md:mx-0 mb-4">
                  <Truck className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Hızlı Teslimat</h3>
                <p className="text-white/90 text-base">Siparişleriniz 60 dakika içinde kapınızda</p>
              </div>
              <div className="text-center md:text-left">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto md:mx-0 mb-4">
                  <Shield className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold mb-2">%100 Taze Garantisi</h3>
                <p className="text-white/90 text-base">Tüm çiçeklerimiz günlük olarak taze olarak hazırlanır</p>
              </div>
              <div className="text-center md:text-left">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto md:mx-0 mb-4">
                  <Phone className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold mb-2">7/24 Müşteri Desteği</h3>
                <p className="text-white/90 text-base">Her türlü sorunuz için yanınızdayız</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 px-4 md:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold text-dark-900 mb-3">Bizimle İletişime Geçin</h2>
              <p className="text-dark-600 text-base">Her türlü sorunuz için yanınızdayız</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <a href="#" className="group bg-neutral-50 hover:bg-primary-50 rounded-2xl p-6 text-center transition-all duration-300 border border-neutral-100 hover:border-primary-200">
                <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Phone className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="font-bold text-dark-900 mb-2">Telefon</h3>
                <p className="text-dark-600">+90 555 123 4567</p>
              </a>
              <a href="#" className="group bg-neutral-50 hover:bg-primary-50 rounded-2xl p-6 text-center transition-all duration-300 border border-neutral-100 hover:border-primary-200">
                <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Mail className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="font-bold text-dark-900 mb-2">E-posta</h3>
                <p className="text-dark-600">info@lilyumflora.com</p>
              </a>
              <a href="#" className="group bg-neutral-50 hover:bg-primary-50 rounded-2xl p-6 text-center transition-all duration-300 border border-neutral-100 hover:border-primary-200">
                <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <MapPin className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="font-bold text-dark-900 mb-2">Adres</h3>
                <p className="text-dark-600">İstanbul, Türkiye</p>
              </a>
            </div>
          </div>
        </section>

        <SizeCarousel
          banners={[
            {
              id: "small",
              subtitle: "0.5 - 1 fit.",
              title: "Küçük Çiçekler",
              videoUrl: "https://woodmart.xtemos.com/plants/wp-content/uploads/sites/12/2023/05/plants-banners-video-1-1.mp4",
              posterUrl: "https://woodmart.xtemos.com/plants/wp-content/uploads/sites/12/2023/05/plants-banners-image-1.jpg",
              link: "/catalog",
            },
            {
              id: "medium",
              subtitle: "1.5 - 2 fit.",
              title: "Orta Boy Çiçekler",
              videoUrl: "https://woodmart.xtemos.com/plants/wp-content/uploads/sites/12/2023/05/plants-banners-video-2-1.mp4",
              posterUrl: "https://woodmart.xtemos.com/plants/wp-content/uploads/sites/12/2023/05/plants-banners-image-2.jpg",
              link: "/catalog",
            },
            {
              id: "large",
              subtitle: "3+ fit.",
              title: "Büyük Çiçekler",
              videoUrl: "https://woodmart.xtemos.com/plants/wp-content/uploads/sites/12/2023/05/plants-banners-video-3-1.mp4",
              posterUrl: "https://woodmart.xtemos.com/plants/wp-content/uploads/sites/12/2023/05/plants-banners-image-3.jpg",
              link: "/catalog",
            },
          ]}
        />

      </main>

      <Footer />
    </div>
  );
}
