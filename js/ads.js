/**
 * Ad Manager - PLACEHOLDER MODE
 * Shows simple HTML/CSS placeholder ads while real ads are disabled.
 */

const AdManager = {
    loaded: {},

    // Create a placeholder ad element
    createPlaceholder(width, height, label = 'Advertisement') {
        const placeholder = document.createElement('div');
        placeholder.className = 'ad-placeholder';
        placeholder.style.cssText = `
            width: ${width}px;
            height: ${height}px;
            max-width: 100%;
            background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
            border: 2px dashed #d1d5db;
            border-radius: 12px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: #9ca3af;
            font-family: system-ui, -apple-system, sans-serif;
            font-size: 13px;
            text-align: center;
            padding: 10px;
            box-sizing: border-box;
            transition: all 0.3s ease;
        `;

        placeholder.innerHTML = `
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" stroke-width="1.5" style="margin-bottom: 6px; opacity: 0.7;">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <line x1="3" y1="9" x2="21" y2="9"/>
                <line x1="9" y1="21" x2="9" y2="9"/>
            </svg>
            <span style="font-weight: 500; color: #6b7280;">${label}</span>
            <span style="font-size: 10px; color: #9ca3af; margin-top: 2px;">${width}×${height}</span>
        `;

        placeholder.addEventListener('mouseenter', () => {
            placeholder.style.borderColor = '#a78bfa';
            placeholder.style.background = 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)';
        });
        placeholder.addEventListener('mouseleave', () => {
            placeholder.style.borderColor = '#d1d5db';
            placeholder.style.background = 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)';
        });

        return placeholder;
    },

    // Create native ad placeholder (4 cards)
    createNativePlaceholder() {
        const container = document.createElement('div');
        container.style.cssText = 'display: flex; gap: 16px; flex-wrap: wrap; justify-content: center; padding: 16px;';

        for (let i = 0; i < 4; i++) {
            const card = document.createElement('div');
            card.style.cssText = `
                width: 180px;
                padding: 14px;
                background: linear-gradient(135deg, #374151 0%, #4b5563 100%);
                border-radius: 12px;
                border: 2px dashed #6b7280;
                text-align: center;
            `;
            card.innerHTML = `
                <div style="width: 50px; height: 50px; background: #6b7280; border-radius: 8px; margin: 0 auto 10px;"></div>
                <div style="height: 10px; background: #6b7280; border-radius: 4px; margin-bottom: 6px;"></div>
                <div style="height: 8px; background: #6b7280; border-radius: 4px; width: 75%; margin: 0 auto;"></div>
                <div style="color: #9ca3af; font-size: 10px; margin-top: 10px;">Sponsored</div>
            `;
            container.appendChild(card);
        }

        return container;
    },

    // Load placeholder into a container
    loadPlaceholder(containerId, width, height, label = 'Advertisement') {
        const container = document.getElementById(containerId);
        if (!container || this.loaded[containerId]) return;

        container.innerHTML = '';
        container.style.display = 'flex';
        container.style.justifyContent = 'center';
        container.style.alignItems = 'center';
        container.appendChild(this.createPlaceholder(width, height, label));
        this.loaded[containerId] = true;
    },

    // Inject CSS styles
    injectAdStyles() {
        if (document.getElementById('ad-placeholder-styles')) return;

        const styles = document.createElement('style');
        styles.id = 'ad-placeholder-styles';
        styles.textContent = `
            .ad-container, .ad-auto-injected {
                display: flex;
                justify-content: center;
                align-items: center;
                overflow: hidden;
                margin: 10px auto;
            }
            .ad-placeholder:hover {
                border-color: #a78bfa !important;
                background: linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%) !important;
            }
            iframe[data-aa], iframe[src*="ads"], iframe[src*="juicy"] {
                display: none !important;
            }
        `;
        document.head.appendChild(styles);
    },

    // Initialize
    init() {
        console.log('[AdManager] PLACEHOLDER MODE');
        this.injectAdStyles();
        this.loadAllPlaceholders();
        setTimeout(() => this.loadAllPlaceholders(), 500);
        setTimeout(() => this.loadAllPlaceholders(), 1500);
    },

    // Load all placeholders
    loadAllPlaceholders() {
        // Header
        this.loadPlaceholder('ad-header', 468, 60, 'Header Banner');
        this.loadPlaceholder('ad-header-2', 468, 60, 'Header Banner');

        // Mobile
        this.loadPlaceholder('ad-mobile-top', 320, 50, 'Mobile Top');
        this.loadPlaceholder('ad-mobile-top-2', 320, 50, 'Mobile Top');
        this.loadPlaceholder('ad-mobile-sticky', 320, 50, 'Mobile Sticky');
        this.loadPlaceholder('ad-mobile-content', 300, 250, 'Mobile Content');
        this.loadPlaceholder('ad-mobile-content-2', 300, 250, 'Mobile Content');
        this.loadPlaceholder('ad-mobile-mid', 300, 250, 'Mobile Mid');
        this.loadPlaceholder('ad-mobile-mid-2', 300, 250, 'Mobile Mid');
        this.loadPlaceholder('ad-mobile-bottom', 320, 50, 'Mobile Bottom');

        // Sidebar
        this.loadPlaceholder('ad-sidebar', 300, 250, 'Sidebar Ad');
        this.loadPlaceholder('ad-sidebar-2', 300, 250, 'Sidebar Ad');
        this.loadPlaceholder('ad-sidebar-3', 300, 250, 'Sidebar Ad');
        this.loadPlaceholder('ad-sidebar-4', 300, 250, 'Sidebar Ad');
        this.loadPlaceholder('ad-sidebar-skyscraper', 160, 300, 'Skyscraper');
        this.loadPlaceholder('ad-sidebar-rectangle', 300, 250, 'Rectangle');
        this.loadPlaceholder('ad-sidebar-rectangle-2', 300, 250, 'Rectangle');

        // Content
        this.loadPlaceholder('ad-content', 300, 250, 'Content Ad');
        this.loadPlaceholder('ad-content-2', 300, 250, 'Content Ad');
        this.loadPlaceholder('ad-banner-middle', 468, 60, 'Middle Banner');
        this.loadPlaceholder('ad-banner-middle-2', 468, 60, 'Middle Banner');
        this.loadPlaceholder('ad-banner-middle-mobile', 300, 250, 'Mobile Rectangle');
        this.loadPlaceholder('ad-banner-middle-mobile-2', 300, 250, 'Mobile Rectangle');

        // Footer
        this.loadPlaceholder('ad-footer', 468, 60, 'Footer Banner');
        this.loadPlaceholder('ad-footer-2', 468, 60, 'Footer Banner');

        // Native footer
        const nativeFooter = document.getElementById('ad-native-footer');
        if (nativeFooter && !this.loaded['native-footer']) {
            nativeFooter.innerHTML = '';
            nativeFooter.appendChild(this.createNativePlaceholder());
            this.loaded['native-footer'] = true;
        }

        // Auto-detect remaining ad containers
        document.querySelectorAll('[id^="ad-"]:not(.ad-filled)').forEach(container => {
            if (this.loaded[container.id] || container.querySelector('.ad-placeholder')) return;

            const style = window.getComputedStyle(container);
            let width = parseInt(container.style.maxWidth) || parseInt(style.width) || 300;
            let height = parseInt(container.style.minHeight) || parseInt(style.height) || 250;

            if (height < 100 && width > 300) { width = 468; height = 60; }
            else if (height >= 100) { width = 300; height = 250; }

            this.loadPlaceholder(container.id, width, height, 'Ad Space');
            container.classList.add('ad-filled');
        });
    },

    debug() {
        console.log('Loaded:', Object.keys(this.loaded).length, 'containers');
        return this.loaded;
    }
};

// Auto-initialize
let adManagerInitialized = false;

function initAdManager() {
    if (adManagerInitialized) return;
    adManagerInitialized = true;
    setTimeout(() => AdManager.init(), 100);
}

document.addEventListener('componentsLoaded', initAdManager);
document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('[data-component]')) {
        setTimeout(() => { if (!adManagerInitialized) initAdManager(); }, 2000);
    } else {
        initAdManager();
    }
});

if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(() => { if (!adManagerInitialized) initAdManager(); }, 500);
}
