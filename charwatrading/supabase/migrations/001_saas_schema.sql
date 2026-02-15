-- Charwa Trading SaaS Schema Migration
-- Creates tables for multi-user marketplace subscriptions with Stripe billing

-- ============================================================
-- 1. Marketplaces - The 13 subscribable products
-- ============================================================
CREATE TABLE IF NOT EXISTS marketplaces (
    id TEXT PRIMARY KEY, -- matches source_site: 'autoline', 'truck1', etc.
    name TEXT NOT NULL,
    country TEXT,
    logo_url TEXT,
    listing_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    stripe_product_id TEXT,
    stripe_price_id TEXT,
    price_cents INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Seed the 13 European marketplaces
INSERT INTO marketplaces (id, name, country, price_cents) VALUES
    ('autoline', 'Autoline', 'International', 4900),
    ('truck1', 'Truck1', 'Europe', 4900),
    ('truckscout24', 'TruckScout24', 'Germany', 5900),
    ('mobile_de', 'Mobile.de', 'Germany', 5900),
    ('mascus', 'Mascus', 'International', 4900),
    ('europa_truck', 'Europa-Truck', 'Europe', 3900),
    ('kleyntrucks', 'Kleyn Trucks', 'Netherlands', 3900),
    ('bas_trucks', 'BAS Trucks', 'Netherlands', 3900),
    ('tradus', 'Tradus', 'International', 4900),
    ('truck_nl', 'Truck.nl', 'Netherlands', 3900),
    ('commercialmotor', 'Commercial Motor', 'UK', 4900),
    ('otomoto', 'OTOMOTO', 'Poland', 3900),
    ('hasznaltauto', 'Hasznaltauto', 'Hungary', 3900)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- 2. Listings - Synced scraped data from Market Intelligence
-- ============================================================
CREATE TABLE IF NOT EXISTS listings (
    id BIGSERIAL PRIMARY KEY,
    source_site TEXT NOT NULL REFERENCES marketplaces(id),
    source_id TEXT NOT NULL,
    url TEXT,
    title TEXT,
    price_cents INTEGER,
    year INTEGER,
    mileage_km INTEGER,
    power_kw INTEGER,
    brand TEXT,
    model TEXT,
    axle_configuration TEXT,
    euro_standard TEXT,
    transmission TEXT,
    cab_type TEXT,
    location TEXT,
    country_code TEXT,
    company_name TEXT,
    seller_phone TEXT,
    image_url TEXT,
    description TEXT,
    priority INTEGER DEFAULT 0,
    first_seen_at TIMESTAMPTZ DEFAULT now(),
    last_seen_at TIMESTAMPTZ DEFAULT now(),
    synced_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(source_site, source_id)
);

CREATE INDEX IF NOT EXISTS idx_listings_source_site ON listings(source_site);
CREATE INDEX IF NOT EXISTS idx_listings_brand ON listings(brand);
CREATE INDEX IF NOT EXISTS idx_listings_price ON listings(price_cents);
CREATE INDEX IF NOT EXISTS idx_listings_year ON listings(year);
CREATE INDEX IF NOT EXISTS idx_listings_synced ON listings(synced_at);

-- ============================================================
-- 3. User Profiles - Extends Supabase Auth users
-- ============================================================
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    full_name TEXT,
    company_name TEXT,
    phone TEXT,
    stripe_customer_id TEXT,
    subscription_status TEXT DEFAULT 'inactive', -- inactive, active, past_due, canceled
    current_period_end TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_user_profiles_stripe ON user_profiles(stripe_customer_id);

-- ============================================================
-- 4. User Marketplace Subscriptions
-- ============================================================
CREATE TABLE IF NOT EXISTS user_marketplace_subscriptions (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    marketplace_id TEXT NOT NULL REFERENCES marketplaces(id),
    is_active BOOLEAN DEFAULT false,
    stripe_subscription_item_id TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id, marketplace_id)
);

CREATE INDEX IF NOT EXISTS idx_user_subs_user ON user_marketplace_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_subs_active ON user_marketplace_subscriptions(user_id, is_active);

-- ============================================================
-- 5. Row Level Security
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE marketplaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_marketplace_subscriptions ENABLE ROW LEVEL SECURITY;

-- Marketplaces: public read (anyone can see the catalog)
CREATE POLICY "Marketplaces are publicly readable"
    ON marketplaces FOR SELECT
    USING (true);

-- Listings: users only see rows from their subscribed marketplaces
CREATE POLICY "Users see listings from subscribed marketplaces"
    ON listings FOR SELECT
    USING (
        source_site IN (
            SELECT marketplace_id
            FROM user_marketplace_subscriptions
            WHERE user_id = auth.uid()
              AND is_active = true
        )
    );

-- User profiles: users see/edit only their own
CREATE POLICY "Users can view own profile"
    ON user_profiles FOR SELECT
    USING (id = auth.uid());

CREATE POLICY "Users can update own profile"
    ON user_profiles FOR UPDATE
    USING (id = auth.uid())
    WITH CHECK (id = auth.uid());

-- User marketplace subscriptions: users see only their own
CREATE POLICY "Users can view own subscriptions"
    ON user_marketplace_subscriptions FOR SELECT
    USING (user_id = auth.uid());

-- ============================================================
-- 6. Service role policies (for Edge Functions / sync scripts)
-- ============================================================

-- Allow service role to manage all data (bypasses RLS by default,
-- but explicit policies are good practice for documentation)
CREATE POLICY "Service role manages listings"
    ON listings FOR ALL
    USING (auth.role() = 'service_role');

CREATE POLICY "Service role manages user profiles"
    ON user_profiles FOR ALL
    USING (auth.role() = 'service_role');

CREATE POLICY "Service role manages subscriptions"
    ON user_marketplace_subscriptions FOR ALL
    USING (auth.role() = 'service_role');

CREATE POLICY "Service role manages marketplaces"
    ON marketplaces FOR ALL
    USING (auth.role() = 'service_role');

-- ============================================================
-- 7. Auto-create user_profiles on auth.users INSERT
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_profiles (id, email, full_name)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', '')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- 8. Updated_at trigger helper
-- ============================================================
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_user_subs_updated_at
    BEFORE UPDATE ON user_marketplace_subscriptions
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_marketplaces_updated_at
    BEFORE UPDATE ON marketplaces
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
