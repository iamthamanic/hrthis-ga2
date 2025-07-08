# HRthis

**HRthis** ist eine umfassende HR-Management-Plattform für Mitarbeiterverwaltung, Zeiterfassung, Urlaubsverwaltung und Dokumenteneinsicht – entwickelt als Monorepo mit separatem Backend und Frontend.

## 🚀 Aktuelle Features

### Frontend (React)
- 🕒 Arbeitszeiterfassung (Ein- und Ausstempeln)
- 📅 Urlaubsantrag und -verwaltung
- 🤒 Krankmeldungen verwalten
- 📄 Zugriff auf Lohnabrechnungen und Dokumente
- 👤 Mitarbeiterprofil & Benachrichtigungen
- 👥 Teamverwaltung für Admins
- 📊 Dashboard mit Statistiken
- 🎮 Gamification-System (Avatare, Level, XP)

### Backend (Python/FastAPI)
- 🔐 JWT-basierte Authentifizierung
- 👤 Benutzerverwaltung mit Rollen (Superadmin, Admin, User)
- 🏢 Team- und Abteilungsverwaltung
- 📅 Abwesenheitsverwaltung (Urlaub, Krankheit, etc.)
- 📄 Dokumentenverwaltung
- 🎮 Avatar-System mit Leveln und Achievements
- 🔄 Echtzeit-Updates über WebSockets

## 📱 Tech Stack

### Frontend
- **React** mit TypeScript
- **Tailwind CSS** für Styling
- **Axios** für API-Kommunikation
- **React Router** für Navigation

### Backend
- **FastAPI** (Python)
- **PostgreSQL** Datenbank
- **Alembic** für Datenbankmigrationen
- **JWT** für Authentifizierung
- **Pydantic** für Datenvalidierung

## 📦 Projektstruktur

```
HRthis/
├── browo-hrthis-backend/    # FastAPI Backend
│   ├── app/
│   │   ├── api/            # API-Endpunkte
│   │   ├── models/         # Datenbankmodelle
│   │   ├── schemas/        # Pydantic-Schemas
│   │   └── services/       # Business Logic
│   └── alembic/            # DB-Migrationen
├── HRthis/HRthis/          # React Frontend
│   ├── src/
│   │   ├── components/     # UI-Komponenten
│   │   ├── pages/         # App-Screens
│   │   ├── api/           # API-Client
│   │   └── styles/        # CSS/Tailwind
│   └── public/            # Statische Assets
└── .github/workflows/      # GitHub Actions für CI/CD
```

## 🚧 Geplante Features (Priorisiert)

### HIGH Priority
- [ ] **Klamottengrößen** - Arbeitskleidung-Größen (Oberteil, Hose, Schuhe) bei Mitarbeitern erfassen
- [ ] **Beschäftigungsart erweitern** - Praktikant, Sonstige mit Freifeld hinzufügen
- [ ] **Anträgebereich entfernen** - Aus der Navbar entfernen (redundant mit Zeit & Urlaub)
- [ ] **JWT-Authentifizierung** - Umstellung für SSO-Vorbereitung

### MEDIUM Priority
- [ ] **Mitarbeiter Avatar** - Bildupload und Integration in Übersicht/Teamverwaltung
- [ ] **Zugriffskontrolle** - Automatische Sperrung bei Vertragsende mit Notifications
- [ ] **Dokumentenverwaltung** - Passwortgeschützter Bereich mit Volltextsuche
- [ ] **Stammdaten-Dokumente** - Führerschein, Krankenkassenkarte, Bankverbindung
- [ ] **Vergütungsdaten** - Gehaltsverlauf, Urlaubstage, Elternzeit, Boni
- [ ] **Onboarding-Emails** - Presets über Brevo-Schnittstelle

### LOW Priority
- [ ] **Struktur Mitarbeitersystem** - Erweiterte Berechtigungen, Status, Rollen
- [ ] **Organigramm** - Interaktive Team-Hierarchie mit Drag&Drop
- [ ] **Lern- und Schulungssystem** - Module, Videos, Tests mit Fortschrittstracking
- [ ] **Skills-Tracking** - Fähigkeiten und Bewerbungsdaten-Integration
- [ ] **Admin-Dashboard** - Erweiterte KPIs und Personalstatistiken
- [ ] **Schnittstellen** - DATEV, Recruiting-Tools, Zeiterfassung

## 🚀 Deployment

Die Anwendung wird automatisch über GitHub Actions auf CapRover deployed:

- **Frontend**: https://hrthis.kibubot.com
- **Backend API**: https://hrthis-api.kibubot.com

### Deployment-Workflow
1. Code ändern und committen
2. `git push` zum main-Branch
3. GitHub Actions triggered automatisch das Deployment
4. CapRover baut und deployed die Anwendung

## ▶️ Lokale Entwicklung

### Backend starten:
```bash
cd browo-hrthis-backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend starten:
```bash
cd HRthis/HRthis
npm install
npm start
```

## 📄 Lizenz

MIT License – Feel free to use, modify, and improve.

---

## 📬 Kontakt

Für Fragen oder Mitentwicklung:  
GitHub: [@iamthamanic](https://github.com/iamthamanic)