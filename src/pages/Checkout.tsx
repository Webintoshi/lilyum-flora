import { useState, useEffect } from "react";
import { ArrowLeft, CreditCard, MapPin, Clock, AlertCircle, CheckCircle, ShieldCheck, Copy, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "@/store/cartStore";
import { useOrderStore } from "@/store/orderStore";
import { useAuthStore } from "@/store/authStore";
import { useSettingsStore } from "@/store/settingsStore";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MediaMessageUpload from "@/components/MediaMessageUpload";

const CopyButton = ({ text, label }: { text: string, label: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        handleCopy();
      }}
      className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-primary-600 transition-colors relative group/btn"
      title={`${label} Kopyala`}
    >
      {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
      {copied && (
        <span className="absolute bottom-full right-0 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded shadow-lg whitespace-nowrap animate-in fade-in slide-in-from-bottom-1">
          Kopyalandı!
        </span>
      )}
    </button>
  );
};

export default function Checkout() {
  const navigate = useNavigate();
  const { items, clearCart, getTotalPrice } = useCartStore();
  const { user } = useAuthStore();
  const { createOrder } = useOrderStore();
  const { settings, fetchSettings } = useSettingsStore();
  const [formData, setFormData] = useState({
    firstName: '', // Recipient Name
    lastName: '', // Recipient Last Name
    phone: '', // Recipient Phone
    address: '',
    district: 'Altınordu',
    city: 'Ordu',
    deliveryDate: '',
    deliveryTime: '09:00 - 12:00',
    // Sender / Gift Fields
    senderName: user?.name || '',
    senderPhone: user?.phone || '',
    cardNote: '',
    isAnonymous: false,

    paymentMethod: 'card',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mediaMessage, setMediaMessage] = useState<{ url: string; type: 'video' | 'audio' | 'image' } | null>(null);

  useEffect(() => {
    console.log("Checkout: fetching settings...");
    fetchSettings().then(() => {
      console.log("Checkout: settings fetched.");
    });
  }, [fetchSettings]);

  // Handle auto-selection of payment method if current one is disabled
  useEffect(() => {
    if (settings.activePaymentMethods) {
      // Check if current method is valid
      const isValid = settings.activePaymentMethods[formData.paymentMethod as keyof typeof settings.activePaymentMethods];

      if (!isValid) {
        // Find first valid method
        const firstValid = Object.entries(settings.activePaymentMethods).find(([_, enabled]) => enabled)?.[0];
        if (firstValid) {
          setFormData(prev => ({ ...prev, paymentMethod: firstValid }));
        }
      }
    }
  }, [settings.activePaymentMethods]);

  console.log("Checkout render settings:", settings);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    if (items.length === 0) {
      setError('Sepetinizde ürün bulunmamaktadır');
      setIsLoading(false);
      return;
    }

    try {
      const order = await createOrder({
        userId: user?.id,
        items,
        shipping: {
          name: `${formData.firstName} ${formData.lastName}`,
          phone: formData.phone,
          address: formData.address,
          district: formData.district,
          city: formData.city,
          deliveryDate: formData.deliveryDate,
          deliveryTime: formData.deliveryTime,
        },
        // Sender & Gift Info
        sender: {
          name: formData.senderName,
          phone: formData.senderPhone
        },
        cardNote: formData.cardNote,
        isAnonymous: formData.isAnonymous,

        paymentMethod: formData.paymentMethod,
        totalAmount: getTotalPrice(),
        mediaMessage,
      });

      if (order) {
        setSuccess('Siparişiniz başarıyla oluşturuldu!');
        clearCart();
        setTimeout(() => {
          navigate(`/checkout/success?order=${order.orderNumber}`);
        }, 1500);
      }
    } catch (error: any) {
      console.error('Checkout detailed error:', error);
      setError(`Sipariş oluşturulamadı: ${error?.message || 'Bilinmeyen hata'}`);
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white flex flex-col font-sans">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Sepetiniz Boş</h1>
            <p className="text-gray-500 mb-8">Sipariş oluşturmak için sepetinize ürün ekleyin</p>
            <button
              onClick={() => navigate('/catalog')}
              className="bg-primary-600 text-white px-8 py-3 rounded-full font-bold hover:bg-primary-700 transition-colors shadow-lg shadow-primary-600/20"
            >
              Alışverişe Dön
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="mb-8">
          <button onClick={() => navigate('/cart')} className="inline-flex items-center text-gray-500 hover:text-primary-600 transition-colors mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Sepete Dön
          </button>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Ödeme</h1>
          <p className="text-gray-500 mt-2">Siparişinizi güvenle tamamlayın.</p>
        </div>

        {error && (
          <div className="mb-8 bg-red-50 border border-red-200 rounded-xl p-4 flex items-center space-x-3 animate-pulse">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <span className="text-red-700 font-medium">{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-8 bg-green-50 border border-green-200 rounded-xl p-4 flex items-center space-x-3">
            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
            <span className="text-green-700 font-medium">{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT COLUMN - FORMS */}
          <div className="lg:col-span-2 space-y-6">

            {/* Delivery Info (RECIPIENT) */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Alıcı Bilgileri</h2>
                  <p className="text-sm text-gray-500">Çiçeğin teslim edileceği kişi</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Alıcı Adı</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="Alıcı Adı"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Alıcı Soyadı</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Alıcı Soyadı"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Alıcı Telefon Numarası</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="05XX XXX XX XX"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all"
                    required
                  />
                  <p className="text-xs text-gray-400 mt-1">Teslimat sırasında gerekirse aranacaktır.</p>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Teslimat Adresi</label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Mahalle, Cadde, Sokak, Bina No, Daire No..."
                    rows={3}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all resize-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">İlçe</label>
                  <select
                    name="district"
                    value={formData.district}
                    disabled
                    className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl focus:outline-none cursor-not-allowed text-gray-500 font-medium"
                  >
                    <option value="Altınordu">Altınordu</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Şehir</label>
                  <select
                    name="district"
                    value="Ordu" // fixed
                    disabled
                    className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl focus:outline-none cursor-not-allowed text-gray-500 font-medium"
                  >
                    <option value="Ordu">Ordu</option>
                  </select>
                  <p className="text-xs text-orange-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    Sadece Ordu / Altınordu içine teslimat yapılmaktadır.
                  </p>
                </div>

                {/* Date & Time */}
                <div className="md:col-span-2 pt-4 border-t border-gray-100 mt-2">
                  <p className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary-600" /> Zamanlama
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Teslimat Tarihi</label>
                      <input
                        type="date"
                        name="deliveryDate"
                        value={formData.deliveryDate}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Teslimat Saati</label>
                      <select
                        name="deliveryTime"
                        value={formData.deliveryTime}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all cursor-pointer"
                        required
                      >
                        <option>09:00 - 12:00</option>
                        <option>12:00 - 15:00</option>
                        <option>15:00 - 18:00</option>
                        <option>18:00 - 21:00</option>
                      </select>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Card Note & Gift Options */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-pink-50 rounded-bl-[100px] -mr-10 -mt-10 opacity-60 pointer-events-none"></div>

              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100 relative">
                <div className="w-10 h-10 rounded-full bg-pink-50 flex items-center justify-center">
                  {/* Gift Icon */}
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-pink-500"><polyline points="20 12 20 22 4 22 4 12"></polyline><rect x="2" y="7" width="20" height="5"></rect><line x1="12" y1="22" x2="12" y2="7"></line><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"></path><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></path></svg>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Kart Notu</h2>
                  <p className="text-sm text-gray-500">Çiçeğinizle birlikte gidecek mesaj</p>
                </div>
              </div>

              <div className="space-y-4">
                <textarea
                  name="cardNote"
                  value={formData.cardNote}
                  onChange={handleChange}
                  placeholder="Sevdiklerinize iletmek istediğiniz notu buraya yazın..."
                  rows={4}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 focus:bg-white transition-all resize-none"
                />

                <label className="flex items-center space-x-3 cursor-pointer group p-3 rounded-lg hover:bg-gray-50 transition-colors w-fit">
                  <div className="relative flex items-center">
                    <input
                      type="checkbox"
                      name="isAnonymous"
                      checked={formData.isAnonymous}
                      onChange={(e) => setFormData({ ...formData, isAnonymous: e.target.checked })}
                      className="w-5 h-5 text-pink-500 border-gray-300 rounded focus:ring-pink-500"
                    />
                  </div>
                  <span className="text-gray-700 font-medium group-hover:text-gray-900">İsmim Kartta Görünmesin (Anonim Gönderim)</span>
                </label>
              </div>
            </div>

            {/* Sender Info */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                  {/* User Icon */}
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Gönderici Bilgileri</h2>
                  <p className="text-sm text-gray-500">Sipariş durumu ve fatura için sizin bilgileriniz</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Adınız Soyadınız</label>
                  <input
                    type="text"
                    name="senderName"
                    value={formData.senderName}
                    onChange={handleChange}
                    placeholder="Ad Soyad"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Telefon Numaranız</label>
                  <input
                    type="tel"
                    name="senderPhone"
                    value={formData.senderPhone}
                    onChange={handleChange}
                    placeholder="05XX XXX XX XX"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white transition-all"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Ödeme Yöntemi</h2>
                  <p className="text-sm text-gray-500">Güvenli ödeme altyapısı</p>
                </div>
              </div>

              <div className="space-y-3">
                {(settings.activePaymentMethods?.card ?? true) && (
                  <label className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${formData.paymentMethod === 'card' ? 'border-primary-600 bg-primary-50/30' : 'border-gray-200 hover:border-primary-200'}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={formData.paymentMethod === 'card'}
                      onChange={handleChange}
                      className="w-5 h-5 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="ml-3 font-bold text-gray-800">Kredi / Banka Kartı</span>
                    <div className="ml-auto flex gap-2">
                      {/* Mock icons */}
                      <div className="w-8 h-5 bg-gray-200 rounded"></div>
                      <div className="w-8 h-5 bg-gray-200 rounded"></div>
                    </div>
                  </label>
                )}

                {(settings.activePaymentMethods?.bank ?? true) && (
                  <label className={`flex flex-col p-4 border-2 rounded-xl cursor-pointer transition-all ${formData.paymentMethod === 'bank' ? 'border-primary-600 bg-primary-50/30' : 'border-gray-200 hover:border-primary-200'}`}>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="bank"
                        checked={formData.paymentMethod === 'bank'}
                        onChange={handleChange}
                        className="w-5 h-5 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="ml-3 font-bold text-gray-800">Havale / EFT</span>
                    </div>

                    {formData.paymentMethod === 'bank' && (
                      <div className="mt-4 pl-8 text-sm text-gray-600 animate-in slide-in-from-top-2 duration-200 space-y-3">
                        {settings?.bankAccounts && settings.bankAccounts.length > 0 ? (
                          settings.bankAccounts.map((account) => (
                            <div key={account.id} className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm space-y-1 relative overflow-hidden group">
                              <div className="absolute top-0 right-0 w-16 h-16 bg-primary-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
                              <p className="relative z-10"><span className="font-semibold text-gray-900">Banka:</span> {account.bankName}</p>
                              <p className="relative z-10"><span className="font-semibold text-gray-900">IBAN:</span> <span className="font-mono select-all bg-gray-50 px-1 rounded">{account.iban}</span></p>
                              <p className="relative z-10"><span className="font-semibold text-gray-900">Alıcı:</span> {account.accountHolder}</p>
                            </div>
                          ))
                        ) : (
                          <div className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm space-y-1">
                            <p className="text-gray-500 italic">Aktif banka hesabı bulunamadı.</p>
                          </div>
                        )}

                        <p className="mt-2 text-xs text-primary-600 flex items-start gap-1">
                          <AlertCircle className="w-3 h-3 flex-shrink-0 mt-0.5" />
                          <span>Siparişiniz onaylandıktan sonra lütfen yukarıdaki hesaplardan birine ödeme yapınız. Açıklama kısmına sipariş numaranızı yazmayı unutmayınız.</span>
                        </p>
                      </div>
                    )}
                  </label>
                )}

                {(settings.activePaymentMethods?.cod ?? true) && (
                  <label className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${formData.paymentMethod === 'cod' ? 'border-primary-600 bg-primary-50/30' : 'border-gray-200 hover:border-primary-200'}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={formData.paymentMethod === 'cod'}
                      onChange={handleChange}
                      className="w-5 h-5 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="ml-3 font-bold text-gray-800">Kapıda Ödeme</span>
                  </label>
                )}

                {/* Fallback if no payment method is active */}
                {!((settings.activePaymentMethods?.card ?? true) || (settings.activePaymentMethods?.bank ?? true) || (settings.activePaymentMethods?.cod ?? true)) && (
                  <div className="p-4 bg-red-50 text-red-700 text-sm rounded-xl border border-red-100 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    Aktif ödeme yöntemi bulunmamaktadır. Lütfen yönetici ile iletişime geçiniz.
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN - SUMMARY */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Sipariş Özeti</h2>

              <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {items.map(item => (
                  <div key={item.id} className="flex gap-3">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      {item.image.startsWith('http') || item.image.startsWith('data:') ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200 text-xs text-gray-500">Resim Yok</div>
                      )}
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 line-clamp-2">{item.name}</h4>
                      <p className="text-sm text-gray-500">Adet: {item.quantity}</p>
                      <p className="text-sm font-semibold text-primary-600">{item.price.toLocaleString('tr-TR')} ₺</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 pt-6 border-t border-gray-100">
                <div className="flex justify-between text-gray-600">
                  <span>Ara Toplam</span>
                  <span>{getTotalPrice().toLocaleString('tr-TR')} ₺</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Teslimat</span>
                  <span className="text-green-600 font-medium">Ücretsiz</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-gray-900 pt-3 border-t border-gray-100 mt-3">
                  <span>Toplam</span>
                  <span className="text-primary-600">{getTotalPrice().toLocaleString('tr-TR')} ₺</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-8 bg-primary-600 text-white py-4 rounded-xl hover:bg-primary-700 transition-colors font-bold text-lg shadow-lg shadow-primary-600/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    İşleniyor...
                  </span>
                ) : (
                  <>
                    <ShieldCheck className="w-5 h-5" />
                    Siparişi Tamamla
                  </>
                )}
              </button>

              <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-400">
                <ShieldCheck className="w-4 h-4" />
                <span>256-bit SSL ile güvenli ödeme</span>
              </div>
            </div>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
}
