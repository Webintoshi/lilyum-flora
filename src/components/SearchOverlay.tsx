import { useNavigate } from 'react-router-dom';
import { Product } from '@/types';
import { Loader2 } from 'lucide-react';

interface SearchOverlayProps {
    results: Product[];
    isLoading: boolean;
    isVisible: boolean;
    onClose: () => void;
    searchTerm: string;
}

export default function SearchOverlay({ results, isLoading, isVisible, onClose, searchTerm }: SearchOverlayProps) {
    const navigate = useNavigate();

    if (!isVisible) return null;

    return (
        <div className="absolute top-full left-0 right-0 z-50 mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
            {isLoading ? (
                <div className="flex items-center justify-center p-6 text-gray-500">
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    <span className="text-sm">Aranıyor...</span>
                </div>
            ) : results.length > 0 ? (
                <div className="max-h-[70vh] overflow-y-auto">
                    <div className="px-4 py-2 bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Sonuçlar
                    </div>
                    {results.map((product) => (
                        <div
                            key={product.id}
                            onClick={() => {
                                navigate(`/product/${product.id}`);
                                onClose();
                            }}
                            className="flex items-center gap-4 p-3 hover:bg-gray-50 transition-colors cursor-pointer border-b border-gray-50 last:border-0"
                        >
                            <div className="w-12 h-12 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                                <img
                                    src={product.image || "https://images.unsplash.com/photo-1596627702842-8703f47c3eb9?q=80&w=200"}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1596627702842-8703f47c3eb9?q=80&w=200"}
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-semibold text-gray-900 truncate">
                                    {product.name}
                                </h4>
                                <div className="flex items-center gap-2 mt-0.5">
                                    <span className="text-primary-600 font-bold text-sm">
                                        {product.price.toLocaleString('tr-TR')} TL
                                    </span>
                                    {product.compareAtPrice && product.compareAtPrice > product.price && (
                                        <span className="text-xs text-gray-400 line-through">
                                            {product.compareAtPrice.toLocaleString('tr-TR')} TL
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                    <div
                        onClick={() => {
                            navigate(`/catalog?search=${encodeURIComponent(searchTerm)}`);
                            onClose();
                        }}
                        className="p-3 text-center text-sm font-medium text-primary-600 hover:text-primary-700 hover:bg-primary-50 cursor-pointer transition-colors border-t border-gray-100"
                    >
                        Tüm sonuçları gör ({searchTerm})
                    </div>
                </div>
            ) : searchTerm.length >= 3 ? (
                <div className="p-8 text-center text-gray-500">
                    <p className="text-sm">"{searchTerm}" için sonuç bulunamadı.</p>
                </div>
            ) : null}
        </div>
    );
}
