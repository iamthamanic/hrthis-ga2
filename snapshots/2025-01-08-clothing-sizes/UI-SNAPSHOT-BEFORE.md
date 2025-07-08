# 📸 UI Snapshot - Vor Klamottengrößen-Implementation

**Datum:** 08.01.2025  
**Feature:** Klamottengrößen (Oberteil, Hose, Schuhe)  
**Status:** 📷 Snapshot vor Implementation

## 🎯 Aktueller Stand der Teamverwaltung

### Mitarbeiterformular - Aktuelle Felder

#### Persönliche Daten
- [x] Vorname
- [x] Nachname
- [x] E-Mail
- [x] Telefonnummer
- [x] Geburtsdatum
- [x] Eintrittsdatum

#### Arbeitsvertrag
- [x] Position
- [x] Abteilung
- [x] Arbeitszeit (Vollzeit/Teilzeit)
- [x] Vertragsart (Unbefristet/Befristet)
- [x] Beschäftigungsart (Angestellter/Arbeiter/Geschäftsführer)
- [x] Vertragsbeginn
- [x] Vertragsende (bei befristet)

#### Berechtigungen
- [x] Benutzerrolle (User/Admin/Superadmin)
- [x] Team-Zuordnung

### Fehlende Felder (werden hinzugefügt)
- [ ] **Arbeitskleidung - Oberteil** (Größe: XS, S, M, L, XL, XXL, XXXL)
- [ ] **Arbeitskleidung - Hose** (Größe: Konfektionsgrößen oder W/L)
- [ ] **Arbeitskleidung - Schuhe** (Größe: 35-50)

## 🏗️ Geplante Implementierung

### Backend-Änderungen
```python
# Neue Felder im Employee Model:
clothing_size_top: Optional[str] = None      # "S", "M", "L", "XL", etc.
clothing_size_bottom: Optional[str] = None   # "32/32", "M", "46", etc.
clothing_size_shoes: Optional[str] = None    # "42", "43", etc.
```

### Frontend-Änderungen
```typescript
// Neue Formfelder in EmployeeForm:
<Select name="clothing_size_top" label="Oberteil Größe">
  <Option value="XS">XS</Option>
  <Option value="S">S</Option>
  <Option value="M">M</Option>
  <Option value="L">L</Option>
  <Option value="XL">XL</Option>
  <Option value="XXL">XXL</Option>
  <Option value="XXXL">XXXL</Option>
</Select>

// Flexibles Eingabefeld für Hosen (Text oder Select)
<Input name="clothing_size_bottom" label="Hosen Größe" placeholder="z.B. 32/32 oder 46" />

// Schuhe als Nummer-Select
<Select name="clothing_size_shoes" label="Schuh Größe">
  {[...Array(16)].map((_, i) => (
    <Option key={35 + i} value={String(35 + i)}>{35 + i}</Option>
  ))}
</Select>
```

## 📋 Betroffene Komponenten

### Frontend
- `HRthis/HRthis/src/pages/admin/Teamverwaltung.tsx` - Mitarbeiterformular
- `HRthis/HRthis/src/components/admin/MitarbeiterBearbeitenModal.tsx` - Bearbeitungsdialog

### Backend
- `browo-hrthis-backend/app/models/employee.py` - Datenbankmodell
- `browo-hrthis-backend/app/schemas/employee.py` - API-Schemas
- `browo-hrthis-backend/app/api/endpoints/employees.py` - API-Endpoints

### Datenbank
- Neue Migration mit Alembic für die drei neuen Spalten

## 🔄 Migrations-Hinweis

Nach Implementation muss ausgeführt werden:
1. Lokal: `alembic revision --autogenerate -m "Add clothing sizes to employees"`
2. Nach Deploy: `alembic upgrade head` im CapRover Dashboard

---

**Status:** Bereit für Implementation der Klamottengrößen!