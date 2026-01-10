import { useState, useEffect, useCallback } from 'react'

interface Particle {
  id: number
  x: number
  y: number
  emoji: string
  angle: number
  distance: number
  delay: number
}

const FLOWERS = ['🌸', '🌷', '🌹', '🌼', '💐', '🌺', '🌻', '🌸', '🌷', '🌹', '🌼', '💐', '🌺', '🌻']
const RATE_LIMIT_MS = 0
const PARTICLE_COUNT = 15

export default function MagicDustEffect() {
  const [particles, setParticles] = useState<Particle[]>([])
  const [lastClickTime, setLastClickTime] = useState(0)
  const [particleId, setParticleId] = useState(0)

  const createParticles = useCallback((x: number, y: number) => {
    const now = Date.now()
    if (now - lastClickTime < RATE_LIMIT_MS) {
      return
    }
    
    setLastClickTime(now)

    const newParticles: Particle[] = Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
      id: particleId + i,
      x,
      y,
      emoji: FLOWERS[Math.floor(Math.random() * FLOWERS.length)],
      angle: (360 / PARTICLE_COUNT) * i + Math.random() * 30 - 15,
      distance: 40 + Math.random() * 60,
      delay: Math.random() * 50,
    }))

    setParticles(newParticles)
    setParticleId(prev => prev + PARTICLE_COUNT)

    setTimeout(() => {
      setParticles([])
    }, 1200)
  }, [lastClickTime, particleId])

  useEffect(() => {
    const handleMagicDust = (e: Event) => {
      const customEvent = e as CustomEvent
      if (customEvent.detail) {
        createParticles(customEvent.detail.x, customEvent.detail.y)
      }
    }

    window.addEventListener('magic-dust', handleMagicDust)

    return () => {
      window.removeEventListener('magic-dust', handleMagicDust)
    }
  }, [createParticles])

  if (particles.length === 0) return null

  return (
    <>
      {particles.map((particle) => {
        const radians = (particle.angle * Math.PI) / 180
        const endX = Math.cos(radians) * particle.distance
        const endY = Math.sin(radians) * particle.distance

        return (
          <div
            key={particle.id}
            className="fixed pointer-events-none z-[100] magic-spread"
            style={{
              left: particle.x,
              top: particle.y,
              transform: 'translate(-50%, -50%)',
              animationDelay: `${particle.delay}ms`,
            }}
          >
            <div
              className="text-base sm:text-lg particle-fade"
              style={{
                transform: `translate(${endX}px, ${endY}px)`,
                animationDelay: `${particle.delay}ms`,
              }}
            >
              {particle.emoji}
            </div>
          </div>
        )
      })}
    </>
  )
}
