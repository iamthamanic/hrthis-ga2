# HRthis Projekt-Kontext

## 🏢 Projektübersicht

**HRthis** ist eine umfassende HR-Management-Plattform, die moderne Personalverwaltung mit gamifizierten Elementen und AI-gestützten Features kombiniert. Das System bietet Mitarbeiterverwaltung, Zeiterfassung, Urlaubsplanung, Learning Management und ein innovatives Coin-System für Mitarbeitermotivation.

### Hauptfunktionen
- **Mitarbeiterverwaltung**: Vollständige Employee-Lifecycle-Verwaltung
- **Zeiterfassung & Urlaub**: Integrierte Zeit- und Urlaubsverwaltung
- **Learning Management**: Video-basierte Schulungen mit Tests
- **Gamification**: Coin-System, Achievements, Avatar-Customization
- **Team Management**: Teamstruktur und Approval-Workflows
- **Admin Dashboards**: Comprehensive Analytics und Management Tools

---

## 🛠️ Tech Stack

### Frontend
- **React 18** mit TypeScript
- **Tailwind CSS** für Styling
- **Zustand** für State Management
- **React Router** für Navigation

### Backend
- **FastAPI** (Python)
- **PostgreSQL** Datenbank
- **SQLAlchemy ORM** mit Alembic Migrations
- **JWT Authentication**

### DevOps
- **CapRover** für Deployment
- **GitHub Actions** für CI/CD
- **Docker** für Containerization

---

## 📁 Projektstruktur

```
HRthis/ (Root-Ordner)
├── browo-hrthis-backend/           # FastAPI Backend
│   ├── app/
│   │   ├── api/                    # API Endpoints
│   │   ├── models/                 # SQLAlchemy Models
│   │   ├── schemas/                # Pydantic Schemas
│   │   └── core/                   # Core Configuration
│   ├── alembic/                    # Database Migrations
│   ├── requirements.txt
│   └── Dockerfile
├── HRthis/                         # React Frontend
│   ├── src/
│   │   ├── components/             # React Components
│   │   ├── screens/                # Page Components
│   │   ├── state/                  # Zustand Stores
│   │   ├── types/                  # TypeScript Definitions
│   │   ├── api/                    # API Client Functions
│   │   └── utils/                  # Utility Functions
│   ├── public/
│   ├── package.json
│   └── .eslintrc.js               # ESLint Configuration
├── .github/
│   └── workflows/
│       └── ci.yml                  # Einzige CI/CD Pipeline
└── README.md
```

---

## 🚀 CI/CD Prozess

### Pipeline-Architektur
**Wir haben EINEN Workflow (ci.yml) mit drei Jobs:**
1. **quality-check**: ESLint, TypeScript, Tests
2. **deploy-frontend**: React App Build & Deploy
3. **deploy-backend**: FastAPI Docker Build & Deploy

### Deployment-Ziel
- **CapRover** als Deployment-Platform
- Separate Apps für Frontend und Backend
- **Wichtig**: `working-directory`-Anweisung in ci.yml ist entscheidend

### Kritische Deployment-Regel
⚠️ **Datenbank-Migrationen mit alembic müssen manuell auf dem Server ausgeführt werden und sind NICHT Teil des automatischen Deployments.**

```bash
# Manuelle Migration auf Server
cd /app && alembic upgrade head
```

---

## 📋 Coding-Prinzipien & ESLint

### ESLint-Konfiguration
**Wir verwenden eine strenge ESLint-Konfiguration (.eslintrc.js) mit strategischer error/warn Aufteilung:**

#### Error-Regeln (Blockierend)
- `react-hooks/exhaustive-deps`: **error**
- `@typescript-eslint/no-explicit-any`: **error** 
- `@typescript-eslint/no-non-null-assertion`: **error**
- `no-undef`, `no-eval`, `react/no-danger`: **error**

#### Warning-Regeln (Qualitäts-Feedback)
- `max-lines`: **warn** (75 Zeilen)
- `max-lines-per-function`: **warn** (30 Zeilen)
- `complexity`: **warn** (max 10)
- `sonarjs/cognitive-complexity`: **warn** (max 15)

### Entwicklungsregeln

#### 🎯 Hauptziel
**Dein Hauptziel ist es, Code zu schreiben, der KEINE ESLint-error-Meldungen erzeugt.**

