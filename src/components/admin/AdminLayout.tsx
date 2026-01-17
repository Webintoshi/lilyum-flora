import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, Routes, Route } from 'react-router-dom'
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Users,
  Settings as SettingsIcon,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Home,
  Image as ImageIcon,
  Tag,
  List,
  FileText,
  Globe,
} from 'lucide-react'
import { useAdminStore } from '@/store/adminStore'
import Dashboard from '@/pages/admin/Dashboard'
import ProductList from '@/pages/admin/products/ProductList'
import ProductForm from '@/pages/admin/products/ProductForm'
import OrderList from '@/pages/admin/orders/OrderList'
import OrderDetail from '@/pages/admin/orders/OrderDetail'
import CustomerList from '@/pages/admin/customers/CustomerList'
import CategoryManagement from '@/pages/admin/categories/CategoryManagement'
import SEOSettings from '@/pages/admin/SEOSettings'
import Settings from '@/pages/admin/Settings'
import BannerManagement from '@/pages/admin/banners/BannerManagement'

interface NavItem {
  title: string
  path: string
  icon: React.ReactNode
}

export default function AdminLayout({ children }: { children?: React.ReactNode }) {
  const { isAuthenticated, logout } = useAdminStore()
  const location = useLocation()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024)

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login')
    }
  }, [isAuthenticated, navigate])

  const navItems: NavItem[] = [
    { title: 'Ana Sayfa', path: '/admin', icon: <LayoutDashboard className="w-5 h-5" /> },
    { title: 'Ürünler', path: '/admin/products', icon: <ShoppingBag className="w-5 h-5" /> },
    { title: 'Siparişler', path: '/admin/orders', icon: <Package className="w-5 h-5" /> },
    { title: 'Müşteriler', path: '/admin/customers', icon: <Users className="w-5 h-5" /> },
    { title: 'Kategoriler', path: '/admin/categories', icon: <Tag className="w-5 h-5" /> },
    { title: 'Bannerlar', path: '/admin/banners', icon: <ImageIcon className="w-5 h-5" /> },
    { title: 'Ayarlar', path: '/admin/settings', icon: <SettingsIcon className="w-5 h-5" /> },
  ]

  const subMenuItems = {
    settings: [
      { title: 'Genel Ayarlar', path: '/admin/settings', icon: <Home className="w-4 h-4" /> },
      { title: 'SEO Ayarları', path: '/admin/seo', icon: <FileText className="w-4 h-4" /> },
    ],
  }

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
  }

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/')
  }

  return (
    <div className="min-h-screen bg-[#f6f3ec]">


      <div className="flex min-h-screen">
        <aside
          className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#212122] text-white transform transition-transform duration-300 ease-in-out lg:relative lg:transform-none ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
            } ${!sidebarOpen && 'lg:-translate-x-full'}`} // Desktop: if !sidebarOpen -> hide
        >
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-700">
              <Link to="/admin" className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                  <LayoutDashboard className="w-6 h-6" />
                </div>
                <span className="text-xl font-bold">Lilyum Admin</span>
              </Link>
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:flex hidden p-2 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <ChevronRight className={`w-5 h-5 transition-transform ${!sidebarOpen && 'rotate-180'}`} />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto py-6">
              <ul className="space-y-1 px-3">
                {navItems.map((item) => {
                  const hasSubmenu = item.title === 'Ayarlar'
                  return (
                    <li key={item.path}>
                      {hasSubmenu ? (
                        <div>
                          <div
                            onClick={() => navigate(item.path)}
                            className={`flex items-center gap-3 px-3 py-3 rounded-lg cursor-pointer transition-colors ${isActive(item.path) ? 'bg-primary-600' : 'hover:bg-gray-700'
                              }`}
                          >
                            {item.icon}
                            <span className="font-medium">{item.title}</span>
                          </div>
                          {isActive(item.path) && (
                            <ul className="ml-6 mt-2 space-y-1">
                              {subMenuItems.settings.map((subItem) => (
                                <li key={subItem.path}>
                                  <Link
                                    to={subItem.path}
                                    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${isActive(subItem.path) ? 'bg-primary-700' : 'hover:bg-gray-700'
                                      }`}
                                    onClick={() => window.innerWidth < 1024 && setSidebarOpen(false)}
                                  >
                                    {subItem.icon}
                                    <span className="text-sm">{subItem.title}</span>
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ) : (
                        <Link
                          to={item.path}
                          className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${isActive(item.path) ? 'bg-primary-600' : 'hover:bg-gray-700'
                            }`}
                          onClick={() => window.innerWidth < 1024 && setSidebarOpen(false)}
                        >
                          {item.icon}
                          <span className="font-medium">{item.title}</span>
                        </Link>
                      )}
                    </li>
                  )
                })}
              </ul>
            </nav>

            <div className="p-4 border-t border-gray-700">
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full px-3 py-3 rounded-lg hover:bg-gray-700 transition-colors text-red-400 hover:text-red-300"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Çıkış Yap</span>
              </button>
            </div>
          </div>
        </aside>

        <main className="flex-1 flex flex-col min-w-0">
          <header className="bg-white shadow-sm sticky top-0 z-30">
            <div className="flex items-center justify-between px-4 sm:px-6 py-4">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="lg:hidden p-2 -ml-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600"
                >
                  <Menu className="w-6 h-6" />
                </button>
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900 truncate max-w-[200px] sm:max-w-none">
                    {navItems.find((item) => isActive(item.path))?.title || 'Admin Panel'}
                  </h1>
                  <p className="text-sm text-gray-500 hidden sm:block">Hoş geldiniz, Yönetici</p>
                </div>
              </div>
              <div className="flex items-center gap-2 sm:gap-4">
                <Link
                  to="/"
                  target="_blank"
                  className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-xs sm:text-sm font-medium whitespace-nowrap"
                >
                  <Home className="w-4 h-4" />
                  <span className="hidden sm:inline">Siteyi Görüntüle</span>
                  <span className="sm:hidden">Site</span>
                </Link>
              </div>
            </div>
          </header>

          <div className="p-6 flex-1">
            <Routes>
              <Route index element={<Dashboard />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="products" element={<ProductList />} />
              <Route path="products/new" element={<ProductForm />} />
              <Route path="products/:id" element={<ProductForm />} />
              <Route path="products/:id/edit" element={<ProductForm />} />
              <Route path="orders" element={<OrderList />} />
              <Route path="orders/:id" element={<OrderDetail />} />
              <Route path="customers" element={<CustomerList />} />
              <Route path="categories" element={<CategoryManagement />} />
              <Route path="seo" element={<SEOSettings />} />
              <Route path="settings" element={<Settings />} />
              <Route path="banners" element={<BannerManagement />} />
            </Routes>
            {children}
          </div>
        </main>
      </div >

      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
        />
      )
      }
    </div >
  )
}
