import type { Product, Order, Customer, Category, SEOSettings, DashboardStats, SalesData, AdminUser, SizeBanner, HeroBanner } from '../types/index.js'

let products: Product[] = [
  {
    id: 1,
    name: 'Premium Kırmızı Gül Buketi',
    description: '12 adet kırmızı gülden oluşan özel tasarım buket',
    price: 450,
    originalPrice: 550,
    image: '🌹',
    images: ['🌹', '🌹🌹'],
    category: 'Güller',
    stock: 15,
    rating: 4.8,
    reviews: 128,
    isActive: true,
    featured: true,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 2,
    name: 'Elegan Lilyum Buketi',
    description: '8 adet beyaz lilyumdan oluşan zarif buket',
    price: 380,
    originalPrice: 420,
    image: '🌷',
    category: 'Lilyumlar',
    stock: 8,
    rating: 4.6,
    reviews: 95,
    isActive: true,
    featured: false,
    createdAt: '2024-01-02T00:00:00.000Z',
    updatedAt: '2024-01-02T00:00:00.000Z',
  },
  {
    id: 3,
    name: 'Exotik Orkide Aranjmanı',
    description: 'Mor orkide ve yeşil yapraklar ile özel tasarım',
    price: 620,
    originalPrice: 700,
    image: '🪻',
    category: 'Orkideler',
    stock: 12,
    rating: 4.9,
    reviews: 201,
    isActive: true,
    featured: true,
    createdAt: '2024-01-03T00:00:00.000Z',
    updatedAt: '2024-01-03T00:00:00.000Z',
  },
  {
    id: 4,
    name: 'Renkli Mevsimlik Buket',
    description: 'Mevsime göre taze çiçeklerden karışık buket',
    price: 290,
    image: '💐',
    category: 'Karışık',
    stock: 25,
    rating: 4.5,
    reviews: 67,
    isActive: true,
    featured: false,
    createdAt: '2024-01-04T00:00:00.000Z',
    updatedAt: '2024-01-04T00:00:00.000Z',
  },
  {
    id: 5,
    name: 'Pembe Gül Buketi',
    description: '15 adet pembe gülden oluşan romantik buket',
    price: 520,
    originalPrice: 580,
    image: '🌸',
    category: 'Güller',
    stock: 20,
    rating: 4.7,
    reviews: 156,
    isActive: true,
    featured: true,
    createdAt: '2024-01-05T00:00:00.000Z',
    updatedAt: '2024-01-05T00:00:00.000Z',
  },
]

let orders: Order[] = [
  {
    id: 1001,
    customer: {
      id: 1,
      name: 'Ahmet Yılmaz',
      email: 'ahmet@example.com',
      phone: '0555 123 4567',
    },
    items: [
      {
        productId: 1,
        productName: 'Premium Kırmızı Gül Buketi',
        productImage: '🌹',
        quantity: 2,
        price: 450,
      },
    ],
    total: 900,
    status: 'pending',
    shippingAddress: {
      fullName: 'Ahmet Yılmaz',
      phone: '0555 123 4567',
      city: 'İstanbul',
      district: 'Kadıköy',
      address: 'Cadde No: 123, Apt: 45',
    },
    notes: 'Lütfen 14:00 - 16:00 arasında teslim edin',
    createdAt: '2024-01-08T10:30:00.000Z',
    updatedAt: '2024-01-08T10:30:00.000Z',
  },
  {
    id: 1002,
    customer: {
      id: 2,
      name: 'Ayşe Demir',
      email: 'ayse@example.com',
      phone: '0555 987 6543',
    },
    items: [
      {
        productId: 3,
        productName: 'Exotik Orkide Aranjmanı',
        productImage: '🪻',
        quantity: 1,
        price: 620,
      },
    ],
    total: 620,
    status: 'shipped',
    shippingAddress: {
      fullName: 'Ayşe Demir',
      phone: '0555 987 6543',
      city: 'Ankara',
      district: 'Çankaya',
      address: 'Mahalle No: 456',
    },
    trackingNumber: 'TR123456789',
    createdAt: '2024-01-07T09:15:00.000Z',
    updatedAt: '2024-01-07T15:00:00.000Z',
  },
]

