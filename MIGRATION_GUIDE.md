# 🚀 HRthis Migration: Coolify → GitHub Actions

## 🎯 **Übersicht**

Komplette Migration von Coolify zu einem einfachen, direkten GitHub Actions Deployment auf deinem Hetzner Server.

**Repository**: https://github.com/iamthamanic/hrthis-ga2

## 📋 **Migration Steps**

### **Phase 1: Backup & Coolify Removal**

#### 1.1 Dateien auf Server hochladen
```bash
# Auf deinem lokalen Rechner
scp remove-coolify-safely.sh root@DEIN-HETZNER-SERVER:/root/
scp setup-production.sh root@DEIN-HETZNER-SERVER:/root/
scp -r .github root@DEIN-HETZNER-SERVER:/root/hrthis/
```

#### 1.2 Coolify sicher entfernen
```bash
# SSH auf deinen Hetzner Server
ssh root@DEIN-HETZNER-SERVER

# Coolify entfernen (mit vollständigem Backup)
chmod +x remove-coolify-safely.sh
./remove-coolify-safely.sh
```

**Das Script sichert automatisch:**
- ✅ Komplette PostgreSQL Database
- ✅ Alle Docker Volumes
- ✅ Konfigurationsdateien
- ✅ Coolify Settings

### **Phase 2: Production Environment Setup**

#### 2.1 Produktionsumgebung einrichten
```bash
# Auf dem Hetzner Server
chmod +x setup-production.sh
./setup-production.sh
```

