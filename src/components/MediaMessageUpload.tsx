import { useState, useRef } from 'react'
import { Upload, X, Video, Mic, Image as ImageIcon, CheckCircle, AlertCircle } from 'lucide-react'

interface MediaMessageUploadProps {
  onMediaChange: (media: { url: string; type: 'video' | 'audio' | 'image' } | null) => void
  value: { url: string; type: 'video' | 'audio' | 'image' } | null
}

const MAX_VIDEO_SIZE = 10 * 1024 * 1024 // 10MB
const MAX_AUDIO_SIZE = 5 * 1024 * 1024 // 5MB
const MAX_IMAGE_SIZE = 5 * 1024 * 1024 // 5MB
const MAX_VIDEO_DURATION = 15 // 15 seconds

export default function MediaMessageUpload({ onMediaChange, value }: MediaMessageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setError(null)

    const fileType = file.type.startsWith('video') ? 'video' :
      file.type.startsWith('audio') ? 'audio' :
        file.type.startsWith('image') ? 'image' : null

    if (!fileType) {
      setError('Desteklenmeyen dosya formatı')
      return
    }

    const maxSize = fileType === 'video' ? MAX_VIDEO_SIZE :
      fileType === 'audio' ? MAX_AUDIO_SIZE :
        MAX_IMAGE_SIZE

    if (file.size > maxSize) {
      const maxSizeMB = maxSize / (1024 * 1024)
      setError(`Dosya boyutu ${maxSizeMB}MB'yi geçemez`)
      return
    }

    if (fileType === 'video') {
      const duration = await getVideoDuration(file)
      if (duration > MAX_VIDEO_DURATION) {
        setError(`Video süresi ${MAX_VIDEO_DURATION} saniyeyi geçemez`)
        return
      }
    }

    await uploadMedia(file, fileType)
  }

  const getVideoDuration = (file: File): Promise<number> => {
    return new Promise((resolve) => {
      const video = document.createElement('video')
      video.preload = 'metadata'
      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src)
        resolve(video.duration)
      }
      video.onerror = () => resolve(0)
      video.src = URL.createObjectURL(file)
    })
  }

  const uploadMedia = async (file: File, type: 'video' | 'audio' | 'image') => {
    setUploading(true)
    setUploadProgress(0)
    setError(null)

    try {
      const { uploadToR2 } = await import('@/lib/r2')

      setUploadProgress(20)

      const publicUrl = await uploadToR2(file, 'media-messages')

      setUploadProgress(100)

      onMediaChange({ url: publicUrl, type })
      setPreview(publicUrl)
    } catch (err) {
      console.error('Upload error:', err)
      setError('Medya yüklenirken hata oluştu')
    } finally {
      setUploading(false)
      setUploadProgress(0)
    }
  }

  const handleRemove = () => {
    onMediaChange(null)
    setPreview(null)
    setError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <h3 className="text-lg font-semibold text-gray-900">Medya Mesajı</h3>
        <span className="text-sm text-gray-500">
          (Video: max 15sn, 10MB | Ses: max 5MB | Resim: max 5MB)
        </span>
      </div>

      {value && preview ? (
        <div className="relative bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl p-6 border-2 border-pink-200">
          {value.type === 'video' && (
            <div className="relative">
              <video
                src={preview}
                controls
                className="w-full max-h-64 rounded-xl"
              />
              <button
                onClick={handleRemove}
                className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
          {value.type === 'audio' && (
            <div className="relative">
              <audio src={preview} controls className="w-full" />
              <button
                onClick={handleRemove}
                className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
          {value.type === 'image' && (
            <div className="relative">
              <img
                src={preview}
                alt="Media message"
                className="w-full max-h-64 object-contain rounded-xl"
              />
              <button
                onClick={handleRemove}
                className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
          <div className="mt-4 flex items-center gap-2 text-green-600">
            <CheckCircle className="w-5 h-5" />
            <span className="font-semibold">Medya yüklendi</span>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <label className="cursor-pointer">
            <input
              ref={fileInputRef}
              type="file"
              accept="video/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            <div className="bg-gradient-to-br from-pink-100 to-purple-100 rounded-2xl p-6 border-2 border-pink-200 hover:border-pink-400 hover:shadow-lg transition-all duration-300 text-center">
              <Video className="w-12 h-12 text-pink-600 mx-auto mb-3" />
              <h4 className="font-semibold text-gray-900 mb-2">Video Yükle</h4>
              <p className="text-sm text-gray-600">Max 15 saniye, 10MB</p>
            </div>
          </label>

          <label className="cursor-pointer">
            <input
              type="file"
              accept="audio/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            <div className="bg-gradient-to-br from-purple-100 to-blue-100 rounded-2xl p-6 border-2 border-purple-200 hover:border-purple-400 hover:shadow-lg transition-all duration-300 text-center">
              <Mic className="w-12 h-12 text-purple-600 mx-auto mb-3" />
              <h4 className="font-semibold text-gray-900 mb-2">Ses Yükle</h4>
              <p className="text-sm text-gray-600">Max 5MB</p>
            </div>
          </label>

          <label className="cursor-pointer">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            <div className="bg-gradient-to-br from-blue-100 to-cyan-100 rounded-2xl p-6 border-2 border-blue-200 hover:border-blue-400 hover:shadow-lg transition-all duration-300 text-center">
              <ImageIcon className="w-12 h-12 text-blue-600 mx-auto mb-3" />
              <h4 className="font-semibold text-gray-900 mb-2">Resim Yükle</h4>
              <p className="text-sm text-gray-600">Max 5MB</p>
            </div>
          </label>
        </div>
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
            </div>
            <div className="text-sm text-gray-600 mt-2">{uploadProgress}%</div>
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
