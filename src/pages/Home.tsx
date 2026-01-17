import { useState, useEffect, useRef } from "react";
import { ArrowRight, Star, Truck, Clock, Shield, ChevronLeft, ChevronRight } from "lucide-react";
import SizeCarousel from "@/components/SizeCarousel";
import FlowerCareGuide from "@/components/FlowerCareGuide";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import SEO from "@/components/SEO"; // Added SEO import
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { useAdminStore } from "@/store/adminStore";
import { useNavigate } from "react-router-dom";

import type { HeroBanner, Category, Product } from "@/types";
import { db } from "@/lib/firebase";
import { collection, query, where, orderBy, limit, getDocs } from "firebase/firestore";

export default function Home() {
  const navigate = useNavigate();
  const { addToCart } = useCartStore();
  const { addToWishlist } = useWishlistStore();
  const { sizeBanners, fetchSizeBanners, pageSEO } = useAdminStore();

  const homeSEO = pageSEO?.find(p => p.page === 'home');

  const [heroBanner, setHeroBanner] = useState<HeroBanner | null>(null);

  // Derived Banners
  const mainBanner = sizeBanners.find(b => b.id === 'home-main');
  const topSideBanner = sizeBanners.find(b => b.id === 'home-right-top');
  const bottomSideBanner = sizeBanners.find(b => b.id === 'home-right-bottom');

  useEffect(() => {
    fetchSizeBanners();
  }, [fetchSizeBanners]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [isLoadingHero, setIsLoadingHero] = useState(true);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);

  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = direction === 'left' ? -300 : 300;
      current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Fetch Hero Banner
  useEffect(() => {
    const fetchHero = async () => {
      try {
        const q = query(collection(db, 'heroBanners'), where('isActive', '==', true), orderBy('createdAt', 'desc'), limit(1));
        const snap = await getDocs(q);
        if (!snap.empty) {
          const doc = snap.docs[0];
          setHeroBanner({ id: doc.id, ...doc.data() } as unknown as HeroBanner);
        } else {
          console.log("No hero banner found");
        }
      } catch (err) {
        console.warn("Hero fetch failed", err);
      } finally {
        setIsLoadingHero(false);
      }
    };
    fetchHero();
  }, []);

  // Fetch Categories
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const q = query(collection(db, 'categories'), where('isActive', '==', true));
        const snap = await getDocs(q);
        if (!snap.empty) {
          const cats: Category[] = [];
          snap.forEach(d => cats.push({ id: d.id, ...d.data() } as unknown as Category));
          setCategories(cats);
        }
      } catch (err) {
        console.warn("Categories fetch failed", err);
      } finally {
        setIsLoadingCategories(false);
      }
    };
    fetchCats();
  }, []);

  // Fetch Featured Products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const q = query(collection(db, 'products'), where('isActive', '==', true), limit(20));
        const snap = await getDocs(q);
        const prods: Product[] = [];
        snap.forEach(d => prods.push({ id: d.id, ...d.data() } as unknown as Product));
        setFeaturedProducts(prods);
      } catch (err) {
        console.warn("Products fetch failed", err);
      } finally {
        setIsLoadingProducts(false);
      }
    };
    fetchProducts();
  }, []);

  // Skeletons
  const HeroSkeleton = () => (
    <div className="animate-pulse grid grid-cols-1 lg:grid-cols-3 gap-6 h-auto lg:h-[450px]">
      <div className="lg:col-span-2 bg-gray-200 rounded-2xl h-[500px] md:h-auto"></div>
      <div className="grid grid-cols-1 gap-6">
        <div className="bg-gray-200 rounded-2xl h-full min-h-[200px]"></div>
        <div className="bg-gray-200 rounded-2xl h-full min-h-[200px]"></div>
      </div>
    </div>
  );

  const CategoriesSkeleton = () => (
    <div className="flex gap-4 md:gap-8 overflow-hidden px-2 py-2">
      {[1, 2, 3, 4, 5, 6].map(i => (
        <div key={i} className="flex flex-col items-center gap-3 min-w-[80px] md:min-w-[100px]">
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gray-200 animate-pulse"></div>
          <div className="w-16 h-4 bg-gray-200 rounded animate-pulse"></div>
        </div>
      ))}
    </div>
  );

  const ProductsSkeleton = () => (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => (
        <div key={i} className="bg-white rounded-xl border border-gray-100 overflow-hidden h-[350px] animate-pulse">
          <div className="bg-gray-200 h-[250px] w-full"></div>
          <div className="p-4 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      ))}
    </div>
  );


  return (
    <div className="min-h-screen bg-white font-sans selection:bg-primary-100">
      <SEO
        title={homeSEO?.title || "Ana Sayfa"}
        description={homeSEO?.description}
        keywords={homeSEO?.keywords}
        image={homeSEO?.image}
        canonical="/"
      />
      <Header />

      <main>
        {/* TOP CATEGORY STRIP */}
        <div className="bg-white py-6 border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative group">
            {isLoadingCategories ? (
              <CategoriesSkeleton />
            ) : categories.length > 0 ? (
              <>
                <button onClick={() => scroll('left')} className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white shadow-md rounded-full items-center justify-center text-gray-400 hover:text-primary-600 border border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <div ref={scrollRef} className="flex gap-4 md:gap-8 overflow-x-auto no-scrollbar scroll-smooth px-2 py-2">
                  {categories.map((cat) => (
                    <div key={cat.id} onClick={() => navigate(`/catalog?category=${cat.slug}`)} className="flex flex-col items-center gap-3 cursor-pointer min-w-[80px] md:min-w-[100px] flex-shrink-0 group/item">
                      <div className="w-20 h-20 md:w-24 md:h-24 rounded-full p-1 bg-blue-50 border border-transparent group-hover/item:border-primary-200 transition-colors overflow-hidden">
                        {/* Category image fallback handled by browser or could add onError */}
                        <img src={cat.image || "https://images.unsplash.com/photo-1596627702842-8703f47c3eb9?q=80&w=200"} alt={cat.name} className="w-full h-full object-cover rounded-full" onError={(e) => (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1596627702842-8703f47c3eb9?q=80&w=200"} />
                      </div>
                      <span className="text-xs md:text-sm font-medium text-gray-700 text-center leading-tight group-hover/item:text-primary-600 transition-colors">{cat.name}</span>
                    </div>
                  ))}
                </div>
                <button onClick={() => scroll('right')} className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white shadow-md rounded-full items-center justify-center text-gray-400 hover:text-primary-600 border border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            ) : null}
          </div>
        </div>

        {/* HERO SECTION */}
        <section className="bg-white py-4 md:py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {isLoadingHero ? (
              <HeroSkeleton />
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-auto lg:h-[450px]">
                {/* Main Banner */}
                <div
                  className="lg:col-span-2 relative rounded-2xl overflow-hidden cursor-pointer bg-[#f4f6ec] flex flex-col-reverse md:flex-row items-center h-[500px] md:h-auto group"
                  onClick={() => navigate(mainBanner?.link || '/catalog')}
                >
                  <div className="w-full md:w-1/2 p-6 md:p-12 z-10 flex flex-col justify-center items-start h-1/2 md:h-full relative">
                    <h2 className="text-3xl md:text-5xl font-bold text-[#5c632e] mb-4 leading-tight">
                      {mainBanner?.title || 'Yılın En taze Çiçekleri'}
                    </h2>
                    <p className="text-[#5c632e]/80 text-lg mb-8">
                      {mainBanner?.subtitle || 'Doğadan gelen zarafet, kapınıza gelsin.'}
                    </p>
                    <button className="bg-[#5c632e] text-white px-8 py-3 rounded-lg font-bold hover:bg-[#485626] transition-colors shadow-lg shadow-[#5c632e]/20">
                      {mainBanner?.buttonText || 'ALIŞVERİŞE BAŞLA'}
                    </button>
                  </div>
                  <div className="relative w-full md:absolute md:right-0 md:bottom-0 md:top-0 md:w-3/5 h-1/2 md:h-full transition-transform duration-700 group-hover:scale-105">
                    <img
                      src={mainBanner?.image || "https://images.unsplash.com/photo-1563241527-94d5b7580e66?q=80&w=800"}
                      className="w-full h-full object-cover object-center md:mask-image-gradient"
                      alt={mainBanner?.title || "Hero"}
                      onError={(e) => (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1563241527-94d5b7580e66?q=80&w=800"}
                      style={{ maskImage: window.innerWidth > 768 ? 'linear-gradient(to right, transparent, black 20%)' : 'none' }}
                    />
                  </div>
                </div>

                {/* Side Banners */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 lg:grid-rows-2 gap-4 lg:gap-6 h-auto lg:h-full mt-4 lg:mt-0">
                  <div
                    className="relative rounded-2xl overflow-hidden cursor-pointer bg-[#fbfbf9] flex items-center justify-between p-6 group"
                    onClick={() => navigate(topSideBanner?.link || '/catalog?category=buketler')}
                  >
                    <div className="w-1/2 z-10">
                      <h3 className="text-2xl font-bold text-[#5c632e] mb-4">
                        {topSideBanner?.title || 'Taptaze Buketler'}
                      </h3>
                      <button className="bg-[#5c632e] text-white text-xs font-bold px-4 py-2 rounded">
                        {topSideBanner?.buttonText || 'HEMEN İNCELE'}
                      </button>
                    </div>
                    <div className="absolute right-0 bottom-0 top-0 w-1/2 transition-transform duration-700 group-hover:scale-105 origin-right">
                      <img
                        src={topSideBanner?.image || "https://images.unsplash.com/photo-1596627702842-8703f47c3eb9?q=80&w=400"}
                        className="w-full h-full object-cover"
                        alt={topSideBanner?.title || "Buketler"}
                        onError={(e) => (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1596627702842-8703f47c3eb9?q=80&w=400"}
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-[#fbfbf9] to-transparent"></div>
                    </div>
                  </div>

                  <div
                    className="relative rounded-2xl overflow-hidden cursor-pointer bg-[#fbfbf9] flex items-center justify-between p-6 group"
                    onClick={() => navigate(bottomSideBanner?.link || '/catalog?category=cok-satanlar')}
                  >
                    <div className="w-1/2 z-10">
                      <h3 className="text-2xl font-bold text-[#5c632e] mb-4">
                        {bottomSideBanner?.title || 'Çok Satan Çiçekler'}
                      </h3>
                      <button className="bg-[#5c632e] text-white text-xs font-bold px-4 py-2 rounded">
                        {bottomSideBanner?.buttonText || 'HEMEN İNCELE'}
                      </button>
                    </div>
                    <div className="absolute right-0 bottom-0 top-0 w-1/2 transition-transform duration-700 group-hover:scale-105 origin-right">
                      <img
                        src={bottomSideBanner?.image || "https://images.unsplash.com/photo-1518709414768-a8c981a45e5d?q=80&w=400"}
                        className="w-full h-full object-cover"
                        alt={bottomSideBanner?.title || "Çok Satanlar"}
                        onError={(e) => (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1518709414768-a8c981a45e5d?q=80&w=400"}
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-[#fbfbf9] to-transparent"></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>



        {/* FEATURES BANNER */}
        <div className="w-full border-y border-gray-100 bg-white mb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="flex items-center gap-3">
                <Truck className="w-8 h-8 text-primary-600" />
                <div>
                  <div className="font-bold text-gray-800 text-sm">Aynı Gün Teslimat</div>
                  <div className="text-xs text-gray-500">Ordu içi aynı gün</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="w-8 h-8 text-primary-600" />
                <div>
                  <div className="font-bold text-gray-800 text-sm">Güvenli Ödeme</div>
                  <div className="text-xs text-gray-500">256-bit SSL koruması</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Star className="w-8 h-8 text-primary-600" />
                <div>
                  <div className="font-bold text-gray-800 text-sm">Müşteri Memnuniyeti</div>
                  <div className="text-xs text-gray-500">%100 İade Garantisi</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-8 h-8 text-primary-600" />
                <div>
                  <div className="font-bold text-gray-800 text-sm">7/24 Destek</div>
                  <div className="text-xs text-gray-500">Canlı destek hattı</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* PRODUCTS GRID */}
        <section className="py-8 bg-white px-4 sm:px-6 lg:px-8">
          <div className="max-w-[1400px] mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Hızlı Çiçek Siparişi: Dakikalar İçinde Sevdiklerine Online Çiçek ve Hediye Gönder!</h2>
            </div>

            {isLoadingProducts ? (
              <ProductsSkeleton />
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                {featuredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    name={product.name}
                    price={product.price}
                    originalPrice={product.compareAtPrice}
                    image={product.image || "https://images.unsplash.com/photo-1596627702842-8703f47c3eb9?q=80&w=600"}
                    rating={4.8}
                    reviews={120}
                    category={String(product.categoryId)}
                    inStock={product.stock}
                    onAddToCart={() => addToCart({ ...product, quantity: 1 })}
                    onProductClick={() => navigate(`/product/${product.id}`)}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* SIZE CAROUSEL */}
        <SizeCarousel
          banners={[
            sizeBanners.find(b => b.id === 'small') || {
              id: "small",
              subtitle: "Minimal & Şık",
              title: "Küçük Boy Sürprizler",
              videoUrl: "https://woodmart.xtemos.com/plants/wp-content/uploads/sites/12/2023/05/plants-banners-video-1-1.mp4",
              posterUrl: "https://woodmart.xtemos.com/plants/wp-content/uploads/sites/12/2023/05/plants-banners-image-1.jpg",
              link: "/catalog?size=small",
            },
            sizeBanners.find(b => b.id === 'medium') || {
              id: "medium",
              subtitle: "En İdeal Seçim",
              title: "Orta Boy Aranjmanlar",
              videoUrl: "https://woodmart.xtemos.com/plants/wp-content/uploads/sites/12/2023/05/plants-banners-video-2-1.mp4",
              posterUrl: "https://woodmart.xtemos.com/plants/wp-content/uploads/sites/12/2023/05/plants-banners-image-2.jpg",
              link: "/catalog?size=medium",
            },
            sizeBanners.find(b => b.id === 'large') || {
              id: "large",
              subtitle: "Gösterişli & Büyük",
              title: "Premium Koleksiyon",
              videoUrl: "https://woodmart.xtemos.com/plants/wp-content/uploads/sites/12/2023/05/plants-banners-video-3-1.mp4",
              posterUrl: "https://woodmart.xtemos.com/plants/wp-content/uploads/sites/12/2023/05/plants-banners-image-3.jpg",
              link: "/catalog?size=large",
            },
          ] as any[]} // explicit cast if needed or clean up types
        />
        <FlowerCareGuide />
      </main>

      <Footer />
    </div>
  );
}
