import { useState, useEffect } from "react";
import { ArrowLeft, ShoppingBag, Package, CheckCircle, Clock, XCircle, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useOrderStore } from "@/store/orderStore";
import { useAuthStore } from "@/store/authStore";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface LocalOrder {
  id: string | number
  orderNumber: string
  date: string
  status: 'pending' | 'preparing' | 'shipped' | 'delivered' | 'cancelled' | 'processing' | 'returned'
  totalAmount: number
  items: any[]
  shippingAddress: {
    name: string
    phone: string
    address: string
    district: string
    city: string
  }
  estimatedDelivery?: string
  userId?: number
  trackingNumber?: string
  carrier?: string
}

const statusConfig: Record<LocalOrder['status'], { label: string; color: string; icon: any }> = {
  pending: {
    label: 'Beklemede',
    color: 'bg-yellow-100 text-yellow-700',
    icon: Clock,
  },
  preparing: {
    label: 'Hazırlanıyor',
    color: 'bg-blue-100 text-blue-700',
    icon: CheckCircle,
  },
  shipped: {
    label: 'Yola Çıktı',
    color: 'bg-purple-100 text-purple-700',
    icon: Package,
  },
  delivered: {
    label: 'Teslim Edildi',
    color: 'bg-green-100 text-green-700',
    icon: CheckCircle,
  },
  cancelled: {
    label: 'İptal Edildi',
    color: 'bg-red-100 text-red-700',
    icon: XCircle,
  },
  processing: {
    label: 'İşleniyor',
    color: 'bg-indigo-100 text-indigo-700',
    icon: Package,
  },
  returned: {
    label: 'İade Edildi',
    color: 'bg-orange-100 text-orange-700',
    icon: XCircle,
  },
};

export default function OrderHistory() {
  const navigate = useNavigate();
  const { orders, isLoading, error, fetchOrders } = useOrderStore();
  const { isAuthenticated } = useAuthStore();
  const [selectedOrder, setSelectedOrder] = useState<LocalOrder | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
    }
  }, [isAuthenticated, fetchOrders]);

  const getStatusInfo = (status: LocalOrder['status']) => {
    return statusConfig[status];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleViewOrder = (order: LocalOrder) => {
    setSelectedOrder(order);
  };

  const handleCloseModal = () => {
    setSelectedOrder(null);
  };

  if (!isAuthenticated) return null;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Siparişler yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Hata Oluştu</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => fetchOrders()}
            className="bg-primary-600 text-white px-8 py-3 rounded-lg hover:bg-primary-700 transition-colors"
          >
            Tekrar Dene
          </button>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Henüz Siparişiniz Yok</h1>
          <p className="text-gray-600 mb-6">İlk siparişinizi vermek için alışverişe başlayın</p>
          <button
            onClick={() => navigate('/catalog')}
            className="bg-primary-600 text-white px-8 py-3 rounded-lg hover:bg-primary-700 transition-colors"
          >
            Alışverişe Başla
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <a href="/profile" className="inline-flex items-center text-gray-600 hover:text-primary-600 mb-8 transition-colors">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Profili Dön
        </a>

        <h1 className="text-3xl font-bold text-gray-800 mb-8">Sipariş Geçmişi</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.map((order) => {
            const statusInfo = getStatusInfo(order.status);
            const StatusIcon = statusInfo.icon;

            return (
              <div
                key={order.id}
                className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer border border-gray-100"
                onClick={() => handleViewOrder(order)}
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-800">{order.orderNumber}</h3>
                    <p className="text-sm text-gray-500">{formatDate(order.date)}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusInfo.color}`}>
                    <StatusIcon className="w-4 h-4 inline mr-1" />
                    {statusInfo.label}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  {order.items.slice(0, 3).map((item) => (
                    <div key={item.id} className="flex items-center space-x-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">{item.name}</p>
                        <p className="text-sm text-gray-500">x{item.quantity}</p>
                      </div>
                      <p className="text-sm font-medium text-gray-800">{item.price} ₺</p>
                    </div>
                  ))}
                  {order.items.length > 3 && (
                    <p className="text-sm text-gray-500">
                      +{order.items.length - 3} ürün daha
                    </p>
                  )}
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Toplam</span>
                    <span className="text-lg font-bold text-primary-600">{order.totalAmount} ₺</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-100">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-800">
                Sipariş Detayları
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-semibold text-gray-800">{selectedOrder.orderNumber}</h3>
                  <p className="text-sm text-gray-500">{formatDate(selectedOrder.date)}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusInfo(selectedOrder.status).color
                  }`}>
                  {getStatusInfo(selectedOrder.status).label}
                </span>
              </div>

              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-3">Teslimat Adresi</h4>
                <p className="text-gray-700">{selectedOrder.shippingAddress.name}</p>
                <p className="text-gray-700">{selectedOrder.shippingAddress.phone}</p>
                <p className="text-gray-700">{selectedOrder.shippingAddress.address}</p>
                <p className="text-gray-700">{selectedOrder.shippingAddress.district}, {selectedOrder.shippingAddress.city}</p>
              </div>

              <div className="mb-6">
                <h4 className="font-semibold text-gray-800 mb-3">Sipariş Öğeleri</h4>
                <div className="space-y-3">
                  {selectedOrder.items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-800">{item.name}</p>
                        <p className="text-sm text-gray-500">Adet: {item.quantity}</p>
                      </div>
                      <p className="text-lg font-bold text-primary-600">{item.price * item.quantity} ₺</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Toplam</span>
                  <span className="text-2xl font-bold text-primary-600">{selectedOrder.totalAmount} ₺</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
