import { Link, useLocation } from 'react-router-dom'
import { Home, Search, ShoppingCart, User } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useCartStore } from '@/store/cartStore'
import { useAuthStore } from '@/store/authStore'

export default function BottomNavigation() {
  const location = useLocation()
  const { getTotalItems, toggleCart } = useCartStore()
  const { user } = useAuthStore()
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  // Hide on admin routes
  if (location.pathname.startsWith('/admin')) {
    return null
  }

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      // Show on scroll up, hide on scroll down (threshold 100px)
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false)
      } else {
        setIsVisible(true)
      }

      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  const isActive = (path: string) => location.pathname === path

  return (
    <nav
      className={`
        fixed bottom-0 left-0 right-0 z-50 md:hidden
        bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]
        transition-transform duration-300 ease-in-out pb-safe
        ${isVisible ? 'translate-y-0' : 'translate-y-full'}
      `}
    >
      <div className="grid grid-cols-4 h-16">
        {/* Home */}
        <Link
          to="/"
          className={`flex flex-col items-center justify-center space-y-1 ${isActive('/') ? 'text-primary-600' : 'text-gray-500'}`}
        >
          <Home className={`w-6 h-6 ${isActive('/') ? 'fill-current' : ''}`} strokeWidth={isActive('/') ? 2 : 1.5} />
          <span className="text-[10px] font-medium">Ana Sayfa</span>
        </Link>

        {/* Catalog */}
        <Link
          to="/catalog"
          className={`flex flex-col items-center justify-center space-y-1 ${isActive('/catalog') ? 'text-primary-600' : 'text-gray-500'}`}
        >
          <Search className="w-6 h-6" strokeWidth={isActive('/catalog') ? 2 : 1.5} />
          <span className="text-[10px] font-medium">Katalog</span>
        </Link>

        {/* Cart (Action Button) */}
        <button
          onClick={toggleCart}
          className="flex flex-col items-center justify-center space-y-1 text-gray-500 relative"
        >
          <div className="relative">
            <ShoppingCart className="w-6 h-6" strokeWidth={1.5} />
            {getTotalItems() > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-primary-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-white">
                {getTotalItems()}
              </span>
            )}
          </div>
          <span className="text-[10px] font-medium">Sepetim</span>
        </button>

        {/* Account */}
        <Link
          to={user ? "/profile" : "/login"}
          className={`flex flex-col items-center justify-center space-y-1 ${isActive('/profile') || isActive('/login') ? 'text-primary-600' : 'text-gray-500'}`}
        >
          <User className={`w-6 h-6 ${isActive('/profile') ? 'fill-current' : ''}`} strokeWidth={(isActive('/profile') || isActive('/login')) ? 2 : 1.5} />
          <span className="text-[10px] font-medium">{user ? 'Hesabım' : 'Giriş'}</span>
        </Link>
      </div>
    </nav>
  )
}
