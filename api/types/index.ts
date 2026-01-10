export interface Product {
  id: number
  name: string
  description: string
  price: number
  originalPrice?: number
  compareAtPrice?: number
  image: string
  images?: string[]
  category: string
  slug?: string
  stock: number
  rating: number
  reviews: number
  isActive: boolean
  featured: boolean
  sizes?: string[]
  colors?: string[]
  categoryId?: number
  createdAt: string
  updatedAt: string
}

export interface OrderItem {
  id?: number
  productId: number
  productName: string
  productImage: string
  image?: string
  name?: string
  category?: string
  quantity: number
  price: number
}

export interface Address {
  fullName: string
  firstName?: string
  lastName?: string
  phone: string
  city: string
  country?: string
  district: string
  address: string
  postalCode?: string
}

export interface Order {
  id: number
  customer: {
    id: number
    name: string
    email: string
    phone: string
  }
  items: OrderItem[]
  total: number
  subtotal?: number
  shipping?: number
  discount?: number
  status: 'pending' | 'preparing' | 'shipped' | 'delivered' | 'cancelled' | 'returned' | 'processing'
  shippingAddress: Address
  trackingNumber?: string
  notes?: string
  paymentMethod?: string
  createdAt: string
  updatedAt: string
}

export interface Customer {
  id: number
  name: string
  email: string
  phone: string
  addresses: Address[]
  totalSpent: number
  orderCount: number
  totalOrders?: number
  country?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface Category {
  id: number
  name: string
  slug: string
  description?: string
  image: string
  icon: string
  productCount: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface SizeBanner {
  id: number
  subtitle: string
  title: string
  videoUrl: string
  posterUrl: string
  link: string
  isActive: boolean
  order: number
  createdAt: string
  updatedAt: string
}

export interface HeroBanner {
  id: number
  title: string
  subtitle?: string
  description?: string
  imageUrl?: string
  mobileImage: string
  desktopImage: string
  ctaText?: string
  ctaLink?: string
  overlayOpacity?: number
  isActive: boolean
  order?: number
  createdAt: string
  updatedAt: string
}

export interface SEOSettings {
  id: number
  siteTitle: string
  siteDescription: string
  keywords: string
  faviconUrl?: string
  
  ogTitle?: string
  ogDescription?: string
  ogImage?: string
  
  twitterCardType?: 'summary' | 'summary_large_image'
  twitterTitle?: string
  twitterDescription?: string
  twitterImage?: string
  
  gtmId?: string
  gaId?: string
  metaPixelId?: string
  hotjarId?: string
  yandexMetricaId?: string
  
  customHeadScripts?: string
  customBodyScripts?: string
  
  robotsTxt?: string
  canonicalUrlPattern?: string
  
  updatedAt: string
}

export interface DashboardStats {
  totalOrders: number
  totalRevenue: number
  pendingOrders: number
  activeCustomers: number
  lowStockProducts: number
  averageOrderValue: number
}

export interface SalesData {
  date: string
  revenue: number
  orders: number
}

export interface AdminUser {
  id: number
  email: string
  role: 'admin' | 'editor'
  createdAt: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  success: boolean
  token?: string
  user?: AdminUser
  error?: string
}

export interface ScrapedProduct {
  name: string
  price: number
  description?: string
  image: string
  sourceUrl: string
  slug?: string
}

export interface AnalyzeResult {
  success: boolean
  url: string
  robotsTxtAllowed: boolean
  products: ScrapedProduct[]
  productCount: number
  detectedSelectors: {
    productContainer?: string
    productName?: string
    productPrice?: string
    productImage?: string
    productLink?: string
  }
  pagination?: {
    hasPagination: boolean
    nextPageSelector?: string
    totalPages?: number
  }
  errors: string[]
}

export interface ScrapingOptions {
  url: string
  targetCategoryId: number
  priceMultiplier?: number
  currencyMultiplier?: number
}

export interface ScrapingResult {
  success: number
  failed: number
  products: Product[]
}
