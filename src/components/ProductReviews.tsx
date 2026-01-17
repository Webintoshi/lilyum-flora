import { useEffect, useState } from 'react'
import { Star, ThumbsUp, MessageSquare, User } from 'lucide-react'
import { useReviewStore, Review } from '@/store/reviewStore'

interface ProductReviewsProps {
  productId: string | number
  userId?: string | number
  orderId?: string | number
}

export default function ProductReviews({ productId, userId, orderId }: ProductReviewsProps) {
  const { productReviews, isLoading, addReview, markAsHelpful, fetchProductReviews } = useReviewStore()
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [title, setTitle] = useState('')
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [averageRating, setAverageRating] = useState(0)

  useEffect(() => {
    fetchProductReviews(String(productId))
    calculateAverageRating()
  }, [productId, fetchProductReviews])

  const calculateAverageRating = async () => {
    const { getProductAverageRating } = useReviewStore.getState()
    const avg = await getProductAverageRating(String(productId))
    setAverageRating(avg)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (rating === 0 || !comment.trim()) return

    setSubmitting(true)
    try {
      await addReview({
        productId: String(productId),
        userId: userId ? String(userId) : '0',
        orderId: orderId ? String(orderId) : undefined,
        rating,
        title,
        comment,
        isVerified: !!orderId,
      })
      setShowReviewForm(false)
      setRating(0)
      setTitle('')
      setComment('')
      calculateAverageRating()
    } catch (error) {
      console.error('Review submission error:', error)
    } finally {
      setSubmitting(false)
    }
  }

  const renderStars = (rating: number, interactive = false) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-5 h-5 ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
              } ${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : ''}`}
            onMouseEnter={() => interactive && setHoverRating(star)}
            onMouseLeave={() => interactive && setHoverRating(0)}
            onClick={() => interactive && setRating(star)}
          />
        ))}
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="space-y-4">
          <div className="h-24 bg-gray-200 rounded"></div>
          <div className="h-24 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Müşteri Yorumları</h2>
          <div className="flex items-center space-x-2">
            <div className="flex items-center">
              <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
              <span className="text-2xl font-bold text-gray-800 ml-2">
                {averageRating.toFixed(1)}
              </span>
            </div>
            <span className="text-gray-500">({productReviews.length} yorum)</span>
          </div>
        </div>
        {userId && !showReviewForm && (
          <button
            onClick={() => setShowReviewForm(true)}
            className="flex items-center space-x-2 bg-pink-500 text-white px-6 py-3 rounded-lg hover:bg-pink-600 transition-colors"
          >
            <MessageSquare className="w-5 h-5" />
            <span>Yorum Yaz</span>
          </button>
        )}
      </div>

      {showReviewForm && (
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Yorumunuzu Paylaşın</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Puanınız *
              </label>
              <div className="flex items-center space-x-2">
                {renderStars(hoverRating || rating, true)}
                <span className="text-sm text-gray-500 ml-2">
                  {hoverRating || rating}/5
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Başlık
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Kısa bir başlık girin"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Yorumunuz *
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Deneyiminizi paylaşın..."
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none"
              />
            </div>

            <div className="flex space-x-3">
              <button
                type="submit"
                disabled={submitting || rating === 0 || !comment.trim()}
                className="bg-pink-500 text-white px-6 py-2 rounded-lg hover:bg-pink-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {submitting ? 'Gönderiliyor...' : 'Yorum Gönder'}
              </button>
              <button
                type="button"
                onClick={() => setShowReviewForm(false)}
                className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors"
              >
                İptal
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-6">
        {productReviews.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Henüz yorum yapılmadı. İlk yorumu siz yazın!</p>
          </div>
        ) : (
          productReviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              onHelpful={() => markAsHelpful(review.id)}
              canEdit={review.userId === userId}
            />
          ))
        )}
      </div>
    </div>
  )
}

interface ReviewCardProps {
  review: Review
  onHelpful: () => void
  canEdit?: boolean
}

function ReviewCard({ review, onHelpful, canEdit }: ReviewCardProps) {
  const renderStars = (rating: number) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
              }`}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          {review.userAvatar ? (
            <img
              src={review.userAvatar}
              alt={review.userName}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-pink-500" />
            </div>
          )}
          <div>
            <p className="font-semibold text-gray-800">
              {review.userName || 'Anonim'}
            </p>
            {review.isVerified && (
              <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                Doğrulanmış Satın Alma
              </span>
            )}
          </div>
        </div>
        <div className="text-right">
          {renderStars(review.rating)}
          <p className="text-sm text-gray-500 mt-1">
            {new Date(review.createdAt).toLocaleDateString('tr-TR', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
            })}
          </p>
        </div>
      </div>

      {review.title && (
        <h4 className="font-semibold text-gray-800 mb-2">{review.title}</h4>
      )}

      <p className="text-gray-600 mb-4">{review.comment}</p>

      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <button
          onClick={onHelpful}
          className="flex items-center space-x-2 text-gray-500 hover:text-pink-500 transition-colors"
        >
          <ThumbsUp className="w-4 h-4" />
          <span className="text-sm">Faydalı ({review.helpfulCount})</span>
        </button>
        {canEdit && (
          <button className="text-sm text-pink-500 hover:text-pink-600 transition-colors">
            Düzenle
          </button>
        )}
      </div>
    </div>
  )
}
