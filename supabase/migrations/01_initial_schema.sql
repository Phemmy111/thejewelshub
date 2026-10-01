-- ==========================================
-- THE JEWELLER'S HUB - INITIAL SCHEMA & SEED
-- ==========================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- 2. TABLES
-- ==========================================

-- Admins
CREATE TABLE public.admins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL DEFAULT 'editor',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Categories
CREATE TABLE public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    parent_id UUID REFERENCES public.categories(id),
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Products
CREATE TABLE public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID REFERENCES public.categories(id),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    price_kobo BIGINT NOT NULL, -- Money stored in kobo (NGN * 100)
    compare_at_price_kobo BIGINT,
    stock_quantity INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    is_featured BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Product Media
CREATE TABLE public.product_media (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    alt_text TEXT,
    is_primary BOOLEAN NOT NULL DEFAULT false,
    display_order INTEGER NOT NULL DEFAULT 0
);

-- Customers (Linked to Clerk Auth via id eventually, but we store minimal profile here)
CREATE TABLE public.customers (
    id TEXT PRIMARY KEY, -- Clerk User ID
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    phone TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Orders
CREATE TABLE public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id TEXT REFERENCES public.customers(id),
    status TEXT NOT NULL DEFAULT 'pending', -- pending, paid, shipped, delivered, cancelled
    total_amount_kobo BIGINT NOT NULL,
    delivery_fee_kobo BIGINT NOT NULL DEFAULT 0,
    payment_reference TEXT UNIQUE,
    customer_email TEXT NOT NULL,
    shipping_address JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Order Items
CREATE TABLE public.order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id),
    quantity INTEGER NOT NULL,
    unit_price_kobo BIGINT NOT NULL,
    product_name TEXT NOT NULL
);

-- Hero Slides (for Phase 4 CMS)
CREATE TABLE public.hero_slides (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    media_url TEXT NOT NULL,
    is_video BOOLEAN NOT NULL DEFAULT false,
    eyebrow TEXT,
    headline TEXT NOT NULL,
    subheadline TEXT,
    cta_label TEXT,
    cta_url TEXT,
    display_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true
);

-- Settings (Store global configs)
CREATE TABLE public.settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ==========================================
-- 3. ROW LEVEL SECURITY (RLS)
-- ==========================================

-- Enable RLS on all tables
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hero_slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Public Read Policies (Anyone can read active products, categories, media, slides, settings)
CREATE POLICY "Public can view active categories" ON public.categories FOR SELECT USING (active = true);
CREATE POLICY "Public can view active products" ON public.products FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view product media" ON public.product_media FOR SELECT USING (true);
CREATE POLICY "Public can view active hero slides" ON public.hero_slides FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view settings" ON public.settings FOR SELECT USING (true);

-- Admin Bypass (Service Role key bypasses all RLS automatically, so backend API routes handle writes securely)


-- ==========================================
-- 4. STORAGE BUCKETS
-- ==========================================
INSERT INTO storage.buckets (id, name, public) 
VALUES ('product-media', 'product-media', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('hero-slides', 'hero-slides', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id IN ('product-media', 'hero-slides'));


-- ==========================================
-- 5. SEED DATA (Placeholder Items)
-- ==========================================

-- Insert Super Admin (Replace with your actual email)
INSERT INTO public.admins (email, role) VALUES ('admin@thejewelshub.com', 'super_admin') ON CONFLICT DO NOTHING;

-- Insert Categories
INSERT INTO public.categories (id, name, slug, description) VALUES 
('10000000-0000-0000-0000-000000000001', 'Accessories', 'accessories', 'Premium accessories including watches and sunglasses.'),
('10000000-0000-0000-0000-000000000002', 'Jewels', 'jewels', 'Exquisite jewellery for every occasion.');

-- Insert Sub-Categories
INSERT INTO public.categories (id, name, slug, parent_id) VALUES 
('10000000-0000-0000-0000-000000000011', 'Watches', 'watches', '10000000-0000-0000-0000-000000000001'),
('10000000-0000-0000-0000-000000000012', 'Sunglasses', 'sunglasses', '10000000-0000-0000-0000-000000000001'),
('10000000-0000-0000-0000-000000000021', 'Rings', 'rings', '10000000-0000-0000-0000-000000000002'),
('10000000-0000-0000-0000-000000000022', 'Necklaces', 'necklaces', '10000000-0000-0000-0000-000000000002');

-- Insert Sample Products (Prices in Kobo, e.g., 2500000 = 25,000 NGN)
INSERT INTO public.products (id, category_id, name, slug, description, price_kobo, stock_quantity, is_featured) VALUES 
('20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000011', 'Gold Classic Chronograph', 'gold-classic-chronograph', 'A timeless gold wristwatch for the elegant man.', 4500000, 10, true),
('20000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000021', 'Diamond Promise Ring', 'diamond-promise-ring', 'Exquisite 18k gold plated ring with cubic zirconia.', 1500000, 20, true),
('20000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000022', 'Pearl Drop Necklace', 'pearl-drop-necklace', 'Minimalist pearl necklace on a gold chain.', 1250000, 15, true);

-- Note: In Phase 4, you will upload real images and products via the admin dashboard.
