#!/bin/bash

# HRthis - Production Setup Script
# Sets up complete production environment for GitHub Actions deployment

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Configuration
PROJECT_DIR="/root/hrthis"
NGINX_CONF="/etc/nginx/sites-available/hrthis"
NGINX_ENABLED="/etc/nginx/sites-enabled/hrthis"
BACKUP_DIR="/root/hrthis-migration-backup"

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

print_step() {
    echo -e "${PURPLE}[STEP]${NC} $1"
}

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    print_error "Bitte als root ausführen: sudo $0"
    exit 1
fi

echo "🚀 HRthis - Production Setup"
echo "============================"
echo "Setzt komplette Produktionsumgebung auf"
echo "für GitHub Actions Deployment"
echo

print_step "1/10: System Update und Dependencies"
apt update && apt upgrade -y
apt install -y docker.io docker-compose nginx certbot python3-certbot-nginx curl git ufw jq

# Enable and start services
systemctl enable docker
systemctl start docker
systemctl enable nginx
systemctl start nginx

print_success "System Dependencies installiert"

print_step "2/10: Firewall konfigurieren"
# Reset and configure firewall
ufw --force reset
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow 80
ufw allow 443
ufw allow 22
ufw --force enable

print_success "Firewall konfiguriert (SSH, HTTP, HTTPS)"

print_step "3/10: Projekt-Verzeichnis erstellen"
mkdir -p $PROJECT_DIR
cd $PROJECT_DIR

# Clone or prepare for repository
if [ ! -d ".git" ]; then
    print_status "Bereite Git Repository vor..."
    print_warning "Repository wird später von GitHub Actions geklont"
fi

print_success "Projekt-Verzeichnis: $PROJECT_DIR"

print_step "4/10: Docker Compose Production Config"
cat > docker-compose.prod.yml << 'EOF'
version: '3.8'

services:
  # PostgreSQL Database
  hrthis-db:
    image: postgres:16-alpine
    container_name: hrthis-db
    restart: unless-stopped
    environment:
      POSTGRES_DB: hrthis
      POSTGRES_USER: hrthis
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./database-init:/docker-entrypoint-initdb.d
    networks:
      - hrthis-net
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U hrthis -d hrthis"]
      interval: 10s
      timeout: 5s
      retries: 5
    ports:
      - "127.0.0.1:5432:5432"  # Only accessible from localhost

  # Backend API (FastAPI)
  hrthis-backend:
    build: 
      context: ./browo-hrthis-backend
      dockerfile: Dockerfile
    container_name: hrthis-backend
    restart: unless-stopped
    environment:
      - DATABASE_URL=postgresql://hrthis:${POSTGRES_PASSWORD}@hrthis-db:5432/hrthis
      - SECRET_KEY=${SECRET_KEY}
      - ALGORITHM=HS256
      - ACCESS_TOKEN_EXPIRE_MINUTES=30
      - CORS_ORIGINS=["https://hrthis.kibubot.com"]
    depends_on:
      hrthis-db:
        condition: service_healthy
    volumes:
      - ./browo-hrthis-backend/uploads:/app/uploads
      - ./logs:/app/logs
    networks:
      - hrthis-net
    ports:
      - "127.0.0.1:8000:8000"  # Only accessible from localhost
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  # Frontend (React)
  hrthis-frontend:
    build:
      context: ./HRthis
      dockerfile: Dockerfile
      args:
        - REACT_APP_API_URL=https://hrthis-api.kibubot.com
    container_name: hrthis-frontend
    restart: unless-stopped
    networks:
      - hrthis-net
    ports:
      - "127.0.0.1:3000:80"  # Only accessible from localhost
    depends_on:
      - hrthis-backend

networks:
  hrthis-net:
    driver: bridge
    name: hrthis-network

volumes:
  postgres_data:
    name: hrthis-postgres-data
EOF

print_success "Docker Compose Production Config erstellt"

print_step "5/10: Environment Configuration"
cat > .env.production << 'EOF'
# HRthis Production Environment Variables
# This file will be populated by GitHub Actions Secrets

# Database Configuration
POSTGRES_PASSWORD=WILL_BE_SET_BY_GITHUB_ACTIONS

# JWT Configuration  
SECRET_KEY=WILL_BE_SET_BY_GITHUB_ACTIONS

# API Configuration
REACT_APP_API_URL=https://hrthis-api.kibubot.com

# Optional: Email Service
# BREVO_API_KEY=
# BREVO_SENDER_EMAIL=noreply@kibubot.com

# File Upload Configuration
MAX_UPLOAD_SIZE=50MB
ALLOWED_FILE_TYPES=pdf,doc,docx,jpg,jpeg,png

# Logging
LOG_LEVEL=INFO
EOF

print_success "Environment template erstellt"

