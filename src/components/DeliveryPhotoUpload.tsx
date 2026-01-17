import { useState, useRef } from 'react'
import { Upload, X, Camera, CheckCircle, AlertCircle } from 'lucide-react'

interface DeliveryPhotoUploadProps {
  orderId: string | number
  existingPhoto?: string | null
  approved?: boolean
  onPhotoChange: (url: string | null) => void
  onApprove: (approved: boolean) => void
}

export default function DeliveryPhotoUpload({ orderId, existingPhoto, approved, onPhotoChange, onApprove }: DeliveryPhotoUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [preview, setPreview] = useState<string | null>(existingPhoto || null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const MAX_IMAGE_SIZE = 5 * 1024 * 1024 // 5MB

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setError(null)

    if (!file.type.startsWith('image/')) {
      setError('Sadece resim dosyaları yüklenebilir')
      return
    }

    if (file.size > MAX_IMAGE_SIZE) {
      setError('Dosya boyutu 5MByi geçemez')
      return
    }

    await uploadPhoto(file)
  }

  const uploadPhoto = async (file: File) => {
    setUploading(true)
    setUploadProgress(0)
    setError(null)

    try {
      const { uploadToR2 } = await import('@/lib/r2')

      // Fake progress since R2 upload via fetch doesn't easily support progress events without XHR
      setUploadProgress(30)

      const publicUrl = await uploadToR2(file, 'delivery-photos')

      setUploadProgress(100)

      onPhotoChange(publicUrl)
      setPreview(publicUrl)
    } catch (err) {
      console.error('Upload error:', err)
      setError('Fotoğraf yüklenirken hata oluştu')
    } finally {
      setUploading(false)
      setUploadProgress(0)
    }
  }

  const handleRemove = () => {
    onPhotoChange(null)
    setPreview(null)
    setError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleApprove = (approvedValue: boolean) => {
    onApprove(approvedValue)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <h3 className="text-lg font-semibold text-gray-900">Teslimat Fotoğrafı</h3>
        <span className="text-sm text-gray-500">
          (Siparişin teslim edildiğini doğrulamak için)
        </span>
      </div>

      {preview ? (
        <div className="relative bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-200">
          <img
            src={preview}
            alt="Delivery photo"
            className="w-full max-h-96 object-contain rounded-xl"
          />
          <button
            onClick={handleRemove}
            className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          {approved !== undefined && (
            <div className="absolute bottom-4 left-4 right-4 flex gap-2">
              <button
                onClick={() => handleApprove(false)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${approved === false
                  ? 'bg-red-500 text-white'
                  : 'bg-white text-red-500 border-2 border-red-500 hover:bg-red-50'
                  }`}
              >
                Reddet
              </button>
              <button
                onClick={() => handleApprove(true)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${approved === true
                  ? 'bg-green-500 text-white'
                  : 'bg-white text-green-500 border-2 border-green-500 hover:bg-green-50'
                  }`}
              >
                Onayla
              </button>
            </div>
          )}
          {approved === true && (
            <div className="absolute top-4 left-4 flex items-center gap-2 bg-green-500 text-white px-3 py-1 rounded-full">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm font-semibold">Onaylandı</span>
            </div>
          )}
        </div>
      ) : (
        <label className="cursor-pointer">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-12 border-2 border-blue-200 border-dashed hover:border-blue-400 hover:shadow-lg transition-all duration-300 text-center">
            <Camera className="w-16 h-16 text-blue-600 mx-auto mb-4" />
            <h4 className="text-xl font-bold text-gray-900 mb-2">Fotoğraf Yükle</h4>
            <p className="text-gray-600 mb-4">Siparişin teslim edildiğini gösteren fotoğraf yükleyin</p>
            <p className="text-sm text-gray-500">Max 5MB</p>
          </div>
        </label>
      )}

      {uploading && (
        <div className="bg-blue-50 rounded-xl p-4 border-2 border-blue-200">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <div className="flex-1">
              <div className="text-sm font-semibold text-blue-600 mb-2">Yükleniyor...</div>
              <div className="w-full h-2 bg-blue-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-pink-500 to-purple-600 transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <div className="text-sm text-gray-600 mt-2">{uploadProgress}%</div>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 rounded-xl p-4 border-2 border-red-200 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <div className="font-semibold text-red-600">Hata</div>
            <div className="text-sm text-red-500 mt-1">{error}</div>
          </div>
        </div>
      )}
    </div>
  )
}
