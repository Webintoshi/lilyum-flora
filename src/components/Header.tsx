import { ShoppingCart, User, Menu, X, Heart } from "lucide-react";
import { useWishlistStore } from "@/store/wishlistStore";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";
import { useSettingsStore } from "@/store/settingsStore";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { getTotalItems, toggleCart } = useCartStore();
  const { items: wishlistItems } = useWishlistStore();
  const { user, logout } = useAuthStore();
  const { settings, fetchSettings } = useSettingsStore();

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="bg-neutral-50 border-b border-neutral-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-3">
              {settings?.logo ? (
                <img
                  src={settings.logo}
                  alt={settings.siteName || 'Lilyum Flora'}
                  className="h-8 sm:h-10 w-auto object-contain"
                />
              ) : (
                <span className="text-xl sm:text-2xl font-bold text-primary-600">
                  {settings?.siteName || 'Lilyum Flora'}
                </span>
              )}
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-6 sm:space-x-8">
            <Link to="/" className="text-dark-700 hover:text-primary-600 transition-colors font-medium">
              Ana Sayfa
            </Link>
            <Link to="/catalog" className="text-dark-700 hover:text-primary-600 transition-colors font-medium">
              Katalog
            </Link>
            <Link to="/about" className="text-dark-700 hover:text-primary-600 transition-colors font-medium">
              Hakkımızda
            </Link>
            <Link to="/landscaping" className="text-dark-700 hover:text-primary-600 transition-colors font-medium">
              Peyzaj Uygulamaları
            </Link>
            <Link to="/contact" className="text-dark-700 hover:text-primary-600 transition-colors font-medium">
              İletişim
            </Link>
          </nav>

          <div className="flex items-center space-x-2 sm:space-x-4">
            <button
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                window.dispatchEvent(new CustomEvent('magic-dust', {
                  detail: {
                    x: rect.left + rect.width / 2,
                    y: rect.top + rect.height / 2,
                  },
                }));
                navigate('/wishlist');
              }}
              className="text-dark-700 hover:text-primary-600 relative p-1 transition-colors"
              aria-label="Favoriler"
            >
              <Heart className="w-5 h-5 sm:w-6 sm:h-6" />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-primary-600 text-white text-[10px] sm:text-xs w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center font-semibold">
                  {wishlistItems.length}
                </span>
              )}
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
                toggleCart();
              }}
              className="text-dark-700 hover:text-primary-600 relative p-1 transition-colors"
              aria-label="Sepet"
            >
              <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
              <span className="absolute -top-0.5 -right-0.5 bg-primary-600 text-white text-[10px] sm:text-xs w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center font-semibold">
                {getTotalItems()}
              </span>
            </button>

            {user ? (
              <div className="relative group hidden sm:block">
                <button className="flex items-center space-x-2 text-dark-700 hover:text-primary-600 transition-colors">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 bg-primary-50 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 sm:w-5 sm:h-5 text-primary-600" />
                  </div>
                  <span className="hidden lg:block font-medium">{user.name}</span>
                </button>

                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-neutral-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                  <div className="py-2">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-dark-700 hover:bg-primary-50 hover:text-primary-600 transition-colors"
                    >
                      Profilim
                    </Link>
                    <Link
                      to="/profile/orders"
                      className="block px-4 py-2 text-dark-700 hover:bg-primary-50 hover:text-primary-600 transition-colors"
                    >
                      Sipariş Geçmişi
                    </Link>
                    <Link
                      to="/profile/addresses"
                      className="block px-4 py-2 text-dark-700 hover:bg-primary-50 hover:text-primary-600 transition-colors"
                    >
                      Adreslerim
                    </Link>
                    <Link
                      to="/wishlist"
                      className="block px-4 py-2 text-dark-700 hover:bg-primary-50 hover:text-primary-600 transition-colors"
                    >
                      Favorilerim
                    </Link>
                    <hr className="my-2" />
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
                    >
                      Çıkış Yap
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link 
                to="/login" 
                className="hidden sm:block bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors font-medium text-sm sm:text-base"
              >
                Giriş Yap
              </Link>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-dark-700 hover:text-primary-600 p-1 transition-colors"
              aria-label="Menü"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <nav className="md:hidden border-t border-neutral-200 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className="flex flex-col space-y-4">
                <div className="flex items-center justify-between py-2 border-b border-neutral-100">
                  <div className="flex items-center space-x-2">
                    <Heart className="w-5 h-5 text-primary-600" />
                    <span className="font-semibold text-dark-800">Favorilerim</span>
                  </div>
                  <Link
                    to="/wishlist"
                    onClick={closeMobileMenu}
                    className="bg-primary-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium"
                  >
                    {wishlistItems.length} ürün
                  </Link>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-neutral-100">
                  <div className="flex items-center space-x-2">
                    <ShoppingCart className="w-5 h-5 text-primary-600" />
                    <span className="font-semibold text-dark-800">Sepetim</span>
                  </div>
                  <button
                    onClick={() => {
                      toggleCart();
                      closeMobileMenu();
                    }}
                    className="bg-primary-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium"
                  >
                    {getTotalItems()} ürün
                  </button>
                </div>

                <hr className="my-3" />

                <Link
                  to="/"
                  onClick={closeMobileMenu}
                  className="text-dark-700 hover:text-primary-600 transition-colors font-medium py-2"
                >
                  Ana Sayfa
                </Link>
                <Link
                  to="/catalog"
                  onClick={closeMobileMenu}
                  className="text-dark-700 hover:text-primary-600 transition-colors font-medium py-2"
                >
                  Katalog
                </Link>
                <Link
                  to="/about"
                  onClick={closeMobileMenu}
                  className="text-dark-700 hover:text-primary-600 transition-colors font-medium py-2"
                >
                  Hakkımızda
                </Link>
                <Link
                  to="/landscaping"
                  onClick={closeMobileMenu}
                  className="text-dark-700 hover:text-primary-600 transition-colors font-medium py-2"
                >
                  Peyzaj Uygulamaları
                </Link>
                <Link
                  to="/contact"
                  onClick={closeMobileMenu}
                  className="text-dark-700 hover:text-primary-600 transition-colors font-medium py-2"
                >
                  İletişim
                </Link>

                {user && (
                  <>
                    <hr className="my-3" />
                    <div className="space-y-3 py-2 border-t border-neutral-100">
                      <p className="text-sm text-dark-500 font-semibold">Hesabım</p>
                      <Link
                        to="/profile"
                        onClick={closeMobileMenu}
                        className="text-dark-700 hover:text-primary-600 transition-colors font-medium"
                      >
                        Profilim
                      </Link>
                      <Link
                        to="/profile/orders"
                        onClick={closeMobileMenu}
                        className="text-dark-700 hover:text-primary-600 transition-colors font-medium"
                      >
                        Sipariş Geçmişi
                      </Link>
                      <Link
                        to="/profile/addresses"
                        onClick={closeMobileMenu}
                        className="text-dark-700 hover:text-primary-600 transition-colors font-medium"
                      >
                        Adreslerim
                      </Link>
                      <button
                        onClick={() => {
                          handleLogout();
                          closeMobileMenu();
                        }}
                        className="text-left text-red-600 hover:text-red-700 transition-colors font-medium py-2"
                      >
                        Çıkış Yap
                      </button>
                    </div>
                  </>
                )}

                {!user && (
                  <Link
                    to="/login"
                    onClick={closeMobileMenu}
                    className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors font-semibold text-center block"
                  >
                    Giriş Yap
                  </Link>
                )}
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
