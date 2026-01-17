import { useState, useEffect } from 'react'
import { Save, Phone, Mail, MapPin, CreditCard, Image as ImageIcon, Upload, X, Globe, Truck, AlertTriangle } from 'lucide-react'
import { useSettingsStore } from '@/store/settingsStore'

const TURKISH_BANKS = [
  'Ziraat Bankası',
  'Halkbank',
  'VakıfBank',
  'Garanti BBVA',
  'İş Bankası',
  'Yapı Kredi',
  'Akbank',
  'QNB Finansbank',
  'DenizBank',
  'TEB',
  'Kuveyt Türk',
  'Türkiye Finans',
  'Albaraka Türk',
  'Şekerbank',
  'ING Bank',
  'Odea Bank',
  'Fibabanka',
  'Burgan Bank',
  'Vakıf Katılım',
  'Ziraat Katılım',
  'Emlak Katılım'
].sort();

export default function Settings() {
  const { settings: storeSettings, updateSettings } = useSettingsStore()

  const [settings, setSettings] = useState(storeSettings)
  const [logoPreview, setLogoPreview] = useState<string | null>(storeSettings.logo)
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  // Sync with store on mount/update
  useEffect(() => {
    if (storeSettings) {
      setSettings(storeSettings)
      setLogoPreview(storeSettings.logo)
    }
  }, [storeSettings])

  const handleChange = (field: string, value: any) => {
    setSettings((prev) => ({ ...prev, [field]: value }))
    setSaved(false)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      let logoToSave = settings.logo;

      // If a new file is selected, use the Base64 preview string directly
      if (logoFile && logoPreview) {
        logoToSave = logoPreview;
      }

      await updateSettings({
        ...settings,
        logo: logoToSave
      });

      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (error: any) {
      console.error("Save settings error:", error);
      alert("Kaydetme sırasında bir hata oluştu: " + (error?.message || error));
    } finally {
      setSaving(false)
    }
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
    handleChange('logo', null)
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Ayarlar</h1>
          <p className="text-gray-500 mt-1">Mağaza bilgileri ve genel yapılandırma</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-all font-bold shadow-lg shadow-primary-600/30 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          <Save className="w-5 h-5" />
          {saved ? 'Kaydedildi!' : saving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">

          {/* General Settings */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/50 flex items-center gap-3">
              <Globe className="w-5 h-5 text-blue-600" />
              <h2 className="font-bold text-gray-900">Genel Bilgiler</h2>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-2">Site Adı</label>
                <input
                  type="text"
                  value={settings.siteName}
                  onChange={(e) => handleChange('siteName', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all"
                  placeholder="Örn: Lilyum Flora"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-400" /> E-Posta
                </label>
                <input
                  type="email"
                  value={settings.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-400" /> Telefon
                </label>
                <input
                  type="tel"
                  value={settings.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-400" /> Adres
                </label>
                <textarea
                  rows={3}
                  value={settings.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all resize-none"
                />
              </div>
            </div>
          </div>

          {/* Payment Settings */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/50 flex items-center gap-3">
              <CreditCard className="w-5 h-5 text-purple-600" />
              <h2 className="font-bold text-gray-900">Banka Hesapları</h2>
            </div>
            <div className="p-6 space-y-6">

              {/* Add New Bank Account */}
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 text-xs">+</div>
                  Yeni Hesap Ekle
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <select
                    id="newBankName"
                    className="px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                  >
                    <option value="">Banka Seçiniz</option>
                    {TURKISH_BANKS.map(bank => (
                      <option key={bank} value={bank}>{bank}</option>
                    ))}
                  </select>
                  <input
                    type="text"
                    placeholder="Hesap Sahibi (Ad Soyad)"
                    id="newAccountHolder"
                    defaultValue={settings.siteName}
                    className="px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                  />
                  <div className="md:col-span-2 flex gap-2">
                    <input
                      type="text"
                      placeholder="IBAN (TR...)"
                      id="newIban"
                      className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm font-mono"
                      maxLength={32}
                      onChange={(e) => {
                        let value = e.target.value.replace(/[^A-Z0-9]/gi, '').toUpperCase();
                        if (!value.startsWith('TR')) value = 'TR' + value.replace(/^TR/, '');
                        e.target.value = value;
                      }}
                    />
                    <button
                      onClick={() => {
                        const bankSelect = document.getElementById('newBankName') as HTMLSelectElement;
                        const ibanInput = document.getElementById('newIban') as HTMLInputElement;
                        const holderInput = document.getElementById('newAccountHolder') as HTMLInputElement;

                        if (bankSelect.value && ibanInput.value) {
                          const newAccount = {
                            id: Date.now().toString(),
                            bankName: bankSelect.value,
                            iban: ibanInput.value,
                            accountHolder: holderInput.value || settings.siteName
                          };

                          const updatedAccounts = [...(settings.bankAccounts || []), newAccount];
                          setSettings(prev => ({ ...prev, bankAccounts: updatedAccounts }));
                          setSaved(false);

                          bankSelect.value = '';
                          ibanInput.value = '';
                        } else {
                          alert('Lütfen banka seçin ve IBAN girin.');
                        }
                      }}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium text-sm transition-colors"
                    >
                      Ekle
                    </button>
                  </div>
                </div>
              </div>

              {/* Account List */}
              <div className="space-y-3">
                {(settings.bankAccounts && settings.bankAccounts.length > 0) ? (
                  settings.bankAccounts.map((account) => (
                    <div key={account.id} className="group flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:border-purple-200 hover:bg-purple-50/30 transition-all bg-white relative">
                      <div>
                        <h4 className="font-bold text-gray-900 flex items-center gap-2">
                          {account.bankName}
                          <span className="text-xs font-normal text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">{account.accountHolder}</span>
                        </h4>
                        <p className="text-sm font-mono text-gray-600 mt-1 select-all">{account.iban}</p>
                      </div>
                      <button
                        onClick={() => {
                          const updatedAccounts = settings.bankAccounts.filter(a => a.id !== account.id);
                          setSettings(prev => ({ ...prev, bankAccounts: updatedAccounts }));
                          setSaved(false);
                        }}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors absolute top-2 right-2 sm:relative sm:top-auto sm:right-auto"
                        title="Hesabı Sil"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 text-gray-400 text-sm border-2 border-dashed border-gray-100 rounded-xl">
                    <CreditCard className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    Henüz banka hesabı eklenmemiş.
                  </div>
                )}
              </div>

              <div className="md:col-span-2">
                <div className="bg-blue-50 text-blue-800 p-4 rounded-xl text-sm flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <p>Eklediğiniz tüm banka hesapları, ödeme sayfasında müşterilerinize listelenecektir.</p>
                </div>
              </div>

              {/* Payment Methods Toggles */}
              <div className="md:col-span-2 pt-4 border-t border-gray-100">
                <h3 className="font-bold text-gray-900 mb-4">Ödeme Yöntemleri Yönetimi</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Card */}
                  <label className="flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-all hover:bg-gray-50 border-gray-200">
                    <span className="font-medium text-gray-700">Kredi Kartı</span>
                    <div className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={settings.activePaymentMethods?.card ?? true}
                        onChange={(e) => {
                          const newMethods = { ...settings.activePaymentMethods, card: e.target.checked };
                          handleChange('activePaymentMethods', newMethods);
                        }}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </div>
                  </label>

                  {/* Bank */}
                  <label className="flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-all hover:bg-gray-50 border-gray-200">
                    <span className="font-medium text-gray-700">Havale / EFT</span>
                    <div className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={settings.activePaymentMethods?.bank ?? true}
                        onChange={(e) => {
                          const newMethods = { ...settings.activePaymentMethods, bank: e.target.checked };
                          handleChange('activePaymentMethods', newMethods);
                        }}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </div>
                  </label>

                  {/* COD */}
                  <label className="flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-all hover:bg-gray-50 border-gray-200">
                    <span className="font-medium text-gray-700">Kapıda Ödeme</span>
                    <div className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={settings.activePaymentMethods?.cod ?? true}
                        onChange={(e) => {
                          const newMethods = { ...settings.activePaymentMethods, cod: e.target.checked };
                          handleChange('activePaymentMethods', newMethods);
                        }}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Shipping Settings */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/50 flex items-center gap-3">
              <Truck className="w-5 h-5 text-orange-600" />
              <h2 className="font-bold text-gray-900">Teslimat Ayarları</h2>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Ücretsiz Teslimat Limiti</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₺</span>
                  <input
                    type="number"
                    value={settings.freeShippingMin}
                    onChange={(e) => handleChange('freeShippingMin', parseFloat(e.target.value))}
                    className="w-full pl-8 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Bu tutar üzerindeki siparişler ücretsiz</p>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Teslimat Ücreti</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₺</span>
                  <input
                    type="number"
                    value={settings.shippingFee}
                    onChange={(e) => handleChange('shippingFee', parseFloat(e.target.value))}
                    className="w-full pl-8 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column - Logo */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/50 flex items-center gap-3">
              <ImageIcon className="w-5 h-5 text-gray-600" />
              <h2 className="font-bold text-gray-900">Site Logosu</h2>
            </div>
            <div className="p-6">
              <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center transition-all hover:border-primary-400 hover:bg-primary-50/30 group">
                {logoPreview ? (
                  <div className="relative inline-block group-hover:scale-105 transition-transform duration-300">
                    <img
                      src={logoPreview}
                      alt="Logo"
                      className="max-w-full h-auto max-h-[120px] object-contain mx-auto"
                    />
                    <button
                      onClick={handleLogoRemove}
                      className="absolute -top-3 -right-3 bg-red-500 text-white p-1.5 rounded-full shadow-lg hover:bg-red-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="cursor-pointer block">
                    <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-100 transition-colors">
                      <Upload className="w-8 h-8" />
                    </div>
                    <p className="font-bold text-gray-900">Logo Yükle</p>
                    <p className="text-sm text-gray-500 mt-1">PNG, JPG veya SVG</p>
                    <input type="file" className="hidden" accept="image/*" onChange={handleLogoChange} />
                  </label>
                )}
              </div>
              <p className="text-xs text-center text-gray-400 mt-4">Önerilen boyut: 300x80 piksel</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
