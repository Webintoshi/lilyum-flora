import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { auth, db } from '@/lib/firebase'
import {
  signInWithEmailAndPassword,
  signOut
} from 'firebase/auth'
import {
  collection,
  getDocs,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  setDoc,
  limit,
  writeBatch,
  getCountFromServer
} from 'firebase/firestore'
import { uploadToR2 } from '@/lib/r2'
import type { Product, Order, Customer, Category, SEOSettings, DashboardStats, SalesData, AdminUser, SizeBanner, HeroBanner, PageSEO } from '../types'

const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || import.meta.env.ADMIN_EMAIL || ''

interface AdminStore {
  // ... (keep state interface same)
  isAuthenticated: boolean
  admin: AdminUser | null
  token: string | null

  products: Product[]
  orders: Order[]
  customers: Customer[]
  categories: Category[]
  seoSettings: SEOSettings | null
  dashboardStats: DashboardStats | null
  salesData: SalesData[]
  sizeBanners: SizeBanner[]
  heroBanner: HeroBanner | null
  heroBanners: HeroBanner[]

  login: (email: string, password: string) => Promise<boolean>
  logout: () => void

  fetchProducts: () => Promise<void>
  createProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>
  updateProduct: (id: number | string, product: Partial<Product>) => Promise<void>
  deleteProduct: (id: number | string) => Promise<void>

  fetchOrders: (filters?: any) => Promise<void>
  updateOrderStatus: (id: number | string, status: string) => Promise<void>
  updateOrderTracking: (id: number | string, trackingNumber: string) => Promise<void>
  deleteOrder: (id: number | string) => Promise<void>

  fetchCustomers: () => Promise<void>
  updateCustomer: (id: number | string, customer: Partial<Customer>) => Promise<void>
  deleteCustomer: (id: number | string) => Promise<void>

  fetchCategories: () => Promise<void>
  createCategory: (category: Omit<Category, 'id' | 'productCount' | 'createdAt' | 'updatedAt'>) => Promise<Category>
  updateCategory: (id: number | string, category: Partial<Category>) => Promise<Category>
  deleteCategory: (id: number | string) => Promise<void>

