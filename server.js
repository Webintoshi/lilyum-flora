import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';


// Load environment variables
dotenv.config();

const app = express();
const port = 3001;



app.use(cors());
app.use(express.json());

// R2 Configuration
const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID || process.env.VITE_R2_ACCOUNT_ID;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID || process.env.VITE_R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY || process.env.VITE_R2_SECRET_ACCESS_KEY;
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || process.env.VITE_R2_BUCKET_NAME;
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL || process.env.VITE_R2_PUBLIC_URL;

if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_BUCKET_NAME) {
    console.error('❌ Missing R2 Environment Variables! Please check your .env file.');
}

const S3 = new S3Client({
    region: 'auto',
    endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId: R2_ACCESS_KEY_ID || '',
        secretAccessKey: R2_SECRET_ACCESS_KEY || '',
    },
});

// Debug: Check Credentials on Startup
console.log('🔑 R2 Credentials Check:');
console.log(`- Account ID: ${R2_ACCOUNT_ID?.substring(0, 4)}...`);
console.log(`- Access Key: ${R2_ACCESS_KEY_ID?.substring(0, 4)}...`);
console.log(`- Bucket: ${R2_BUCKET_NAME}`);

import { ListBucketsCommand } from '@aws-sdk/client-s3';

(async () => {
    try {
        console.log('📡 Testing R2 Connection...');
        const data = await S3.send(new ListBucketsCommand({}));
        console.log('✅ R2 Connection Successful! Buckets:', data.Buckets?.map(b => b.Name).join(', '));
    } catch (err) {
        console.error('❌ R2 Connection FAILED on Startup:', err.name, err.message);
        console.error('👉 Please verify your R2_ACCESS_KEY_ID and R2_SECRET_ACCESS_KEY in .env');
    }
})();

// Presigned URL Endpoint (Client Upload)
app.get('/api/r2-upload', async (req, res) => {
    try {
        const { fileName, fileType, folder = 'uploads' } = req.query;

        if (!fileName || !fileType) {
            return res.status(400).json({ error: 'Missing fileName or fileType' });
        }

        const key = `${folder}/${fileName}`;

        console.log(`🔑 Generating Signed URL for: ${key}`);

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

        const publicUrl = `${R2_PUBLIC_URL}/${key}`;

        res.json({
            success: true,
            signedUrl,
            publicUrl,
            key,
        });

    } catch (error) {
        console.error('❌ R2 Signing Error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Delete Endpoint
app.delete('/api/r2-delete', async (req, res) => {
    try {
        const { key } = req.query;

        if (!key) {
            return res.status(400).send('Key parameter is required');
        }

        await S3.send(new DeleteObjectCommand({
            Bucket: R2_BUCKET_NAME,
            Key: String(key),
        }));

        res.json({ success: true });
    } catch (error) {
        console.error('R2 Delete Error:', error);
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`🚀 Backend server running at http://localhost:${port}`);
    console.log(`🔌 Proxy from Vite should be capable of reaching /api endpoints now.`);
});