print_step "6/10: Nginx Reverse Proxy konfigurieren"
cat > $NGINX_CONF << 'EOF'
# HRthis Nginx Configuration - Production Ready
# Rate limiting
limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
limit_req_zone $binary_remote_addr zone=frontend:10m rate=30r/s;

# Frontend - hrthis.kibubot.com
server {
    listen 80;
    server_name hrthis.kibubot.com;
    
    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name hrthis.kibubot.com;

    # SSL Configuration (will be updated by certbot)
    ssl_certificate /etc/letsencrypt/live/hrthis.kibubot.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/hrthis.kibubot.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Rate limiting
    limit_req zone=frontend burst=50 nodelay;

    # Logging
    access_log /var/log/nginx/hrthis-frontend.access.log;
    error_log /var/log/nginx/hrthis-frontend.error.log;

    # Frontend proxy
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeouts
        proxy_connect_timeout 30s;
        proxy_send_timeout 30s;
        proxy_read_timeout 30s;
        
        # Static file caching
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            proxy_pass http://127.0.0.1:3000;
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
}

# Backend API - hrthis-api.kibubot.com
server {
    listen 80;
    server_name hrthis-api.kibubot.com;
    
    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name hrthis-api.kibubot.com;

    # SSL Configuration (will be updated by certbot)
    ssl_certificate /etc/letsencrypt/live/hrthis-api.kibubot.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/hrthis-api.kibubot.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # CORS headers for API
    add_header Access-Control-Allow-Origin "https://hrthis.kibubot.com" always;
    add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS, PATCH" always;
    add_header Access-Control-Allow-Headers "Authorization, Content-Type, Accept, Origin, X-Requested-With" always;
    add_header Access-Control-Allow-Credentials "true" always;

    # Handle preflight requests
    if ($request_method = 'OPTIONS') {
        add_header Access-Control-Allow-Origin "https://hrthis.kibubot.com";
        add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS, PATCH";
        add_header Access-Control-Allow-Headers "Authorization, Content-Type, Accept, Origin, X-Requested-With";
        add_header Access-Control-Allow-Credentials "true";
        add_header Content-Length 0;
        add_header Content-Type text/plain;
        return 204;
    }

    # Rate limiting for API
    limit_req zone=api burst=20 nodelay;

    # Logging
    access_log /var/log/nginx/hrthis-api.access.log;
    error_log /var/log/nginx/hrthis-api.error.log;

    # API proxy
    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Increase timeouts for file uploads
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
        client_max_body_size 50M;
    }
}
EOF

# Enable site and remove default
ln -sf $NGINX_CONF $NGINX_ENABLED
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

print_step "7/10: SSL Zertifikate erstellen"
# Create SSL certificates for both domains
certbot --nginx -d hrthis.kibubot.com -d hrthis-api.kibubot.com \
    --non-interactive --agree-tos --email admin@kibubot.com \
    --redirect

if [ $? -eq 0 ]; then
    print_success "SSL Zertifikate erfolgreich erstellt"
else
    print_warning "SSL Zertifikate konnten nicht erstellt werden - manuell einrichten"
fi

