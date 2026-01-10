import { create } from 'zustand'
import { supabase } from '../lib/supabase'
import type { Product, Order, Customer, Category, SEOSettings, DashboardStats, SalesData, AdminUser, SizeBanner, HeroBanner } from '../types'

const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || 'webintoshi@gmail.com'
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || '06122021Kam.'

interface AdminStore {
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
  updateProduct: (id: number, product: Partial<Product>) => Promise<void>
  deleteProduct: (id: number) => Promise<void>

  fetchOrders: (filters?: any) => Promise<void>
  updateOrderStatus: (id: number, status: string) => Promise<void>
  updateOrderTracking: (id: number, trackingNumber: string) => Promise<void>
  deleteOrder: (id: number) => Promise<void>

  fetchCustomers: () => Promise<void>
  updateCustomer: (id: number, customer: Partial<Customer>) => Promise<void>
  deleteCustomer: (id: number) => Promise<void>

  fetchCategories: () => Promise<void>
  createCategory: (category: Omit<Category, 'id' | 'productCount' | 'createdAt' | 'updatedAt'>) => Promise<void>
  updateCategory: (id: number, category: Partial<Category>) => Promise<void>
  deleteCategory: (id: number) => Promise<void>

  fetchSizeBanners: () => Promise<void>
  createSizeBanner: (banner: Omit<SizeBanner, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>
  updateSizeBanner: (id: number, banner: Partial<SizeBanner>) => Promise<void>
  deleteSizeBanner: (id: number) => Promise<void>
  reorderSizeBanners: (ids: number[]) => Promise<void>

  fetchHeroBanners: () => Promise<void>
  createHeroBanner: (banner: Omit<HeroBanner, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>
  updateHeroBanner: (id: number, banner: Partial<HeroBanner>) => Promise<void>
  deleteHeroBanner: (id: number) => Promise<void>
  fetchActiveHeroBanner: () => Promise<void>

  fetchSEOSettings: () => Promise<void>
  updateSEOSettings: (settings: Partial<SEOSettings>) => Promise<void>

  fetchDashboardStats: () => Promise<void>
  fetchSalesData: (days?: number) => Promise<void>
}

const savedToken = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null
const savedAdminUser = typeof window !== 'undefined' ? localStorage.getItem('adminUser') : null

export const useAdminStore = create<AdminStore>((set, get) => ({
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

  login: async (email: string, password: string) => {
    try {
      if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
        return false
      }

      const user: AdminUser = {
        id: 1,
        email: ADMIN_EMAIL,
        role: 'admin',
        createdAt: '2024-01-01T00:00:00.000Z',
      }
      const token = `admin-token-${Date.now()}`

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
      return false
    }
  },

  logout: () => {
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
      const { data, error } = await supabase
        .from('products')
        .select('*, categories(name, slug)')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      set({ products: data || [] })
    } catch (error) {
      console.error('Fetch products error:', error)
    }
  },

  createProduct: async (product) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert(product)
        .select('*, categories(name, slug)')
        .single()
      
      if (error) throw error
      set({ products: [...get().products, data] })
    } catch (error) {
      console.error('Create product error:', error)
    }
  },

  updateProduct: async (id, product) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .update({
          ...product,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select('*, categories(name, slug)')
        .single()
      
      if (error) throw error
      set({
        products: get().products.map((p) => (p.id === id ? data : p)),
      })
    } catch (error) {
      console.error('Update product error:', error)
    }
  },

