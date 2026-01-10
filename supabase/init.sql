-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  image TEXT,
  icon VARCHAR(50),
  product_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2),
  image TEXT,
  images TEXT[],
  category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
  stock INTEGER DEFAULT 0,
  rating DECIMAL(3,1) DEFAULT 0,
  reviews INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Customers table
CREATE TABLE IF NOT EXISTS customers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  addresses JSONB DEFAULT '[]'::jsonb,
  total_spent DECIMAL(10,2) DEFAULT 0,
  order_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  customer_id INTEGER REFERENCES customers(id) ON DELETE CASCADE,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  total DECIMAL(10,2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  shipping_address JSONB NOT NULL,
  notes TEXT,
  tracking_number VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id SERIAL PRIMARY KEY,
  product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
  customer_id INTEGER REFERENCES customers(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Hero Banners table
CREATE TABLE IF NOT EXISTS hero_banners (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  subtitle TEXT,
  mobile_image TEXT,
  desktop_image TEXT,
  overlay_opacity DECIMAL(3,2) DEFAULT 0.4,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Size Banners table
CREATE TABLE IF NOT EXISTS size_banners (
  id SERIAL PRIMARY KEY,
  subtitle VARCHAR(100),
  title VARCHAR(100) NOT NULL,
  video_url TEXT,
  poster_url TEXT,
  link TEXT,
  is_active BOOLEAN DEFAULT true,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- SEO Settings table
CREATE TABLE IF NOT EXISTS seo_settings (
  id SERIAL PRIMARY KEY,
  site_title VARCHAR(255),
  site_description TEXT,
  keywords TEXT,
  favicon_url TEXT,
  og_title VARCHAR(255),
  og_description TEXT,
  og_image TEXT,
  twitter_card_type VARCHAR(50),
  twitter_title VARCHAR(255),
  twitter_description TEXT,
  twitter_image TEXT,
  gtm_id VARCHAR(50),
  ga_id VARCHAR(50),
  meta_pixel_id VARCHAR(50),
  hotjar_id VARCHAR(50),
  yandex_metrica_id VARCHAR(50),
  custom_head_scripts TEXT,
  custom_body_scripts TEXT,
  robots_txt TEXT,
  canonical_url_pattern TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default SEO settings
INSERT INTO seo_settings (site_title, site_description, keywords, updated_at)
VALUES (
  'Lilyum Flora - Taze Cicek Siparisi',
  'Sevdiklerinize en taze cicekleri gonderin. 60 dakikada teslimat, %50''ye varan indirimler.',
  'cicek, cicek siparisi, guller, orkideler, lilyumlar, hediye cicek',
  NOW()
) ON CONFLICT DO NOTHING;

-- Insert sample categories
INSERT INTO categories (name, slug, description, icon, product_count, is_active) VALUES
  ('Guller', 'guller', 'Taze ve kaliteli guller', '🌹', 0, true),
  ('Lilyumlar', 'lilyumlar', 'Zarif lilyum cicekleri', '🌷', 0, true),
  ('Orkideler', 'orkideler', 'Uzun omurlu orkideler', '🪻', 0, true),
  ('Papatyalar', 'papatyalar', 'Narin papatya cicekleri', '🌸', 0, true),
  ('Gerbera', 'gerbera', 'Canli gerbera cicekleri', '🌼', 0, true),
  ('Karisik Buketler', 'karisik', 'Karisik cicek buketleri', '💐', 0, true)
ON CONFLICT DO NOTHING;

-- Insert sample hero banner
INSERT INTO hero_banners (title, subtitle, mobile_image, desktop_image, is_active) VALUES
  ('Taze Ciceklerle Unutulmaz Anilar',
  'Sevdiklerinize taze ve ozenle hazirlanmis cicek aranjmanlari gonderin.',
  'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=1920&q=80&auto=format&fit=crop',
  true
) ON CONFLICT DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured);
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);
CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON reviews(product_id);

-- Enable Row Level Security
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero_banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE size_banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_settings ENABLE ROW LEVEL SECURITY;

-- Public read access for all tables
CREATE POLICY "Public read access for categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Public read access for products" ON products FOR SELECT USING (true);
CREATE POLICY "Public read access for customers" ON customers FOR SELECT USING (true);
CREATE POLICY "Public read access for orders" ON orders FOR SELECT USING (true);
CREATE POLICY "Public read access for reviews" ON reviews FOR SELECT USING (true);
CREATE POLICY "Public read access for hero_banners" ON hero_banners FOR SELECT USING (true);
CREATE POLICY "Public read access for size_banners" ON size_banners FOR SELECT USING (true);
CREATE POLICY "Public read access for seo_settings" ON seo_settings FOR SELECT USING (true);

-- Service role full access for admin operations
CREATE POLICY "Service role full access" ON categories FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access" ON products FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access" ON customers FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access" ON orders FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access" ON reviews FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access" ON hero_banners FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access" ON size_banners FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access" ON seo_settings FOR ALL USING (auth.role() = 'service_role');

-- Grant permissions to anon and authenticated roles
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
