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
        'whatsapp.general': 'Hallo, ich habe eine Anfrage zu Ihren Fahrzeugen.'
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
        'whatsapp.general': 'Hello, I have an inquiry about your vehicles.'
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
        'whatsapp.general': 'Merhaba, araçlarınız hakkında bir sorum var.'
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
