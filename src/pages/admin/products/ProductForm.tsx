import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Save, ArrowLeft, Plus, Trash2, AlertCircle, CheckCircle, X, Image as ImageIcon, Loader2, UploadCloud, Search } from 'lucide-react'
import { useAdminStore } from '@/store/adminStore'
import { uploadToStorage } from '@/lib/storage'
import type { Product } from '@/types'

export default function ProductForm() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { categories, fetchCategories, fetchProducts, createProduct, updateProduct, products } = useAdminStore()

  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [previewImages, setPreviewImages] = useState<string[]>([])
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    slug: '',
    description: '',
    price: 0,
    compareAtPrice: 0,
    categoryId: '',
    images: [],
    stock: 0,
    isActive: true,
    featured: false,
    sizes: [],
    colors: [],
    metaTitle: '',
    metaDescription: '',
    keywords: '',
  })

  useEffect(() => {
    fetchCategories()
    if (id) {
      setLoading(true)
      fetchProducts().then(() => {
        const product = products.find((p) => String(p.id) === id)
        if (product) {
          setFormData(product)
          setPreviewImages(product.images || [])
          if (product.image && (!product.images || product.images.length === 0)) {
            setPreviewImages([product.image])
          }
        }
        setLoading(false)
      })
    }
  }, [id, fetchProducts, categories.length])

  const handleChange = (field: keyof Product, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    setError('')

    try {
      const newImages = [...previewImages]

      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const url = await uploadToStorage(file, 'products')
        newImages.push(url)
      }

      setPreviewImages(newImages)
      setFormData(prev => ({ ...prev, images: newImages }))

    } catch (err: any) {
      console.error('Upload error:', err)
      setError('Görsel yüklenirken hata oluştu: ' + err.message)
    } finally {
      setUploading(false)
    }
  }

  const handleRemoveImage = (index: number) => {
    const newImages = previewImages.filter((_, i) => i !== index)
    setPreviewImages(newImages)
    setFormData(prev => ({ ...prev, images: newImages }))
  }

  const handleSetPrimary = (index: number) => {
    const newImages = [...previewImages]
    const [primary] = newImages.splice(index, 1)
    newImages.unshift(primary)
    setPreviewImages(newImages)
    setFormData(prev => ({ ...prev, images: newImages }))
  }

  const handleAddSize = () => {
    const newSize = prompt('Beden adını girin (Örn: S, M, L):')
    if (newSize && !formData.sizes?.includes(newSize)) {
      setFormData((prev) => ({ ...prev, sizes: [...(prev.sizes || []), newSize] }))
    }
  }

  const handleDataChange = (listName: 'sizes' | 'colors', value: string, action: 'add' | 'remove') => {
    // Helper for cleaner code
    if (action === 'remove') {
      setFormData(prev => ({ ...prev, [listName]: prev[listName]?.filter(i => i !== value) || [] }))
    } else {
      // Add logic is custom with prompt usually
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess(false)

    try {
      const productData: any = {
        ...formData,
        slug: formData.slug || formData.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''),
        images: previewImages,
        image: previewImages[0] || '', // Primary image
        category: categories.find((c) => String(c.id) === String(formData.categoryId))?.name || '',
        rating: formData.rating || 0,
        reviews: formData.reviews || 0,
      }

      if (id) {
        await updateProduct(id, productData)
      } else {
        await createProduct(productData)
      }

      setSuccess(true)
      setTimeout(() => {
        setSaving(false)
        navigate('/admin/products')
      }, 1500)
    } catch (err: any) {
      console.error('Product save error:', err)
      setError('Ürün kaydedilemedi: ' + (err?.message || 'Bilinmeyen hata'))
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center h-96"><Loader2 className="w-8 h-8 animate-spin text-primary-600" /></div>
  }

  return (
    <div className="max-w-5xl mx-auto pb-20">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/admin/products')} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{id ? 'Ürünü Düzenle' : 'Yeni Ürün Ekle'}</h1>
            <p className="text-sm text-gray-500">{id ? 'Mevcut ürünü düzenliyorsunuz' : 'Mağazanıza yeni bir ürün ekleyin'}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/admin/products')}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-colors"
          >
            İptal
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium shadow-sm transition-all hover:shadow disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? 'Kaydediliyor...' : 'Ürünü Kaydet'}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3 text-red-700 animate-fadeIn">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3 text-green-700 animate-fadeIn">
          <CheckCircle className="w-5 h-5 flex-shrink-0" />
          Ürün başarıyla kaydedildi! Yönlendiriliyorsunuz...
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">

          {/* Basic Info Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
              <h2 className="font-semibold text-gray-900">Temel Bilgiler</h2>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ürün Adı</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all placeholder:text-gray-400"
                  placeholder="Örn: Kırmızı Gül Buketi"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Açıklama</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all placeholder:text-gray-400 resize-y"
                  placeholder="Ürününüzü detaylıca anlatın..."
                />
              </div>
            </div>
          </div>

          {/* Media Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
              <h2 className="font-semibold text-gray-900">Görseller</h2>
              {uploading && <span className="text-xs text-primary-600 flex items-center gap-1"><Loader2 className="w-3 h-3 animate-spin" /> Yükleniyor...</span>}
            </div>
            <div className="p-6">

              {/* Image Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                {previewImages.map((url, index) => (
                  <div key={index} className="group relative aspect-square bg-gray-100 rounded-lg overflow-hidden border border-gray-200 hover:shadow-md transition-all">
                    <img src={url} alt={`Product ${index}`} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      {index !== 0 && (
                        <button
                          onClick={() => handleSetPrimary(index)}
                          className="p-1.5 bg-white rounded-full text-gray-700 hover:text-primary-600 hover:bg-gray-50"
                          title="Ana Görsel Yap"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleRemoveImage(index)}
                        className="p-1.5 bg-white rounded-full text-gray-700 hover:text-red-600 hover:bg-red-50"
                        title="Sil"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    {index === 0 && <span className="absolute top-2 left-2 px-2 py-0.5 bg-primary-600 text-white text-[10px] font-bold rounded shadow-sm">KAPAK</span>}
                  </div>
                ))}

                {/* Upload Button */}
                <label className={`aspect-square flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary-500 hover:bg-primary-50 transition-all ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                  <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploading} />
                  <UploadCloud className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-500 font-medium">Görsel Yükle</span>
                  <span className="text-xs text-gray-400 mt-1">veya sürükleyin</span>
                </label>
              </div>
              <p className="text-xs text-gray-500">İlk görsel kapak fotoğrafı olarak kullanılacaktır. Sıralamayı değiştirmek için silip tekrar ekleyiniz.</p>
            </div>
          </div>

          {/* Variants Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
              <h2 className="font-semibold text-gray-900">Varyasyonlar</h2>
            </div>
            <div className="p-6 space-y-6">
              {/* Sizes */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">Bedenler / Boyutlar</label>
                  <button type="button" onClick={handleAddSize} className="text-xs font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1">
                    <Plus className="w-3 h-3" /> Ekle
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.sizes?.length === 0 && <span className="text-sm text-gray-400 italic">Tanımlı beden yok.</span>}
                  {formData.sizes?.map(size => (
                    <span key={size} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700 border border-gray-200">
                      {size}
                      <button onClick={() => handleDataChange('sizes', size, 'remove')} className="ml-2 text-gray-400 hover:text-red-500"><X className="w-3 h-3" /></button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Sidebar */}
        <div className="space-y-8">

          {/* Status & Organization */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
              <h2 className="font-semibold text-gray-900">Düzenleme</h2>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                {categories.length === 0 ? (
                  <div className="text-sm text-red-500 mb-2">Kategori bulunamadı. Lütfen önce kategori ekleyin.</div>
                ) : (
                  <select
                    value={formData.categoryId || ''}
                    onChange={e => handleChange('categoryId', e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                  >
                    <option value="">Seçiniz...</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                )}
              </div>

              <div className="flex items-center justify-between py-2 border-t border-gray-100">
                <span className="text-sm font-medium text-gray-700">Satışta</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={formData.isActive} onChange={e => handleChange('isActive', e.target.checked)} className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between py-2 border-t border-gray-100">
                <span className="text-sm font-medium text-gray-700">Öne Çıkan</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={formData.featured} onChange={e => handleChange('featured', e.target.checked)} className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* SEO Settings */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
              <Search className="w-4 h-4 text-gray-500" />
              <h2 className="font-semibold text-gray-900">SEO Ayarları</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Meta Başlık</label>
                <input
                  type="text"
                  value={formData.metaTitle || ''}
                  onChange={(e) => handleChange('metaTitle', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none placeholder:text-gray-400 text-sm"
                  placeholder={formData.name || "Ürün Adı"}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Meta Açıklama</label>
                <textarea
                  value={formData.metaDescription || ''}
                  onChange={(e) => handleChange('metaDescription', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none placeholder:text-gray-400 text-sm resize-none"
                  placeholder="Ürün kısa açıklaması..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Anahtar Kelimeler</label>
                <input
                  type="text"
                  value={formData.keywords || ''}
                  onChange={(e) => handleChange('keywords', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none placeholder:text-gray-400 text-sm"
                  placeholder="Etiketler (vb: kırmızı gül, hediye)"
                />
              </div>
            </div>
          </div>

          {/* Pricing & Inventory */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
              <h2 className="font-semibold text-gray-900">Fiyat & Stok</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Satış Fiyatı (₺)</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => handleChange('price', parseFloat(e.target.value))}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none font-medium"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">İndirimsiz Fiyat (₺)</label>
                <input
                  type="number"
                  value={formData.compareAtPrice}
                  onChange={(e) => handleChange('compareAtPrice', parseFloat(e.target.value))}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-gray-500"
                  placeholder="Opsiyonel"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stok Adedi</label>
                <input
                  type="number"
                  value={formData.stock}
                  onChange={(e) => handleChange('stock', parseInt(e.target.value))}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                  placeholder="0"
                />
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}
