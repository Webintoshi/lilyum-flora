import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Save, ArrowLeft, Upload, Image as ImageIcon, X, Plus, Trash2 } from 'lucide-react'
import { useAdminStore } from '@/store/adminStore'
import type { Product, Category } from '@/types'

export default function ProductForm() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { categories, fetchCategories, fetchProducts, createProduct, updateProduct, products } = useAdminStore()

  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [previewImages, setPreviewImages] = useState<string[]>([])
  const [newImageInput, setNewImageInput] = useState('')

  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    slug: '',
    description: '',
    price: 0,
    compareAtPrice: 0,
    categoryId: 0,
    images: [],
    stock: 0,
    isActive: true,
    featured: false,
    sizes: [],
    colors: [],
  })

  useEffect(() => {
    fetchCategories()
    if (id) {
      fetchProducts()
      const product = products.find((p) => p.id === parseInt(id))
      if (product) {
        setFormData(product)
        setPreviewImages(product.images)
      }
    }
  }, [id, fetchCategories, fetchProducts, products])

  const handleChange = (field: keyof Product, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleAddImage = () => {
    if (newImageInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        images: [...(prev.images || []), newImageInput],
      }))
      setPreviewImages([...previewImages, newImageInput])
      setNewImageInput('')
    }
  }

  const handleRemoveImage = (index: number) => {
    const newImages = formData.images?.filter((_, i) => i !== index) || []
    const newPreviews = previewImages.filter((_, i) => i !== index)
    setFormData((prev) => ({ ...prev, images: newImages }))
    setPreviewImages(newPreviews)
  }

  const handleAddSize = () => {
    const newSize = prompt('Beden adını girin:', 'S')
    if (newSize && !formData.sizes?.includes(newSize)) {
      setFormData((prev) => ({
        ...prev,
        sizes: [...(prev.sizes || []), newSize],
      }))
    }
  }

  const handleRemoveSize = (size: string) => {
    setFormData((prev) => ({
      ...prev,
      sizes: prev.sizes?.filter((s) => s !== size) || [],
    }))
  }

  const handleAddColor = () => {
    const newColor = prompt('Renk adını girin:', 'Kırmızı')
    if (newColor && !formData.colors?.includes(newColor)) {
      setFormData((prev) => ({
        ...prev,
        colors: [...(prev.colors || []), newColor],
      }))
    }
  }

  const handleRemoveColor = (color: string) => {
    setFormData((prev) => ({
      ...prev,
      colors: prev.colors?.filter((c) => c !== color) || [],
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    const productData: any = {
      name: formData.name!,
      slug: formData.slug || formData.name?.toLowerCase().replace(/\s+/g, '-'),
      description: formData.description!,
      price: formData.price!,
      compareAtPrice: formData.compareAtPrice || 0,
      categoryId: formData.categoryId!,
      images: formData.images || [],
      stock: formData.stock!,
      isActive: formData.isActive!,
      featured: formData.featured!,
      sizes: formData.sizes || [],
      colors: formData.colors || [],
      image: formData.images?.[0] || '',
      category: categories.find((c) => c.id === formData.categoryId)?.name || '',
      rating: 0,
      reviews: 0,
    }

    if (id) {
      await updateProduct(parseInt(id), productData)
    } else {
      await createProduct(productData)
    }

    setSaving(false)
    navigate('/admin/products')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => navigate('/admin/products')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Ürünlere Dön
        </button>
        <button
          onClick={handleSubmit}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Kaydediliyor...' : 'Kaydet'}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Temel Bilgiler</h2>

              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Ürün Adı *
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Kırmızı Gül Buketi"
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
                    onChange={(e) => handleChange('slug', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="kirmizi-gul-buketi"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                    Açıklama *
                  </label>
                  <textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Taze kırmızı güllerden oluşan özel bir buket..."
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                      Fiyat (₺) *
                    </label>
                    <input
                      id="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => handleChange('price', parseFloat(e.target.value))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="299.90"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="compareAtPrice" className="block text-sm font-medium text-gray-700 mb-2">
                      İndirimli Fiyat (₺)
                    </label>
                    <input
                      id="compareAtPrice"
                      type="number"
                      step="0.01"
                      value={formData.compareAtPrice}
                      onChange={(e) => handleChange('compareAtPrice', parseFloat(e.target.value))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="399.90"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-2">
                      Stok *
                    </label>
                    <input
                      id="stock"
                      type="number"
                      value={formData.stock}
                      onChange={(e) => handleChange('stock', parseInt(e.target.value))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="50"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                      Kategori *
                    </label>
                    <select
                      id="category"
                      value={formData.categoryId}
                      onChange={(e) => handleChange('categoryId', parseInt(e.target.value))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      required
                    >
                      <option value="">Kategori Seçin</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Varyasyonlar</h2>

              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-medium text-gray-700">Bedenler</label>
                    <button
                      type="button"
                      onClick={handleAddSize}
                      className="flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700"
                    >
                      <Plus className="w-4 h-4" />
                      Ekle
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.sizes?.length === 0 ? (
                      <p className="text-sm text-gray-500">Henüz beden eklenmedi</p>
                    ) : (
                      formData.sizes?.map((size) => (
                        <span
                          key={size}
                          className="flex items-center gap-1 px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm"
                        >
                          {size}
                          <button
                            type="button"
                            onClick={() => handleRemoveSize(size)}
                            className="hover:text-primary-900"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))
                    )}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-medium text-gray-700">Renkler</label>
                    <button
                      type="button"
                      onClick={handleAddColor}
                      className="flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700"
                    >
                      <Plus className="w-4 h-4" />
                      Ekle
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.colors?.length === 0 ? (
                      <p className="text-sm text-gray-500">Henüz renk eklenmedi</p>
                    ) : (
                      formData.colors?.map((color) => (
                        <span
                          key={color}
                          className="flex items-center gap-1 px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm"
                        >
                          {color}
                          <button
                            type="button"
                            onClick={() => handleRemoveColor(color)}
                            className="hover:text-primary-900"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900">Görseller</h2>
                <span className="text-sm text-gray-500">{previewImages.length} adet</span>
              </div>

              <div className="space-y-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newImageInput}
                    onChange={(e) => setNewImageInput(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Görsel URL girin..."
                  />
                  <button
                    type="button"
                    onClick={handleAddImage}
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {previewImages.length === 0 ? (
                  <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                    <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Henüz görsel eklenmedi</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {previewImages.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={image}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        {index === 0 && (
                          <div className="absolute top-2 left-2 px-2 py-1 bg-primary-600 text-white text-xs rounded">
                            Ana Görsel
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Durum</h2>

              <div className="space-y-4">
                <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer">
                  <span className="text-sm font-medium text-gray-700">Ürün Aktif</span>
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => handleChange('isActive', e.target.checked)}
                    className="w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                </label>

                <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer">
                  <span className="text-sm font-medium text-gray-700">Öne Çıkan Ürün</span>
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => handleChange('featured', e.target.checked)}
                    className="w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
