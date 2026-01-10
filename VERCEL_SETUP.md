# Vercel Environment Variables Setup Guide

Bu rehber Vercel deploy'iniz için gerekli environment variables'ın nasıl ayarlanacağını açıklar.

## Adım 1: Vercel Dashboard'a Git

1. [Vercel Dashboard](https://vercel.com/dashboard) adresine gidin
2. `lilyum-flora` projesini seçin
3. "Settings" sekmesine tıklayın
4. Sol menüden "Environment Variables" seçeneğini tıklayın

---

## Adım 2: Environment Variables'ı Ekleyin

Aşağıdaki değişkenleri tek tek ekleyin:

### 1. VITE_API_URL
```
Key: VITE_API_URL
Value: https://lilyum-flora.vercel.app/api
Environment: Production, Preview, Development
```

### 2. VITE_SUPABASE_URL
```
Key: VITE_SUPABASE_URL
Value: [Supabase Project URL'ini buraya yapıştırın]
Environment: Production, Preview, Development
```

**Supabase Project URL'i nereden alırsınız:**
1. Supabase Dashboard'a gidin
2. Settings > API sekmesine tıklayın
3. "Project URL" değerini kopyalayın
4. Bu URL'i yukarıdaki alana yapıştırın

### 3. VITE_SUPABASE_ANON_KEY
```
Key: VITE_SUPABASE_ANON_KEY
Value: [Supabase anon public key'ini buraya yapıştırın]
Environment: Production, Preview, Development
```

**Supabase Anon Key'i nereden alırsınız:**
1. Supabase Dashboard > Settings > API
2. "anon public" key'i kopyalayın
3. Bu key'i yukarıdaki alana yapıştırın

### 4. SUPABASE_SERVICE_ROLE_KEY
```
Key: SUPABASE_SERVICE_ROLE_KEY
Value: [Supabase service role key'ini buraya yapıştırın]
Environment: Production, Preview, Development
```

**Supabase Service Role Key'i nereden alırsınız:**
1. Supabase Dashboard > Settings > API
2. "service_role" secret key'i kopyalayın
3. Bu key'i yukarıdaki alana yapıştırın

---

## Adım 3: Kaydet ve Redeploy

1. "Save" butonuna tıklayın
2. Vercel otomatik olarak yeni bir deploy başlatacak
3. Deploy tamamlandığında site yeniden build edilecektir

Alternatif olarak manuel redeploy için terminal'de:
```bash
vercel --prod
```

---

## Environment Variables Özeti

| Key | Açıklama | Örnek |
|------|-------------|----------|
| `VITE_API_URL` | API endpoint URL'i | `https://lilyum-flora.vercel.app/api` |
| `VITE_SUPABASE_URL` | Supabase proje URL'i | `https://xxx.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Supabase public key'i | `eyJhbGc...` |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase admin key'i | `eyJhbGc...` |

---

## Önemli Notlar

⚠️ **SUPABASE_SERVICE_ROLE_KEY güvenlik açısından önemlidir:**
- Bu key sadece server-side işlemler için kullanılır
- Frontend'de asla bu key'i kullanmayın
- Bu key ile tüm veriye erişim mümkündür

⚠️ **Environment Selection:**
- Tüm değişkenleri "Production, Preview, Development" ortamlarında seçin
- Bu şekilde hem production hem preview deployment'lerde çalışacaktır

⚠️ **Deploy Süreci:**
- Environment variables değiştiğinde otomatik deploy başlatılır
- Deploy süreci 2-3 dakika sürebilir

---

## Hata Giderme

### "API not found" Hatası
- `VITE_API_URL` değerini kontrol edin
- URL sonunda `/api` olduğundan emin olun

### "Supabase connection failed" Hatası
- `VITE_SUPABASE_URL` değerini kontrol edin
- URL doğru formatta olduğundan emin olun (`https://xxx.supabase.co`)
- Supabase projesinin aktif olduğunu doğrulayın

### "Permission denied" Hatası
- RLS (Row Level Security) politikalarını kontrol edin
- Service role key'in doğru olduğunu doğrulayın

---

## Yardım

Sorun yaşarsanız:
1. Vercel deployment loglarını kontrol edin
2. Supabase dashboard'da API key'leri yenileyin
3. Environment variables'ları silip tekrar ekleyin
