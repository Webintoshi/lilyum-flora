import { useState } from "react";
import { Mail, Phone, MapPin, Send, MessageCircle, AlertCircle, CheckCircle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { useAdminStore } from "@/store/adminStore";

export default function Contact() {
  const { pageSEO } = useAdminStore();
  const contactSEO = pageSEO?.find(p => p.page === 'contact');

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    subject: '',
    message: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      setSuccess('Mesajınız başarıyla gönderildi! En kısa sürede size dönüş yapacağız.');
      setIsLoading(false);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        subject: '',
        message: '',
      });
    } catch (error) {
      console.error('Contact form error:', error);
      setError('Mesaj gönderilemedi. Lütfen tekrar deneyin.');
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  return (
    <div className="min-h-screen bg-neutral-50">
      <SEO
        title={contactSEO?.title || "İletişim"}
        description={contactSEO?.description}
        keywords={contactSEO?.keywords}
        image={contactSEO?.image}
        canonical="/contact"
      />
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-dark-800 mb-2">İletişim</h1>
        <p className="text-dark-600 mb-8">
          Sorularınız veya önerileriniz için bizimle iletişime geçebilirsiniz
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-dark-800 mb-6">Mesaj Gönder</h2>

              {error && (
                <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-2">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                  <span className="text-red-700">{error}</span>
                </div>
              )}

              {success && (
                <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-green-700">{success}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-dark-700 mb-2">
                      Ad
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="Adınız"
                      className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark-700 mb-2">
                      Soyad
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Soyadınız"
                      className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark-700 mb-2">
                    E-posta Adresi
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="ornek@email.com"
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark-700 mb-2">
                    Konu
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Mesaj konusu"
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark-700 mb-2">
                    Mesaj
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Mesajınızı buraya yazın..."
                    rows={6}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 transition-colors font-semibold flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Gönderiliyor...' : 'Mesajı Gönder'}
                  {!isLoading && <Send className="w-5 h-5 mr-2" />}
                </button>
              </form>
            </div>

            <div className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-lg shadow-md p-6 text-white">
              <h2 className="text-xl font-semibold mb-4">WhatsApp Canlı Destek</h2>
              <p className="mb-4 opacity-90">
                Anlık destek için WhatsApp üzerinden bizimle iletişime geçebilirsiniz
              </p>
              <a
                href="https://wa.me/905456284152"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center bg-[#25D366] text-white px-6 py-3 rounded-lg hover:bg-[#128C7E] transition-colors font-semibold"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-5.46-4.45-9.91-9.91-9.91zM6.98 15.23c-.09-.16-.47-.86-.68-1.04-.23-.19-.55-.12-.74-.06-.29.12-1.36.81-1.55.95-.25.19-.44.08-.69-.17-.39-.24-1.28-.84-1.32-.88-.04-.04-.09-.07-.15-.07-.31 0-.61.32-.61.32-.37 0-.68-.02-.87-.08-.19-.06-.37-.16-.53-.28-.28-.77-.52-1.07-.84-.3-.32-.6-.75-1.18-1.39-.57-.62-.94-1.44-1.44-2.37-.5-.93-.86-1.78-1.07-2.57-.21-.79-.31-1.52-.31-2.19 0-1.76.46-3.45 1.31-4.94.85-1.49 2.08-2.31 3.44-2.31 1.35 0 2.59.82 3.44 2.31.85 1.49 1.31 3.18 1.31 4.94 0 .67-.1 1.4-.31 2.19-.21.79-.57 1.64-1.07 2.57-.5.93-.93 1.75-1.44 2.37-.62.57-1.44 1.07-2.37 1.39-.57.31-1.81.46-2.57.46z" />
                </svg>
                WhatsApp ile İletişime Geç
              </a>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-dark-800 mb-6">İletişim Bilgileri</h2>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                      <Phone className="w-6 h-6 text-primary-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-dark-800 mb-1">Telefon</h3>
                    <p className="text-dark-600">0545 628 41 52</p>
                    <p className="text-sm text-dark-500">Pazartesi - Cumartesi: 09:00 - 21:00</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                      <Mail className="w-6 h-6 text-primary-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-dark-800 mb-1">E-posta</h3>
                    <p className="text-dark-600">info@lilyumflora.com</p>
                    <p className="text-sm text-dark-500">24 saat içinde yanıt verilir</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-primary-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-dark-800 mb-1">Adres</h3>
                    <p className="text-dark-600">Karşıyaka Mah. Kıbrıs Cd. No:49A Altınordu/Ordu</p>
                    <p className="text-sm text-dark-500">Türkiye</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6 border-b border-neutral-200">
                <h2 className="text-xl font-semibold text-dark-800">Konum</h2>
              </div>
              <div className="h-80 bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-16 h-16 text-primary-600 mx-auto mb-2" />
                  <p className="text-dark-600">Google Maps entegrasyonu burada olacak</p>
                  <p className="text-sm text-dark-500">Altınordu, Ordu</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-dark-800 mb-4">Sosyal Medya</h2>
              <p className="text-dark-600 mb-4">
                Bizi sosyal medyada takip edin, kampanya ve yeniliklerden haberdar olun
              </p>
              <div className="flex space-x-4">
                <a href="#" className="flex-1 bg-gradient-to-r from-pink-500 to-pink-600 text-white py-3 rounded-lg hover:from-pink-600 hover:to-pink-700 transition-colors text-center">
                  Instagram
                </a>
                <a href="#" className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors text-center">
                  Facebook
                </a>
                <a href="#" className="flex-1 bg-blue-400 text-white py-3 rounded-lg hover:bg-blue-500 transition-colors text-center">
                  Twitter
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
