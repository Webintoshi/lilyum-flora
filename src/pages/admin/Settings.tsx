import { useState } from 'react'
import { Save, Phone, Mail, MapPin, CreditCard, Image as ImageIcon, Upload, X } from 'lucide-react'

export default function Settings() {
  const [settings, setSettings] = useState({
    siteName: 'Lilyum Flora',
    email: 'info@lilyumflora.com',
    phone: '0212 123 45 67',
    address: 'Kadıköy, İstanbul',
    bankName: 'Garanti BBVA',
    iban: 'TR12 3456 7890 1234 5678 9012 34',
    freeShippingMin: 500,
    shippingFee: 29.90,
    logo: '',
  })
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [logoFile, setLogoFile] = useState<File | null>(null)

  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleChange = (field: string, value: any) => {
    setSettings((prev) => ({ ...prev, [field]: value }))
    setSaved(false)
  }

  const handleSave = async () => {
    setSaving(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setLogoFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setLogoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleLogoRemove = () => {
    setLogoFile(null)
    setLogoPreview(null)
    setSettings((prev) => ({ ...prev, logo: '' }))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Ayarlar</h1>
          <p className="text-gray-600 mt-1">Genel site ayarlarını yönetin</p>
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

      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center gap-3 mb-6">
          <ImageIcon className="w-6 h-6 text-primary-600" />
          <h2 className="text-xl font-bold text-gray-900">Site Logosu</h2>
        </div>

        <div className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 sm:p-8 text-center">
            {logoPreview ? (
              <div className="relative inline-block">
                <img
                  src={logoPreview}
                  alt="Site Logosu"
                  className="max-w-[300px] sm:max-w-[400px] max-h-[80px] sm:max-h-[100px] mx-auto mb-4 object-contain w-auto"
                />
                <button
                  onClick={handleLogoRemove}
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                  title="Logo sil"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label className="cursor-pointer">
                <div className="flex flex-col items-center justify-center py-6 sm:py-8">
                  <Upload className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mb-3" />
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Logo yüklemek için tıklayın
                  </p>
                  <p className="text-xs text-gray-500 max-w-sm">
                    JPEG, WebP, PNG veya SVG formatı (Önerilen boyut: 300x100 piksel, max: 400x100)
                  </p>
                </div>
                <input
                  type="file"
                  accept="image/jpeg, image/webp, image/png, image/svg+xml"
                  onChange={handleLogoChange}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-3 mb-6">
            <MapPin className="w-6 h-6 text-primary-600" />
            <h2 className="text-xl font-bold text-gray-900">Genel Bilgiler</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="siteName" className="block text-sm font-medium text-gray-700 mb-2">
                Site Adı
              </label>
              <input
                id="siteName"
                type="text"
                value={settings.siteName}
                onChange={(e) => handleChange('siteName', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Lilyum Flora"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                E-posta
              </label>
              <input
                id="email"
                type="email"
                value={settings.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="info@lilyumflora.com"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Telefon
              </label>
              <input
                id="phone"
                type="tel"
                value={settings.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="0212 123 45 67"
              />
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                Adres
              </label>
              <textarea
                id="address"
                value={settings.address}
                onChange={(e) => handleChange('address', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Kadıköy, İstanbul"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-3 mb-6">
            <CreditCard className="w-6 h-6 text-primary-600" />
            <h2 className="text-xl font-bold text-gray-900">Ödeme Bilgileri</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="bankName" className="block text-sm font-medium text-gray-700 mb-2">
                Banka Adı
              </label>
              <input
                id="bankName"
                type="text"
                value={settings.bankName}
                onChange={(e) => handleChange('bankName', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Garanti BBVA"
              />
            </div>

            <div>
              <label htmlFor="iban" className="block text-sm font-medium text-gray-700 mb-2">
                IBAN
              </label>
              <input
                id="iban"
                type="text"
                value={settings.iban}
                onChange={(e) => handleChange('iban', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="TR12 3456 7890 1234 5678 9012 34"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center gap-3 mb-6">
          <MapPin className="w-6 h-6 text-primary-600" />
          <h2 className="text-xl font-bold text-gray-900">Kargo Ayarları</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="freeShippingMin" className="block text-sm font-medium text-gray-700 mb-2">
              Ücretsiz Kargo Alt Limiti (₺)
            </label>
            <input
              id="freeShippingMin"
              type="number"
              step="0.01"
              value={settings.freeShippingMin}
              onChange={(e) => handleChange('freeShippingMin', parseFloat(e.target.value))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Bu tutarın üzerindeki siparişlerde kargo ücretsiz
            </p>
          </div>

          <div>
            <label htmlFor="shippingFee" className="block text-sm font-medium text-gray-700 mb-2">
              Standart Kargo Ücreti (₺)
            </label>
            <input
              id="shippingFee"
              type="number"
              step="0.01"
              value={settings.shippingFee}
              onChange={(e) => handleChange('shippingFee', parseFloat(e.target.value))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="29.90"
            />
            <p className="text-xs text-gray-500 mt-1">
              Ücretsiz kargo alt limitinin altındaki siparişler için
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center gap-3 mb-6">
          <Mail className="w-6 h-6 text-primary-600" />
          <h2 className="text-xl font-bold text-gray-900">E-posta Bildirimleri</h2>
        </div>

        <div className="space-y-4">
          <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer">
            <div>
              <p className="font-medium text-gray-900">Sipariş Onay</p>
              <p className="text-sm text-gray-500">Müşteriye sipariş onay e-postası gönderilsin</p>
            </div>
            <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
          </label>

          <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer">
            <div>
              <p className="font-medium text-gray-900">Kargo Bildirimi</p>
              <p className="text-sm text-gray-500">Kargo atıldığında müşteriye bildirim gönderilsin</p>
            </div>
            <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
          </label>

          <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer">
            <div>
              <p className="font-medium text-gray-900">Teslimat Bildirimi</p>
              <p className="text-sm text-gray-500">Sipariş teslim edildiğinde müşteriye bildirim gönderilsin</p>
            </div>
            <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
          </label>

          <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer">
            <div>
              <p className="font-medium text-gray-900">İptal/İade Bildirimi</p>
              <p className="text-sm text-gray-500">Sipariş iptal veya iade olduğunda müşteriye bildirim gönderilsin</p>
            </div>
            <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
          </label>
        </div>
      </div>
    </div>
  )
}
