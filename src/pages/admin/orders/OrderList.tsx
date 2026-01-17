import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Calendar, Package, CheckCircle, XCircle, ChevronDown, ChevronUp, Eye, RefreshCw, Truck, Clock, AlertTriangle, ArrowRight } from 'lucide-react'
import { useAdminStore } from '@/store/adminStore'
import type { Order } from '@/types'

export default function OrderList() {
  const navigate = useNavigate()
  const { orders, fetchOrders, updateOrderStatus } = useAdminStore()
  const [searchTerm, setSearchTerm] = useState('')
  const [sortField, setSortField] = useState<keyof typeof orders[0] | null>('createdAt')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  const [filterStatus, setFilterStatus] = useState<Order['status'] | 'all'>('all')
  const [loading, setLoading] = useState(false)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  const handleSort = (field: keyof typeof orders[0]) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const filteredOrders = orders
    .filter((order) => {
      const customerName = (order.customer as any)?.name || (order.shipping as any)?.name || 'Misafir'
      const customerEmail = (order.customer as any)?.email || 'misafir@lilyumflora.net'

      const matchesSearch =
        order.id.toString().includes(searchTerm) ||
        customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customerEmail.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = filterStatus === 'all' || order.status === filterStatus

      return matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      const field = sortField || 'createdAt'
      const aValue = a[field]
      const bValue = b[field]

      if (!aValue || !bValue) return 0

      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

  const handleRefresh = async () => {
    setLoading(true)
    await fetchOrders()
    setLoading(false)
  }

  const handleStatusChange = async (orderId: string | number, newStatus: Order['status']) => {
    setActionLoading(String(orderId))
    try {
      await updateOrderStatus(orderId, newStatus)
    } finally {
      setActionLoading(null)
    }
  }

  const getStatusBadge = (status: Order['status']) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      processing: 'bg-blue-100 text-blue-700 border-blue-200',
      shipped: 'bg-purple-100 text-purple-700 border-purple-200',
      delivered: 'bg-green-100 text-green-700 border-green-200',
      cancelled: 'bg-red-100 text-red-700 border-red-200',
    }

    const labels: Record<string, string> = {
      pending: 'Bekliyor',
      processing: 'Hazırlanıyor',
      shipped: 'Yola Çıktı',
      delivered: 'Teslim Edildi',
      cancelled: 'İptal Edildi'
    }

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${styles[status]} flex items-center gap-1 w-fit`}>
        {status === 'delivered' && <CheckCircle className="w-3 h-3" />}
        {status === 'processing' && <Clock className="w-3 h-3" />}
        {status === 'shipped' && <Truck className="w-3 h-3" />}
        {status === 'cancelled' && <AlertTriangle className="w-3 h-3" />}
        {labels[status] || status}
      </span>
    )
  }

  const totalRevenue = orders.reduce((sum, o) => sum + (o.status !== 'cancelled' ? o.total : 0), 0)
  const pendingCount = orders.filter((o) => o.status === 'pending').length
  const todayOrders = orders.filter((o) => {
    const date = new Date(o.createdAt)
    const today = new Date()
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
  }).length

  return (
    <div className="space-y-6 animate-in fade-in duration-500">

      {/* HEADER & STATS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-4 flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Sipariş Yönetimi</h1>
            <p className="text-gray-500">Gelen siparişleri buradan takip edip yönetebilirsiniz.</p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50 flex items-center gap-2 shadow-sm"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Yenile
          </button>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Toplam Sipariş</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{orders.length}</h3>
            </div>
            <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
              <Package className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Bekleyen</p>
              <h3 className="text-2xl font-bold text-yellow-600 mt-1">{pendingCount}</h3>
            </div>
            <div className="p-2 bg-yellow-50 rounded-lg text-yellow-600">
              <Clock className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Bugün</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{todayOrders}</h3>
            </div>
            <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Net Ciro</p>
              <h3 className="text-2xl font-bold text-green-600 mt-1">₺{totalRevenue.toLocaleString('tr-TR')}</h3>
            </div>
            <div className="p-2 bg-green-50 rounded-lg text-green-600">
              <CheckCircle className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      {/* FILTERS & TABLE */}
      <div className="bg-white rounded-3xl shadow-xl shadow-gray-100/50 border border-gray-100 overflow-hidden">

        {/* Toolbar */}
        <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between bg-gray-50/50">
          <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 no-scrollbar">
            {[
              { id: 'all', label: 'Tümü' },
              { id: 'pending', label: 'Bekleyen' },
              { id: 'processing', label: 'Hazırlanan' },
              { id: 'shipped', label: 'Yolda' },
              { id: 'delivered', label: 'Teslim' },
              { id: 'cancelled', label: 'İptal' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setFilterStatus(tab.id as any)}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${filterStatus === tab.id
                  ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/30'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Sipariş, isim veya e-posta ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-500 transition-all text-sm"
            />
          </div>
        </div>

        {/* Mobile View (Cards) */}
        <div className="md:hidden">
          {filteredOrders.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-300" />
              </div>
              <p>Sipariş bulunamadı.</p>
            </div>
          ) : (
            <div className="space-y-4 p-4">
              {filteredOrders.map((order) => {
                const customerName = (order.customer as any)?.name || (order.shipping as any)?.name || 'Misafir'
                const isActionLoading = actionLoading === String(order.id)

                return (
                  <div key={order.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm space-y-3">
                    <div className="flex justify-between items-start gap-4">
                      <div className="min-w-0 flex-1">
                        <span className="font-mono font-bold text-gray-900">#{String(order.id).slice(-6)}</span>
                        <p className="text-sm font-medium text-gray-900 mt-1 truncate">{customerName}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        {getStatusBadge(order.status)}
                      </div>
                    </div>

                    <div className="flex justify-between items-center border-t border-gray-50 pt-3">
                      <span className="font-bold text-primary-600 text-lg">₺{order.total.toLocaleString('tr-TR')}</span>
                      <div className="flex items-center gap-2">
                        {order.status === 'pending' && (
                          <button
                            onClick={(e) => { e.stopPropagation(); handleStatusChange(order.id, 'processing'); }}
                            disabled={isActionLoading}
                            className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold"
                          >
                            Onayla
                          </button>
                        )}
                        <button
                          onClick={() => navigate(`/admin/orders/${order.id}`)}
                          className="p-2 text-gray-400 hover:text-primary-600 bg-gray-50 rounded-lg"
                        >
                          <ArrowRight className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Desktop View (Table) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="text-left py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Sipariş ID</th>
                <th className="text-left py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Müşteri</th>
                <th className="text-left py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider cursor-pointer hover:text-primary-600" onClick={() => handleSort('createdAt')}>
                  <div className="flex items-center gap-1">Tarih <ChevronDown className="w-3 h-3" /></div>
                </th>
                <th className="text-left py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Tutar</th>
                <th className="text-left py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Durum</th>
                <th className="text-right py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-20 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                        <Search className="w-8 h-8 text-gray-300" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900">Sipariş Bulunamadı</h3>
                      <p className="text-gray-500">Arama kriterlerinize uygun kayıt yok.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const customerName = (order.customer as any)?.name || (order.shipping as any)?.name || 'Misafir'
                  const customerEmail = (order.customer as any)?.email || 'misafir@lilyumflora.net'
                  const isActionLoading = actionLoading === String(order.id)

                  return (
                    <tr key={order.id} className="hover:bg-gray-50/80 transition-colors group">
                      <td className="py-4 px-6">
                        <span className="font-mono font-bold text-gray-900">#{String(order.id).slice(-6)}</span>
                      </td>
                      <td className="py-4 px-6">
                        <div>
                          <p className="font-bold text-gray-900">{customerName}</p>
                          <p className="text-xs text-gray-500">{customerEmail}</p>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-gray-900">
                            {new Date(order.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })}
                          </span>
                          <span className="text-xs text-gray-400">
                            {new Date(order.createdAt).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="font-bold text-primary-600 text-lg">
                          ₺{order.total.toLocaleString('tr-TR')}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        {getStatusBadge(order.status)}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                          {/* Quick Actions */}
                          {order.status === 'pending' && (
                            <button
                              onClick={(e) => { e.stopPropagation(); handleStatusChange(order.id, 'processing'); }}
                              disabled={isActionLoading}
                              className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold hover:bg-blue-100 transition-colors"
                            >
                              Onayla
                            </button>
                          )}
                          {order.status === 'processing' && (
                            <button
                              onClick={(e) => { e.stopPropagation(); handleStatusChange(order.id, 'shipped'); }}
                              disabled={isActionLoading}
                              className="px-3 py-1.5 bg-purple-50 text-purple-600 rounded-lg text-xs font-bold hover:bg-purple-100 transition-colors"
                            >
                              Yola Çıkar
                            </button>
                          )}
                          {order.status === 'shipped' && (
                            <button
                              onClick={(e) => { e.stopPropagation(); handleStatusChange(order.id, 'delivered'); }}
                              disabled={isActionLoading}
                              className="px-3 py-1.5 bg-green-50 text-green-600 rounded-lg text-xs font-bold hover:bg-green-100 transition-colors"
                            >
                              Teslim Et
                            </button>
                          )}

                          <button
                            onClick={() => navigate(`/admin/orders/${order.id}`)}
                            className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
                            title="Detayları Gör"
                          >
                            <ArrowRight className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-gray-100 bg-gray-50 text-xs text-center text-gray-400">
          Toplam {filteredOrders.length} kayıt listeleniyor
        </div>

      </div>
    </div>
  )
}
