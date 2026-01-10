## Güvenli Web Scraper Botu Entegrasyon Planı

### Backend (API)
1. **Gerekli paketleri yükle:**
   - `cheerio` - HTML parsing
   - `axios` - HTTP istekleri
   - `sharp` - Görsel işleme

2. **API Route:** `api/routes/scrapers.ts`
   - `POST /api/scrapers/analyze` - URL analiz et, ürün elementlerini tespit et
   - `POST /api/scrapers/extract` - Ürünleri çek ve veritabanına kaydet
   - `GET /api/scrapers/history` - Geçmiş çekimleri görüntüle

3. **Scraper Service:** `api/services/scraperService.ts`
   - ✅ User-Agent ve header spoofing (bot tespitini önle)
   - ✅ Akıllı selector algoritması (farklı site yapıları)
   - ✅ Encoding: UTF-8 (Türkçe karakter koruma)
   - ✅ Rate limiting (delay, concurrent limit)
   - ✅ Lazy load görsel desteği (data-src, data-lazy)
   - ✅ Para birimi tespiti ($, €, ₺)
   - ✅ Fiyat parser (1.250,00 ₺, 1,250 TL vb.)
   - ✅ Görsel indir + optimize (hotlinking önle)
   - ✅ Duplicate kontrol (slug/url hash)
   - ✅ Robots.txt kontrolü
   - ✅ Pagination tespiti
   - ✅ Chunk-based processing (memory overflow önle)
   - ✅ Error handling + fallback placeholder
   - ✅ Validation (eksik veri kontrolü)
   - ✅ Progress reporting

### Frontend (Admin Panel)
1. **`src/pages/admin/scrapers/ScraperTool.tsx`** - Ana scraper aracı
   - URL giriş formu
   - "Analiz Et" butonu - siteyi analiz eder
   - Preview gösterimi (çekilecek ürünler listesi)
   - Kategori seçimi (dropdown + "yeni oluştur")
   - Fiyat çarpanı ve para birimi seçimi
   - "Ürünleri Ekle" butonu - onaylanan ürünleri kaydeder
   - Robots.txt uyarısı
   - Progress bar
   - Hata raporu (başarısız ürünler)
   - Telif uyarısı (disclaimer)

2. **AdminLayout.tsx Güncelleme**
   - Navigasyona "Scraper" menü öğesi ekle

3. **Router Güncelleme**
   - `/admin/scrapers` route'u ekle

4. **Types Güncelleme**
   - `ScraperResult`, `AnalyzedProduct`, `ScrapingOptions` arayüzlerini ekle

### Akış
1. Admin panelde Scraper sayfasına gidilir
2. URL girilir, robots.txt kontrolü yapılır
3. "Analiz Et" ile site analiz edilir
4. Preview gösterilir (ürün sayısı, örnek veriler)
5. Kullanıcı kategori seçer, fiyat çarpanı ayarlar
6. Telif uyarısı kabul edilir
7. "Ürünleri Ekle" ile chunk-wise çekim başlar
8. Progress bar gösterilir
9. Hata raporu sunulur
10. Tamamlanan ürünler veritabanına eklenir