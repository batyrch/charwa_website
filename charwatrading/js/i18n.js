// Charwa Trading - Internationalization

const TRANSLATIONS = {
    de: {
        // Navigation
        'nav.home': 'Startseite',
        'nav.trucks': 'Fahrzeuge',
        'nav.about': 'Über uns',
        'nav.contact': 'Kontakt',

        // Hero/Header
        'hero.title': 'Gebrauchte LKW aus Europa',
        'hero.subtitle': 'Qualitätsfahrzeuge für den Export in die Türkei und Zentralasien',

        // Filters
        'filter.title': 'Filter',
        'filter.brand': 'Marke',
        'filter.brand.all': 'Alle Marken',
        'filter.price': 'Preis',
        'filter.price.min': 'Min. Preis',
        'filter.price.max': 'Max. Preis',
        'filter.year': 'Baujahr',
        'filter.year.from': 'Von',
        'filter.year.to': 'Bis',
        'filter.mileage': 'Kilometerstand',
        'filter.mileage.max': 'Max. km',
        'filter.transmission': 'Getriebe',
        'filter.transmission.all': 'Alle',
        'filter.transmission.automatic': 'Automatik',
        'filter.transmission.manual': 'Schaltgetriebe',
        'filter.emission': 'Emissionsklasse',
        'filter.emission.all': 'Alle',
        'filter.apply': 'Filter anwenden',
        'filter.reset': 'Zurücksetzen',

        // Sorting
        'sort.title': 'Sortieren',
        'sort.newest': 'Neueste zuerst',
        'sort.oldest': 'Älteste zuerst',
        'sort.price_asc': 'Preis aufsteigend',
        'sort.price_desc': 'Preis absteigend',
        'sort.mileage_asc': 'Kilometerstand aufsteigend',
        'sort.year_desc': 'Baujahr absteigend',

        // Truck Card
        'truck.mileage': 'km',
        'truck.power': 'PS',
        'truck.year': 'Baujahr',
        'truck.price_on_request': 'Preis auf Anfrage',
        'truck.vat_margin': 'MwSt. nicht ausweisbar',
        'truck.vat_included': 'inkl. MwSt.',
        'truck.vat_excluded': 'zzgl. MwSt.',
        'truck.negotiable': 'VB',
        'truck.sold': 'Verkauft',
        'truck.reserved': 'Reserviert',
        'truck.featured': 'Top-Angebot',

        // Detail Page
        'detail.back': 'Zurück zur Übersicht',
        'detail.gallery': 'Galerie',
        'detail.video': 'Video ansehen',
        'detail.description': 'Beschreibung',
        'detail.specs': 'Technische Daten',
        'detail.features': 'Ausstattung',
        'detail.contact': 'Kontakt',
        'detail.inquiry': 'Anfrage senden',
        'detail.whatsapp': 'WhatsApp',
        'detail.call': 'Anrufen',
        'detail.email': 'E-Mail',
        'detail.share': 'Teilen',
        'detail.print': 'Drucken',
        'detail.related': 'Ähnliche Fahrzeuge',

        // Specs
        'spec.brand': 'Marke',
        'spec.model': 'Modell',
        'spec.year': 'Baujahr',
        'spec.mileage': 'Kilometerstand',
        'spec.power': 'Leistung',
        'spec.emission': 'Emissionsklasse',
        'spec.transmission': 'Getriebe',
        'spec.cab': 'Kabine',
        'spec.axles': 'Achskonfiguration',
        'spec.fuel_tank': 'Tankkapazität',
        'spec.condition': 'Zustand',
        'spec.color': 'Farbe',

        // Features
        'feature.retarder': 'Retarder',
        'feature.ac': 'Klimaanlage',
        'feature.standheater': 'Standheizung',
        'feature.navigation': 'Navigation',
        'feature.cruise_control': 'Tempomat',
        'feature.abs': 'ABS',
        'feature.esp': 'ESP',
        'feature.parking_sensors': 'Parksensoren',
        'feature.refrigerator': 'Kühlschrank',
        'feature.microwave': 'Mikrowelle',
        'feature.tv': 'TV',
        'feature.leather': 'Ledersitze',
        'feature.bed': 'Schlafkabine',

        // Pagination
        'pagination.prev': 'Zurück',
        'pagination.next': 'Weiter',
        'pagination.of': 'von',
        'pagination.showing': 'Zeige',
        'pagination.results': 'Ergebnisse',

        // Status
        'status.loading': 'Laden...',
        'status.no_results': 'Keine Fahrzeuge gefunden',
        'status.error': 'Fehler beim Laden der Daten',

        // Footer
        'footer.tagline': 'Nutzfahrzeuge für den Export',
        'footer.company': 'Unternehmen',
        'footer.legal': 'Rechtliches',
        'footer.impressum': 'Impressum',
        'footer.privacy': 'Datenschutz',
        'footer.terms': 'AGB',
        'footer.copyright': '© 2026 Charwa GmbH. Alle Rechte vorbehalten.',

        // Contact
        'contact.title': 'Kontaktieren Sie uns',
        'contact.subtitle': 'Interesse an einem Fahrzeug? Wir helfen Ihnen gerne weiter.',
        'contact.hours': 'Geschäftszeiten: Mo-Fr 09:00-18:00 MEZ',

        // WhatsApp Message Templates
        'whatsapp.inquiry': 'Hallo, ich interessiere mich für: ',
        'whatsapp.general': 'Hallo, ich habe eine Anfrage zu Ihren Fahrzeugen.',

        // Auth
        'nav.login': 'Anmelden',
        'nav.dashboard': 'Dashboard',
        'nav.marketplace': 'Marktplatz',
        'auth.email': 'E-Mail',
        'auth.password': 'Passwort',
        'auth.sign_in': 'Anmelden',
        'auth.sign_out': 'Abmelden',
        'auth.sign_up_link': 'Registrieren',
        'auth.sign_in_link': 'Anmelden',
        'auth.forgot_password': 'Passwort vergessen?',
        'auth.no_account': 'Noch kein Konto?',
        'auth.has_account': 'Bereits ein Konto?',
        'auth.full_name': 'Vollständiger Name',
        'auth.company': 'Firma',
        'auth.create_account': 'Konto erstellen',
        'auth.password_confirm': 'Passwort bestätigen',
        'auth.passwords_mismatch': 'Passwörter stimmen nicht überein',
        'auth.login_subtitle': 'Marketplace Intelligence Portal',
        'auth.register_subtitle': 'Konto erstellen',
        'auth.reset_subtitle': 'Passwort zurücksetzen',
        'auth.new_password_subtitle': 'Neues Passwort setzen',
        'auth.new_password': 'Neues Passwort',
        'auth.set_password': 'Passwort setzen',
        'auth.send_reset_link': 'Link senden',
        'auth.back_to_login': 'Zurück zur Anmeldung',
        'auth.back_to_site': 'Zurück zur Website',
        'auth.check_email': 'Bitte überprüfen Sie Ihre E-Mail zur Bestätigung.',
        'auth.password_reset_sent': 'Link zum Zurücksetzen wurde gesendet.',
        'auth.reset_email_sent': 'Wir haben Ihnen eine E-Mail zum Zurücksetzen gesendet.',
        'auth.password_updated': 'Passwort erfolgreich aktualisiert.',
        'auth.login_error': 'Anmeldung fehlgeschlagen.',
        'auth.register_error': 'Registrierung fehlgeschlagen.',

        // Dashboard
        'dashboard.title': 'Dashboard',
        'dashboard.subtitle': 'Ihre Marktplatz-Abonnements und Datenübersicht',
        'dashboard.active_subs': 'Aktive Abonnements',
        'dashboard.total_listings': 'Inserate verfügbar',
        'dashboard.available_markets': 'Marktplätze verfügbar',
        'dashboard.status': 'Status',
        'dashboard.status_active': 'Aktiv',
        'dashboard.status_inactive': 'Inaktiv',
        'dashboard.status_past_due': 'Überfällig',
        'dashboard.your_marketplaces': 'Ihre Marktplätze',
        'dashboard.browse_listings': 'Inserate durchsuchen',
        'dashboard.add_marketplace': 'Marktplatz hinzufügen',
        'dashboard.no_subscriptions': 'Sie haben noch keine Marktplätze abonniert.',
        'dashboard.subscribe_now': 'Jetzt abonnieren',
        'dashboard.active': 'Aktiv',
        'dashboard.listings': 'Inserate',
        'dashboard.account': 'Konto',
        'dashboard.manage_billing': 'Abrechnung verwalten',
        'dashboard.next_billing': 'Nächste Abrechnung',

        // Browse
        'browse.title': 'Marktplatz-Inserate',
        'browse.subtitle': 'Durchsuchen Sie Tausende LKW-Angebote aus europäischen Marktplätzen',
        'browse.login_required': 'Anmeldung erforderlich',
        'browse.login_hint': 'Bitte melden Sie sich an, um Marktplatz-Inserate zu durchsuchen.',
        'browse.no_subs': 'Kein Abonnement aktiv',
        'browse.no_subs_hint': 'Abonnieren Sie mindestens einen Marktplatz, um Inserate zu sehen.',
        'browse.source': 'Quelle',
        'browse.view_original': 'Original ansehen auf',
        'browse.seller': 'Verkäufer',

        // Subscribe
        'subscribe.title': 'Marktplätze abonnieren',
        'subscribe.subtitle': 'Wählen Sie die Marktplätze aus, deren Inserate Sie durchsuchen möchten',
        'subscribe.summary': 'Zusammenfassung',
        'subscribe.select_hint': 'Wählen Sie Marktplätze aus',
        'subscribe.total': 'Gesamt',
        'subscribe.per_month': '/Monat',
        'subscribe.month': 'Mo.',
        'subscribe.checkout': 'Zur Kasse',
        'subscribe.already_active': 'Bereits abonniert'
    },

    en: {
        // Navigation
        'nav.home': 'Home',
        'nav.trucks': 'Trucks',
        'nav.about': 'About',
        'nav.contact': 'Contact',

        // Hero/Header
        'hero.title': 'Used Trucks from Europe',
        'hero.subtitle': 'Quality vehicles for export to Turkey and Central Asia',

        // Filters
        'filter.title': 'Filters',
        'filter.brand': 'Brand',
        'filter.brand.all': 'All Brands',
        'filter.price': 'Price',
        'filter.price.min': 'Min. Price',
        'filter.price.max': 'Max. Price',
        'filter.year': 'Year',
        'filter.year.from': 'From',
        'filter.year.to': 'To',
        'filter.mileage': 'Mileage',
        'filter.mileage.max': 'Max. km',
        'filter.transmission': 'Transmission',
        'filter.transmission.all': 'All',
        'filter.transmission.automatic': 'Automatic',
        'filter.transmission.manual': 'Manual',
        'filter.emission': 'Emission Class',
        'filter.emission.all': 'All',
        'filter.apply': 'Apply Filters',
        'filter.reset': 'Reset',

        // Sorting
        'sort.title': 'Sort by',
        'sort.newest': 'Newest first',
        'sort.oldest': 'Oldest first',
        'sort.price_asc': 'Price: Low to High',
        'sort.price_desc': 'Price: High to Low',
        'sort.mileage_asc': 'Mileage: Low to High',
        'sort.year_desc': 'Year: Newest first',

        // Truck Card
        'truck.mileage': 'km',
        'truck.power': 'HP',
        'truck.year': 'Year',
        'truck.price_on_request': 'Price on request',
        'truck.vat_margin': 'VAT not applicable',
        'truck.vat_included': 'incl. VAT',
        'truck.vat_excluded': 'excl. VAT',
        'truck.negotiable': 'Negotiable',
        'truck.sold': 'Sold',
        'truck.reserved': 'Reserved',
        'truck.featured': 'Featured',

        // Detail Page
        'detail.back': 'Back to listings',
        'detail.gallery': 'Gallery',
        'detail.video': 'Watch Video',
        'detail.description': 'Description',
        'detail.specs': 'Specifications',
        'detail.features': 'Features',
        'detail.contact': 'Contact',
        'detail.inquiry': 'Send Inquiry',
        'detail.whatsapp': 'WhatsApp',
        'detail.call': 'Call',
        'detail.email': 'Email',
        'detail.share': 'Share',
        'detail.print': 'Print',
        'detail.related': 'Similar Vehicles',

        // Specs
        'spec.brand': 'Brand',
        'spec.model': 'Model',
        'spec.year': 'Year',
        'spec.mileage': 'Mileage',
        'spec.power': 'Power',
        'spec.emission': 'Emission Class',
        'spec.transmission': 'Transmission',
        'spec.cab': 'Cab Type',
        'spec.axles': 'Axle Configuration',
        'spec.fuel_tank': 'Fuel Tank',
        'spec.condition': 'Condition',
        'spec.color': 'Color',

        // Features
        'feature.retarder': 'Retarder',
        'feature.ac': 'Air Conditioning',
        'feature.standheater': 'Auxiliary Heater',
        'feature.navigation': 'Navigation',
        'feature.cruise_control': 'Cruise Control',
        'feature.abs': 'ABS',
        'feature.esp': 'ESP',
        'feature.parking_sensors': 'Parking Sensors',
        'feature.refrigerator': 'Refrigerator',
        'feature.microwave': 'Microwave',
        'feature.tv': 'TV',
        'feature.leather': 'Leather Seats',
        'feature.bed': 'Sleeper Cab',

        // Pagination
        'pagination.prev': 'Previous',
        'pagination.next': 'Next',
        'pagination.of': 'of',
        'pagination.showing': 'Showing',
        'pagination.results': 'results',

        // Status
        'status.loading': 'Loading...',
        'status.no_results': 'No vehicles found',
        'status.error': 'Error loading data',

        // Footer
        'footer.tagline': 'Commercial Vehicles for Export',
        'footer.company': 'Company',
        'footer.legal': 'Legal',
        'footer.impressum': 'Legal Notice',
        'footer.privacy': 'Privacy Policy',
        'footer.terms': 'Terms',
        'footer.copyright': '© 2026 Charwa GmbH. All rights reserved.',

        // Contact
        'contact.title': 'Contact Us',
        'contact.subtitle': 'Interested in a vehicle? We are happy to help.',
        'contact.hours': 'Business hours: Mon-Fri 09:00-18:00 CET',

        // WhatsApp Message Templates
        'whatsapp.inquiry': 'Hello, I am interested in: ',
        'whatsapp.general': 'Hello, I have an inquiry about your vehicles.',

        // Auth
        'nav.login': 'Login',
        'nav.dashboard': 'Dashboard',
        'nav.marketplace': 'Marketplace',
        'auth.email': 'Email',
        'auth.password': 'Password',
        'auth.sign_in': 'Sign In',
        'auth.sign_out': 'Sign Out',
        'auth.sign_up_link': 'Sign Up',
        'auth.sign_in_link': 'Sign In',
        'auth.forgot_password': 'Forgot password?',
        'auth.no_account': 'No account yet?',
        'auth.has_account': 'Already have an account?',
        'auth.full_name': 'Full Name',
        'auth.company': 'Company',
        'auth.create_account': 'Create Account',
        'auth.password_confirm': 'Confirm Password',
        'auth.passwords_mismatch': 'Passwords do not match',
        'auth.login_subtitle': 'Marketplace Intelligence Portal',
        'auth.register_subtitle': 'Create Account',
        'auth.reset_subtitle': 'Reset Password',
        'auth.new_password_subtitle': 'Set New Password',
        'auth.new_password': 'New Password',
        'auth.set_password': 'Set Password',
        'auth.send_reset_link': 'Send Link',
        'auth.back_to_login': 'Back to Login',
        'auth.back_to_site': 'Back to Website',
        'auth.check_email': 'Please check your email for confirmation.',
        'auth.password_reset_sent': 'Password reset link has been sent.',
        'auth.reset_email_sent': 'We have sent you a password reset email.',
        'auth.password_updated': 'Password updated successfully.',
        'auth.login_error': 'Login failed.',
        'auth.register_error': 'Registration failed.',

        // Dashboard
        'dashboard.title': 'Dashboard',
        'dashboard.subtitle': 'Your marketplace subscriptions and data overview',
        'dashboard.active_subs': 'Active Subscriptions',
        'dashboard.total_listings': 'Available Listings',
        'dashboard.available_markets': 'Available Marketplaces',
        'dashboard.status': 'Status',
        'dashboard.status_active': 'Active',
        'dashboard.status_inactive': 'Inactive',
        'dashboard.status_past_due': 'Past Due',
        'dashboard.your_marketplaces': 'Your Marketplaces',
        'dashboard.browse_listings': 'Browse Listings',
        'dashboard.add_marketplace': 'Add Marketplace',
        'dashboard.no_subscriptions': 'You have no active marketplace subscriptions.',
        'dashboard.subscribe_now': 'Subscribe Now',
        'dashboard.active': 'Active',
        'dashboard.listings': 'Listings',
        'dashboard.account': 'Account',
        'dashboard.manage_billing': 'Manage Billing',
        'dashboard.next_billing': 'Next Billing',

        // Browse
        'browse.title': 'Marketplace Listings',
        'browse.subtitle': 'Browse thousands of truck listings from European marketplaces',
        'browse.login_required': 'Login Required',
        'browse.login_hint': 'Please sign in to browse marketplace listings.',
        'browse.no_subs': 'No Active Subscription',
        'browse.no_subs_hint': 'Subscribe to at least one marketplace to see listings.',
        'browse.source': 'Source',
        'browse.view_original': 'View Original on',
        'browse.seller': 'Seller',

        // Subscribe
        'subscribe.title': 'Subscribe to Marketplaces',
        'subscribe.subtitle': 'Select the marketplaces whose listings you want to browse',
        'subscribe.summary': 'Summary',
        'subscribe.select_hint': 'Select marketplaces',
        'subscribe.total': 'Total',
        'subscribe.per_month': '/month',
        'subscribe.month': 'mo.',
        'subscribe.checkout': 'Checkout',
        'subscribe.already_active': 'Already subscribed'
    },

    tr: {
        // Navigation
        'nav.home': 'Ana Sayfa',
        'nav.trucks': 'Araçlar',
        'nav.about': 'Hakkımızda',
        'nav.contact': 'İletişim',

        // Hero/Header
        'hero.title': 'Avrupa\'dan Kullanılmış Kamyonlar',
        'hero.subtitle': 'Türkiye ve Orta Asya\'ya ihracat için kaliteli araçlar',

        // Filters
        'filter.title': 'Filtreler',
        'filter.brand': 'Marka',
        'filter.brand.all': 'Tüm Markalar',
        'filter.price': 'Fiyat',
        'filter.price.min': 'Min. Fiyat',
        'filter.price.max': 'Max. Fiyat',
        'filter.year': 'Yıl',
        'filter.year.from': 'Başlangıç',
        'filter.year.to': 'Bitiş',
        'filter.mileage': 'Kilometre',
        'filter.mileage.max': 'Max. km',
        'filter.transmission': 'Şanzıman',
        'filter.transmission.all': 'Tümü',
        'filter.transmission.automatic': 'Otomatik',
        'filter.transmission.manual': 'Manuel',
        'filter.emission': 'Emisyon Sınıfı',
        'filter.emission.all': 'Tümü',
        'filter.apply': 'Filtrele',
        'filter.reset': 'Sıfırla',

        // Sorting
        'sort.title': 'Sırala',
        'sort.newest': 'En yeni',
        'sort.oldest': 'En eski',
        'sort.price_asc': 'Fiyat: Düşükten Yükseğe',
        'sort.price_desc': 'Fiyat: Yüksekten Düşüğe',
        'sort.mileage_asc': 'Kilometre: Düşükten Yükseğe',
        'sort.year_desc': 'Yıl: En yeni',

        // Truck Card
        'truck.mileage': 'km',
        'truck.power': 'HP',
        'truck.year': 'Yıl',
        'truck.price_on_request': 'Fiyat talep üzerine',
        'truck.vat_margin': 'KDV uygulanmaz',
        'truck.vat_included': 'KDV dahil',
        'truck.vat_excluded': 'KDV hariç',
        'truck.negotiable': 'Pazarlık',
        'truck.sold': 'Satıldı',
        'truck.reserved': 'Rezerve',
        'truck.featured': 'Öne Çıkan',

        // Detail Page
        'detail.back': 'Listeye Dön',
        'detail.gallery': 'Galeri',
        'detail.video': 'Video İzle',
        'detail.description': 'Açıklama',
        'detail.specs': 'Teknik Özellikler',
        'detail.features': 'Donanım',
        'detail.contact': 'İletişim',
        'detail.inquiry': 'Talep Gönder',
        'detail.whatsapp': 'WhatsApp',
        'detail.call': 'Ara',
        'detail.email': 'E-posta',
        'detail.share': 'Paylaş',
        'detail.print': 'Yazdır',
        'detail.related': 'Benzer Araçlar',

        // Specs
        'spec.brand': 'Marka',
        'spec.model': 'Model',
        'spec.year': 'Yıl',
        'spec.mileage': 'Kilometre',
        'spec.power': 'Güç',
        'spec.emission': 'Emisyon Sınıfı',
        'spec.transmission': 'Şanzıman',
        'spec.cab': 'Kabin Tipi',
        'spec.axles': 'Aks Konfigürasyonu',
        'spec.fuel_tank': 'Yakıt Tankı',
        'spec.condition': 'Durum',
        'spec.color': 'Renk',

        // Features
        'feature.retarder': 'Retarder',
        'feature.ac': 'Klima',
        'feature.standheater': 'Webasto',
        'feature.navigation': 'Navigasyon',
        'feature.cruise_control': 'Hız Sabitleyici',
        'feature.abs': 'ABS',
        'feature.esp': 'ESP',
        'feature.parking_sensors': 'Park Sensörü',
        'feature.refrigerator': 'Buzdolabı',
        'feature.microwave': 'Mikrodalga',
        'feature.tv': 'TV',
        'feature.leather': 'Deri Koltuk',
        'feature.bed': 'Yataklı Kabin',

        // Pagination
        'pagination.prev': 'Önceki',
        'pagination.next': 'Sonraki',
        'pagination.of': '/',
        'pagination.showing': 'Gösterilen',
        'pagination.results': 'sonuç',

        // Status
        'status.loading': 'Yükleniyor...',
        'status.no_results': 'Araç bulunamadı',
        'status.error': 'Veri yüklenirken hata oluştu',

        // Footer
        'footer.tagline': 'İhracat İçin Ticari Araçlar',
        'footer.company': 'Şirket',
        'footer.legal': 'Yasal',
        'footer.impressum': 'Yasal Bilgiler',
        'footer.privacy': 'Gizlilik Politikası',
        'footer.terms': 'Şartlar',
        'footer.copyright': '© 2026 Charwa GmbH. Tüm hakları saklıdır.',

        // Contact
        'contact.title': 'Bize Ulaşın',
        'contact.subtitle': 'Bir araçla ilgileniyor musunuz? Size yardımcı olmaktan mutluluk duyarız.',
        'contact.hours': 'Çalışma saatleri: Pzt-Cum 09:00-18:00 CET',

        // WhatsApp Message Templates
        'whatsapp.inquiry': 'Merhaba, şu araçla ilgileniyorum: ',
        'whatsapp.general': 'Merhaba, araçlarınız hakkında bir sorum var.',

        // Auth
        'nav.login': 'Giriş',
        'nav.dashboard': 'Panel',
        'nav.marketplace': 'Pazar Yeri',
        'auth.email': 'E-posta',
        'auth.password': 'Şifre',
        'auth.sign_in': 'Giriş Yap',
        'auth.sign_out': 'Çıkış Yap',
        'auth.sign_up_link': 'Kayıt Ol',
        'auth.sign_in_link': 'Giriş Yap',
        'auth.forgot_password': 'Şifrenizi mi unuttunuz?',
        'auth.no_account': 'Hesabınız yok mu?',
        'auth.has_account': 'Zaten hesabınız var mı?',
        'auth.full_name': 'Ad Soyad',
        'auth.company': 'Şirket',
        'auth.create_account': 'Hesap Oluştur',
        'auth.password_confirm': 'Şifre Tekrar',
        'auth.passwords_mismatch': 'Şifreler uyuşmuyor',
        'auth.login_subtitle': 'Pazar Yeri İstihbarat Portalı',
        'auth.register_subtitle': 'Hesap Oluştur',
        'auth.reset_subtitle': 'Şifre Sıfırla',
        'auth.new_password_subtitle': 'Yeni Şifre Belirle',
        'auth.new_password': 'Yeni Şifre',
        'auth.set_password': 'Şifreyi Ayarla',
        'auth.send_reset_link': 'Bağlantı Gönder',
        'auth.back_to_login': 'Girişe Dön',
        'auth.back_to_site': 'Siteye Dön',
        'auth.check_email': 'Lütfen onay için e-postanızı kontrol edin.',
        'auth.password_reset_sent': 'Şifre sıfırlama bağlantısı gönderildi.',
        'auth.reset_email_sent': 'Size bir şifre sıfırlama e-postası gönderdik.',
        'auth.password_updated': 'Şifre başarıyla güncellendi.',
        'auth.login_error': 'Giriş başarısız.',
        'auth.register_error': 'Kayıt başarısız.',

        // Dashboard
        'dashboard.title': 'Panel',
        'dashboard.subtitle': 'Pazar yeri abonelikleriniz ve veri genel görünümü',
        'dashboard.active_subs': 'Aktif Abonelikler',
        'dashboard.total_listings': 'Mevcut İlanlar',
        'dashboard.available_markets': 'Mevcut Pazar Yerleri',
        'dashboard.status': 'Durum',
        'dashboard.status_active': 'Aktif',
        'dashboard.status_inactive': 'Pasif',
        'dashboard.status_past_due': 'Vadesi Geçmiş',
        'dashboard.your_marketplaces': 'Pazar Yerleriniz',
        'dashboard.browse_listings': 'İlanları Göz At',
        'dashboard.add_marketplace': 'Pazar Yeri Ekle',
        'dashboard.no_subscriptions': 'Aktif pazar yeri aboneliğiniz yok.',
        'dashboard.subscribe_now': 'Şimdi Abone Ol',
        'dashboard.active': 'Aktif',
        'dashboard.listings': 'İlan',
        'dashboard.account': 'Hesap',
        'dashboard.manage_billing': 'Faturalandırmayı Yönet',
        'dashboard.next_billing': 'Sonraki Fatura',

        // Browse
        'browse.title': 'Pazar Yeri İlanları',
        'browse.subtitle': 'Avrupa pazar yerlerinden binlerce kamyon ilanını inceleyin',
        'browse.login_required': 'Giriş Gerekli',
        'browse.login_hint': 'Pazar yeri ilanlarını incelemek için lütfen giriş yapın.',
        'browse.no_subs': 'Aktif Abonelik Yok',
        'browse.no_subs_hint': 'İlanları görmek için en az bir pazar yerine abone olun.',
        'browse.source': 'Kaynak',
        'browse.view_original': 'Orijinali Gör',
        'browse.seller': 'Satıcı',

        // Subscribe
        'subscribe.title': 'Pazar Yerlerine Abone Ol',
        'subscribe.subtitle': 'İlanlarını incelemek istediğiniz pazar yerlerini seçin',
        'subscribe.summary': 'Özet',
        'subscribe.select_hint': 'Pazar yerleri seçin',
        'subscribe.total': 'Toplam',
        'subscribe.per_month': '/ay',
        'subscribe.month': 'ay',
        'subscribe.checkout': 'Ödemeye Geç',
        'subscribe.already_active': 'Zaten abone'
    }
};

// i18n class
class I18n {
    constructor() {
        this.currentLang = localStorage.getItem('charwa_lang') || CONFIG.DEFAULT_LANGUAGE;
    }

    t(key) {
        return TRANSLATIONS[this.currentLang]?.[key] || TRANSLATIONS['de'][key] || key;
    }

    setLanguage(lang) {
        if (TRANSLATIONS[lang]) {
            this.currentLang = lang;
            localStorage.setItem('charwa_lang', lang);
            this.updateDOM();
            document.documentElement.lang = lang;
        }
    }

    getLanguage() {
        return this.currentLang;
    }

    updateDOM() {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            const translation = this.t(key);
            if (translation) {
                el.textContent = translation;
            }
        });

        // Update placeholders
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            const translation = this.t(key);
            if (translation) {
                el.placeholder = translation;
            }
        });
    }

    // Get localized content from truck object
    getLocalizedField(truck, fieldName) {
        const localizedKey = `${fieldName}_${this.currentLang}`;
        return truck[localizedKey] || truck[`${fieldName}_de`] || truck[fieldName] || '';
    }
}

// Global instance
const i18n = new I18n();
