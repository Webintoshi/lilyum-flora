import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { supabase } from '@/lib/supabase'

interface Settings {
  siteName: string
  logo: string | null
}

interface SettingsStore {
  settings: Settings
  fetchSettings: () => Promise<void>
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set, get) => ({
      settings: {
        siteName: 'Lilyum Flora',
        logo: null,
      },
      
      fetchSettings: async () => {
        try {
          const { data, error } = await supabase
            .from('seo_settings')
            .select('site_title, favicon_url')
            .limit(1)
            .single()
          
          if (error) throw error
          if (data) {
            set({ 
              settings: {
                siteName: data.site_title || 'Lilyum Flora',
                logo: data.favicon_url || null,
              }
            })
          }
        } catch (error) {
          console.error('Settings fetch error:', error)
        }
      },
    }),
    {
      name: 'settings-storage',
    }
  )
)
