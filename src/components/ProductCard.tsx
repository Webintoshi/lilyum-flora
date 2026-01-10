import { Heart, ShoppingCart, Star } from "lucide-react";

interface ProductCardProps {
  id: number;
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
  rating,
  reviews,
  category,
  inStock,
  onAddToCart,
  onAddToWishlist,
  onProductClick,
}: ProductCardProps) {
  const discount = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

  return (
    <div 
      onClick={onProductClick}
      className="group bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer"
    >
      <div className="relative">
        <div className="aspect-square bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center overflow-hidden">
          <span className="text-8xl group-hover:scale-110 transition-transform duration-300">{image}</span>
        </div>
        
        {discount > 0 && (
          <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            -{discount}%
          </span>
        )}
        
        {inStock <= 10 && (
          <span className="absolute top-3 right-3 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded">
            Son {inStock} adet
          </span>
        )}
        
        <div 
          onClick={onProductClick}
          className="absolute inset-0 bg-dark-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 cursor-pointer"
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              const rect = e.currentTarget.getBoundingClientRect();
              window.dispatchEvent(new CustomEvent('magic-dust', {
                detail: {
                  x: rect.left + rect.width / 2,
                  y: rect.top + rect.height / 2,
                },
              }));
              onAddToWishlist?.();
            }}
            className="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:bg-primary-50 transition-colors"
            title="Favorilere Ekle"
          >
            <Heart className="w-5 h-5 text-dark-700 hover:text-primary-600" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              const rect = e.currentTarget.getBoundingClientRect();
              window.dispatchEvent(new CustomEvent('magic-dust', {
                detail: {
                  x: rect.left + rect.width / 2,
                  y: rect.top + rect.height / 2,
                },
              }));
              onAddToCart?.(e);
            }}
            className="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:bg-primary-50 transition-colors"
            title="Sepete Ekle"
          >
            <ShoppingCart className="w-5 h-5 text-dark-700 hover:text-primary-600" />
          </button>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex items-center gap-1 mb-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`w-4 h-4 ${
                star <= rating ? "fill-yellow-400 text-yellow-400" : "text-dark-300"
              }`}
            />
          ))}
          <span className="text-sm text-dark-500 ml-1">({reviews})</span>
        </div>
        
        <a href={`/product/${id}`} className="block hover:text-primary-600 transition-colors">
          <h3 className="font-semibold text-dark-800 mb-2 line-clamp-2 min-h-[3rem]">{name}</h3>
        </a>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {originalPrice && (
              <span className="text-sm text-dark-400 line-through">{originalPrice} ₺</span>
            )}
            <span className="text-xl font-bold text-primary-600">{price} ₺</span>
          </div>
        </div>

        <button
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            window.dispatchEvent(new CustomEvent('magic-dust', {
              detail: {
                x: rect.left + rect.width / 2,
                y: rect.top + rect.height / 2,
              },
            }));
            onAddToCart?.(e);
          }}
          className="w-full mt-3 bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 transition-colors font-semibold flex items-center justify-center gap-2"
        >
          <ShoppingCart className="w-5 h-5" />
          Sepete Ekle
        </button>

        {inStock > 0 && inStock <= 20 && (
          <div className="mt-3">
            <div className="flex justify-between text-xs text-dark-500 mb-1">
              <span>Stok durumu</span>
              <span>{inStock} adet kaldı</span>
            </div>
            <div className="w-full bg-neutral-200 rounded-full h-2">
              <div
                className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(inStock / 20) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}