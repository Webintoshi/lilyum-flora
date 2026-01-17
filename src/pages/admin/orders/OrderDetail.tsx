import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft, CheckCircle, Printer, Calendar, MapPin, User,
  Package, CreditCard, Clock, Phone, Mail,
  Truck, ShieldCheck, AlertTriangle
} from 'lucide-react'
import { useAdminStore } from '@/store/adminStore'
import type { Order } from '@/types'
import DeliveryPhotoUpload from '@/components/DeliveryPhotoUpload'

export default function OrderDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { orders, fetchOrders, updateOrderStatus } = useAdminStore()
  const [updating, setUpdating] = useState(false)
  const [deliveryPhoto, setDeliveryPhoto] = useState<string | null>(null)
  const [photoApproved, setPhotoApproved] = useState<boolean | undefined>(undefined)

  const order = orders.find((o) => String(o.id) === id)

  // Fetch orders if not loaded (e.g. direct link access)
  useEffect(() => {
    if (!order) {
      fetchOrders()
    }
  }, [id, fetchOrders, order])

  const handleStatusChange = async (newStatus: Order['status']) => {
    if (!order) return
    setUpdating(true)
    try {
      await updateOrderStatus(order.id, newStatus)
    } finally {
      setUpdating(false)
    }
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
        <p className="text-gray-500">Sipariş detayları yükleniyor...</p>
      </div>
    )
  }

  // Safe data access helpers
  // Safe data access helpers
  const shipping = (order.shipping || {}) as any
  const customer = (order.customer || {}) as any
  const items = (order.items || []) as any

  // Status Badge Helper
  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
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
      <span className={`px-4 py-1.5 rounded-full text-sm font-bold border ${styles[status] || styles.pending} flex items-center gap-2 shadow-sm`}>
        {status === 'delivered' && <CheckCircle className="w-4 h-4" />}
        {status === 'processing' && <Clock className="w-4 h-4" />}
        {status === 'shipped' && <Truck className="w-4 h-4" />}
        {status === 'cancelled' && <AlertTriangle className="w-4 h-4" />}
        {labels[status] || status}
      </span>
    )
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-6">
        <div>
          <button
            onClick={() => navigate('/admin/orders')}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors mb-2 text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Sipariş Listesine Dön
          </button>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-gray-900">#{order.id}</h1>
            {getStatusBadge(order.status)}
          </div>
          <p className="text-gray-500 mt-2 flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4" />
            {new Date(order.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', year: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all font-medium shadow-sm"
          >
            <Printer className="w-4 h-4" />
            Yazdır
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-all font-bold shadow-lg shadow-primary-600/20">
            <Package className="w-4 h-4" />
            Fatura Oluştur
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* LEFT COLUMN - MAIN DETAILS */}
        <div className="lg:col-span-2 space-y-8">

          {/* Order Items */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
              <h2 className="font-bold text-gray-900 flex items-center gap-2">
                <Package className="w-5 h-5 text-gray-400" />
                Sipariş İçeriği
              </h2>
              <span className="text-sm font-medium text-gray-500">{items.length} Ürün</span>
            </div>
            <div className="divide-y divide-gray-50">
              {items.map((item: any) => (
                <div key={item.id} className="p-6 flex gap-6 items-start hover:bg-gray-50/50 transition-colors">
                  <div className="w-24 h-24 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 flex-shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-bold text-lg text-gray-900">{item.name}</h3>
                        <p className="text-sm text-gray-500">{item.categoryName || 'Kategorisiz'}</p>
                      </div>
                      <p className="font-bold text-lg text-primary-600">
                        ₺{(item.price * item.quantity).toLocaleString('tr-TR')}
                      </p>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600 bg-gray-50 rounded-lg p-2 inline-flex">
                      <span>Adet: <strong>{item.quantity}</strong></span>
                      <span className="w-px h-3 bg-gray-300"></span>
                      <span>Birim Fiyat: <strong>₺{item.price}</strong></span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="p-6 bg-gray-50/80 border-t border-gray-100">
              <div className="flex flex-col gap-2 max-w-xs ml-auto">
                <div className="flex justify-between text-gray-600">
                  <span>Ara Toplam</span>
                  <span>₺{(order.total || 0).toLocaleString('tr-TR')}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Teslimat</span>
                  <span className="text-green-600 font-medium">Ücretsiz</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-gray-900 border-t border-gray-200 pt-3 mt-1">
                  <span>Genel Toplam</span>
                  <span className="text-primary-600">₺{(order.total || 0).toLocaleString('tr-TR')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Status Actions */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-gray-400" />
              Durum Güncelle
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
                <button
                  key={status}
                  onClick={() => handleStatusChange(status as Order['status'])}
                  disabled={updating || order.status === status}
                  className={`
                      px-3 py-3 rounded-xl font-bold text-sm transition-all border
                      ${order.status === status
                      ? 'bg-primary-600 text-white border-primary-600 ring-2 ring-primary-100 ring-offset-2'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-primary-300 hover:bg-primary-50'
                    }
                      disabled:opacity-50 disabled:cursor-not-allowed
                    `}
                >
                  {status === 'pending' && 'Bekliyor'}
                  {status === 'processing' && 'Hazırlanıyor'}
                  {status === 'shipped' && 'Yola Çıktı'}
                  {status === 'delivered' && 'Teslim Edildi'}
                  {status === 'cancelled' && 'İptal Et'}
                </button>
              ))}
            </div>
          </div>

          {/* Delivery Photo */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Package className="w-5 h-5 text-gray-400" />
              Teslimat Kanıtı
            </h2>
            <DeliveryPhotoUpload
              orderId={order.id}
              existingPhoto={order.deliveryPhotoUrl || null}
              approved={order.deliveryPhotoApproved}
              onPhotoChange={setDeliveryPhoto}
              onApprove={setPhotoApproved}
            />
          </div>

        </div>

        {/* RIGHT COLUMN - SIDEBAR */}
        <div className="space-y-6">

          {/* Sender & Note Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-pink-50 flex items-center justify-center">
                <User className="w-5 h-5 text-pink-600" />
              </div>
              <div>
                <h2 className="font-bold text-gray-900">Gönderici & Not</h2>
                <p className="text-xs text-gray-500">Kart ve Gönderen Detayları</p>
              </div>
            </div>

            <div className="space-y-4">
              {order.sender && (
                <>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Gönderici Adı</p>
                      <p className="font-medium text-gray-900">{order.sender.name}</p>
                    </div>
                    {order.isAnonymous && (
                      <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-md">
                        Anonim
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Gönderici Telefon</p>
                    <p className="font-medium text-gray-900">{order.sender.phone}</p>
                  </div>
                  <div className="w-full h-px bg-gray-100 my-2"></div>
                </>
              )}

              {order.cardNote ? (
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Kart Notu</p>
                  <div className="bg-pink-50/50 p-4 rounded-xl border border-pink-100 text-gray-700 italic text-sm leading-relaxed relative">
                    <span className="absolute -top-2 -left-2 text-4xl text-pink-200">"</span>
                    {order.cardNote}
                    <span className="absolute -bottom-4 -right-1 text-4xl text-pink-200">"</span>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-400 italic">Kart notu eklenmemiş.</p>
              )}
            </div>
          </div>

          {/* Customer Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                <User className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="font-bold text-gray-900">Müşteri</h2>
                <p className="text-xs text-gray-500">Siparişi Veren</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Ad Soyad</p>
                <p className="font-medium text-gray-900">{customer.name || 'İsimsiz Müşteri'}</p>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-gray-400 mt-1" />
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">E-Posta</p>
                  <p className="font-medium text-gray-900 break-all">{customer.email || '-'}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-gray-400 mt-1" />
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Telefon</p>
                  <p className="font-medium text-gray-900">{customer.phone || shipping.phone || '-'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Shipping Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <h2 className="font-bold text-gray-900">Teslimat</h2>
                <p className="text-xs text-gray-500">Alıcı ve Adres</p>
              </div>
            </div>

            <div className="space-y-4 relative">
              {/* Timeline Line */}
              <div className="absolute left-2 top-2 bottom-2 w-0.5 bg-gray-100"></div>

              <div className="relative pl-8">
                <div className="absolute left-0 top-1 w-4 h-4 rounded-full bg-white border-2 border-orange-400"></div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Alıcı</p>
                <p className="font-medium text-gray-900 text-lg">{shipping.name || '-'}</p>
              </div>

              <div className="relative pl-8">
                <div className="absolute left-0 top-1 w-4 h-4 rounded-full bg-white border-2 border-gray-300"></div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Teslimat Zamanı</p>
                <p className="font-medium text-gray-900">
                  {shipping.deliveryDate ? new Date(shipping.deliveryDate).toLocaleDateString('tr-TR') : '-'}
                  <span className="text-gray-400 mx-2">|</span>
                  {shipping.deliveryTime || '-'}
                </p>
              </div>

              <div className="relative pl-8">
                <div className="absolute left-0 top-1 w-4 h-4 rounded-full bg-white border-2 border-gray-300"></div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Adres</p>
                <p className="font-medium text-gray-900 leading-relaxed">
                  {shipping.address}
                  <br />
                  <span className="text-gray-500">{shipping.district} / {shipping.city}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Payment Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-purple-600" />
              </div>
              <h2 className="font-bold text-gray-900">Ödeme</h2>
            </div>
            <div className="flex justify-between items-center bg-gray-50 p-4 rounded-xl">
              <span className="font-medium text-gray-700">Yöntem</span>
              <span className="font-bold text-gray-900 capitalize">{order.paymentMethod || 'Kredi Kartı'}</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
