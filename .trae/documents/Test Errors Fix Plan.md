# Test Hataları Çözüm Planı

## 1. SEOProvider Invalid Hook Call Hatasını Düzelt
**Dosya:** `src/App.tsx`

- Sorun: `useAdminStore` hook'u SEOProvider içinde `AppContent` fonksiyonu içinde çağrılıyor
- Çözüm: SEOProvider'ı sarmalama, yerine direkt App.tsx içinde seoSettings'i state olarak yönet
- Alternatif: SEOProvider'ı optional props ile güncelle, null iken children render et

## 2. /api/settings 404 Hatalarını Çöz
**Dosyalar:** Tüm dosyalarda /api/settings çağrılarını bul ve kaldır
- `settingsStore.ts` zaten Supabase kullanıyor
- Diğer dosyaları tarayıp `fetch('/api/settings')` çağrılarını bul
- `useSettingsStore` kullanarak verileri Supabase'den al

## 3. Login Fetch Hatasını Çöz
**Dosya:** `src/store/authStore.ts`
- `/api/auth/login` çağrıları hala kodda var (Test 11 hata raporu)
- Supabase `signInWithPassword` kullanmalı
- `fetchCustomerData` fonksiyonu Supabase'den kullanıcı bilgilerini almalı

## 4. /products Route Eksikliği
**Dosya:** `src/App.tsx`
- `/products` route'u yok ama `/catalog` var
- Test raporunda "No routes matched location /products" uyarısı var
- Gerekirse `/products` → `/catalog` redirect ekle

## 5. Tüm Değişiklikleri Test Et
- Local dev server'da testleri manuel doğrula
- Her düzeltme sonrası konsolda hata kontrolü yap