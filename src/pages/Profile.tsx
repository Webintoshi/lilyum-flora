import { useState } from "react";
import { User, ShoppingBag, MapPin, Heart, LogOut, AlertCircle, CheckCircle } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Profile() {
  const { user, updateUser, logout, token } = useAuthStore();
  const [formData, setFormData] = useState({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ')[1] || '',
    email: user?.email || '',
    phone: user?.phone || '',
    currentPassword: '',
    newPassword: '',
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
      const response = await fetch('http://localhost:3001/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          phone: formData.phone,
          ...(formData.newPassword && {
            currentPassword: formData.currentPassword,
            newPassword: formData.newPassword,
          }),
        }),
      });

      if (!response.ok) {
        throw new Error('Profil güncellenemedi');
      }

      updateUser({
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: formData.phone,
      });

      setSuccess('Profil başarıyla güncellendi!');
      setIsLoading(false);
    } catch (error) {
      console.error('Profile update error:', error);
      setError('Profil güncellenemedi. Lütfen tekrar deneyin.');
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Hesabım</h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-4">
              {error && (
                <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-2">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                  <span className="text-red-700">{error}</span>
                </div>
              )}

              {success && (
                <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-green-700">{success}</span>
                </div>
              )}

              <div className="flex items-center space-x-4 mb-6 pb-6 border-b">
                <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-pink-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{user?.name}</h3>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                </div>
              </div>

              <nav className="space-y-2">
                <a href="/profile" className="flex items-center space-x-3 p-3 bg-pink-50 text-pink-500 rounded-lg">
                  <User className="w-5 h-5" />
                  <span className="font-medium">Profil Bilgileri</span>
                </a>
                <a href="/profile/orders" className="flex items-center space-x-3 p-3 text-gray-700 hover:bg-gray-50 rounded-lg">
                  <ShoppingBag className="w-5 h-5" />
                  <span>Sipariş Geçmişi</span>
                </a>
                <a href="/profile/addresses" className="flex items-center space-x-3 p-3 text-gray-700 hover:bg-gray-50 rounded-lg">
                  <MapPin className="w-5 h-5" />
                  <span>Adreslerim</span>
                </a>
                <a href="/profile/favorites" className="flex items-center space-x-3 p-3 text-gray-700 hover:bg-gray-50 rounded-lg">
                  <Heart className="w-5 h-5" />
                  <span>Favorilerim</span>
                </a>
                <button 
                  onClick={handleLogout}
                  className="flex items-center space-x-3 p-3 text-red-500 hover:bg-red-50 rounded-lg w-full text-left"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Çıkış Yap</span>
                </button>
              </nav>
            </div>
          </aside>

          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Profil Bilgileri</h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ad
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Soyad
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    E-posta Adresi
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Telefon Numarası
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mevcut Şifre
                  </label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    placeholder="Değiştirmek için şifrenizi girin"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Yeni Şifre
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    placeholder="Yeni şifrenizi girin"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>

                <div className="flex space-x-4">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 bg-pink-500 text-white py-3 rounded-lg hover:bg-pink-600 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
                  </button>
                  <button
                    type="button"
                    className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    İptal
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}