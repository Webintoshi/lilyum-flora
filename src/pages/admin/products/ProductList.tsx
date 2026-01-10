import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Edit, Trash2, Search, Filter, Package, Star, Eye, ToggleLeft, ToggleRight } from 'lucide-react'
import { useAdminStore } from '@/store/adminStore'
import type { Product } from '@/types'

export default function ProductList() {
  const navigate = useNavigate()
  const { products, fetchProducts, deleteProduct, updateProduct } = useAdminStore()
  const [searchTerm, setSearchTerm] = useState('')
  const [sortField, setSortField] = useState<keyof Product | null>(null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [filterCategory, setFilterCategory] = useState<number | 'all'>('all')
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all')

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  const handleSort = (field: keyof Product) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const filteredProducts = products
    .filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.slug && product.slug.toLowerCase().includes(searchTerm.toLowerCase()))

      const matchesCategory = filterCategory === 'all' || product.categoryId === filterCategory

      const matchesStatus =
        filterStatus === 'all' ||
        (filterStatus === 'active' && product.isActive) ||
        (filterStatus === 'inactive' && !product.isActive)

      return matchesSearch && matchesCategory && matchesStatus
    })
    .sort((a, b) => {
      if (!sortField) return 0
      const aValue = a[sortField]
      const bValue = b[sortField]
      if (aValue === bValue) return 0
      if (aValue === undefined || aValue === null) return 1
      if (bValue === undefined || bValue === null) return -1
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue)
      }
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue
      }
      return 0
    })

  const handleDelete = async (id: number) => {
    if (confirm('Bu ürünü silmek istediğinize emin misiniz?')) {
      await deleteProduct(id)
    }
  }

  const handleToggleActive = async (product: Product) => {
    await updateProduct(product.id, { isActive: !product.isActive })
  }

  const handleToggleFeatured = async (product: Product) => {
    await updateProduct(product.id, { featured: !product.featured })
  }

  const totalStock = products.reduce((sum, p) => sum + p.stock, 0)
  const activeProducts = products.filter((p) => p.isActive).length

  const getImageUrl = (product: Product) => {
    return product.images && product.images.length > 0 ? product.images[0] : product.image
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Ürünler</h1>
          <p className="text-gray-600 mt-1">Ürün listesini yönetin</p>
        </div>
        <button
          onClick={() => navigate('/admin/products/new')}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Yeni Ürün
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Toplam Ürün</p>
              <p className="text-3xl font-bold text-gray-900">{products.length}</p>
            </div>
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-primary-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Aktif Ürün</p>
              <p className="text-3xl font-bold text-primary-600">{activeProducts}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Eye className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Toplam Stok</p>
              <p className="text-3xl font-bold text-gray-900">{totalStock}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Filter className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Öne Çıkan</p>
              <p className="text-3xl font-bold text-primary-600">
                {products.filter((p) => p.featured).length}
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Star className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Ürün ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">Tüm Kategoriler</option>
            {[...new Set(products.map((p) => p.categoryId))].map((categoryId) => {
              const category = products.find((p) => p.categoryId === categoryId)
              return (
                <option key={categoryId} value={categoryId}>
                  {category?.category || `Kategori ${categoryId}`}
                </option>
              )
            })}
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as 'all' | 'active' | 'inactive')}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">Tüm Durumlar</option>
            <option value="active">Aktif</option>
            <option value="inactive">Pasif</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Ürün</th>
                <th
                  onClick={() => handleSort('price')}
                  className="text-left py-3 px-4 font-semibold text-gray-900 cursor-pointer hover:bg-gray-50"
                >
                  Fiyat
                </th>
                <th
                  onClick={() => handleSort('stock')}
                  className="text-left py-3 px-4 font-semibold text-gray-900 cursor-pointer hover:bg-gray-50"
                >
                  Stok
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Durum</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-500">
                    {searchTerm || filterCategory !== 'all' || filterStatus !== 'all'
                      ? 'Aradığınız kriterlere uygun ürün bulunamadı'
                      : 'Henüz ürün yok'}
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={getImageUrl(product)}
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div>
                          <div className="font-medium text-gray-900">{product.name}</div>
                          <div className="text-xs text-gray-500">{product.category}</div>
                          {product.featured && (
                            <div className="flex items-center gap-1 text-xs text-yellow-600 mt-1">
                              <Star className="w-3 h-3" />
                              Öne Çıkan
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="space-y-1">
                        <span className="font-bold text-primary-600">
                          ₺{product.price.toLocaleString('tr-TR')}
                        </span>
                        {product.compareAtPrice && product.compareAtPrice > product.price && (
                          <div className="text-sm text-gray-400 line-through">
                            ₺{product.compareAtPrice.toLocaleString('tr-TR')}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          product.stock > 10
                            ? 'bg-green-100 text-green-800'
                            : product.stock > 0
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {product.stock} adet
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => handleToggleActive(product)}
                          className={`flex items-center gap-1 text-xs px-2 py-1 rounded ${
                            product.isActive
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {product.isActive ? (
                            <>
                              <Eye className="w-3 h-3" />
                              Aktif
                            </>
                          ) : (
                            <>
                              <ToggleLeft className="w-3 h-3" />
                              Pasif
                            </>
                          )}
                        </button>
                        {product.featured && (
                          <div className="flex items-center gap-1 text-xs text-yellow-600">
                            <Star className="w-3 h-3" />
                            Öne Çıkan
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => navigate(`/admin/products/${product.id}`)}
                          className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                          title="Düzenle"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleToggleFeatured(product)}
                          className={`p-2 rounded-lg transition-colors ${
                            product.featured
                              ? 'text-yellow-600 hover:bg-yellow-50'
                              : 'text-gray-400 hover:bg-gray-100'
                          }`}
                          title="Öne Çıkan"
                        >
                          <Star className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Sil"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {filteredProducts.length > 0 && (
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <p>Toplam {filteredProducts.length} ürün gösteriliyor</p>
              <p>Toplam Stok: {totalStock}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
