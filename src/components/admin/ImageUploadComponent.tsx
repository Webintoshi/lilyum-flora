import { useState, useCallback } from 'react'
import { Link as LinkIcon, X, Image as ImageIcon } from 'lucide-react'

interface ImageUploadComponentProps {
  images: string[]
  onImagesChange: (images: string[]) => void
  maxImages?: number
  disabled?: boolean
}

export default function ImageUploadComponent({
  images,
  onImagesChange,
  maxImages = 10,
  disabled = false,
}: ImageUploadComponentProps) {
  const [imageUrl, setImageUrl] = useState('')

  const handleAddImage = () => {
    if (!imageUrl.trim()) return
    
    if (images.length >= maxImages) {
      alert(`Maksimum ${maxImages} görsel ekleyebilirsiniz`)
      return
    }

    onImagesChange([...images, imageUrl.trim()])
    setImageUrl('')
  }

  const handleRemoveImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index)
    onImagesChange(newImages)
  }

  const handleSetPrimary = (index: number) => {
    const newImages = [...images]
    const [primaryImage] = newImages.splice(index, 1)
    onImagesChange([primaryImage, ...newImages])
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Görsel URL Ekle</h2>
        
        <div className="space-y-3">
          <div>
            <label htmlFor="image-url" className="block text-sm font-medium text-gray-700 mb-2">
              Görsel URL *
            </label>
            <div className="flex gap-2">
              <input
                id="image-url"
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddImage()}
                disabled={disabled || images.length >= maxImages}
                placeholder="https://lilyumflora.net/products/..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <button
                type="button"
                onClick={handleAddImage}
                disabled={disabled || images.length >= maxImages}
                className="px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
              >
                Ekle
              </button>
            </div>
            <p className="text-xs text-gray-500">
              R2 bucket'ından kopyaladığınız URL'yi yapıştırın ve Ekle'ye tıklayın
            </p>
          </div>
        </div>
      </div>

      {images.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">
              Yüklenen Görseller ({images.length}/{maxImages})
            </h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {images.map((imageUrl, index) => (
              <div
                key={index}
                className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200 bg-gray-50"
              >
                <img
                  src={imageUrl}
                  alt={`Görsel ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleSetPrimary(index)}
                    disabled={index === 0 || disabled}
                    className="px-3 py-1.5 bg-white text-gray-900 text-xs font-medium rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Ana görsel yap"
                  >
                    {index === 0 ? 'Ana' : 'Ana Yap'}
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    disabled={disabled}
                    className="p-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Sil"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {index === 0 && (
                  <div className="absolute top-2 left-2 px-2 py-1 bg-primary-500 text-white text-xs font-medium rounded">
                    Ana
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {images.length === 0 && (
        <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-200">
          <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-2" />
          <p className="text-sm text-gray-500">Henüz görsel eklenmedi</p>
          <p className="text-xs text-gray-400 mt-1">
            URL'yi yukarıdaki alana girip "Ekle" butonuna tıklayın
          </p>
        </div>
      )}
    </div>
  )
}
