# Supabase Kurulum Rehberi

Bu rehber Lilyum Flora projesi için Supabase database entegrasyonunun nasıl yapılacağını açıklar.

## Adım 1: Supabase Hesabı Oluştur

### 1.1 Kayıt Ol
1. [supabase.com](https://supabase.com/signup) adresine gidin
2. "Start your project" butonuna tıklayın
3. GitHub, Google veya Email ile kayıt olabilirsiniz (GitHub önerilir)
4. Kayıt formunu doldurun ve "Create account" butonuna tıklayın

### 1.2 Yeni Proje Oluştur
1. Dashboard'da "New Project" butonuna tıklayın
2. Aşağıdaki bilgileri girin:

```
Project Name: lilyum-flora
Database Password: [Güçlü bir şifre belirleyin]
Region: [En yakın bölgeyi seçin, örn: Southeast Asia (Singapore)]
Pricing Plan: Free
```

3. "Create new project" butonuna tıklayın
4. Proje oluşturma süreci 1-2 dakika sürebilir

---

## Adım 2: Database Tablolarını Oluştur

### 2.1 SQL Editor'ı Aç
1. Supabase Dashboard'a gidin
2. Sol menüden "SQL Editor" sekmesine tıklayın
3. SQL Editor açılacak

### 2.2 SQL Dosyasını Çalıştır
1. Projenizdeki `supabase/init.sql` dosyasını açın
   - Dosya yolu: `c:\Users\webin\OneDrive\Desktop\çİÇEKÇİ\supabase\init.sql`

2. Dosyanın tüm içeriğini kopyalayın

3. SQL Editor'a yapıştırın

4. "Run" (veya "▶") butonuna tıklayın

5. SQL sorgusu çalıştırılacak ve şu tablolar oluşturulacak:
   - ✅ categories
   - ✅ products
   - ✅ customers
   - ✅ orders
   - ✅ reviews
   - ✅ hero_banners
   - ✅ size_banners
   - ✅ seo_settings

6. Ayrıca sample veriler de eklenecek:
   - ✅ 6 sample kategori
   - ✅ 1 sample hero banner
   - ✅ Default SEO ayarları

---

## Adım 3: API Anahtarlarını Kopyala

### 3.1 API Settings'e Git
1. Supabase Dashboard'da sol menüden "Settings" sekmesine tıklayın
2. Sol menüden "API" sekmesine tıklayın

### 3.2 API Anahtarlarını Kopyala
Aşağıdaki değerleri kopyalayın ve güvenli bir yere saklayın:

#### Project URL
```
https://xxx.supabase.co
```
- Bu URL'i `VITE_SUPABASE_URL` için kullanacaksınız

#### anon Public Key
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```
- Bu key'i `VITE_SUPABASE_ANON_KEY` için kullanacaksınız
- Frontend tarafında kullanılır

#### service_role Secret Key
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```
- Bu key'i `SUPABASE_SERVICE_ROLE_KEY` için kullanacaksınız
- Backend tarafında (server-side) kullanılır
- ⚠️ Bu key çok önemlidir, güvenli tutun!

---

## Adım 4: Vercel Environment Variables'ı Ayarla

### 4.1 Vercel Dashboard'a Git
1. [vercel.com/dashboard](https://vercel.com/dashboard) adresine gidin
2. `lilyum-flora` projesini seçin
3. "Settings" sekmesine tıklayın
4. Sol menüden "Environment Variables" seçeneğini tıklayın

### 4.2 Environment Variables'ı Ekle
Aşağıdaki değişkenleri tek tek ekleyin:

#### 1. VITE_API_URL
```
Name: VITE_API_URL
Value: https://lilyum-flora.vercel.app/api
Environment: Production, Preview, Development
```

#### 2. VITE_SUPABASE_URL
```
Name: VITE_SUPABASE_URL
Value: [Adım 3.2'den kopyaladığınız Project URL]
Environment: Production, Preview, Development
```

#### 3. VITE_SUPABASE_ANON_KEY
```
Name: VITE_SUPABASE_ANON_KEY
Value: [Adım 3.2'den kopyaladığınız anon public key]
Environment: Production, Preview, Development
```

#### 4. SUPABASE_SERVICE_ROLE_KEY
```
Name: SUPABASE_SERVICE_ROLE_KEY
Value: [Adım 3.2'den kopyaladığınız service_role secret key]
Environment: Production, Preview, Development
```

### 4.3 Kaydet ve Redeploy
1. "Save" butonuna tıklayın
2. Vercel otomatik olarak yeni bir deploy başlatacak
3. Deploy tamamlandığında site yeniden build edilecek

---

## Adım 5: Yerel .env Dosyasını Güncelle

### 5.1 .env Dosyasını Aç
Projenizin kök dizinindeki `.env` dosyasını açın:
```
c:\Users\webin\OneDrive\Desktop\çİÇEKÇİ\.env
```

### 5.2 Değerleri Güncelle
Aşağıdaki değerleri Adım 3.2'den kopyaladığınız değerlerle doldurun:

```env
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
```

---

## Adım 6: Veri Gözden Geçirme

### 6.1 Tabloları Kontrol Et
1. Supabase Dashboard'a gidin
2. "Table Editor" sekmesine tıklayın
3. Sol menüde şu tabloları görmelisiniz:
   - ✅ categories
   - ✅ customers
   - ✅ hero_banners
   - ✅ orders
   - ✅ products
   - ✅ reviews
   - ✅ seo_settings
   - ✅ size_banners

### 6.2 Sample Verileri Kontrol Et
1. "categories" tablosuna tıklayın
2. 6 sample kategori görmeniz gerekli:
   - Guller
   - Lilyumlar
   - Orkideler
   - Papatyalar
   - Gerbera
   - Karisik Buketler

3. "hero_banners" tablosuna tıklayın
4. 1 sample banner görmeniz gerekli

### 6.3 RLS Politikalarını Kontrol Et
1. Her tablonun sağ üst köşesinde "RLS" görmelisiniz (aktif ise yeşil)
2. "Authentication" > "Policies" sekmesine tıklayın
3. Tüm tablolarda şu politikaların oluşturulduğunu kontrol edin:
   - ✅ Public read access
   - ✅ Service role full access

---

## Adım 7: Test Et

### 7.1 Yerel Test
Yerel ortamda test etmek için:

```bash
# Yerel development server'ı başlat
npm run dev
```

Tarayıcınızda `http://localhost:5173` adresine gidin ve test edin.

### 7.2 Production Test
Vercel'de deploy tamamlandıktan sonra:

1. [https://lilyum-flora.vercel.app](https://lilyum-flora.vercel.app) adresine gidin
2. Tarayıcı konsolunda hata kontrol edin (F12)
3. API çağrılarının çalıştığını doğrulayın

---

## Hata Giderme

### "Supabase connection failed" Hatası

**Neden:**
- Supabase URL veya API key yanlış

**Çözüm:**
1. `.env` dosyasındaki `VITE_SUPABASE_URL` değerini kontrol edin
2. URL doğru formatta olduğundan emin olun: `https://xxx.supabase.co`
3. API key'in tamamen kopyalandığından emin olun
4. Supabase Dashboard'da API anahtarlarını kontrol edin

### "Permission denied" Hatası

**Neden:**
- RLS (Row Level Security) politikaları doğru ayarlanmamış

**Çözüm:**
1. Supabase Dashboard > Authentication > Policies
2. Tüm tablolarda RLS politikalarını kontrol edin
3. Public read access politikalarının aktif olduğundan emin olun
4. Service role full access politikalarının aktif olduğundan emin olun

### "Table not found" Hatası

**Neden:**
- SQL dosyası çalıştırılmamış

**Çözüm:**
1. SQL Editor'da SQL dosyasını tekrar çalıştırın
2. Tüm tabloların oluşturulduğunu kontrol edin
3. Table Editor'da tabloları kontrol edin

### "Environment variable not set" Hatası

**Neden:**
- Vercel environment variables eklenmemiş

**Çözüm:**
1. Vercel Dashboard > Settings > Environment Variables
2. Tüm değişkenlerin eklendiğini kontrol edin
3. Environment selection'ın doğru olduğundan emin olun (Production, Preview, Development)
4. "Save" butonuna tıklayın
5. Vercel deploy loglarını kontrol edin

---

## Başarılı Kurulum Sonrası

Kurulum başarılı olduğunda:

✅ **Supabase Projesi Aktif**
- Database çalışır durumda
- Tüm tablolar oluşturulmuş
- RLS politikaları aktif
- Sample veriler eklenmiş

✅ **Vercel Deploy Başarılı**
- Frontend deploy edildi
- Environment variables aktif
- API Supabase'e bağlı

✅ **Site Çalışır Durumda**
- Production URL: https://lilyum-flora.vercel.app
- Veri kalıcı olarak saklanıyor
- SQL sorguları çalışabilir
- İlişkisel veri yapısı kullanılabilir

---

## Sonraki Adımlar

Kurulum tamamlandıktan sonra:

1. **Supabase Dashboard'da Veri Yönetimi**
   - Table Editor'da direkt veri ekleyebilir/silebilirsiniz
   - SQL Editor ile complex sorgular çalıştırabilirsiniz
   - Authentication ile kullanıcı yönetimi yapabilirsiniz

2. **Cloudflare R2 Entegrasyonu** (İsteğe Bağlı)
   - Ürün resimleri için R2 bucket kullanabilirsiniz
   - 10GB ücretsiz storage + sınırsız egress

3. **Supabase Auth Kullanımı**
   - Müşteri login/register sistemi
   - Session yönetimi
   - Rol bazlı yetkilendirme

---

## Yardım ve Destek

Sorun yaşarsanız:

1. **Vercel Deploy Logları:**
   ```
   vercel inspect lilyum-flora.vercel.app --logs
   ```

2. **Supabase Logları:**
   - Supabase Dashboard > Logs

3. **Tarayıcı Konsolu:**
   - F12 tuşu ile developer tools'u açın
   - Console sekmesinde hataları kontrol edin

---

## Özet

| Adım | İşlem | Durum |
|-------|---------|--------|
| 1 | Supabase hesabı oluştur | ⏳ Yapılacak |
| 2 | Database tablolarını oluştur | ⏳ Yapılacak |
| 3 | API anahtarlarını kopyala | ⏳ Yapılacak |
| 4 | Vercel environment variables ekle | ⏳ Yapılacak |
| 5 | Yerel .env dosyasını güncelle | ⏳ Yapılacak |
| 6 | Veri gözden geçirme | ⏳ Yapılacak |
| 7 | Test et | ⏳ Yapılacak |

**Tüm adımları tamamladığınızda site tamamen çalışır durumda olacak!** 🎉
