## 🎯 Plan: Presigned URL ile R2 Upload

### 1. Environment Variables Güncelleme (.env)
```env
# R2 Token bilgilerini güncelle
R2_ACCOUNT_ID=6072b3e50ada6e75c9a73cd3ff584644
R2_ACCESS_KEY_ID=c226aa45cc6c9ab1b310b39f23207e46
R2_SECRET_ACCESS_KEY=eb2f046290c2bfe443a2463b6bc7b21219818992ae7b6d27fd5268d4994d36ab
R2_BUCKET_NAME=cicekci-lilyum
R2_PUBLIC_URL=https://lilyumflora.net
```

### 2. Backend API Geliştirme (api/r2-upload.ts)
- Node.js `crypto` modülü ile presigned URL oluştur
- EU endpoint kullan: `https://6072b3e50ada6e75c9a73cd3ff584644.r2.cloudflarestorage.com`
- GET `/api/r2-upload?fileName=...&fileType=...&folder=...`
- Return: `{ signedUrl, publicUrl }`

### 3. Frontend R2 Library Basitleştirme (src/lib/r2.ts)
- Sadece `/api/r2-upload` çağır
- Presigned URL'yi al
- Doğrudan R2'ye upload
- Client-side API key gerekmez (güvenli)

### 4. Test
- Admin panelde görsel yükleme test
- Console log kontrolü
- Hata varsa debug

**Avantajlar:**
✅ API key sunucuda kalır (güvenli)
✅ CORS problemsiz (sunucu handles eder)
✅ EU jurisdiction uyumlu
✅ Manuel yükleme ile aynı mantık