import { useEffect } from 'react'
import { ShoppingBag, DollarSign, Package, Users, AlertTriangle } from 'lucide-react'
import StatCard from '@/components/admin/StatCard'
import { useAdminStore } from '@/store/adminStore'
import type { Order } from '@/types'

export default function Dashboard() {
  const { dashboardStats, salesData, fetchDashboardStats, fetchSalesData, orders } = useAdminStore()

  useEffect(() => {
    fetchDashboardStats()
    fetchSalesData(7)
  }, [fetchDashboardStats, fetchSalesData])

  const recentOrders = orders.slice(0, 5)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getStatusBadge = (status: Order['status']) => {
    const statusConfig = {
      pending: { label: 'Bekliyor', color: 'bg-yellow-100 text-yellow-800' },
      preparing: { label: 'Hazırlanıyor', color: 'bg-primary-100 text-primary-800' },
      shipped: { label: 'Yolda', color: 'bg-primary-100 text-primary-800' },
      delivered: { label: 'Teslim Edildi', color: 'bg-green-100 text-green-800' },
      cancelled: { label: 'İptal', color: 'bg-red-100 text-red-800' },
      returned: { label: 'İade', color: 'bg-orange-100 text-orange-800' },
    }

    const config = statusConfig[status]
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${config.color}`}>
        {config.label}
      </span>
    )
  }

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Ana Sayfa</h1>
        <p className="text-gray-600 mt-1">Hoş geldiniz! İşte bugünün özeti.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Toplam Sipariş"
          value={dashboardStats?.totalOrders || 0}
          change="+12.5%"
          icon={<ShoppingBag className="w-6 h-6 text-primary-600" />}
          color="green"
        />
        <StatCard
          title="Toplam Gelir"
          value={formatCurrency(dashboardStats?.totalRevenue || 0)}
          change="+8.2%"
          icon={<DollarSign className="w-6 h-6 text-primary-600" />}
          color="green"
        />
        <StatCard
          title="Bekleyen Siparişler"
          value={dashboardStats?.pendingOrders || 0}
          icon={<Package className="w-6 h-6 text-blue-600" />}
          color="blue"
        />
        <StatCard
          title="Aktif Müşteriler"
          value={dashboardStats?.activeCustomers || 0}
          change="+5.3%"
          icon={<Users className="w-6 h-6 text-purple-600" />}
          color="purple"
        />
        <StatCard
          title="Düşük Stoklu Ürünler"
          value={dashboardStats?.lowStockProducts || 0}
          change="⚠️"
          icon={<AlertTriangle className="w-6 h-6 text-red-600" />}
          color="red"
        />
        <StatCard
          title="Ortalama Sepet Tutarı"
          value={formatCurrency(dashboardStats?.averageOrderValue || 0)}
          change="+3.1%"
          icon={<DollarSign className="w-6 h-6 text-yellow-600" />}
          color="yellow"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Son Siparişler</h2>
          <div className="space-y-4">
            {recentOrders.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Henüz sipariş yok</p>
            ) : (
              recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-semibold text-gray-900">#{order.id}</span>
                      {getStatusBadge(order.status)}
                    </div>
                    <p className="text-sm text-gray-600">{order.customer.name}</p>
                    <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-primary-600">
                      {formatCurrency(order.total)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Son 7 Gün Satış Grafiği</h2>
          <div className="space-y-3">
            {salesData.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Veri yükleniyor...</p>
            ) : (
              salesData.map((day) => {
                const maxRevenue = Math.max(...salesData.map((d) => d.revenue))
                const percentage = maxRevenue > 0 ? (day.revenue / maxRevenue) * 100 : 0

                return (
                  <div key={day.date} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">{day.date}</span>
                      <span className="font-semibold text-gray-900">
                        {formatCurrency(day.revenue)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-primary-600 to-primary-700 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
