## 🌸 Rate-Limited Sihir Tozu Çiçek Efekti

### 1. MagicDustEffect Bileşeni Oluştur
- Tıklanan pozisyondan başlayarak 5-6 çiçek parçası etrafa dağılacak
- Çiçekler: 🌼🌷🌹🌸💐 (rastgele seçilecek)
- Her parçacık rastgele açıda ve hızda hareket edecek
- 500-600ms içinde küçülüp kaybolacak
- Rate limiting: 3 saniye içinde sadece 1 kez çalışır

### 2. Rate Limiting Sistemi
- Son tıklama zamanını state'de tut
- 3 saniye içinde tekrar tıklanısa atla (hiçbir şey yapma)
- 3 saniye geçmişse efekt çalıştır
- Böylece kullanıcı sistemi kastıramaz

### 3. Global Entegrasyon
- `App.tsx`'e MagicDustEffect ekle
- Custom event ile tıklanan butonları dinle
- Tüm sayfalarda otomatik çalışması sağlanacak

### 4. Butonlara Event Ekle
Şu bileşenlere `magic-dust` event dispatch ekle:
- [ProductCard.tsx](file:///c:/Users/webin/OneDrive/Desktop/çİÇEKÇİ/src/components/ProductCard.tsx) - Sepete ekle ve favori butonları
- [Home.tsx](file:///c:/Users/webin/OneDrive/Desktop/çİÇEKÇİ/src/pages/Home.tsx) - Hero butonları
- [Catalog.tsx](file:///c:/Users/webin/OneDrive/Desktop/çİÇEKÇİ/src/pages/Catalog.tsx) - Sepete ekle butonları
- [Header.tsx](file:///c:/Users/webin/OneDrive/Desktop/çİÇEKÇİ/src/components/Header.tsx) - Sepet butonu

### 5. CSS Animasyonları
- `magic-spread` - Parçacıkların etrafa dağılması
- `fade-out` - Yavaşça kaybolma
- `will-change: transform` - GPU hızlandırma

### Performans Garanti
✅ 3 saniyede maksimum 1 efekt
✅ 30 saniyede maksimum 10 efekt = 60 parçacık
✅ Animasyon bitince DOM'dan silinir
✅ CPU/GPU yükü minimal