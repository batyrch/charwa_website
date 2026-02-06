// Charwa Trading - Supabase API Client

class TrucksAPI {
    constructor() {
        this.supabaseUrl = CONFIG.SUPABASE_URL;
        this.supabaseKey = CONFIG.SUPABASE_ANON_KEY;
        this.baseUrl = `${this.supabaseUrl}/rest/v1`;
        this.demoMode = this.supabaseUrl.includes('YOUR_PROJECT');
    }

    // Check if running in demo mode
    isDemoMode() {
        return this.demoMode;
    }

    // Helper for fetch requests
    async request(endpoint, options = {}) {
        const url = `${this.baseUrl}${endpoint}`;
        const headers = {
            'apikey': this.supabaseKey,
            'Authorization': `Bearer ${this.supabaseKey}`,
            'Content-Type': 'application/json',
            'Prefer': options.prefer || 'return=representation',
            ...options.headers
        };

        try {
            const response = await fetch(url, {
                ...options,
                headers
            });

            if (!response.ok) {
                throw new Error(`API Error: ${response.status} ${response.statusText}`);
            }

            // Handle count header for pagination
            const count = response.headers.get('content-range');
            const data = await response.json();

            return { data, count: count ? parseInt(count.split('/')[1]) : null };
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }

    // Get all trucks with filters
    async getTrucks(filters = {}, options = {}) {
        // Demo mode - use local data
        if (this.demoMode) {
            return this.getDemoTrucks(filters, options);
        }

        const params = new URLSearchParams();

        // Only show active trucks on public pages
        if (!options.includeAll) {
            params.append('status', 'eq.active');
        }

        // Apply filters
        if (filters.brand) {
            params.append('brand', `eq.${filters.brand}`);
        }
        if (filters.priceMin) {
            params.append('price', `gte.${filters.priceMin}`);
        }
        if (filters.priceMax) {
            params.append('price', `lte.${filters.priceMax}`);
        }
        if (filters.yearFrom) {
            params.append('year', `gte.${filters.yearFrom}`);
        }
        if (filters.yearTo) {
            params.append('year', `lte.${filters.yearTo}`);
        }
        if (filters.mileageMax) {
            params.append('mileage', `lte.${filters.mileageMax}`);
        }
        if (filters.transmission) {
            params.append('transmission', `eq.${filters.transmission}`);
        }
        if (filters.emissionClass) {
            params.append('emission_class', `eq.${filters.emissionClass}`);
        }

        // Sorting
        const sortMap = {
            'newest': 'created_at.desc',
            'oldest': 'created_at.asc',
            'price_asc': 'price.asc',
            'price_desc': 'price.desc',
            'mileage_asc': 'mileage.asc',
            'year_desc': 'year.desc'
        };
        const order = sortMap[filters.sort] || 'created_at.desc';

        // Featured trucks first
        params.append('order', `featured.desc,${order}`);

        // Pagination
        const page = options.page || 1;
        const limit = options.limit || CONFIG.ITEMS_PER_PAGE;
        const offset = (page - 1) * limit;

        const endpoint = `/trucks?${params.toString()}`;

        return this.request(endpoint, {
            headers: {
                'Range': `${offset}-${offset + limit - 1}`,
                'Prefer': 'count=exact'
            }
        });
    }

    // Get single truck by slug
    async getTruckBySlug(slug) {
        if (this.demoMode) {
            return this.getDemoTruckBySlug(slug);
        }
        const endpoint = `/trucks?slug=eq.${encodeURIComponent(slug)}`;
        const { data } = await this.request(endpoint);
        return data[0] || null;
    }

    // Get single truck by ID
    async getTruckById(id) {
        if (this.demoMode) {
            return this.getDemoTruckById(id);
        }
        const endpoint = `/trucks?id=eq.${encodeURIComponent(id)}`;
        const { data } = await this.request(endpoint);
        return data[0] || null;
    }

    // Get related trucks (same brand, similar price range)
    async getRelatedTrucks(truck, limit = 4) {
        if (this.demoMode) {
            return this.getDemoRelatedTrucks(truck, limit);
        }
        const priceRange = truck.price * 0.3; // 30% price range
        const params = new URLSearchParams({
            'status': 'eq.active',
            'id': `neq.${truck.id}`,
            'brand': `eq.${truck.brand}`,
            'order': 'created_at.desc',
            'limit': limit.toString()
        });

        const endpoint = `/trucks?${params.toString()}`;
        const { data } = await this.request(endpoint);
        return data;
    }

    // Get unique brands for filter dropdown
    async getBrands() {
        if (this.demoMode) {
            return this.getDemoBrands();
        }
        const endpoint = '/trucks?select=brand&status=eq.active';
        const { data } = await this.request(endpoint);
        const brands = [...new Set(data.map(t => t.brand))].sort();
        return brands;
    }

    // Increment view count
    async incrementViewCount(id) {
        const truck = await this.getTruckById(id);
        if (truck) {
            const endpoint = `/trucks?id=eq.${id}`;
            await this.request(endpoint, {
                method: 'PATCH',
                body: JSON.stringify({ view_count: (truck.view_count || 0) + 1 })
            });
        }
    }

    // ==================
    // Admin Operations
    // ==================

    // Set admin token for authenticated requests
    setAdminToken(token) {
        this.adminToken = token;
    }

    // Admin: Get all trucks including drafts
    async getAllTrucks(options = {}) {
        if (this.demoMode) {
            return this.getDemoTrucks({}, { ...options, includeAll: true });
        }
        return this.getTrucks({}, { ...options, includeAll: true });
    }

    // Admin: Create truck
    async createTruck(truckData) {
        if (this.demoMode) {
            return this.demoCreateTruck(truckData);
        }
        const slug = this.generateSlug(truckData);
        const endpoint = '/trucks';

        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify({
                ...truckData,
                slug,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            })
        });
    }

    // Admin: Update truck
    async updateTruck(id, truckData) {
        if (this.demoMode) {
            return this.demoUpdateTruck(id, truckData);
        }
        const endpoint = `/trucks?id=eq.${id}`;

        return this.request(endpoint, {
            method: 'PATCH',
            body: JSON.stringify({
                ...truckData,
                updated_at: new Date().toISOString()
            })
        });
    }

    // Admin: Delete truck
    async deleteTruck(id) {
        if (this.demoMode) {
            return this.demoDeleteTruck(id);
        }
        const endpoint = `/trucks?id=eq.${id}`;

        return this.request(endpoint, {
            method: 'DELETE'
        });
    }

    // Admin: Update truck status
    async updateTruckStatus(id, status) {
        return this.updateTruck(id, { status });
    }

    // Demo: Create truck (in-memory)
    demoCreateTruck(truckData) {
        const newTruck = {
            ...truckData,
            id: Date.now().toString(),
            slug: this.generateSlug(truckData),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            view_count: 0
        };
        DEMO_TRUCKS.unshift(newTruck);
        console.log('Demo: Created truck', newTruck);
        return { data: [newTruck] };
    }

    // Demo: Update truck (in-memory)
    demoUpdateTruck(id, truckData) {
        const index = DEMO_TRUCKS.findIndex(t => t.id === id);
        if (index !== -1) {
            DEMO_TRUCKS[index] = { ...DEMO_TRUCKS[index], ...truckData, updated_at: new Date().toISOString() };
            console.log('Demo: Updated truck', DEMO_TRUCKS[index]);
            return { data: [DEMO_TRUCKS[index]] };
        }
        throw new Error('Truck not found');
    }

    // Demo: Delete truck (in-memory)
    demoDeleteTruck(id) {
        const index = DEMO_TRUCKS.findIndex(t => t.id === id);
        if (index !== -1) {
            const deleted = DEMO_TRUCKS.splice(index, 1);
            console.log('Demo: Deleted truck', deleted[0]);
            return { data: deleted };
        }
        throw new Error('Truck not found');
    }

    // Generate URL-friendly slug
    generateSlug(truckData) {
        const parts = [
            truckData.brand,
            truckData.model,
            truckData.year
        ].filter(Boolean);

        let slug = parts
            .join('-')
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '');

        // Add random suffix for uniqueness
        const suffix = Math.random().toString(36).substring(2, 8);
        return `${slug}-${suffix}`;
    }

    // ==================
    // Demo Mode Methods
    // ==================

    getDemoTrucks(filters = {}, options = {}) {
        let trucks = [...DEMO_TRUCKS];

        // Filter by status
        if (!options.includeAll) {
            trucks = trucks.filter(t => t.status === 'active');
        }

        // Apply filters
        if (filters.brand) {
            trucks = trucks.filter(t => t.brand === filters.brand);
        }
        if (filters.priceMin) {
            trucks = trucks.filter(t => t.price >= parseInt(filters.priceMin));
        }
        if (filters.priceMax) {
            trucks = trucks.filter(t => t.price <= parseInt(filters.priceMax));
        }
        if (filters.yearFrom) {
            trucks = trucks.filter(t => t.year >= parseInt(filters.yearFrom));
        }
        if (filters.yearTo) {
            trucks = trucks.filter(t => t.year <= parseInt(filters.yearTo));
        }
        if (filters.mileageMax) {
            trucks = trucks.filter(t => t.mileage <= parseInt(filters.mileageMax));
        }
        if (filters.transmission) {
            trucks = trucks.filter(t => t.transmission === filters.transmission);
        }
        if (filters.emissionClass) {
            trucks = trucks.filter(t => t.emission_class === filters.emissionClass);
        }

        // Sorting
        const sortFns = {
            'newest': (a, b) => new Date(b.created_at) - new Date(a.created_at),
            'oldest': (a, b) => new Date(a.created_at) - new Date(b.created_at),
            'price_asc': (a, b) => a.price - b.price,
            'price_desc': (a, b) => b.price - a.price,
            'mileage_asc': (a, b) => a.mileage - b.mileage,
            'year_desc': (a, b) => b.year - a.year
        };

        // Featured first, then sort
        trucks.sort((a, b) => {
            if (a.featured && !b.featured) return -1;
            if (!a.featured && b.featured) return 1;
            return (sortFns[filters.sort] || sortFns['newest'])(a, b);
        });

        // Pagination
        const page = options.page || 1;
        const limit = options.limit || CONFIG.ITEMS_PER_PAGE;
        const start = (page - 1) * limit;
        const paginatedTrucks = trucks.slice(start, start + limit);

        return { data: paginatedTrucks, count: trucks.length };
    }

    getDemoTruckBySlug(slug) {
        return DEMO_TRUCKS.find(t => t.slug === slug) || null;
    }

    getDemoTruckById(id) {
        return DEMO_TRUCKS.find(t => t.id === id) || null;
    }

    getDemoBrands() {
        const brands = [...new Set(DEMO_TRUCKS.filter(t => t.status === 'active').map(t => t.brand))];
        return brands.sort();
    }

    getDemoRelatedTrucks(truck, limit = 4) {
        return DEMO_TRUCKS
            .filter(t => t.id !== truck.id && t.status === 'active' && t.brand === truck.brand)
            .slice(0, limit);
    }
}

// Global API instance
const api = new TrucksAPI();
