import { useEffect, useState } from "react";
import { Package, Truck, CheckCircle, Clock, MapPin, AlertCircle, ExternalLink } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { useOrderStore } from "@/store/orderStore";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getTrackingInfo, TrackingInfo, CARRIERS } from "@/lib/tracking";

interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface Order {
  id: number;
  orderNumber: string;
  date: string;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  totalAmount: number;
  items: OrderItem[];
  shippingAddress: {
    name: string;
    phone: string;
    address: string;
    district: string;
    city: string;
  };
  estimatedDelivery?: string;
  trackingNumber?: string;
  carrier?: string;
}

const statusConfig = {
  pending: {
    label: 'Beklemede',
    color: 'bg-yellow-500',
    icon: Clock,
  },
  confirmed: {
    label: 'Onaylandı',
    color: 'bg-blue-500',
    icon: CheckCircle,
  },
  shipped: {
    label: 'Yola Çıktı',
    color: 'bg-purple-500',
    icon: Truck,
  },
  delivered: {
    label: 'Teslim Edildi',
    color: 'bg-green-500',
    icon: CheckCircle,
  },
  cancelled: {
    label: 'İptal Edildi',
    color: 'bg-red-500',
    icon: AlertCircle,
  },
};

export default function OrderTracking() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentOrder: order, isLoading, error, fetchOrderById } = useOrderStore();
  const [trackingInfo, setTrackingInfo] = useState<TrackingInfo | null>(null);
  const [trackingLoading, setTrackingLoading] = useState(false);

  useEffect(() => {
    if (id) {
      fetchOrderById(id);
    }
  }, [id, fetchOrderById]);

  useEffect(() => {
    if (order?.trackingNumber && (order.status === 'shipped' || order.status === 'delivered')) {
      fetchTrackingInfo(order.trackingNumber);
    }
  }, [order]);

  const fetchTrackingInfo = async (trackingNumber: string) => {
    setTrackingLoading(true);
    try {
      const info = await getTrackingInfo(trackingNumber);
      setTrackingInfo(info);
    } catch (error) {
      console.error('Failed to fetch tracking info:', error);
    } finally {
      setTrackingLoading(false);
    }
  };

  const getCarrierTrackingUrl = (trackingNumber?: string, carrier?: string) => {
    if (!trackingNumber) return null;
    const carrierKey = carrier?.toUpperCase() as keyof typeof CARRIERS;
    if (carrierKey && CARRIERS[carrierKey]) {
      return CARRIERS[carrierKey].trackingUrl(trackingNumber);
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Sipariş yükleniyor...</p>
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
            onClick={() => navigate('/profile/orders')}
            className="bg-pink-500 text-white px-8 py-3 rounded-lg hover:bg-pink-600 transition-colors"
          >
            Sipariş Geçmişine Dön
          </button>
        </div>
      </div>
    );
  }

  if (!order) {
    return null;
  }

  const statusInfo = statusConfig[order.status];
  const StatusIcon = statusInfo.icon;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Sipariş Takibi</h1>
        <p className="text-gray-600 mb-8">
          Sipariş numarası: <span className="font-bold text-pink-500">#{order.orderNumber}</span>
        </p>

        <div className="space-y-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Sipariş Durumu</h2>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">Sipariş Alındı</h3>
                  <p className="text-sm text-gray-500">{order.date}</p>
                  <p className="text-gray-600">Siparişiniz başarıyla alındı ve hazırlanmaya başlandı.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${order.status === 'pending' || order.status === 'preparing' || order.status === 'shipped' || order.status === 'delivered'
                      ? 'bg-green-500' : 'bg-gray-300'
                    }`}>
                    <Package className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className={`font-semibold ${order.status === 'pending' || order.status === 'preparing' || order.status === 'shipped' || order.status === 'delivered' ? 'text-gray-800' : 'text-gray-400'}`}>Hazırlanıyor</h3>
                  <p className="text-sm text-gray-500">{order.date}</p>
                  <p className="text-gray-600">Çiçekleriniz özenle hazırlanıyor.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${order.status === 'shipped' || order.status === 'delivered'
                      ? 'bg-green-500' : order.status === 'preparing' ? 'bg-pink-500 animate-pulse' : 'bg-gray-300'
                    }`}>
                    <Truck className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className={`font-semibold ${order.status === 'shipped' || order.status === 'delivered' ? 'text-pink-500' : 'text-gray-400'}`}>Yola Çıktı</h3>
                  <p className="text-sm text-gray-500">{order.date}</p>
                  <p className="text-gray-600">Siparişiniz yola çıktı ve teslimat adresine doğru ilerliyor.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 opacity-50">
                <div className="flex-shrink-0">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${order.status === 'delivered' ? 'bg-green-500' : 'bg-gray-300'
                    }`}>
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className={`font-semibold ${order.status === 'delivered' ? 'text-gray-800' : 'text-gray-400'}`}>Teslim Edildi</h3>
                  <p className="text-sm text-gray-500">{order.estimatedDelivery || 'Bekleniyor...'}</p>
                  <p className="text-gray-600">Siparişiniz alıcıya teslim edilecek.</p>
                </div>
              </div>
            </div>
          </div>

          {order.trackingNumber && (order.status === 'shipped' || order.status === 'delivered') && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                <Truck className="w-5 h-5 mr-2 text-pink-500" />
                Teslimat Takip Bilgileri
              </h2>

              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600">Takip Numarası:</span>
                  <span className="font-bold text-pink-500">{order.trackingNumber}</span>
                </div>
                {order.carrier && (
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-gray-600">Teslimat Firması:</span>
                    <span className="font-semibold">{order.carrier}</span>
                  </div>
                )}
                {getCarrierTrackingUrl(order.trackingNumber, order.carrier) && (
                  <a
                    href={getCarrierTrackingUrl(order.trackingNumber, order.carrier)!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-pink-500 hover:text-pink-600 font-medium"
                  >
                    Detaylı Takip için Teslimat Sitesine Git
                    <ExternalLink className="w-4 h-4 ml-1" />
                  </a>
                )}
              </div>

              {trackingLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 mx-auto mb-2"></div>
                  <p className="text-gray-600">Takip bilgileri yükleniyor...</p>
                </div>
              ) : trackingInfo?.history && trackingInfo.history.length > 0 ? (
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-800 mb-4">Takip Geçmişi</h3>
                  <div className="relative">
                    <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-pink-200"></div>
                    {trackingInfo.history.map((event, index) => (
                      <div key={index} className="relative flex items-start pb-6 last:pb-0">
                        <div className="flex-shrink-0 w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center z-10">
                          <CheckCircle className="w-4 h-4 text-white" />
                        </div>
                        <div className="ml-4 flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-semibold text-gray-800">{event.description}</h4>
                            <span className="text-sm text-gray-500">
                              {new Date(event.date).toLocaleString('tr-TR', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                          {event.location && (
                            <p className="text-sm text-gray-600 flex items-center">
                              <MapPin className="w-3 h-3 mr-1" />
                              {event.location}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <AlertCircle className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                  <p>Takip bilgileri henüz güncellenmedi</p>
                </div>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <Package className="w-5 h-5 mr-2 text-pink-500" />
                Sipariş Detayları
              </h2>
              <div className="space-y-3 text-gray-600">
                <div className="flex justify-between">
                  <span>Sipariş No:</span>
                  <span className="font-semibold">#{order.orderNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span>Sipariş Tarihi:</span>
                  <span className="font-semibold">{order.date}</span>
                </div>
                <div className="flex justify-between">
                  <span>Ödeme Yöntemi:</span>
                  <span className="font-semibold">Kredi Kartı</span>
                </div>
                <div className="flex justify-between">
                  <span>Ürün Sayısı:</span>
                  <span className="font-semibold">{order.items.length}</span>
                </div>
                <hr className="my-3" />
                <div className="flex justify-between text-lg font-bold text-pink-500">
                  <span>Toplam:</span>
                  <span>{order.totalAmount} ₺</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-pink-500" />
                Teslimat Bilgileri
              </h2>
              <div className="space-y-3 text-gray-600">
                <div className="flex items-start space-x-2">
                  <Clock className="w-4 h-4 text-pink-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-800">Tahmini Teslimat</p>
                    <p className="text-sm">{order.estimatedDelivery || 'Bekleniyor...'}</p>
                  </div>
                </div>
                <hr className="my-3" />
                <div>
                  <p className="font-semibold text-gray-800 mb-1">Alıcı</p>
                  <p>{order.shippingAddress.name}</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-800 mb-1">Telefon</p>
                  <p>{order.shippingAddress.phone}</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-800 mb-1">Adres</p>
                  <p>{order.shippingAddress.address}, {order.shippingAddress.district}, {order.shippingAddress.city}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Sipariş Ürünleri</h2>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center space-x-4 pb-4 border-b last:border-0">
                  <div className="bg-gradient-to-br from-pink-100 to-pink-200 rounded w-20 h-20 flex items-center justify-center flex-shrink-0 overflow-hidden">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">{item.name}</h3>
                    <p className="text-sm text-gray-500">Miktar: {item.quantity}</p>
                  </div>
                  <span className="text-xl font-bold text-pink-500">{item.price * item.quantity} ₺</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