**Das Script konfiguriert:**
- ✅ Nginx Reverse Proxy
- ✅ SSL Zertifikate (Let's Encrypt)
- ✅ Docker Environment
- ✅ Firewall (UFW)
- ✅ Backup System
- ✅ Management Scripts

### **Phase 3: GitHub Actions Setup**

#### 3.1 GitHub Repository vorbereiten
1. Gehe zu: https://github.com/iamthamanic/hrthis-ga2
2. Füge die `.github/workflows/deploy.yml` Datei hinzu
3. Konfiguriere GitHub Secrets (siehe unten)

#### 3.2 GitHub Secrets konfigurieren

In GitHub: **Settings → Secrets and variables → Actions**

| Secret Name | Wert | Beschreibung |
|-------------|------|--------------|
| `HETZNER_HOST` | `DEINE-SERVER-IP` | IP deines Hetzner Servers |
| `HETZNER_SSH_KEY` | `SSH-PRIVATE-KEY` | SSH Key vom Server (siehe unten) |
| `POSTGRES_PASSWORD` | `sicheres-passwort` | Database Passwort |
| `SECRET_KEY` | `jwt-secret-key` | JWT Secret (min. 32 Zeichen) |

#### 3.3 SSH Key für GitHub Actions

**Auf deinem Hetzner Server:**
```bash
# SSH Key wurde bereits von setup-production.sh erstellt
cat ~/.ssh/github_actions

# Kopiere den COMPLETE private key (inklusive -----BEGIN/END-----)
# Füge ihn als HETZNER_SSH_KEY Secret in GitHub ein
```

### **Phase 4: Erste Deployment**

#### 4.1 Test Deployment
```bash
# Auf deinem lokalen Rechner - irgendeine kleine Änderung machen
git add .
git commit -m "feat: test GitHub Actions deployment"
git push origin main
```

#### 4.2 Deployment überwachen
1. Gehe zu GitHub: **Actions** Tab
2. Schau dir den laufenden Deployment an
3. Nach 2-5 Minuten sollte alles fertig sein

#### 4.3 Live Test
- **Frontend**: https://hrthis.kibubot.com
- **Backend API**: https://hrthis-api.kibubot.com/docs

## 🛠️ **Management Commands**

**Auf deinem Hetzner Server:**

```bash
cd /root/hrthis

# Status prüfen
./status.sh

# Logs anzeigen
./logs.sh

# Manueller Restart
./restart.sh

# Manuelles Backup
./backup.sh

# Manueller Deploy (falls GitHub Actions nicht funktioniert)
./deploy.sh
```

## 🔧 **Konfiguration**

### **Domain Setup (sollte bereits funktionieren)**
```
hrthis.kibubot.com      A    DEINE-HETZNER-IP
hrthis-api.kibubot.com  A    DEINE-HETZNER-IP
```

### **Nginx Konfiguration**
- **Config**: `/etc/nginx/sites-available/hrthis`
- **SSL**: Automatisch via Let's Encrypt
- **Logs**: `/var/log/nginx/hrthis*.log`

### **Docker Services**
- **Frontend**: Port 3000 (internal)
- **Backend**: Port 8000 (internal)  
- **Database**: Port 5432 (internal)
- **Nginx**: Port 80/443 (public)

## 🎯 **Der neue Workflow**

```
1. Du änderst Code lokal
2. git push origin main
3. GitHub Actions startet automatisch
4. Code wird auf Hetzner Server deployed
5. Docker Container werden neu gebaut
6. Services werden neu gestartet
7. Health Checks validieren Deployment
8. Bei Fehlern: Automatischer Rollback
9. Fertig! (30-60 Sekunden Downtime)
```

## 🔍 **Troubleshooting**

### **Deployment Failed?**
```bash
# Auf Hetzner Server
cd /root/hrthis
./logs.sh

# Oder einzelne Services prüfen
docker-compose -f docker-compose.prod.yml logs hrthis-backend
docker-compose -f docker-compose.prod.yml logs hrthis-frontend
docker-compose -f docker-compose.prod.yml logs hrthis-db
```

### **SSL Probleme?**
```bash
# SSL Status prüfen
certbot certificates

# SSL erneuern
certbot renew --nginx

# Nginx neu laden
systemctl reload nginx
```

### **Database Probleme?**
```bash
# Database Status
docker exec hrthis-db pg_isready -U hrthis

# Database Logs
docker logs hrthis-db

# Backup wiederherstellen (falls nötig)
ls /root/hrthis-migration-backup/
```

### **GitHub Actions Debugging**
1. Gehe zu GitHub → Actions Tab
2. Klicke auf den fehlgeschlagenen Run
3. Erweitere die Logs für Details
4. Häufige Probleme:
   - SSH Key falsch konfiguriert
   - Server nicht erreichbar  
   - Docker Build Fehler

## 🆚 **Vorher vs. Nachher**

| **Coolify Setup** | **GitHub Actions Setup** |
|-------------------|---------------------------|
| 6+ Docker Compose Files | 1 Docker Compose File |
| 13+ Environment Files | 1 Environment File |
| Traefik Komplexität | Simple Nginx |
| UI-abhängiges Debugging | Standard Logs |
| Coolify Dependencies | Standard Docker Tools |
| Komplexe SSL Config | Automatic Let's Encrypt |
| Manual Backups | Automatic Daily Backups |

## 🎉 **Benefits**

- ✅ **90% weniger Konfiguration**: 1 statt 6+ Files
- ✅ **Standard Tools**: Nginx, Docker, GitHub Actions
- ✅ **Einfaches Debugging**: Standard Logs statt UI
- ✅ **Automatische Backups**: Täglich um 2 Uhr
- ✅ **Automatic SSL**: Let's Encrypt Integration  
- ✅ **Rollback**: Automatisch bei Deployment Fehlern
- ✅ **Professional CI/CD**: Industry Standard
- ✅ **Weniger Server Load**: Keine Coolify Overhead

## 📞 **Support**

Falls Probleme auftreten:

1. **Logs prüfen**: `./logs.sh`
2. **Status prüfen**: `./status.sh`  
3. **Backup wiederherstellen**: Files in `/root/hrthis-migration-backup/`
4. **Rollback**: Alte Version in `/root/hrthis.backup.*`

Das neue System ist **viel einfacher** und **zuverlässiger** als Coolify! 🚀