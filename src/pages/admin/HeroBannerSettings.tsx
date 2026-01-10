import { useEffect, useState } from 'react'
import { Plus, Edit, Trash2, Save, Image as ImageIcon, Eye, EyeOff, Check, X } from 'lucide-react'
import { useAdminStore } from '@/store/adminStore'
import type { HeroBanner } from '@/types'

export default function HeroBannerSettings() {
  const { heroBanners, fetchHeroBanners, createHeroBanner, updateHeroBanner, deleteHeroBanner } = useAdminStore()
  const [loading, setLoading] = useState(false)
  const [editingBanner, setEditingBanner] = useState<HeroBanner | null>(null)
  const [previewUrl, setPreviewUrl] = useState('')

  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    mobileImage: '',
    desktopImage: '',
    overlayOpacity: 0.4,
    isActive: true,
  })

  useEffect(() => {
    fetchHeroBanners()
  }, [fetchHeroBanners])

  const handleCreate = () => {
    setEditingBanner(null)
    setFormData({
      title: '',
      subtitle: '',
      mobileImage: '',
      desktopImage: '',
      overlayOpacity: 0.4,
      isActive: true,
    })
    setPreviewUrl('')
  }

  const handleEdit = (banner: HeroBanner) => {
    setEditingBanner(banner)
    setFormData({
      title: banner.title,
      subtitle: banner.subtitle || '',
      mobileImage: banner.mobileImage,
      desktopImage: banner.desktopImage,
      overlayOpacity: banner.overlayOpacity || 0.4,
      isActive: banner.isActive,
    })
    setPreviewUrl(banner.desktopImage)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const bannerData = {
      title: formData.title,
      subtitle: formData.subtitle,
      mobileImage: formData.mobileImage,
      desktopImage: formData.desktopImage,
      overlayOpacity: formData.overlayOpacity,
      isActive: formData.isActive,
    }

    if (editingBanner) {
      await updateHeroBanner(editingBanner.id, bannerData)
    } else {
      await createHeroBanner(bannerData)
    }

    setLoading(false)
    handleCreate()
  }

  const handleDelete = async (id: number) => {
    if (confirm('Bu banner\'ı silmek istediğinize emin misiniz?')) {
      await deleteHeroBanner(id)
    }
  }

  const handleToggleActive = async (banner: HeroBanner) => {
    await updateHeroBanner(banner.id, { isActive: !banner.isActive })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Hero Banner Ayarları</h1>
          <p className="text-gray-600 mt-1">Ana sayfa hero bannerlarını yönetin</p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Yeni Banner
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border-2 border-primary-200">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
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
                placeholder="Hoş Geldiniz"
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
                placeholder="Taze çiçekler"
              />
            </div>

            <div>
              <label htmlFor="mobileImage" className="block text-sm font-medium text-gray-700 mb-2">
                Mobil Görsel URL *
              </label>
              <input
                id="mobileImage"
                type="text"
                value={formData.mobileImage}
                onChange={(e) => {
                  setFormData({ ...formData, mobileImage: e.target.value })
                  setPreviewUrl(e.target.value)
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="https://example.com/hero-banner.jpg"
                required
              />
            </div>

            <div>
              <label htmlFor="desktopImage" className="block text-sm font-medium text-gray-700 mb-2">
                Masaüstü Görsel URL *
              </label>
              <input
                id="desktopImage"
                type="text"
                value={formData.desktopImage}
                onChange={(e) => {
                  setFormData({ ...formData, desktopImage: e.target.value })
                  setPreviewUrl(e.target.value)
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="https://example.com/hero-banner-desktop.jpg"
                required
              />
            </div>

            <div>
              <label htmlFor="overlayOpacity" className="block text-sm font-medium text-gray-700 mb-2">
                Overlay Opacity (0-1)
              </label>
              <input
                id="overlayOpacity"
                type="number"
                step="0.1"
                min="0"
                max="1"
                value={formData.overlayOpacity}
                onChange={(e) => setFormData({ ...formData, overlayOpacity: parseFloat(e.target.value) })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
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

            {previewUrl && (
              <div className="relative rounded-lg overflow-hidden border-2 border-gray-200">
                <img src={previewUrl} alt="Preview" className="w-full h-48 object-cover" />
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 text-white p-6">
                  <h2 className="text-2xl font-bold text-center">{formData.title}</h2>
                  {formData.subtitle && <p className="text-lg text-center">{formData.subtitle}</p>}
                </div>
              </div>
            )}

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
                className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Kaydediliyor...' : editingBanner ? 'Güncelle' : 'Kaydet'}
              </button>
            </div>
          </form>
        </div>

        <div className="space-y-4">
          {heroBanners.map((banner) => (
              <div
                key={banner.id}
                className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="relative">
                  <img src={banner.desktopImage} alt={banner.title} className="w-full h-48 object-cover" />
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
      </div>

      {heroBanners.length === 0 && !editingBanner && (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm">
          <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">Henüz hero banner yok</p>
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
