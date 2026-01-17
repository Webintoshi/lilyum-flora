const R2_PUBLIC_URL = import.meta.env.VITE_R2_PUBLIC_URL || ''

console.log('R2 Client başlatılıyor:', {
  hasPublicUrl: !!R2_PUBLIC_URL,
})

export async function uploadToR2(
  file: File,
  folder: string = 'uploads'
): Promise<string> {
  try {
    const isDev = import.meta.env.DEV;
    const apiUrl = isDev ? 'http://localhost:3001/api/r2-upload' : '/api/r2-upload';

    // 1. Get Presigned URL
    console.log('R2 Upload Starting (Presigned Flow)...', { file: file.name, folder });

    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

    // Construct Query Params
    const url = new URL(apiUrl, window.location.origin);
    url.searchParams.append('fileName', fileName);
    url.searchParams.append('fileType', file.type);
    url.searchParams.append('folder', folder);

    const signResponse = await fetch(url.toString());

    if (!signResponse.ok) {
      throw new Error(`Signing Failed: ${await signResponse.text()}`);
    }

    const { signedUrl, publicUrl } = await signResponse.json();
    console.log('🔑 Signed URL Received');

    // 2. Upload to R2 (Directly)
    const uploadResponse = await fetch(signedUrl, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type,
      },
      mode: 'cors'
    });

    if (!uploadResponse.ok) {
      throw new Error(`Upload to R2 Failed: ${uploadResponse.status} ${uploadResponse.statusText}`);
    }

    console.log('✅ R2 Upload Success:', publicUrl);
    return publicUrl;

  } catch (error: any) {
    console.error('R2 upload hatası:', error);
    throw new Error(`R2 upload başarısız: ${error?.message || 'Bilinmeyen hata'}`);
  }
}

export async function deleteFromR2(key: string): Promise<void> {
  console.log('R2 Delete başlıyor:', key)
  try {
    const response = await fetch(`/api/r2-delete?key=${encodeURIComponent(key)}`, {
      method: 'DELETE'
    })

    if (!response.ok) {
      throw new Error('Delete failed')
    }

    console.log('R2 Delete başarılı')
  } catch (error) {
    console.error('R2 Delete hatası:', error)
    // Throwing error might break UI flow if not handled, so maybe just log
    throw error
  }
}

export function getR2PublicUrl(key: string): string {
  return `${R2_PUBLIC_URL}/${key}`
}
