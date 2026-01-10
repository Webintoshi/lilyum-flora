import { useEffect, useState } from 'react'
import { Search, Mail, Phone, MapPin, Calendar, ChevronDown, ChevronUp, Filter } from 'lucide-react'
import { useAdminStore } from '@/store/adminStore'

export default function CustomerList() {
  const { customers, fetchCustomers } = useAdminStore()
  const [searchTerm, setSearchTerm] = useState('')
  const [sortField, setSortField] = useState<keyof typeof customers[0] | null>(null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all')

  useEffect(() => {
    fetchCustomers()
  }, [fetchCustomers])

  const handleSort = (field: keyof typeof customers[0]) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const filteredCustomers = customers
    .filter((customer) => {
      const matchesSearch =
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phone.includes(searchTerm)

      const matchesStatus =
        filterStatus === 'all' ||
        (filterStatus === 'active' && customer.isActive) ||
        (filterStatus === 'inactive' && !customer.isActive)

      return matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      if (!sortField) return 0
      const aValue = a[sortField]
      const bValue = b[sortField]
      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

  const totalOrders = customers.reduce((sum, c) => sum + c.totalOrders, 0)
  const totalSpent = customers.reduce((sum, c) => sum + c.totalSpent, 0)
  const activeCustomers = customers.filter((c) => c.isActive).length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Müşteriler</h1>
          <p className="text-gray-600 mt-1">Müşteri listesini yönetin</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Toplam Müşteri</p>
              <p className="text-3xl font-bold text-gray-900">{customers.length}</p>
            </div>
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
              <Mail className="w-6 h-6 text-primary-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Aktif Müşteri</p>
              <p className="text-3xl font-bold text-primary-600">{activeCustomers}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Toplam Sipariş</p>
              <p className="text-3xl font-bold text-gray-900">{totalOrders}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Filter className="w-6 h-6 text-blue-600" />
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
              placeholder="Müşteri ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as 'all' | 'active' | 'inactive')}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">Tümü</option>
            <option value="active">Aktif</option>
            <option value="inactive">Pasif</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th
                  onClick={() => handleSort('name')}
                  className="text-left py-3 px-4 font-semibold text-gray-900 cursor-pointer hover:bg-gray-50 flex items-center gap-1"
                >
                  Ad Soyad
                  {sortField === 'name' && (
                    sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                  )}
                </th>
                <th
                  onClick={() => handleSort('email')}
                  className="text-left py-3 px-4 font-semibold text-gray-900 cursor-pointer hover:bg-gray-50 flex items-center gap-1"
                >
                  E-posta
                  {sortField === 'email' && (
                    sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                  )}
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Telefon</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Konum</th>
                <th
                  onClick={() => handleSort('totalOrders')}
                  className="text-left py-3 px-4 font-semibold text-gray-900 cursor-pointer hover:bg-gray-50 flex items-center gap-1"
                >
                  Sipariş
                  {sortField === 'totalOrders' && (
                    sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                  )}
                </th>
                <th
                  onClick={() => handleSort('totalSpent')}
                  className="text-left py-3 px-4 font-semibold text-gray-900 cursor-pointer hover:bg-gray-50 flex items-center gap-1"
                >
                  Harcanan
                  {sortField === 'totalSpent' && (
                    sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                  )}
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Durum</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-500">
                    {searchTerm || filterStatus !== 'all'
                      ? 'Aradığınız kriterlere uygun müşteri bulunamadı'
                      : 'Henüz müşteri yok'}
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((customer) => (
                  <tr
                    key={customer.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <div className="font-medium text-gray-900">{customer.name}</div>
                      <div className="text-xs text-gray-500">{customer.createdAt}</div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">{customer.email}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">{customer.phone}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      {customer.addresses && customer.addresses.length > 0 ? (
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">{customer.addresses[0].city}</span>
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-medium text-gray-900">{customer.totalOrders}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-bold text-primary-600">
                        ₺{customer.totalSpent.toLocaleString('tr-TR')}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          customer.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {customer.isActive ? 'Aktif' : 'Pasif'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {filteredCustomers.length > 0 && (
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <p>Toplam {filteredCustomers.length} müşteri gösteriliyor</p>
              <p>Toplam harcama: ₺{totalSpent.toLocaleString('tr-TR')}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
