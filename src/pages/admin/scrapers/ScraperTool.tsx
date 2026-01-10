import { useState, useEffect } from 'react'
import { Globe, Download, AlertTriangle, CheckCircle, XCircle, Package, Tag, Loader2, Eye, Copy, ExternalLink } from 'lucide-react'
import type { AnalyzeResult, ScrapedProduct, ScrapingResult, Category } from '@/types'

export default function ScraperTool() {
  const [url, setUrl] = useState('')
  const [targetCategoryId, setTargetCategoryId] = useState<number | null>(null)
  const [priceMultiplier, setPriceMultiplier] = useState(1)
  const [currencyMultiplier, setCurrencyMultiplier] = useState(1)
  
  const [analyzing, setAnalyzing] = useState(false)
  const [scraping, setScraping] = useState(false)
  
  const [analyzeResult, setAnalyzeResult] = useState<AnalyzeResult | null>(null)
  const [scrapingResult, setScrapingResult] = useState<ScrapingResult | null>(null)
  
  const [categories, setCategories] = useState<Category[]>([])
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [acceptedDisclaimer, setAcceptedDisclaimer] = useState(false)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/categories?status=active')
      const data = await response.json()
      if (data.success) {
        setCategories(data.data)
        if (data.data.length > 0 && !targetCategoryId) {
          setTargetCategoryId(data.data[0].id)
        }
      }
    } catch (err) {
      console.error('Categories fetch error:', err)
    }
  }

  const handleAnalyze = async () => {
    setError('')
    setSuccess('')
    setAnalyzeResult(null)
    setScrapingResult(null)
    
    if (!url) {
      setError('Lütfen bir URL girin')
      return
    }

    setAnalyzing(true)

    try {
      const response = await fetch('http://localhost:3001/api/scrapers/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      })

      const data = await response.json()

      if (data.success && data.data) {
        setAnalyzeResult(data.data)
        setSuccess(`${data.data.productCount} ürün tespit edildi!`)
      } else {
        setError('Ürünler analiz edilemedi. Site yapısı otomatik tespit edilemedi.')
      }
    } catch (err) {
      setError('Analiz sırasında bir hata oluştu')
      console.error(err)
    } finally {
      setAnalyzing(false)
    }
  }

  const handleScrape = async () => {
    setError('')
    setSuccess('')
    setScrapingResult(null)
    
    if (!targetCategoryId) {
      setError('Lütfen bir kategori seçin')
      return
    }

    if (!acceptedDisclaimer) {
      setError('Lütfen telif uyarısını kabul edin')
      return
    }

    setScraping(true)

    try {
      const response = await fetch('http://localhost:3001/api/scrapers/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url,
          targetCategoryId,
          priceMultiplier,
          currencyMultiplier,
        }),
      })

      const data = await response.json()

      if (data.success && data.data) {
        setScrapingResult(data.data)
        setSuccess(`${data.data.success} ürün başarıyla eklendi! ${data.data.failed} ürün eklenemedi.`)
      } else {
        setError('Ürünler çekilemedi')
      }
    } catch (err) {
      setError('Çekim sırasında bir hata oluştu')
      console.error(err)
    } finally {
      setScraping(false)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
    }).format(price * priceMultiplier * currencyMultiplier)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setSuccess('Kopyalandı!')
    setTimeout(() => setSuccess(''), 2000)
  }

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Ürün Çekme Aracı</h1>
        <p className="text-gray-600 mt-1">İnternet sitelerinden ürün ve görselleri çekin</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kategori URL'si
            </label>
            <div className="flex gap-3">
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://orneksite.com/kategori/cicekler"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                disabled={analyzing || scraping}
              />
              <button
                onClick={handleAnalyze}
                disabled={analyzing || scraping || !url}
                className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold disabled:opacity-50 flex items-center gap-2"
              >
                {analyzing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Analiz Ediliyor...
                  </>
                ) : (
                  <>
                    <Globe className="w-5 h-5" />
                    Analiz Et
                  </>
                )}
              </button>
            </div>
          </div>

          {analyzeResult && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hedef Kategori
                  </label>
                  <select
                    value={targetCategoryId || ''}
                    onChange={(e) => setTargetCategoryId(Number(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    disabled={scraping}
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fiyat Çarpanı
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      step="0.1"
                      min="0.1"
                      max="10"
                      value={priceMultiplier}
                      onChange={(e) => setPriceMultiplier(Number(e.target.value))}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      disabled={scraping}
                    />
                    <span className="text-sm text-gray-600">x</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                    <div>
                      <p className="text-sm text-gray-600">Tespit Edilen Ürün</p>
                      <p className="text-2xl font-bold text-green-600">{analyzeResult.productCount}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <Eye className="w-8 h-8 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-600">Robots.txt</p>
                      <p className={`text-2xl font-bold ${analyzeResult.robotsTxtAllowed ? 'text-green-600' : 'text-red-600'}`}>
                        {analyzeResult.robotsTxtAllowed ? 'İzinli' : 'Yasak'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <Package className="w-8 h-8 text-purple-600" />
                    <div>
                      <p className="text-sm text-gray-600">Pagination</p>
                      <p className="text-2xl font-bold text-purple-600">
                        {analyzeResult.pagination?.hasPagination ? 'Var' : 'Yok'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {analyzeResult.errors.length > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-yellow-800 mb-2">Uyarılar</h4>
                      <ul className="space-y-1">
                        {analyzeResult.errors.map((error, idx) => (
                          <li key={idx} className="text-sm text-yellow-700">
                            • {error}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-red-800 mb-2">Telif Uyarısı</h4>
                    <p className="text-sm text-red-700 mb-3">
                      Çekeceğiniz ürünlerin ve görsellerin telif haklarına saygı gösterin. Sadece izin verilen içerikleri kullanın.
                    </p>
                    <label className="flex items-start gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={acceptedDisclaimer}
                        onChange={(e) => setAcceptedDisclaimer(e.target.checked)}
                        className="mt-1 w-4 h-4 text-red-600 border-red-300 rounded focus:ring-red-500"
                        disabled={scraping}
                      />
                      <span className="text-sm text-red-700">
                        Telif haklarına dikkat edeceğimi kabul ediyorum ve sorumluluğun kendime ait olduğunu anlıyorum.
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              <button
                onClick={handleScrape}
                disabled={scraping || !acceptedDisclaimer || !targetCategoryId}
                className="w-full py-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg hover:shadow-xl transition-all font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {scraping ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Ürünler Çekiliyor...
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5" />
                    Ürünleri Ekle
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <p className="text-green-800">{success}</p>
        </div>
      )}

      {analyzeResult && analyzeResult.products.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Önizleme (İlk 10 Ürün)</h2>
          <div className="space-y-4">
            {analyzeResult.products.map((product, index) => (
              <div
                key={index}
                className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="80" height="80"%3E%3Crect width="80" height="80" fill="%23e5e7eb"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%239ca3af" font-size="12"%3EGörsel Yok%3C/text%3E%3C/svg%3E'
                    }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">{product.name}</h3>
                  <div className="flex items-center gap-2 mb-2">
                    <Tag className="w-4 h-4 text-gray-500" />
                    <span className="text-lg font-bold text-primary-600">{formatPrice(product.price)}</span>
                    {priceMultiplier !== 1 && (
                      <span className="text-sm text-gray-500">
                        (Orijinal: {new Intl.NumberFormat('tr-TR').format(product.price)} ₺)
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <ExternalLink className="w-4 h-4" />
                    <a
                      href={product.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-primary-600 truncate"
                    >
                      {product.sourceUrl}
                    </a>
                  </div>
                </div>
                <button
                  onClick={() => copyToClipboard(product.name)}
                  className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                  title="İsmi kopyala"
                >
                  <Copy className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {scrapingResult && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Çekim Sonucu</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-8 h-8 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Başarılı</p>
                  <p className="text-2xl font-bold text-green-600">{scrapingResult.success}</p>
                </div>
              </div>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <XCircle className="w-8 h-8 text-red-600" />
                <div>
                  <p className="text-sm text-gray-600">Başarısız</p>
                  <p className="text-2xl font-bold text-red-600">{scrapingResult.failed}</p>
                </div>
              </div>
            </div>
          </div>

          {scrapingResult.products.length > 0 && (
            <div className="mt-4">
              <h3 className="font-semibold text-gray-900 mb-3">Eklenen Ürünler</h3>
              <div className="space-y-2">
                {scrapingResult.products.slice(0, 5).map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="w-12 h-12 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{product.name}</p>
                      <p className="text-sm text-primary-600">
                        {new Intl.NumberFormat('tr-TR', {
                          style: 'currency',
                          currency: 'TRY',
                        }).format(product.price)} ₺
                      </p>
                    </div>
                  </div>
                ))}
                {scrapingResult.products.length > 5 && (
                  <p className="text-sm text-gray-500 text-center mt-2">
                    ve {scrapingResult.products.length - 5} ürün daha...
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
