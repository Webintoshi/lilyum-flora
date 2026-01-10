import { useEffect, useState } from 'react'
import { Plus, Edit, Trash2, Package, Image as ImageIcon } from 'lucide-react'
import { useAdminStore } from '@/store/adminStore'
import type { Category } from '@/types'

export default function CategoryManagement() {
  const { categories, fetchCategories, createCategory, updateCategory, deleteCategory } = useAdminStore()
  const [showForm, setShowForm] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    image: '',
    icon: '',
    isActive: true,
  })

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  const handleCreate = () => {
    setEditingCategory(null)
    setFormData({
      name: '',
      slug: '',
      description: '',
      image: '',
      icon: '',
      isActive: true,
    })
    setShowForm(true)
  }

  const handleEdit = (category: Category) => {
    setEditingCategory(category)
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      image: category.image || '',
      icon: category.icon || '',
      isActive: category.isActive,
    })
    setShowForm(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const categoryData = {
      name: formData.name,
      slug: formData.slug || formData.name.toLowerCase().replace(/\s+/g, '-'),
      description: formData.description,
      image: formData.image,
      icon: formData.icon,
      isActive: formData.isActive,
    }

    if (editingCategory) {
      await updateCategory(editingCategory.id, categoryData)
    } else {
      await createCategory(categoryData)
    }

    setLoading(false)
    setShowForm(false)
    setEditingCategory(null)
  }

  const handleDelete = async (id: number) => {
    if (confirm('Bu kategoriyi silmek istediğinize emin misiniz?')) {
      await deleteCategory(id)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Kategoriler</h1>
          <p className="text-gray-600 mt-1">Kategorileri yönetin</p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Yeni Kategori
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {showForm && (
          <div className="bg-white rounded-xl shadow-sm p-6 border-2 border-primary-200">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              {editingCategory ? 'Kategori Düzenle' : 'Yeni Kategori'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Kategori Adı *
                </label>
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Güller"
                  required
                />
              </div>

              <div>
                <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-2">
                  URL Slug *
                </label>
                <input
                  id="slug"
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="guller"
                  required
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Açıklama
                </label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Taze ve kaliteli güller"
                />
              </div>

              <div>
                <label htmlFor="icon" className="block text-sm font-medium text-gray-700 mb-2">
                  Emoji İkon
                </label>
                <input
                  id="icon"
                  type="text"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="🌹"
                />
              </div>

              <div>
                <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
                  Görsel URL
                </label>
                <input
                  id="image"
                  type="text"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="https://example.com/category-image.jpg"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm font-medium text-gray-700">Kategori Aktif</span>
              </label>

              <div className="flex gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false)
                    setEditingCategory(null)
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Kaydediliyor...' : editingCategory ? 'Güncelle' : 'Kaydet'}
                </button>
              </div>
            </form>
          </div>
        )}

        {categories.map((category) => (
          <div
            key={category.id}
            className="bg-white rounded-xl shadow-sm p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center overflow-hidden">
                {category.image ? (
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover"
                  />
                ) : category.icon ? (
                  <span className="text-2xl">{category.icon}</span>
                ) : (
                  <Package className="w-6 h-6 text-primary-600" />
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleEdit(category)}
                  className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(category.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <h3 className="text-lg font-bold text-gray-900 mb-2">{category.name}</h3>
            <p className="text-sm text-gray-500 mb-4">{category.description}</p>

            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="space-y-1">
                <p className="text-xs text-gray-500">URL: /{category.slug}</p>
                <p className="text-xs text-gray-500">Ürün: {category.productCount}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                category.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {category.isActive ? 'Aktif' : 'Pasif'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {categories.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">Henüz kategori yok</p>
          <button
            onClick={handleCreate}
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            İlk Kategoriyi Oluştur
          </button>
        </div>
      )}
    </div>
  )
}
