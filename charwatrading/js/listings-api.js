// Charwa Trading - Listings API (scraped marketplace data)
// Queries the `listings` table with user JWT for RLS enforcement

class ListingsAPI {
    constructor() {
        this.supabaseUrl = CONFIG.SUPABASE_URL;
        this.supabaseKey = CONFIG.SUPABASE_ANON_KEY;
        this.baseUrl = `${this.supabaseUrl}/rest/v1`;
        this.demoMode = this.supabaseUrl.includes('YOUR_PROJECT');
    }

    isDemoMode() {
        return this.demoMode;
    }

    // Get auth token from CharwaAuth
    _getToken() {
        return auth.getAccessToken() || this.supabaseKey;
    }

    // Helper for authenticated fetch requests
    async request(endpoint, options = {}) {
        if (this.demoMode) return this._demoRequest(endpoint, options);

        const url = `${this.baseUrl}${endpoint}`;
        const token = this._getToken();
        const headers = {
            'apikey': this.supabaseKey,
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Prefer': options.prefer || 'return=representation',
            ...options.headers
        };

        try {
            const response = await fetch(url, { ...options, headers });

            if (!response.ok) {
                throw new Error(`API Error: ${response.status} ${response.statusText}`);
            }

            const count = response.headers.get('content-range');
            const data = await response.json();

            return { data, count: count ? parseInt(count.split('/')[1]) : null };
        } catch (error) {
            console.error('ListingsAPI request failed:', error);
            throw error;
        }
    }

    // Get listings with filters (RLS enforced - only subscribed marketplaces)
    async getListings(filters = {}, options = {}) {
        const params = new URLSearchParams();

        // Filters
        if (filters.brand) {
            params.append('brand', `ilike.*${filters.brand}*`);
        }
        if (filters.priceMin) {
            params.append('price_cents', `gte.${parseInt(filters.priceMin) * 100}`);
        }
        if (filters.priceMax) {
            params.append('price_cents', `lte.${parseInt(filters.priceMax) * 100}`);
        }
        if (filters.yearFrom) {
            params.append('year', `gte.${filters.yearFrom}`);
        }
        if (filters.yearTo) {
            params.append('year', `lte.${filters.yearTo}`);
        }
        if (filters.mileageMax) {
            params.append('mileage_km', `lte.${filters.mileageMax}`);
        }
        if (filters.transmission) {
            params.append('transmission', `ilike.${filters.transmission}`);
        }
        if (filters.euroStandard) {
            params.append('euro_standard', `ilike.${filters.euroStandard}`);
        }
        if (filters.country) {
            params.append('country_code', `eq.${filters.country}`);
        }
        if (filters.sourceSites && filters.sourceSites.length > 0) {
            params.append('source_site', `in.(${filters.sourceSites.join(',')})`);
        }

        // Select specific columns
        params.append('select', '*');

        // Sorting
        const sortMap = {
            'newest': 'last_seen_at.desc',
            'oldest': 'last_seen_at.asc',
            'price_asc': 'price_cents.asc.nullslast',
            'price_desc': 'price_cents.desc.nullslast',
            'mileage_asc': 'mileage_km.asc.nullslast',
            'year_desc': 'year.desc.nullslast'
        };
        const order = sortMap[filters.sort] || 'last_seen_at.desc';
        params.append('order', order);

        // Pagination
        const page = options.page || 1;
        const limit = options.limit || CONFIG.ITEMS_PER_PAGE;
        const offset = (page - 1) * limit;

        const endpoint = `/listings?${params.toString()}`;

        return this.request(endpoint, {
            headers: {
                'Range': `${offset}-${offset + limit - 1}`,
                'Prefer': 'count=exact'
            }
        });
    }

    // Get a single listing by ID
    async getListingById(id) {
        if (this.demoMode) {
            const listing = DEMO_LISTINGS.find(l => l.id === parseInt(id));
            return listing || null;
        }

        const endpoint = `/listings?id=eq.${encodeURIComponent(id)}&select=*`;
        const { data } = await this.request(endpoint);
        return data[0] || null;
    }

    // Get unique brands from listings the user can see
    async getBrands() {
        if (this.demoMode) {
            const brands = [...new Set(DEMO_LISTINGS.map(l => l.brand).filter(Boolean))];
            return brands.sort();
        }

        const endpoint = '/listings?select=brand&order=brand.asc';
        const { data } = await this.request(endpoint);
        const brands = [...new Set(data.map(l => l.brand).filter(Boolean))];
        return brands.sort();
    }

    // Get countries from listings
    async getCountries() {
        if (this.demoMode) {
            return [...new Set(DEMO_LISTINGS.map(l => l.country_code).filter(Boolean))].sort();
        }

        const endpoint = '/listings?select=country_code&order=country_code.asc';
        const { data } = await this.request(endpoint);
        return [...new Set(data.map(l => l.country_code).filter(Boolean))].sort();
    }

