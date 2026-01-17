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
            element.innerHTML = html;

            // Execute any scripts in the loaded component
            const scripts = element.querySelectorAll('script');
            scripts.forEach(script => {
                try {
                    const newScript = document.createElement('script');
                    if (script.src) {
                        newScript.src = script.src;
                    } else {
                        newScript.textContent = script.textContent;
                    }
                    // Remove old script and append new one to parent
                    const parent = script.parentNode;
                    if (parent) {
                        parent.removeChild(script);
                        parent.appendChild(newScript);
                    }
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
