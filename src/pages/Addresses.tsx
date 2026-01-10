import { useState } from "react";
import { ArrowLeft, MapPin, Plus, Edit, Trash2, AlertCircle, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface Address {
  id: number;
  title: string;
  name: string;
  phone: string;
  address: string;
  district: string;
  city: string;
  isDefault: boolean;
}

export default function Addresses() {
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: 1,
      title: "Ev Adresi",
      name: "Ahmet Yılmaz",
      phone: "0532 123 45 67",
      address: "Özgürlük Caddesi No: 123 Daire: 4",
      district: "Kadıköy",
      city: "İstanbul",
      isDefault: true,
    },
    {
      id: 2,
      title: "İş Adresi",
      name: "Ahmet Yılmaz",
      phone: "0212 987 65 43",
      address: "Bağdat Caddesi No: 456 Plaza B",
      district: "Kadıköy",
      city: "İstanbul",
      isDefault: false,
    },
  ]);
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

  const handleOpenModal = (address?: Address) => {
    if (address) {
      setEditingAddress(address);
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
    }
    setShowModal(true);
    setError('');
    setSuccess('');
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
      if (editingAddress) {
        const response = await fetch('http://localhost:3001/api/user/addresses', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: editingAddress,
            ...formData,
          }),
        });

        if (!response.ok) {
          throw new Error('Adres güncellenemedi');
        }

        setAddresses(addresses.map(addr => 
          addr.id === editingAddress?.id ? { ...addr, ...formData } : addr
        ));
        setSuccess('Adres başarıyla güncellendi!');
      } else {
        const response = await fetch('http://localhost:3001/api/user/addresses', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          throw new Error('Adres eklenemedi');
        }

        const data = await response.json();
        setAddresses([...addresses, { ...formData, id: data.id }]);
        setSuccess('Adres başarıyla eklendi!');
      }

      setIsLoading(false);
      setTimeout(() => {
        handleCloseModal();
      }, 1500);
    } catch (error) {
      console.error('Address error:', error);
      setError(editingAddress ? 'Adres güncellenemedi. Lütfen tekrar deneyin.' : 'Adres eklenemedi. Lütfen tekrar deneyin.');
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Bu adresi silmek istediğinize emin misiniz?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:3001/api/user/addresses/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Adres silinemedi');
      }

      setAddresses(addresses.filter(addr => addr.id !== id));
    } catch (error) {
      console.error('Delete address error:', error);
      alert('Adres silinemedi. Lütfen tekrar deneyin.');
    }
  };

  const handleSetDefault = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:3001/api/user/addresses/${id}/default`, {
        method: 'PUT',
      });

      if (!response.ok) {
        throw new Error('Varsayılan adres ayarlanamadı');
      }

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
        <a href="/profile" className="inline-flex items-center text-gray-600 hover:text-pink-500 mb-8">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Profili Dön
        </a>

        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Adreslerim</h1>
          <button
            onClick={() => handleOpenModal()}
            className="bg-pink-500 text-white px-6 py-3 rounded-lg hover:bg-pink-600 transition-colors flex items-center"
          >
            <Plus className="w-5 h-5 mr-2" />
            Yeni Adres Ekle
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {addresses.map((address) => (
            <div
              key={address.id}
              className={`bg-white rounded-lg shadow-md p-6 ${
                address.isDefault ? 'border-2 border-pink-500' : ''
              }`}
            >
              {address.isDefault && (
                <div className="mb-4 bg-pink-50 border border-pink-200 rounded-lg p-3">
                  <span className="text-pink-700 font-medium text-sm">Varsayılan Adres</span>
                </div>
              )}

              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-pink-500 flex-shrink-0 mt-0.5" />
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
                    className="flex-1 bg-pink-50 text-pink-600 py-2 px-4 rounded-lg hover:bg-pink-100 transition-colors text-sm"
                  >
                    Varsayılan Yap
                  </button>
                )}
                <button
                  onClick={() => handleOpenModal(address)}
                  className="flex-1 bg-gray-50 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center"
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Düzenle
                </button>
                <button
                  onClick={() => handleDelete(address.id)}
                  className="flex-1 bg-red-50 text-red-600 py-2 px-4 rounded-lg hover:bg-red-100 transition-colors flex items-center justify-center"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Sil
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-800">
                {editingAddress ? 'Adresi Düzenle' : 'Yeni Adres Ekle'}
              </h2>
            </div>

            <div className="p-6">
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
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
                    placeholder="05XX XXX XX XX"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                    >
                      <option value="">Seçiniz</option>
                      <option value="Kadıköy">Kadıköy</option>
                      <option value="Beşiktaş">Beşiktaş</option>
                      <option value="Şişli">Şişli</option>
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                    >
                      <option value="">Seçiniz</option>
                      <option value="İstanbul">İstanbul</option>
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
                      className="w-4 h-4 text-pink-500 rounded focus:ring-pink-500"
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
                    className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    İptal
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 bg-pink-500 text-white px-6 py-3 rounded-lg hover:bg-pink-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
