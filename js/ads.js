/**
 * Ad Manager - Professional Placeholder System
 * Premium ad spaces with responsive layouts and strategic placements
 * Designed to showcase valuable advertising real estate
 */

const AdManager = {
    loaded: {},
    
    // Standard IAB Ad Sizes
    adSizes: {
        leaderboard: { width: 728, height: 90, label: 'Leaderboard', mobileWidth: 320, mobileHeight: 50 },
        mediumRectangle: { width: 300, height: 250, label: 'Medium Rectangle' },
        largeRectangle: { width: 336, height: 280, label: 'Large Rectangle' },
        halfPage: { width: 300, height: 600, label: 'Half Page' },
        billboard: { width: 970, height: 250, label: 'Billboard', mobileWidth: 300, mobileHeight: 250 },
        mobileLeaderboard: { width: 320, height: 50, label: 'Mobile Banner' },
        mobileLarge: { width: 320, height: 100, label: 'Mobile Large' },
        skyscraper: { width: 160, height: 600, label: 'Skyscraper' },
        wideSkyscraper: { width: 300, height: 600, label: 'Wide Skyscraper' },
        square: { width: 250, height: 250, label: 'Square' },
        smallSquare: { width: 200, height: 200, label: 'Small Square' },
        banner: { width: 468, height: 60, label: 'Banner' },
        inArticle: { width: 300, height: 250, label: 'In-Article' },
        sticky: { width: 320, height: 50, label: 'Sticky Banner' }
    },

    // Create professional placeholder with branding
    createPlaceholder(type = 'mediumRectangle', options = {}) {
        const size = this.adSizes[type] || this.adSizes.mediumRectangle;
        const isMobile = window.innerWidth < 768;
        const width = isMobile && size.mobileWidth ? size.mobileWidth : size.width;
        const height = isMobile && size.mobileHeight ? size.mobileHeight : size.height;
        const label = options.label || size.label;
        const premium = options.premium || false;
        const position = options.position || '';

        const placeholder = document.createElement('div');
        placeholder.className = `ad-placeholder ad-${type}${premium ? ' ad-premium' : ''}`;
        
        // Determine style based on size and premium status
        const bgGradient = premium 
            ? 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4c1d95 100%)'
            : 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #e2e8f0 100%)';
        const borderColor = premium ? '#6366f1' : '#cbd5e1';
        const textColor = premium ? '#a5b4fc' : '#64748b';
        const accentColor = premium ? '#818cf8' : '#8b5cf6';

        placeholder.style.cssText = `
            width: 100%;
            max-width: ${width}px;
            height: ${height}px;
            background: ${bgGradient};
            border: 1px solid ${borderColor};
            border-radius: 12px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            position: relative;
            overflow: hidden;
            box-sizing: border-box;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            cursor: pointer;
        `;

        // Create inner content based on size
        if (height >= 250) {
            placeholder.innerHTML = this.getLargeAdContent(width, height, label, premium, accentColor, textColor, position);
        } else if (height >= 90) {
            placeholder.innerHTML = this.getMediumAdContent(width, height, label, premium, accentColor, textColor, position);
        } else {
            placeholder.innerHTML = this.getSmallAdContent(width, height, label, premium, accentColor, textColor, position);
        }

        // Hover effects
        placeholder.addEventListener('mouseenter', () => {
            placeholder.style.transform = 'translateY(-2px)';
            placeholder.style.boxShadow = premium 
                ? '0 20px 40px -12px rgba(99, 102, 241, 0.35)'
                : '0 20px 40px -12px rgba(139, 92, 246, 0.25)';
            placeholder.style.borderColor = accentColor;
        });
        placeholder.addEventListener('mouseleave', () => {
            placeholder.style.transform = 'translateY(0)';
            placeholder.style.boxShadow = 'none';
            placeholder.style.borderColor = borderColor;
        });

        return placeholder;
    },

    getLargeAdContent(width, height, label, premium, accentColor, textColor, position) {
        const positionBadge = position ? `<span style="position:absolute;top:12px;left:12px;background:${accentColor};color:white;font-size:9px;font-weight:600;padding:3px 8px;border-radius:4px;text-transform:uppercase;letter-spacing:0.5px;">${position}</span>` : '';
        
        return `
            ${positionBadge}
            <div style="position:absolute;top:12px;right:12px;background:rgba(0,0,0,0.1);padding:3px 8px;border-radius:4px;">
                <span style="font-size:9px;color:${textColor};text-transform:uppercase;letter-spacing:1px;">Ad Space</span>
            </div>
            
            <div style="display:flex;flex-direction:column;align-items:center;gap:16px;padding:24px;text-align:center;">
                <div style="width:64px;height:64px;background:linear-gradient(135deg,${accentColor},#a855f7);border-radius:16px;display:flex;align-items:center;justify-content:center;box-shadow:0 8px 24px -8px ${accentColor}50;">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                        <rect x="3" y="3" width="18" height="18" rx="3"/>
                        <path d="M3 9h18M9 21V9"/>
                        <circle cx="15" cy="15" r="2"/>
                    </svg>
                </div>
                
                <div>
                    <div style="font-size:18px;font-weight:700;color:${premium ? '#e0e7ff' : '#1e293b'};margin-bottom:4px;">${label}</div>
                    <div style="font-size:13px;color:${textColor};margin-bottom:8px;">${width} × ${height} pixels</div>
                    <div style="font-size:11px;color:${premium ? '#818cf8' : '#8b5cf6'};font-weight:500;">Premium Placement Available</div>
                </div>
                
                <div style="display:flex;gap:8px;margin-top:8px;">
                    <span style="background:${premium ? 'rgba(129,140,248,0.2)' : 'rgba(139,92,246,0.1)'};color:${accentColor};font-size:10px;padding:4px 10px;border-radius:20px;font-weight:500;">High Visibility</span>
                    <span style="background:${premium ? 'rgba(129,140,248,0.2)' : 'rgba(139,92,246,0.1)'};color:${accentColor};font-size:10px;padding:4px 10px;border-radius:20px;font-weight:500;">Responsive</span>
                </div>
            </div>
            
            <div style="position:absolute;bottom:0;left:0;right:0;height:3px;background:linear-gradient(90deg,transparent,${accentColor},transparent);opacity:0.5;"></div>
        `;
    },

    getMediumAdContent(width, height, label, premium, accentColor, textColor, position) {
        const positionBadge = position ? `<span style="background:${accentColor};color:white;font-size:8px;font-weight:600;padding:2px 6px;border-radius:3px;margin-right:8px;">${position}</span>` : '';
        
        return `
            <div style="display:flex;align-items:center;justify-content:center;gap:16px;padding:12px 20px;width:100%;box-sizing:border-box;">
                <div style="width:40px;height:40px;min-width:40px;background:linear-gradient(135deg,${accentColor},#a855f7);border-radius:10px;display:flex;align-items:center;justify-content:center;">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                        <rect x="3" y="3" width="18" height="18" rx="3"/>
                        <path d="M3 9h18"/>
                    </svg>
                </div>
                
                <div style="flex:1;min-width:0;">
                    <div style="display:flex;align-items:center;flex-wrap:wrap;gap:4px;">
                        ${positionBadge}
                        <span style="font-size:14px;font-weight:600;color:${premium ? '#e0e7ff' : '#1e293b'};">${label}</span>
                    </div>
                    <div style="font-size:11px;color:${textColor};">${width}×${height} • Premium Space</div>
                </div>
                
                <div style="background:rgba(0,0,0,0.05);padding:2px 8px;border-radius:4px;">
                    <span style="font-size:9px;color:${textColor};text-transform:uppercase;">Ad</span>
                </div>
            </div>
        `;
    },

    getSmallAdContent(width, height, label, premium, accentColor, textColor, position) {
        return `
            <div style="display:flex;align-items:center;justify-content:center;gap:10px;padding:8px 16px;width:100%;box-sizing:border-box;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${accentColor}" stroke-width="2">
                    <rect x="3" y="3" width="18" height="18" rx="3"/>
                </svg>
                <span style="font-size:12px;font-weight:500;color:${premium ? '#c7d2fe' : '#475569'};">${label}</span>
                <span style="font-size:10px;color:${textColor};">${width}×${height}</span>
                <span style="font-size:8px;color:${textColor};background:rgba(0,0,0,0.05);padding:2px 6px;border-radius:3px;margin-left:auto;">AD</span>
            </div>
        `;
    },

    // Create native ad cards (for footer/content recommendations)
    createNativeAds(count = 4) {
        const container = document.createElement('div');
        container.className = 'ad-native-container';
        container.style.cssText = `
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            width: 100%;
            max-width: 900px;
            margin: 0 auto;
            padding: 8px;
        `;

        const categories = ['Technology', 'Business', 'Lifestyle', 'Featured'];
        const colors = ['#6366f1', '#8b5cf6', '#a855f7', '#ec4899'];

        for (let i = 0; i < count; i++) {
            const card = document.createElement('div');
            card.className = 'ad-native-card';
            card.style.cssText = `
                background: linear-gradient(135deg, #1f2937 0%, #374151 100%);
                border-radius: 12px;
                padding: 16px;
                border: 1px solid #4b5563;
                transition: all 0.3s ease;
                cursor: pointer;
            `;

            card.innerHTML = `
                <div style="width:100%;aspect-ratio:16/10;background:linear-gradient(135deg,${colors[i]},${colors[(i+1)%4]});border-radius:8px;margin-bottom:12px;display:flex;align-items:center;justify-content:center;">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.5" opacity="0.7">
                        <rect x="3" y="3" width="18" height="18" rx="2"/>
                        <circle cx="8.5" cy="8.5" r="1.5"/>
                        <path d="M21 15l-5-5L5 21"/>
                    </svg>
                </div>
                <div style="display:flex;align-items:center;gap:6px;margin-bottom:8px;">
                    <span style="font-size:9px;color:#9ca3af;background:#374151;padding:2px 6px;border-radius:3px;">Sponsored</span>
                    <span style="font-size:9px;color:${colors[i]};">${categories[i]}</span>
                </div>
                <div style="height:12px;background:#4b5563;border-radius:4px;margin-bottom:6px;width:90%;"></div>
                <div style="height:10px;background:#4b5563;border-radius:4px;width:70%;"></div>
            `;

            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-4px)';
                card.style.borderColor = colors[i];
                card.style.boxShadow = `0 12px 24px -8px ${colors[i]}30`;
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0)';
                card.style.borderColor = '#4b5563';
                card.style.boxShadow = 'none';
            });

            container.appendChild(card);
        }

        return container;
    },

    // Create in-feed ad (blends with content)
    createInFeedAd() {
        const ad = document.createElement('div');
        ad.className = 'ad-in-feed';
        ad.style.cssText = `
            background: linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%);
            border: 1px solid #e9d5ff;
            border-radius: 16px;
            padding: 20px;
            display: flex;
            gap: 16px;
            align-items: flex-start;
            transition: all 0.3s ease;
            cursor: pointer;
        `;

        ad.innerHTML = `
            <div style="width:80px;height:80px;min-width:80px;background:linear-gradient(135deg,#8b5cf6,#a855f7);border-radius:12px;display:flex;align-items:center;justify-content:center;">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.5">
                    <rect x="3" y="3" width="18" height="18" rx="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <path d="M21 15l-5-5L5 21"/>
                </svg>
            </div>
            <div style="flex:1;">
                <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;">
                    <span style="font-size:10px;color:#7c3aed;background:#ede9fe;padding:3px 8px;border-radius:4px;font-weight:500;">Sponsored</span>
                </div>
                <div style="height:14px;background:#d8b4fe;border-radius:4px;margin-bottom:8px;width:85%;"></div>
                <div style="height:10px;background:#e9d5ff;border-radius:4px;width:100%;margin-bottom:4px;"></div>
                <div style="height:10px;background:#e9d5ff;border-radius:4px;width:60%;"></div>
                <div style="margin-top:12px;display:flex;align-items:center;gap:8px;">
                    <span style="background:#8b5cf6;color:white;font-size:11px;padding:6px 14px;border-radius:6px;font-weight:500;">Learn More</span>
                    <span style="font-size:10px;color:#9333ea;">Ad • 300×250</span>
                </div>
            </div>
        `;

        ad.addEventListener('mouseenter', () => {
            ad.style.transform = 'translateY(-2px)';
            ad.style.boxShadow = '0 12px 24px -8px rgba(139, 92, 246, 0.2)';
            ad.style.borderColor = '#c4b5fd';
        });
        ad.addEventListener('mouseleave', () => {
            ad.style.transform = 'translateY(0)';
            ad.style.boxShadow = 'none';
            ad.style.borderColor = '#e9d5ff';
        });

        return ad;
    },

    // Load placeholder into container with type detection
    loadAd(containerId, type, options = {}) {
        const container = document.getElementById(containerId);
        if (!container || this.loaded[containerId]) return;

        container.innerHTML = '';
        container.style.cssText = `
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
            box-sizing: border-box;
        `;
        
        container.appendChild(this.createPlaceholder(type, options));
        this.loaded[containerId] = true;
    },

    // Inject global styles
    injectStyles() {
        if (document.getElementById('ad-manager-styles')) return;

        const styles = document.createElement('style');
        styles.id = 'ad-manager-styles';
        styles.textContent = `
            .ad-container {
                display: flex;
                justify-content: center;
                align-items: center;
                width: 100%;
                margin: 0 auto;
            }
            
            .ad-wrapper {
                width: 100%;
                display: flex;
                justify-content: center;
                padding: 16px 0;
            }
            
            .ad-section {
                background: #f8fafc;
                border-top: 1px solid #e2e8f0;
                border-bottom: 1px solid #e2e8f0;
                padding: 20px 16px;
                margin: 24px 0;
            }
            
            .ad-section-dark {
                background: linear-gradient(135deg, #1e1b4b 0%, #312e81 100%);
                border: none;
            }
            
            .ad-label {
                text-align: center;
                margin-bottom: 12px;
            }
            
            .ad-label span {
                font-size: 10px;
                color: #94a3b8;
                text-transform: uppercase;
                letter-spacing: 1.5px;
                font-weight: 500;
            }
            
            /* Responsive adjustments */
            @media (max-width: 768px) {
                .ad-placeholder {
                    max-width: 100% !important;
                }
                
                .ad-native-container {
                    grid-template-columns: repeat(2, 1fr) !important;
                    gap: 12px !important;
                }
                
                .ad-native-card {
                    padding: 12px !important;
                }
            }
            
            @media (max-width: 480px) {
                .ad-native-container {
                    grid-template-columns: 1fr !important;
                }
            }
            
            /* Hide real ad iframes */
            iframe[data-aa], iframe[src*="ads"], iframe[src*="acceptable.a-ads"] {
                display: none !important;
            }
        `;
        document.head.appendChild(styles);
    },

    // Initialize all ad placements
    init() {
        console.log('[AdManager] Professional Placeholder System Initialized');
        this.injectStyles();
        this.loadAllPlacements();
        
        // Reload on resize for responsive adjustments
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                this.loaded = {};
                this.loadAllPlacements();
            }, 250);
        });
        
        // Delayed load for dynamic content
        setTimeout(() => this.loadAllPlacements(), 500);
        setTimeout(() => this.loadAllPlacements(), 1500);
    },

    // Load all placements strategically
    loadAllPlacements() {
        const isMobile = window.innerWidth < 768;

        // Homepage banners
        this.loadAd('ad-banner-top', isMobile ? 'mobileLeaderboard' : 'leaderboard', { position: 'Header', premium: true });
        this.loadAd('ad-juicy-banner', isMobile ? 'mediumRectangle' : 'billboard', { position: 'Hero', premium: true });

        // Tool page header
        this.loadAd('ad-header', isMobile ? 'mobileLeaderboard' : 'banner', { position: 'Top' });
        this.loadAd('ad-header-2', isMobile ? 'mobileLeaderboard' : 'banner', { position: 'Top' });

        // Mobile specific
        this.loadAd('ad-mobile-top', 'mobileLeaderboard', { position: 'Mobile Top' });
        this.loadAd('ad-mobile-top-2', 'mobileLeaderboard', { position: 'Mobile' });
        this.loadAd('ad-mobile-sticky', 'sticky', { position: 'Sticky' });
        this.loadAd('ad-mobile-content', 'mediumRectangle', { position: 'Content' });
        this.loadAd('ad-mobile-content-2', 'mediumRectangle', { position: 'Content' });
        this.loadAd('ad-mobile-mid', 'mediumRectangle', { position: 'Mid' });
        this.loadAd('ad-mobile-mid-2', 'mediumRectangle', { position: 'Mid' });
        this.loadAd('ad-mobile-bottom', 'mobileLeaderboard', { position: 'Bottom' });

        // Sidebar ads - high value placements
        this.loadAd('ad-sidebar', 'mediumRectangle', { position: 'Sidebar', premium: true });
        this.loadAd('ad-sidebar-2', 'mediumRectangle', { position: 'Sidebar' });
        this.loadAd('ad-sidebar-3', 'mediumRectangle', { position: 'Sidebar' });
        this.loadAd('ad-sidebar-4', 'mediumRectangle', { position: 'Sidebar' });
        this.loadAd('ad-sidebar-skyscraper', 'skyscraper', { position: 'Sky' });
        this.loadAd('ad-sidebar-rectangle', 'mediumRectangle', { position: 'Side' });
        this.loadAd('ad-sidebar-rectangle-2', 'mediumRectangle', { position: 'Side' });

        // Content ads - in-article placements
        this.loadAd('ad-content', 'mediumRectangle', { position: 'In-Content', premium: true });
        this.loadAd('ad-content-2', 'mediumRectangle', { position: 'Content' });
        this.loadAd('ad-banner-middle', isMobile ? 'mobileLeaderboard' : 'banner', { position: 'Mid-Page' });
        this.loadAd('ad-banner-middle-2', isMobile ? 'mobileLeaderboard' : 'banner', { position: 'Mid-Page' });
        this.loadAd('ad-banner-middle-mobile', 'mediumRectangle', { position: 'Mobile Mid' });
        this.loadAd('ad-banner-middle-mobile-2', 'mediumRectangle', { position: 'Mobile Mid' });

        // Footer banner
        this.loadAd('ad-footer', isMobile ? 'mobileLeaderboard' : 'leaderboard', { position: 'Footer' });
        this.loadAd('ad-footer-2', isMobile ? 'mobileLeaderboard' : 'leaderboard', { position: 'Footer' });

        // Native ads in footer
        const nativeFooter = document.getElementById('ad-native-footer');
        if (nativeFooter && !this.loaded['native-footer']) {
            nativeFooter.innerHTML = '';
            nativeFooter.appendChild(this.createNativeAds(4));
            this.loaded['native-footer'] = true;
        }

        // Auto-detect and fill remaining ad containers
        this.autoFillContainers();
    },

    // Auto-detect remaining ad containers
    autoFillContainers() {
        document.querySelectorAll('[id^="ad-"]:not(.ad-filled)').forEach(container => {
            if (this.loaded[container.id] || container.querySelector('.ad-placeholder')) return;

            const style = window.getComputedStyle(container);
            const minHeight = parseInt(container.style.minHeight) || parseInt(style.height) || 250;
            
            let type = 'mediumRectangle';
            if (minHeight <= 60) type = 'mobileLeaderboard';
            else if (minHeight <= 100) type = 'mobileLarge';
            else if (minHeight >= 600) type = 'halfPage';

            this.loadAd(container.id, type, { label: 'Ad Space' });
            container.classList.add('ad-filled');
        });
    },

    // Debug utility
    debug() {
        console.table(Object.entries(this.loaded).map(([id, loaded]) => ({ id, loaded })));
        return { placements: Object.keys(this.loaded).length, sizes: this.adSizes };
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
