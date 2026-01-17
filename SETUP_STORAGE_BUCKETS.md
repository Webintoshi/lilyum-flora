# Supabase Storage Bucket'ları Oluşturma Talimatları

## 🚀 Hızlı Kurulum (5 dakika)

### Adım 1: SQL'i Çalıştırın

1. [Supabase Dashboard](https://supabase.com/dashboard) açın
2. Projenizi seçin
3. **SQL Editor**'a gidin (sol menü)
4. **New Query** tıklayın
5. Aşağıdaki SQL'i kopyalayıp yapıştırın:

```sql
-- Bucket'ları oluştur
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('product-images', 'product-images', true, 10485760, 
        ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('delivery-photos', 'delivery-photos', false, 10485760,
        ARRAY['image/jpeg', 'image/png', 'image/webp'])
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('media-messages', 'media-messages', false, 52428800,
        ARRAY['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'audio/mp3', 'audio/wav'])
ON CONFLICT (id) DO NOTHING;

-- RLS Policies oluştur
CREATE POLICY IF NOT EXISTS "Public Read Product Images"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');

CREATE POLICY IF NOT EXISTS "Authenticated Upload Product Images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'product-images' AND auth.role() = 'authenticated');

CREATE POLICY IF NOT EXISTS "Authenticated Update Product Images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'product-images' AND auth.role() = 'authenticated');

CREATE POLICY IF NOT EXISTS "Authenticated Delete Product Images"
ON storage.objects FOR DELETE
USING (bucket_id = 'product-images' AND auth.role() = 'authenticated');

CREATE POLICY IF NOT EXISTS "Admin Read Delivery Photos"
ON storage.objects FOR SELECT
USING (bucket_id = 'delivery-photos' AND auth.role() = 'authenticated');

CREATE POLICY IF NOT EXISTS "Admin Upload Delivery Photos"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'delivery-photos' AND auth.role() = 'authenticated');

CREATE POLICY IF NOT EXISTS "Admin Update Delivery Photos"
ON storage.objects FOR UPDATE
USING (bucket_id = 'delivery-photos' AND auth.role() = 'authenticated');

CREATE POLICY IF NOT EXISTS "Admin Delete Delivery Photos"
ON storage.objects FOR DELETE
USING (bucket_id = 'delivery-photos' AND auth.role() = 'authenticated');

CREATE POLICY IF NOT EXISTS "Read Own Media Messages"
ON storage.objects FOR SELECT
USING (bucket_id = 'media-messages' AND (auth.uid()::text = (storage.foldername(name))[1] OR auth.role() = 'authenticated'));

CREATE POLICY IF NOT EXISTS "Upload Media Messages"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'media-messages' AND auth.role() = 'authenticated');

CREATE POLICY IF NOT EXISTS "Delete Own Media Messages"
ON storage.objects FOR DELETE
USING (bucket_id = 'media-messages' AND auth.role() = 'authenticated');

-- Bucket'ları kontrol et
SELECT id, name, public FROM storage.buckets;
```

6. **Run** tıklayın (veya `Ctrl + Enter`)

### Adım 2: Bucket'ları Kontrol Edin

SQL çıktısında şunları görmelisiniz:

```
 id               | name              | public
------------------+-------------------+--------
 product-images   | product-images    | t
 delivery-photos  | delivery-photos   | f
 media-messages   | media-messages    | f
```

### Adım 3: Storage Sekmesinden Kontrol

1. Supabase Dashboard'da **Storage** sekmesine gidin
2. 3 bucket'ı görmelisiniz:
   - `product-images` (public)
   - `delivery-photos` (private)
   - `media-messages` (private)

## 🔧 Alternatif: Dashboard'dan Manuel Oluşturma

SQL çalıştırmak istemezseniz:

1. **Storage** sekmesi → **New Bucket**
2. Bucket adını girin: `product-images`
3. **Public bucket** işaretleyin
4. **File size limit**: `10 MB`
5. **Allowed MIME types**: `image/jpeg, image/png, image/webp, image/gif`
6. **Create Bucket** tıklayın

Aynı şekilde diğer bucket'ları oluşturun:
- `delivery-photos` (private, 10MB)
- `media-messages` (private, 50MB, +video/mp4, audio/mp3, audio/wav)

## 🐛 Hata Giderme

### "Bucket not found" hatası

**Çözüm 1:** SQL'i tekrar çalıştırın
```
SELECT id, name FROM storage.buckets;
```

**Çözüm 2:** Bucket'ları dashboard'dan kontrol edin
Storage sekmesine gidin, bucket'lar görünüyor mu?

**Çözüm 3:** Bucket adını kontrol edin
Kodda: `bucket='product-images'`
Supabase'de: Bucket adı aynı mı?

### "Permission denied" hatası

**Çözüm:** RLS policies oluşturun
```sql
DROP POLICY IF EXISTS "Public Read Product Images" ON storage.objects;
CREATE POLICY "Public Read Product Images"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');
```

## ✅ Başarılı Kurulum Kontrolü

SQL'i çalıştırdıktan sonra admin panelinde:

1. `/admin/products/new` sayfasına gidin
2. Görsel yükleme alanına tıklayın
3. Bir görsel seçin
4. Upload başlamalı ve Supabase Storage'a yüklenmeli

## 📞 Sorun Yaşarsanız

1. Supabase'de bucket'lar var mı kontrol edin:
```sql
SELECT * FROM storage.buckets;
```

2. RLS policies var mı kontrol edin:
```sql
SELECT * FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage';
```

3. Console'da hatayı kontrol edin (F12 → Console)

---
**İyi çalışmalar! 🌸**
