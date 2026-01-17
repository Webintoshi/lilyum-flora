import { useEffect, useState } from 'react'
import { Image as ImageIcon, Upload, Save, Loader2, LayoutDashboard, ExternalLink, Video, Clapperboard, Play } from 'lucide-react'
import { useAdminStore } from '@/store/adminStore'
import { uploadToStorage } from '@/lib/storage'
import type { SizeBanner } from '@/types'

const BANNER_SLOTS = [
  { id: 'home-main', title: 'Ana Banner (Sol Geniş)', description: 'Anasayfanın sol tarafında yer alan büyük banner.', recommendedSize: '800x600px' },
  { id: 'home-right-top', title: 'Yan Üst Banner (Sağ)', description: 'Sağ tarafta üstte yer alan küçük banner.', recommendedSize: '400x300px' },
  { id: 'home-right-bottom', title: 'Yan Alt Banner (Sağ)', description: 'Sağ tarafta altta yer alan küçük banner.', recommendedSize: '400x300px' },
]

const SIZE_BANNER_SLOTS = [
  { id: 'small', title: 'Küçük Boy (Sol)', description: 'Video serisinin ilk kartı.', recommendedSize: 'Video: 9:16 Dikey' },
  { id: 'medium', title: 'Orta Boy (Orta)', description: 'Video serisinin orta kartı.', recommendedSize: 'Video: 9:16 Dikey' },
  { id: 'large', title: 'Büyük Boy (Sağ)', description: 'Video serisinin son kartı.', recommendedSize: 'Video: 9:16 Dikey' },
]

export default function BannerManagement() {
  const { sizeBanners, fetchSizeBanners, updateFixedBanner, uploadFile } = useAdminStore()
  const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({})
  const [activeTab, setActiveTab] = useState<'home' | 'video'>('home')

  useEffect(() => {
    fetchSizeBanners()
  }, [fetchSizeBanners])

  const handleSave = async (slotId: string, data: Partial<SizeBanner>) => {
    setLoadingMap(prev => ({ ...prev, [slotId]: true }))
    try {
      const existing = sizeBanners.find(b => b.id === slotId);

      await updateFixedBanner(slotId, {
        ...data,
        isActive: true,
        // Preserve existing images/videos if not provided in update
        image: data.image === undefined ? (existing?.image || '') : data.image,
        posterUrl: data.posterUrl === undefined ? (existing?.posterUrl || '') : data.posterUrl,
        videoUrl: data.videoUrl === undefined ? (existing?.videoUrl || '') : data.videoUrl,
      })
      alert('Banner başarıyla güncellendi!')
    } catch (error) {
      console.error('Update error:', error)
      alert('Güncelleme sırasında hata oluştu.')
    } finally {
      setLoadingMap(prev => ({ ...prev, [slotId]: false }))
    }
  }

  return (
    <div className="space-y-8 pb-20">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Banner Yönetimi</h1>
        <p className="text-gray-600 mt-1">Site genelindeki banner ve görsel alanlarını yönetin.</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('home')}
          className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'home'
              ? 'border-primary-600 text-primary-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          Ana Sayfa Bannerları
        </button>
        <button
          onClick={() => setActiveTab('video')}
          className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'video'
              ? 'border-primary-600 text-primary-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
        >
          <Clapperboard className="w-4 h-4" />
          Video Bannerlar (Büyüklük)
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {activeTab === 'home' && BANNER_SLOTS.map((slot) => {
          const currentBanner = sizeBanners.find(b => b.id === slot.id) || {
            id: slot.id, title: '', subtitle: '', link: '/catalog', image: '', buttonText: 'İNCELE', isActive: true
          }
          return (
            <BannerSlotEditor
              key={slot.id}
              slot={slot}
              type="image"
              currentBanner={currentBanner as any}
              onSave={(data) => handleSave(slot.id, data)}
              isLoading={loadingMap[slot.id]}
            />
          )
        })}

        {activeTab === 'video' && SIZE_BANNER_SLOTS.map((slot) => {
          const currentBanner = sizeBanners.find(b => b.id === slot.id) || {
            id: slot.id, title: '', subtitle: '', link: '/catalog', videoUrl: '', posterUrl: '', buttonText: 'Alışverişe Başla', isActive: true
          }
          return (
            <BannerSlotEditor
              key={slot.id}
              slot={slot}
              type="video"
              currentBanner={currentBanner as any}
              onSave={(data) => handleSave(slot.id, data)}
              isLoading={loadingMap[slot.id]}
            />
          )
        })}
      </div>
    </div>
  )
}

