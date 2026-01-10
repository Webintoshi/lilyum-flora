import { useState, useEffect } from "react";
import { Package, Truck, CheckCircle, Clock, MapPin, AlertCircle } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";

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
    label: 'Kargoya Verildi',
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
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrderDetails();
  }, [id]);

  const fetchOrderDetails = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/orders/${id}`);
      
      if (!response.ok) {
        throw new Error('Sipariş bulunamadı');
      }

      const data = await response.json();
      setOrder(data);
      setIsLoading(false);
    } catch (error) {
      console.error('Fetch order error:', error);
      setError('Sipariş yüklenemedi. Lütfen tekrar deneyin.');
      setIsLoading(false);
    }
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
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <a href="/" className="text-2xl font-bold text-pink-500">Lilyum Flora</a>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="/" className="text-gray-700 hover:text-pink-500 transition-colors">Ana Sayfa</a>
              <a href="/catalog" className="text-gray-700 hover:text-pink-500 transition-colors">Katalog</a>
              <a href="/contact" className="text-gray-700 hover:text-pink-500 transition-colors">İletişim</a>
            </nav>
          </div>
        </div>
      </header>

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
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    order.status === 'pending' || order.status === 'confirmed' || order.status === 'shipped' || order.status === 'delivered'
                      ? 'bg-green-500' : 'bg-gray-300'
                  }`}>
                    <Package className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className={`font-semibold ${order.status === 'pending' || order.status === 'confirmed' || order.status === 'shipped' || order.status === 'delivered' ? 'text-gray-800' : 'text-gray-400'}`}>Hazırlanıyor</h3>
                  <p className="text-sm text-gray-500">{order.date}</p>
                  <p className="text-gray-600">Çiçekleriniz özenle hazırlanıyor.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    order.status === 'shipped' || order.status === 'delivered'
                      ? 'bg-green-500' : order.status === 'confirmed' ? 'bg-pink-500 animate-pulse' : 'bg-gray-300'
                  }`}>
                    <Truck className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className={`font-semibold ${order.status === 'shipped' || order.status === 'delivered' ? 'text-pink-500' : 'text-gray-400'}`}>Kargoya Verildi</h3>
                  <p className="text-sm text-gray-500">{order.date}</p>
                  <p className="text-gray-600">Siparişiniz kargoya verildi ve teslimat yolunda.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 opacity-50">
                <div className="flex-shrink-0">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    order.status === 'delivered' ? 'bg-green-500' : 'bg-gray-300'
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
                    <span className="text-3xl">{item.image}</span>
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

      <footer className="bg-gray-800 text-white py-8 px-4">
        <div className="max-w-7xl mx-auto text-center text-gray-400">
          <p>&copy; 2024 Lilyum Flora. Tüm hakları saklıdır.</p>
        </div>
      </footer>
    </div>
  );
}