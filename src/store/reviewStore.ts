import { create } from 'zustand'
import { db } from '@/lib/firebase'
import { collection, query, orderBy, getDocs, addDoc, updateDoc, deleteDoc, doc, where, getDoc } from 'firebase/firestore'

export interface Review {
  id: string
  productId: string
  userId: string
  orderId?: string
  rating: number
  title?: string
  comment: string
  createdAt: string
  updatedAt: string
  isVerified: boolean
  helpfulCount: number
  userName?: string
  userAvatar?: string
}

interface ReviewStore {
  reviews: Review[]
  userReviews: Review[]
  productReviews: Review[]
  isLoading: boolean
  error: string | null

  fetchReviews: () => Promise<void>
  fetchProductReviews: (productId: string) => Promise<void>
  fetchUserReviews: (userId: string) => Promise<void>
  addReview: (review: Omit<Review, 'id' | 'createdAt' | 'updatedAt' | 'helpfulCount'>) => Promise<Review | null>
  updateReview: (id: string, data: Partial<Review>) => Promise<void>
  deleteReview: (id: string) => Promise<void>
  markAsHelpful: (reviewId: string) => Promise<void>
  getProductAverageRating: (productId: string) => Promise<number>
}

export const useReviewStore = create<ReviewStore>((set, get) => ({
  reviews: [],
  userReviews: [],
  productReviews: [],
  isLoading: false,
  error: null,

  fetchReviews: async () => {
    set({ isLoading: true, error: null })
    try {
      const q = query(collection(db, 'reviews'), orderBy('createdAt', 'desc'))
      const querySnapshot = await getDocs(q)
      const reviews: Review[] = []
      querySnapshot.forEach(doc => {
        reviews.push({ id: doc.id, ...doc.data() } as unknown as Review)
      })

      set({ reviews, isLoading: false })
    } catch (error) {
      console.error('Fetch reviews error:', error)
      set({ error: 'Yorumlar yüklenemedi', isLoading: false })
    }
  },

  fetchProductReviews: async (productId) => {
    set({ isLoading: true, error: null })
    try {
      const q = query(
        collection(db, 'reviews'),
        where('productId', '==', productId),
        orderBy('createdAt', 'desc')
      )
      const querySnapshot = await getDocs(q)
      const reviews: Review[] = []
      querySnapshot.forEach(doc => {
        reviews.push({ id: doc.id, ...doc.data() } as unknown as Review)
      })

      set({ productReviews: reviews, isLoading: false })
    } catch (error) {
      console.error('Fetch product reviews error:', error)
      set({ error: 'Ürün yorumları yüklenemedi', isLoading: false })
    }
  },

  fetchUserReviews: async (userId) => {
    set({ isLoading: true, error: null })
    try {
      const q = query(
        collection(db, 'reviews'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      )
      const querySnapshot = await getDocs(q)
      const reviews: Review[] = []
      querySnapshot.forEach(doc => {
        reviews.push({ id: doc.id, ...doc.data() } as unknown as Review)
      })

      set({ userReviews: reviews, isLoading: false })
    } catch (error) {
      console.error('Fetch user reviews error:', error)
      set({ error: 'Kullanıcı yorumları yüklenemedi', isLoading: false })
    }
  },

  addReview: async (review) => {
    set({ isLoading: true, error: null })
    try {
      const newReviewData = {
        ...review,
        helpfulCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      const docRef = await addDoc(collection(db, 'reviews'), newReviewData)

      const newReview: Review = {
        id: docRef.id,
        ...newReviewData
      } as unknown as Review

      set(state => ({
        reviews: [newReview, ...state.reviews],
        productReviews: [newReview, ...state.productReviews],
        userReviews: [newReview, ...state.userReviews],
        isLoading: false,
      }))

      return newReview
    } catch (error) {
      console.error('Add review error:', error)
      set({ error: 'Yorum eklenemedi', isLoading: false })
      return null
    }
  },

  updateReview: async (id, data) => {
    try {
      const reviewRef = doc(db, 'reviews', String(id))
      await updateDoc(reviewRef, {
        ...data,
        updatedAt: new Date().toISOString()
      })

      set(state => ({
        reviews: state.reviews.map(r => r.id === id ? { ...r, ...data } : r),
        productReviews: state.productReviews.map(r => r.id === id ? { ...r, ...data } : r),
        userReviews: state.userReviews.map(r => r.id === id ? { ...r, ...data } : r),
      }))
    } catch (error) {
      console.error('Update review error:', error)
      set({ error: 'Yorum güncellenemedi' })
    }
  },

  deleteReview: async (id) => {
    try {
      await deleteDoc(doc(db, 'reviews', String(id)))

      set(state => ({
        reviews: state.reviews.filter(r => r.id !== id),
        productReviews: state.productReviews.filter(r => r.id !== id),
        userReviews: state.userReviews.filter(r => r.id !== id),
      }))
    } catch (error) {
      console.error('Delete review error:', error)
      set({ error: 'Yorum silinemedi' })
    }
  },

  markAsHelpful: async (reviewId) => {
    try {
      const reviewRef = doc(db, 'reviews', String(reviewId))
      const reviewDoc = await getDoc(reviewRef)

      if (!reviewDoc.exists()) return

      const currentCount = reviewDoc.data().helpfulCount || 0

      await updateDoc(reviewRef, { helpfulCount: currentCount + 1 })

      set(state => ({
        reviews: state.reviews.map(r => r.id === reviewId ? { ...r, helpfulCount: r.helpfulCount + 1 } : r),
        productReviews: state.productReviews.map(r => r.id === reviewId ? { ...r, helpfulCount: r.helpfulCount + 1 } : r),
        userReviews: state.userReviews.map(r => r.id === reviewId ? { ...r, helpfulCount: r.helpfulCount + 1 } : r),
      }))
    } catch (error) {
      console.error('Mark as helpful error:', error)
    }
  },

  getProductAverageRating: async (productId) => {
    try {
      const q = query(
        collection(db, 'reviews'),
        where('productId', '==', productId)
      )
      const querySnapshot = await getDocs(q)

      if (querySnapshot.empty) return 0

      const reviews: any[] = []
      querySnapshot.forEach(doc => reviews.push(doc.data()))

      const total = reviews.reduce((sum, r) => sum + (r.rating || 0), 0)
      return total / reviews.length
    } catch (error) {
      console.error('Get average rating error:', error)
      return 0
    }
  },
}))