print_step "8/10: Restore Database (falls Backup vorhanden)"
if [ -d "$BACKUP_DIR" ]; then
    print_status "Backup gefunden - Database wiederherstellen..."
    
    # Start temporary database container for restoration
    docker run -d --name temp-postgres -e POSTGRES_PASSWORD=temp123 -p 5433:5432 postgres:16-alpine
    sleep 10
    
    # Find the most recent database backup
    LATEST_BACKUP=$(ls -t $BACKUP_DIR/*db*.sql 2>/dev/null | head -1)
    if [ ! -z "$LATEST_BACKUP" ]; then
        print_status "Restore Database aus: $LATEST_BACKUP"
        cat "$LATEST_BACKUP" | docker exec -i temp-postgres psql -U postgres 2>/dev/null || \
        print_warning "Database-Restore fehlgeschlagen - wird später manuell gemacht"
    fi
    
    # Stop temporary container
    docker stop temp-postgres && docker rm temp-postgres
    
    print_success "Database-Restore abgeschlossen"
else
    print_warning "Kein Backup gefunden - neue leere Database wird erstellt"
fi

print_step "9/10: Management Scripts erstellen und System Services"

# GitHub Actions deployment script
cat > deploy.sh << 'EOF'
#!/bin/bash
# Deployment script called by GitHub Actions

set -e

echo "🚀 Starting HRthis deployment..."

# Pull latest code (done by GitHub Actions)
# Build and restart containers
docker-compose -f docker-compose.prod.yml down || true
docker-compose -f docker-compose.prod.yml up -d --build

# Wait for services to be healthy
echo "⏳ Waiting for services to start..."
sleep 30

# Health check
if docker-compose -f docker-compose.prod.yml ps | grep -q "Up"; then
    echo "✅ Deployment successful!"
    
    # Optional: Send notification
    # curl -X POST "https://hooks.slack.com/..." -d '{"text":"HRthis deployed successfully"}'
    
    exit 0
else
    echo "❌ Deployment failed!"
    docker-compose -f docker-compose.prod.yml logs
    exit 1
fi
EOF

# Management scripts
cat > restart.sh << 'EOF'
#!/bin/bash
echo "🔄 Restarting HRthis..."
docker-compose -f docker-compose.prod.yml restart
echo "✅ Restart complete"
EOF

cat > logs.sh << 'EOF'
#!/bin/bash
docker-compose -f docker-compose.prod.yml logs -f
EOF

cat > status.sh << 'EOF'
#!/bin/bash
echo "📊 HRthis Status:"
echo "=================="
docker-compose -f docker-compose.prod.yml ps
echo
echo "🔍 Health Checks:"
curl -s https://hrthis.kibubot.com > /dev/null && echo "✅ Frontend: OK" || echo "❌ Frontend: FAILED"
curl -s https://hrthis-api.kibubot.com/health > /dev/null && echo "✅ Backend: OK" || echo "❌ Backend: FAILED"
EOF

# Make scripts executable
chmod +x *.sh

print_success "Management Scripts erstellt"

print_step "10/10: System Services und Automatisierung"

# Setup automatic SSL renewal
echo "0 12 * * * /usr/bin/certbot renew --quiet --nginx" | crontab -

# Setup log rotation
cat > /etc/logrotate.d/hrthis << 'EOF'
/root/hrthis/logs/*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    create 0644 root root
    postrotate
        docker-compose -f /root/hrthis/docker-compose.prod.yml restart hrthis-backend
    endscript
}

/var/log/nginx/hrthis*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    create 0644 www-data www-data
    postrotate
        systemctl reload nginx
    endscript
}
EOF

# Create backup script
cat > backup.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/root/backups/hrthis"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

# Database backup
docker exec hrthis-db pg_dump -U hrthis hrthis | gzip > $BACKUP_DIR/database_$DATE.sql.gz

# Files backup  
tar -czf $BACKUP_DIR/uploads_$DATE.tar.gz -C /root/hrthis/browo-hrthis-backend uploads/ 2>/dev/null || true

# Keep only last 7 days
find $BACKUP_DIR -name "*.sql.gz" -mtime +7 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete

echo "Backup completed: $DATE"
EOF

chmod +x backup.sh

# Setup daily backup
echo "0 2 * * * /root/hrthis/backup.sh" | crontab -

print_success "Automatisierung konfiguriert"

# Create GitHub Actions SSH key for server access
if [ ! -f ~/.ssh/github_actions ]; then
    print_status "SSH Key für GitHub Actions erstellen..."
    ssh-keygen -t ed25519 -f ~/.ssh/github_actions -N "" -C "github-actions@hrthis"
    cat ~/.ssh/github_actions.pub >> ~/.ssh/authorized_keys
    print_success "SSH Key erstellt: ~/.ssh/github_actions"
fi

# Final status check
echo
echo "🎉 Production Setup abgeschlossen!"
echo "=================================="
echo "✅ Nginx Reverse Proxy: konfiguriert"
echo "✅ SSL Zertifikate: $(if [ -f /etc/letsencrypt/live/hrthis.kibubot.com/fullchain.pem ]; then echo "aktiv"; else echo "manuell einrichten"; fi)"
echo "✅ Docker Environment: bereit"
echo "✅ Management Scripts: verfügbar"
echo "✅ Backup System: aktiv"
echo "✅ SSH Key für GitHub Actions: ~/.ssh/github_actions"
echo
echo "📋 Nächste Schritte:"
echo "1. GitHub Actions Secrets konfigurieren:"
echo "   - HETZNER_HOST: $(curl -s ifconfig.me)"
echo "   - HETZNER_SSH_KEY: $(cat ~/.ssh/github_actions | base64 -w 0)"
echo "   - POSTGRES_PASSWORD: [sicheres Passwort]"
echo "   - SECRET_KEY: [JWT Secret]"
echo
echo "2. GitHub Actions Workflow deployen"
echo "3. Ersten Deployment testen"
echo
echo "Management Commands:"
echo "  ./deploy.sh     - Manueller Deploy"
echo "  ./restart.sh    - Service Restart"
echo "  ./logs.sh       - Logs anzeigen"
echo "  ./status.sh     - Status prüfen"
echo "  ./backup.sh     - Manuelles Backup"
echo
print_success "🚀 Bereit für GitHub Actions!"
EOF

chmod +x setup-production.sh

print_success "Production Setup Script erstellt"