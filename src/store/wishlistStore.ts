import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface WishlistItem {
  id: string | number
  name: string
  price: number
  image: string
}

interface WishlistStore {
  items: WishlistItem[]
  addToWishlist: (item: WishlistItem) => void
  removeFromWishlist: (id: string | number) => void
  clearWishlist: () => void
  isInWishlist: (id: string | number) => boolean
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],

      addToWishlist: (item) => {
        set((state) => {
          const exists = state.items.find((i) => i.id === item.id)
          if (exists) return state
          return { items: [...state.items, item] }
        })
      },

      removeFromWishlist: (id) => {
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
        }))
      },

      clearWishlist: () => set({ items: [] }),

      isInWishlist: (id) => {
        return get().items.some((i) => i.id === id)
      },
    }),
    {
      name: 'wishlist-storage',
    }
  )
)
