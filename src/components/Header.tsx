import { ShoppingCart, User, Menu, X, Heart, Search, Phone } from "lucide-react";
import { useWishlistStore } from "@/store/wishlistStore";
import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";
import { useSettingsStore } from "@/store/settingsStore";
import { useAdminStore } from "@/store/adminStore";
import { useSearch } from "@/hooks/useSearch";
import SearchOverlay from "@/components/SearchOverlay";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const navigate = useNavigate();
  const { getTotalItems, toggleCart } = useCartStore();
  const { items: wishlistItems } = useWishlistStore();
  const { user, logout } = useAuthStore();
  const { settings, fetchSettings } = useSettingsStore();
  const { categories, fetchCategories } = useAdminStore();

  const { results, isLoading, search, clearResults } = useSearch();
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchSettings();
    if (categories.length === 0) fetchCategories();
  }, []);

  // Search Effect
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm.length >= 3) {
        search(searchTerm);
      } else {
        clearResults();
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);


  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const closeMobileMenu = () => setMobileMenuOpen(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setIsFocused(false);
      navigate(`/catalog?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <header className="bg-white sticky top-0 z-50 shadow-sm font-sans">
      {/* Top Bar - Main Navigation */}
      <div className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20 gap-4">

            {/* Mobile Menu Button - Left */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 -ml-2 text-gray-700 hover:text-primary-600"
            >
              <Menu className="w-7 h-7" />
            </button>

            {/* Logo - Centered on Mobile, Left on Desktop */}
            <Link to="/" className="flex-shrink-0 flex items-center">
              {settings?.logo ? (
                <img
                  src={settings.logo}
                  alt={settings.siteName || 'Lilyum Flora'}
                  className="h-10 sm:h-12 w-auto object-contain"
                />
              ) : (
                <span className="text-2xl sm:text-3xl font-bold text-primary-600 tracking-tight">
                  {settings?.siteName || 'Lilyum Flora'}
                </span>
              )}
            </Link>

            {/* Search Bar - Hidden on Mobile, Centered on Desktop */}
            <div className="hidden md:flex flex-1 max-w-2xl px-8" ref={searchContainerRef}>
              <form onSubmit={handleSearch} className="w-full relative group">
                <input
                  type="text"
                  placeholder="Çiçek veya kategori ara..."
                  className="w-full pl-5 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-300 transition-all font-medium text-gray-700 placeholder:text-gray-400"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                />
                <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-primary-600 text-white rounded-full hover:bg-primary-700 transition-colors shadow-sm">
                  <Search className="w-5 h-5" />
                </button>

                {/* Desktop Search Overlay */}
                <SearchOverlay
                  results={results}
                  isLoading={isLoading}
                  isVisible={isFocused && searchTerm.length >= 3}
                  onClose={() => setIsFocused(false)}
                  searchTerm={searchTerm}
                />
              </form>
            </div>

            {/* Right Icons */}
            <div className="flex items-center space-x-1 sm:space-x-4">

              {/* Desktop User Section */}
              <div className="hidden md:flex items-center space-x-2">
                {user ? (
                  <div className="relative group">
                    <button className="flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-primary-600 transition-colors py-2">
                      <User className="w-6 h-6" />
                      <div className="text-left leading-tight hidden xl:block">
                        <div className="text-xs text-gray-500 font-normal">Merhaba,</div>
                        <div>{user.name.split(' ')[0]}</div>
                      </div>
                    </button>
                    {/* Dropdown would go here */}
                    <div className="absolute right-0 top-full pt-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                      <div className="bg-white rounded-xl shadow-xl border border-gray-100 py-2 overflow-hidden">
                        <Link to="/profile" className="block px-4 py-2 hover:bg-gray-50 text-gray-700">Profilim</Link>
                        <Link to="/profile/orders" className="block px-4 py-2 hover:bg-gray-50 text-gray-700">Siparişlerim</Link>
                        <div className="border-t border-gray-100 my-1"></div>
                        <button onClick={handleLogout} className="block w-full text-left px-4 py-2 hover:bg-red-50 text-red-600">Çıkış Yap</button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <Link to="/login" className="flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-primary-600 transition-colors py-2">
                    <User className="w-6 h-6" />
                    <div className="text-left leading-tight hidden xl:block">
                      <div className="text-xs text-gray-500 font-normal">Giriş Yap</div>
                      <div>veya Üye Ol</div>
                    </div>
                  </Link>
                )}
              </div>

              {/* Wishlist */}
              <Link to="/wishlist" className="hidden sm:flex items-center gap-2 relative p-2 text-gray-700 hover:text-primary-600 transition-colors">
                <Heart className="w-6 h-6" />
                {wishlistItems.length > 0 && <span className="absolute top-0 right-0 w-5 h-5 bg-primary-600 text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-white">{wishlistItems.length}</span>}
              </Link>

              {/* Cart */}
              <button onClick={toggleCart} className="flex items-center gap-2 relative p-2 text-gray-700 hover:text-primary-600 transition-colors">
                <ShoppingCart className="w-6 h-6" />
                {getTotalItems() > 0 && <span className="absolute top-0 right-0 w-5 h-5 bg-primary-600 text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-white">{getTotalItems()}</span>}
                <div className="text-left leading-tight hidden xl:block">
                  <div className="text-xs text-gray-500 font-normal">Sepetim</div>
                  <div className="text-sm font-bold text-primary-600">Sepet</div>
                </div>
              </button>

            </div>
          </div>
        </div>
      </div>

      {/* Secondary Navigation - Categories (Desktop) */}
      <div className="hidden md:block border-b border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center justify-center space-x-8">
            {/* Static Important Links */}
            <Link to="/catalog?category=all" className="py-4 text-sm font-bold text-gray-800 hover:text-primary-600 border-b-2 border-transparent hover:border-primary-600 transition-all uppercase tracking-wide">
              TÜM ÇİÇEKLER
            </Link>

            {/* Dynamic Top Categories */}
            {categories.slice(0, 6).map(cat => (
              <Link
                key={cat.id}
                to={`/catalog?category=${cat.slug}`}
                className="py-4 text-sm font-bold text-gray-600 hover:text-primary-600 border-b-2 border-transparent hover:border-primary-600 transition-all uppercase tracking-wide"
              >
                {cat.name}
              </Link>
            ))}

            <Link to="/landscaping" className="py-4 text-sm font-bold text-green-600 hover:text-green-700 border-b-2 border-transparent hover:border-green-600 transition-all uppercase tracking-wide">
              PEYSAJ
            </Link>
          </nav>
        </div>
      </div>

      {/* Mobile Search Bar (Visible only on mobile) */}
      <div className="md:hidden px-4 py-3 bg-gray-50 border-b border-gray-100 relative z-20">
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            placeholder="Ne aramak istersiniz?"
            className="w-full pl-4 pr-10 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500 text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsFocused(true)}
          />
          <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-primary-600">
            <Search className="w-5 h-5" />
          </button>
        </form>
        {/* Mobile Search Overlay */}
        <div className="relative">
          <SearchOverlay
            results={results}
            isLoading={isLoading}
            isVisible={isFocused && searchTerm.length >= 3}
            onClose={() => setIsFocused(false)}
            searchTerm={searchTerm}
          />
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/50" onClick={closeMobileMenu}></div>
          <div className="relative w-[300px] max-w-[85vw] bg-white h-full shadow-2xl flex flex-col animate-slide-in-left">

            {/* Mobile Header */}
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-primary-50">
              <span className="font-bold text-primary-900 text-lg">Menü</span>
              <button onClick={closeMobileMenu} className="p-1 bg-white rounded-full shadow-sm text-gray-500">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Mobile Nav Links */}
            <nav className="flex-1 overflow-y-auto py-4">
              <div className="space-y-1 px-3">
                <Link to="/" onClick={closeMobileMenu} className="flex items-center gap-3 px-4 py-3 rounded-lg bg-primary-50 text-business-primary font-bold">
                  <div className="w-1 h-1 bg-primary-600 rounded-full"></div> Ana Sayfa
                </Link>

                <div className="pt-4 pb-2 px-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Kategoriler</div>
                {categories.map(cat => (
                  <Link
                    key={cat.id}
                    to={`/catalog?category=${cat.slug}`}
                    onClick={closeMobileMenu}
                    className="block px-4 py-3 text-gray-700 font-medium hover:bg-gray-50 rounded-lg border-b border-gray-50"
                  >
                    {cat.name}
                  </Link>
                ))}

                <div className="pt-6 pb-2 px-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Kurumsal</div>
                <Link to="/about" onClick={closeMobileMenu} className="block px-4 py-3 text-gray-600">Hakkımızda</Link>
                <Link to="/contact" onClick={closeMobileMenu} className="block px-4 py-3 text-gray-600">İletişim</Link>
              </div>
            </nav>

            {/* Mobile Footer Area */}
            <div className="p-4 border-t border-gray-100 bg-gray-50">
              {user ? (
                <button onClick={handleLogout} className="w-full py-3 bg-white border border-gray-200 text-red-600 font-bold rounded-xl shadow-sm">
                  Çıkış Yap
                </button>
              ) : (
                <Link to="/login" onClick={closeMobileMenu} className="block w-full py-3 bg-primary-600 text-white font-bold text-center rounded-xl shadow-md">
                  Giriş Yap / Üye Ol
                </Link>
              )}
            </div>

          </div>
        </div>
      )}

    </header>
  );
}
