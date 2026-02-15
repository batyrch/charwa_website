// Charwa Trading - Supabase Auth Module

class CharwaAuth {
    constructor() {
        this.supabaseUrl = CONFIG.SUPABASE_URL;
        this.supabaseKey = CONFIG.SUPABASE_ANON_KEY;
        this.demoMode = this.supabaseUrl.includes('YOUR_PROJECT');
        this.user = null;
        this.session = null;
        this._onAuthChangeCallbacks = [];
    }

    isDemoMode() {
        return this.demoMode;
    }

    // Initialize auth - call on page load
    async init() {
        if (this.demoMode) {
            this._loadDemoSession();
            return;
        }

        // Check for existing session
        const { data, error } = await this._request('/auth/v1/user', {
            method: 'GET',
            headers: this._authHeaders()
        });

        if (data && !error) {
            this.user = data;
            this.session = { access_token: this._getStoredToken() };
        }

        // Listen for hash fragments (password reset, email confirm)
        this._handleHashParams();
    }

    // Sign up with email and password
    async signUp(email, password, metadata = {}) {
        if (this.demoMode) {
            return this._demoSignUp(email, metadata);
        }

        const response = await this._request('/auth/v1/signup', {
            method: 'POST',
            body: JSON.stringify({
                email,
                password,
                data: metadata
            })
        });

        if (response.error) {
            throw new Error(response.error.message || 'Registration failed');
        }

        return response.data;
    }

    // Sign in with email and password
    async signIn(email, password) {
        if (this.demoMode) {
            return this._demoSignIn(email);
        }

        const response = await this._request('/auth/v1/token?grant_type=password', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });

        if (response.error) {
            throw new Error(response.error.message || 'Login failed');
        }

        this.user = response.data.user;
        this.session = {
            access_token: response.data.access_token,
            refresh_token: response.data.refresh_token
        };

        this._storeToken(response.data.access_token);
        this._storeRefreshToken(response.data.refresh_token);
        this._notifyAuthChange('SIGNED_IN', this.user);

