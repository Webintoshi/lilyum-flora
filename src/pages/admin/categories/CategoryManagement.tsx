import { useEffect, useState } from 'react'
import {
  Plus, Edit, Trash2, Package, Image as ImageIcon, Search,
  CheckCircle, XCircle, ArrowLeft, Save, Upload, X, Filter,
  MoreVertical, AlertTriangle, LayoutGrid, List as ListIcon
} from 'lucide-react'
import { useAdminStore } from '@/store/adminStore'
import type { Category } from '@/types'

export default function CategoryManagement() {
  const { categories, fetchCategories, createCategory, updateCategory, deleteCategory, uploadFile } = useAdminStore()

  // View State: 'list' | 'form'
  const [view, setView] = useState<'list' | 'form'>('list')
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)

  // List State
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'passive'>('all')
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  // Form State
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    image: '',
    icon: '',
    isActive: true,
    metaTitle: '',
    metaDescription: '',
    keywords: '',
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  useEffect(() => {
    fetchCategories()
  }, [])

  // Stats Calculation
  const totalCategories = categories.length
  const activeCategories = categories.filter(c => c.isActive).length
  const totalProducts = categories.reduce((sum, c) => sum + (c.productCount || 0), 0)

  // Filtered Categories
  const filteredCategories = categories.filter(category => {
    const matchesSearch = category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (category.description || '').toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = filterStatus === 'all'
      ? true
      : filterStatus === 'active'
        ? category.isActive
        : !category.isActive

    return matchesSearch && matchesStatus
  })

  // Handlers
  const handleCreate = () => {
    setEditingCategory(null)
    setFormData({
      name: '',
      slug: '',
      description: '',
      image: '',
      icon: '',
      isActive: true,
      metaTitle: '',
      metaDescription: '',
      keywords: '',
    })
    setImageFile(null)
    setImagePreview(null)
    setView('form')
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
      metaTitle: category.metaTitle || '',
      metaDescription: category.metaDescription || '',
      keywords: category.keywords || '',
    })
    setImagePreview(category.image || null)
    setImageFile(null)
    setView('form')
  }

  const handleDelete = async (id: number | string) => {
    if (confirm('Bu kategoriyi silmek istediğinize emin misiniz? Altındaki ürünler kategorisiz kalabilir.')) {
      try {
        await deleteCategory(id)
        await fetchCategories()
      } catch (error) {
        console.error('Category delete error:', error)
        alert('Silme işlemi başarısız oldu.')
      }
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      // Preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      let imageUrl = formData.image

      if (imageFile) {
        imageUrl = await uploadFile(imageFile)
      }

      const categoryData = {
        name: formData.name,
        slug: formData.slug || formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
        description: formData.description,
        image: imageUrl,
        icon: formData.icon,
        isActive: formData.isActive,
        metaTitle: formData.metaTitle,
        metaDescription: formData.metaDescription,
        keywords: formData.keywords,
      }

      if (editingCategory) {
        await updateCategory(editingCategory.id, categoryData)
      } else {
        await createCategory(categoryData)
      }

      await fetchCategories()
      setView('list')
    } catch (error) {
      console.error('Category save error:', error)
      alert('Kategori kaydedilirken bir hata oluştu.')
    } finally {
      setLoading(false)
    }
  }

  // Render Functions
  if (view === 'form') {
    return (
      <div className="max-w-4xl mx-auto animate-in slide-in-from-right-4 duration-300">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => setView('list')}
            className="p-2 hover:bg-white rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-500" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {editingCategory ? 'Kategoriyi Düzenle' : 'Yeni Kategori Oluştur'}
            </h1>
            <p className="text-gray-500 text-sm">Kategori bilgilerini aşağıdan yönetebilirsiniz.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Main Info */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Package className="w-5 h-5 text-primary-600" />
                  Temel Bilgiler
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Kategori Adı</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                      placeholder="Örn: Güller"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">URL Slug (Otomatik oluşturulur)</label>
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono text-sm text-gray-600"
                      placeholder="guller"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Açıklama</label>
                    <textarea
                      rows={4}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 scrollbar-thin resize-none"
                      placeholder="Kategori hakkında kısa bir açıklama..."
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  Durum ve Görünürlük
                </h2>

                <label className="flex items-center gap-3 p-4 border border-gray-100 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                  <div className={`w-10 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${formData.isActive ? 'bg-green-500' : 'bg-gray-300'}`}>
                    <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${formData.isActive ? 'translate-x-4' : ''}`} />
                  </div>
                  <input
                    type="checkbox"
                    className="hidden"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  />
                  <div>
                    <span className="block font-medium text-gray-900">Aktif Kategori</span>
                    <span className="text-xs text-gray-500">Bu kategori sitede görüntülensin</span>
                  </div>
                </label>
              </div>

              {/* SEO Settings */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Search className="w-5 h-5 text-blue-600" />
                  SEO Ayarları
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Meta Başlık</label>
                    <input
                      type="text"
                      value={formData.metaTitle || ''}
                      onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Google'da görünecek başlık"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Meta Açıklama</label>
                    <textarea
                      rows={3}
                      value={formData.metaDescription || ''}
                      onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                      placeholder="Google'da görünecek açıklama"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Anahtar Kelimeler</label>
                    <input
                      type="text"
                      value={formData.keywords || ''}
                      onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="virgül ile ayırın: çiçek, gül, orkide"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Visuals */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-purple-600" />
                  Görseller
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Kategori Görseli</label>
                    <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center hover:bg-gray-50 transition-colors relative group">
                      {imagePreview ? (
                        <div className="relative">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-full h-40 object-cover rounded-lg shadow-sm"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setImagePreview(null)
                              setImageFile(null)
                              setFormData({ ...formData, image: '' })
                            }}
                            className="absolute -top-2 -right-2 bg-red-500 text-white p-1.5 rounded-full shadow-lg hover:bg-red-600 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="py-8">
                          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 text-gray-400">
                            <Upload className="w-6 h-6" />
                          </div>
                          <p className="text-sm font-medium text-gray-900">Görsel Yükle</p>
                          <p className="text-xs text-gray-500 mt-1">PNG, JPG, WEBP</p>
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        onChange={handleImageChange}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Emoji İkon</label>
                    <input
                      type="text"
                      value={formData.icon}
                      onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-center text-xl"
                      placeholder="🌹"
                    />
                    <p className="text-xs text-gray-500 mt-1 text-center">Kategori için bir emoji seçin</p>
                  </div>
                </div>
              </div>
            </div>

          </div>

          <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setView('list')}
              className="px-6 py-2.5 border border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition-all shadow-lg shadow-primary-600/30 flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Kaydediliyor...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  {editingCategory ? 'Değişiklikleri Kaydet' : 'Kategoriyi Oluştur'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">

      {/* Header & Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Kategoriler</h1>
            <p className="text-gray-500 mt-1">Ürün kategorilerini düzenleyin ve yönetin.</p>
          </div>
          <button
            onClick={handleCreate}
            className="px-5 py-3 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition-all shadow-lg shadow-primary-600/30 flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Yeni Kategori
          </button>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
            <LayoutGrid className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Toplam Kategori</p>
            <h3 className="text-2xl font-bold text-gray-900">{totalCategories}</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-green-600">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Aktif Kategori</p>
            <h3 className="text-2xl font-bold text-gray-900">{activeCategories}</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 md:col-span-2">
          <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Kategorilenmiş Ürün</p>
            <h3 className="text-2xl font-bold text-gray-900">{totalProducts}</h3>
          </div>
        </div>
      </div>

      {/* Toolbar & Filter */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-2">
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Kategori ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-primary-100 text-sm font-medium"
            />
          </div>

          <div className="flex bg-gray-50 p-1 rounded-xl">
            {[
              { id: 'all', label: 'Tümü' },
              { id: 'active', label: 'Aktif' },
              { id: 'passive', label: 'Pasif' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setFilterStatus(tab.id as any)}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${filterStatus === tab.id
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* List */}
      <div className="space-y-4">
        {filteredCategories.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {filteredCategories.map(category => (
              <div key={category.id} className="group bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex items-center gap-4">

                {/* Handle / Drag (Visual only for now) */}
                <div className="cursor-grab text-gray-300 hover:text-gray-500 hidden sm:block">
                  <MoreVertical className="w-5 h-5" />
                </div>

                {/* Image */}
                <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 border border-gray-100">
                  {category.image ? (
                    <img src={category.image} alt={category.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl">
                      {category.icon || <Package className="w-6 h-6 text-gray-400" />}
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-gray-900 truncate text-lg">{category.name}</h3>
                    {!category.isActive && (
                      <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-bold rounded-full">Pasif</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 truncate max-w-md">{category.description || 'Açıklama yok'}</p>
                </div>

                {/* Stats */}
                <div className="text-center px-4 border-l border-gray-100 hidden sm:block">
                  <p className="text-xs text-gray-400 font-bold uppercase">Ürün</p>
                  <p className="text-xl font-bold text-primary-600">{category.productCount || 0}</p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pl-4 sm:border-l sm:border-gray-100">
                  <button
                    onClick={() => handleEdit(category)}
                    className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-primary-600 transition-colors"
                    title="Düzenle"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(category.id)}
                    className="p-2 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-500 transition-colors"
                    title="Sil"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">Kategori Bulunamadı</h3>
            <p className="text-gray-500">Arama kriterlerinize uygun sonuç yok veya henüz kategori eklenmedi.</p>
            {categories.length === 0 && (
              <button
                onClick={handleCreate}
                className="mt-6 px-6 py-2 bg-primary-600 text-white rounded-lg font-bold hover:bg-primary-700 transition-colors"
              >
                İlk Kategoriyi Ekle
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
