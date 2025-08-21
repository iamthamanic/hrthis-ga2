# HRthis - Modernes HR Management System

Ein umfassendes HR-Management-System mit React Frontend und FastAPI Backend für die Verwaltung von Mitarbeitern, Urlaubsanträgen, Lernmodulen und Benefits.

## 🚀 Features

- **Dashboard** mit KPI-Übersicht und Echtzeit-Metriken
- **Mitarbeiterverwaltung** mit automatischen Mitarbeiternummern
- **Zeit & Urlaub** Management mit Kalenderansicht
- **Lern-Management-System** mit Video-Lektionen und Fortschrittsverfolgung
- **Benefits-Verwaltung** mit Coins-System
- **Dokumenten-Management** für Mitarbeiterunterlagen
- **Admin-Bereich** für Systemverwaltung
- **JWT-basierte Authentifizierung** für sichere Anmeldung
- **Responsive Design** für Desktop und Mobile

## 🛠️ Tech Stack

### Frontend
- **React 18** mit TypeScript
- **React Router v6** für Navigation
- **Zustand** für State Management
- **Tailwind CSS** für Styling
- **Recharts** für Datenvisualisierung
- **Zod** für Schema-Validierung
- **Custom Hooks System** für wiederverwendbare Logik
- **Web Vitals** für Performance Monitoring
- **Playwright** für E2E Testing

### Backend
- **FastAPI** (Python)
- **SQLAlchemy** ORM mit Event Hooks
- **SQLite** Datenbank
- **JWT** für Authentication
- **Pydantic** für Datenvalidierung
- **Custom Middleware** für Request/Response Hooks

### Testing & Quality
- **Jest** für Unit Testing (~30% Coverage)
- **React Testing Library** für Component Testing
- **Playwright** für E2E Testing
- **ESLint** für Code Linting
- **TypeScript** Strict Mode aktiviert
- **GitHub Actions** für CI/CD

## 📋 Voraussetzungen

- Node.js 16+ und npm
- Python 3.9+
- Git

## 🚀 Quick Start

### 1. Repository klonen

```bash
git clone <repository-url>
cd HRthis
```

### 2. Backend starten

```bash
# In das Backend-Verzeichnis wechseln
cd browo-hrthis-backend

# Dependencies installieren
pip3 install -r requirements.txt

# Backend Server starten
python3 -m uvicorn app.main:app --host 127.0.0.1 --port 8002 --reload
```

Das Backend läuft nun unter: `http://localhost:8002`
API Dokumentation: `http://localhost:8002/docs`

### 3. Frontend starten

```bash
# In einem neuen Terminal
cd HRthis

# Dependencies installieren
npm install

# Frontend starten
npm start
```

Die App läuft nun unter: `http://localhost:4173/hrthis`

## 🔐 Login

### Demo-Benutzer

Die folgenden Benutzer sind standardmäßig verfügbar:

**Mitarbeiter:**
- Email: `max.mustermann@hrthis.de`
- Passwort: `password`

**Admin:**
- Email: `anna.admin@hrthis.de`
- Passwort: `password`

**Test-Nutzer:**
- Email: `tom.test@hrthis.de`
- Passwort: `password`

## 🏗️ Projektstruktur

