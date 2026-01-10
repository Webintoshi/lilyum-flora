import { useEffect, useState } from 'react'
import { Settings, Save, Plus, Trash2, Eye, EyeOff, Upload, Image as ImageIcon } from 'lucide-react'
import { useAdminStore } from '@/store/adminStore'
import type { Category } from '@/types'

export default function CategorySettings() {
  const { categories, fetchCategories, createCategory, updateCategory, deleteCategory } = useAdminStore()
  const [formData, setFormData] = useState<Partial<Category>>({
    name: '',
    slug: '',
    description: '',
    image: '',
    icon: '',
    isActive: true,
  })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  const handleChange = (field: keyof Category, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setSaved(false)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      if (editingId) {
        await updateCategory(editingId, formData)
      } else {
        await createCategory(formData as Omit<Category, 'id' | 'productCount' | 'createdAt' | 'updatedAt'>)
      }
      setSaving(false)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
      resetForm()
    } catch (error) {
      console.error('Save error:', error)
      setSaving(false)
    }
  }

  const handleEdit = (category: Category) => {
    setEditingId(category.id)
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description,
      image: category.image,
      icon: category.icon,
      isActive: category.isActive,
    })
  }

  const handleDelete = async (id: number) => {
    if (confirm('Bu kategoriyi silmek istediğinize emin misiniz?')) {
      await deleteCategory(id)
    }
  }

  const handleToggleActive = async (category: Category) => {
    await updateCategory(category.id, { isActive: !category.isActive })
  }

  const resetForm = () => {
    setFormData({
      name: '',
      slug: '',
      description: '',
      image: '',
      icon: '',
      isActive: true,
    })
    setEditingId(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Kategori Yönetimi</h1>
          <p className="text-gray-600 mt-1">Kategorileri yönetin ve görselleri ayarlayın</p>
        </div>
        <button
          onClick={resetForm}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Yeni Kategori
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-3 mb-6">
            <Settings className="w-6 h-6 text-primary-600" />
            <h2 className="text-xl font-bold text-gray-900">{editingId ? 'Kategori Düzenle' : 'Yeni Kategori Ekle'}</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Kategori Adı *
              </label>
              <input
                id="name"
                type="text"
                value={formData.name || ''}
                onChange={(e) => handleChange('name', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Güller"
              />
            </div>

            <div>
              <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-2">
                URL Slug *
              </label>
              <input
                id="slug"
                type="text"
                value={formData.slug || ''}
                onChange={(e) => handleChange('slug', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="guller"
              />
              <p className="text-xs text-gray-500 mt-1">Kategori linklerinde kullanılacak, örn: /catalog?category=guller</p>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Açıklama
              </label>
              <textarea
                id="description"
                value={formData.description || ''}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Taze ve kaliteli güller"
              />
            </div>

            <div>
              <label htmlFor="icon" className="block text-sm font-medium text-gray-700 mb-2">
                Emoji İkon
              </label>
              <div className="relative">
                <input
                  id="icon"
                  type="text"
                  value={formData.icon || ''}
                  onChange={(e) => handleChange('icon', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="🌹"
                />
                <button
                  onClick={() => {
                    const icon = prompt('Emoji ikonunu girin:', formData.icon)
                    if (icon) handleChange('icon', icon)
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-primary-600 transition-colors"
                >
                  <Settings className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
                Görsel URL
              </label>
              <div className="relative">
                <input
                  id="image"
                  type="text"
                  value={formData.image || ''}
                  onChange={(e) => handleChange('image', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 pr-10"
                  placeholder="https://example.com/category-image.jpg"
                />
                <button
                  onClick={() => {
                    const url = prompt('Görsel URL\'sini girin:', formData.image)
                    if (url) handleChange('image', url)
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-primary-600 transition-colors"
                >
                  <ImageIcon className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <input
                id="isActive"
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => handleChange('isActive', e.target.checked)}
                className="w-5 h-5 text-primary-600 focus:ring-primary-500 rounded"
              />
              <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                Aktif (Ana sayfada göster)
              </label>
            </div>

            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <button
                onClick={resetForm}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700"
              >
                İptal
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !formData.name || !formData.slug}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
              >
                {saved ? (
                  <>
                    <Eye className="w-4 h-4" />
                    Kaydedildi
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    {saving ? 'Kaydediliyor...' : 'Kaydet'}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-3 mb-6">
            <ImageIcon className="w-6 h-6 text-primary-600" />
            <h2 className="text-xl font-bold text-gray-900">Kategori Önizleme</h2>
          </div>

          <div className="space-y-4">
            {formData.image && (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Görsel Önizleme</p>
                <div className="relative rounded-lg overflow-hidden border-2 border-gray-200">
                  <img
                    src={formData.image}
                    alt="Kategori önizleme"
                    className="w-full h-48 object-cover"
                  />
                  {formData.icon && (
                    <div className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-lg">
                      <span className="text-2xl">{formData.icon}</span>
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-4">
                    <h3 className="text-xl font-bold">{formData.name}</h3>
                    {formData.description && (
                      <p className="text-sm opacity-90">{formData.description}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {!formData.image && formData.icon && (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">İkon Önizleme</p>
                <div className="rounded-lg bg-gradient-to-br from-primary-100 to-primary-200 p-8 text-center border-2 border-gray-200">
                  <span className="text-8xl">{formData.icon}</span>
                  <p className="mt-4 font-bold text-gray-800">{formData.name}</p>
                  {formData.description && (
                    <p className="text-sm text-gray-600 mt-2">{formData.description}</p>
                  )}
                </div>
              </div>
            )}

            {!formData.image && !formData.icon && (
              <div className="rounded-lg bg-gray-100 p-8 text-center border-2 border-dashed border-gray-300">
                <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Görsel veya ikon ekleyin</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center gap-3 mb-6">
          <Upload className="w-6 h-6 text-primary-600" />
          <h2 className="text-xl font-bold text-gray-900">Kategori Listesi</h2>
        </div>

        <div className="space-y-4">
          {categories.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              Henüz kategori eklenmemiş.
            </div>
          ) : (
            categories.map((category) => (
              <div
                key={category.id}
                className={`flex items-center gap-4 p-4 border-2 rounded-lg transition-all ${
                  category.isActive ? 'border-green-500 bg-green-50' : 'border-gray-200'
                }`}
              >
                <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-white">
                  {category.image ? (
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover"
                    />
                  ) : category.icon ? (
                    <div className="w-full h-full flex items-center justify-center text-5xl">
                      {category.icon}
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                      <ImageIcon className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <h3 className="font-bold text-gray-900">{category.name}</h3>
                      <p className="text-sm text-gray-600">{category.slug}</p>
                      {category.description && (
                        <p className="text-sm text-gray-500 line-clamp-1">{category.description}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleActive(category)}
                        className={`p-2 rounded-lg transition-colors ${
                          category.isActive ? 'text-green-600 bg-green-100' : 'text-gray-600 bg-gray-100'
                        }`}
                        title={category.isActive ? 'Aktif' : 'Pasif'}
                      >
                        {category.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => handleEdit(category)}
                        className="p-2 rounded-lg text-blue-600 bg-blue-100 hover:bg-blue-200 transition-colors"
                        title="Düzenle"
                      >
                        <Settings className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(category.id)}
                        className="p-2 rounded-lg text-red-600 bg-red-100 hover:bg-red-200 transition-colors"
                        title="Sil"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span>{category.productCount} ürün</span>
                    <span>•</span>
                    <span>{category.isActive ? '✓ Aktif' : '✗ Pasif'}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