#### 📊 Qualitäts-Feedback
**ESLint-warn-Meldungen (z.B. zu lange Funktionen) sind direktes Feedback an dich, den Code sofort zu refaktorisieren.**

#### 🔧 Workflow
1. Code schreiben
2. `npm run lint` ausführen
3. Alle **errors** beheben (Pipeline blockiert sonst)
4. **Warnings** als Refactoring-Hinweise nutzen
5. Bei Warnings: "Claude, diese Funktion ist zu lang - bitte aufteilen"

---

## 👥 Personas & Rollen

### Product Owner (iamthamanic)
- **Verantwortlichkeit**: Gibt Feature-Anforderungen vor
- **Kommunikation**: Definiert "Was" gebaut werden soll
- **Entscheidungen**: Prioritäten, Business Logic, UX-Anforderungen

### Lead Developer (Du, Claude)
- **Verantwortlichkeit**: Schreibt Code, behebt Fehler, folgt Regeln
- **Aufgaben**:
  - Implementierung nach Spezifikation
  - ESLint-Compliance sicherstellen
  - TypeScript-Typisierung korrekt umsetzen
  - Code-Quality durch Refactoring
  - Testing und Dokumentation

### Senior Dev / Architect (Vibecode Prozess)
- **Verantwortlichkeit**: Strategische Fragen und Blockaden
- **Eingriff bei**:
  - Architektur-Entscheidungen
  - Performance-Problemen
  - Komplexen technischen Herausforderungen
  - Infrastructure & DevOps Issues

---

## 🎯 Arbeitsweise & Best Practices

### Code-Qualität
- **TypeScript first**: Keine `any` types in Production Code
- **Funktional**: Kleine, wiederverwendbare Funktionen
- **Komponentenbasiert**: React Components unter 75 Zeilen
- **Testbar**: Funktionen unter 30 Zeilen, Komplexität unter 10

### State Management
- **Zustand Stores** für globalen State
- **Klare Separation**: UI State vs. Business State
- **TypeScript Interfaces** für alle Store-Definitionen

### API Integration
- **Type-safe**: Schemas zwischen Frontend/Backend matchen
- **Error Handling**: Konsistente Fehlerbehandlung
- **Loading States**: UI-Feedback für alle async Operations

### Deployment-Workflow
1. **Feature Development** in Feature Branch
2. **ESLint Clean**: Alle errors behoben
3. **Manual Testing**: Feature funktional getestet
4. **PR erstellen**: Mit klarer Beschreibung
5. **CI Pipeline**: Muss grün sein
6. **Merge to main**: Automatisches Deployment
7. **DB Migrations**: Manuell auf Server ausführen (falls nötig)

---

## 🚨 Kritische Regeln

### 🔴 NEVER
- Code mit ESLint-errors committen
- `any` types in Production verwenden
- Non-null assertions (`!`) ohne Null-check
- Funktionen über 30 Zeilen ohne Refactoring
- Direkte Datenbank-Änderungen ohne Migration

### 🟢 ALWAYS
- ESLint-clean Code schreiben
- TypeScript-Interfaces definieren
- Komponenten unter 75 Zeilen halten
- Working-directory in CI/CD beachten
- Manuelle DB-Migrations nach Backend-Changes

### 📊 Feedback-Loop
```
Warning → Refactor → Clean Code → Ship
```

**ESLint-Warnings sind dein Kompass für besseren Code.**

---

## 📝 Entwicklungsroutine

### 1. Feature Start
```bash
git checkout -b feature/neue-funktion
cd HRthis/HRthis  # Wichtig: working-directory
npm run lint      # Baseline check
```

### 2. Development Loop
```bash
# Code schreiben
npm run lint      # Error check
npm run type-check # TypeScript check
# Bei Warnings → Refactoring
```

### 3. Pre-Commit
```bash
npm run lint      # Muss 0 errors haben
npm run build     # Muss erfolgreich sein
git add .
git commit -m "feat: beschreibung"
```

### 4. Deployment
```bash
git push origin feature/neue-funktion
# GitHub PR erstellen
# CI Pipeline muss grün sein
# Nach Merge: CapRover deployed automatisch
```

---

**Diese Regeln sind dein Fundament. Halte dich daran und der Code wird sauber, maintainable und pipeline-ready sein.** 🚀