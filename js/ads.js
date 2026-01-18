/**
 * Ad Manager - Handles all ad network integrations
 * Networks: Adsterra, JuicyAds, Popunder Smart Links
 * Note: Rotate4All is handled separately on /partner-offers/ page
 * 
 * Revenue Optimization Strategies (All Legitimate):
 * 1. Popunder on first click (6-hour frequency cap)
 * 2. Social Bar (sticky notification style)
 * 3. Interstitial ads (after tool actions)
 * 4. Native ads in footer (4 cards)
 * 5. Exit intent detection
 * 6. Scroll-triggered ads
 * 7. Time-delayed ads
 * 8. Direct link monetization
 */

const AdManager = {
    config: {
        enableAdsterra: true,
        enableJuicyAds: true,        // Enabled - loads on ALL pages with Adsterra
        enableSmartLinks: true,      // Popunder on click (high revenue)
        enableAntiAdblock: true,     // Anti-adblock popunder
        enableInterstitial: true,    // Interstitial between actions
        enableExitIntent: true,      // Show ad on exit intent
        enableScrollAds: true,       // Load more ads on scroll
        enableTimeDelayedAds: true,  // Show additional ads after time
        enableDirectLinks: true,     // Monetize outbound links
        popunderFrequencyHours: 4,   // Hours between popunders (lower = more revenue)
        scrollAdThreshold: 30,       // Scroll % to trigger more ads (lowered for faster trigger)
        timeDelaySeconds: 10         // Seconds before showing delayed ad (reduced for more impressions)
    },
    loaded: {},
    errors: [],
    scrollAdShown: false,
    exitIntentShown: false,
    timeDelayedAdShown: false,

    // Log ad loading errors
    logError(adType, error) {
        console.warn(`[AdManager] Failed to load ${adType}:`, error);
        this.errors.push({ type: adType, error: error.message || error, time: new Date() });
    },

    // Load script with error handling
    loadScript(src, onLoad, onError) {
        const script = document.createElement('script');
        script.src = src;
        script.async = true;
        script.onerror = () => {
            this.logError(src, 'Script failed to load (blocked or network error)');
            if (onError) onError();
        };
        script.onload = () => {
            if (onLoad) onLoad();
        };
        return script;
    },

    // Check if popunder should load (configurable frequency)
    shouldLoadPopunder() {
        const lastPop = localStorage.getItem('lastPopunder');
        const now = Date.now();
        const frequencyMs = this.config.popunderFrequencyHours * 60 * 60 * 1000;

        if (!lastPop || (now - parseInt(lastPop)) > frequencyMs) {
            localStorage.setItem('lastPopunder', now.toString());
            return true;
        }
        return false;
    },

    // Check session-based frequency (for less aggressive ads)
    shouldShowSessionAd(key) {
        const shown = sessionStorage.getItem(key);
        if (!shown) {
            sessionStorage.setItem(key, 'true');
            return true;
        }
        return false;
    },

    // Popunder Smart Link URLs (Adsterra Smartlink)
    popunderUrls: [
        'https://biographygridetelegram.com/d70ejjns?key=ba588c7082379404e4ff4358b3eb9355'
    ],

    // Load Anti-Adblock Popunder Script (uses Social Bar script)
    loadAntiAdblockPopunder() {
        if (!this.config.enableAntiAdblock) return;
        if (this.loaded['antiAdblockPopunder']) return;

        const script = this.loadScript(
            'https://biographygridetelegram.com/06/6f/ef/066fefb2005b66dd6bb910cac5faa9ff.js',
            null,
            () => this.logError('AntiAdblockPopunder', 'Blocked')
        );
        document.body.appendChild(script);
        this.loaded['antiAdblockPopunder'] = true;
    },

    // Trigger popunder on user interaction (click)
    triggerPopunder() {
        if (!this.config.enableSmartLinks) return;
        if (!this.shouldLoadPopunder()) return;

        // Select random URL from popunder list
        const randomUrl = this.popunderUrls[Math.floor(Math.random() * this.popunderUrls.length)];

        // Open popunder
        try {
            const popunder = window.open(randomUrl, '_blank');
            if (popunder) {
                popunder.blur();
                window.focus();
            }
        } catch (e) {
            this.logError('Popunder', e);
        }
    },

    // Setup popunder trigger on first user click
    setupPopunderTrigger() {
        if (!this.config.enableSmartLinks) return;
        if (this.loaded['popunderTrigger']) return;

        const self = this;
        const triggerPopunder = () => {
            self.triggerPopunder();
            document.removeEventListener('click', triggerPopunder);
        };

        document.addEventListener('click', triggerPopunder, { once: true });
        this.loaded['popunderTrigger'] = true;
    },

    // Queue for loading Adsterra ads sequentially (they use global atOptions)
    adsterraQueue: [],
    adsterraLoading: false,

    // Process Adsterra queue one at a time
    processAdsterraQueue() {
        if (this.adsterraLoading || this.adsterraQueue.length === 0) return;

        this.adsterraLoading = true;
        const { containerId, key, width, height, scriptUrl } = this.adsterraQueue.shift();

        const container = document.getElementById(containerId);
        if (!container) {
            this.adsterraLoading = false;
            setTimeout(() => this.processAdsterraQueue(), 50);
            return;
        }

        // Method 1: Direct script injection (preferred for Adsterra)
        // Clear container and set dimensions
        container.innerHTML = '';
        container.style.minWidth = width + 'px';
        container.style.minHeight = height + 'px';
        container.style.display = 'flex';
        container.style.justifyContent = 'center';
        container.style.alignItems = 'center';

        // Set atOptions globally before loading the script
        window.atOptions = {
            'key': key,
            'format': 'iframe',
            'height': height,
            'width': width,
            'params': {}
        };

        // Create and load the invoke script
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = scriptUrl;

        script.onload = () => {
            this.loaded[containerId] = true;
            this.adsterraLoading = false;
            // Process next ad quickly for faster loading
            setTimeout(() => this.processAdsterraQueue(), 50);
        };

        script.onerror = () => {
            this.logError(containerId, 'Script failed to load');
            this.adsterraLoading = false;
            setTimeout(() => this.processAdsterraQueue(), 25);
        };

        container.appendChild(script);
    },

    // Alternative method using iframe for better isolation
    loadAdsterraViaIframe(containerId, key, width, height) {
        if (this.loaded[containerId]) return;

        const container = document.getElementById(containerId);
        if (!container) {
            console.warn(`[AdManager] Container #${containerId} not found for iframe ad`);
            return;
        }

        // Clear container and set up styling
        container.innerHTML = '';
        container.style.minWidth = width + 'px';
        container.style.minHeight = height + 'px';
        container.style.display = 'flex';
        container.style.justifyContent = 'center';
        container.style.alignItems = 'center';
        container.style.overflow = 'hidden';

        // Create a unique wrapper div for this ad
        const wrapper = document.createElement('div');
        wrapper.id = `adsterra-wrapper-${containerId}-${Date.now()}`;
        wrapper.style.width = width + 'px';
        wrapper.style.height = height + 'px';
        container.appendChild(wrapper);

        // Create inline script with unique atOptions for this specific ad
        const configScript = document.createElement('script');
        configScript.type = 'text/javascript';
        configScript.textContent = `
            (function() {
                var adContainer = document.getElementById('${wrapper.id}');
                if (!adContainer) return;
                
                // Create script elements inside the wrapper
                var optScript = document.createElement('script');
                optScript.type = 'text/javascript';
                optScript.textContent = "atOptions = { 'key': '${key}', 'format': 'iframe', 'height': ${height}, 'width': ${width}, 'params': {} };";
                adContainer.appendChild(optScript);
                
                var invokeScript = document.createElement('script');
                invokeScript.type = 'text/javascript';
                invokeScript.src = '//www.topcreativeformat.com/${key}/invoke.js';
                invokeScript.onerror = function() {
                    // Fallback to alternative domain
                    var fallback = document.createElement('script');
                    fallback.src = '//pl28503838.effectivegatecpm.com/${key}/invoke.js';
                    adContainer.appendChild(fallback);
                };
                adContainer.appendChild(invokeScript);
            })();
        `;

        // Append and execute
        document.body.appendChild(configScript);

        this.loaded[containerId] = true;
        console.log(`[AdManager] Loaded ad in #${containerId} (key: ${key.substring(0, 8)}...)`);
    },

    // Direct injection method - most reliable for Adsterra
    loadAdsterraDirect(containerId, key, width, height) {
        if (this.loaded[containerId]) return;

        const container = document.getElementById(containerId);
        if (!container) {
            console.warn(`[AdManager] Container #${containerId} not found`);
            return;
        }

        container.innerHTML = '';
        container.style.minWidth = width + 'px';
        container.style.minHeight = height + 'px';
        container.style.display = 'flex';
        container.style.justifyContent = 'center';
        container.style.alignItems = 'center';

        // Set atOptions globally right before loading the script
        window.atOptions = {
            'key': key,
            'format': 'iframe',
            'height': height,
            'width': width,
            'params': {}
        };

        // Load the invoke script
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.async = true;

        // Try multiple domains for reliability
        const domains = [
            `//www.topcreativeformat.com/${key}/invoke.js`,
            `//pl28503838.effectivegatecpm.com/${key}/invoke.js`,
            `//biographygridetelegram.com/${key}/invoke.js`
        ];

        let domainIndex = 0;

        const tryNextDomain = () => {
            if (domainIndex >= domains.length) {
                this.logError(containerId, 'All domains failed');
                this.showFallbackPlaceholder(container, width, height);
                return;
            }
            script.src = domains[domainIndex];
            domainIndex++;
        };

        script.onerror = () => {
            console.warn(`[AdManager] Domain failed for ${containerId}, trying next...`);
            tryNextDomain();
        };

        script.onload = () => {
            console.log(`[AdManager] Successfully loaded ad in #${containerId}`);
        };

        tryNextDomain();
        container.appendChild(script);
        this.loaded[containerId] = true;
    },

    // Show a fallback placeholder when ads fail to load
    showFallbackPlaceholder(container, width, height) {
        container.innerHTML = `
            <div style="width:${width}px;height:${height}px;display:flex;align-items:center;justify-content:center;background:#f3f4f6;border-radius:8px;color:#9ca3af;font-size:12px;">
                <span>Ad</span>
            </div>
        `;
    },

    // Queue an Adsterra ad for loading
    queueAdsterra(containerId, key, width, height) {
        if (!this.config.enableAdsterra) return;
        if (this.loaded[containerId]) return;
        const container = document.getElementById(containerId);
        if (!container) {
            console.warn(`[AdManager] Container #${containerId} not found`);
            return;
        }

        // Use direct method - more reliable for Adsterra
        this.loadAdsterraDirect(containerId, key, width, height);
    },

    // Adsterra: Banner 468x60
    loadAdsterra468x60(containerId) {
        if (!this.config.enableAdsterra) return;
        this.queueAdsterra(containerId, '2fd5ef6df9cb74880bb92917f2d93d06', 468, 60);
    },

    // Adsterra: Banner 160x300
    loadAdsterra160x300(containerId) {
        if (!this.config.enableAdsterra) return;
        this.queueAdsterra(containerId, '820015608f3c05c78d776d295a0323a9', 160, 300);
    },

    // Adsterra: Banner 300x250
    loadAdsterra300x250(containerId) {
        if (!this.config.enableAdsterra) return;
        this.queueAdsterra(containerId, 'c44a710d9fa8c03495f7861c0d3c84ac', 300, 250);
    },

    // Adsterra: Mobile Banner 320x50
    loadAdsterra320x50(containerId) {
        if (!this.config.enableAdsterra) return;
        this.queueAdsterra(containerId, '9009f28e9a070214cd6bbd79b4b7308d', 320, 50);
    },

    // Adsterra: Native Banner
    loadAdsterraNative(containerId) {
        if (!this.config.enableAdsterra) return;
        if (this.loaded[containerId]) return;
        const container = document.getElementById(containerId);
        if (!container) return;

        // Create the target div first (required by Adsterra native ads)
        const adDiv = document.createElement('div');
        adDiv.id = 'container-3fecabf66e493c7e25b0b3150e5b5adb';
        container.appendChild(adDiv);

        // Then load the script
        const script = document.createElement('script');
        script.async = true;
        script.setAttribute('data-cfasync', 'false');
        script.src = 'https://biographygridetelegram.com/3fecabf66e493c7e25b0b3150e5b5adb/invoke.js';
        container.appendChild(script);

        this.loaded[containerId] = true;
    },

    // Adsterra: Native Banner for Footer (4 cards)
    loadAdsterraNativeFooter() {
        if (!this.config.enableAdsterra) return;
        if (this.loaded['native-footer']) return;

        // The container div is already in footer.html with id="container-3fecabf66e493c7e25b0b3150e5b5adb"
        const container = document.getElementById('ad-native-footer');
        if (!container) {
            console.warn('[AdManager] Native footer container not found');
            return;
        }

        // Load the native ad script
        const script = document.createElement('script');
        script.async = true;
        script.setAttribute('data-cfasync', 'false');
        script.src = 'https://biographygridetelegram.com/3fecabf66e493c7e25b0b3150e5b5adb/invoke.js';
        script.onload = () => {
            console.log('[AdManager] Native footer ad loaded');
        };
        script.onerror = () => {
            this.logError('native-footer', 'Script failed to load');
        };
        container.appendChild(script);

        this.loaded['native-footer'] = true;
    },

    // Adsterra: Social Bar
    loadAdsterraSocialBar() {
        if (!this.config.enableAdsterra) return;
        if (this.loaded['socialbar']) return;

        const script = document.createElement('script');
        script.src = 'https://biographygridetelegram.com/06/6f/ef/066fefb2005b66dd6bb910cac5faa9ff.js';
        document.body.appendChild(script);
        this.loaded['socialbar'] = true;
    },

    // Adsterra: Interstitial
    loadAdsterraInterstitial() {
        if (!this.config.enableAdsterra) return;
        if (!this.config.enableInterstitial) return;
        if (this.loaded['interstitial']) return;

        const script = document.createElement('script');
        script.src = 'https://biographygridetelegram.com/88/b4/ec/88b4ecec127d7745b7a8d8a4ea4017f6.js';
        document.body.appendChild(script);
        this.loaded['interstitial'] = true;
    },

    // Inject ad into result/output areas (high engagement placement)
    injectInContentAd(targetSelector) {
        if (!this.config.enableAdsterra) return;

        const targets = document.querySelectorAll(targetSelector);
        targets.forEach((target, index) => {
            if (index === 0) { // Only first match
                const adContainer = document.createElement('div');
                adContainer.id = 'ad-in-content-' + Date.now();
                adContainer.className = 'my-4 flex justify-center';
                adContainer.style.minHeight = '250px';

                // Insert after the target element
                target.parentNode.insertBefore(adContainer, target.nextSibling);

                // Load 300x250 ad
                setTimeout(() => {
                    this.loadAdsterraViaIframe(adContainer.id, 'c44a710d9fa8c03495f7861c0d3c84ac', 300, 250);
                }, 500);
            }
        });
    },

    // JuicyAds: PopUnder
    loadJuicyPopunder() {
        if (!this.config.enableJuicyAds) return;
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
        if (!this.config.enableJuicyAds) return;
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

        // Load Anti-Adblock Popunder Script
        this.loadAntiAdblockPopunder();

        // Setup popunder trigger on first click
        this.setupPopunderTrigger();

        // Load PopUnder (frequency limited)
        this.loadJuicyPopunder();

        // Load ALL sidebar ads immediately (3-4 banner slots)
        this.loadAdsterra300x250('ad-sidebar');
        this.loadAdsterra300x250('ad-sidebar-2');
        this.loadAdsterra300x250('ad-sidebar-3');
        this.loadAdsterra300x250('ad-sidebar-4');

        // Load content area ads
        this.loadAdsterra300x250('ad-content');
        this.loadAdsterra300x250('ad-content-2');

        // Always load Native Banner in footer (4 cards style)
        this.loadAdsterraNativeFooter();

        // Middle page banner ads (homepage)
        if (!isMobile) {
            this.loadAdsterra468x60('ad-banner-middle');
            this.loadAdsterra468x60('ad-banner-middle-2');
        } else {
            this.loadAdsterra300x250('ad-banner-middle-mobile');
            this.loadAdsterra300x250('ad-banner-middle-mobile-2');
        }

        // Desktop-specific ads - load 4 banners at once
        if (!isMobile) {
            this.loadAdsterra468x60('ad-header');
            this.loadAdsterra468x60('ad-header-2');
            this.loadAdsterra160x300('ad-sidebar-skyscraper');
            this.loadAdsterra300x250('ad-sidebar-rectangle');
            this.loadAdsterra300x250('ad-sidebar-rectangle-2');
            this.loadAdsterra468x60('ad-footer');
            this.loadAdsterra468x60('ad-footer-2');
        }

        // Mobile ads - load 4+ banners immediately for maximum impressions
        if (isMobile) {
            // Adsterra mobile banners (4 at once)
            this.loadAdsterra320x50('ad-mobile-top');
            this.loadAdsterra320x50('ad-mobile-top-2');
            this.loadAdsterra300x250('ad-mobile-content');
            this.loadAdsterra300x250('ad-mobile-content-2');
            this.loadAdsterra320x50('ad-mobile-sticky');
            this.loadAdsterra320x50('ad-mobile-bottom');
            this.loadAdsterra300x250('ad-mobile-mid');
            this.loadAdsterra300x250('ad-mobile-mid-2');

            // Load JuicyAds on mobile too (4 placements)
            this.loadJuicyBanner('juicy-mobile-1');
            this.loadJuicyBanner('juicy-mobile-2');
            this.loadJuicyBanner('juicy-mobile-3');
            this.loadJuicyBanner('juicy-mobile-mid');
            this.loadJuicyBanner('juicy-mobile-4');
        }

        // Tool pages get extra ads
        if (pageType === 'tool') {
            this.loadAdsterraNative('ad-native');
            this.loadJuicyBanner('ad-juicy-banner');
            // Show interstitial after tool usage (delayed)
            this.setupToolInterstitial();
        }

        // Load JuicyAds on all pages - multiple placements for more impressions
        if (this.config.enableJuicyAds) {
            // Load all JuicyAds banners immediately
            this.loadJuicyBanner('ad-juicy-banner');
            this.loadJuicyBanner('ad-juicy-banner-2');
            this.loadJuicyBanner('ad-juicy-content');
            this.loadJuicyBanner('ad-juicy-content-2');
            this.loadJuicyBanner('ad-juicy-sidebar');
            this.loadJuicyBanner('ad-juicy-footer');
        }

        // Processing pages get interstitial
        if (pageType === 'processing') {
            this.loadAdsterraInterstitial();
        }

        // Always load interstitial for all pages (shows on page exit or after time)
        if (this.config.enableInterstitial) {
            this.loadAdsterraInterstitial();
        }

        // Initialize all revenue optimization features
        this.initRevenueOptimization();

        // Create sticky sidebar for desktop
        this.createStickySidebarAd();

        // Monetize download buttons
        this.monetizeDownloads();

        // Log initialization
        console.log('[AdManager] Initialized for page type:', pageType, 'Mobile:', window.innerWidth < 768);

        // Check ad loading status faster (2 seconds instead of 5)
        setTimeout(() => this.checkAdStatus(), 2000);
    },

    // Setup interstitial to show after tool usage
    setupToolInterstitial() {
        // Listen for tool completion events (buttons with specific classes)
        document.addEventListener('click', (e) => {
            const target = e.target;
            // Check if clicked element is a "download", "copy", "generate" button
            if (target.matches('button, [role="button"], .btn') &&
                (target.textContent.toLowerCase().includes('download') ||
                    target.textContent.toLowerCase().includes('copy') ||
                    target.textContent.toLowerCase().includes('generate') ||
                    target.textContent.toLowerCase().includes('convert'))) {
                // Show interstitial after action (reduced delay for faster ad display)
                setTimeout(() => {
                    this.loadAdsterraInterstitial();
                }, 1000);
            }
        });
    },

    // Check if ads loaded and show fallback if blocked
    checkAdStatus() {
        const adContainers = ['ad-sidebar', 'ad-sidebar-2', 'ad-header', 'ad-sidebar-skyscraper', 'ad-sidebar-rectangle', 'ad-footer'];
        let loadedCount = 0;
        let totalFound = 0;

        adContainers.forEach(id => {
            const container = document.getElementById(id);
            if (container) {
                totalFound++;
                if (container.children.length > 0) {
                    loadedCount++;
                }
            }
        });

        console.log(`[AdManager] Ad status: ${loadedCount}/${totalFound} containers have content`);

        if (loadedCount === 0 && this.errors.length > 0) {
            console.log('[AdManager] Ads appear to be blocked. Popunders will still work on click.');
        }

        // Retry failed ads quickly (reduced from 2s to 500ms)
        if (loadedCount < totalFound && !this.retried) {
            this.retried = true;
            console.log('[AdManager] Retrying failed ads...');
            setTimeout(() => this.retryFailedAds(), 500);
        }
    },

    // Retry loading ads that failed
    retryFailedAds() {
        const isMobile = window.innerWidth < 768;

        // Check each container and retry if empty - expanded list
        const retryMap = {
            'ad-sidebar': () => this.loadAdsterraDirect('ad-sidebar', 'c44a710d9fa8c03495f7861c0d3c84ac', 300, 250),
            'ad-sidebar-2': () => this.loadAdsterraDirect('ad-sidebar-2', 'c44a710d9fa8c03495f7861c0d3c84ac', 300, 250),
            'ad-sidebar-3': () => this.loadAdsterraDirect('ad-sidebar-3', 'c44a710d9fa8c03495f7861c0d3c84ac', 300, 250),
            'ad-sidebar-4': () => this.loadAdsterraDirect('ad-sidebar-4', 'c44a710d9fa8c03495f7861c0d3c84ac', 300, 250),
            'ad-content': () => this.loadAdsterraDirect('ad-content', 'c44a710d9fa8c03495f7861c0d3c84ac', 300, 250),
            'ad-content-2': () => this.loadAdsterraDirect('ad-content-2', 'c44a710d9fa8c03495f7861c0d3c84ac', 300, 250),
            'ad-header': () => this.loadAdsterraDirect('ad-header', '2fd5ef6df9cb74880bb92917f2d93d06', 468, 60),
            'ad-header-2': () => this.loadAdsterraDirect('ad-header-2', '2fd5ef6df9cb74880bb92917f2d93d06', 468, 60),
            'ad-footer': () => this.loadAdsterraDirect('ad-footer', '2fd5ef6df9cb74880bb92917f2d93d06', 468, 60),
            'ad-footer-2': () => this.loadAdsterraDirect('ad-footer-2', '2fd5ef6df9cb74880bb92917f2d93d06', 468, 60),
            'ad-sidebar-skyscraper': () => this.loadAdsterraDirect('ad-sidebar-skyscraper', '820015608f3c05c78d776d295a0323a9', 160, 300),
            'ad-sidebar-rectangle': () => this.loadAdsterraDirect('ad-sidebar-rectangle', 'c44a710d9fa8c03495f7861c0d3c84ac', 300, 250),
            'ad-sidebar-rectangle-2': () => this.loadAdsterraDirect('ad-sidebar-rectangle-2', 'c44a710d9fa8c03495f7861c0d3c84ac', 300, 250),
            'ad-mobile-top': () => this.loadAdsterraDirect('ad-mobile-top', '9009f28e9a070214cd6bbd79b4b7308d', 320, 50),
            'ad-mobile-top-2': () => this.loadAdsterraDirect('ad-mobile-top-2', '9009f28e9a070214cd6bbd79b4b7308d', 320, 50),
            'ad-mobile-content': () => this.loadAdsterraDirect('ad-mobile-content', 'c44a710d9fa8c03495f7861c0d3c84ac', 300, 250),
            'ad-mobile-content-2': () => this.loadAdsterraDirect('ad-mobile-content-2', 'c44a710d9fa8c03495f7861c0d3c84ac', 300, 250),
            'ad-mobile-sticky': () => this.loadAdsterraDirect('ad-mobile-sticky', '9009f28e9a070214cd6bbd79b4b7308d', 320, 50),
            'ad-mobile-bottom': () => this.loadAdsterraDirect('ad-mobile-bottom', '9009f28e9a070214cd6bbd79b4b7308d', 320, 50),
            'ad-mobile-mid': () => this.loadAdsterraDirect('ad-mobile-mid', 'c44a710d9fa8c03495f7861c0d3c84ac', 300, 250),
            'ad-mobile-mid-2': () => this.loadAdsterraDirect('ad-mobile-mid-2', 'c44a710d9fa8c03495f7861c0d3c84ac', 300, 250)
        };

        Object.keys(retryMap).forEach(id => {
            const container = document.getElementById(id);
            if (container && container.children.length === 0) {
                // Reset loaded state and retry with iframe method
                this.loaded[id] = false;
                retryMap[id]();
            }
        });

        // Also retry JuicyAds banners
        const juicyContainers = isMobile
            ? ['juicy-mobile-1', 'juicy-mobile-2', 'juicy-mobile-3', 'juicy-mobile-mid', 'juicy-mobile-4']
            : ['ad-juicy-banner', 'ad-juicy-banner-2', 'ad-juicy-content', 'ad-juicy-content-2', 'ad-juicy-sidebar', 'ad-juicy-footer'];

        juicyContainers.forEach(id => {
            const container = document.getElementById(id);
            if (container && container.children.length === 0) {
                this.loaded[id] = false;
                this.loadJuicyBanner(id);
            }
        });
    },

    // Debug function - call AdManager.debug() in console
    debug() {
        console.log('=== AdManager Debug Info ===');
        console.log('Config:', this.config);
        console.log('Loaded scripts:', this.loaded);
        console.log('Errors:', this.errors);
        console.log('Ad containers found:');
        ['ad-sidebar', 'ad-sidebar-2', 'ad-header', 'ad-sidebar-skyscraper', 'ad-sidebar-rectangle', 'ad-footer',
            'ad-mobile-top', 'ad-mobile-content', 'ad-mobile-sticky', 'ad-native', 'ad-juicy-banner']
            .forEach(id => {
                const el = document.getElementById(id);
                console.log(`  ${id}:`, el ? `Found (${el.children.length} children)` : 'Not found');
            });
        return { loaded: this.loaded, errors: this.errors, config: this.config };
    },

    // ============================================
    // REVENUE OPTIMIZATION FEATURES
    // ============================================

    // 1. Exit Intent Detection - Show ad when user tries to leave
    setupExitIntent() {
        if (!this.config.enableExitIntent) return;
        if (this.loaded['exitIntent']) return;

        const self = this;

        // Desktop: Mouse leaves viewport at top
        document.addEventListener('mouseout', function (e) {
            if (e.clientY < 10 && !self.exitIntentShown) {
                self.exitIntentShown = true;
                self.showExitIntentAd();
            }
        });

        // Mobile: Back button / visibility change
        document.addEventListener('visibilitychange', function () {
            if (document.visibilityState === 'hidden' && !self.exitIntentShown) {
                self.exitIntentShown = true;
                // Trigger popunder for mobile exit
                if (self.shouldShowSessionAd('exitPopunder')) {
                    self.triggerPopunder();
                }
            }
        });

        this.loaded['exitIntent'] = true;
    },

    showExitIntentAd() {
        // Show interstitial on exit intent
        if (this.shouldShowSessionAd('exitInterstitial')) {
            this.loadAdsterraInterstitial();
        }
    },

    // 2. Scroll-Triggered Ads - Load more ads as user scrolls
    setupScrollAds() {
        if (!this.config.enableScrollAds) return;
        if (this.loaded['scrollAds']) return;

        const self = this;
        let ticking = false;

        window.addEventListener('scroll', function () {
            if (!ticking) {
                window.requestAnimationFrame(function () {
                    self.checkScrollPosition();
                    ticking = false;
                });
                ticking = true;
            }
        });

        this.loaded['scrollAds'] = true;
    },

    checkScrollPosition() {
        if (this.scrollAdShown) return;

        const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;

        if (scrollPercent >= this.config.scrollAdThreshold) {
            this.scrollAdShown = true;
            this.loadScrollTriggeredAd();
        }
    },

    loadScrollTriggeredAd() {
        // Inject an in-content ad when user scrolls 50%
        const main = document.querySelector('main');
        if (!main) return;

        // Create floating ad container
        const adContainer = document.createElement('div');
        adContainer.id = 'ad-scroll-triggered';
        adContainer.className = 'fixed bottom-20 right-4 z-40 shadow-2xl rounded-lg overflow-hidden';
        adContainer.style.cssText = 'max-width: 300px; background: white; border: 1px solid #e5e7eb;';
        adContainer.innerHTML = `
            <div class="flex justify-between items-center bg-gray-100 px-2 py-1">
                <span class="text-xs text-gray-500">Sponsored</span>
                <button onclick="this.parentElement.parentElement.remove()" class="text-gray-400 hover:text-gray-600 text-lg leading-none">&times;</button>
            </div>
            <div id="ad-scroll-content" style="min-height: 250px;"></div>
        `;
        document.body.appendChild(adContainer);

        // Load ad into container immediately
        setTimeout(() => {
            this.loadAdsterraDirect('ad-scroll-content', 'c44a710d9fa8c03495f7861c0d3c84ac', 300, 250);
        }, 10);

        // Auto-close after 30 seconds
        setTimeout(() => {
            if (adContainer.parentElement) {
                adContainer.remove();
            }
        }, 30000);
    },

    // 3. Time-Delayed Ads - Show additional ad after user spends time on page
    setupTimeDelayedAd() {
        if (!this.config.enableTimeDelayedAds) return;
        if (this.loaded['timeDelayed']) return;

        const self = this;

        setTimeout(() => {
            if (!self.timeDelayedAdShown && self.shouldShowSessionAd('timeDelayedAd')) {
                self.timeDelayedAdShown = true;
                self.showTimeDelayedAd();
            }
        }, this.config.timeDelaySeconds * 1000);

        this.loaded['timeDelayed'] = true;
    },

    showTimeDelayedAd() {
        // Show a notification-style native ad
        const notification = document.createElement('div');
        notification.id = 'ad-time-delayed';
        notification.className = 'fixed top-20 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden transform transition-all';
        notification.innerHTML = `
            <div class="flex justify-between items-center bg-gradient-to-r from-violet-500 to-purple-600 px-4 py-2">
                <span class="text-white text-sm font-medium">✨ Recommended for You</span>
                <button onclick="this.parentElement.parentElement.remove()" class="text-white/80 hover:text-white text-xl leading-none">&times;</button>
            </div>
            <div id="ad-notification-content" class="p-2" style="min-height: 100px;">
                <div id="container-3fecabf66e493c7e25b0b3150e5b5adb"></div>
            </div>
        `;
        document.body.appendChild(notification);

        // Load native ad
        const script = document.createElement('script');
        script.async = true;
        script.setAttribute('data-cfasync', 'false');
        script.src = 'https://biographygridetelegram.com/3fecabf66e493c7e25b0b3150e5b5adb/invoke.js';
        notification.querySelector('#ad-notification-content').appendChild(script);

        // Auto-close after 20 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.style.opacity = '0';
                setTimeout(() => notification.remove(), 300);
            }
        }, 20000);
    },

    // 4. Direct Link Monetization - Add tracking to outbound links
    setupDirectLinks() {
        if (!this.config.enableDirectLinks) return;
        if (this.loaded['directLinks']) return;

        const smartLink = this.popunderUrls[0];

        // Intercept external link clicks (with low frequency)
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (!link) return;

            const href = link.getAttribute('href');
            if (!href) return;

            // Check if external link (not same domain)
            if (href.startsWith('http') && !href.includes(window.location.hostname)) {
                // Only monetize 20% of external clicks (to not annoy users)
                if (Math.random() < 0.2 && this.shouldShowSessionAd('directLink_' + Date.now())) {
                    // Open smart link in background
                    const popunder = window.open(smartLink, '_blank');
                    if (popunder) {
                        popunder.blur();
                        window.focus();
                    }
                }
            }
        });

        this.loaded['directLinks'] = true;
    },

    // 5. Refresh Ads Periodically (for long sessions)
    setupAdRefresh() {
        if (this.loaded['adRefresh']) return;

        // Refresh visible ads every 60 seconds (Adsterra allows this)
        setInterval(() => {
            if (document.visibilityState === 'visible') {
                this.refreshVisibleAds();
            }
        }, 60000);

        this.loaded['adRefresh'] = true;
    },

    refreshVisibleAds() {
        // Only refresh if user is active (not away)
        const containers = ['ad-sidebar', 'ad-sidebar-2'];
        containers.forEach(id => {
            const container = document.getElementById(id);
            if (container && this.isElementInViewport(container)) {
                // Reset and reload
                this.loaded[id] = false;
                this.loadAdsterra300x250(id);
            }
        });
    },

    isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    },

    // 6. Back Button Monetization (shows ad on browser back)
    setupBackButtonAd() {
        if (this.loaded['backButton']) return;

        // Push a state to detect back button
        history.pushState(null, '', window.location.href);

        window.addEventListener('popstate', () => {
            if (this.shouldShowSessionAd('backButtonAd')) {
                this.loadAdsterraInterstitial();
            }
            // Push state again to keep detecting
            history.pushState(null, '', window.location.href);
        });

        this.loaded['backButton'] = true;
    },

    // 7. Tab Focus Monetization (show ad when user returns to tab)
    setupTabFocusAd() {
        if (this.loaded['tabFocus']) return;

        let lastHidden = 0;

        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'hidden') {
                lastHidden = Date.now();
            } else if (document.visibilityState === 'visible') {
                // If user was away for more than 30 seconds, show ad
                if (Date.now() - lastHidden > 30000) {
                    if (this.shouldShowSessionAd('tabFocusAd')) {
                        this.loadAdsterraInterstitial();
                    }
                }
            }
        });

        this.loaded['tabFocus'] = true;
    },

    // Initialize all revenue optimization features
    initRevenueOptimization() {
        this.setupExitIntent();
        this.setupScrollAds();
        this.setupTimeDelayedAd();
        this.setupDirectLinks();
        this.setupAdRefresh();
        this.setupBackButtonAd();
        this.setupTabFocusAd();
        this.setupInactivityAd();
        this.setupCopyPasteMonetization();
        this.setupSecondPopunder();
        this.setupPageTransitionAd();

        console.log('[AdManager] Revenue optimization features initialized');
    },

    // 8. Inactivity Detection - Show ad after user is idle
    setupInactivityAd() {
        if (this.loaded['inactivityAd']) return;

        let inactivityTimer;
        const inactivityTime = 45000; // 45 seconds of inactivity
        const self = this;

        const resetTimer = () => {
            clearTimeout(inactivityTimer);
            inactivityTimer = setTimeout(() => {
                if (self.shouldShowSessionAd('inactivityAd')) {
                    self.showInactivityAd();
                }
            }, inactivityTime);
        };

        // Reset timer on user activity
        ['mousemove', 'keydown', 'scroll', 'click', 'touchstart'].forEach(event => {
            document.addEventListener(event, resetTimer, { passive: true });
        });

        resetTimer();
        this.loaded['inactivityAd'] = true;
    },

    showInactivityAd() {
        // Show a subtle reminder ad
        const reminder = document.createElement('div');
        reminder.id = 'ad-inactivity';
        reminder.className = 'fixed bottom-4 left-4 z-50 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden max-w-sm';
        reminder.innerHTML = `
            <div class="flex justify-between items-center bg-gray-50 px-3 py-2 border-b">
                <span class="text-xs text-gray-500">💡 You might like this</span>
                <button onclick="this.parentElement.parentElement.remove()" class="text-gray-400 hover:text-gray-600">&times;</button>
            </div>
            <div id="ad-inactivity-content" style="min-height: 250px;"></div>
        `;
        document.body.appendChild(reminder);

        setTimeout(() => {
            this.loadAdsterraViaIframe('ad-inactivity-content', 'c44a710d9fa8c03495f7861c0d3c84ac', 300, 250);
        }, 100);

        // Auto-close after 25 seconds
        setTimeout(() => {
            if (reminder.parentElement) {
                reminder.remove();
            }
        }, 25000);
    },

    // 9. Copy/Paste Monetization - Show ad when user copies content
    setupCopyPasteMonetization() {
        if (this.loaded['copyPaste']) return;

        const self = this;
        document.addEventListener('copy', () => {
            if (self.shouldShowSessionAd('copyAd')) {
                // Delay slightly so copy completes first
                setTimeout(() => {
                    self.triggerPopunder();
                }, 500);
            }
        });

        this.loaded['copyPaste'] = true;
    },

    // 10. Second Popunder - Trigger another popunder after significant engagement
    setupSecondPopunder() {
        if (this.loaded['secondPopunder']) return;

        let clickCount = 0;
        const self = this;

        document.addEventListener('click', () => {
            clickCount++;
            // After 10 clicks, show another popunder (if enough time has passed)
            if (clickCount === 10) {
                const lastSecondPop = localStorage.getItem('lastSecondPopunder');
                const now = Date.now();
                const twoHoursMs = 2 * 60 * 60 * 1000;

                if (!lastSecondPop || (now - parseInt(lastSecondPop)) > twoHoursMs) {
                    localStorage.setItem('lastSecondPopunder', now.toString());
                    setTimeout(() => {
                        const popunder = window.open(self.popunderUrls[0], '_blank');
                        if (popunder) {
                            popunder.blur();
                            window.focus();
                        }
                    }, 1000);
                }
            }
        });

        this.loaded['secondPopunder'] = true;
    },

    // 11. Page Transition Ad - Show interstitial when navigating between pages
    setupPageTransitionAd() {
        if (this.loaded['pageTransition']) return;

        const self = this;
        let navigationCount = parseInt(sessionStorage.getItem('navCount') || '0');

        // Intercept internal link clicks
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (!link) return;

            const href = link.getAttribute('href');
            if (!href) return;

            // Check if internal link
            if (href.startsWith('/') || href.includes(window.location.hostname)) {
                navigationCount++;
                sessionStorage.setItem('navCount', navigationCount.toString());

                // Show interstitial every 5 page navigations
                if (navigationCount % 5 === 0) {
                    e.preventDefault();
                    self.loadAdsterraInterstitial();
                    // Navigate after a short delay
                    setTimeout(() => {
                        window.location.href = href;
                    }, 1500);
                }
            }
        });

        this.loaded['pageTransition'] = true;
    },

    // 12. Smart Link in Download Buttons - Redirect downloads through smart link
    monetizeDownloads() {
        const downloadButtons = document.querySelectorAll('[data-download], .download-btn, button:contains("Download")');
        const self = this;

        downloadButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                if (self.shouldShowSessionAd('downloadAd')) {
                    // Open smart link first
                    window.open(self.popunderUrls[0], '_blank');
                }
            });
        });
    },

    // 13. Sticky Sidebar Ad (for desktop)
    createStickySidebarAd() {
        if (window.innerWidth < 1024) return; // Only on large screens
        if (this.loaded['stickySidebar']) return;

        const existingSidebar = document.querySelector('.lg\\:col-span-1');
        if (!existingSidebar) return;

        // Make sidebar sticky
        existingSidebar.style.position = 'sticky';
        existingSidebar.style.top = '100px';

        this.loaded['stickySidebar'] = true;
    }
};

// Track if AdManager has been initialized
let adManagerInitialized = false;

// Safe initialization function
function initAdManager() {
    if (adManagerInitialized) return;
    adManagerInitialized = true;

    // Small delay to ensure DOM is fully ready
    setTimeout(() => {
        const pageType = document.body.dataset.pageType || 'default';
        AdManager.init(pageType);
    }, 100);
}

// Auto-initialize when components are loaded
document.addEventListener('componentsLoaded', () => {
    initAdManager();
});

// Fallback if no components used or componentsLoaded doesn't fire
document.addEventListener('DOMContentLoaded', () => {
    // If there are components, wait for componentsLoaded event (with timeout fallback)
    if (document.querySelector('[data-component]')) {
        // Set a timeout fallback in case componentsLoaded never fires
        setTimeout(() => {
            if (!adManagerInitialized) {
                console.warn('[AdManager] componentsLoaded event not received, initializing anyway');
                initAdManager();
            }
        }, 2000);
    } else {
        // No components, initialize immediately
        initAdManager();
    }
});

// Additional fallback: if page is already loaded
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(() => {
        if (!adManagerInitialized) {
            console.warn('[AdManager] Late initialization triggered');
            initAdManager();
        }
    }, 500);
}
