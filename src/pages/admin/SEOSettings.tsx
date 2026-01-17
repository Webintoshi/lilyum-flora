import { useEffect, useState } from 'react'
import { Save, Globe, Code, FileText, AlertCircle, CheckCircle, Upload, Layout, Edit, ArrowLeft } from 'lucide-react'
import { useAdminStore } from '@/store/adminStore'
import type { PageSEO } from '@/types'

const STATIC_PAGES = [
  { id: 'home', name: 'Ana Sayfa' },
  { id: 'about', name: 'Hakkımızda' },
  { id: 'contact', name: 'İletişim' },
  { id: 'landscaping', name: 'Peysaj Hizmetleri' },
  { id: 'catalog', name: 'Katalog' },
  { id: 'cart', name: 'Sepet' },
  { id: 'checkout', name: 'Ödeme' },
  { id: 'gift-finder', name: 'Hediye Bulucu' },
]

export default function SEOSettings() {
  const { seoSettings, fetchSEOSettings, updateSEOSettings, uploadFile, pageSEO, fetchPageSEO, updatePageSEO } = useAdminStore()
  const [activeTab, setActiveTab] = useState<'global' | 'pages'>('global')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [uploading, setUploading] = useState(false)

  // Custom Hook-like state management for simpler forms
  const [localSettings, setLocalSettings] = useState<any>({
    siteTitle: 'Lilyum Flora',
    siteDescription: 'Taze ve özenle hazırlanmış çiçek aranjmanları sevdiklerinize gönderin.',
    keywords: 'çiçek, buket, teslimat, hediye, güller, orkideler',
    ogTitle: '',
    ogDescription: '',
    ogImage: '',
    twitterTitle: '',
    twitterDescription: '',
    twitterHandle: '@lilyumflora',
    // ... other fields
  })

  // Page Editing State
  const [editingPageId, setEditingPageId] = useState<string | null>(null)
  const [pageForm, setPageForm] = useState<Partial<PageSEO>>({
    title: '',
    description: '',
    keywords: '',
    image: ''
  })

  useEffect(() => {
    fetchSEOSettings()
    fetchPageSEO()
  }, [fetchSEOSettings, fetchPageSEO])

  useEffect(() => {
    if (seoSettings) {
      setLocalSettings(prev => ({ ...prev, ...seoSettings }))
    }
  }, [seoSettings])

  useEffect(() => {
    if (editingPageId) {
      const existing = pageSEO.find(p => p.page === editingPageId)
      if (existing) {
        setPageForm(existing)
      } else {
        setPageForm({
          page: editingPageId,
          title: '',
          description: '',
          keywords: '',
          image: ''
        })
      }
    }
  }, [editingPageId, pageSEO])

  const handleGlobalChange = (field: string, value: any) => {
    setLocalSettings((prev: any) => ({ ...prev, [field]: value }))
    setSaved(false)
    setError('')
  }

  const handlePageFormChange = (field: string, value: any) => {
    setPageForm(prev => ({ ...prev, [field]: value }))
  }

  const handleSaveGlobal = async () => {
    setSaving(true)
    setError('')
    try {
      await updateSEOSettings(localSettings)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err: any) {
      setError('Ayarlar kaydedilemedi: ' + (err?.message || 'Bilinmeyen hata'))
    } finally {
      setSaving(false)
    }
  }

  const handleSavePage = async () => {
    if (!editingPageId) return
    setSaving(true)
    try {
      await updatePageSEO(editingPageId, pageForm)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
      setEditingPageId(null) // Go back to list
    } catch (err: any) {
      setError('Sayfa ayarları kaydedilemedi: ' + (err?.message || 'Bilinmeyen hata'))
    } finally {
      setSaving(false)
    }
  }

  const renderGlobalSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Settings */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-3 mb-6">
            <Globe className="w-6 h-6 text-primary-600" />
            <h2 className="text-xl font-bold text-gray-900">Temel SEO Ayarları</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Site Başlığı</label>
              <input
                type="text"
                value={localSettings.siteTitle || ''}
                onChange={(e) => handleGlobalChange('siteTitle', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Site Açıklaması</label>
              <textarea
                value={localSettings.siteDescription || ''}
                onChange={(e) => handleGlobalChange('siteDescription', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Anahtar Kelimeler</label>
              <input
                type="text"
                value={localSettings.keywords || ''}
                onChange={(e) => handleGlobalChange('keywords', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Logo</label>
              <div className="flex items-center gap-4">
                <label className="flex items-center px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                  <Upload className="w-4 h-4 mr-2" />
                  <span>{uploading ? 'Yükleniyor...' : 'Görsel Seç'}</span>
                  <input type="file" className="hidden" accept="image/*" onChange={async (e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      setUploading(true)
                      const url = await uploadFile(file)
                      handleGlobalChange('logoUrl', url)
                      setUploading(false)
                    }
                  }} />
                </label>
                {localSettings.logoUrl && <img src={localSettings.logoUrl} alt="Logo" className="h-10 object-contain" />}
              </div>
            </div>
          </div>
        </div>

        {/* Social Media */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-3 mb-6">
            <Code className="w-6 h-6 text-primary-600" />
            <h2 className="text-xl font-bold text-gray-900">Sosyal Medya Meta</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">OG Başlık</label>
              <input
                type="text"
                value={localSettings.ogTitle || ''}
                onChange={(e) => handleGlobalChange('ogTitle', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">OG Açıklama</label>
              <textarea
                value={localSettings.ogDescription || ''}
                onChange={(e) => handleGlobalChange('ogDescription', e.target.value)}
                rows={2}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">OG Görsel URL</label>
              <input
                type="text"
                value={localSettings.ogImage || ''}
                onChange={(e) => handleGlobalChange('ogImage', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Twitter Kullanıcı Adı</label>
              <input
                type="text"
                value={localSettings.twitterHandle || ''}
                onChange={(e) => handleGlobalChange('twitterHandle', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Analytics */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center gap-3 mb-6">
          <FileText className="w-6 h-6 text-primary-600" />
          <h2 className="text-xl font-bold text-gray-900">Analitik Kimlikleri</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {['gtmId', 'gaId', 'metaPixelId', 'hotjarId'].map(id => (
            <div key={id}>
              <label className="block text-sm font-medium text-gray-700 mb-2 uppercase">{id.replace('Id', ' ID')}</label>
              <input
                type="text"
                value={localSettings[id] || ''}
                onChange={(e) => handleGlobalChange(id, e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="ID-XXXX"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSaveGlobal}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
        >
          <Save className="w-5 h-5" />
          {saved ? 'Kaydedildi' : saving ? 'Kaydediliyor...' : 'Tüm Ayarları Kaydet'}
        </button>
      </div>
    </div>
  )

  const renderPageSettings = () => {
    if (editingPageId) {
      const pageName = STATIC_PAGES.find(p => p.id === editingPageId)?.name || editingPageId
      return (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <button onClick={() => setEditingPageId(null)} className="p-2 hover:bg-gray-100 rounded-full">
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <h2 className="text-xl font-bold text-gray-900">{pageName} SEO Düzenle</h2>
            </div>
            <button
              onClick={handleSavePage}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              Kaydet
            </button>
          </div>

          <div className="space-y-4 max-w-2xl">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sayfa Başlığı (Title)</label>
              <input
                type="text"
                value={pageForm.title || ''}
                onChange={(e) => handlePageFormChange('title', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="Örn: Hakkımızda | Lilyum Flora"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Meta Açıklaması (Description)</label>
              <textarea
                value={pageForm.description || ''}
                onChange={(e) => handlePageFormChange('description', e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Anahtar Kelimeler</label>
              <input
                type="text"
                value={pageForm.keywords || ''}
                onChange={(e) => handlePageFormChange('keywords', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Özel Paylaşım Görseli (Opsiyonel)</label>
              <div className="flex gap-4">
                <input
                  type="text"
                  value={pageForm.image || ''}
                  onChange={(e) => handlePageFormChange('image', e.target.value)}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="https://..."
                />
                <label className="flex items-center justify-center w-12 h-12 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                  <Upload className="w-5 h-5 text-gray-500" />
                  <input type="file" className="hidden" accept="image/*" onChange={async (e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      setUploading(true)
                      const url = await uploadFile(file)
                      handlePageFormChange('image', url)
                      setUploading(false)
                    }
                  }} />
                </label>
              </div>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {STATIC_PAGES.map(page => {
          const seoData = pageSEO.find(p => p.page === page.id)
          return (
            <div key={page.id} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                  <Layout className="w-6 h-6" />
                </div>
                {seoData ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-gray-300" />
                )}
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{page.name}</h3>
              <p className="text-sm text-gray-500 mb-4 truncate">
                {seoData?.title || 'Varsayılan ayarlar kullanılıyor'}
              </p>
              <button
                onClick={() => setEditingPageId(page.id)}
                className="w-full flex items-center justify-center gap-2 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-sm font-medium text-gray-700"
              >
                <Edit className="w-4 h-4" />
                Düzenle
              </button>
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">SEO Yönetimi</h1>
          <p className="text-gray-600 mt-1">Site genelindeki arama motoru optimizasyon ayarlarını yönetin.</p>
        </div>

        {/* Tabs */}
        <div className="flex bg-white rounded-lg p-1 shadow-sm border border-gray-200">
          <button
            onClick={() => { setActiveTab('global'); setEditingPageId(null); }}
            className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'global' ? 'bg-primary-50 text-primary-700 shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
          >
            Genel Ayarlar
          </button>
          <button
            onClick={() => setActiveTab('pages')}
            className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'pages' ? 'bg-primary-50 text-primary-700 shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
          >
            Sayfa Bazlı SEO
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <span className="text-red-700">{error}</span>
        </div>
      )}

      {saved && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-2">
          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
          <span className="text-green-700">Değişiklikler başarıyla kaydedildi!</span>
        </div>
      )}

      {activeTab === 'global' ? renderGlobalSettings() : renderPageSettings()}
    </div>
  )
}
