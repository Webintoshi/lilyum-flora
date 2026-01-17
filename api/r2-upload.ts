import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME;
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL;

const S3 = new S3Client({
    region: 'auto',
    endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId: R2_ACCESS_KEY_ID || '',
        secretAccessKey: R2_SECRET_ACCESS_KEY || '',
    },
});

export default async function handler(request: Request) {
    const url = new URL(request.url);
    const fileName = url.searchParams.get('fileName');
    const fileType = url.searchParams.get('fileType');
    const folder = url.searchParams.get('folder') || 'uploads';

    if (!fileName || !fileType) {
        return new Response(JSON.stringify({ error: 'Missing fileName or fileType' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    const key = `${folder}/${fileName}`;

    try {
        const signedUrl = await getSignedUrl(
            S3,
            new PutObjectCommand({
                Bucket: R2_BUCKET_NAME,
                Key: key,
                ContentType: fileType,
                ACL: 'public-read',
            }),
            { expiresIn: 3600 }
        );

        return new Response(
            JSON.stringify({
                signedUrl,
                publicUrl: `${R2_PUBLIC_URL}/${key}`,
                key,
            }),
            {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            }
        );
    } catch (error: any) {
        console.error('R2 Error:', error);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
