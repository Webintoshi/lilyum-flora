/**
 * local server entry file, for local development
 */
import dotenv from 'dotenv'
import path from 'path'

// Load environment variables BEFORE importing app
const envPath = path.resolve(process.cwd(), '.env')
console.log('[SERVER DEBUG] Loading .env from:', envPath)
const result = dotenv.config({ path: envPath })
console.log('[SERVER DEBUG] dotenv config result:', result.error ? 'Error: ' + result.error.message : 'Success')
console.log('[SERVER DEBUG] SUPABASE_URL after load:', process.env.SUPABASE_URL)

import app from './app.js';

/**
 * start server with port
 */
const PORT = process.env.PORT || 3001;

const server = app.listen(PORT, () => {
  console.log(`Server ready on port ${PORT}`);
});

/**
 * close server
 */
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

export default app;