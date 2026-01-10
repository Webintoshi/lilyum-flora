# Vercel Deploy Planı

## 1. Vercel CLI Kurulumu ve Bağlanma
```bash
npm install -g vercel
vercel login
```

## 2. Environment Variables Hazırlama
Vercel dashboard'da eklenecek değişkenler:
- VITE_API_URL (production URL)
- PORT (3001)

## 3. Deploy İşlemi
```bash
vercel --prod
```

## 4. Deploy Sonrası Kontrol
- Production URL'ini test et
- API endpoint'leri kontrol et
- Statik dosyaların yüklenmesini kontrol et

## 5. Domain Ayarı (İsteğe Bağlı)
- Custom domain ekle
- DNS ayarlarını yap

## Not: Şu an mevcut in-memory database ile deploy edilecek.
Supabase ve Cloudflare R2 entegrasyonu deploy sonrası yapılacak.