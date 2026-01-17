export interface Product {
  id: string | number
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
  categoryId?: string | number
  // SEO Fields
  metaTitle?: string
  metaDescription?: string
  keywords?: string

  createdAt: string
  updatedAt: string
}

export interface OrderItem {
  id?: string | number
  productId: string | number
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
  id: string | number
  customer: {
    id: string | number
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
  deliveryPhotoUrl?: string
  deliveryPhotoApproved?: boolean
  sender?: {
    name: string
    phone: string
  }
  cardNote?: string
  isAnonymous?: boolean
  createdAt: string
  updatedAt: string
}

export interface Customer {
  id: string | number
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
  id: string | number
  name: string
  slug: string
  description?: string
  image?: string
  icon?: string
  productCount: number
  isActive: boolean
  // SEO Fields
  metaTitle?: string
  metaDescription?: string
  keywords?: string

  createdAt: string
  updatedAt: string
}

export interface PageSEO {
  id: string
  page: string // 'home', 'about', 'contact', 'login', 'register', etc.
  title: string
  description: string
  keywords?: string
  image?: string
}

export interface SEOSettings {
  id: string | number
  siteTitle: string
  siteDescription: string
  keywords: string
  logo?: string
  faviconUrl?: string

  ogTitle?: string
  ogDescription?: string
  ogImage?: string

  twitterCardType?: 'summary' | 'summary_large_image'
  twitterTitle?: string
  twitterDescription?: string
  twitterImage?: string
  twitterHandle?: string

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
  id: string | number
  email: string
  role: 'admin' | 'editor'
  createdAt: string
}

export interface SizeBanner {
  id: string | number
  title: string
  subtitle?: string
  image: string
  videoUrl?: string
  posterUrl?: string
  url?: string
  link?: string
  order: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface HeroBanner {
  id: string | number
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
  targetCategoryId: string | number
  priceMultiplier?: number
  currencyMultiplier?: number
}

export interface ScrapingResult {
  success: number
  failed: number
  products: Product[]
}