        return this.user;
    }

    // Sign out
    async signOut() {
        if (this.demoMode) {
            this._clearDemoSession();
            this._notifyAuthChange('SIGNED_OUT', null);
            window.location.href = 'index.html';
            return;
        }

        try {
            await this._request('/auth/v1/logout', {
                method: 'POST',
                headers: this._authHeaders()
            });
        } catch (e) {
            // Ignore errors on sign out
        }

        this.user = null;
        this.session = null;
        this._clearStoredTokens();
        this._notifyAuthChange('SIGNED_OUT', null);
    }

    // Send password reset email
    async resetPassword(email) {
        if (this.demoMode) {
            console.log('Demo: Password reset email sent to', email);
            return { message: 'Password reset email sent' };
        }

        const response = await this._request('/auth/v1/recover', {
            method: 'POST',
            body: JSON.stringify({
                email,
                gotrue_meta_security: {}
            })
        });

        if (response.error) {
            throw new Error(response.error.message || 'Password reset failed');
        }

        return response.data;
    }

    // Update password (after reset link)
    async updatePassword(newPassword) {
        if (this.demoMode) {
            console.log('Demo: Password updated');
            return { message: 'Password updated' };
        }

        const response = await this._request('/auth/v1/user', {
            method: 'PUT',
            headers: this._authHeaders(),
            body: JSON.stringify({ password: newPassword })
        });

        if (response.error) {
            throw new Error(response.error.message || 'Password update failed');
        }

        return response.data;
    }

    // Get current user
    getUser() {
        return this.user;
    }

    // Get current session
    getSession() {
        return this.session;
    }

    // Check if user is authenticated
    isAuthenticated() {
        return !!this.user;
    }

    // Get access token for API requests
    getAccessToken() {
        if (this.session) return this.session.access_token;
        return this._getStoredToken();
    }

    // Register auth state change callback
    onAuthChange(callback) {
        this._onAuthChangeCallbacks.push(callback);
    }

    // Require auth - redirect to login if not authenticated
    requireAuth(redirectUrl) {
        if (!this.isAuthenticated()) {
            const returnTo = redirectUrl || window.location.href;
            window.location.href = `auth/login.html?returnTo=${encodeURIComponent(returnTo)}`;
            return false;
        }
        return true;
    }

    // Get user profile from user_profiles table
    async getProfile() {
        if (this.demoMode) {
            return this._getDemoProfile();
        }

        if (!this.isAuthenticated()) return null;

        const url = `${this.supabaseUrl}/rest/v1/user_profiles?id=eq.${this.user.id}&select=*`;
        const response = await fetch(url, {
            headers: {
                'apikey': this.supabaseKey,
                'Authorization': `Bearer ${this.getAccessToken()}`,
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();
        return data[0] || null;
    }

    // Update user profile
    async updateProfile(profileData) {
        if (this.demoMode) {
            console.log('Demo: Profile updated', profileData);
            return profileData;
        }

        if (!this.isAuthenticated()) throw new Error('Not authenticated');

        const url = `${this.supabaseUrl}/rest/v1/user_profiles?id=eq.${this.user.id}`;
        const response = await fetch(url, {
            method: 'PATCH',
            headers: {
                'apikey': this.supabaseKey,
                'Authorization': `Bearer ${this.getAccessToken()}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation'
            },
            body: JSON.stringify(profileData)
        });

        const data = await response.json();
        return data[0] || null;
    }

    // Get user's active marketplace subscriptions
    async getSubscriptions() {
        if (this.demoMode) {
            return this._getDemoSubscriptions();
        }

        if (!this.isAuthenticated()) return [];

        const url = `${this.supabaseUrl}/rest/v1/user_marketplace_subscriptions?user_id=eq.${this.user.id}&is_active=eq.true&select=*,marketplaces(*)`;
        const response = await fetch(url, {
            headers: {
                'apikey': this.supabaseKey,
                'Authorization': `Bearer ${this.getAccessToken()}`,
                'Content-Type': 'application/json'
            }
        });

        return await response.json();
    }

    // ==================
    // Private helpers
    // ==================

    async _request(endpoint, options = {}) {
        const url = `${this.supabaseUrl}${endpoint}`;
        const headers = {
            'apikey': this.supabaseKey,
            'Content-Type': 'application/json',
            ...options.headers
        };

        try {
            const response = await fetch(url, { ...options, headers });
            const data = await response.json();

            if (!response.ok) {
                return { data: null, error: data };
            }

            return { data, error: null };
        } catch (error) {
            return { data: null, error: { message: error.message } };
        }
    }

    _authHeaders() {
        const token = this.getAccessToken();
        return token ? { 'Authorization': `Bearer ${token}` } : {};
    }

    _storeToken(token) {
        localStorage.setItem('charwa_access_token', token);
    }

    _storeRefreshToken(token) {
        localStorage.setItem('charwa_refresh_token', token);
    }

    _getStoredToken() {
        return localStorage.getItem('charwa_access_token');
    }

    _clearStoredTokens() {
        localStorage.removeItem('charwa_access_token');
        localStorage.removeItem('charwa_refresh_token');
    }

    _notifyAuthChange(event, user) {
        this.user = event === 'SIGNED_OUT' ? null : user;
        this._onAuthChangeCallbacks.forEach(cb => cb(event, user));
    }

    _handleHashParams() {
        const hash = window.location.hash;
        if (!hash) return;

        const params = new URLSearchParams(hash.substring(1));
        const accessToken = params.get('access_token');
        const type = params.get('type');

        if (accessToken) {
            this._storeToken(accessToken);
            this.session = { access_token: accessToken };

            if (type === 'recovery') {
                // Redirect to password reset page
                window.location.href = 'auth/reset-password.html';
            } else {
                // Email confirmation - reload to pick up session
                window.location.hash = '';
                window.location.reload();
            }
        }
    }

    // ==================
    // Demo mode methods
    // ==================

    _demoSignUp(email, metadata) {
        const user = {
            id: 'demo-user-' + Date.now(),
            email,
            ...metadata
        };
        localStorage.setItem('charwa_demo_user', JSON.stringify(user));
        console.log('Demo: User registered', user);
        return user;
    }

    _demoSignIn(email) {
        const user = JSON.parse(localStorage.getItem('charwa_demo_user')) || {
            id: 'demo-user-1',
            email,
            full_name: 'Demo User'
        };
        user.email = email;
        localStorage.setItem('charwa_demo_user', JSON.stringify(user));
        localStorage.setItem('charwa_access_token', 'demo-token');
        this.user = user;
        this.session = { access_token: 'demo-token' };
        this._notifyAuthChange('SIGNED_IN', user);
        console.log('Demo: User signed in', user);
        return user;
    }

    _loadDemoSession() {
        const token = localStorage.getItem('charwa_access_token');
        if (token === 'demo-token') {
            const user = JSON.parse(localStorage.getItem('charwa_demo_user'));
            if (user) {
                this.user = user;
                this.session = { access_token: 'demo-token' };
            }
        }
    }

    _clearDemoSession() {
        localStorage.removeItem('charwa_demo_user');
        localStorage.removeItem('charwa_access_token');
        this.user = null;
        this.session = null;
    }

    _getDemoProfile() {
        const user = this.user;
        if (!user) return null;
        return {
            id: user.id,
            email: user.email,
            full_name: user.full_name || 'Demo User',
            company_name: user.company_name || 'Demo Company',
            phone: '',
            subscription_status: 'active',
            current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        };
    }

    _getDemoSubscriptions() {
        if (!this.user) return [];
        return [
            { marketplace_id: 'autoline', is_active: true, marketplaces: { id: 'autoline', name: 'Autoline', country: 'International', listing_count: 1250 } },
            { marketplace_id: 'truckscout24', is_active: true, marketplaces: { id: 'truckscout24', name: 'TruckScout24', country: 'Germany', listing_count: 890 } }
        ];
    }
}

// Global auth instance
const auth = new CharwaAuth();

// Helper: Update nav to show auth state
function updateAuthNav() {
    const authNavEls = document.querySelectorAll('.auth-nav-link');
    authNavEls.forEach(el => {
        if (auth.isAuthenticated()) {
            el.href = 'dashboard.html';
            el.textContent = i18n.t('nav.dashboard');
        } else {
            el.href = 'auth/login.html';
            el.textContent = i18n.t('nav.login');
        }
    });

    const mobileAuthNavEls = document.querySelectorAll('.mobile-auth-nav-link');
    mobileAuthNavEls.forEach(el => {
        if (auth.isAuthenticated()) {
            el.href = 'dashboard.html';
            el.textContent = i18n.t('nav.dashboard');
        } else {
            el.href = 'auth/login.html';
            el.textContent = i18n.t('nav.login');
        }
    });
}
