-- Admin Users table
CREATE TABLE IF NOT EXISTS admin_users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default admin user
-- Password: 06122021Kam.
-- Hashed using bcrypt (this is a placeholder - in production you'd hash properly)
INSERT INTO admin_users (email, password_hash, role)
VALUES (
  'webintoshi@gmail.com',
  '$2b$10$hashed_password_placeholder_replace_with_actual_hash',
  'admin'
) ON CONFLICT (email) DO NOTHING;

-- Enable Row Level Security
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Service role full access for admin operations
CREATE POLICY "Service role full access on admin_users" ON admin_users
  FOR ALL USING (auth.role() = 'service_role');

-- Grant permissions
GRANT SELECT ON admin_users TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON admin_users TO authenticated;
GRANT USAGE, SELECT ON admin_users_id_seq TO anon, authenticated;
