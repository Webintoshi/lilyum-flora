
import { R2 } from '../src/lib/cloudflare';

export const config = {
    runtime: 'edge',
};

export default async function handler(request: Request) {
    if (request.method !== 'DELETE') {
        return new Response('Method not allowed', { status: 405 });
    }

    const url = new URL(request.url);
    const key = url.searchParams.get('key');

    if (!key) {
        return new Response('Key parameter is required', { status: 400 });
    }

    try {
        // Note: To truly delete from R2 using just fetch/API, we need S3 compatible SDK or Worker approach.
        // The previous upload implementation used a presigned URL approach. 
        // Deleting via presigned URL is also possible but often simpler with SDK serverside.
        // Since we are in a Vercel function (Node or Edge), we can use AWS SDK v3.

        // However, to keep it consistent with the upload flow which relies on credentials in env, 
        // we should use the same SDK or method. 
        // The upload flow in r2-upload.ts (which we haven't seen fully but assume exists) likely uses S3Client.

        // For now, let's return a "Not Implemented" or try to use S3Client if we can import it.
        // Checking package.json, we saw @aws-sdk/client-s3.

        const { S3Client, DeleteObjectCommand } = await import('@aws-sdk/client-s3');

        const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
        const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
        const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
        const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME;

        const S3 = new S3Client({
            region: 'auto',
            endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
            credentials: {
                accessKeyId: R2_ACCESS_KEY_ID || '',
                secretAccessKey: R2_SECRET_ACCESS_KEY || '',
            },
        });

        await S3.send(new DeleteObjectCommand({
            Bucket: R2_BUCKET_NAME,
            Key: key,
        }));

        return new Response(JSON.stringify({ success: true }), {
            headers: { 'content-type': 'application/json' },
        });
    } catch (error: any) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { 'content-type': 'application/json' } });
    }
}