  deleteProduct: async (id) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      set({
        products: get().products.filter((p) => p.id !== id),
      })
    } catch (error) {
      console.error('Delete product error:', error)
    }
  },

  fetchOrders: async (filters) => {
    try {
      let query = supabase
        .from('orders')
        .select('*, customers(name, email)')
        .order('created_at', { ascending: false })
      
      if (filters?.status) {
        query = query.eq('status', filters.status)
      }
      
      const { data, error } = await query
      
      if (error) throw error
      set({ orders: data || [] })
    } catch (error) {
      console.error('Fetch orders error:', error)
    }
  },

  updateOrderStatus: async (id, status) => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      set({
        orders: get().orders.map((o) => (o.id === id ? data : o)),
      })
    } catch (error) {
      console.error('Update order status error:', error)
    }
  },

  updateOrderTracking: async (id, trackingNumber) => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .update({ tracking_number: trackingNumber, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      set({
        orders: get().orders.map((o) => (o.id === id ? data : o)),
      })
    } catch (error) {
      console.error('Update order tracking error:', error)
    }
  },

  deleteOrder: async (id) => {
    try {
      const { error } = await supabase
        .from('orders')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      set({
        orders: get().orders.filter((o) => o.id !== id),
      })
    } catch (error) {
      console.error('Delete order error:', error)
    }
  },

  fetchCustomers: async () => {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      set({ customers: data || [] })
    } catch (error) {
      console.error('Fetch customers error:', error)
    }
  },

  updateCustomer: async (id, customer) => {
    try {
      const { data, error } = await supabase
        .from('customers')
        .update({
          ...customer,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      set({
        customers: get().customers.map((c) => (c.id === id ? data : c)),
      })
    } catch (error) {
      console.error('Update customer error:', error)
    }
  },

  deleteCustomer: async (id) => {
    try {
      const { error } = await supabase
        .from('customers')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      set({
        customers: get().customers.filter((c) => c.id !== id),
      })
    } catch (error) {
      console.error('Delete customer error:', error)
    }
  },

  fetchCategories: async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name', { ascending: true })
      
      if (error) throw error
      set({ categories: data || [] })
    } catch (error) {
      console.error('Fetch categories error:', error)
    }
  },

  createCategory: async (category) => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .insert(category)
        .select()
        .single()
      
      if (error) throw error
      set({ categories: [...get().categories, data] })
    } catch (error) {
      console.error('Create category error:', error)
    }
  },

  updateCategory: async (id, category) => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .update({
          ...category,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      set({
        categories: get().categories.map((c) => (c.id === id ? data : c)),
      })
    } catch (error) {
      console.error('Update category error:', error)
    }
  },

  deleteCategory: async (id) => {
    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      set({
        categories: get().categories.filter((c) => c.id !== id),
      })
    } catch (error) {
      console.error('Delete category error:', error)
    }
  },

  fetchSizeBanners: async () => {
    try {
      const { data, error } = await supabase
        .from('size_banners')
        .select('*')
        .order('order_index', { ascending: true })
      
      if (error) throw error
      set({ sizeBanners: data || [] })
    } catch (error) {
      console.error('Fetch size banners error:', error)
    }
  },

  createSizeBanner: async (banner) => {
    try {
      const { data, error } = await supabase
        .from('size_banners')
        .insert(banner)
        .select()
        .single()
      
      if (error) throw error
      set({ sizeBanners: [...get().sizeBanners, data] })
    } catch (error) {
      console.error('Create size banner error:', error)
    }
  },

  updateSizeBanner: async (id, banner) => {
    try {
      const { data, error } = await supabase
        .from('size_banners')
        .update({
          ...banner,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      set({
        sizeBanners: get().sizeBanners.map((b) => (b.id === id ? data : b)),
      })
    } catch (error) {
      console.error('Update size banner error:', error)
    }
  },

  deleteSizeBanner: async (id) => {
    try {
      const { error } = await supabase
        .from('size_banners')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      set({
        sizeBanners: get().sizeBanners.filter((b) => b.id !== id),
      })
    } catch (error) {
      console.error('Delete size banner error:', error)
    }
  },

  reorderSizeBanners: async (ids) => {
    try {
      const updates = ids.map((id, index) => ({
        id,
        order_index: index,
      }))
      
      const { error } = await supabase.from('size_banners').upsert(updates)
      
      if (error) throw error
      
      const { data } = await supabase
        .from('size_banners')
        .select('*')
        .order('order_index', { ascending: true })
      
      set({ sizeBanners: data || [] })
    } catch (error) {
      console.error('Reorder size banners error:', error)
    }
  },

  fetchHeroBanners: async () => {
    try {
      const { data, error } = await supabase
        .from('hero_banners')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      set({ heroBanners: data || [] })
    } catch (error) {
      console.error('Fetch hero banners error:', error)
    }
  },

  createHeroBanner: async (banner) => {
    try {
      const { data, error } = await supabase
        .from('hero_banners')
        .insert(banner)
        .select()
        .single()
      
      if (error) throw error
      set({ heroBanners: [...get().heroBanners, data] })
    } catch (error) {
      console.error('Create hero banner error:', error)
    }
  },

  updateHeroBanner: async (id, banner) => {
    try {
      const { data, error } = await supabase
        .from('hero_banners')
        .update({
          ...banner,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      set({
        heroBanners: get().heroBanners.map((b) => (b.id === id ? data : b)),
      })
    } catch (error) {
      console.error('Update hero banner error:', error)
    }
  },

  deleteHeroBanner: async (id) => {
    try {
      const { error } = await supabase
        .from('hero_banners')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      set({
        heroBanners: get().heroBanners.filter((b) => b.id !== id),
      })
    } catch (error) {
      console.error('Delete hero banner error:', error)
    }
  },

  fetchActiveHeroBanner: async () => {
    try {
      const { data, error } = await supabase
        .from('hero_banners')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()
      
      if (error) throw error
      set({ heroBanner: data })
    } catch (error) {
      console.error('Fetch active hero banner error:', error)
    }
  },

  fetchSEOSettings: async () => {
    try {
      const { data, error } = await supabase
        .from('seo_settings')
        .select('*')
        .single()
      
      if (error) throw error
      set({ seoSettings: data })
    } catch (error) {
      console.error('Fetch SEO settings error:', error)
    }
  },

  updateSEOSettings: async (settings) => {
    try {
      const { data, error } = await supabase
        .from('seo_settings')
        .update({
          ...settings,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single()
      
      if (error) throw error
      set({ seoSettings: data })
    } catch (error) {
      console.error('Update SEO settings error:', error)
    }
  },

  fetchDashboardStats: async () => {
    try {
      const [productsRes, ordersCountRes, customersRes, ordersDataRes] = await Promise.all([
        supabase.from('products').select('id', { count: 'exact', head: true }),
        supabase.from('orders').select('id', { count: 'exact', head: true }),
        supabase.from('customers').select('id', { count: 'exact', head: true }),
        supabase.from('orders').select('total'),
      ])

      const totalRevenue = ordersDataRes.data 
        ? ordersDataRes.data.reduce((sum: number, order: any) => sum + Number(order.total || 0), 0) 
        : 0

      set({
        dashboardStats: {
          totalProducts: productsRes.count || 0,
          totalOrders: ordersCountRes.count || 0,
          totalCustomers: customersRes.count || 0,
          totalRevenue,
        },
      })
    } catch (error) {
      console.error('Fetch dashboard stats error:', error)
    }
  },

  fetchSalesData: async (days = 7) => {
    try {
      const daysNum = Number(days)
      const { data, error } = await supabase
        .from('orders')
        .select('created_at, total')
        .gte('created_at', new Date(Date.now() - daysNum * 24 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: true })

      if (error) throw error

      const salesByDay = (data || []).reduce((acc: any, order: any) => {
        const date = order.created_at.split('T')[0]
        if (!acc[date]) {
          acc[date] = 0
        }
        acc[date] += Number(order.total || 0)
        return acc
      }, {})

      const formattedData = Object.entries(salesByDay).map(([date, revenue]) => ({
        date,
        revenue,
      }))

      set({ salesData: formattedData })
    } catch (error) {
      console.error('Fetch sales data error:', error)
    }
  },
}))