    // Get all marketplaces (public, no auth needed)
    async getMarketplaces() {
        if (this.demoMode) {
            return DEMO_MARKETPLACES;
        }

        const endpoint = '/marketplaces?is_active=eq.true&order=name.asc';
        const { data } = await this.request(endpoint);
        return data;
    }

    // ==================
    // Demo mode
    // ==================

    _demoRequest(endpoint, options) {
        // Parse endpoint for demo data routing
        if (endpoint.includes('/listings')) {
            return this._getDemoListings(endpoint, options);
        }
        if (endpoint.includes('/marketplaces')) {
            return { data: DEMO_MARKETPLACES, count: DEMO_MARKETPLACES.length };
        }
        return { data: [], count: 0 };
    }

    _getDemoListings(endpoint, options) {
        let listings = [...DEMO_LISTINGS];

        // Parse filters from endpoint
        const url = new URL('http://x' + endpoint);
        const params = url.searchParams;

        if (params.get('brand')) {
            const brand = params.get('brand').replace('ilike.*', '').replace('*', '');
            listings = listings.filter(l => l.brand && l.brand.toLowerCase().includes(brand.toLowerCase()));
        }
        if (params.get('source_site')) {
            const sites = params.get('source_site').replace('in.(', '').replace(')', '').split(',');
            listings = listings.filter(l => sites.includes(l.source_site));
        }

        // Sorting
        const order = params.get('order') || 'last_seen_at.desc';
        if (order.includes('price_cents.asc')) listings.sort((a, b) => (a.price_cents || 0) - (b.price_cents || 0));
        else if (order.includes('price_cents.desc')) listings.sort((a, b) => (b.price_cents || 0) - (a.price_cents || 0));
        else if (order.includes('year.desc')) listings.sort((a, b) => (b.year || 0) - (a.year || 0));
        else listings.sort((a, b) => new Date(b.last_seen_at) - new Date(a.last_seen_at));

        // Pagination
        const rangeHeader = options.headers?.['Range'];
        let start = 0, end = CONFIG.ITEMS_PER_PAGE;
        if (rangeHeader) {
            const parts = rangeHeader.split('-');
            start = parseInt(parts[0]);
            end = parseInt(parts[1]) + 1;
        }

        const paginatedListings = listings.slice(start, end);
        return { data: paginatedListings, count: listings.length };
    }
}

