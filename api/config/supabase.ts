import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://zmdgwnkevqouurseircu.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InptZGd3bmtldnFvdXVyc2VpcmN1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgwNjgzNzEsImV4cCI6MjA4MzY0NDM3MX0.sc0w0lyhf0URIPt8X4oqJCjomy99k8L0qx0zBXRIt6w'

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables are not set. Using in-memory data store.')
}

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey)

export const supabaseAdmin = createClient(
  supabaseUrl,
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InptZGd3bmtldnFvdXVyc2VpcmN1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODA2ODM3MSwiZXhwIjoyMDgzNjQ0MzcxfQ._upoy_fsKFIR5UjJriJFH9HdXR7jXJg5Eor7d_93dXw',
  {
    auth: {
      autoRefreshToken: false,
    },
  }
)

export default supabase
