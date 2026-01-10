import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Filter, Calendar, Package, CheckCircle, XCircle, ChevronDown, ChevronUp, Eye, RefreshCw } from 'lucide-react'
import { useAdminStore } from '@/store/adminStore'
import type { Order } from '@/types'

export default function OrderList() {
  const navigate = useNavigate()
  const { orders, fetchOrders, updateOrderStatus } = useAdminStore()
  const [searchTerm, setSearchTerm] = useState('')
  const [sortField, setSortField] = useState<keyof typeof orders[0] | null>(null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  const [filterStatus, setFilterStatus] = useState<Order['status'] | 'all'>('all')
  const [loading, setLoading] = useState(false)

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
      const matchesSearch =
        order.id.toString().includes(searchTerm) ||
        order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer.email.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = filterStatus === 'all' || order.status === filterStatus

      return matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      if (!sortField) return 0
      const aValue = a[sortField]
      const bValue = b[sortField]
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

  const handleStatusChange = async (orderId: number, newStatus: Order['status']) => {
    await updateOrderStatus(orderId, newStatus)
  }

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'processing':
        return 'bg-blue-100 text-blue-800'
      case 'shipped':
        return 'bg-primary-100 text-primary-800'
      case 'delivered':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'Bekliyor'
      case 'processing':
        return 'Hazırlanıyor'
      case 'shipped':
        return 'Kargoda'
      case 'delivered':
        return 'Teslim Edildi'
      case 'cancelled':
        return 'İptal Edildi'
      default:
        return status
    }
  }

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0)
  const pendingOrders = orders.filter((o) => o.status === 'pending').length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Siparişler</h1>
          <p className="text-gray-600 mt-1">Tüm siparişleri yönetin</p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Yenile
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Toplam Sipariş</p>
              <p className="text-3xl font-bold text-gray-900">{orders.length}</p>
            </div>
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-primary-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Bekleyen Sipariş</p>
              <p className="text-3xl font-bold text-yellow-600">{pendingOrders}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Toplam Gelir</p>
              <p className="text-3xl font-bold text-primary-600">₺{totalRevenue.toLocaleString('tr-TR')}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Sipariş ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as Order['status'] | 'all')}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">Tüm Durumlar</option>
            <option value="pending">Bekliyor</option>
            <option value="processing">Hazırlanıyor</option>
            <option value="shipped">Kargoda</option>
            <option value="delivered">Teslim Edildi</option>
            <option value="cancelled">İptal Edildi</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th
                  onClick={() => handleSort('id')}
                  className="text-left py-3 px-4 font-semibold text-gray-900 cursor-pointer hover:bg-gray-50 flex items-center gap-1"
                >
                  Sipariş No
                  {sortField === 'id' && (
                    sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                  )}
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Müşteri</th>
                <th
                  onClick={() => handleSort('createdAt')}
                  className="text-left py-3 px-4 font-semibold text-gray-900 cursor-pointer hover:bg-gray-50 flex items-center gap-1"
                >
                  Tarih
                  {sortField === 'createdAt' && (
                    sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                  )}
                </th>
                <th
                  onClick={() => handleSort('total')}
                  className="text-left py-3 px-4 font-semibold text-gray-900 cursor-pointer hover:bg-gray-50 flex items-center gap-1"
                >
                  Toplam
                  {sortField === 'total' && (
                    sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                  )}
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Durum</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-500">
                    {searchTerm || filterStatus !== 'all'
                      ? 'Aradığınız kriterlere uygun sipariş bulunamadı'
                      : 'Henüz sipariş yok'}
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <div className="font-medium text-gray-900">#{order.id}</div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-medium text-gray-900">{order.customer.name}</div>
                      <div className="text-xs text-gray-500">{order.customer.email}</div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">{order.createdAt}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-bold text-primary-600">
                        ₺{order.total.toLocaleString('tr-TR')}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                        {getStatusLabel(order.status)}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => navigate(`/admin/orders/${order.id}`)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Detay"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {order.status !== 'cancelled' && order.status !== 'delivered' && (
                          <button
                            onClick={() => handleStatusChange(order.id, 'delivered')}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Teslim Edildi"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                        {order.status !== 'cancelled' && (
                          <button
                            onClick={() => handleStatusChange(order.id, 'cancelled')}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="İptal"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {filteredOrders.length > 0 && (
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <p>Toplam {filteredOrders.length} sipariş gösteriliyor</p>
              <p>Toplam: ₺{totalRevenue.toLocaleString('tr-TR')}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
