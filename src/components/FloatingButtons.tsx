import { Phone, MapPin } from 'lucide-react'
import { useState, useEffect } from 'react'

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
  </svg>
)

import { useLocation } from 'react-router-dom'

export default function FloatingButtons() {
  const { pathname } = useLocation()
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  // Hide on admin routes
  if (pathname.startsWith('/admin')) {
    return null
  }

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

  const buttons = [
    {
      icon: Phone,
      label: 'Telefon',
      href: 'tel:+905456284152',
      bgColor: 'bg-green-600',
      hoverColor: 'hover:bg-green-700',
      shadowColor: 'shadow-green-500/30',
    },
    {
      icon: WhatsAppIcon,
      label: 'WhatsApp',
      href: 'https://wa.me/905456284152',
      bgColor: 'bg-[#25D366]',
      hoverColor: 'hover:bg-[#128C7E]',
      shadowColor: 'shadow-green-500/30',
    },
    {
      icon: MapPin,
      label: 'Konum',
      href: 'https://www.google.com/maps/place/Lilyum+Flora+%7C+Ordu+Alt%C4%B1nordu+%C3%87i%C3%A7ek%C3%A7i+%26+Peyzaj+Tasar%C4%B1m/@40.9744234,37.9001623,17z/data=!3m1!4b1!4m6!3m5!1s0x406321dd42c0a3b1:0x5f484fe20b5d266a!8m2!3d40.9744195!4d37.9050332!16s%2Fg%2F11yf2nsm1k?entry=ttu&g_ep=EgoyMDI2MDExMy4wIKXMDSoKLDEwMDc5MjA2OUgBUAM%3D',
      bgColor: 'bg-blue-600',
      hoverColor: 'hover:bg-blue-700',
      shadowColor: 'shadow-blue-500/30',
    },
  ]

  return (
    <div
      className={`
        fixed left-4 top-1/2 -translate-y-1/2 z-40
        flex flex-col gap-3
        transition-all duration-300 ease-in-out
        ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-full'}
      `}
      role="complementary"
      aria-label="Hızlı iletişim butonları"
    >
      {buttons.map((button, index) => {
        const Icon = button.icon

        return (
          <a
            key={index}
            href={button.href}
            target={button.href.startsWith('http') ? '_blank' : undefined}
            rel={button.href.startsWith('http') ? 'noopener noreferrer' : undefined}
            className={`
              flex items-center justify-center
              w-14 h-14 min-w-[56px] min-h-[56px]
              rounded-full
              ${button.bgColor} ${button.hoverColor}
              text-white
              shadow-lg ${button.shadowColor}
              transition-all duration-300
              hover:scale-110 hover:shadow-xl
              active:scale-95
              group relative
            `}
            aria-label={button.label}
            title={button.label}
          >
            <Icon className="w-8 h-8" />

            <span className="absolute left-full ml-3 px-2 py-1 bg-gray-900 text-white text-xs font-medium rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
              {button.label}
            </span>
          </a>
        )
      })}
    </div>
  )
}
