import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface User {
  id: number
  name: string
  email: string
  phone?: string
  avatar?: string
  createdAt: string
}

interface AuthStore {
  isAuthenticated: boolean
  user: User | null
  token: string | null
  
  login: (email: string, password: string) => Promise<boolean>
  register: (name: string, email: string, phone: string, password: string) => Promise<boolean>
  logout: () => void
  
  updateUser: (userData: Partial<User>) => void
  setToken: (token: string) => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      user: null,
      token: null,

      login: async (email, password) => {
        try {
          const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
          })

          if (!response.ok) {
            throw new Error('Giriş başarısız')
          }

          const data = await response.json()
          
          set({
            isAuthenticated: true,
            user: data.user,
            token: data.token,
          })
          
          return true
        } catch (error) {
          console.error('Login error:', error)
          return false
        }
      },

      register: async (name, email, phone, password) => {
        try {
          const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, phone, password }),
          })

          if (!response.ok) {
            throw new Error('Kayıt başarısız')
          }

          const data = await response.json()
          
          set({
            isAuthenticated: true,
            user: data.user,
            token: data.token,
          })
          
          return true
        } catch (error) {
          console.error('Register error:', error)
          return false
        }
      },

      logout: () => {
        set({
          isAuthenticated: false,
          user: null,
          token: null,
        })
        
        localStorage.removeItem('auth-storage')
      },

      updateUser: (userData) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
        }))
      },

      setToken: (token) => {
        set({ token })
      },
    }),
    {
      name: 'auth-storage',
    }
  )
)
