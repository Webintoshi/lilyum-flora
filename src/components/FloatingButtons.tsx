import { Phone, MessageCircle, MapPin } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function FloatingButtons() {
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
      icon: MessageCircle,
      label: 'WhatsApp',
      href: 'https://wa.me/905456284152',
      bgColor: 'bg-[#25D366]',
      hoverColor: 'hover:bg-[#128C7E]',
      shadowColor: 'shadow-green-500/30',
    },
    {
      icon: MapPin,
      label: 'Konum',
      href: 'https://maps.google.com/?q=Karşıyaka+Mah.+Kıbrıs+Cd.+No:49A+Altınordu/Ordu',
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
            <Icon className="w-6 h-6" strokeWidth={2.5} />
            
            <span className="absolute left-full ml-3 px-2 py-1 bg-gray-900 text-white text-xs font-medium rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
              {button.label}
            </span>
          </a>
        )
      })}
    </div>
  )
}
