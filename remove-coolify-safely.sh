#!/bin/bash

# HRthis - Coolify Safe Removal Script
# Removes Coolify completely while preserving all data

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Configuration
BACKUP_DIR="/root/hrthis-migration-backup"
DATE=$(date +%Y%m%d_%H%M%S)

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

echo "🗑️  HRthis - Coolify Safe Removal"
echo "=================================="
echo "⚠️  Dies wird Coolify komplett entfernen!"
echo "✅ Aber alle Daten werden gesichert!"
echo
read -p "Fortfahren? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Abgebrochen."
    exit 1
fi

print_step "1/8: Erstelle Backup-Verzeichnis"
mkdir -p $BACKUP_DIR
print_success "Backup-Verzeichnis: $BACKUP_DIR"

print_step "2/8: Stoppe alle laufenden Services"
# Stop all docker containers first
docker stop $(docker ps -q) 2>/dev/null || true
print_success "Alle Container gestoppt"

print_step "3/8: Sichere PostgreSQL Database"
# Find and backup PostgreSQL data
POSTGRES_CONTAINERS=$(docker ps -a --filter "ancestor=postgres" --format "{{.Names}}" || echo "")
if [ ! -z "$POSTGRES_CONTAINERS" ]; then
    for container in $POSTGRES_CONTAINERS; do
        print_status "Sichere Database aus Container: $container"
        
        # Start container if stopped
        docker start $container 2>/dev/null || true
        sleep 5
        
        # Create database dump
        docker exec $container pg_dumpall -U postgres > "$BACKUP_DIR/postgres_dump_${container}_${DATE}.sql" 2>/dev/null || \
        docker exec $container pg_dump -U hrthis hrthis > "$BACKUP_DIR/hrthis_db_${container}_${DATE}.sql" 2>/dev/null || \
        print_warning "Konnte Database aus $container nicht sichern"
        
        # Stop container again
        docker stop $container
    done
    print_success "Database-Dumps erstellt"
else
    print_warning "Keine PostgreSQL Container gefunden"
fi

print_step "4/8: Sichere Docker Volumes"
# Backup all docker volumes
docker volume ls -q | while read volume; do
    print_status "Sichere Volume: $volume"
    docker run --rm -v $volume:/data -v $BACKUP_DIR:/backup alpine tar czf /backup/volume_${volume}_${DATE}.tar.gz -C /data . 2>/dev/null || \
    print_warning "Konnte Volume $volume nicht sichern"
done
print_success "Docker Volumes gesichert"

print_step "5/8: Sichere wichtige Konfigurationsdateien"
# Backup important config files
find /root -name "docker-compose*.yml" -exec cp {} $BACKUP_DIR/ \; 2>/dev/null || true
find /root -name ".env*" -exec cp {} $BACKUP_DIR/ \; 2>/dev/null || true
find /etc/nginx -name "*.conf" -exec cp {} $BACKUP_DIR/ \; 2>/dev/null || true
cp /etc/hosts $BACKUP_DIR/hosts_backup 2>/dev/null || true

# Backup Coolify data if exists
if [ -d "/data/coolify" ]; then
    cp -r /data/coolify $BACKUP_DIR/coolify_config_backup/ 2>/dev/null || true
fi

print_success "Konfigurationsdateien gesichert"

print_step "6/8: Entferne alle Docker Container und Images"
# Remove all containers
docker rm -f $(docker ps -aq) 2>/dev/null || true
print_status "Alle Container entfernt"

# Remove all images (except base images we might need)
docker image rm $(docker image ls -q) 2>/dev/null || true
print_status "Docker Images bereinigt"

# Remove all volumes (we have backups)
docker volume rm $(docker volume ls -q) 2>/dev/null || true
print_status "Docker Volumes entfernt"

# Remove all networks except default ones
docker network rm $(docker network ls | grep -v "bridge\|host\|none" | awk 'NR>1 {print $1}') 2>/dev/null || true
print_status "Docker Networks bereinigt"

print_success "Docker komplett bereinigt"

print_step "7/8: Entferne Coolify Installation"
# Stop Coolify services
systemctl stop coolify 2>/dev/null || true
systemctl disable coolify 2>/dev/null || true

# Remove Coolify installation
rm -rf /data/coolify 2>/dev/null || true
rm -rf /var/lib/coolify 2>/dev/null || true
rm -f /etc/systemd/system/coolify.service 2>/dev/null || true
rm -f /usr/local/bin/coolify 2>/dev/null || true

# Remove Coolify from PATH
sed -i '/coolify/d' /root/.bashrc 2>/dev/null || true

# Remove Coolify Docker networks
docker network rm coolify 2>/dev/null || true

print_success "Coolify vollständig entfernt"

print_step "8/8: System bereinigen und vorbereiten"
# Clean up system
apt autoremove -y 2>/dev/null || true
apt autoclean 2>/dev/null || true

# Remove old nginx configs if they exist
rm -f /etc/nginx/sites-enabled/default 2>/dev/null || true
rm -rf /etc/nginx/sites-available/coolify* 2>/dev/null || true
rm -rf /etc/nginx/sites-enabled/coolify* 2>/dev/null || true

# Reload systemd and nginx
systemctl daemon-reload
systemctl restart nginx 2>/dev/null || true

print_success "System bereinigt"

# Create restoration info
cat > $BACKUP_DIR/RESTORATION_INFO.txt << EOF
HRthis Coolify Removal - Backup Information
==========================================
Date: $DATE
Backup Location: $BACKUP_DIR

Files backed up:
- PostgreSQL dumps: postgres_dump_*.sql
- Docker volumes: volume_*.tar.gz  
- Config files: docker-compose*.yml, .env*
- Nginx configs: *.conf
- Coolify config: coolify_config_backup/

To restore PostgreSQL data:
1. Start new PostgreSQL container
2. Run: cat postgres_dump_*.sql | docker exec -i CONTAINER_NAME psql -U postgres

To restore volumes:
1. Create new volume: docker volume create VOLUME_NAME
2. Extract: docker run --rm -v VOLUME_NAME:/data -v $BACKUP_DIR:/backup alpine tar xzf /backup/volume_*.tar.gz -C /data

Next steps:
1. Run setup-production.sh
2. Configure GitHub Actions
3. Test deployment

EOF

print_success "Backup-Info erstellt: $BACKUP_DIR/RESTORATION_INFO.txt"

echo
echo "🎉 Coolify erfolgreich entfernt!"
echo "================================"
echo "✅ Alle Daten gesichert in: $BACKUP_DIR"
echo "✅ System bereit für neue Konfiguration"
echo
echo "📋 Nächste Schritte:"
echo "1. ./setup-production.sh ausführen"
echo "2. GitHub Actions konfigurieren"
echo "3. Ersten Deployment testen"
echo
print_warning "WICHTIG: Backup-Verzeichnis aufbewahren bis Migration erfolgreich!"
echo
echo "Backup-Größe:"
du -sh $BACKUP_DIR

echo
print_success "🚀 Bereit für das neue Setup!"