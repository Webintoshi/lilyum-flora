import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface BankAccount {
  id: string;
  bankName: string;
  iban: string;
  accountHolder: string;
}

interface Settings {
  siteName: string
  logo: string | null
  email: string
  phone: string
  address: string
  // Deprecated single fields, keeping for backward compat if needed, but primary is now bankAccounts
  bankName: string
  iban: string
  bankAccounts: BankAccount[]
  freeShippingMin: number
  shippingFee: number
  activePaymentMethods: {
    card: boolean;
    bank: boolean;
    cod: boolean;
  }
}

interface SettingsStore {
  settings: Settings
  fetchSettings: () => Promise<void>
  updateSettings: (newSettings: Partial<Settings>) => Promise<void>
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set, get) => ({
      settings: {
        siteName: 'Lilyum Flora',
        logo: null,
        email: 'info@lilyumflora.com',
        phone: '0545 628 41 52',
        address: 'Karşıyaka Mah. Kıbrıs Cd. No:49A Altınordu/Ordu',
        bankName: '',
        iban: '',
        bankAccounts: [],
        freeShippingMin: 500,
        shippingFee: 29.90,
        activePaymentMethods: {
          card: true,
          bank: true,
          cod: true
        }
      },

      fetchSettings: async () => {
        try {
          const { db } = await import('@/lib/firebase');
          const { collection, limit, query, getDocs } = await import('firebase/firestore');

          const q = query(collection(db, 'seo_settings'), limit(1));
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            const data = querySnapshot.docs[0].data();
            console.log("SettingsStore: Fetched data from Firestore:", data);

            // Backward compatibility: If no bankAccounts but has bankName, create one
            let bankAccounts: BankAccount[] = data.bankAccounts || [];
            if (bankAccounts.length === 0 && data.bankName) {
              bankAccounts.push({
                id: 'default',
                bankName: data.bankName,
                iban: data.iban,
                accountHolder: data.siteTitle || 'Lilyum Flora'
              });
            }

            set({
              settings: {
                siteName: data.siteTitle || 'Lilyum Flora',
                logo: data.logo || null,
                email: data.email || 'info@lilyumflora.com',
                phone: data.phone || '0545 628 41 52',
                address: data.address || 'Karşıyaka Mah. Kıbrıs Cd. No:49A Altınordu/Ordu',
                bankName: data.bankName || '',
                iban: data.iban || '',
                bankAccounts: bankAccounts,
                freeShippingMin: Number(data.freeShippingMin) || 500,
                shippingFee: Number(data.shippingFee) || 29.90,
                activePaymentMethods: {
                  card: data.activePaymentMethods?.card ?? true,
                  bank: data.activePaymentMethods?.bank ?? true,
                  cod: data.activePaymentMethods?.cod ?? true
                }
              }
            })
          }
        } catch (error) {
          console.error('Settings fetch error:', error)
        }
      },

      updateSettings: async (newSettings) => {
        try {
          const { db } = await import('@/lib/firebase');
          const { collection, limit, query, getDocs, updateDoc, addDoc } = await import('firebase/firestore');

          const currentSettings = get().settings;
          const updatedSettings = { ...currentSettings, ...newSettings };

          // Update local state immediately for optimistic UI
          set({ settings: updatedSettings });

          // Update Firestore
          const q = query(collection(db, 'seo_settings'), limit(1));
          const querySnapshot = await getDocs(q);

          const dataToSave = {
            siteTitle: updatedSettings.siteName,
            logo: updatedSettings.logo,
            email: updatedSettings.email,
            phone: updatedSettings.phone,
            address: updatedSettings.address,
            bankName: updatedSettings.bankName, // Keep syncing these for now just in case
            iban: updatedSettings.iban,
            bankAccounts: updatedSettings.bankAccounts,
            freeShippingMin: updatedSettings.freeShippingMin,
            shippingFee: updatedSettings.shippingFee,
            activePaymentMethods: updatedSettings.activePaymentMethods,
            updatedAt: new Date().toISOString()
          };

          if (!querySnapshot.empty) {
            const docRef = querySnapshot.docs[0].ref;
            await updateDoc(docRef, dataToSave);
          } else {
            await addDoc(collection(db, 'seo_settings'), {
              ...dataToSave,
              createdAt: new Date().toISOString()
            });
          }

        } catch (error) {
          console.error('Settings update error:', error);
          // Revert or show error could be handled here
        }
      }
    }),
    {
      name: 'settings-storage',
    }
  )
)
