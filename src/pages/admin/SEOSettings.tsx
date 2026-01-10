import { useState } from 'react'
import { Settings, Save, Globe, Code, Image as ImageIcon, FileText, Mail } from 'lucide-react'

export default function SEOSettings() {
  const [seoSettings, setSeoSettings] = useState({
    siteName: 'Lilyum Flora',
    siteDescription: 'Taze ve özenle hazırlanmış çiçek aranjmanları sevdiklerinize gönderin.',
    siteKeywords: 'çiçek, buket, teslimat, hediye, güller, orkideler',
    metaTitle: 'Lilyum Flora - Taze Çiçek Teslimatı',
    metaDescription: 'Aynı gün ücretsiz çiçek teslimatı. Güller, orkideler ve daha fazlası.',
    ogImage: '',
    twitterHandle: '@lilyumflora',
    googleAnalytics: '',
    facebookPixel: '',
    hotjar: '',
    structuredData: true,
    robotsTxt: true,
    sitemap: true,
  })

  const [socialLinks, setSocialLinks] = useState({
    facebook: 'https://facebook.com/lilyumflora',
    instagram: 'https://instagram.com/lilyumflora',
    twitter: 'https://twitter.com/lilyumflora',
    youtube: 'https://youtube.com/@lilyumflora',
  })

  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleChange = (field: string, value: any) => {
    setSeoSettings((prev) => ({ ...prev, [field]: value }))
    setSaved(false)
  }

  const handleSocialChange = (field: string, value: any) => {
    setSocialLinks((prev) => ({ ...prev, [field]: value }))
    setSaved(false)
  }

  const handleSave = async () => {
    setSaving(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">SEO & Analitik</h1>
          <p className="text-gray-600 mt-1">SEO ayarları ve sosyal medya entegrasyonu</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {saved ? 'Kaydedildi' : saving ? 'Kaydediliyor...' : 'Kaydet'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-3 mb-6">
            <Globe className="w-6 h-6 text-primary-600" />
            <h2 className="text-xl font-bold text-gray-900">Temel SEO Ayarları</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="siteName" className="block text-sm font-medium text-gray-700 mb-2">
                Site Adı
              </label>
              <input
                id="siteName"
                type="text"
                value={seoSettings.siteName}
                onChange={(e) => handleChange('siteName', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Lilyum Flora"
              />
            </div>

            <div>
              <label htmlFor="siteDescription" className="block text-sm font-medium text-gray-700 mb-2">
                Site Açıklaması
              </label>
              <textarea
                id="siteDescription"
                value={seoSettings.siteDescription}
                onChange={(e) => handleChange('siteDescription', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Taze ve özenle hazırlanmış çiçek aranjmanları..."
              />
            </div>

            <div>
              <label htmlFor="siteKeywords" className="block text-sm font-medium text-gray-700 mb-2">
                Anahtar Kelimeler
              </label>
              <input
                id="siteKeywords"
                type="text"
                value={seoSettings.siteKeywords}
                onChange={(e) => handleChange('siteKeywords', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="çiçek, buket, teslimat..."
              />
              <p className="text-xs text-gray-500 mt-1">Virgülle ayırın: çiçek, buket, teslimat</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-3 mb-6">
            <Code className="w-6 h-6 text-primary-600" />
            <h2 className="text-xl font-bold text-gray-900">Meta Etiketleri</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="metaTitle" className="block text-sm font-medium text-gray-700 mb-2">
                Meta Başlık
              </label>
              <input
                id="metaTitle"
                type="text"
                value={seoSettings.metaTitle}
                onChange={(e) => handleChange('metaTitle', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Lilyum Flora - Taze Çiçek Teslimatı"
              />
              <p className="text-xs text-gray-500 mt-1">60 karakter önerilir</p>
            </div>

            <div>
              <label htmlFor="metaDescription" className="block text-sm font-medium text-gray-700 mb-2">
                Meta Açıklaması
              </label>
              <textarea
                id="metaDescription"
                value={seoSettings.metaDescription}
                onChange={(e) => handleChange('metaDescription', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Aynı gün ücretsiz çiçek teslimatı..."
              />
              <p className="text-xs text-gray-500 mt-1">160 karakter önerilir</p>
            </div>

            <div>
              <label htmlFor="ogImage" className="block text-sm font-medium text-gray-700 mb-2">
                OG Görsel URL
              </label>
              <input
                id="ogImage"
                type="url"
                value={seoSettings.ogImage}
                onChange={(e) => handleChange('ogImage', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="https://example.com/og-image.jpg"
              />
              <p className="text-xs text-gray-500 mt-1">1200x630 piksel önerilir</p>
            </div>

            <div>
              <label htmlFor="twitterHandle" className="block text-sm font-medium text-gray-700 mb-2">
                Twitter Kullanıcı Adı
              </label>
              <input
                id="twitterHandle"
                type="text"
                value={seoSettings.twitterHandle}
                onChange={(e) => handleChange('twitterHandle', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="@lilyumflora"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center gap-3 mb-6">
          <Globe className="w-6 h-6 text-primary-600" />
          <h2 className="text-xl font-bold text-gray-900">Sosyal Medya</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="facebook" className="block text-sm font-medium text-gray-700 mb-2">
              Facebook URL
            </label>
            <input
              id="facebook"
              type="url"
              value={socialLinks.facebook}
              onChange={(e) => handleSocialChange('facebook', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="https://facebook.com/lilyumflora"
            />
          </div>

          <div>
            <label htmlFor="instagram" className="block text-sm font-medium text-gray-700 mb-2">
              Instagram URL
            </label>
            <input
              id="instagram"
              type="url"
              value={socialLinks.instagram}
              onChange={(e) => handleSocialChange('instagram', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="https://instagram.com/lilyumflora"
            />
          </div>

          <div>
            <label htmlFor="twitter" className="block text-sm font-medium text-gray-700 mb-2">
              Twitter URL
            </label>
            <input
              id="twitter"
              type="url"
              value={socialLinks.twitter}
              onChange={(e) => handleSocialChange('twitter', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="https://twitter.com/lilyumflora"
            />
          </div>

          <div>
            <label htmlFor="youtube" className="block text-sm font-medium text-gray-700 mb-2">
              YouTube URL
            </label>
            <input
              id="youtube"
              type="url"
              value={socialLinks.youtube}
              onChange={(e) => handleSocialChange('youtube', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="https://youtube.com/@lilyumflora"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center gap-3 mb-6">
          <Code className="w-6 h-6 text-primary-600" />
          <h2 className="text-xl font-bold text-gray-900">Analitik & İzleme</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="googleAnalytics" className="block text-sm font-medium text-gray-700 mb-2">
              Google Analytics ID
            </label>
            <input
              id="googleAnalytics"
              type="text"
              value={seoSettings.googleAnalytics}
              onChange={(e) => handleChange('googleAnalytics', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="G-XXXXXXXXXX"
            />
          </div>

          <div>
            <label htmlFor="facebookPixel" className="block text-sm font-medium text-gray-700 mb-2">
              Facebook Pixel ID
            </label>
            <input
              id="facebookPixel"
              type="text"
              value={seoSettings.facebookPixel}
              onChange={(e) => handleChange('facebookPixel', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="XXXXXXXXXXXXXXXXXXX"
            />
          </div>

          <div>
            <label htmlFor="hotjar" className="block text-sm font-medium text-gray-700 mb-2">
              Hotjar Site ID
            </label>
            <input
              id="hotjar"
              type="text"
              value={seoSettings.hotjar}
              onChange={(e) => handleChange('hotjar', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="XXXXXXXXXX"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center gap-3 mb-6">
          <Settings className="w-6 h-6 text-primary-600" />
          <h2 className="text-xl font-bold text-gray-900">Gelişmiş Ayarlar</h2>
        </div>

        <div className="space-y-4">
          <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer">
            <div>
              <p className="font-medium text-gray-900">Yapılandırılmış Veri (Schema.org)</p>
              <p className="text-sm text-gray-500">Arama motorları için yapılandırılmış veri etkinleştir</p>
            </div>
            <input
              type="checkbox"
              checked={seoSettings.structuredData}
              onChange={(e) => handleChange('structuredData', e.target.checked)}
              className="w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
          </label>

          <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer">
            <div>
              <p className="font-medium text-gray-900">robots.txt</p>
              <p className="text-sm text-gray-500">Otomatik robots.txt dosyası oluştur</p>
            </div>
            <input
              type="checkbox"
              checked={seoSettings.robotsTxt}
              onChange={(e) => handleChange('robotsTxt', e.target.checked)}
              className="w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
          </label>

          <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer">
            <div>
              <p className="font-medium text-gray-900">Sitemap</p>
              <p className="text-sm text-gray-500">Otomatik sitemap.xml dosyası oluştur</p>
            </div>
            <input
              type="checkbox"
              checked={seoSettings.sitemap}
              onChange={(e) => handleChange('sitemap', e.target.checked)}
              className="w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
          </label>
        </div>
      </div>
    </div>
  )
}
