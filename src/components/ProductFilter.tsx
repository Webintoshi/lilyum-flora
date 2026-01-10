import { SlidersHorizontal, X } from "lucide-react";

interface FilterOption {
  id: string;
  name: string;
  count: number;
}

interface FilterCategory {
  name: string;
  options: FilterOption[];
}

interface ProductFilterProps {
  categories: FilterCategory[];
  priceRange: { min: number; max: number };
  colors: FilterOption[];
  sortBy: string;
  onPriceChange: (min: number, max: number) => void;
  onCategoryToggle: (categoryId: string, optionId: string) => void;
  onColorToggle: (colorId: string) => void;
  onSortChange: (sortBy: string) => void;
  onClearFilters: () => void;
  activeFilters: {
    categories: string[];
    colors: string[];
  };
}

export default function ProductFilter({
  categories,
  priceRange,
  colors,
  sortBy,
  onPriceChange,
  onCategoryToggle,
  onColorToggle,
  onSortChange,
  onClearFilters,
  activeFilters,
}: ProductFilterProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-dark-800 flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5 text-primary-600" />
          Filtreler
        </h3>
        {activeFilters.categories.length > 0 || activeFilters.colors.length > 0 ? (
          <button
            onClick={onClearFilters}
            className="flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700 transition-colors"
          >
            <X className="w-4 h-4" />
            Temizle
          </button>
        ) : null}
      </div>

      <div className="space-y-6">
        {categories.map((category) => (
          <div key={category.name}>
            <h4 className="font-medium text-dark-700 mb-3">{category.name}</h4>
            <div className="space-y-2">
              {category.options.map((option) => (
                <label
                  key={option.id}
                  className="flex items-center justify-between cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={activeFilters.categories.includes(option.id)}
                      onChange={() => onCategoryToggle(category.name, option.id)}
                      className="w-4 h-4 text-primary-600 rounded focus:ring-primary-600 focus:ring-offset-0"
                    />
                    <span className="text-dark-600 group-hover:text-dark-800 transition-colors">
                      {option.name}
                    </span>
                  </div>
                  <span className="text-sm text-dark-400">({option.count})</span>
                </label>
              ))}
            </div>
          </div>
        ))}

        <div>
          <h4 className="font-medium text-dark-700 mb-3">Fiyat Aralığı</h4>
          <div className="space-y-3">
            <input
              type="range"
              min="0"
              max="2000"
              step="50"
              value={priceRange.max}
              onChange={(e) => onPriceChange(priceRange.min, parseInt(e.target.value))}
              className="w-full accent-primary-600"
            />
            <div className="flex justify-between text-sm text-dark-600">
              <span>{priceRange.min} ₺</span>
              <span>{priceRange.max} ₺</span>
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-medium text-dark-700 mb-3">Renk</h4>
          <div className="flex flex-wrap gap-2">
            {colors.map((color) => (
              <label key={color.id} className="cursor-pointer">
                <input
                  type="checkbox"
                  checked={activeFilters.colors.includes(color.id)}
                  onChange={() => onColorToggle(color.id)}
                  className="sr-only"
                />
                <div
                  className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all ${
                    activeFilters.colors.includes(color.id)
                      ? "border-primary-600 ring-2 ring-primary-200"
                      : "border-neutral-300 hover:border-primary-500"
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-full ${
                      color.name === "Kırmızı"
                        ? "bg-red-500"
                        : color.name === "Pembe"
                        ? "bg-pink-500"
                        : color.name === "Beyaz"
                        ? "bg-white"
                        : color.name === "Sarı"
                        ? "bg-yellow-400"
                        : color.name === "Mor"
                        ? "bg-purple-500"
                        : color.name === "Turuncu"
                        ? "bg-orange-500"
                        : "bg-neutral-300"
                    }`}
                  />
                </div>
              </label>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-medium text-dark-700 mb-3">Sıralama</h4>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="w-full p-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 bg-white"
          >
            <option value="popular">Önerilen</option>
            <option value="price-asc">Fiyat: Düşükten Yükseğe</option>
            <option value="price-desc">Fiyat: Yüksekten Düşüğe</option>
            <option value="rating">En Çok Değerlendirilenler</option>
            <option value="newest">En Yeniler</option>
            <option value="bestseller">Çok Satanlar</option>
          </select>
        </div>
      </div>
    </div>
  );
}
