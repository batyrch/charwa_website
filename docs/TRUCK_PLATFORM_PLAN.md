# CHARWA Trader Portal (Truck Listings)

## What This Is

**Internal B2B portal** for registered truck traders to browse CHARWA's latest truck inventory. Replaces the current WhatsApp broadcast workflow.

**NOT a public marketplace** - only registered traders with customer IDs can access.

---

## Current Workflow (WhatsApp)
1. CHARWA finds trucks
2. CHARWA posts photos/details to WhatsApp groups
3. Traders see posts, contact CHARWA if interested
4. CHARWA facilitates the deal

## New Workflow (Portal)
1. CHARWA adds trucks to portal (admin interface)
2. Traders log in with their customer ID
3. Traders browse listings, click "Contact" → WhatsApp/call
4. CHARWA tracks which traders inquired about which trucks

---

## Architecture

```
TRADER FLOW:
/portal/login.html  →  /portal/trucks.html  →  WhatsApp/Call
(customer ID)           (browse listings)       (contact CHARWA)

ADMIN FLOW:
/admin/login.html   →  /admin/trucks.html
(password)              (add/edit/remove listings)
```

**Tech Stack:**
- **Database**: Supabase (PostgreSQL) - handles 200+ listings, built-in auth
- **Storage**: Supabase Storage (images) - one vendor instead of two
- **Frontend**: Static HTML/JS (matches existing site)
- **Hosting**: GitHub Pages (existing)

---

## MVP Features (Phase 1)

### For Traders
- Login with customer ID (from existing registration system)
- Simple listing grid showing all available trucks
- Detail view: photos, price, specs, "Contact CHARWA" button
- Status badges: Available / Reserved / Sold

### For Admins
- Password-protected admin area
- Add new truck listing with photos
- Edit/remove listings
- Quick status toggle (Available/Reserved/Sold)

---

## Simplified Data Model

Only essential fields for MVP:

```sql
CREATE TABLE trucks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Basic info
  title TEXT NOT NULL,           -- "DAF XF 480 FT Space Cab"
  brand TEXT NOT NULL,           -- "DAF"
  model TEXT NOT NULL,           -- "XF 480"
  year INTEGER NOT NULL,         -- 2022
  price INTEGER NOT NULL,        -- 85000 (EUR)
  mileage INTEGER,               -- 450000 (km)

  -- Description (single language - German)
  description TEXT,

  -- Media
  images JSONB DEFAULT '[]',     -- Array of Supabase Storage URLs

  -- Status
  status TEXT DEFAULT 'available'
    CHECK (status IN ('available', 'reserved', 'sold')),

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**What we're NOT doing (too complex for MVP):**
- ~~Multilingual fields (DE/EN/TR)~~ - Traders are multilingual
- ~~Complex specs (emission, cab type, axle)~~ - Put in description
- ~~Feature checkboxes~~ - Put in description
- ~~Video support~~ - YouTube link in description works
- ~~View count tracking~~ - Later
- ~~Filtering/sorting~~ - 200 items can scroll, traders know what they want

---

## Files to Create

```
/portal/
  login.html         - Trader login (customer ID + password)
  trucks.html        - Listing grid (authenticated)
  truck.html         - Detail view (?id=xxx)

/admin/
  login.html         - Admin username/password login
  index.html         - Admin dashboard
  trucks.html        - Truck CRUD (list, add, edit, delete)
  traders.html       - Trader management (create accounts)

/js/
  supabase.js        - Supabase client config
  portal.js          - Trader portal logic
  admin.js           - Admin logic
```

**Modify:**
- `index.html` - Add "Händlerportal" nav link

---

## Authentication

### Traders
- Admins create trader accounts manually in Supabase
- Trader receives customer ID + password from CHARWA
- Trader logs in at `/portal/login.html`
- Session stored in localStorage

### Admins
- Admin accounts created in Supabase `admins` table
- Username + password login at `/admin/login.html`
- Session stored in localStorage

---

## Phase 2 Features (Later)

| Feature | Why Wait |
|---------|----------|
| **New listing notifications** | Need to decide: email, SMS, or WhatsApp API |
| **Inquiry tracking** | Track which traders clicked "Contact" for which trucks |
| **Filtering/sorting** | Only if traders request it |
| **Multilingual** | Only if needed for Turkish traders |
| **View analytics** | Nice to have, not essential |

---

## Implementation Order

### Week 1: Foundation
1. Set up Supabase project
2. Create `trucks` table
3. Configure Supabase Storage bucket for images
4. Create admin login + CRUD interface
5. Test: Can add/edit/remove trucks

### Week 2: Trader Portal
1. Create trader login page
2. Create listing grid page
3. Create detail page
4. Add "Contact via WhatsApp" button
5. Test: Traders can browse and contact

### Week 3: Polish
1. Mobile responsive testing
2. Image optimization
3. Loading states
4. Error handling
5. Deploy and test with real traders

---

## Design

Use existing design system from `index.html`:
- Dark theme: `#0a0a0a` background
- Green accent: `#22c55e`
- Inter font
- Card style matching `.service-card`
- Responsive breakpoints: 968px, 640px

---

## Verification

1. Admin can log in and add a truck with photos
2. Trader can log in with customer ID
3. Trader sees listing grid with truck cards
4. Trader can click into detail view
5. "Contact via WhatsApp" opens WhatsApp with pre-filled message
6. Works on mobile
7. Existing `index.html` links to portal

---

## Decisions Made

1. **Trader notifications**: Keep WhatsApp for alerts
   - WhatsApp broadcasts alert traders to new listings
   - Portal is for detailed browsing and contact

2. **Trader accounts**: Created manually by admins
   - No public registration form
   - Admins create trader accounts in Supabase
   - Traders receive login credentials from CHARWA

---

## Updated Workflow

```
1. CHARWA finds new truck
2. Admin adds listing to portal (photos, price, specs)
3. Admin sends WhatsApp broadcast: "New truck available - check portal"
4. Trader logs into portal, browses listing
5. Trader clicks "Contact" → WhatsApp to CHARWA
6. CHARWA facilitates the deal
```

---

## Supabase Tables

```sql
-- Traders (created by admins)
CREATE TABLE traders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id TEXT UNIQUE NOT NULL,  -- e.g., "TR-001"
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  password_hash TEXT NOT NULL,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trucks (listings)
CREATE TABLE trucks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER NOT NULL,
  price INTEGER NOT NULL,
  mileage INTEGER,
  description TEXT,
  images JSONB DEFAULT '[]',
  status TEXT DEFAULT 'available'
    CHECK (status IN ('available', 'reserved', 'sold')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Admin credentials
CREATE TABLE admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL
);
```
