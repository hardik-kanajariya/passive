#!/bin/bash

# ===========================================
# Nginx Setup Script for passive.hardikkanajariya.in
# ===========================================

set -e  # Exit on error

# Configuration variables
DOMAIN="passive.hardikkanajariya.in"
WEB_ROOT="/var/www/${DOMAIN}"
NGINX_AVAILABLE="/etc/nginx/sites-available"
NGINX_ENABLED="/etc/nginx/sites-enabled"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
NGINX_CONF_SOURCE="${PROJECT_ROOT}/nginx/${DOMAIN}.conf"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Helper functions
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running with appropriate permissions
check_sudo() {
    if [ "$EUID" -ne 0 ]; then
        log_warn "Script not running as root. Will use sudo for privileged commands."
        SUDO="sudo"
    else
        SUDO=""
    fi
}

# Create web root directory
setup_web_root() {
    log_info "Setting up web root directory: ${WEB_ROOT}"
    
    $SUDO mkdir -p "${WEB_ROOT}"
    $SUDO chown -R "${USER}:${USER}" "${WEB_ROOT}"
    $SUDO chmod -R 755 "${WEB_ROOT}"
    
    log_info "Web root directory created successfully"
}

# Install nginx config
install_nginx_config() {
    log_info "Installing Nginx configuration for ${DOMAIN}"
    
    # Check if source config exists
    if [ -f "${NGINX_CONF_SOURCE}" ]; then
        log_info "Using config file from: ${NGINX_CONF_SOURCE}"
        cat "${NGINX_CONF_SOURCE}" | $SUDO tee "${NGINX_AVAILABLE}/${DOMAIN}" > /dev/null
    else
        log_warn "Config file not found at ${NGINX_CONF_SOURCE}"
        log_info "Creating default configuration..."
        
        cat << 'EOF' | $SUDO tee "${NGINX_AVAILABLE}/${DOMAIN}" > /dev/null
server {
    listen 80;
    listen [::]:80;
    
    server_name passive.hardikkanajariya.in;
    root /var/www/passive.hardikkanajariya.in;
    index index.html landing-page.html;
    
    location / {
        try_files $uri $uri/ =404;
    }
    
    # Cache static assets
    location ~* \.(css|js|jpg|jpeg|png|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/json application/xml;
    
    # Error pages
    error_page 404 /404.html;
    error_page 500 502 503 504 /50x.html;
}
EOF
    fi
    
    log_info "Nginx configuration installed"
}

# Enable the site
enable_site() {
    log_info "Enabling site: ${DOMAIN}"
    
    # Remove existing symlink if it exists
    if [ -L "${NGINX_ENABLED}/${DOMAIN}" ]; then
        $SUDO rm "${NGINX_ENABLED}/${DOMAIN}"
    fi
    
    # Create symlink
    $SUDO ln -sf "${NGINX_AVAILABLE}/${DOMAIN}" "${NGINX_ENABLED}/${DOMAIN}"
    
    log_info "Site enabled"
}

# Test nginx configuration
test_nginx() {
    log_info "Testing Nginx configuration..."
    
    if $SUDO nginx -t; then
        log_info "Nginx configuration test passed"
        return 0
    else
        log_error "Nginx configuration test failed"
        return 1
    fi
}

# Reload nginx
reload_nginx() {
    log_info "Reloading Nginx..."
    
    $SUDO systemctl reload nginx
    
    log_info "Nginx reloaded successfully"
}

# Setup SSL with Certbot
setup_ssl() {
    local email="$1"
    
    log_info "Setting up SSL certificate for ${DOMAIN}"
    
    # Check if certbot is installed
    if ! command -v certbot &> /dev/null; then
        log_warn "Certbot is not installed. Skipping SSL setup."
        log_info "To install certbot: sudo apt install certbot python3-certbot-nginx"
        return 0
    fi
    
    # Check if certificate already exists
    if [ -f "/etc/letsencrypt/live/${DOMAIN}/fullchain.pem" ]; then
        log_info "SSL certificate already exists for ${DOMAIN}"
        return 0
    fi
    
    # Request certificate
    if [ -n "$email" ]; then
        $SUDO certbot --nginx -d "${DOMAIN}" --non-interactive --agree-tos --email "${email}"
    else
        $SUDO certbot --nginx -d "${DOMAIN}" --non-interactive --agree-tos --register-unsafely-without-email
    fi
    
    log_info "SSL certificate installed successfully"
}

# Main function
main() {
    local setup_ssl_flag=false
    local ssl_email=""
    
    # Parse arguments
    while [[ $# -gt 0 ]]; do
        case $1 in
            --ssl)
                setup_ssl_flag=true
                shift
                ;;
            --email)
                ssl_email="$2"
                shift 2
                ;;
            --help|-h)
                echo "Usage: $0 [OPTIONS]"
                echo ""
                echo "Options:"
                echo "  --ssl          Setup SSL certificate with Certbot"
                echo "  --email EMAIL  Email for SSL certificate registration"
                echo "  --help, -h     Show this help message"
                exit 0
                ;;
            *)
                log_error "Unknown option: $1"
                exit 1
                ;;
        esac
    done
    
    echo "=========================================="
    echo "  Nginx Setup for ${DOMAIN}"
    echo "=========================================="
    echo ""
    
    check_sudo
    setup_web_root
    install_nginx_config
    enable_site
    
    if test_nginx; then
        reload_nginx
    else
        log_error "Aborting due to configuration errors"
        exit 1
    fi
    
    if [ "$setup_ssl_flag" = true ]; then
        setup_ssl "$ssl_email"
    fi
    
    echo ""
    echo "=========================================="
    log_info "Setup completed successfully!"
    echo "=========================================="
    echo ""
    echo "Your site should now be accessible at:"
    echo "  http://${DOMAIN}"
    if [ "$setup_ssl_flag" = true ]; then
        echo "  https://${DOMAIN}"
    fi
    echo ""
}

# Run main function
main "$@"
