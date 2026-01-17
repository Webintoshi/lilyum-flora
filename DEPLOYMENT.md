# Vercel Deployment Talimatları

## Ön Koşullar

1. **Vercel Hesabı**: [vercel.com](https://vercel.com) sitesinden ücretsiz hesap oluşturun
2. **GitHub Repository**: Projenizi GitHub'a push edin
3. **Supabase Projesi**: Supabase projenizin URL ve Anon Key değerleri hazır olmalı
4. **Stripe Hesabı** (opsiyonel): Stripe test API anahtarları hazır olmalı

## Environment Değişkenleri

Vercel dashboard'ında aşağıdaki environment değişkenlerini tanımlayın:

| Değişken Adı | Açıklama | Kaynak |
|--------------|-----------|--------|
| `supabase_url` | Supabase proje URL'si | Supabase Dashboard > Settings > API |
| `supabase_anon_key` | Supabase anon key | Supabase Dashboard > Settings > API |
| `admin_email` | Admin e-posta adresi | Proje ayarları |
| `admin_password` | Admin şifresi | Proje ayarları |
| `stripe_public_key` | Stripe publishable key (pk_test_...) | Stripe Dashboard > Developers > API Keys |
| `stripe_secret_key` | Stripe secret key (sk_test_...) | Stripe Dashboard > Developers > API Keys |
| `stripe_webhook_secret` | Stripe webhook secret | Stripe Dashboard > Developers > Webhooks |

## Deployment Adımları

### 1. Repository'yi Vercel'e Bağlama

```bash
# Terminalde Vercel CLI kurulumu
npm i -g vercel

# Vercel'e giriş
vercel login

# Deployment
vercel --prod
```

### 2. Vercel Dashboard'dan Deployment

1. Vercel dashboard'ına gidin
2. "Add New Project" tıklayın
3. GitHub repository'nizi seçin
4. "Framework Preset" olarak "Vite" seçin
5. "Build Command": `npm run build`
6. "Output Directory": `dist`
7. Environment variables'i ekleyin
8. "Deploy" tıklayın

## Database Migration

Supabase'de yeni tablolar oluşturmak için şu SQL dosyalarını çalıştırın:

```sql
-- reminders_table.sql
-- tracking_columns.sql
-- reviews_table.sql
-- stripe_payment_function.sql
```

Bu dosyaları Supabase Dashboard > SQL Editor'da çalıştırabilirsiniz.

## Storage Buckets Oluşturma

Supabase'de şu storage bucket'ları oluşturun:

1. **delivery-photos**: Teslimat fotoğrafları için
2. **media-messages**: Video/audio mesajlar için

Supabase Dashboard > Storage > New Bucket:

```sql
-- Bucket oluşturma SQL
INSERT INTO storage.buckets (id, name, public) 
VALUES ('delivery-photos', 'delivery-photos', false);

INSERT INTO storage.buckets (id, name, public) 
VALUES ('media-messages', 'media-messages', false);
```

Bucket politikaları için:
- Her bucket için RLS (Row Level Security) politikaları tanımlayın
- Admin kullanıcıları için tam erişim, diğerleri için sınırlı erişim

## Stripe Webhook Ayarı

1. Stripe Dashboard > Developers > Webhooks
2. "Add endpoint" tıklayın
3. URL: `https://yourdomain.vercel.app/api/webhook`
4. Events seçin:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
5. Webhook secret'i kopyalayıp Vercel environment değişkenine ekleyin

## Production Kontrol Listesi

- [ ] Environment variables tanımlandı
- [ ] Database migrations çalıştırıldı
- [ ] Storage buckets oluşturuldu
- [ ] RLS politikaları yapılandırıldı
- [ ] Stripe webhook endpoint ayarlandı
- [ ] Build başarılı şekilde deploy edildi
- [ ] Test siparişi yapıldı ve ödeme test edildi
- [ ] Admin panel test edildi
- [ ] SEO meta tag'ları kontrol edildi

## Post-Deployment

### Domain Ayarlama

1. Vercel Dashboard > Settings > Domains
2. Özel domain ekleyin veya Vercel domain'i kullanın
3. DNS kayıtlarını yapılandırın (opsiyonel)

### Monitoring

1. Vercel Analytics'i etkinleştirin
2. Supabase dashboard'da database kullanımını izleyin
3. Stripe dashboard'da ödeme işlemlerini takip edin

## Troubleshooting

### Build Hataları

```bash
# Yerel build test
npm run build
```

### Environment Değişkenleri

```bash
# Vercel CLI ile environment değişken ekleme
vercel env add supabase_url production
vercel env add supabase_anon_key production
```

### Deployment Logları

Vercel dashboard > Deployments > Son deployment > View Logs

## Production Build Komutu

```bash
npm run build
```

Çıktı `dist/` klasöründe olacaktır.

## Önizleme

```bash
npm run preview
```

Production build'i yerel olarak test etmek için kullanılır.