// Demo data for listings
const DEMO_LISTINGS = [
    { id: 1, source_site: 'autoline', source_id: 'AL-001', url: '#', title: 'DAF XF 530 FT', price_cents: 8950000, year: 2021, mileage_km: 320000, power_kw: 390, brand: 'DAF', model: 'XF 530', euro_standard: 'Euro 6', transmission: 'Automatic', cab_type: 'Super Space Cab', location: 'Rotterdam', country_code: 'NL', company_name: 'European Trucks BV', image_url: '', description: 'Well maintained DAF XF 530', first_seen_at: '2026-01-15T10:00:00Z', last_seen_at: '2026-02-05T08:00:00Z' },
    { id: 2, source_site: 'autoline', source_id: 'AL-002', url: '#', title: 'MAN TGX 18.510', price_cents: 7800000, year: 2020, mileage_km: 410000, power_kw: 375, brand: 'MAN', model: 'TGX 18.510', euro_standard: 'Euro 6', transmission: 'Automatic', cab_type: 'XXL', location: 'Hamburg', country_code: 'DE', company_name: 'Nord Trucks GmbH', image_url: '', description: 'MAN TGX in excellent condition', first_seen_at: '2026-01-10T10:00:00Z', last_seen_at: '2026-02-04T12:00:00Z' },
    { id: 3, source_site: 'truckscout24', source_id: 'TS-001', url: '#', title: 'VOLVO FH 500 4x2', price_cents: 12500000, year: 2022, mileage_km: 180000, power_kw: 368, brand: 'VOLVO', model: 'FH 500', euro_standard: 'Euro 6', transmission: 'Automatic', cab_type: 'Globetrotter XL', location: 'Munich', country_code: 'DE', company_name: 'Bavaria Trucks', image_url: '', description: 'Nearly new Volvo FH 500', first_seen_at: '2026-01-20T10:00:00Z', last_seen_at: '2026-02-05T10:00:00Z' },
    { id: 4, source_site: 'truckscout24', source_id: 'TS-002', url: '#', title: 'SCANIA R 450 A4x2NA', price_cents: 6200000, year: 2019, mileage_km: 520000, power_kw: 331, brand: 'SCANIA', model: 'R 450', euro_standard: 'Euro 6', transmission: 'Manual', cab_type: 'Highline', location: 'Berlin', country_code: 'DE', company_name: 'Capital Trucks', image_url: '', description: 'Scania R 450 with retarder', first_seen_at: '2026-01-05T10:00:00Z', last_seen_at: '2026-02-03T14:00:00Z' },
    { id: 5, source_site: 'autoline', source_id: 'AL-003', url: '#', title: 'MERCEDES-BENZ Actros 1845', price_cents: 9500000, year: 2021, mileage_km: 280000, power_kw: 330, brand: 'MERCEDES-BENZ', model: 'Actros 1845', euro_standard: 'Euro 6', transmission: 'Automatic', cab_type: 'StreamSpace', location: 'Eindhoven', country_code: 'NL', company_name: 'Dutch Trucks', image_url: '', description: 'Mercedes Actros with Predictive Powertrain', first_seen_at: '2026-01-12T10:00:00Z', last_seen_at: '2026-02-05T06:00:00Z' },
    { id: 6, source_site: 'truck1', source_id: 'T1-001', url: '#', title: 'IVECO S-Way AS440S51', price_cents: 5800000, year: 2020, mileage_km: 450000, power_kw: 375, brand: 'IVECO', model: 'S-Way', euro_standard: 'Euro 6', transmission: 'Automatic', cab_type: 'Active Space', location: 'Warsaw', country_code: 'PL', company_name: 'Polska Transport', image_url: '', description: 'Iveco S-Way with full options', first_seen_at: '2026-01-08T10:00:00Z', last_seen_at: '2026-02-04T08:00:00Z' },
    { id: 7, source_site: 'mascus', source_id: 'MS-001', url: '#', title: 'RENAULT T 480', price_cents: 5500000, year: 2019, mileage_km: 480000, power_kw: 353, brand: 'RENAULT', model: 'T 480', euro_standard: 'Euro 6', transmission: 'Automatic', cab_type: 'Sleeper', location: 'Lyon', country_code: 'FR', company_name: 'France Camions', image_url: '', description: 'Renault T 480 in good condition', first_seen_at: '2026-01-03T10:00:00Z', last_seen_at: '2026-02-02T16:00:00Z' },
    { id: 8, source_site: 'truckscout24', source_id: 'TS-003', url: '#', title: 'DAF XG+ 530', price_cents: 14500000, year: 2023, mileage_km: 95000, power_kw: 390, brand: 'DAF', model: 'XG+ 530', euro_standard: 'Euro 6', transmission: 'Automatic', cab_type: 'XG+', location: 'Frankfurt', country_code: 'DE', company_name: 'Frankfurt Nutzfahrzeuge', image_url: '', description: 'Brand new DAF XG+ 530', first_seen_at: '2026-02-01T10:00:00Z', last_seen_at: '2026-02-05T12:00:00Z' },
];

const DEMO_MARKETPLACES = [
    { id: 'autoline', name: 'Autoline', country: 'International', listing_count: 1250, price_cents: 4900, is_active: true },
    { id: 'truck1', name: 'Truck1', country: 'Europe', listing_count: 890, price_cents: 4900, is_active: true },
    { id: 'truckscout24', name: 'TruckScout24', country: 'Germany', listing_count: 2100, price_cents: 5900, is_active: true },
    { id: 'mobile_de', name: 'Mobile.de', country: 'Germany', listing_count: 1800, price_cents: 5900, is_active: true },
    { id: 'mascus', name: 'Mascus', country: 'International', listing_count: 950, price_cents: 4900, is_active: true },
    { id: 'europa_truck', name: 'Europa-Truck', country: 'Europe', listing_count: 720, price_cents: 3900, is_active: true },
    { id: 'kleyntrucks', name: 'Kleyn Trucks', country: 'Netherlands', listing_count: 580, price_cents: 3900, is_active: true },
    { id: 'bas_trucks', name: 'BAS Trucks', country: 'Netherlands', listing_count: 640, price_cents: 3900, is_active: true },
    { id: 'tradus', name: 'Tradus', country: 'International', listing_count: 1100, price_cents: 4900, is_active: true },
    { id: 'truck_nl', name: 'Truck.nl', country: 'Netherlands', listing_count: 430, price_cents: 3900, is_active: true },
    { id: 'commercialmotor', name: 'Commercial Motor', country: 'UK', listing_count: 560, price_cents: 4900, is_active: true },
    { id: 'otomoto', name: 'OTOMOTO', country: 'Poland', listing_count: 780, price_cents: 3900, is_active: true },
    { id: 'hasznaltauto', name: 'Hasznaltauto', country: 'Hungary', listing_count: 340, price_cents: 3900, is_active: true },
];

// Global instance
const listingsApi = new ListingsAPI();
