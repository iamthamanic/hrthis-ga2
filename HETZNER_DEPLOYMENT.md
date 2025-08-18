# 🚀 HRthis - Einfache Hetzner Server Deployment

## ✅ **Problem gelöst**: Weg von Coolify-Komplexität

**Vorher**: 6 Docker-Compose Files + Traefik + 13 .env Files  
**Nachher**: 1 Docker-Compose File + Nginx + 1 .env File

## 🎯 **Was du bekommst**

- ✅ **Frontend**: https://hrthis.kibubot.com (React App)
- ✅ **Backend**: https://hrthis-api.kibubot.com (FastAPI + Docs)
- ✅ **Database**: PostgreSQL mit Health Checks
- ✅ **SSL**: Automatische Let's Encrypt Zertifikate
- ✅ **Security**: Rate Limiting, CORS, Security Headers
- ✅ **Backups**: Tägliche automatische Backups
- ✅ **Monitoring**: Container Health Checks

## 🚀 **Deployment auf deinem Hetzner Server**

### 1. Dateien auf Server hochladen
```bash
# Auf deinem lokalen Rechner
scp docker-compose.simple.yml root@DEIN-SERVER:/root/hrthis/
scp nginx.conf root@DEIN-SERVER:/root/hrthis/
scp .env.hetzner root@DEIN-SERVER:/root/hrthis/
scp deploy-hetzner.sh root@DEIN-SERVER:/root/hrthis/

# Dein komplettes HRthis Projekt auch hochladen
scp -r HRthis/ root@DEIN-SERVER:/root/hrthis/
scp -r browo-hrthis-backend/ root@DEIN-SERVER:/root/hrthis/
```

### 2. Ein-Klick Deployment
```bash
# Auf deinem Hetzner Server
ssh root@DEIN-SERVER
cd /root/hrthis
chmod +x deploy-hetzner.sh
./deploy-hetzner.sh
```

**Das Script macht ALLES automatisch:**
- ✅ Installiert Docker, Nginx, Certbot
- ✅ Konfiguriert Firewall (UFW)
- ✅ Erstellt SSL Zertifikate
- ✅ Setzt Nginx Reverse Proxy auf
- ✅ Baut und startet alle Container
- ✅ Richtet Backups ein
- ✅ Erstellt Management Scripts

### 3. Fertig! 🎉

Nach 5-10 Minuten läuft alles:
- **Frontend**: https://hrthis.kibubot.com
- **API Docs**: https://hrthis-api.kibubot.com/docs

## 🛠️ **Management Commands**

```bash
# Status prüfen
docker-compose -f docker-compose.simple.yml ps

# Logs anzeigen  
./logs-hrthis.sh

# Neustart
./restart-hrthis.sh

# Update (nach Code-Änderungen)
./update-hrthis.sh

# Manuelles Backup
/root/backup-hrthis.sh
```

## 🔧 **Konfiguration**

### Domain-Setup
Stelle sicher, dass deine Domains auf den Hetzner Server zeigen:
```
hrthis.kibubot.com      A    DEINE-HETZNER-IP
hrthis-api.kibubot.com  A    DEINE-HETZNER-IP
```

### Environment Variables (.env.hetzner)
```bash
# Database
POSTGRES_PASSWORD=MeinSicheresDBPasswort2024!

# JWT
SECRET_KEY=MeinSehrLangerUndSichererJWTSchluesselIst32ZeichenLang!

# API URL (für Frontend Build)
REACT_APP_API_URL=https://hrthis-api.kibubot.com
```

## 🏗️ **Architektur (Super Einfach)**

```
Internet
    ↓
Nginx (Port 80/443)
    ├── hrthis.kibubot.com → Frontend Container (Port 3000)
    └── hrthis-api.kibubot.com → Backend Container (Port 8000)
                                        ↓
                                PostgreSQL Container (Port 5432)
```

## 🛡️ **Security Features**

- ✅ **SSL/TLS**: Automatische Let's Encrypt Zertifikate
- ✅ **Rate Limiting**: API (10 req/s), Frontend (30 req/s)
- ✅ **CORS**: Korrekt konfiguriert für hrthis.kibubot.com
- ✅ **Security Headers**: X-Frame-Options, CSP, HSTS
- ✅ **Firewall**: Nur SSH, HTTP, HTTPS offen

## 🔄 **Backup & Wartung**

### Automatische Backups (täglich 2:00 Uhr)
- **Database**: PostgreSQL Dump
- **Files**: Upload-Verzeichnis
- **Retention**: 7 Tage

### SSL Renewal (automatisch)
- **Cron Job**: Täglich um 12:00 Uhr
- **Nginx Reload**: Nach erfolgreicher Erneuerung

## 🚨 **Troubleshooting**

### Container prüfen
```bash
docker-compose -f docker-compose.simple.yml ps
docker-compose -f docker-compose.simple.yml logs
```

### Nginx prüfen
```bash
nginx -t
systemctl status nginx
tail -f /var/log/nginx/error.log
```

### SSL prüfen
```bash
certbot certificates
certbot renew --dry-run
```

### Ports prüfen
```bash
netstat -tlnp | grep :80
netstat -tlnp | grep :443
```

## 📊 **Vorteile vs. Coolify**

| Feature | Coolify Setup | Einfache Lösung |
|---------|---------------|-----------------|
| Config Files | 6+ Docker Compose | 1 Docker Compose |
| .env Files | 13 verschiedene | 1 einzige |
| Reverse Proxy | Traefik (komplex) | Nginx (simpel) |
| SSL Setup | Manual/komplex | Automatisch |
| Backup | Manual | Automatisch |
| Updates | UI + komplexe Deps | Git pull + restart |
| Debugging | UI-abhängig | Standard Docker Tools |
| Resource Usage | Höher (Coolify + Services) | Niedriger (nur Services) |

## 🎯 **Was ist anders/besser?**

1. **Ein File statt 6**: docker-compose.simple.yml
2. **Standard Tools**: Nginx statt Traefik
3. **Automatisch**: SSL, Backups, Updates
4. **Debugging**: Standard Docker/Nginx Logs
5. **Performance**: Weniger Overhead
6. **Wartung**: Einfache Shell Scripts

## 🚀 **Ready to Deploy?**

Das komplette Setup ist **produktionsreif** und **viel einfacher** als Coolify!

Einfach das `deploy-hetzner.sh` Script ausführen und in 10 Minuten läuft alles.