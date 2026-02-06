// Charwa Trading - Supabase API Client

class TrucksAPI {
    constructor() {
        this.supabaseUrl = CONFIG.SUPABASE_URL;
        this.supabaseKey = CONFIG.SUPABASE_ANON_KEY;
        this.baseUrl = `${this.supabaseUrl}/rest/v1`;
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
        const endpoint = `/trucks?slug=eq.${encodeURIComponent(slug)}`;
        const { data } = await this.request(endpoint);
        return data[0] || null;
    }

    // Get single truck by ID
    async getTruckById(id) {
        const endpoint = `/trucks?id=eq.${encodeURIComponent(id)}`;
        const { data } = await this.request(endpoint);
        return data[0] || null;
    }

    // Get related trucks (same brand, similar price range)
    async getRelatedTrucks(truck, limit = 4) {
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
        return this.getTrucks({}, { ...options, includeAll: true });
    }

    // Admin: Create truck
    async createTruck(truckData) {
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
        const endpoint = `/trucks?id=eq.${id}`;

        return this.request(endpoint, {
            method: 'DELETE'
        });
    }

    // Admin: Update truck status
    async updateTruckStatus(id, status) {
        return this.updateTruck(id, { status });
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
}

// Global API instance
const api = new TrucksAPI();
