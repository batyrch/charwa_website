// Charwa Trading - Stripe Billing Helpers

class CharwaBilling {
    constructor() {
        this.supabaseUrl = CONFIG.SUPABASE_URL;
        this.supabaseKey = CONFIG.SUPABASE_ANON_KEY;
        this.demoMode = this.supabaseUrl.includes('YOUR_PROJECT');
    }

    isDemoMode() {
        return this.demoMode;
    }

    // Get auth token
    _getToken() {
        return auth.getAccessToken() || this.supabaseKey;
    }

    // Call a Supabase Edge Function
    async _callFunction(functionName, body = {}) {
        const url = `${this.supabaseUrl}/functions/v1/${functionName}`;
        const token = this._getToken();

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: 'Request failed' }));
            throw new Error(error.message || `Function error: ${response.status}`);
        }

        return response.json();
    }

    // Create a Stripe Checkout session for selected marketplaces
    async createCheckout(marketplaceIds) {
        if (this.demoMode) {
            console.log('Demo: Would create checkout for', marketplaceIds);
            alert('Demo mode: Stripe Checkout would open for marketplaces: ' + marketplaceIds.join(', '));
            return { url: '#' };
        }

        if (!auth.isAuthenticated()) {
            throw new Error('You must be logged in to subscribe');
        }

        const result = await this._callFunction('create-checkout', {
            marketplace_ids: marketplaceIds
        });

        // Redirect to Stripe Checkout
        if (result.url) {
            window.location.href = result.url;
        }

        return result;
    }

    // Open the Stripe Customer Portal for managing subscriptions
    async openCustomerPortal() {
        if (this.demoMode) {
            console.log('Demo: Would open customer portal');
            alert('Demo mode: Stripe Customer Portal would open');
            return { url: '#' };
        }

        if (!auth.isAuthenticated()) {
            throw new Error('You must be logged in');
        }

        const result = await this._callFunction('customer-portal', {});

        if (result.url) {
            window.location.href = result.url;
        }

        return result;
    }

    // Get subscription info from user profile
    async getSubscriptionInfo() {
        if (this.demoMode) {
            return {
                status: 'active',
                current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
                marketplaces: [
                    { id: 'autoline', name: 'Autoline', is_active: true },
                    { id: 'truckscout24', name: 'TruckScout24', is_active: true }
                ]
            };
        }

        const profile = await auth.getProfile();
        const subscriptions = await auth.getSubscriptions();

        return {
            status: profile?.subscription_status || 'inactive',
            current_period_end: profile?.current_period_end,
            marketplaces: subscriptions.map(s => ({
                id: s.marketplace_id,
                name: s.marketplaces?.name,
                is_active: s.is_active
            }))
        };
    }

    // Calculate total monthly price for selected marketplaces
    calculateTotal(marketplaces, selectedIds) {
        return selectedIds.reduce((total, id) => {
            const mp = marketplaces.find(m => m.id === id);
            return total + (mp ? mp.price_cents : 0);
        }, 0);
    }

    // Format price in cents to display string
    formatPrice(cents) {
        return `€${(cents / 100).toFixed(2)}`;
    }
}

// Global instance
const billing = new CharwaBilling();
