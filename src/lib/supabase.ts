import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://zmdgwnkevqouurseircu.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InptZGd3bmtldnFvdXVyc2VpcmN1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgwNjgzNzEsImV4cCI6MjA4MzY0NDM3MX0.sc0w0lyhf0URIPt8X4oqJCjomy99k8L0qx0zBXRIt6w'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
