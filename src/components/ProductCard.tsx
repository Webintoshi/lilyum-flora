import { Heart, ShoppingCart, Star } from "lucide-react";

interface ProductCardProps {
  id: string | number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviews: number;
  category: string;
  inStock: number;
  onAddToCart?: (e?: any) => void;
  onAddToWishlist?: (e?: any) => void;
  onProductClick?: () => void;
}

export default function ProductCard({
  id,
  name,
  price,
  originalPrice,
  image,
  rating = 5,
  reviews,
  category,
  inStock,
  onAddToCart,
  onAddToWishlist,
  onProductClick,
}: ProductCardProps) {
  // Calculate discount percentage if original price exists
  const discount = originalPrice && originalPrice > price
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  return (
    <div
      onClick={onProductClick}
      className="group bg-white rounded-xl border border-transparent hover:border-gray-100 hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer h-full flex flex-col"
    >
      {/* Image Section */}
      <div className="relative aspect-[4/5] overflow-hidden">
        <img
          src={image}
          alt={name}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "https://images.unsplash.com/photo-1596627702842-8703f47c3eb9?q=80&w=600"; // Generic flower placeholder
          }}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />

        {/* Badges */}
        {inStock <= 5 && (
          <span className="absolute top-2 left-2 bg-orange-100 text-orange-600 text-[10px] font-bold px-2 py-1 rounded-full">
            Son {inStock} ürün
          </span>
        )}

        {/* Hover Actions */}
        <div className="absolute right-2 top-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddToWishlist?.();
            }}
            className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-primary-50 text-gray-400 hover:text-red-500 shadow-sm"
          >
            <Heart className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-medium text-gray-700 text-sm mb-2 line-clamp-2 min-h-[40px]" title={name}>
          {name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`w-3 h-3 ${star <= rating ? "fill-orange-400 text-orange-400" : "text-gray-200"}`}
            />
          ))}
          <span className="text-xs text-gray-400 ml-1">({reviews || Math.floor(Math.random() * 50) + 10})</span>
        </div>

        {/* Price Section */}
        <div className="mt-auto">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            {discount > 0 && (
              <span className="bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-sm">
                %{discount}
              </span>
            )}
            {originalPrice && originalPrice > price && (
              <span className="text-sm text-gray-400 line-through font-medium">
                {originalPrice.toLocaleString('tr-TR')} TL
              </span>
            )}
            <span className="text-lg font-bold text-gray-900">
              {price.toLocaleString('tr-TR')} TL
            </span>
          </div>

          {/* Delivery Badge */}
          <div className="mt-2 text-[11px] font-semibold text-primary-600 flex items-center gap-1">
            <span>Bugün</span>
            <span className="text-gray-300">|</span>
            <span>Ücretsiz Hızlı Teslimat</span>
          </div>
        </div>

        {/* Mobile Add Button (Visible on Hover in Desktop) */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart?.(e);
          }}
          className="w-full mt-3 bg-primary-600 text-white py-2 rounded-lg font-bold text-sm hover:bg-primary-700 transition-colors"
        >
          Sepete Ekle
        </button>
      </div>
    </div>
  );
}