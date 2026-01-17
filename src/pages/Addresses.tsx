import { useState, useEffect } from "react";
import { ArrowLeft, MapPin, Plus, Edit, Trash2, AlertCircle, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface Address {
  id: string | number;
  title: string;
  name: string;
  phone: string;
  address: string;
  district: string;
  city: string;
  isDefault: boolean;
  customer_id?: number | string;
}

export default function Addresses() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    name: '',
    phone: '',
    address: '',
    district: '',
    city: '',
    isDefault: false,
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (user) {
      fetchAddresses();
    }
  }, [user]);

  if (!isAuthenticated) return null;

  const fetchAddresses = async () => {
    if (!user?.id) return;

    try {
      const { db } = await import('@/lib/firebase');
      const { collection, query, where, orderBy, getDocs } = await import('firebase/firestore');

      const q = query(
        collection(db, 'addresses'),
        where('customerId', '==', user.id),
        orderBy('isDefault', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const mappedAddresses: Address[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        mappedAddresses.push({
          id: doc.id,
          title: data.title,
          name: data.name,
          phone: data.phone,
          address: data.address,
          district: data.district,
          city: data.city,
          isDefault: data.isDefault,
          customer_id: data.customerId,
        } as any);
      });

      setAddresses(mappedAddresses);
    } catch (error) {
      console.error('Fetch addresses error:', error);
    }
  };

  const handleOpenModal = (address: Address | null = null) => {
    setEditingAddress(address);
    if (address) {
      setFormData({
        title: address.title,
        name: address.name,
        phone: address.phone,
        address: address.address,
        district: address.district,
        city: address.city,
        isDefault: address.isDefault,
      });
    } else {
      setFormData({
        title: '',
        name: '',
        phone: '',
        address: '',
        district: '',
        city: '',
        isDefault: false,
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingAddress(null);
    setFormData({
      title: '',
      name: '',
      phone: '',
      address: '',
      district: '',
      city: '',
      isDefault: false,
    });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      const { db } = await import('@/lib/firebase');
      const { collection, addDoc, updateDoc, doc } = await import('firebase/firestore');

      if (editingAddress) {
        const addressRef = doc(db, 'addresses', String(editingAddress.id));
        await updateDoc(addressRef, {
          title: formData.title,
          name: formData.name,
          phone: formData.phone,
          address: formData.address,
          district: formData.district,
          city: formData.city,
          isDefault: formData.isDefault,
          updatedAt: new Date().toISOString(),
        });

        setAddresses(addresses.map(addr =>
          addr.id === editingAddress.id ? { ...addr, ...formData } : addr
        ));
        setSuccess('Adres başarıyla güncellendi!');
      } else {
        const newAddress = {
          title: formData.title,
          name: formData.name,
          phone: formData.phone,
          address: formData.address,
          district: formData.district,
          city: formData.city,
          isDefault: formData.isDefault,
          customerId: user?.id,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        const docRef = await addDoc(collection(db, 'addresses'), newAddress);

        setAddresses([...addresses, { ...formData, id: docRef.id as any, isDefault: formData.isDefault }]);
        setSuccess('Adres başarıyla eklendi!');
      }

      setIsLoading(false);
      setTimeout(() => {
        handleCloseModal();
      }, 1500);
    } catch (error) {
      console.error('Address error:', error);
      setError(editingAddress ? 'Adres güncellenemedi.' : 'Adres eklenemedi.');
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string | number) => {
    if (!confirm('Bu adresi silmek istediğinize emin misiniz?')) {
      return;
    }

    try {
      const { db } = await import('@/lib/firebase');
      const { deleteDoc, doc } = await import('firebase/firestore');

      await deleteDoc(doc(db, 'addresses', String(id)));

      setAddresses(addresses.filter(addr => addr.id !== id));
    } catch (error) {
      console.error('Delete address error:', error);
      alert('Adres silinemedi. Lütfen tekrar deneyin.');
    }
  };

  const handleSetDefault = async (id: string | number) => {
    try {
      const { db } = await import('@/lib/firebase');
      const { collection, query, where, getDocs, writeBatch, doc } = await import('firebase/firestore');

      // Reset others
      const batch = writeBatch(db);

      const q = query(collection(db, 'addresses'), where('customerId', '==', user?.id));
      const querySnapshot = await getDocs(q);

      querySnapshot.forEach((document) => {
        if (document.id === String(id)) {
          batch.update(doc(db, 'addresses', document.id), { isDefault: true, updatedAt: new Date().toISOString() });
        } else {
          // Only update if it was default? Or just set all false.
          // To be safe, set all others to false.
          batch.update(doc(db, 'addresses', document.id), { isDefault: false, updatedAt: new Date().toISOString() });
        }
      });

      await batch.commit();

      setAddresses(addresses.map(addr => ({
        ...addr,
        isDefault: addr.id === id,
      })));
    } catch (error) {
      console.error('Set default address error:', error);
      alert('Varsayılan adres ayarlanamadı. Lütfen tekrar deneyin.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <a href="/profile" className="inline-flex items-center text-gray-600 hover:text-primary-600 mb-8 transition-colors">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Profili Dön
        </a>

        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Adreslerim</h1>
          <button
            onClick={() => handleOpenModal()}
            className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors flex items-center shadow-sm"
          >
            <Plus className="w-5 h-5 mr-2" />
            Yeni Adres Ekle
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {addresses.map((address) => (
            <div
              key={address.id}
              className={`bg-white rounded-lg shadow-sm p-6 transition-all ${address.isDefault ? 'border-2 border-primary-500 ring-2 ring-primary-50' : 'border border-gray-100'
                }`}
            >
              {address.isDefault && (
                <div className="mb-4 bg-primary-50 border border-primary-100 rounded-lg p-3">
                  <span className="text-primary-700 font-medium text-sm">Varsayılan Adres</span>
                </div>
              )}

              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-gray-800">{address.title}</h3>
                    <p className="text-gray-600">{address.name}</p>
                    <p className="text-gray-600">{address.phone}</p>
                    <p className="text-gray-600">{address.address}</p>
                    <p className="text-gray-600">{address.district}, {address.city}</p>
                  </div>
                </div>
              </div>

              <div className="flex space-x-2 mt-6">
                {!address.isDefault && (
                  <button
                    onClick={() => handleSetDefault(address.id)}
                    className="flex-1 bg-primary-50 text-primary-600 py-2 px-4 rounded-lg hover:bg-primary-100 transition-colors text-sm font-medium"
                  >
                    Varsayılan Yap
                  </button>
                )}
                <button
                  onClick={() => handleOpenModal(address)}
                  className="flex-1 bg-gray-50 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center font-medium"
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Düzenle
                </button>
                <button
                  onClick={() => handleDelete(address.id)}
                  className="flex-1 bg-red-50 text-red-600 py-2 px-4 rounded-lg hover:bg-red-100 transition-colors flex items-center justify-center font-medium"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Sil
                </button>
              </div>
            </div>
          ))}
        </div>

        {addresses.length === 0 && (
          <div className="text-center py-16">
            <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Henüz adresiniz yok</h3>
            <p className="text-gray-500 mb-6">İlk adresinizi eklemek için butona tıklayın</p>
            <button
              onClick={() => handleOpenModal()}
              className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors shadow-sm"
            >
              Adres Ekle
            </button>
          </div>
        )}
      </main>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800">
                {editingAddress ? 'Adresi Düzenle' : 'Yeni Adres Ekle'}
              </h2>
            </div>

            <div className="p-6">
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

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Adres Başlığı
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Örn: Ev Adresi"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-shadow"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ad Soyad
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Ad Soyad"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-shadow"
                    required
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
                    placeholder="05XX XXX XX XX"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-shadow"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Adres
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Adres detayları"
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-shadow"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      İlçe
                    </label>
                    <select
                      name="district"
                      value={formData.district}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-shadow"
                      required
                    >
                      <option value="">Seçiniz</option>
                      <option value="Altınordu">Altınordu</option>
                      <option value="Fatsa">Fatsa</option>
                      <option value="Ünye">Ünye</option>
                      <option value="Perşembe">Perşembe</option>
                      <option value="Gülyalı">Gülyalı</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Şehir
                    </label>
                    <select
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-shadow"
                      required
                    >
                      <option value="">Seçiniz</option>
                      <option value="">Seçiniz</option>
                      <option value="Ordu">Ordu</option>
                      <option value="Giresun">Giresun</option>
                      <option value="Samsun">Samsun</option>
                      <option value="Trabzon">Trabzon</option>
                      <option value="Ankara">Ankara</option>
                      <option value="İzmir">İzmir</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="isDefault"
                      checked={formData.isDefault}
                      onChange={handleChange}
                      className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500 border-gray-300"
                    />
                    <span className="text-sm text-gray-700">
                      Bu adresi varsayılan olarak ayarla
                    </span>
                  </label>
                </div>

                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    İptal
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-sm hover:shadow"
                  >
                    {isLoading ? 'Kaydediliyor...' : editingAddress ? 'Güncelle' : 'Ekle'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
