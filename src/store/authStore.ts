import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { auth, db } from '@/lib/firebase'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  User as FirebaseUser,
  updateProfile
} from 'firebase/auth'
import {
  doc,
  getDoc,
  setDoc,
  Timestamp
} from 'firebase/firestore'

export interface User {
  id: string
  name: string
  email: string
  phone?: string
  avatar?: string
  createdAt: string
  isAdmin?: boolean
}

interface AuthStore {
  isAuthenticated: boolean
  user: User | null
  token: string | null

  login: (email: string, password: string) => Promise<boolean>
  register: (name: string, email: string, phone: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
  fetchUser: () => Promise<void>

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
          const userCredential = await signInWithEmailAndPassword(auth, email, password)
          const firebaseUser = userCredential.user

          const token = await firebaseUser.getIdToken()
          const userData = await fetchCustomerData(firebaseUser.uid)

          set({
            isAuthenticated: true,
            user: userData,
            token: token,
          })

          return true
        } catch (error) {
          console.error('Login error:', error)
          return false
        }
      },

      register: async (name, email, phone, password) => {
        try {
          const userCredential = await createUserWithEmailAndPassword(auth, email, password)
          const firebaseUser = userCredential.user

          // Create customer document in Firestore
          const newUser: User = {
            id: firebaseUser.uid,
            name,
            email,
            phone,
            createdAt: new Date().toISOString(),
          }

          await setDoc(doc(db, 'customers', firebaseUser.uid), {
            ...newUser,
            updatedAt: new Date().toISOString()
          })

          // Update profile display name
          await updateProfile(firebaseUser, { displayName: name })

          const token = await firebaseUser.getIdToken()

          set({
            isAuthenticated: true,
            user: newUser,
            token: token,
          })

          return true
        } catch (error) {
          console.error('Register error:', error)
          return false
        }
      },

      logout: async () => {
        await signOut(auth)

        set({
          isAuthenticated: false,
          user: null,
          token: null,
        })

        localStorage.removeItem('auth-storage')
      },

      fetchUser: async () => {
        try {
          const firebaseUser = auth.currentUser

          if (firebaseUser) {
            const token = await firebaseUser.getIdToken()
            const userData = await fetchCustomerData(firebaseUser.uid)

            set({
              isAuthenticated: true,
              user: userData,
              token: token,
            })
          }
        } catch (error) {
          console.error('Fetch user error:', error)
        }
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

async function fetchCustomerData(uid: string): Promise<User | null> {
  try {
    const userDocRef = doc(db, 'customers', uid)
    const userDoc = await getDoc(userDocRef)

    if (userDoc.exists()) {
      return userDoc.data() as User
    }

    // Fallback if user exists in Auth but not in Firestore (legacy/import cases)
    const firebaseUser = auth.currentUser
    if (firebaseUser && firebaseUser.uid === uid) {
      return {
        id: firebaseUser.uid,
        name: firebaseUser.displayName || 'Unknown',
        email: firebaseUser.email || '',
        createdAt: firebaseUser.metadata.creationTime || new Date().toISOString()
      }
    }

    return null
  } catch (error) {
    console.error('Fetch customer data error:', error)
    return null
  }
}
