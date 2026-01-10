import { useEffect, useState } from 'react'
import { Plus, Edit, Trash2, Image as ImageIcon, Eye, EyeOff } from 'lucide-react'
import { useAdminStore } from '@/store/adminStore'
import type { SizeBanner } from '@/types'

export default function BannerManagement() {
  const { sizeBanners, fetchSizeBanners, createSizeBanner, updateSizeBanner, deleteSizeBanner } = useAdminStore()
  const [showForm, setShowForm] = useState(false)
  const [editingBanner, setEditingBanner] = useState<SizeBanner | null>(null)
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    image: '',
    link: '',
    order: 0,
    isActive: true,
  })

  useEffect(() => {
    fetchSizeBanners()
  }, [fetchSizeBanners])

  const handleCreate = () => {
    setEditingBanner(null)
    setFormData({
      title: '',
      subtitle: '',
      image: '',
      link: '',
      order: 0,
      isActive: true,
    })
    setShowForm(true)
  }

  const handleEdit = (banner: SizeBanner) => {
    setEditingBanner(banner)
    setFormData({
      title: banner.title,
      subtitle: banner.subtitle,
      image: banner.image,
      link: banner.link,
      order: banner.order,
      isActive: banner.isActive,
    })
    setShowForm(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const bannerData = {
      title: formData.title,
      subtitle: formData.subtitle,
      image: formData.image,
      link: formData.link,
      order: formData.order,
      isActive: formData.isActive,
    }

    if (editingBanner) {
      await updateSizeBanner(editingBanner.id, bannerData)
    } else {
      await createSizeBanner(bannerData)
    }

    setLoading(false)
    setShowForm(false)
    handleCreate()
  }

  const handleDelete = async (id: number) => {
    if (confirm('Bu banner\'ı silmek istediğinize emin misiniz?')) {
      await deleteSizeBanner(id)
    }
  }

  const handleToggleActive = async (banner: SizeBanner) => {
    await updateSizeBanner(banner.id, { isActive: !banner.isActive })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Banner Yönetimi</h1>
          <p className="text-gray-600 mt-1">Size Banner'ları yönetin</p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Yeni Banner
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {editingBanner ? 'Banner Düzenle' : 'Yeni Banner'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Başlık *
              </label>
              <input
                id="title"
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Yılbaşı Özel"
                required
              />
            </div>

            <div>
              <label htmlFor="subtitle" className="block text-sm font-medium text-gray-700 mb-2">
                Alt Başlık
              </label>
              <input
                id="subtitle"
                type="text"
                value={formData.subtitle}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Özel kampanyalar için"
              />
            </div>

            <div>
              <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
                Görsel URL *
              </label>
              <input
                id="image"
                type="text"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="https://example.com/banner.jpg"
                required
              />
              {formData.image && (
                <img src={formData.image} alt="Preview" className="mt-2 w-full h-48 object-cover rounded-lg" />
              )}
            </div>

            <div>
              <label htmlFor="link" className="block text-sm font-medium text-gray-700 mb-2">
                Link URL
              </label>
              <input
                id="link"
                type="text"
                value={formData.link}
                onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="/catalog"
              />
            </div>

            <div>
              <label htmlFor="order" className="block text-sm font-medium text-gray-700 mb-2">
                Sıralama
              </label>
              <input
                id="order"
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                min="0"
              />
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm font-medium text-gray-700">Banner Aktif</span>
            </label>

            <div className="flex gap-2 pt-4">
              <button
                type="button"
                onClick={handleCreate}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                İptal
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Kaydediliyor...' : 'Kaydet'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sizeBanners.map((banner) => (
          <div
            key={banner.id}
            className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="relative">
              <img src={banner.image} alt={banner.title} className="w-full h-48 object-cover" />
              <div className="absolute top-2 right-2 flex gap-2">
                <button
                  onClick={() => handleToggleActive(banner)}
                  className={`p-2 rounded-lg transition-colors ${
                    banner.isActive ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'
                  }`}
                  title={banner.isActive ? 'Aktif' : 'Pasif'}
                >
                  {banner.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => handleEdit(banner)}
                  className="p-2 bg-white rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Edit className="w-4 h-4 text-primary-600" />
                </button>
                <button
                  onClick={() => handleDelete(banner.id)}
                  className="p-2 bg-white rounded-lg hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                </button>
              </div>
            </div>

            <div className="p-4">
              <h3 className="font-bold text-gray-900 mb-1">{banner.title}</h3>
              {banner.subtitle && <p className="text-sm text-gray-500">{banner.subtitle}</p>}
              <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                <span className={banner.isActive ? 'text-green-600' : 'text-red-600'}>
                  {banner.isActive ? '✓ Aktif' : '✗ Pasif'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {sizeBanners.length === 0 && !showForm && (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm">
          <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">Henüz banner yok</p>
          <button
            onClick={handleCreate}
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            İlk Banner'ı Oluştur
          </button>
        </div>
      )}
    </div>
  )
}
