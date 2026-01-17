import { useState, useEffect } from "react";
import { User, ShoppingBag, MapPin, Heart, LogOut, AlertCircle, CheckCircle } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useNavigate } from "react-router-dom";

import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Profile() {
  const { user, updateUser, logout, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
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

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Update form data when user loads (in case of delay or refresh)
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        firstName: user.name?.split(' ')[0] || '',
        lastName: user.name?.split(' ')[1] || '',
        email: user.email || '',
        phone: user.phone || '',
      }));
    }
  }, [user]);

  if (!isAuthenticated) return null; // Prevent flash

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      if (formData.newPassword && !formData.currentPassword) {
        setError('Mevcut şifrenizi girmelisiniz (Firebase için yeniden giriş gerekebilir)');
        setIsLoading(false);
        return;
      }

      const { auth, db } = await import('@/lib/firebase');
      const { updatePassword, updateEmail, updateProfile, EmailAuthProvider, reauthenticateWithCredential } = await import('firebase/auth');
      const { doc, updateDoc } = await import('firebase/firestore');

      const currentUser = auth.currentUser;
      if (!currentUser) throw new Error('Kullanıcı oturumu bulunamadı');

      // Re-auth if password change is requested 
      if (formData.newPassword && formData.currentPassword && currentUser.email) {
        const credential = EmailAuthProvider.credential(currentUser.email, formData.currentPassword);
        await reauthenticateWithCredential(currentUser, credential);
        await updatePassword(currentUser, formData.newPassword);
      }

      // Update Profile (Auth)
      if (formData.firstName || formData.lastName) {
        await updateProfile(currentUser, {
          displayName: `${formData.firstName} ${formData.lastName}`
        });
      }

      if (formData.email && formData.email !== currentUser.email) {
        // Email update might require verification in Firebase, skipping complexity for now or handling basics
        await updateEmail(currentUser, formData.email);
      }

      // Update Firestore 'customers' collection
      const updates: any = {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: formData.phone,
        updatedAt: new Date().toISOString(),
      };

      const customerRef = doc(db, 'customers', currentUser.uid);

      // Check if document exists, if not create or set (using updateDoc here implies existence, but let's be safe)
      // Actually authStore user.id should match firestore id.
      await updateDoc(customerRef, updates);

      updateUser({
        name: updates.name,
        email: updates.email,
        phone: updates.phone,
      });

      setSuccess('Profil başarıyla güncellendi!');
      setIsLoading(false);
    } catch (error: any) {
      console.error('Profile update error:', error);
      setError('Profil güncellenemedi: ' + error.message);
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
    <div className="min-h-screen bg-neutral-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Hesabım</h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
              {error && (
                <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-2">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                  <span className="text-red-700 text-sm">{error}</span>
                </div>
              )}

              {success && (
                <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-green-700 text-sm">{success}</span>
                </div>
              )}

              <div className="flex items-center space-x-4 mb-6 pb-6 border-b border-gray-100">
                <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center border border-primary-100">
                  <User className="w-8 h-8 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{user?.name}</h3>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                </div>
              </div>

              <nav className="space-y-2">
                <a href="/profile" className="flex items-center space-x-3 p-3 bg-primary-50 text-primary-700 rounded-lg border border-primary-100">
                  <User className="w-5 h-5 text-primary-600" />
                  <span className="font-medium">Profil Bilgileri</span>
                </a>
                <a href="/profile/orders" className="flex items-center space-x-3 p-3 text-gray-600 hover:bg-gray-50 hover:text-primary-600 rounded-lg transition-colors">
                  <ShoppingBag className="w-5 h-5" />
                  <span>Sipariş Geçmişi</span>
                </a>
                <a href="/profile/addresses" className="flex items-center space-x-3 p-3 text-gray-600 hover:bg-gray-50 hover:text-primary-600 rounded-lg transition-colors">
                  <MapPin className="w-5 h-5" />
                  <span>Adreslerim</span>
                </a>
                <a href="/wishlist" className="flex items-center space-x-3 p-3 text-gray-600 hover:bg-gray-50 hover:text-primary-600 rounded-lg transition-colors">
                  <Heart className="w-5 h-5" />
                  <span>Favorilerim</span>
                </a>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-3 p-3 text-red-500 hover:bg-red-50 rounded-lg w-full text-left transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Çıkış Yap</span>
                </button>
              </nav>
            </div>
          </aside>

          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-shadow"
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-shadow"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-shadow"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-shadow"
                  />
                </div>

                <div className="pt-6 border-t border-gray-100">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Şifre Değiştir</h3>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mevcut Şifre
                      </label>
                      <input
                        type="password"
                        name="currentPassword"
                        value={formData.currentPassword}
                        onChange={handleChange}
                        placeholder="Değiştirmek için mevcut şifrenizi girin"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-shadow"
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-shadow"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex space-x-4 pt-4">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow"
                  >
                    {isLoading ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
                  </button>
                  <button
                    type="button"
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                    onClick={() => {
                      // Reset form or navigate away
                      setFormData(prev => ({
                        ...prev,
                        currentPassword: '',
                        newPassword: ''
                      }));
                    }}
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
