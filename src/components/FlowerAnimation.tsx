import { useState, useEffect } from 'react'

export default function FlowerAnimation() {
  const [showAnimation, setShowAnimation] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleFlowerAnimation = (e: Event) => {
      const customEvent = e as CustomEvent
      if (customEvent.detail) {
        setPosition({ x: customEvent.detail.x, y: customEvent.detail.y })
        setShowAnimation(true)
        setTimeout(() => setShowAnimation(false), 800)
      }
    }

    window.addEventListener('flower-animation', handleFlowerAnimation)

    return () => {
      window.removeEventListener('flower-animation', handleFlowerAnimation)
    }
  }, [])

  if (!showAnimation) return null

  return (
    <div
      className="fixed pointer-events-none z-[100]"
      style={{
        left: position.x,
        top: position.y,
        transform: 'translate(-50%, -50%)'
      }}
    >
      <div className="text-6xl petal-fade-in">🌸</div>
    </div>
  )
}
