import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Check, X, Printer, Download, Calendar, MapPin, User, Package, CreditCard, AlertCircle } from 'lucide-react'
import { useAdminStore } from '@/store/adminStore'
import type { Order } from '@/types'

export default function OrderDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { orders, fetchOrders, updateOrderStatus } = useAdminStore()
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)

  const order = orders.find((o) => o.id === parseInt(id || '0'))

  useEffect(() => {
    fetchOrders().finally(() => setLoading(false))
  }, [fetchOrders])

  const handleStatusChange = async (newStatus: Order['status']) => {
    if (!order) return
    setUpdating(true)
    try {
      await updateOrderStatus(order.id, newStatus)
    } finally {
      setUpdating(false)
    }
  }

  const handlePrint = () => {
    window.print()
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <AlertCircle className="w-16 h-16 text-gray-300 mb-4" />
        <h2 className="text-xl font-bold text-gray-900 mb-2">Sipariş Bulunamadı</h2>
        <p className="text-gray-500 mb-4">Bu ID ile bir sipariş bulunamadı</p>
        <button
          onClick={() => navigate('/admin/orders')}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          Siparişlere Dön
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => navigate('/admin/orders')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Siparişlere Dön
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Printer className="w-4 h-4" />
            Yazdır
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4" />
            İndir
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Sipariş Bilgileri</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Sipariş No</p>
                <p className="font-bold text-gray-900">#{order.id}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-1">Sipariş Tarihi</p>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <p className="font-medium text-gray-900">{order.createdAt}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-1">Durum</p>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                  {getStatusLabel(order.status)}
                </span>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-1">Ödeme Yöntemi</p>
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-gray-400" />
                  <p className="font-medium text-gray-900">{order.paymentMethod}</p>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <p className="text-sm text-gray-600 mb-1">Sipariş Durumu Güncelle</p>
              <div className="flex flex-wrap gap-2">
                {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
                  <button
                    key={status}
                    onClick={() => handleStatusChange(status as Order['status'])}
                    disabled={updating}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      order.status === status
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    } disabled:opacity-50`}
                  >
                    {getStatusLabel(status as Order['status'])}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Sipariş Ürünleri</h2>

            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />

                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-600">{item.category}</p>
                  </div>

                  <div className="text-right">
                    <p className="text-sm text-gray-600">Adet: {item.quantity}</p>
                    <p className="font-bold text-gray-900">
                      ₺{(item.price * item.quantity).toLocaleString('tr-TR')}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Ara Toplam</span>
                <span className="font-medium text-gray-900">₺{order.subtotal.toLocaleString('tr-TR')}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Kargo</span>
                <span className="font-medium text-gray-900">₺{order.shipping.toLocaleString('tr-TR')}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">İndirim</span>
                  <span className="font-medium text-green-600">-₺{order.discount.toLocaleString('tr-TR')}</span>
                </div>
              )}
              <div className="flex justify-between pt-2 border-t border-gray-200">
                <span className="font-bold text-gray-900">Toplam</span>
                <span className="font-bold text-xl text-primary-600">₺{order.total.toLocaleString('tr-TR')}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <User className="w-6 h-6 text-primary-600" />
              <h2 className="text-lg font-bold text-gray-900">Müşteri</h2>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600 mb-1">Ad Soyad</p>
                <p className="font-medium text-gray-900">{order.customer.name}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-1">E-posta</p>
                <p className="font-medium text-gray-900">{order.customer.email}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-1">Telefon</p>
                <p className="font-medium text-gray-900">{order.customer.phone}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <MapPin className="w-6 h-6 text-primary-600" />
              <h2 className="text-lg font-bold text-gray-900">Teslimat Adresi</h2>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600 mb-1">Ad</p>
                <p className="font-medium text-gray-900">{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-1">Adres</p>
                <p className="font-medium text-gray-900">{order.shippingAddress.address}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-1">Şehir / Ülke</p>
                <p className="font-medium text-gray-900">{order.shippingAddress.city}, {order.shippingAddress.country}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-1">Posta Kodu</p>
                <p className="font-medium text-gray-900">{order.shippingAddress.postalCode}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <Package className="w-6 h-6 text-primary-600" />
              <h2 className="text-lg font-bold text-gray-900">Notlar</h2>
            </div>

            <p className="text-gray-600">
              {order.notes || 'Bu sipariş için not eklenmedi.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
