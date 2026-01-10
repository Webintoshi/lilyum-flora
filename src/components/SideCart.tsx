import { X, ShoppingBag, Trash2, Plus, Minus, ChevronRight } from "lucide-react";
import { useCartStore } from "@/store/cartStore";

export default function SideCart() {
  const { items, removeFromCart, updateQuantity, getTotalPrice, isOpen, toggleCart } = useCartStore();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div 
        className="absolute inset-0 bg-dark-900/50 transition-opacity duration-200" 
        onClick={toggleCart}
      ></div>
      
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl flex flex-col animate-slideIn">
        <div className="flex items-center justify-between p-6 border-b border-neutral-200">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-6 h-6 text-primary-600" />
            <h2 className="text-xl font-bold text-dark-800">Sepetim</h2>
            <span className="bg-primary-600 text-white text-sm px-3 py-1 rounded-full">
              {items.length}
            </span>
          </div>
          <button 
            onClick={toggleCart}
            className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-dark-700" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag className="w-24 h-24 text-dark-300 mb-4" />
              <p className="text-dark-500 text-lg mb-2">Sepetiniz boş</p>
              <p className="text-dark-400 text-sm">Ürünlerimizi keşfetmeye başlayın</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 p-4 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary-50 to-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-4xl">{item.image}</span>
                  </div>
                  
                  <div className="flex-1">
                    <h4 className="font-semibold text-dark-800 mb-1 line-clamp-1">{item.name}</h4>
                    <p className="text-primary-600 font-bold text-lg mb-2">{item.price} ₺</p>
                    
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        className="w-9 h-9 bg-white border-2 border-primary-200 rounded-lg flex items-center justify-center hover:bg-primary-50 hover:border-primary-600 transition-all active:scale-95"
                      >
                        <Minus className="w-4 h-4 text-primary-700" />
                      </button>
                      <span className="w-12 h-9 text-center font-bold text-lg text-dark-800 bg-white border-2 border-neutral-200 rounded-lg flex items-center justify-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-9 h-9 bg-primary-600 border-2 border-primary-600 rounded-lg flex items-center justify-center hover:bg-primary-700 hover:border-primary-700 transition-all active:scale-95 shadow-md"
                      >
                        <Plus className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-2 hover:bg-red-100 rounded-lg transition-colors self-start"
                  >
                    <Trash2 className="w-5 h-5 text-red-500" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="border-t border-neutral-200 p-6 space-y-4">
          <div className="flex justify-between items-center text-lg">
            <span className="text-dark-600">Ara Toplam</span>
            <span className="font-semibold text-dark-800">{getTotalPrice()} ₺</span>
          </div>
          <div className="flex justify-between items-center text-lg">
            <span className="text-dark-600">Kargo</span>
            <span className="font-semibold text-primary-600">Ücretsiz</span>
          </div>
          <div className="flex justify-between items-center text-xl pt-4 border-t border-neutral-200">
            <span className="font-bold text-dark-800">Toplam</span>
            <span className="font-bold text-primary-600">{getTotalPrice()} ₺</span>
          </div>
          
          {items.length > 0 && (
            <a
              href="/checkout"
              onClick={toggleCart}
              className="w-full bg-primary-600 text-white py-4 rounded-lg hover:bg-primary-700 transition-colors font-semibold flex items-center justify-center text-lg"
            >
              Ödemeye Geç
              <ChevronRight className="ml-2 w-5 h-5" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
