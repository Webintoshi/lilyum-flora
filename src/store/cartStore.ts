import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  id: number
  name: string
  price: number
  image: string
  quantity: number
}

interface CartStore {
  items: CartItem[]
  isOpen: boolean
  addToCart: (item: CartItem, event?: any) => void
  removeFromCart: (id: number) => void
  updateQuantity: (id: number, quantity: number) => void
  clearCart: () => void
  toggleCart: () => void
  getTotalPrice: () => number
  getTotalItems: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
    
      addToCart: (item, event) => {
        set((state) => {
          const existingItem = state.items.find((i) => i.id === item.id)
          if (existingItem) {
            return {
                items: state.items.map((i) =>
                  i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
                ),
              }
          }
          return { items: [...state.items, item] }
        })

        if (event && event.currentTarget) {
          const rect = event.currentTarget.getBoundingClientRect();
          setTimeout(() => {
            window.dispatchEvent(new CustomEvent('flower-animation', {
              detail: {
                x: rect.left + rect.width / 2,
                y: rect.top + rect.height / 2,
              },
            }))
          }, 10)
        }

        set({ isOpen: true })
      },
    
      removeFromCart: (id) => {
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
        }))
      },
    
      updateQuantity: (id, quantity) => {
        set((state) => ({
          items: state.items.map((i) =>
            i.id === id ? { ...i, quantity: Math.max(0, quantity) } : i
          ),
        }))
      },
    
      clearCart: () => set({ items: [] }),
    
      toggleCart: () => {
        set((state) => ({ isOpen: !state.isOpen }))
      },
    
      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0)
      },
    
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0)
      },
    }),
    {
      name: 'cart-storage',
    }
  )
)
