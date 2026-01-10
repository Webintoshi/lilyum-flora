import { useState, useEffect } from "react";
import { Search, Grid3x3, List, ArrowUpDown, SlidersHorizontal, X, Filter } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductFilter from "@/components/ProductFilter";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { useNavigate } from "react-router-dom";
import type { Product } from "@/types";
import { supabase } from "@/lib/supabase";

export default function Catalog() {
  const navigate = useNavigate();
  const { addToCart, getTotalItems } = useCartStore();
  const { addToWishlist, items: wishlistItems } = useWishlistStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState({ min: 0, max: 2000 });
  const [sortBy, setSortBy] = useState("popular");
  const [activeFilters, setActiveFilters] = useState({
    categories: [] as string[],
    colors: [] as string[],
  });
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);
  const [showFilters, setShowFilters] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*, categories(name, slug)')
          .eq('is_active', true)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        setProducts(data || []);
      } catch (error) {
        console.error('Products fetch error:', error);
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

    fetchProducts();
    fetchCategories();
  }, []);

  const filterCategories = [
    {
      name: "Kategoriler",
      options: categories.map((cat) => ({
        id: cat.slug,
        name: cat.name,
        count: cat.productCount || 0,
      })),
    },
  ];

  const filterColors: { id: string; name: string; count: number }[] = [];

  const handleAddToCart = (product: any, event?: any) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
    }, event);
  };

  const handleAddToCartWithOpen = (product: any, event?: any) => {
    handleAddToCart(product, event);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const handleAddToWishlist = (item: any) => {
    console.log('Favoriye ekleniyor:', item);
    addToWishlist(item);
    navigate('/wishlist');
  };

  const handleCategoryToggle = (categoryName: string, optionId: string) => {
    setCurrentPage(1);
    setActiveFilters((prev) => {
      const newCategories = prev.categories.includes(optionId)
        ? prev.categories.filter((id) => id !== optionId)
        : [...prev.categories, optionId];
      return { ...prev, categories: newCategories };
    });
  };

  const handleColorToggle = (colorId: string) => {
    setCurrentPage(1);
    setActiveFilters((prev) => {
      const newColors = prev.colors.includes(colorId)
        ? prev.colors.filter((id) => id !== colorId)
        : [...prev.colors, colorId];
      return { ...prev, colors: newColors };
    });
  };

  const handleClearFilters = () => {
    setCurrentPage(1);
    setActiveFilters({ categories: [], colors: [] });
    setPriceRange({ min: 0, max: 2000 });
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.categories && product.categories.name.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesPrice = product.price >= priceRange.min && product.price <= priceRange.max;
    const matchesCategory =
      activeFilters.categories.length === 0 ||
      (product.categories && activeFilters.categories.some((cat) => product.categories.slug === cat));
    
    return matchesSearch && matchesPrice && matchesCategory;
  });

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleItemsPerPageChange = (value: number) => {
    setItemsPerPage(value);
    setCurrentPage(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-dark-800 mb-4 sm:mb-6">Ürün Kataloğu</h1>
          
          <div className="flex flex-col lg:flex-row gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-dark-400 w-4 h-4 sm:w-5 sm:h-5" />
              <input
                type="text"
                placeholder="Ürün ara..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-base sm:text-lg"
              />
            </div>
            
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-3 border border-neutral-300 rounded-lg hover:border-primary-600 transition-colors"
              >
                {viewMode === "grid" ? (
                  <List className="w-4 h-4 sm:w-5 sm:h-5 text-dark-700" />
                ) : (
                  <Grid3x3 className="w-4 h-4 sm:w-5 sm:h-5 text-dark-700" />
                )}
                <span className="hidden sm:inline text-sm">Görünüm</span>
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
                  toggleFilters();
                }}
                className="lg:hidden flex items-center gap-2 px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors relative"
              >
                <Filter className="w-4 h-4" />
                <span className="text-sm font-medium">Filtreler</span>
                {(activeFilters.categories.length > 0 || activeFilters.colors.length > 0) && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                    {activeFilters.categories.length + activeFilters.colors.length}
                  </span>
                )}
              </button>
              
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-3 sm:px-4 py-2 sm:py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white flex items-center gap-2 text-sm sm:text-base"
              >
                <option value="popular">Önerilen</option>
                <option value="price-asc">Fiyat: Düşükten Yükseğe</option>
                <option value="price-desc">Fiyat: Yüksekten Düşüğe</option>
                <option value="rating">En Çok Değerlendirilenler</option>
                <option value="newest">En Yeniler</option>
                <option value="bestseller">Çok Satanlar</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm text-dark-600 mb-6">
            <p className="text-sm sm:text-base">
              Toplam <span className="font-semibold">{filteredProducts.length}</span> ürün bulundu
            </p>
            <select
              value={itemsPerPage}
              onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
              className="p-2 border border-neutral-300 rounded-lg text-sm"
            >
              <option value={8}>8 ürün</option>
              <option value={12}>12 ürün</option>
              <option value={24}>24 ürün</option>
              <option value={48}>48 ürün</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          <aside className="hidden lg:block lg:w-72 flex-shrink-0">
            <ProductFilter
              categories={filterCategories}
              priceRange={priceRange}
              colors={filterColors}
              sortBy={sortBy}
              onPriceChange={(min, max) => {
                setPriceRange({ min, max });
                setCurrentPage(1);
              }}
              onCategoryToggle={handleCategoryToggle}
              onColorToggle={handleColorToggle}
              onSortChange={setSortBy}
              onClearFilters={handleClearFilters}
              activeFilters={activeFilters}
            />
          </aside>

          <aside className={`lg:hidden fixed inset-0 z-50 bg-dark-900/50 ${showFilters ? 'block' : 'hidden'}`}>
            <div className="absolute inset-0 bg-dark-900/50" onClick={toggleFilters} />
            <div className="absolute right-0 top-0 h-full w-full max-w-sm bg-white shadow-2xl overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-neutral-200 p-4 flex items-center justify-between z-10">
                <h3 className="text-lg font-bold text-dark-800 flex items-center gap-2">
                  <SlidersHorizontal className="w-5 h-5 text-primary-600" />
                  Filtreler
                </h3>
                <button
                  onClick={toggleFilters}
                  className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-dark-700" />
                </button>
              </div>
              <div className="p-4 pb-24">
                <ProductFilter
                  categories={filterCategories}
                  priceRange={priceRange}
                  colors={filterColors}
                  sortBy={sortBy}
                  onPriceChange={(min, max) => {
                    setPriceRange({ min, max });
                    setCurrentPage(1);
                  }}
                  onCategoryToggle={handleCategoryToggle}
                  onColorToggle={handleColorToggle}
                  onSortChange={setSortBy}
                  onClearFilters={handleClearFilters}
                  activeFilters={activeFilters}
                />
              </div>
              <div className="fixed bottom-0 right-0 w-full max-w-sm bg-white border-t border-neutral-200 p-4 shadow-lg">
                <div className="flex gap-2">
                  <button
                    onClick={handleClearFilters}
                    className="flex-1 bg-neutral-200 text-dark-700 py-3 rounded-lg hover:bg-neutral-300 transition-colors font-semibold"
                  >
                    Temizle
                  </button>
                  <button
                    onClick={toggleFilters}
                    className="flex-1 bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 transition-colors font-semibold"
                  >
                    Filtreleri Uygula
                  </button>
                </div>
              </div>
            </div>
          </aside>

          <div className="flex-1 min-h-[500px] order-2 lg:order-none">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-dark-600">Yükleniyor...</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="text-6xl mb-4">🌸</div>
                <p className="text-xl text-dark-600 mb-4">
                  Üzgünüz, kriterlerinize uygun ürün bulunamadı
                </p>
                <button
                  onClick={handleClearFilters}
                  className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors font-semibold"
                >
                  Filtreleri Temizle
                </button>
              </div>
            ) : viewMode === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                {paginatedProducts.map((product) => (
                  <ProductCard 
                    key={product.id} 
                    id={product.id}
                    name={product.name}
                    price={product.price}
                    originalPrice={product.originalPrice}
                    image={product.image}
                    rating={product.rating || 0}
                    reviews={product.reviews || 0}
                    category={product.categories?.name || ''}
                    inStock={product.stock || 0}
                    onAddToCart={(e) => handleAddToCartWithOpen(product, e)}
                    onAddToWishlist={() => handleAddToWishlist({ id: product.id, name: product.name, price: product.price, image: product.image })}
                    onProductClick={() => window.location.href = `/product/${product.id}`}
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                {paginatedProducts.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-3 sm:p-4"
                  >
                    <div className="flex gap-3 sm:gap-4">
                      <div className="flex-shrink-0 w-20 h-20 sm:w-32 sm:h-32 bg-gradient-to-br from-primary-50 to-primary-100 rounded flex items-center justify-center">
                        <span className="text-3xl sm:text-5xl">{product.image}</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-dark-800 text-sm sm:text-base lg:text-lg mb-1 sm:mb-2">{product.name}</h3>
                        <div className="flex items-center gap-1 mb-1 sm:mb-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <span
                              key={star}
                              className={`text-xs sm:text-sm lg:text-base ${
                                star <= (product.rating || 0) ? "text-yellow-400" : "text-dark-300"
                              }`}
                            >
                              ★
                            </span>
                          ))}
                          <span className="text-xs sm:text-sm text-dark-500 ml-1">({product.reviews || 0})</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-lg sm:text-xl lg:text-2xl font-bold text-primary-600">
                            {product.price} ₺
                          </span>
                          <button
                            onClick={(e) => {
                              const rect = e.currentTarget.getBoundingClientRect();
                              window.dispatchEvent(new CustomEvent('magic-dust', {
                                detail: {
                                  x: rect.left + rect.width / 2,
                                  y: rect.top + rect.height / 2,
                                },
                              }));
                              handleAddToCartWithOpen(product, e);
                            }}
                            className="bg-primary-600 text-white px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-primary-700 transition-colors text-xs sm:text-base"
                          >
                            Sepete Ekle
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {totalPages > 1 && filteredProducts.length > 0 && (
              <div className="mt-6 sm:mt-8 flex flex-col items-center gap-4">
                <div className="flex items-center justify-center gap-1 sm:gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 sm:px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-neutral-200 text-dark-700 hover:bg-neutral-300 text-sm sm:text-base"
                  >
                    ←
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg transition-colors text-sm sm:text-base ${
                        page === currentPage
                          ? "bg-primary-600 text-white"
                          : "bg-neutral-200 text-dark-700 hover:bg-neutral-300"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 sm:px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-neutral-200 text-dark-700 hover:bg-neutral-300 text-sm sm:text-base"
                  >
                    →
                  </button>
                </div>
                <p className="text-sm text-dark-600">
                  Sayfa {currentPage} / {totalPages}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
