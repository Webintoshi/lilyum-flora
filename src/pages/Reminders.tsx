import { useState, useEffect } from 'react'
import { Plus, Bell, Calendar, MapPin, User, Trash2, Edit2, X, Check, ChevronRight, ChevronLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useReminderStore } from '@/store/reminderStore'
import type { Reminder } from '@/store/reminderStore'

export default function Reminders() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuthStore()
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [showModal, setShowModal] = useState(false)
  const [editingReminder, setEditingReminder] = useState<Reminder | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    recipient: '',
    occasion: '',
    notes: '',
  })

  const { reminders, loading, fetchReminders, addReminder, updateReminder, deleteReminder } = useReminderStore()

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
    }
  }, [isAuthenticated, navigate])

  useEffect(() => {
    if (isAuthenticated) {
      fetchReminders()
    }
  }, [isAuthenticated, fetchReminders])

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay()
  }

  const getRemindersForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0]
    return reminders.filter((r) => r.date === dateStr)
  }

  const handlePreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))
  }

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))
  }

  const handleAddReminder = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingReminder) {
        await updateReminder(editingReminder.id, formData)
      } else {
        await addReminder(formData)
      }
      setShowModal(false)
      setEditingReminder(null)
      setFormData({ title: '', date: '', recipient: '', occasion: '', notes: '' })
    } catch (error) {
      console.error('Add reminder error:', error)
    }
  }

  const handleEditReminder = (reminder: Reminder) => {
    setEditingReminder(reminder)
    setFormData({
      title: reminder.title,
      date: reminder.date,
      recipient: reminder.recipient,
      occasion: reminder.occasion,
      notes: reminder.notes || '',
    })
    setShowModal(true)
  }

  const handleDeleteReminder = async (id: string) => {
    if (confirm('Bu hatırlatıcıyı silmek istediğinize emin misiniz?')) {
      await deleteReminder(id)
    }
  }

  const handleQuickAdd = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0]
    setFormData({
      title: '',
      date: dateStr,
      recipient: '',
      occasion: '',
      notes: '',
    })
    setShowModal(true)
  }

  if (!isAuthenticated) return null

  const occasions = [
    'Doğum Günü',
    'Yıldönümü',
    'Sevgililer Günü',
    'Anneler Günü',
    'Babalar Günü',
    'Düğün/Nişan',
    'Özel Gün',
    'Diğer',
  ]

  const year = currentMonth.getFullYear()
  const month = currentMonth.getMonth()
  const daysInMonth = getDaysInMonth(year, month)
  const firstDay = getFirstDayOfMonth(year, month)
  const monthNames = [
    'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
    'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <Header />

      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-600/20">
              <Bell className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Hatırlatıcılar</h1>
              <p className="text-gray-600">Özel günleri asla unutmayın</p>
            </div>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="px-6 py-3 bg-gradient-to-r from-primary-600 to-emerald-600 text-white font-bold rounded-full hover:shadow-xl transition-all duration-300 hover:scale-105 shadow-lg shadow-primary-600/20"
          >
            <Plus className="w-5 h-5 mr-2" />
            Yeni Hatırlatıcı
          </button>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={handlePreviousMonth}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-bold text-gray-900">
              {monthNames[month]} {year}
            </h2>
            <button
              onClick={handleNextMonth}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-2 mb-4">
            {['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'].map((day) => (
              <div key={day} className="text-center font-semibold text-gray-500 text-sm py-2">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: (firstDay + 6) % 7 }).map((_, i) => (
              <div key={`empty-${i}`} className="aspect-square" />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const date = new Date(year, month, i + 1)
              const dateStr = date.toISOString().split('T')[0]
              const dayReminders = getRemindersForDate(date)
              const isToday = new Date().toISOString().split('T')[0] === dateStr

              return (
                <div
                  key={i}
                  onClick={() => handleQuickAdd(date)}
                  className={`aspect-square rounded-xl border-2 p-1 cursor-pointer transition-all duration-300 hover:shadow-md ${isToday
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-100 hover:border-primary-300'
                    }`}
                >
                  <div className={`text-sm font-semibold mb-1 ${isToday ? 'text-primary-700' : 'text-gray-700'}`}>
                    {i + 1}
                  </div>
                  <div className="space-y-1">
                    {dayReminders.slice(0, 2).map((reminder) => (
                      <div
                        key={reminder.id}
                        onClick={(e) => {
                          e.stopPropagation()
                          handleEditReminder(reminder)
                        }}
                        className="text-xs bg-gradient-to-r from-primary-500 to-emerald-500 text-white px-1.5 py-0.5 rounded truncate shadow-sm"
                      >
                        {reminder.title}
                      </div>
                    ))}
                    {dayReminders.length > 2 && (
                      <div className="text-xs text-primary-600 font-semibold px-1">
                        +{dayReminders.length - 2} daha
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Yaklaşan Hatırlatıcılar</h3>
          {reminders.length === 0 ? (
            <div className="text-center py-12">
              <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">Henüz hatırlatıcınız yok</p>
              <button
                onClick={() => setShowModal(true)}
                className="mt-4 px-6 py-3 bg-gradient-to-r from-primary-600 to-emerald-600 text-white font-bold rounded-full hover:shadow-xl transition-all duration-300 hover:scale-105 shadow-lg shadow-primary-600/20"
              >
                İlk Hatırlatıcıyı Ekle
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {reminders
                .filter((r) => new Date(r.date) >= new Date())
                .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                .slice(0, 5)
                .map((reminder) => {
                  const reminderDate = new Date(reminder.date)
                  const daysUntil = Math.ceil((reminderDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))

                  return (
                    <div
                      key={reminder.id}
                      className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl hover:border-primary-300 transition-colors bg-gray-50/50 hover:bg-white"
                    >
                      <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                        <Calendar className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-gray-900 truncate">{reminder.title}</h4>
                        <p className="text-sm text-gray-600 flex items-center gap-2 mt-0.5">
                          <User className="w-4 h-4" />
                          {reminder.recipient}
                          <span className="mx-2 text-gray-300">•</span>
                          <MapPin className="w-4 h-4" />
                          {reminder.occasion}
                        </p>
                        <p className="text-xs text-primary-600 font-semibold mt-1">
                          {daysUntil === 0 ? 'Bugün!' : daysUntil === 1 ? 'Yarın!' : `${daysUntil} gün kaldı`}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditReminder(reminder)}
                          className="p-2 hover:bg-white rounded-lg transition-colors text-gray-500 hover:text-primary-600 border border-transparent hover:border-gray-200"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteReminder(reminder.id)}
                          className="p-2 hover:bg-white rounded-lg transition-colors text-gray-500 hover:text-red-600 border border-transparent hover:border-gray-200"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )
                })}
            </div>
          )}
        </div>
      </main>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto animate-fade-in-up">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">
                {editingReminder ? 'Hatırlatıcı Düzenle' : 'Yeni Hatırlatıcı'}
              </h3>
              <button
                onClick={() => {
                  setShowModal(false)
                  setEditingReminder(null)
                  setFormData({ title: '', date: '', recipient: '', occasion: '', notes: '' })
                }}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleAddReminder} className="space-y-6">
              <div>
                <label className="block font-semibold text-gray-900 mb-2">Başlık</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  placeholder="Örn: Annemin Doğum Günü"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all duration-300"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-900 mb-2">Tarih</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all duration-300"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-900 mb-2">Kime</label>
                <input
                  type="text"
                  value={formData.recipient}
                  onChange={(e) => setFormData({ ...formData, recipient: e.target.value })}
                  required
                  placeholder="Örn: Annem"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all duration-300"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-900 mb-2">Özel Gün</label>
                <select
                  value={formData.occasion}
                  onChange={(e) => setFormData({ ...formData, occasion: e.target.value })}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all duration-300"
                >
                  <option value="">Seçin...</option>
                  {occasions.map((occasion) => (
                    <option key={occasion} value={occasion}>
                      {occasion}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-900 mb-2">Notlar (İsteğe Bağlı)</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Ek bilgiler..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all duration-300 resize-none"
                  rows={3}
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false)
                    setEditingReminder(null)
                    setFormData({ title: '', date: '', recipient: '', occasion: '', notes: '' })
                  }}
                  className="flex-1 px-6 py-4 bg-gray-100 text-gray-700 font-bold rounded-full hover:bg-gray-200 transition-all duration-300"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-4 bg-gradient-to-r from-primary-600 to-emerald-600 text-white font-bold rounded-full hover:shadow-xl transition-all duration-300 hover:scale-105 shadow-lg shadow-primary-600/20"
                >
                  {editingReminder ? 'Güncelle' : 'Ekle'}
                  <Check className="w-5 h-5 ml-2" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}
