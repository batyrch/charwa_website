// Charwa Trading - Configuration
// Replace these with your actual Supabase and Cloudinary credentials

const CONFIG = {
    // Supabase Configuration
    SUPABASE_URL: 'https://YOUR_PROJECT.supabase.co',
    SUPABASE_ANON_KEY: 'YOUR_ANON_KEY',

    // Cloudinary Configuration
    CLOUDINARY_CLOUD_NAME: 'YOUR_CLOUD_NAME',
    CLOUDINARY_UPLOAD_PRESET: 'charwa_trucks',

    // App Settings
    ITEMS_PER_PAGE: 12,
    DEFAULT_LANGUAGE: 'de',

    // Contact Information
    CONTACT: {
        PHONE: '+491604940999',
        WHATSAPP: '491604940999',
        EMAIL: 'info@charwa.de',
        COMPANY: 'Charwa GmbH',
        ADDRESS: 'Kolonnenstraße 8, 10827 Berlin, Germany'
    },

    // Main site URL
    MAIN_SITE_URL: 'https://charwa.de'
};

// Freeze config to prevent accidental modifications
Object.freeze(CONFIG);
Object.freeze(CONFIG.CONTACT);