```
HRthis/
├── HRthis/                     # Frontend (React)
│   ├── src/
│   │   ├── api/               # API Client
│   │   ├── components/        # React Komponenten
│   │   ├── hooks/             # Custom React Hooks
│   │   │   ├── api/          # API Request Hooks
│   │   │   ├── core/         # Core Utility Hooks
│   │   │   ├── form/         # Form Management Hooks
│   │   │   ├── state/        # State Management Hooks
│   │   │   ├── ui/           # UI/UX Hooks
│   │   │   └── utils/        # Utility Hooks
│   │   ├── navigation/        # Routing
│   │   ├── screens/           # Seiten/Views
│   │   ├── state/             # Zustand Management
│   │   └── utils/             # Hilfsfunktionen
│   ├── public/
│   └── package.json
│
├── browo-hrthis-backend/       # Backend (FastAPI)
│   ├── app/
│   │   ├── api/              # API Endpoints
│   │   ├── hooks/            # Backend Hooks
│   │   │   └── database_hooks.py  # SQLAlchemy Event Hooks
│   │   ├── middleware/       # Custom Middleware
│   │   │   └── request_hooks.py   # Request/Response Hooks
│   │   ├── models/           # Datenbank-Modelle
│   │   ├── schemas/          # Pydantic Schemas
│   │   ├── services/         # Business Logic
│   │   └── main.py           # App Entry Point
│   ├── requirements.txt
│   └── README.md
│
├── CHANGELOG.md               # Änderungshistorie
└── README.md                  # Diese Datei
```

## 🔧 Konfiguration

### Frontend Umgebungsvariablen

Erstellen Sie eine `.env` Datei im `HRthis` Verzeichnis:

```env
# Port-Konfiguration
PORT=4173

# Base Path für Routing
REACT_APP_BASE_PATH=/hrthis
PUBLIC_URL=/hrthis

# Backend API URL
REACT_APP_API_URL=http://localhost:8002/hrthis

# Demo-Modus (false für echte API)
REACT_APP_DEMO_MODE=false
```

### Backend Konfiguration

Das Backend verwendet standardmäßig SQLite. Die Datenbank wird automatisch beim ersten Start erstellt.

## 📚 API Dokumentation

### Authentication Endpoints

#### Login
- **POST** `/hrthis/api/auth/login`
- Content-Type: `application/x-www-form-urlencoded`
- Body: `username={email}&password={password}`
- Response: JWT Token und Benutzerinformationen

#### Register
- **POST** `/hrthis/api/auth/register`
- Erstellt neuen Mitarbeiter (Admin-Berechtigung erforderlich)

#### Refresh Token
- **POST** `/hrthis/api/auth/refresh`
- Erneuert abgelaufenen Token

### Employee Endpoints

#### Alle Mitarbeiter abrufen
- **GET** `/hrthis/api/employees/`
- Authentifizierung erforderlich

#### Mitarbeiter erstellen
- **POST** `/hrthis/api/employees/`
- Admin-Berechtigung erforderlich

#### Mitarbeiter aktualisieren
- **PATCH** `/hrthis/api/employees/{id}`
- Admin-Berechtigung erforderlich

## 🪝 Hook System

### Frontend Hooks

Das Projekt nutzt ein umfassendes Custom Hooks System für bessere Code-Wiederverwendbarkeit und Wartbarkeit:

#### Form Management
- **useFormHandler** - Vollständiges Form-State-Management mit Zod-Validierung
  - Touch-State-Tracking
  - Field-Level-Validierung
  - Async Submit-Handling
  - Error Management

#### API Handling
- **useApiRequest** - Erweiterte API-Request-Verwaltung
  - Automatisches Caching mit TTL
  - Retry-Logik bei Fehlern
  - Optimistic Updates
  - Request Debouncing
  - Abort Controller Support

#### UI/UX
- **useToast** - Toast-Benachrichtigungssystem
  - Multiple Toast-Typen (success, error, warning, info)
  - Auto-Dismiss mit Timer
  - Action-Buttons in Toasts
  - Tastatur-Shortcuts (ESC zum Schließen)

- **useDebounce** - Verzögerung für Eingaben
  - Reduziert API-Calls bei Suche
  - Konfigurierbare Verzögerung
  - Callback-Variante verfügbar

#### Permissions & Security
- **usePermission** - Role-Based Access Control (RBAC)
  - Rollenbasierte Berechtigungen
  - Resource-Level-Permissions
  - UI-Element-Visibility-Control
  - Permission Gates für Komponenten

