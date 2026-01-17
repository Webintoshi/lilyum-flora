import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { db } from '@/lib/firebase'
import { collection, query, orderBy, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore'

export interface Reminder {
  id: string
  title: string
  date: string
  recipient: string
  occasion: string
  notes?: string
  notificationSent: boolean
  createdAt: string
  updatedAt: string
}

interface ReminderStore {
  reminders: Reminder[]
  loading: boolean
  error: string | null

  fetchReminders: () => Promise<void>
  addReminder: (reminder: Omit<Reminder, 'id' | 'createdAt' | 'updatedAt' | 'notificationSent'>) => Promise<void>
  updateReminder: (id: string, reminder: Partial<Reminder>) => Promise<void>
  deleteReminder: (id: string) => Promise<void>
  markAsNotified: (id: string) => Promise<void>
}

export const useReminderStore = create<ReminderStore>()(
  persist(
    (set, get) => ({
      reminders: [],
      loading: false,
      error: null,

      fetchReminders: async () => {
        set({ loading: true, error: null })
        try {
          const q = query(collection(db, 'reminders'), orderBy('date', 'asc'))
          const querySnapshot = await getDocs(q)
          const data: Reminder[] = []
          querySnapshot.forEach(doc => {
            data.push({ id: doc.id, ...doc.data() } as unknown as Reminder)
          })

          set({ reminders: data, loading: false })
        } catch (error) {
          console.error('Fetch reminders error:', error)
          set({ error: 'Reminders yüklenirken hata oluştu', loading: false })
        }
      },

      addReminder: async (reminder) => {
        set({ loading: true, error: null })
        try {
          const newReminder = {
            ...reminder,
            notificationSent: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }

          const docRef = await addDoc(collection(db, 'reminders'), newReminder)

          set({ reminders: [...get().reminders, { id: docRef.id, ...newReminder } as Reminder], loading: false })
        } catch (error) {
          console.error('Add reminder error:', error)
          set({ error: 'Reminder eklenirken hata oluştu', loading: false })
          throw error
        }
      },

      updateReminder: async (id, reminder) => {
        set({ loading: true, error: null })
        try {
          const reminderRef = doc(db, 'reminders', String(id))
          const updateData = {
            ...reminder,
            updatedAt: new Date().toISOString(),
          }
          await updateDoc(reminderRef, updateData)

          set({
            reminders: get().reminders.map((r) => (r.id === id ? { ...r, ...updateData } as Reminder : r)),
            loading: false,
          })
        } catch (error) {
          console.error('Update reminder error:', error)
          set({ error: 'Reminder güncellenirken hata oluştu', loading: false })
          throw error
        }
      },

      deleteReminder: async (id) => {
        set({ loading: true, error: null })
        try {
          await deleteDoc(doc(db, 'reminders', String(id)))

          set({
            reminders: get().reminders.filter((r) => r.id !== id),
            loading: false,
          })
        } catch (error) {
          console.error('Delete reminder error:', error)
          set({ error: 'Reminder silinirken hata oluştu', loading: false })
        }
      },

      markAsNotified: async (id) => {
        try {
          const reminderRef = doc(db, 'reminders', String(id))
          await updateDoc(reminderRef, {
            notificationSent: true,
            updatedAt: new Date().toISOString()
          })

          set({
            reminders: get().reminders.map((r) =>
              r.id === id ? { ...r, notificationSent: true } : r
            ),
          })
        } catch (error) {
          console.error('Mark as notified error:', error)
        }
      },
    }),
    {
      name: 'reminder-storage',
    }
  )
)
