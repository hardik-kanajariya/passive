/**
 * Landing Page Redirect Manager
 * Redirects users from the landing page to a random tool after a delay
 */

const RedirectManager = {
    // Configuration - easily adjustable
    config: {
        enabled: true,
        delaySeconds: 8,
        // Set to true to also redirect on category pages
        redirectOnCategoryPages: false
    },

    // List of tool pages for random redirect
    toolPages: [
        '/age-calculator/',
        '/ascii-art/',
        '/barcode-generator/',
        '/base64-encoder/',
        '/base64-to-image/',
        '/binary-converter/',
        '/bmi-calculator/',
        '/case-converter/',
        '/character-counter/',
        '/color-converter/',
        '/color-palette/',
        '/color-picker/',
        '/countdown-timer/',
        '/cron-generator/',
        '/css-minifier/',
        '/csv-to-json/',
        '/currency-converter/',
        '/date-difference/',
        '/diff-checker/',
        '/discount-calculator/',
        '/emoji-picker/',
        '/fake-identity/',
        '/favicon-generator/',
        '/gradient-generator/',
        '/hash-generator/',
        '/hex-converter/',
        '/html-encoder/',
        '/html-minifier/',
        '/html-to-markdown/',
        '/image-compressor/',
        '/image-converter/',
        '/image-resizer/',
        '/image-to-base64/',
        '/ip-lookup/',
        '/js-minifier/',
        '/json-formatter/',
        '/json-minifier/',
        '/json-to-csv/',
        '/json-validator/',
        '/jwt-decoder/',
        '/loan-calculator/',
        '/lorem-ipsum/',
        '/markdown-to-html/',
        '/meta-tag-generator/',
        '/notepad/',
        '/og-generator/',
        '/password-generator/',
        '/percentage-calculator/',
        '/placeholder-image/',
        '/pomodoro-timer/',
        '/qr-code-generator/',
        '/random-number/',
        '/regex-tester/',
        '/remove-line-breaks/',
        '/robots-txt-generator/',
        '/site-analyzer/',
        '/sitemap-generator/',
        '/sql-formatter/',
        '/stopwatch/',
        '/temp-email/',
        '/text-repeater/',
        '/text-reverser/',
        '/text-to-slug/',
        '/text-to-speech/',
        '/timestamp-converter/',
        '/tip-calculator/',
        '/typing-test/',
        '/unit-converter/',
        '/url-encoder/',
        '/username-generator/',
        '/uuid-generator/',
        '/word-counter/',
        '/xml-to-json/',
        '/yaml-to-json/'
    ],

    // Check if current page is the landing page
    isLandingPage() {
        const path = window.location.pathname;
        return path === '/' ||
            path === '/index.html' ||
            path.endsWith('/passive/') ||
            path.endsWith('/passive/index.html');
    },

    // Get a random tool page
    getRandomTool() {
        return this.toolPages[Math.floor(Math.random() * this.toolPages.length)];
    },

    // Redirect to a random tool
    redirectToRandomTool() {
        const randomTool = this.getRandomTool();
        window.location.href = randomTool;
    },

    // Initialize the redirect
    init() {
        if (!this.config.enabled) return;
        if (!this.isLandingPage()) return;

        // Set up the delayed redirect
        this.redirectTimeout = setTimeout(() => {
            this.redirectToRandomTool();
        }, this.config.delaySeconds * 1000);

        console.log(`[RedirectManager] Will redirect in ${this.config.delaySeconds} seconds`);
    },

    // Cancel the redirect (useful if user interacts with the page)
    cancel() {
        if (this.redirectTimeout) {
            clearTimeout(this.redirectTimeout);
            this.redirectTimeout = null;
            console.log('[RedirectManager] Redirect cancelled');
        }
    },

    // Enable/disable redirect
    setEnabled(enabled) {
        this.config.enabled = enabled;
        if (!enabled) this.cancel();
    },

    // Change delay time
    setDelay(seconds) {
        this.config.delaySeconds = seconds;
    }
};

// Auto-initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    RedirectManager.init();
});
