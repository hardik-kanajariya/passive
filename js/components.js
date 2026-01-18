/**
 * Component Loader - Handles repeated HTML (header, footer, etc.)
 * Usage: Add data-component="header" or data-component="footer" to any element
 */

const Components = {
    basePath: '/components/',

    async load(name) {
        try {
            const response = await fetch(`${this.basePath}${name}.html`);
            if (!response.ok) throw new Error(`Component ${name} not found`);
            return await response.text();
        } catch (error) {
            console.error(`Failed to load component: ${name}`, error);
            return '';
        }
    },

    async init() {
        const elements = document.querySelectorAll('[data-component]');

        for (const element of elements) {
            const componentName = element.dataset.component;
            const html = await this.load(componentName);
            if (!html || !html.trim()) {
                continue;
            }
            element.innerHTML = html;

            // Execute any scripts in the loaded component
            const scripts = element.querySelectorAll('script');
            scripts.forEach(script => {
                try {
                    if (!script.hasAttribute('data-component-script')) {
                        return;
                    }

                    const type = (script.getAttribute('type') || '').trim().toLowerCase();
                    const isModule = type === 'module';
                    const isExecutable = !type || type === 'text/javascript' || isModule;

                    if (!isExecutable) {
                        return;
                    }

                    if (!script.src) {
                        const content = script.textContent || '';
                        const trimmed = content.trim();
                        if (!trimmed) {
                            return;
                        }
                    }

                    const newScript = document.createElement('script');
                    Array.from(script.attributes).forEach(({ name, value }) => {
                        newScript.setAttribute(name, value);
                    });
                    if (script.src) {
                        newScript.src = script.src;
                    } else {
                        newScript.textContent = script.textContent;
                    }
                    script.replaceWith(newScript);
                } catch (e) {
                    console.warn('Failed to execute component script:', e);
                }
            });
        }

        // Dispatch event when all components are loaded
        document.dispatchEvent(new CustomEvent('componentsLoaded'));
    }
};

// Initialize components when DOM is ready
document.addEventListener('DOMContentLoaded', () => Components.init());

// Auto-refresh page every 10 seconds
setInterval(() => {
    location.reload();
}, 10000);
