# Test Hataları Çözüm Planı

## 1. AuthStore.ts - Supabase Authentication'a Geçiş
**Dosya:** `src/store/authStore.ts`

- `/api/auth/login` ve `/api/auth/register` API çağrılarını kaldır
- Supabase `signInWithPassword` ve `signUp` metodlarını kullan
- Token yönetimini Supabase session ile güncelle
- `fetchUser` fonksiyonu ekleyerek kullanıcı bilgilerini Supabase'den al

## 2. SEOContext.tsx Hook Yapısını İyileştirme
**Dosya:** `src/context/SEOContext.tsx`

- SEOProvider bileşeninin hook yapısını kontrol et
- adminStore seoSettings verisi yüklenmeden bileşen render olmamasını önle
- seoSettings null iken graceful handling ekle
- Gerekirse SEOProvider'ı Conditional rendering ile sarmala

## 3. Vercel Routing Konfigürasyonunu Doğrula
**Dosya:** `vercel.json`

- Mevcut `rewrites` konfigürasyonunun doğru çalıştığını doğrula
- `/admin` ve `/catalog` rotaları için özel kural ekle (varsa)
- Deployment sonrası tüm nested routes'ın çalıştığını test et

## 4. /api/settings Çağrılarını Temizle
**Dosyalar:** Tüm dosyaları tara
- `/api/settings` endpoint'ini çağıran kodları bul ve kaldır
- `settingsStore.ts` zaten Supabase kullanıyor, diğer dosyaları kontrol et
- `fetchSettings` fonksiyonunu kullanarak güncelle

## 5. Yerel Test ve Deployment
- Tüm değişiklikleri GitHub'a push et
- Vercel deployment'ını bekle ve doğrula
- Tüm rotaları test et (/, /admin, /catalog, /login, /register, vb.)
- Test suite'i tekrar çalıştır