function BannerSlotEditor({
  slot,
  type,
  currentBanner,
  onSave,
  isLoading
}: {
  slot: { id: string, title: string, description: string, recommendedSize: string },
  type: 'image' | 'video',
  currentBanner: Partial<SizeBanner> & { buttonText?: string },
  onSave: (data: any) => void,
  isLoading: boolean
}) {
  const [form, setForm] = useState(currentBanner)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [uploadingVideo, setUploadingVideo] = useState(false)
  const [uploadingPoster, setUploadingPoster] = useState(false)

  // Sync with store updates
  useEffect(() => {
    setForm(currentBanner)
  }, [currentBanner.id, currentBanner.updatedAt])

  const handleUpload = async (file: File, field: 'image' | 'videoUrl' | 'posterUrl') => {
    if (!file) return

    // Set loading state based on field
    if (field === 'image') setUploadingImage(true)
    if (field === 'videoUrl') setUploadingVideo(true)
    if (field === 'posterUrl') setUploadingPoster(true)

    try {
      // Determine folder based on type
      const folder = field === 'videoUrl' ? 'videos' : 'banners'
      const url = await uploadToStorage(file, folder)

      setForm(prev => ({ ...prev, [field]: url }))
    } catch (error) {
      console.error('Upload error:', error)
      alert('Yükleme başarısız oldu. Lütfen tekrar deneyin.')
    } finally {
      if (field === 'image') setUploadingImage(false)
      if (field === 'videoUrl') setUploadingVideo(false)
      if (field === 'posterUrl') setUploadingPoster(false)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <div>
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            {type === 'video' ? <Video className="w-4 h-4 text-purple-600" /> : <LayoutDashboard className="w-4 h-4 text-primary-600" />}
            {slot.title}
          </h3>
          <p className="text-xs text-gray-500">{slot.description} • {slot.recommendedSize}</p>
        </div>
        {form.isActive && <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">Aktif</span>}
      </div>

      <div className="p-6 space-y-6">

        {/* MEDIA PREVIEWS & UPLOADS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Main Visual (Image or Video) */}
          <div className="space-y-2">
            <span className="text-sm font-medium text-gray-700 block">{type === 'video' ? 'Video Dosyası' : 'Banner Görseli'}</span>
            <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden border border-gray-200 relative group">
              {type === 'image' ? (
                form.image ? <img src={form.image} className="w-full h-full object-cover" /> : <div className="flex items-center justify-center h-full text-gray-400"><ImageIcon className="w-8 h-8" /></div>
              ) : (
                form.videoUrl ? <video src={form.videoUrl} className="w-full h-full object-cover" autoPlay muted loop /> : <div className="flex items-center justify-center h-full text-gray-400"><Video className="w-8 h-8" /></div>
              )}

              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <label className="cursor-pointer bg-white text-gray-900 px-4 py-2 rounded-lg font-medium text-sm hover:bg-gray-100 transition-colors flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  {uploadingImage || uploadingVideo ? 'Yükleniyor...' : (type === 'video' ? 'Video Yükle' : 'Görsel Yükle')}
                  <input
                    type="file"
                    accept={type === 'video' ? "video/*" : "image/*"}
                    className="hidden"
                    onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0], type === 'video' ? 'videoUrl' : 'image')}
                  />
                </label>
              </div>
            </div>
            {type === 'video' && <p className="text-xs text-gray-500">MP4 formatı önerilir.</p>}
          </div>

          {/* Poster Image (Only for Video) */}
          {type === 'video' && (
            <div className="space-y-2">
              <span className="text-sm font-medium text-gray-700 block">Kapak Görseli (Poster)</span>
              <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden border border-gray-200 relative group">
                {form.posterUrl ? (
                  <img src={form.posterUrl} className="w-full h-full object-cover" />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    <ImageIcon className="w-8 h-8" />
                    <span className="text-xs ml-2">Poster Yok</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <label className="cursor-pointer bg-white text-gray-900 px-4 py-2 rounded-lg font-medium text-sm hover:bg-gray-100 transition-colors flex items-center gap-2">
                    <Upload className="w-4 h-4" />
                    {uploadingPoster ? 'Yükleniyor...' : 'Poster Yükle'}
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0], 'posterUrl')} />
                  </label>
                </div>
              </div>
              <p className="text-xs text-gray-500">Video yüklenmeden önce görünecek resim.</p>
            </div>
          )}
        </div>

        {/* TEXT FIELDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Başlık</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
              value={form.title || ''}
              onChange={e => setForm({ ...form, title: e.target.value })}
              placeholder={type === 'video' ? "Örn: Premium Koleksiyon" : "Örn: Yılın Enleri"}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Alt Başlık</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
              value={form.subtitle || ''}
              onChange={e => setForm({ ...form, subtitle: e.target.value })}
              placeholder={type === 'video' ? "Örn: Gösterişli & Büyük" : "Örn: Doğadan gelen..."}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Buton Metni</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
              value={form.buttonText || ''}
              onChange={e => setForm({ ...form, buttonText: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Yönlendirilecek Link</label>
            <div className="relative">
              <ExternalLink className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <input
                type="text"
                className="w-full pl-9 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                value={form.link || ''}
                onChange={e => setForm({ ...form, link: e.target.value })}
              />
            </div>
          </div>
        </div>

        <button
          onClick={() => onSave(form)}
          disabled={isLoading || uploadingImage || uploadingVideo || uploadingPoster}
          className="w-full bg-primary-600 text-white py-3 rounded-lg font-bold hover:bg-primary-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          Değişiklikleri Kaydet
        </button>
      </div>
    </div>
  )
}
