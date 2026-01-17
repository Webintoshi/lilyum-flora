import { uploadToR2 } from './r2'

/**
 * Uploads a file to Cloudflare R2 via Backend API.
 * @param file The file to upload
 * @param folder The folder path in storage (default: 'uploads')
 * @returns Promise resolving to the public download URL
 */
export async function uploadToStorage(
    file: File,
    folder: string = 'uploads'
): Promise<string> {
    try {
        console.log(`Starting R2 upload for ${file.name}...`)

        // 1. Try R2 Upload
        const url = await uploadToR2(file, folder)
        console.log('R2 Upload successful:', url)
        return url

    } catch (error: any) {
        console.error('R2 Storage upload failed, falling back to Base64:', error)

        // 2. Fallback: Convert to Base64 (User wanted R2, but we keep this just in case server is down to prevent crash)
        // If user explicitly hates Base64, we can throw error, but for "resilience" we keep it or maybe throw if strictly R2 requested.
        // User said "sistem şişer", implying they hate Base64 in DB.
        // Let's try to throw error if R2 fails, to force fixing R2, OR warn heavily.
        // Given the anger, better to fail and show "Fix R2" than silently bloat DB?
        // No, user wants it "fixed". If R2 works, it won't bloat. If R2 fails, user sees error.

        throw new Error('R2 Yüklemesi Başarısız: ' + (error.message || 'Sunucu bağlantısı kurulamadı (Port 3001).'))
    }
}
