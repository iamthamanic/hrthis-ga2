# Changelog

Alle wichtigen Änderungen an diesem Projekt werden in dieser Datei dokumentiert.

Das Format basiert auf [Keep a Changelog](https://keepachangelog.com/de/1.0.0/),
und dieses Projekt hält sich an [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [2.3.0] - 2025-01-19

### 🎉 Added
- **Umfassendes Hook System für Frontend und Backend**
  - Custom React Hooks für wiederverwendbare Logik
  - SQLAlchemy Event Hooks für Datenbank-Operationen
  - FastAPI Middleware Hooks für Request/Response Handling

#### Frontend Hooks
- **useFormHandler** - Form-State-Management mit Zod-Validierung
- **useApiRequest** - API-Handling mit Caching, Retry-Logic und Optimistic Updates
- **useDebounce** - Debouncing für Sucheingaben und API-Calls
- **usePermission** - Role-Based Access Control (RBAC) System
- **useToast** - Toast-Benachrichtigungssystem mit Auto-Dismiss
- **useLocalStorage** - Type-safe localStorage mit Cross-Tab-Sync

#### Backend Hooks
- **Database Event Hooks**
  - Automatische Mitarbeiternummer-Generierung
  - Audit-Trail für alle Änderungen
  - Cache-Invalidierung nach Commits
- **Request Middleware Hooks**
  - Rate Limiting (100 Requests/Minute)
  - Security Headers (CSP, HSTS, X-Frame-Options)
  - Performance Tracking
  - Request/Response Logging

### 🔧 Changed
- **LoginScreen** nutzt jetzt useFormHandler und useToast
- **DashboardScreen** nutzt usePermission, useLocalStorage und useToast
- **ToastProvider** in App.tsx integriert
- **Backend main.py** registriert alle Hooks beim Start
- **Projektstruktur** erweitert um hooks/ Verzeichnisse

### 📦 Dependencies
- **zod** (^3.22.4) für Schema-Validierung hinzugefügt

### 🐛 Fixed
- TypeScript Kompilierungsfehler in Hook-Definitionen
- Timer-Typen für Browser-Kompatibilität korrigiert
- Mapped Types in TypeScript korrekt als Type-Aliases definiert

## [2.2.0] - 2025-08-19

### 🐛 Fixed
- **Login-System komplett repariert**
  - Frontend sendet jetzt OAuth2-kompatible Form-Daten statt JSON
  - Backend akzeptiert Email-Adressen als Username im Login
  - Automatische Weiterleitung nach Login zum Dashboard funktioniert
  - 404-Fehler nach Login behoben

### 🔧 Changed
- **Frontend Auth-Modul** (`src/state/auth.ts`)
  - Login verwendet jetzt `application/x-www-form-urlencoded` Format
  - Sendet `username` und `password` als Form-Daten
  - Email wird als Username-Parameter gesendet

- **Backend Auth-Endpoints** (`app/api/auth.py`)
  - `/hrthis/api/auth/login` akzeptiert OAuth2PasswordRequestForm
  - Unterstützt Email oder Mitarbeiternummer als Login-Identifier
  - Zusätzlicher `/login-json` Endpoint für JSON-Payloads vorbereitet

- **Login-Screen** (`src/screens/LoginScreen.tsx`)
  - Automatische Navigation zum Dashboard nach erfolgreichem Login
  - useEffect Hook für Authentication-Status-Überwachung

### 🏗️ Technical Details
- **API Base Path**: Alle Backend-Routes laufen unter `/hrthis` Prefix
- **Frontend Base Path**: React-App läuft unter `/hrthis` mit Router basename
- **Backend URL**: `http://localhost:8002`
- **Frontend URL**: `http://localhost:4173/hrthis`

## [2.1.0] - 2025-01-15

### Added
- Mitarbeiternummer-Format (PN-YYYYNNNN)
- Kleidungsgrößen-Verwaltung (Oberteil, Hose, Schuhe)
- Geburtsdatum, Adresse und Bankverbindung in Mitarbeiterverwaltung
- Notfallkontakte mit Beziehungsangabe
- Automatische Generierung von Mitarbeiternummern

### Changed
- Erweiterte Mitarbeiter-Einstellungsseite
- Verbesserte Settings-Seite mit allen neuen Feldern

## [2.0.0] - 2024-12-29

### Added
- Komplette Backend-Integration mit FastAPI
- JWT-basierte Authentifizierung
- SQLite-Datenbank für Persistenz
- Onboarding-Email-System
- Erweiterte Beschäftigungsarten

### Changed
- Migration von Mock-Daten zu echter Datenbank
- Neue Projektstruktur mit separatem Backend

## [1.0.0] - 2024-12-01

### Added
- Initiale Version der HRthis App
- Dashboard mit KPI-Übersicht
- Zeit & Urlaub Management
- Lern-Management-System
- Benefits-Verwaltung
- Dokumenten-Management
- Admin-Bereich