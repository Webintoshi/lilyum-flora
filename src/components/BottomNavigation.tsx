import { Link, useLocation } from 'react-router-dom'
import { Home, ShoppingBag, Info, MessageSquare, Sprout } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function BottomNavigation() {
  const location = useLocation()
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      
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

  const navItems = [
    { path: '/', icon: Home, label: 'Ana Sayfa' },
    { path: '/catalog', icon: ShoppingBag, label: 'Ürünler' },
    { path: '/landscaping', icon: Sprout, label: 'Peyzaj' },
    { path: '/about', icon: Info, label: 'Hakkımızda' },
    { path: '/contact', icon: MessageSquare, label: 'İletişim' },
  ]

  const isActive = (path: string) => {
    return location.pathname === path
  }

  return (
    <nav 
      className={`
        fixed bottom-0 left-0 right-0 z-50 md:hidden
        bg-white border-t border-gray-200
        transition-transform duration-300 ease-in-out
        ${isVisible ? 'translate-y-0' : 'translate-y-full'}
      `}
      role="navigation"
      aria-label="Ana menü"
    >
      <div className="flex justify-around items-center py-2 px-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.path)
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`
                flex flex-col items-center justify-center
                min-w-[48px] min-h-[48px]
                p-2 rounded-lg
                transition-all duration-200
                ${active 
                  ? 'text-primary-600 bg-primary-50' 
                  : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
                }
              `}
              aria-label={item.label}
              aria-current={active ? 'page' : undefined}
            >
              <Icon 
                className={`
                  w-6 h-6 transition-all duration-200
                  ${active ? 'scale-110' : 'scale-100'}
                `} 
                strokeWidth={2}
              />
              <span 
                className={`
                  text-xs mt-1 font-medium transition-all duration-200
                  ${active ? 'text-primary-600' : 'text-gray-600'}
                `}
              >
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