  fetchSizeBanners: () => Promise<void>
  createSizeBanner: (banner: Omit<SizeBanner, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>
  updateSizeBanner: (id: number | string, banner: Partial<SizeBanner>) => Promise<void>
  deleteSizeBanner: (id: number | string) => Promise<void>
  updateFixedBanner: (id: string, banner: Partial<SizeBanner>) => Promise<void>
  reorderSizeBanners: (ids: (number | string)[]) => Promise<void>

  fetchHeroBanners: () => Promise<void>
  createHeroBanner: (banner: Omit<HeroBanner, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>
  updateHeroBanner: (id: number | string, banner: Partial<HeroBanner>) => Promise<void>
  deleteHeroBanner: (id: number | string) => Promise<void>
  fetchActiveHeroBanner: () => Promise<void>

  fetchSEOSettings: () => Promise<void>
  uploadFile: (file: File) => Promise<string>
  updateSEOSettings: (settings: Partial<SEOSettings>) => Promise<SEOSettings>

  // Page SEO Methods
  pageSEO: PageSEO[]
  fetchPageSEO: () => Promise<void>
  updatePageSEO: (page: string, data: Partial<PageSEO>) => Promise<void>

  fetchDashboardStats: () => Promise<void>
  fetchSalesData: (days?: number) => Promise<void>
}

const savedToken = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null
const savedAdminUser = typeof window !== 'undefined' ? localStorage.getItem('adminUser') : null

export const useAdminStore = create<AdminStore>()(
  persist(
    (set, get) => ({
      isAuthenticated: !!savedToken,
      admin: savedAdminUser ? JSON.parse(savedAdminUser) : null,
      token: savedToken,
      products: [],
      orders: [],
      customers: [],
      categories: [],
      seoSettings: null,
      dashboardStats: null,
      salesData: [],
      sizeBanners: [],
      heroBanner: null,
      heroBanners: [],
      // Page SEO
      pageSEO: [],

      login: async (email: string, password: string) => {
        try {
          // Firebase Auth login
          const userCredential = await signInWithEmailAndPassword(auth, email, password)

          // Check if email matches admin email (simple check)
          if (email !== ADMIN_EMAIL) {
            await signOut(auth)
            return false
          }

          const user: AdminUser = {
            id: userCredential.user.uid,
            email: userCredential.user.email || '',
            role: 'admin',
            createdAt: userCredential.user.metadata.creationTime || new Date().toISOString(),
          }
          const token = await userCredential.user.getIdToken()

          set({
            isAuthenticated: true,
            admin: user,
            token,
          })
          localStorage.setItem('adminToken', token)
          localStorage.setItem('adminUser', JSON.stringify(user))
          return true
        } catch (error) {
          console.error('Login error:', error)
          // Fallback for hardcoded admin if firebase fails or just to support legacy behavior temporarily
          if (email === ADMIN_EMAIL && password === import.meta.env.VITE_ADMIN_PASSWORD) {
            const user: AdminUser = {
              id: 'admin-local',
              email: ADMIN_EMAIL,
              role: 'admin',
              createdAt: new Date().toISOString(),
            }
            const token = 'admin-local-token'
            set({
              isAuthenticated: true,
              admin: user,
              token,
            })
            localStorage.setItem('adminToken', token)
            localStorage.setItem('adminUser', JSON.stringify(user))
            return true
          }
          return false
        }
      },

      logout: async () => {
        await signOut(auth)
        set({
          isAuthenticated: false,
          admin: null,
          token: null,
        })
        localStorage.removeItem('adminToken')
        localStorage.removeItem('adminUser')
      },

      fetchProducts: async () => {
        try {
          const q = query(collection(db, 'products'))
          const querySnapshot = await getDocs(q)
          const data: Product[] = []
          querySnapshot.forEach((doc) => {
            const productData = doc.data()
            // Map Firestore data to Product type
            data.push({
              id: doc.id,
              ...productData,
              // Handle category mapping if needed or leave as partial
              categories: null
            } as unknown as Product)
          })
          set({ products: data })
        } catch (error) {
          console.error('Fetch products error:', error)
        }
      },

      createProduct: async (product) => {
        try {
          const newProductData = {
            name: product.name,
            slug: product.slug,
            description: product.description,
            price: product.price,
            compare_at_price: product.compareAtPrice,
            category_id: product.categoryId,
            image: product.image || (product.images && product.images[0]) || '',
            images: product.images || [],
            stock: product.stock,
            isActive: product.isActive !== false,
            featured: product.featured || false,
            sizes: product.sizes || [],
            colors: product.colors || [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }

          const docRef = await addDoc(collection(db, 'products'), newProductData)

          const createdProduct = {
            id: docRef.id,
            ...newProductData,
            categories: null
          } as unknown as Product

          set({ products: [createdProduct, ...get().products] })
          return
        } catch (error) {
          console.error('Create product error:', error)
          throw error
        }
      },

      updateProduct: async (id, product) => {
        try {
          const productRef = doc(db, 'products', String(id))
          const updateData = {
            name: product.name,
            slug: product.slug,
            description: product.description,
            price: product.price,
            compare_at_price: product.compareAtPrice,
            category_id: product.categoryId,
            image: product.image || (product.images && product.images[0]) || '',
            images: product.images || [],
            stock: product.stock,
            isActive: product.isActive !== false,
            featured: product.featured || false,
            sizes: product.sizes || [],
            colors: product.colors || [],
            updatedAt: new Date().toISOString(),
          }

          // Remove undefined fields
          Object.keys(updateData).forEach(key => updateData[key as keyof typeof updateData] === undefined && delete updateData[key as keyof typeof updateData])

          await updateDoc(productRef, updateData)

          // Fetch updated doc to be safe or just update local state
          const updatedProduct = {
            id: id,
            ...updateData,
            // retain existing fields if needed, but for now this is fine
          }

          set({
            products: get().products.map((p) => (p.id === id ? { ...p, ...updatedProduct } as Product : p)),
          })
          return
        } catch (error) {
          console.error('Update product error:', error)
          throw error
        }
      },

      deleteProduct: async (id) => {
        try {
          await deleteDoc(doc(db, 'products', String(id)))

          set({
            products: get().products.filter((p) => p.id !== id),
          })
        } catch (error) {
          console.error('Delete product error:', error)
        }
      },

      fetchOrders: async (filters) => {
        try {
          let q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'))

          if (filters?.status) {
            q = query(q, where('status', '==', filters.status))
          }

          const querySnapshot = await getDocs(q)
          const data: Order[] = []
          querySnapshot.forEach((doc) => {
            const orderData = doc.data()
            // Map customer info from shipping if available, or fallback to legacy fields
            const shipping = orderData.shipping || {};
            data.push({
              id: doc.id,
              ...orderData,
              customer: {
                name: shipping.name || (orderData as any).customerName || 'Misafir',
                email: (orderData as any).customerEmail || 'misafir@lilyumflora.net',
                phone: shipping.phone || ''
              }
            } as unknown as Order)
          })

          set({ orders: data })
        } catch (error) {
          console.error('Fetch orders error:', error)
        }
      },

      updateOrderStatus: async (id, status) => {
        try {
          const orderRef = doc(db, 'orders', String(id))
          await updateDoc(orderRef, {
            status,
            updatedAt: new Date().toISOString()
          })

          const updatedOrder = { status, updatedAt: new Date().toISOString() }

          set({
            orders: get().orders.map((o) => (o.id === id ? { ...o, ...updatedOrder, status: status as Order['status'] } : o)),
          })
        } catch (error) {
          console.error('Update order status error:', error)
        }
      },

      updateOrderTracking: async (id, trackingNumber) => {
        try {
          const orderRef = doc(db, 'orders', String(id))
          await updateDoc(orderRef, {
            tracking_number: trackingNumber,
            updatedAt: new Date().toISOString()
          })

          set({
            orders: get().orders.map((o) => (o.id === id ? { ...o, tracking_number: trackingNumber, updatedAt: new Date().toISOString() } : o)),
          })
        } catch (error) {
          console.error('Update order tracking error:', error)
        }
      },

      deleteOrder: async (id) => {
        try {
          await deleteDoc(doc(db, 'orders', String(id)))

          set({
            orders: get().orders.filter((o) => o.id !== id),
          })
        } catch (error) {
          console.error('Delete order error:', error)
        }
      },

      fetchCustomers: async () => {
        try {
          const q = query(collection(db, 'customers'), orderBy('createdAt', 'desc'))
          const querySnapshot = await getDocs(q)
          const data: Customer[] = []
          querySnapshot.forEach((doc) => {
            data.push({ id: doc.id, ...doc.data() } as unknown as Customer)
          })

          set({ customers: data })
        } catch (error) {
          console.error('Fetch customers error:', error)
        }
      },

      updateCustomer: async (id, customer) => {
        try {
          const customerRef = doc(db, 'customers', String(id))
          const updateData = {
            ...customer,
            updatedAt: new Date().toISOString(),
          }
          await updateDoc(customerRef, updateData)

          set({
            customers: get().customers.map((c) => (c.id === id ? { ...c, ...updateData } as Customer : c)),
          })
        } catch (error) {
          console.error('Update customer error:', error)
        }
      },

      deleteCustomer: async (id) => {
        try {
          await deleteDoc(doc(db, 'customers', String(id)))

          set({
            customers: get().customers.filter((c) => c.id !== id),
          })
        } catch (error) {
          console.error('Delete customer error:', error)
        }
      },

      fetchCategories: async () => {
        try {
          // Fetch categories and products in parallel for accurate counting
          const [categoriesSnap, productsSnap] = await Promise.all([
            getDocs(query(collection(db, 'categories'), orderBy('name', 'asc'))),
            getDocs(collection(db, 'products'))
          ])

          // Calculate product counts
          const productCounts: Record<string, number> = {}
          const products = productsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as any))

          // 1. First pass: Map categories to IDs/Slugs for robust matching
          const categoryMap = new Map() // ID -> Category
          categoriesSnap.forEach(doc => {
            categoryMap.set(doc.id, { id: doc.id, ...doc.data() })
          })

          products.forEach(product => {
            // Try to find the category for this product
            let matchedCategoryId: string | null = null

            const pCatId = product.category_id || product.categoryId
            if (pCatId && categoryMap.has(String(pCatId))) {
              matchedCategoryId = String(pCatId)
            } else {
              // Fallback: Name based match (Robust like Catalog.tsx)
              const pCatName = (product.category || '').toLowerCase()

              // Find category where slug or name matches
              for (const [id, cat] of categoryMap.entries()) {
                if ((cat.slug && cat.slug.toLowerCase() === pCatName) ||
                  (cat.name && cat.name.toLowerCase() === pCatName)) {
                  matchedCategoryId = id
                  break
                }
              }
            }

            if (matchedCategoryId) {
              productCounts[matchedCategoryId] = (productCounts[matchedCategoryId] || 0) + 1
            }
          })

          const data: Category[] = []
          categoriesSnap.forEach((doc) => {
            const catData = doc.data()
            data.push({
              id: doc.id,
              name: catData.name,
              slug: catData.slug,
              description: catData.description,
              image: catData.image,
              icon: catData.icon,
              productCount: productCounts[doc.id] || 0, // Using calculated count
              isActive: catData.isActive !== false,
              createdAt: catData.createdAt,
              updatedAt: catData.updatedAt,
            } as Category)
          })

          set({ categories: data })
        } catch (error) {
          console.error('Fetch categories error:', error)
        }
      },

      createCategory: async (category) => {
        try {
          const newCategoryData = {
            name: category.name,
            slug: category.slug,
            description: category.description,
            image: category.image,
            icon: category.icon,
            isActive: category.isActive !== false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }

          const docRef = await addDoc(collection(db, 'categories'), newCategoryData)

          const createdCategory = { id: docRef.id, ...newCategoryData, productCount: 0 } as Category
          set({ categories: [...get().categories, createdCategory] })
          return createdCategory
        } catch (error) {
          console.error('Create category error:', error)
          throw error
        }
      },

      updateCategory: async (id, category) => {
        try {
          const categoryRef = doc(db, 'categories', String(id))
          const updateData = {
            name: category.name,
            slug: category.slug,
            description: category.description,
            image: category.image,
            icon: category.icon,
            isActive: category.isActive !== false,
            updatedAt: new Date().toISOString(),
          }

          // Remove undefined
          Object.keys(updateData).forEach(key => updateData[key as keyof typeof updateData] === undefined && delete updateData[key as keyof typeof updateData])

          await updateDoc(categoryRef, updateData)

          const updatedCategory = { ...updateData } as Partial<Category>

          set({
            categories: get().categories.map((c) => (c.id === id ? { ...c, ...updatedCategory } as Category : c)),
          })
          return { id, ...updatedCategory } as Category
        } catch (error) {
          console.error('Update category error:', error)
          throw error
        }
      },

      deleteCategory: async (id) => {
        try {
          await deleteDoc(doc(db, 'categories', String(id)))

          set({
            categories: get().categories.filter((c) => c.id !== id),
          })
        } catch (error) {
          console.error('Delete category error:', error)
          throw error
        }
      },

      fetchSizeBanners: async () => {
        try {
          const q = query(collection(db, 'sizeBanners'), orderBy('order_index', 'asc'))
          const querySnapshot = await getDocs(q)
          const data: SizeBanner[] = []
          querySnapshot.forEach((doc) => {
            data.push({ id: doc.id, ...doc.data() } as unknown as SizeBanner)
          })

          set({ sizeBanners: data })
        } catch (error) {
          console.error('Fetch size banners error:', error)
        }
      },

      createSizeBanner: async (banner) => {
        try {
          const docRef = await addDoc(collection(db, 'sizeBanners'), {
            ...banner,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          })

          const newBanner = { id: docRef.id, ...banner } as unknown as SizeBanner
          set({ sizeBanners: [...get().sizeBanners, newBanner] })
        } catch (error) {
          console.error('Create size banner error:', error)
        }
      },

      updateSizeBanner: async (id, banner) => {
        try {
          const bannerRef = doc(db, 'sizeBanners', String(id))
          const updateData = {
            ...banner,
            updatedAt: new Date().toISOString(),
          }
          await updateDoc(bannerRef, updateData)

          set({
            sizeBanners: get().sizeBanners.map((b) => (b.id === id ? { ...b, ...updateData } as SizeBanner : b)),
          })
        } catch (error) {
          console.error('Update size banner error:', error)
        }
      },

      deleteSizeBanner: async (id) => {
        try {
          await deleteDoc(doc(db, 'sizeBanners', String(id)))

          set({
            sizeBanners: get().sizeBanners.filter((b) => b.id !== id),
          })
        } catch (error) {
          console.error('Delete size banner error:', error)
        }
      },

      updateFixedBanner: async (id, banner) => {
        try {
          const bannerRef = doc(db, 'sizeBanners', id)
          const data = {
            ...banner,
            id,
            updatedAt: new Date().toISOString(),
          }
          // If creating new, add createdAt and order_index
          if (!get().sizeBanners.find(b => b.id === id)) {
            Object.assign(data, {
              createdAt: new Date().toISOString(),
              order_index: 0 // Required for orderBy query
            })
          } else {
            // Keep existing values
            const existing = get().sizeBanners.find(b => b.id === id)
            if (existing) {
              Object.assign(data, {
                createdAt: existing.createdAt,
                order_index: (existing as any).order_index ?? 0
              })
            }
          }

          await setDoc(bannerRef, data, { merge: true })

          // Update local state
          const currentBanners = get().sizeBanners.filter(b => b.id !== id)
          set({
            sizeBanners: [...currentBanners, data as SizeBanner]
          })
        } catch (error) {
          console.error('Update fixed banner error:', error)
        }
      },

      reorderSizeBanners: async (ids) => {
        try {
          const batch = writeBatch(db)

          ids.forEach((id, index) => {
            const bannerRef = doc(db, 'sizeBanners', String(id))
            batch.update(bannerRef, { order_index: index })
          })

          await batch.commit()

          // Optimistic update or fetch again
          const q = query(collection(db, 'sizeBanners'), orderBy('order_index', 'asc'))
          const querySnapshot = await getDocs(q)
          const data: SizeBanner[] = []
          querySnapshot.forEach((doc) => {
            data.push({ id: doc.id, ...doc.data() } as unknown as SizeBanner)
          })

          set({ sizeBanners: data })
        } catch (error) {
          console.error('Reorder size banners error:', error)
        }
      },

      fetchHeroBanners: async () => {
        try {
          const q = query(collection(db, 'heroBanners'), orderBy('createdAt', 'desc'))
          const querySnapshot = await getDocs(q)
          const data: HeroBanner[] = []
          querySnapshot.forEach((doc) => {
            data.push({ id: doc.id, ...doc.data() } as unknown as HeroBanner)
          })

          set({ heroBanners: data })
        } catch (error) {
          console.error('Fetch hero banners error:', error)
        }
      },

      createHeroBanner: async (banner) => {
        try {
          const docRef = await addDoc(collection(db, 'heroBanners'), {
            ...banner,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          })

          const newBanner = { id: docRef.id, ...banner } as unknown as HeroBanner
          set({ heroBanners: [...get().heroBanners, newBanner] })
        } catch (error) {
          console.error('Create hero banner error:', error)
        }
      },

      updateHeroBanner: async (id, banner) => {
        try {
          const bannerRef = doc(db, 'heroBanners', String(id))
          const updateData = {
            ...banner,
            updatedAt: new Date().toISOString(),
          }
          await updateDoc(bannerRef, updateData)

          set({
            heroBanners: get().heroBanners.map((b) => (b.id === id ? { ...b, ...updateData } as HeroBanner : b)),
          })
        } catch (error) {
          console.error('Update hero banner error:', error)
        }
      },

      deleteHeroBanner: async (id) => {
        try {
          await deleteDoc(doc(db, 'heroBanners', String(id)))

          set({
            heroBanners: get().heroBanners.filter((b) => b.id !== id),
          })
        } catch (error) {
          console.error('Delete hero banner error:', error)
        }
      },

      fetchActiveHeroBanner: async () => {
        try {
          const q = query(
            collection(db, 'heroBanners'),
            where('isActive', '==', true),
            orderBy('createdAt', 'desc'),
            limit(1)
          )
          const querySnapshot = await getDocs(q)

          if (!querySnapshot.empty) {
            const doc = querySnapshot.docs[0]
            set({ heroBanner: { id: doc.id, ...doc.data() } as unknown as HeroBanner })
          } else {
            set({ heroBanner: null })
          }
        } catch (error) {
          console.error('Fetch active hero banner error:', error)
        }
      },

      fetchSEOSettings: async () => {
        try {
          const q = query(collection(db, 'seo_settings'), limit(1))
          const querySnapshot = await getDocs(q)

          if (!querySnapshot.empty) {
            const doc = querySnapshot.docs[0]
            set({ seoSettings: { id: doc.id, ...doc.data() } as unknown as SEOSettings })
          } else {
            set({ seoSettings: null })
          }
        } catch (error) {
          console.error('Fetch SEO settings error:', error)
        }
      },

      updateSEOSettings: async (settings) => {
        try {
          const existing = get().seoSettings
          let data

          if (existing && existing.id) {
            const docRef = doc(db, 'seo_settings', String(existing.id))
            const updateData = {
              ...settings,
              updatedAt: new Date().toISOString(),
            }
            await updateDoc(docRef, updateData)
            data = { ...existing, ...updateData }
          } else {
            const newData = {
              ...settings,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            }
            const docRef = await addDoc(collection(db, 'seo_settings'), newData)
            data = { id: docRef.id, ...newData }
          }

          set({ seoSettings: data as SEOSettings })
          console.log('SEO Settings saved:', data)
          return data as SEOSettings
        } catch (error) {
          console.error('Update SEO settings error:', error)
          throw error
        }
      },

      fetchPageSEO: async () => {
        try {
          const q = query(collection(db, 'page_seo'))
          const querySnapshot = await getDocs(q)
          const data: PageSEO[] = []
          querySnapshot.forEach((doc) => {
            data.push({ id: doc.id, ...doc.data() } as unknown as PageSEO)
          })
          set({ pageSEO: data })
        } catch (error) {
          console.error('Fetch page SEO error:', error)
        }
      },

      updatePageSEO: async (page, seoData) => {
        try {
          // Check if document exists for this page
          const existing = get().pageSEO.find(p => p.page === page)

          if (existing) {
            const docRef = doc(db, 'page_seo', existing.id)
            await updateDoc(docRef, { ...seoData, updatedAt: new Date().toISOString() })

            set({
              pageSEO: get().pageSEO.map(p => p.id === existing.id ? { ...p, ...seoData } as PageSEO : p)
            })
          } else {
            // Create new
            const newDoc = {
              page,
              ...seoData,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            }
            const docRef = await addDoc(collection(db, 'page_seo'), newDoc)

            set({
              pageSEO: [...get().pageSEO, { id: docRef.id, ...newDoc } as PageSEO]
            })
          }
        } catch (error) {
          console.error('Update page SEO error:', error)
          throw error
        }
      },

      uploadFile: async (file: File): Promise<string> => {
        return await uploadToR2(file)
      },

      fetchDashboardStats: async () => {
        try {
          const productsColl = collection(db, 'products')
          const ordersColl = collection(db, 'orders')
          const customersColl = collection(db, 'customers')

          const [productsSnap, ordersSnap, customersSnap] = await Promise.all([
            getCountFromServer(productsColl),
            getCountFromServer(ordersColl),
            getCountFromServer(customersColl),
          ])

          // Calculate total revenue from orders manually for now (or use aggregation if available/needed)
          // For large datasets this should be a cloud function aggregation
          const ordersSnapshot = await getDocs(ordersColl)
          let totalRevenue = 0
          ordersSnapshot.forEach(doc => {
            totalRevenue += Number(doc.data().total || 0)
          })

          set({
            dashboardStats: {
              totalOrders: ordersSnap.data().count || 0,
              totalRevenue,
              pendingOrders: ordersSnap.data().count || 0, // Placeholder, normally filter by status
              activeCustomers: customersSnap.data().count || 0,
              lowStockProducts: productsSnap.data().count || 0, // Placeholder
              averageOrderValue: ordersSnap.data().count > 0 ? totalRevenue / ordersSnap.data().count : 0,
            },
          })
        } catch (error) {
          console.error('Fetch dashboard stats error:', error)
        }
      },

      fetchSalesData: async (days = 7) => {
        try {
          const daysNum = Number(days)
          const startDate = new Date(Date.now() - daysNum * 24 * 60 * 60 * 1000).toISOString()

          const q = query(
            collection(db, 'orders'),
            where('createdAt', '>=', startDate),
            orderBy('createdAt', 'asc')
          )

          const querySnapshot = await getDocs(q)
          const ordersData: any[] = []
          querySnapshot.forEach(doc => ordersData.push(doc.data()))

          const salesByDay = ordersData.reduce((acc: any, order: any) => {
            const date = (order.createdAt || '').split('T')[0]
            if (!date) return acc

            if (!acc[date]) {
              acc[date] = 0
            }
            acc[date] += Number(order.total || 0)
            return acc
          }, {})

          const formattedData = Object.entries(salesByDay).map(([date, revenue]) => ({
            date,
            revenue: revenue as number,
            orders: ordersData.filter((o: any) => (o.createdAt || '').startsWith(date)).length,
          }))

          set({ salesData: formattedData })
        } catch (error) {
          console.error('Fetch sales data error:', error)
        }
      },
    }),
    {
      name: 'admin-storage',
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        admin: state.admin,
        token: state.token,
      }),
    }
  ))
