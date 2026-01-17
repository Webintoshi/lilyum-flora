# Domain ve DNS Yapılandırması

## Domain Seçenekleri

### 1. Vercel Default Domain (Ücretsiz)
Deployment sonrası Vercel otomatik olarak bir domain sağlar:
- `https://your-project-name.vercel.app`

### 2. Özel Domain (Önerili)
Kendi domain'inizi kullanabilirsiniz:
- `https://www.yourdomain.com`
- `https://cicekci.yourdomain.com`

## Özel Domain Ayarları

### 1. Domain Satın Alma

Popüler domain sağlayıcıları:
- **Namecheap**: namecheap.com
- **GoDaddy**: godaddy.com
- **Google Domains**: domains.google.com
- **Cloudflare Registrar**: cloudflare.com/products/registrar/

### 2. Vercel'de Domain Ekleme

1. Vercel Dashboard > Project > Settings > Domains
2. "Add" tıklayın
3. Domain adınızı girin (örn: `cicekci.com`)
4. "Add" tıklayın

### 3. DNS Kayıtları

Vercel size gerekli DNS kayıtlarını gösterecek. Domain sağlayıcınıza şu kayıtları ekleyin:

#### A Kaydı (Varsa)
```
Type: A
Name: @
Value: 76.76.21.21
TTL: 3600
```

#### CNAME Kaydı (Genellikle kullanılır)
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 3600
```

#### veya CNAME Kaydı (Root domain için)
```
Type: CNAME
Name: @
Value: cname.vercel-dns.com
TTL: 3600
```

### 4. DNS Yayılımı

DNS değişiklikleri yayılması 5 dakika - 48 saat sürebir. Vercel dashboard'da "Valid Configuration" görene kadar bekleyin.

## Domain Sağlayıcı Bazlı Ayarlar

### Namecheap

1. Namecheap Dashboard > Domain List
2. Manage seçin
3. Advanced DNS
4. Add New Record:
   - Type: CNAME
   - Host: www
   - Value: cname.vercel-dns.com
   - TTL: Automatic

### GoDaddy

1. GoDaddy Dashboard > DNS Management
2. Add Record:
   - Type: CNAME
   - Name: www
   - Value: cname.vercel-dns.com
   - TTL: 1 hour

### Cloudflare (En hızlı)

1. Cloudflare Dashboard > DNS
2. Add Record:
   - Type: CNAME
   - Name: www
   - Target: cname.vercel-dns.com
   - Proxy status: Proxied (turuncu bulut)

## SSL Sertifikası

Vercel otomatik olarak SSL sertifikası sağlar:
- Ücretsiz Let's Encrypt SSL
- Otomatik yenileme
- HTTP otomatik HTTPS'e yönlendirme

## Subdomain Kullanımı

Alt domain kullanabilirsiniz:
- `cicekci.yourdomain.com`
- `flowers.yourdomain.com`
- `shop.yourdomain.com`

### Subdomain DNS Ayarı

```
Type: CNAME
Name: cicekci
Value: cname.vercel-dns.com
```

## SEO için Domain Ayarları

### 1. Canonical URL

[SEOSettings](file:///c:/Users/webin/OneDrive/Desktop/çİÇEKÇİ/src/types/index.ts#L131-157) içinde `canonicalUrlPattern`'i güncelleyin:

```typescript
{
  canonicalUrlPattern: 'https://www.cicekci.com'
}
```

### 2. Google Search Console

1. [Google Search Console](https://search.google.com/search-console) açın
2. "Add Property" tıklayın
3. Domain'inizi girin
4. DNS doğrulama yöntemini seçin
5. TXT kaydını ekleyin

### 3. Sitemap Oluşturma

Vercel için otomatik sitemap oluşturabilirsiniz:

```typescript
// src/lib/sitemap.ts
export function generateSitemap(products: Product[]) {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${products.map(p => `
        <url>
          <loc>https://www.cicekci.com/product/${p.id}</loc>
          <lastmod>${p.updatedAt}</lastmod>
          <changefreq>weekly</changefreq>
          <priority>0.8</priority>
        </url>
      `).join('')}
    </urlset>`
  
  return sitemap
}
```

## Redirect Ayarları

### HTTP -> HTTPS
Vercel otomatik yönlendirme yapar.

### www -> Non-www (veya tersi)

[vercel.json](file:///c:/Users/webin/OneDrive/Desktop/çİÇEKÇİ/vercel.json) dosyasına ekleyin:

```json
{
  "redirects": [
    {
      "source": "/:path*",
      "has": [
        {
          "type": "host",
          "value": "cicekci.com"
        }
      ],
      "destination": "https://www.cicekci.com/:path*",
      "permanent": true
    }
  ]
}
```

## CDN ve Caching

Vercel otomatik olarak:
- Global CDN kullanır
- Statik dosyaları cache'ler
- Cache headers yönetir

### Özel Cache Headers (Opsiyonel)

```javascript
// vercel.json
{
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

## Domain Transfer

Var olan bir domain'i başka sağlayıcıya transfer etmek:

1. Domain'i unlock edin (mevcut sağlayıcıda)
2. EPP/Transfer kodunu alın
3. Yeni sağlayıcıda transferi başlatın
4. Transfer onaylayın
5. DNS kayıtlarını güncelleyin

## Monitoring ve Analytics

### 1. Vercel Analytics
Dashboard > Analytics > Enable

### 2. Google Analytics
[adminStore.ts](file:///c:/Users/webin/OneDrive/Desktop/çİÇEKÇİ/src/store/adminStore.ts) içinde `gaId` ekleyin.

### 3. Uptime Monitoring
- UptimeRobot (uptime.com)
- Pingdom (pingdom.com)

## Güvenlik

### 1. DNSSEC (Opsiyonel)
Domain sağlayıcınızda DNSSEC'i etkinleştirin.

### 2. SPF, DKIM, DMARC
E-posta gönderimi için:
- SPF: TXT kaydı ile mail sunucularını tanımlayın
- DKIM: E-posta imzalama
- DMARC: E-posta politikası

## Troubleshooting

### DNS Propagation Gecikmesi
```bash
# DNS sorgusu
nslookup cicekci.com
dig cicekci.com
```

### SSL Sorunları
Vercel Dashboard > Domains > SSL Certificate'i kontrol edin.

### 404 Hataları
- Domain doğru tanımlandı mı?
- DNS kayıtları doğru mu?
- Vercel dashboard'da domain "Valid Configuration" gösteriyor mu?

## Domain Güvenliği

### 1. Domain Privacy
WHOIS bilgilerini gizleyin (çoğu sağlayıcı ücretsiz sağlar).

### 2. Domain Expiry
Domain son kullanma tarihini takip edin. Otomatik yenilemeyi etkinleştirin.

### 3. Domain Hırsızlığı Koruması
Domain'i güvenli bir şekilde tutun:
- Güçlü parolalar
- 2FA etkinleştirme
- Domain kilidi
