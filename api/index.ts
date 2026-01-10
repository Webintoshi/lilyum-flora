import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL || 'https://zmdgwnkevqouurseircu.supabase.co',
  process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InptZGd3bmtldnFvdXVyc2VpcmN1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgwNjgzNzEsImV4cCI6MjA4MzY0NDM3MX0.sc0w0lyhf0URIPt8X4oqJCjomy99k8L0qx0zBXRIt6w'
)

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  return res.status(200).json({ success: true, message: 'API is working' })
}