#### State Management
- **useLocalStorage** - Type-safe localStorage
  - JSON-Serialisierung
  - Cross-Tab-Synchronisation
  - TTL-Support für Cache-Invalidierung
  - Fallback-Werte

### Backend Hooks

#### Database Hooks (SQLAlchemy Events)
- **before_insert** - Automatische Mitarbeiternummer-Generierung
- **after_insert/update/delete** - Audit-Trail-Logging
- **after_commit** - Cache-Invalidierung
- **before_flush** - Datenvalidierung

#### Middleware Hooks (FastAPI)
- **Request Hooks**
  - Rate Limiting pro IP
  - Request Logging
  - Performance Tracking
  
- **Response Hooks**
  - Security Headers (CSP, HSTS, etc.)
  - Response Time Tracking
  - Error Formatting

### Hook Usage Examples

```typescript
// Form mit Validierung
const form = useFormHandler<LoginData>({
  initialValues: { email: '', password: '' },
  validationSchema: loginSchema,
  onSubmit: async (values) => {
    await login(values);
  }
});

// API Request mit Caching
const { data, loading, error } = useApiRequest(
  fetchEmployees,
  [],
  { 
    cacheKey: 'employees',
    ttl: 5 * 60 * 1000,
    refetchInterval: 30000 
  }
);

// Permission Check
const { hasPermission, canEdit } = usePermission();
if (hasPermission('edit:employees')) {
  // Show edit button
}

// Toast Notifications
const toast = useToast();
toast.success('Gespeichert', 'Änderungen wurden erfolgreich gespeichert');
```

## 🐛 Fehlerbehebung

### Frontend startet nicht
- Prüfen Sie, ob Port 4173 frei ist
- Löschen Sie `node_modules` und führen Sie `npm install` erneut aus

### Backend startet nicht
- Prüfen Sie, ob Port 8002 frei ist
- Stellen Sie sicher, dass Python 3.9+ installiert ist
- Prüfen Sie die Installation der Dependencies

### Login funktioniert nicht
- Backend muss auf Port 8002 laufen
- Prüfen Sie die CORS-Einstellungen
- Stellen Sie sicher, dass `REACT_APP_API_URL` korrekt gesetzt ist

## 📝 Entwicklung

### Neue Features hinzufügen

1. Backend-Modell in `app/models/` erstellen
2. Pydantic Schema in `app/schemas/` definieren
3. API Endpoint in `app/api/` implementieren
4. Frontend-Service in `src/api/` hinzufügen
5. React-Komponente in `src/components/` oder `src/screens/` erstellen
6. State-Management in `src/state/` aktualisieren

### Tests ausführen

```bash
# Backend Tests
cd browo-hrthis-backend
pytest

# Frontend Tests
cd HRthis
npm test

# Test Coverage
npm run test:coverage

# E2E Tests
npm run test:e2e

# Linting
npm run lint

# Type Checking
npm run type-check
```

### Performance Monitoring

Die App trackt automatisch Core Web Vitals:
- **LCP** (Largest Contentful Paint): < 2.5s
- **FID** (First Input Delay): < 100ms  
- **CLS** (Cumulative Layout Shift): < 0.1
- **FCP** (First Contentful Paint): < 1.8s
- **TTFB** (Time to First Byte): < 800ms

Performance-Daten werden in der Konsole (Development) oder an einen Analytics-Endpoint (Production) gesendet.

## 🤝 Beitragen

1. Fork das Repository
2. Erstelle einen Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Committe deine Änderungen (`git commit -m 'Add some AmazingFeature'`)
4. Push zum Branch (`git push origin feature/AmazingFeature`)
5. Öffne einen Pull Request

## 📄 Lizenz

Dieses Projekt ist proprietär und vertraulich.

## 🆘 Support

Bei Fragen oder Problemen:
- Öffnen Sie ein Issue im Repository
- Kontaktieren Sie das Entwicklungsteam

---

**Version:** 2.3.0  
**Letztes Update:** 2025-01-19