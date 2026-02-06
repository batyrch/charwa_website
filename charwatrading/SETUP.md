# Charwa Trading - Setup Guide

This is a standalone truck marketplace website for charwatrading.com.

## Prerequisites

You need to set up two external services:

### 1. Supabase (Database)

1. Create a free account at [supabase.com](https://supabase.com)
2. Create a new project
3. Go to **SQL Editor** and run this schema:

```sql
CREATE TABLE trucks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'draft' CHECK (status IN ('active', 'sold', 'reserved', 'draft')),

  -- Multilingual content
  title_de TEXT,
  title_en TEXT,
  title_tr TEXT,
  description_de TEXT,
  description_en TEXT,
  description_tr TEXT,

  -- Pricing
  price INTEGER NOT NULL,
  price_type TEXT DEFAULT 'fixed',
  vat_status TEXT DEFAULT 'margin',

  -- Specs
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER NOT NULL,
  mileage INTEGER,
  condition TEXT DEFAULT 'used',

  -- Technical
  engine_power INTEGER,
  emission_class TEXT,
  transmission TEXT,
  cab_type TEXT,
  axle_config TEXT,
  fuel_tank_capacity INTEGER,

  -- Features (JSON array)
  features JSONB DEFAULT '[]',

  -- Media (JSON arrays)
  images JSONB DEFAULT '[]',
  video_url TEXT,

  -- Location
  location_city TEXT,
  location_country TEXT,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  view_count INTEGER DEFAULT 0,
  featured BOOLEAN DEFAULT FALSE
);

-- Indexes for filtering
CREATE INDEX idx_trucks_status ON trucks(status);
CREATE INDEX idx_trucks_brand ON trucks(brand);
CREATE INDEX idx_trucks_price ON trucks(price);
CREATE INDEX idx_trucks_year ON trucks(year);

-- Enable Row Level Security
ALTER TABLE trucks ENABLE ROW LEVEL SECURITY;

-- Public read access for active trucks
CREATE POLICY "Public can view active trucks" ON trucks
  FOR SELECT USING (status = 'active');

-- Public can view any truck by slug (for direct links)
CREATE POLICY "Public can view any truck by slug" ON trucks
  FOR SELECT USING (true);

-- Allow all operations with anon key (for simplicity)
-- In production, use proper auth with service role key for admin
CREATE POLICY "Allow all operations" ON trucks
  FOR ALL USING (true) WITH CHECK (true);
```

4. Go to **Settings > API** and copy:
   - Project URL (e.g., `https://xxxxx.supabase.co`)
   - `anon` public key

### 2. Cloudinary (Image Hosting)

1. Create a free account at [cloudinary.com](https://cloudinary.com)
2. Go to **Settings > Upload**
3. Create an upload preset:
   - Name: `charwa_trucks`
   - Signing Mode: `Unsigned`
   - Folder: `charwa_trucks`
4. Copy your **Cloud Name** from the dashboard

### 3. Configure the Site

Edit `js/config.js` with your credentials:

```javascript
const CONFIG = {
    SUPABASE_URL: 'https://YOUR_PROJECT.supabase.co',
    SUPABASE_ANON_KEY: 'YOUR_ANON_KEY',
    CLOUDINARY_CLOUD_NAME: 'YOUR_CLOUD_NAME',
    CLOUDINARY_UPLOAD_PRESET: 'charwa_trucks',
    // ...
};
```

### 4. Admin Password

Edit `admin/index.html` and change the password:

```javascript
const correctPassword = 'your-secure-password';
```

**Note:** For production, implement proper authentication using Supabase Auth.

## File Structure

```
charwatrading/
├── index.html          # Main listing page
├── truck.html          # Single truck detail page
├── admin/
│   ├── index.html      # Admin login
│   ├── trucks.html     # Admin dashboard
│   └── truck-edit.html # Create/edit form
├── js/
│   ├── config.js       # Configuration
│   ├── api.js          # Supabase API client
│   └── i18n.js         # Translations (DE/EN/TR)
└── SETUP.md            # This file
```

## Deployment

### Option 1: Netlify/Vercel
1. Connect your GitHub repo
2. Set build directory to `charwatrading`
3. Add custom domain: charwatrading.com

### Option 2: Traditional Hosting
1. Upload all files in `charwatrading/` to your web server
2. Configure domain to point to the directory

## Features

- **Public Pages**
  - Truck listing with filters (brand, price, year, mileage, transmission, emission)
  - Sorting (newest, price, mileage, year)
  - Pagination (12 items per page)
  - Shareable filter URLs
  - Detailed truck view with image gallery
  - Video modal (YouTube/Vimeo)
  - WhatsApp/Email/Phone contact buttons
  - Related trucks section

- **Admin Interface**
  - Password-protected access
  - Dashboard with stats
  - Create/edit trucks with:
    - Multilingual content (DE/EN/TR)
    - Drag-drop image upload to Cloudinary
    - Feature checkboxes
    - Status management (draft/active/reserved/sold)
    - Featured listing toggle

- **Internationalization**
  - German (default)
  - English
  - Turkish

## Security Notes

1. The current admin authentication is basic (password in JS). For production:
   - Use Supabase Auth with proper user accounts
   - Implement Row Level Security policies
   - Use service role key server-side only

2. Cloudinary unsigned uploads are convenient but consider:
   - Adding upload size limits
   - Enabling moderation if needed
   - Implementing signed uploads for more control
