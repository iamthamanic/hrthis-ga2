# HRthis Deployment Information

## 🔐 Aktuelle Zugangsdaten

### Demo-Modus (Lokal & Entwicklung)
Im Demo-Modus (`REACT_APP_DEMO_MODE=true`) funktionieren folgende Zugänge:

#### Mitarbeiter-Account
- **Email**: `max.mustermann@hrthis.de`
- **Passwort**: `password` oder `demo`
- **Rolle**: Employee

#### Admin-Account
- **Email**: `anna.admin@hrthis.de`
- **Passwort**: `password` oder `demo`
- **Rolle**: Admin

#### Weitere Test-Accounts
- **Tom Test** (Employee): `tom.test@hrthis.de` / `password`
- **Super Admin**: Verfügbar im System

### Production-Modus
Für Produktion muss ein Backend mit echter Authentifizierung konfiguriert werden.

## 🚀 Deployment-Optionen

### Option 1: Netlify (Frontend) + Railway/Render (Backend) - EMPFOHLEN
**Vorteile:**
- Zero Server-Management
- Automatisches SSL
- CDN für Frontend
- Managed Database

**Deployment-Schritte:**
1. Build erstellen: `npm run build`
2. Netlify CLI: `netlify deploy --prod --dir=build`
3. Backend auf Railway deployen
4. Environment Variables setzen

### Option 2: Docker Container
**Vorteile:**
- Volle Kontrolle
- Self-Hosted
- Ein Container für alles

**Deployment-Schritte:**
1. Docker Image bauen: `docker build -t hrthis .`
2. Container starten: `docker run -p 80:3000 hrthis`
3. Reverse Proxy konfigurieren

### Option 3: Hetzner/VPS mit Docker
**Vorteile:**
- Deutscher Server
- DSGVO-konform
- Gute Performance

## 📁 Build-Dateien

Nach `npm run build`:
- **Build-Ordner**: `HRthis/build/`
- **Statische Dateien**: Bereit für Deployment
- **Größe**: ~10-15 MB

## 🔧 Environment Variables

### Frontend (.env.production)
```env
REACT_APP_API_URL=https://your-api-domain.com
REACT_APP_ENVIRONMENT=production
```

### Backend (.env)
```env
PORT=8002
DATABASE_URL=postgresql://...
JWT_SECRET_KEY=your-secret-key
CORS_ORIGINS=https://your-frontend-domain.com
```

## 🌐 Domains & URLs

### Entwicklung (Lokal)
- Frontend: http://localhost:4173
- Backend: http://localhost:8002
- API Docs: http://localhost:8002/docs

### Production (geplant)
- Frontend: https://hrthis.kibubot.com
- Backend API: https://hrthis-api.kibubot.com

## 📋 Pre-Deployment Checklist

- [x] Build erstellt (`npm run build`)
- [x] Environment Variables konfiguriert
- [x] Demo-Mode für Produktion deaktiviert
- [ ] SSL-Zertifikate eingerichtet
- [ ] Backup-Strategie definiert
- [ ] Monitoring eingerichtet
- [ ] DSGVO-Konformität geprüft

## 🛠️ Quick Deploy Commands

### Netlify Deploy
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy to Netlify
cd HRthis
npm run build
netlify deploy --prod --dir=build
```

### Docker Deploy
```bash
# Build Docker image
docker build -t hrthis:latest .

# Run container
docker run -d \
  -p 80:3000 \
  --name hrthis \
  --env-file .env.production \
  hrthis:latest
```

### Railway Deploy
```bash
# Install Railway CLI
npm install -g @railway/cli

# Deploy
railway login
railway up
```

## 📞 Support & Kontakt

Bei Fragen zum Deployment:
- GitHub Issues: [Repository Link]
- Email: support@kibubot.com

---
*Letzte Aktualisierung: August 2025*