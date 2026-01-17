# Cloudflare R2 Setup Guide

## 📦 Cloudflare R2 Bucket Oluşturma

### Adım 1: Cloudflare'da R2 Bucket Oluşturun

1. [Cloudflare Dashboard](https://dash.cloudflare.com) açın
2. **R2** sekmesine gidin (sol menü)
3. **Create bucket** tıklayın
4. Bucket adını girin: `lilyum-flora` (veya istediğiniz isim)
5. **Create bucket** tıklayın

### Adım 2: API Token Oluşturun

1. R2 sekmesinde **Manage R2 API Tokens** tıklayın
2. **Create API Token** tıklayın
3. Token bilgileri not edin:
   - **Account ID**
   - **Access Key ID**
   - **Secret Access Key**

⚠️ **Bu bilgileri güvenli bir yerde saklayın, tekrar gösterilmeyecek!**

### Adım 3: Public URL Ayarlayın (Opsiyonel)

Görselleri herkese açık yapmak için:

1. Bucket'ınıza tıklayın
2. **Settings** sekmesine gidin
3. **Public access**'i etkinleştirin
4. **Custom domain** (opsiyonel) ekleyebilirsiniz

Public URL formatı: `https://<bucket-name>.<account-id>.r2.cloudflarestorage.com`

## 🔧 Proje Konfigürasyonu

### .env Dosyasına Ekle

```env
# Cloudflare R2 Configuration
VITE_R2_ACCOUNT_ID=your_account_id_here
VITE_R2_ACCESS_KEY_ID=your_access_key_id_here
VITE_R2_SECRET_ACCESS_KEY=your_secret_access_key_here
VITE_R2_BUCKET_NAME=lilyum-flora
VITE_R2_PUBLIC_URL=https://lilyum-flora.<account-id>.r2.cloudflarestorage.com
```

### .env.production (Production)

```env
# Production için R2 bucket'ı (farklı olabilir)
VITE_R2_ACCOUNT_ID=production_account_id
VITE_R2_ACCESS_KEY_ID=production_access_key_id
VITE_R2_SECRET_ACCESS_KEY=production_secret_access_key
VITE_R2_BUCKET_NAME=lilyum-flora-prod
VITE_R2_PUBLIC_URL=https://lilyum-flora.<account-id>.r2.cloudflarestorage.com
```

## 📁 Folder Yapısı

R2 bucket'ınızda şu folder'lar kullanılacak:

| Folder | Kullanım | Açıklama |
|---------|-----------|------------|
| `products/` | Ürün görselleri | Tüm ürün görselleri |
| `delivery-`photos/` | Teslimat fotoğrafları | Sipariş teslimat fotoğrafları |
| `media-messages/` | Medya mesajları | Video/audio/resim mesajları |
| `banners/` | Banner görselleri | Hero ve size banner'ları |

## 🚀 Test

### Adım 1: .env'i Güncelleyin

`.env` dosyanıza R2 bilgilerini ekleyin ve dev server'ı restart edin:

```bash
# Terminal'de Ctrl + C ile durdurun
# Sonra tekrar başlatın
npm run dev
```

### Adım 2: Admin Panelinde Test

1. `/admin/products/new` sayfasına gidin
2. Görsel yükleme alanına tıklayın
3. Bir görsel seçin
4. Upload başlamalı ve R2'ye yüklenmeli

### Adım 3: Console'da Kontrol

F12 → Console'da şu log'u görmelisiniz:
```
R2 upload successful: https://...
```

## 🔍 Bucket'a Bakma

### Cloudflare Dashboard'da
R2 sekmesinde bucket'ınıza tıklayın → **Objects** sekmesinde yüklenen dosyaları görebilirsiniz.

### CLI ile (Opsiyonel)
```bash
npm install -g @aws-cli

# AWS CLI yapılandırma
aws configure --profile cloudflare-r2

# Bucket listele
aws s3 ls s3://your-bucket-name --endpoint-url https://<account-id>.r2.cloudflarestorage.com --profile cloudflare-r2

# Dosya listele
aws s3 ls s3://your-bucket-name/products/ --endpoint-url https://<account-id>.r2.cloudflarestorage.com --profile cloudflare-r2
```

## 🐛 Sorun Giderme

### "Access Denied" Hatası

**Sebep:** API token hatalı

**Çözüm:**
1. .env dosyasındaki bilgileri kontrol edin
2. Cloudflare'da token'ı silip yeni token oluşturun
3. .env'i güncelleyip restart edin

### "Bucket Not Found" Hatası

**Sebep:** Bucket adı hatalı veya bucket oluşturulmadı

**Çözüm:**
1. Cloudflare R2'de bucket var mı kontrol edin
2. Bucket adı .env ile aynı mı kontrol edin
3. Bucket adı küçük harf mi kontrol edin

### "CORS Error" Hatası

**Sebep:** Bucket CORS yapılandırması yok

**Çözüm:**
Cloudflare R2 Dashboard → Bucket → Settings → CORS ayarları:

```json
[
  {
    "AllowedOrigins": ["*"],
    "AllowedMethods": ["GET", "HEAD", "PUT", "POST", "DELETE"],
    "AllowedHeaders": ["*"],
    "MaxAgeSeconds": 3600
  }
]
```

## 💰 Maliyet

- R2: Ücretsiz 10GB storage + 1M Class A operations
- Ek: $0.015/GB (storage)
- Ek: $4.50/M Class A operations
- **Genellikle küçük/orta boy projelerde ücretsiz**

## 📞 Yardım

- [Cloudflare R2 Docs](https://developers.cloudflare.com/r2/)
- [AWS S3 SDK Docs](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/)

---
**İyi çalışmalar! ☁️**
