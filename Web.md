# Web Geliştirme Hata ve Çözüm Notları

Bu dosya, web geliştirme sürecinde karşılaşılan hataları ve çözümlerini takip etmek için kullanılır.

## Hata Notları Şablonu

### Tarih: [Tarih]
- **Hata:** [Hatanın açıklaması]
- **Olay:** Hata nasıl oluştu?
- **Araştırma:** Çözüm için yapılan araştırmalar
- **Çözüm:** Uygulanan çözüm
- **Durum:** [Beklemede / Çözüldü]

---

## Hata Günlüğü

### Tarih: 08.01.2026
- **Hata:** Sepete ekle butonları çalışmıyor
- **Olay:** Ürün kartlarındaki ve tekli ürün sayfasındaki sepete ekle butonlarına tıklandığında hiçbir işlem gerçekleşmiyor
- **Araştırma:** State management kullanılmadığı tespit edildi
- **Çözüm:** Zustand ile cartStore.ts oluşturuldu, addToCart fonksiyonu entegre edildi
- **Durum:** ✅ Çözüldü

---

### Tarih: 08.01.2026
- **Hata:** Ürün kartlarına tıklanınca tekli ürün sayfasına gitmiyor
- **Olay:** Ana sayfadaki ürün kartlarının üzerine tıklandığında hiçbir tepki yok
- **Araştırma:** Ürün kartı görsellerine href bağlantısı eksik
- **Çözüm:** Ürün kartı görsel alanı `<a href="/product/${product.id}">` ile sarmalandı
- **Durum:** ✅ Çözüldü

---

## Notlar
- Her hata karşılaştığında bu dosyaya not alın
- Çözümü bulduktan sonra "Çözüldü" olarak işaretleyin
- Çözümün detaylarını açıklayın, böylece ileride tekrar karşılaşırsanız kolayca çözebilirsiniz