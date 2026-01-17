/**
 * Ad Manager - Handles all ad network integrations
 * Only includes active networks: Adsterra, JuicyAds, Rotate4All
 */

const AdManager = {
    loaded: {},

    // Check if popunder should load (1x per 24 hours)
    shouldLoadPopunder() {
        const lastPop = localStorage.getItem('lastPopunder');
        const now = Date.now();
        const dayInMs = 24 * 60 * 60 * 1000;

        if (!lastPop || (now - parseInt(lastPop)) > dayInMs) {
            localStorage.setItem('lastPopunder', now.toString());
            return true;
        }
        return false;
    },

    // Adsterra: Banner 468x60
    loadAdsterra468x60(containerId) {
        if (this.loaded[containerId]) return;
        const container = document.getElementById(containerId);
        if (!container) return;

        window.atOptions = {
            'key': '2fd5ef6df9cb74880bb92917f2d93d06',
            'format': 'iframe',
            'height': 60,
            'width': 468,
            'params': {}
        };

        const script = document.createElement('script');
        script.src = 'https://www.highperformanceformat.com/2fd5ef6df9cb74880bb92917f2d93d06/invoke.js';
        container.appendChild(script);
        this.loaded[containerId] = true;
    },

    // Adsterra: Banner 160x300
    loadAdsterra160x300(containerId) {
        if (this.loaded[containerId]) return;
        const container = document.getElementById(containerId);
        if (!container) return;

        window.atOptions = {
            'key': '820015608f3c05c78d776d295a0323a9',
            'format': 'iframe',
            'height': 300,
            'width': 160,
            'params': {}
        };

        const script = document.createElement('script');
        script.src = 'https://www.highperformanceformat.com/820015608f3c05c78d776d295a0323a9/invoke.js';
        container.appendChild(script);
        this.loaded[containerId] = true;
    },

    // Adsterra: Banner 300x250
    loadAdsterra300x250(containerId) {
        if (this.loaded[containerId]) return;
        const container = document.getElementById(containerId);
        if (!container) return;

        window.atOptions = {
            'key': 'c44a710d9fa8c03495f7861c0d3c84ac',
            'format': 'iframe',
            'height': 250,
            'width': 300,
            'params': {}
        };

        const script = document.createElement('script');
        script.src = 'https://www.highperformanceformat.com/c44a710d9fa8c03495f7861c0d3c84ac/invoke.js';
        container.appendChild(script);
        this.loaded[containerId] = true;
    },

    // Adsterra: Mobile Banner 320x50
    loadAdsterra320x50(containerId) {
        if (this.loaded[containerId]) return;
        const container = document.getElementById(containerId);
        if (!container) return;

        window.atOptions = {
            'key': '9009f28e9a070214cd6bbd79b4b7308d',
            'format': 'iframe',
            'height': 50,
            'width': 320,
            'params': {}
        };

        const script = document.createElement('script');
        script.src = 'https://www.highperformanceformat.com/9009f28e9a070214cd6bbd79b4b7308d/invoke.js';
        container.appendChild(script);
        this.loaded[containerId] = true;
    },

    // Adsterra: Native Banner
    loadAdsterraNative(containerId) {
        if (this.loaded[containerId]) return;
        const container = document.getElementById(containerId);
        if (!container) return;

        const script = document.createElement('script');
        script.async = true;
        script.setAttribute('data-cfasync', 'false');
        script.src = 'https://pl28503854.effectivegatecpm.com/3fecabf66e493c7e25b0b3150e5b5adb/invoke.js';

        const adDiv = document.createElement('div');
        adDiv.id = 'container-3fecabf66e493c7e25b0b3150e5b5adb';

        container.appendChild(script);
        container.appendChild(adDiv);
        this.loaded[containerId] = true;
    },

    // Adsterra: Social Bar
    loadAdsterraSocialBar() {
        if (this.loaded['socialbar']) return;

        const script = document.createElement('script');
        script.src = 'https://pl28503838.effectivegatecpm.com/06/6f/ef/066fefb2005b66dd6bb910cac5faa9ff.js';
        document.body.appendChild(script);
        this.loaded['socialbar'] = true;
    },

    // Adsterra: Interstitial
    loadAdsterraInterstitial() {
        if (this.loaded['interstitial']) return;

        const script = document.createElement('script');
        script.src = 'https://pl28503859.effectivegatecpm.com/88/b4/ec/88b4ecec127d7745b7a8d8a4ea4017f6.js';
        document.body.appendChild(script);
        this.loaded['interstitial'] = true;
    },

    // JuicyAds: PopUnder
    loadJuicyPopunder() {
        if (!this.shouldLoadPopunder()) return;
        if (this.loaded['juicypop']) return;

        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = 'https://js.juicyads.com/jp.php?c=44640333y244u4r2p28403d494&u=https%3A%2F%2Fwww.juicyads.rocks';
        document.body.appendChild(script);
        this.loaded['juicypop'] = true;
    },

    // JuicyAds: Banner 632x190
    loadJuicyBanner(containerId) {
        if (this.loaded[containerId]) return;
        const container = document.getElementById(containerId);
        if (!container) return;

        // Load jads.js if not loaded
        if (!window.adsbyjuicy && !this.loaded['jadsjs']) {
            const jadsScript = document.createElement('script');
            jadsScript.type = 'text/javascript';
            jadsScript.setAttribute('data-cfasync', 'false');
            jadsScript.async = true;
            jadsScript.src = 'https://poweredby.jads.co/js/jads.js';
            document.head.appendChild(jadsScript);
            this.loaded['jadsjs'] = true;
        }

        const ins = document.createElement('ins');
        ins.id = '1109381';
        ins.setAttribute('data-width', '632');
        ins.setAttribute('data-height', '190');
        container.appendChild(ins);

        // Wait for jads.js to load
        const checkAndPush = () => {
            if (window.adsbyjuicy !== undefined) {
                window.adsbyjuicy.push({ 'adzone': 1109381 });
            } else {
                setTimeout(checkAndPush, 100);
            }
        };
        checkAndPush();

        this.loaded[containerId] = true;
    },

    // Initialize ads based on page type
    init(pageType = 'default') {
        const isMobile = window.innerWidth < 768;

        // Always load Social Bar
        this.loadAdsterraSocialBar();

        // Load PopUnder (frequency limited)
        this.loadJuicyPopunder();

        // Desktop ads
        if (!isMobile) {
            this.loadAdsterra468x60('ad-header');
            this.loadAdsterra160x300('ad-sidebar-skyscraper');
            this.loadAdsterra300x250('ad-sidebar-rectangle');
            this.loadAdsterra468x60('ad-footer');
        }

        // Mobile ads
        if (isMobile) {
            this.loadAdsterra320x50('ad-mobile-top');
            this.loadAdsterra300x250('ad-mobile-content');
            this.loadAdsterra320x50('ad-mobile-sticky');
        }

        // Tool pages get extra ads
        if (pageType === 'tool') {
            this.loadAdsterraNative('ad-native');
            this.loadJuicyBanner('ad-juicy-banner');
        }

        // Processing pages get interstitial
        if (pageType === 'processing') {
            this.loadAdsterraInterstitial();
        }
    }
};

// Auto-initialize when components are loaded
document.addEventListener('componentsLoaded', () => {
    const pageType = document.body.dataset.pageType || 'default';
    AdManager.init(pageType);
});

// Fallback if no components used
document.addEventListener('DOMContentLoaded', () => {
    if (!document.querySelector('[data-component]')) {
        const pageType = document.body.dataset.pageType || 'default';
        AdManager.init(pageType);
    }
});
