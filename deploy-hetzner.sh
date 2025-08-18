#!/bin/bash

# HRthis Deployment Script for Hetzner Server
# Simple deployment without Coolify complexity

set -e

echo "🚀 HRthis Deployment für Hetzner Server"
echo "========================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_DIR="/root/hrthis"
NGINX_CONF="/etc/nginx/sites-available/hrthis"
NGINX_ENABLED="/etc/nginx/sites-enabled/hrthis"

# Functions
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    print_error "Bitte als root ausführen: sudo $0"
    exit 1
fi

print_status "Starte HRthis Deployment..."

# Step 1: Update system and install dependencies
print_status "Installiere System-Dependencies..."
apt update && apt upgrade -y
apt install -y docker.io docker-compose nginx certbot python3-certbot-nginx curl git ufw

# Enable and start services
systemctl enable docker
systemctl start docker
systemctl enable nginx
systemctl start nginx

print_success "System-Dependencies installiert"

# Step 2: Setup firewall
print_status "Konfiguriere Firewall..."
ufw --force reset
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow 80
ufw allow 443
ufw --force enable

print_success "Firewall konfiguriert"

# Step 3: Create project directory
print_status "Erstelle Projekt-Verzeichnis..."
mkdir -p $PROJECT_DIR
cd $PROJECT_DIR

# Step 4: Clone or update project (if needed)
if [ ! -d ".git" ]; then
    print_status "Klone HRthis Projekt..."
    # Replace with your actual git repository
    # git clone https://github.com/yourusername/HRthis.git .
    print_warning "Git Repository manuell klonen oder Dateien hochladen"
fi

# Step 5: Setup environment variables
print_status "Konfiguriere Environment Variables..."
if [ ! -f ".env" ]; then
    cp .env.hetzner .env
    print_warning "Bitte .env Datei überprüfen und anpassen!"
    read -p "Enter drücken um fortzufahren..."
fi

# Step 6: Setup SSL certificates
print_status "Erstelle SSL Zertifikate..."
certbot --nginx -d hrthis.kibubot.com -d hrthis-api.kibubot.com --non-interactive --agree-tos --email admin@kibubot.com

print_success "SSL Zertifikate erstellt"

# Step 7: Setup Nginx configuration
print_status "Konfiguriere Nginx..."
cp nginx.conf $NGINX_CONF
ln -sf $NGINX_CONF $NGINX_ENABLED

# Remove default nginx site
rm -f /etc/nginx/sites-enabled/default

# Test nginx configuration
nginx -t
if [ $? -eq 0 ]; then
    print_success "Nginx Konfiguration OK"
    systemctl reload nginx
else
    print_error "Nginx Konfiguration fehlerhaft!"
    exit 1
fi

# Step 8: Build and start containers
print_status "Baue und starte Container..."

# Stop any existing containers
docker-compose -f docker-compose.simple.yml down 2>/dev/null || true

# Build and start
docker-compose -f docker-compose.simple.yml up -d --build

# Wait for services to be healthy
print_status "Warte auf Service-Start..."
sleep 30

# Check if services are running
if docker-compose -f docker-compose.simple.yml ps | grep -q "Up"; then
    print_success "Container erfolgreich gestartet"
else
    print_error "Container-Start fehlgeschlagen!"
    docker-compose -f docker-compose.simple.yml logs
    exit 1
fi

# Step 9: Setup automatic SSL renewal
print_status "Konfiguriere automatische SSL-Erneuerung..."
echo "0 12 * * * /usr/bin/certbot renew --quiet" | crontab -

# Step 10: Setup log rotation
print_status "Konfiguriere Log-Rotation..."
cat > /etc/logrotate.d/hrthis << 'EOF'
/root/hrthis/logs/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 0644 root root
    postrotate
        docker-compose -f /root/hrthis/docker-compose.simple.yml restart
    endscript
}
EOF

# Step 11: Create backup script
print_status "Erstelle Backup-Script..."
cat > /root/backup-hrthis.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/root/backups/hrthis"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

# Database backup
docker exec hrthis-db pg_dump -U hrthis hrthis > $BACKUP_DIR/database_$DATE.sql

# Files backup
tar -czf $BACKUP_DIR/uploads_$DATE.tar.gz -C /root/hrthis/browo-hrthis-backend uploads/

# Keep only last 7 days
find $BACKUP_DIR -name "*.sql" -mtime +7 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete

echo "Backup completed: $DATE"
EOF

chmod +x /root/backup-hrthis.sh

# Setup daily backup
echo "0 2 * * * /root/backup-hrthis.sh" | crontab -

print_success "Backup-System konfiguriert"

# Step 12: Create management scripts
print_status "Erstelle Management-Scripts..."

# Restart script
cat > restart-hrthis.sh << 'EOF'
#!/bin/bash
cd /root/hrthis
docker-compose -f docker-compose.simple.yml down
docker-compose -f docker-compose.simple.yml up -d
echo "HRthis neu gestartet"
EOF

# Update script
cat > update-hrthis.sh << 'EOF'
#!/bin/bash
cd /root/hrthis
git pull
docker-compose -f docker-compose.simple.yml down
docker-compose -f docker-compose.simple.yml up -d --build
echo "HRthis aktualisiert"
EOF

# Logs script
cat > logs-hrthis.sh << 'EOF'
#!/bin/bash
cd /root/hrthis
docker-compose -f docker-compose.simple.yml logs -f
EOF

chmod +x *.sh

print_success "Management-Scripts erstellt"

# Final status check
print_status "Führe finale Überprüfung durch..."

# Check if frontend is accessible
if curl -s -o /dev/null -w "%{http_code}" https://hrthis.kibubot.com | grep -q "200\|302"; then
    print_success "Frontend erreichbar: https://hrthis.kibubot.com"
else
    print_warning "Frontend möglicherweise noch nicht verfügbar"
fi

# Check if backend is accessible
if curl -s -o /dev/null -w "%{http_code}" https://hrthis-api.kibubot.com/docs | grep -q "200"; then
    print_success "Backend API erreichbar: https://hrthis-api.kibubot.com/docs"
else
    print_warning "Backend API möglicherweise noch nicht verfügbar"
fi

# Display service status
print_status "Service Status:"
docker-compose -f docker-compose.simple.yml ps

echo
print_success "🎉 HRthis Deployment abgeschlossen!"
echo
echo "Frontend: https://hrthis.kibubot.com"
echo "Backend API: https://hrthis-api.kibubot.com/docs"
echo
echo "Management Commands:"
echo "  ./restart-hrthis.sh  - Neustart"
echo "  ./update-hrthis.sh   - Update"
echo "  ./logs-hrthis.sh     - Log anzeigen"
echo "  /root/backup-hrthis.sh - Manuelles Backup"
echo
echo "Logs: docker-compose -f docker-compose.simple.yml logs -f"
echo "Status: docker-compose -f docker-compose.simple.yml ps"