let customers: Customer[] = [
  {
    id: 1,
    name: 'Ahmet Yılmaz',
    email: 'ahmet@example.com',
    phone: '0555 123 4567',
    addresses: [
      {
        fullName: 'Ahmet Yılmaz',
        phone: '0555 123 4567',
        city: 'İstanbul',
        district: 'Kadıköy',
        address: 'Cadde No: 123, Apt: 45',
      },
    ],
    totalSpent: 4500,
    orderCount: 5,
    isActive: true,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-08T00:00:00.000Z',
  },
  {
    id: 2,
    name: 'Ayşe Demir',
    email: 'ayse@example.com',
    phone: '0555 987 6543',
    addresses: [
      {
        fullName: 'Ayşe Demir',
        phone: '0555 987 6543',
        city: 'Ankara',
        district: 'Çankaya',
        address: 'Mahalle No: 456',
      },
    ],
    totalSpent: 3200,
    orderCount: 4,
    isActive: true,
    createdAt: '2024-01-02T00:00:00.000Z',
    updatedAt: '2024-01-07T00:00:00.000Z',
  },
]

let categories: Category[] = [
  {
    id: 1,
    name: 'Güller',
    slug: 'guller',
    description: 'Taze ve kaliteli güller',
    image: 'https://images.unsplash.com/photo-1518709594023-6eab9bc3b3a9?w=400&q=80&auto=format&fit=crop',
    icon: '🌹',
    productCount: 125,
    isActive: true,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 2,
    name: 'Lilyumlar',
    slug: 'lilyumlar',
    description: 'Zarif lilyum çiçekleri',
    image: 'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?w=400&q=80&auto=format&fit=crop',
    icon: '🌷',
    productCount: 98,
    isActive: true,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 3,
    name: 'Orkideler',
    slug: 'orkideler',
    description: 'Uzun ömürlü orkideler',
    image: 'https://images.unsplash.com/photo-1566931909069-5894535d8c27?w=400&q=80&auto=format&fit=crop',
    icon: '🪻',
    productCount: 67,
    isActive: true,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 4,
    name: 'Papatyalar',
    slug: 'papatyalar',
    description: 'Narin papatya çiçekleri',
    image: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400&q=80&auto=format&fit=crop',
    icon: '🌸',
    productCount: 54,
    isActive: true,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 5,
    name: 'Gerbera',
    slug: 'gerbera',
    description: 'Canlı gerbera çiçekleri',
    image: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400&q=80&auto=format&fit=crop',
    icon: '🌼',
    productCount: 43,
    isActive: true,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 6,
    name: 'Karışık Buketler',
    slug: 'karisik',
    description: 'Karışık çiçek buketleri',
    image: 'https://images.unsplash.com/photo-1455659817273-f96807779a3a?w=400&q=80&auto=format&fit=crop',
    icon: '💐',
    productCount: 89,
    isActive: true,
    createdAt: '2024-01-01T00:00.00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
]

let seoSettings: SEOSettings = {
  id: 1,
  siteTitle: 'Lilyum Flora - Taze Çiçek Siparişi',
  siteDescription: 'Sevdiklerinize en taze çiçekleri gönderin. 60 dakikada teslimat, %50\'ye varan indirimler.',
  keywords: 'çiçek, çiçek siparişi, güller, orkideler, lilyumlar, hediye çiçek',
  faviconUrl: '',
  ogTitle: 'Lilyum Flora - Taze Çiçek Siparişi',
  ogDescription: 'Sevdiklerinize en taze çiçekleri gönderin',
  ogImage: '',
  twitterCardType: 'summary_large_image',
  twitterTitle: 'Lilyum Flora',
  twitterDescription: 'Taze çiçek siparişi',
  twitterImage: '',
  gtmId: '',
  gaId: '',
  metaPixelId: '',
  hotjarId: '',
  yandexMetricaId: '',
  customHeadScripts: '',
  customBodyScripts: '',
  robotsTxt: 'User-agent: *\nAllow: /',
  canonicalUrlPattern: 'https://lilyumflora.com',
  updatedAt: new Date().toISOString(),
}

let sizeBanners: SizeBanner[] = [
  {
    id: 1,
    subtitle: '1.5 - 2 fit.',
    title: 'Küçük Boy Çiçekler',
    videoUrl: '/videos/small-flowers.mp4',
    posterUrl: '/images/small-flowers-poster.jpg',
    link: '/catalog?size=small',
    isActive: true,
    order: 1,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 2,
    subtitle: '2.5 - 3.5 fit.',
    title: 'Orta Boy Çiçekler',
    videoUrl: '/videos/medium-flowers.mp4',
    posterUrl: '/images/medium-flowers-poster.jpg',
    link: '/catalog?size=medium',
    isActive: true,
    order: 2,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 3,
    subtitle: '4.5 - 6 fit.',
    title: 'Büyük Çiçekler',
    videoUrl: '/videos/large-flowers.mp4',
    posterUrl: '/images/large-flowers-poster.jpg',
    link: '/catalog?size=large',
    isActive: true,
    order: 3,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
]

let heroBanners: HeroBanner[] = [
  {
    id: 1,
    title: 'Taze Çiçeklerle Unutulmaz Anılar',
    subtitle: 'Sevdiklerinize taze ve özenle hazırlanmış çiçek aranjmanları gönderin.',
    mobileImage: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800&q=80&auto=format&fit=crop',
    desktopImage: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=1920&q=80&auto=format&fit=crop',
    overlayOpacity: 0.4,
    isActive: true,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
]

let adminUser: AdminUser = {
  id: 1,
  email: 'webintoshi@gmail.com',
  role: 'admin',
  createdAt: '2024-01-01T00:00:00.000Z',
}

const generateId = (items: any[]): number => {
  return items.length > 0 ? Math.max(...items.map((item) => item.id)) + 1 : 1
}

export const dataStore = {
  sizeBanners: {
    getAll: () => sizeBanners,
    getById: (id: number) => sizeBanners.find((b) => b.id === id),
    create: (banner: Omit<SizeBanner, 'id' | 'createdAt' | 'updatedAt'>) => {
      const newBanner: SizeBanner = {
        ...banner,
        id: generateId(sizeBanners),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      sizeBanners.push(newBanner)
      return newBanner
    },
    update: (id: number, updates: Partial<SizeBanner>) => {
      const index = sizeBanners.findIndex((b) => b.id === id)
      if (index === -1) return null
      sizeBanners[index] = {
        ...sizeBanners[index],
        ...updates,
        updatedAt: new Date().toISOString(),
      }
      return sizeBanners[index]
    },
    delete: (id: number) => {
      const index = sizeBanners.findIndex((b) => b.id === id)
      if (index === -1) return false
      sizeBanners.splice(index, 1)
      return true
    },
    reorder: (ids: number[]) => {
      ids.forEach((id, index) => {
        const banner = sizeBanners.find((b) => b.id === id)
        if (banner) {
          banner.order = index
          banner.updatedAt = new Date().toISOString()
        }
      })
      return sizeBanners.sort((a, b) => a.order - b.order)
    },
  },

  heroBanners: {
    getAll: () => heroBanners,
    getById: (id: number) => heroBanners.find((b) => b.id === id),
    create: (banner: Omit<HeroBanner, 'id' | 'createdAt' | 'updatedAt'>) => {
      const newBanner: HeroBanner = {
        ...banner,
        id: generateId(heroBanners),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      heroBanners.push(newBanner)
      return newBanner
    },
    update: (id: number, updates: Partial<HeroBanner>) => {
      const index = heroBanners.findIndex((b) => b.id === id)
      if (index === -1) return null
      heroBanners[index] = {
        ...heroBanners[index],
        ...updates,
        updatedAt: new Date().toISOString(),
      }
      return heroBanners[index]
    },
    delete: (id: number) => {
      const index = heroBanners.findIndex((b) => b.id === id)
      if (index === -1) return false
      heroBanners.splice(index, 1)
      return true
    },
  },

  products: {
    getAll: () => products,
    getById: (id: number) => products.find((p) => p.id === id),
    create: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
      const newProduct: Product = {
        ...product,
        id: generateId(products),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      products.push(newProduct)
      return newProduct
    },
    update: (id: number, updates: Partial<Product>) => {
      const index = products.findIndex((p) => p.id === id)
      if (index === -1) return null
      products[index] = {
        ...products[index],
        ...updates,
        updatedAt: new Date().toISOString(),
      }
      return products[index]
    },
    delete: (id: number) => {
      const index = products.findIndex((p) => p.id === id)
      if (index === -1) return false
      products.splice(index, 1)
      return true
    },
    updateStock: (id: number, stock: number) => {
      const product = products.find((p) => p.id === id)
      if (!product) return null
      product.stock = stock
      product.updatedAt = new Date().toISOString()
      return product
    },
  },

  orders: {
    getAll: () => orders,
    getById: (id: number) => orders.find((o) => o.id === id),
    create: (order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => {
      const newOrder: Order = {
        ...order,
        id: generateId(orders),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      orders.push(newOrder)
      return newOrder
    },
    updateStatus: (id: number, status: Order['status']) => {
      const order = orders.find((o) => o.id === id)
      if (!order) return null
      order.status = status
      order.updatedAt = new Date().toISOString()
      return order
    },
    updateTrackingNumber: (id: number, trackingNumber: string) => {
      const order = orders.find((o) => o.id === id)
      if (!order) return null
      order.trackingNumber = trackingNumber
      order.updatedAt = new Date().toISOString()
      return order
    },
    delete: (id: number) => {
      const index = orders.findIndex((o) => o.id === id)
      if (index === -1) return false
      orders.splice(index, 1)
      return true
    },
  },

  customers: {
    getAll: () => customers,
    getById: (id: number) => customers.find((c) => c.id === id),
    create: (customer: Omit<Customer, 'id' | 'totalSpent' | 'orderCount' | 'createdAt' | 'updatedAt'>) => {
      const newCustomer: Customer = {
        ...customer,
        id: generateId(customers),
        totalSpent: 0,
        orderCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      customers.push(newCustomer)
      return newCustomer
    },
    update: (id: number, updates: Partial<Customer>) => {
      const index = customers.findIndex((c) => c.id === id)
      if (index === -1) return null
      customers[index] = {
        ...customers[index],
        ...updates,
        updatedAt: new Date().toISOString(),
      }
      return customers[index]
    },
    delete: (id: number) => {
      const index = customers.findIndex((c) => c.id === id)
      if (index === -1) return false
      customers.splice(index, 1)
      return true
    },
  },

  categories: {
    getAll: () => categories,
    getById: (id: number) => categories.find((c) => c.id === id),
    create: (category: Omit<Category, 'id' | 'productCount' | 'createdAt' | 'updatedAt'>) => {
      const newCategory: Category = {
        ...category,
        id: generateId(categories),
        productCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      categories.push(newCategory)
      return newCategory
    },
    update: (id: number, updates: Partial<Category>) => {
      const index = categories.findIndex((c) => c.id === id)
      if (index === -1) return null
      categories[index] = {
        ...categories[index],
        ...updates,
        updatedAt: new Date().toISOString(),
      }
      return categories[index]
    },
    delete: (id: number) => {
      const index = categories.findIndex((c) => c.id === id)
      if (index === -1) return false
      categories.splice(index, 1)
      return true
    },
  },

  seo: {
    get: () => seoSettings,
    update: (updates: Partial<SEOSettings>) => {
      seoSettings = {
        ...seoSettings,
        ...updates,
        updatedAt: new Date().toISOString(),
      }
      return seoSettings
    },
    reset: () => {
      seoSettings = {
        id: 1,
        siteTitle: 'Lilyum Flora - Taze Çiçek Siparişi',
        siteDescription: 'Sevdiklerinize en taze çiçekleri gönderin. 60 dakikada teslimat, %50\'ye varan indirimler.',
        keywords: 'çiçek, çiçek siparişi, güller, orkideler, lilyumlar, hediye çiçek',
        updatedAt: new Date().toISOString(),
      }
      return seoSettings
    },
  },

  dashboard: {
    getStats: (): DashboardStats => {
      const totalOrders = orders.length
      const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0)
      const pendingOrders = orders.filter((o) => o.status === 'pending').length
      const activeCustomers = customers.filter((c) => c.isActive).length
      const lowStockProducts = products.filter((p) => p.stock < 10).length
      const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

      return {
        totalOrders,
        totalRevenue,
        pendingOrders,
        activeCustomers,
        lowStockProducts,
        averageOrderValue,
      }
    },
    getSalesData: (days: number = 7): SalesData[] => {
      const data: SalesData[] = []
      const today = new Date()

      for (let i = days - 1; i >= 0; i--) {
        const date = new Date(today)
        date.setDate(date.getDate() - i)
        const dateStr = date.toISOString().split('T')[0]

        const dayOrders = orders.filter((o) => o.createdAt.startsWith(dateStr))
        const revenue = dayOrders.reduce((sum, o) => sum + o.total, 0)

        data.push({
          date: dateStr,
          revenue,
          orders: dayOrders.length,
        })
      }

      return data
    },
    getRecentOrders: (limit: number = 5) => {
      return [...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, limit)
    },
    getLowStockProducts: (threshold: number = 10) => {
      return products.filter((p) => p.stock < threshold && p.isActive)
    },
  },

  admin: {
    login: (email: string, password: string): LoginResponse => {
      if (email === 'webintoshi@gmail.com' && password === '06122021Kam.') {
        return {
          success: true,
          token: 'mock-jwt-token-' + Date.now(),
          user: adminUser,
        }
      }
      return {
        success: false,
        error: 'Geçersiz e-posta veya şifre',
      }
    },
    logout: () => {
      return { success: true }
    },
  },
}

import type { LoginResponse } from '../types/index.js'
