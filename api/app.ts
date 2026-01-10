/**
 * API Routes - Simplified for Vercel static hosting
 * This file is kept for compatibility but routes are not used
 */

export default {
  handler: () => {
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'API deprecated - using Supabase client-side' })
    }
  }
}
