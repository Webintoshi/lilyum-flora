# Hızlı Deployment ve Test Kontrol Listesi

## 🚀 Hızlı Deployment (5 dakika)

### 1. GitHub'a Push
```bash
git add .
git commit -m "Production ready - all features completed"
git push origin main
```

### 2. Vercel CLI ile Deployment
```bash
npm i -g vercel
vercel login
vercel --prod
```

### 3. Vercel Dashboard'da Environment Variables Ekle
Dashboard > Project > Settings > Environment Variables:

| Key | Value |
|-----|-------|
| `supabase_url` | `https://zmdgwnkevqouurseircu.supabase.co` |
| `supabase_anon_key` | `.env` dosyanızdan kopyalayın |
| `admin_email` | `.env` dosyanızdan kopyalayın |
| `admin_password` | `.env` dosyanızdan kopyalayın |

## ✅ Deployment Sonrası Test Adımları

### 1. Sayfa Yükleme Testleri (2 dakika)
- [ ] Home sayfası açılıyor: `/`
- [ ] Catalog sayfası açılıyor: `/catalog`
- [ ] Admin login açılıyor: `/admin`
- [ ] Product detail açılıyor: `/product/1`

### 2. Admin Panel Testleri (3 dakika)
- [ ] Admin login çalışıyor (`/admin`)
- [ ] Dashboard veriler yükleniyor
- [ ] Ürün ekleme çalışıyor
- [ ] Ürün düzenleme çalışıyor
- [ ] Ürün silme çalışıyor

### 3. Sipariş Testleri (3 dakika)
- [ ] Sepete ürün ekleme
- [ ] Checkout sayfası açılıyor
- [ ] Sipariş oluşturma
- [ ] OrderHistory sayfası siparişleri gösteriyor
- [ ] OrderTracking sayfası çalışıyor

### 4. Fase 2 Özellik Testleri (5 dakika)

**Gift Finder:**
- [ ] `/gift-finder` sayfası açılıyor
- [ ] Sorular cevaplanıyor
- [ ] Sonuçlar gösteriliyor
- [ ] Sepete ekleme çalışıyor

**Hatırlatma Sistemi:**
- [ ] Profile > Reminders sayfası açılıyor
- [ ] Hatırlatma ekleniyor
- [ ] Takvim görüntüleniyor
- [ ] Hatırlatma siliniyor

**Media Message:**
- [ ] Checkout'ta "Medya Mesaj Ekle" butonu çalışıyor
- [ ] Fotoğraf yükleme başarılı
- [ ] Video yükleme başarılı
- [ ] Ses kaydı çalışıyor

**Teslimat Fotoğraf:**
- [ ] Admin panelinde teslimat fotoğrafı yükleme
- [ ] Fotoğraf preview gösteriliyor
- [ ] Onaylama/Reddetme çalışıyor

**Kargo Takip:**
- [ ] OrderTracking sayfasında takip bilgileri
- [ ] Carrier seçenekleri gösteriliyor
- [ ] Tracking number update çalışıyor

**Ürün Yorumları:**
- [ ] ProductDetail'de yorumlar gösteriliyor
- [ ] Yorum ekleme çalışıyor
- [ ] Yorum silme (admin) çalışıyor
- [ ] Yıldız seçimi çalışıyor

**Stripe Ödeme:**
- [ ] Checkout'ta Stripe seçeneği görünür
- [ ] Stripe test kartı ile ödeme
  - Kart: `4242 4242 4242 4242`
  - Son kullanma: Herhangi bir gelecek tarih
  - CVC: Herhangi 3 haneli sayı
  - Posta kodu: Herhangi 5 haneli sayı

## 🐛 Common Issues ve Çözümler

### Environment Variables Görünmüyor
```bash
vercel env ls
```

### Build Hatası
```bash
npm run build
```

### Database Bağlantı Hatası
Supabase Dashboard > Settings > API'den URL ve Key kontrol edin.

### Storage Bucket Hatası
Supabase Dashboard > Storage'da bucket'ları oluşturun:
```sql
INSERT INTO storage.buckets (id, name, public) 
VALUES ('delivery-photos', 'delivery-photos', false);
```

## 📊 Monitoring URL'leri

- Vercel Dashboard: `https://vercel.com/dashboard`
- Supabase Dashboard: `https://supabase.com/dashboard`
- Stripe Dashboard: `https://dashboard.stripe.com/test/dashboard`

## 🎯 Success Kriterleri

✅ Tüm sayfalar 3 saniyeden kısa sürede yükleniyor  
✅ Admin panelde tüm CRUD işlemleri çalışıyor  
✅ Sipariş oluşturma ve takip çalışıyor  
✅ Fase 2 özellikleri (Gift Finder, Reminders, Media, Delivery Photo, Tracking, Reviews, Stripe) çalışıyor  
✅ Mobil görünümde responsive tasarım çalışıyor  

## 🔄 Redeployment (Gerekirse)

```bash
vercel --prod
```

veya Vercel Dashboard'da "Redeploy" butonuna tıklayın.

---

**İyi çalışmalar! 🌸**
