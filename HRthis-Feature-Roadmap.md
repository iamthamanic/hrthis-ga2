# HRthis Feature Roadmap & Prioritätenliste

## 📊 Executive Summary

**Gesamtarbeitszeit:** ~89-112 Wochen (17-21 Monate)
**Features gesamt:** 23 Features
**Kritischer Pfad:** JWT → Zugriffskontrolle → Core HR Features → Erweiterte Module

---

## 🚀 Phase 1: Foundation & Quick Wins (6-8 Wochen)

### 1. **Anträgebereich aus Navbar entfernen** 
- **Aufwand:** 0.5 Wochen
- **Priorität:** 🟢 HOCH - Quick Win
- **Begründung:** Einfachste Umsetzung, sofortige UX-Verbesserung

### 2. **Mitarbeiter Klamottengröße** 
- **Aufwand:** 1 Woche
- **Priorität:** 🟢 HOCH - Business Critical
- **Begründung:** Operativ notwendig, einfache Datenfeld-Erweiterung

### 3. **Beschäftigungsart erweitern** 
- **Aufwand:** 1 Woche  
- **Priorität:** 🟢 HOCH - Business Critical
- **Begründung:** Praktikanten-Support notwendig, einfache Enum-Erweiterung

### 4. **Personalnummer einführen** 
- **Aufwand:** 1.5 Wochen
- **Priorität:** 🟢 HOCH - Foundation
- **Begründung:** Basis für DATEV/HR-Systeme, einmalige DB-Migration

### 5. **Mitarbeiter Avatar Upload** 
- **Aufwand:** 1 Woche
- **Priorität:** 🟠 MITTEL - UX Enhancement
- **Begründung:** Verbessert UI/UX, relativ einfach umsetzbar

### 6. **Geburtstag Integration + Benachrichtigung** 
- **Aufwand:** 1.5 Wochen
- **Priorität:** 🟠 MITTEL - HR Workflow
- **Begründung:** HR-Prozess-Verbesserung, moderate Komplexität

**Phase 1 Gesamt:** 6.5 Wochen

---

## 🔐 Phase 2: Security & Authentication (4-6 Wochen)

### 7. **JWT User Management umstellen** 
- **Aufwand:** 3-4 Wochen
- **Priorität:** 🔴 KRITISCH - Security Foundation
- **Begründung:** Basis für SSO, Security-Upgrade, komplexe Migration

### 8. **Zugriffskontrolle an Vertragslaufzeit** 
- **Aufwand:** 2-3 Wochen
- **Priorität:** 🔴 KRITISCH - Compliance
- **Begründung:** Rechtliche Anforderung, hängt von JWT ab

**Phase 2 Gesamt:** 5-7 Wochen

---

## 📋 Phase 3: Core HR Features (12-16 Wochen)

### 9. **Onboarding Emails/Presets** 
- **Aufwand:** 3-4 Wochen
- **Priorität:** 🟢 HOCH - Business Critical
- **Begründung:** Automatisiert HR-Prozesse, Brevo-Integration notwendig

### 10. **Stammdaten Dokumente (Führerschein, etc.)** 
- **Aufwand:** 2-3 Wochen
- **Priorität:** 🟢 HOCH - Compliance
- **Begründung:** Rechtlich notwendig, Upload + Verwaltung

### 11. **Dokumentenverwaltung mit OCR** 
- **Aufwand:** 4-5 Wochen
- **Priorität:** 🟠 MITTEL - Advanced Feature
- **Begründung:** Volltextsuche wertvoll, aber technisch komplex

### 12. **Vergütungsdaten Management** 
- **Aufwand:** 3-4 Wochen
- **Priorität:** 🟠 MITTEL - HR Management
- **Begründung:** Wichtig für HR, aber nicht kritisch operativ

**Phase 3 Gesamt:** 12-16 Wochen

---

## 🏗️ Phase 4: Organisationsstruktur (10-14 Wochen)

### 13. **Struktur Mitarbeitersystem (Rollen/Status/Teams)** 
- **Aufwand:** 4-5 Wochen
- **Priorität:** 🟢 HOCH - Foundation
- **Begründung:** Basis für Organigramm und Berechtigungen

### 14. **Organigramm (Konzept + Umsetzung)** 
- **Aufwand:** 5-7 Wochen
- **Priorität:** 🟠 MITTEL - Advanced Management
- **Begründung:** Komplex aber wertvoll, Drag&Drop + Hierarchien

### 15. **Vertretungsmechanik** 
- **Aufwand:** 2-3 Wochen
- **Priorität:** 🟠 MITTEL - Operational
- **Begründung:** Wichtig für Urlaubsvertretungen, moderate Komplexität

**Phase 4 Gesamt:** 11-15 Wochen

---

## 🎓 Phase 5: Learning Management (8-12 Wochen)

### 16. **Lern- und Schulungssystem** 
- **Aufwand:** 6-8 Wochen
- **Priorität:** 🟠 MITTEL - Strategic
- **Begründung:** Vollständiges LMS, hoher Wert aber nicht kritisch

### 17. **Schulungsverwaltung Admin** 
- **Aufwand:** 2-3 Wochen
- **Priorität:** 🟠 MITTEL - Management Tool
- **Begründung:** Ergänzt LMS, moderate Komplexität

### 18. **Skills Tracking + Bewerbungsdaten** 
- **Aufwand:** 1-2 Wochen
- **Priorität:** 🟡 NIEDRIG - Enhancement
- **Begründung:** Nice-to-have, baut auf LMS auf

**Phase 5 Gesamt:** 9-13 Wochen

---

## 📊 Phase 6: Advanced Management (8-12 Wochen)

### 19. **Admin Dashboard Erweitert** 
- **Aufwand:** 2-3 Wochen
- **Priorität:** 🟠 MITTEL - Management
- **Begründung:** KPIs und Analytics für bessere Entscheidungen

### 20. **Erweiterte Teamverwaltung als HR-Zentrale** 
- **Aufwand:** 4-6 Wochen
- **Priorität:** 🟠 MITTEL - Comprehensive
- **Begründung:** Konsolidiert alle HR-Features, hoher Aufwand

### 21. **Personalplanung** 
- **Aufwand:** 2-3 Wochen
- **Priorität:** 🟡 NIEDRIG - Strategic Planning
- **Begründung:** Fortgeschrittenes Feature, erst nach HR-Basis sinnvoll

**Phase 6 Gesamt:** 8-12 Wochen

---

## 🔗 Phase 7: Integrationen (6-10 Wochen)

### 22. **Schnittstellen (DATEV, Recruiting)** 
- **Aufwand:** 4-6 Wochen
- **Priorität:** 🟡 NIEDRIG - Integration
- **Begründung:** Wertvoll aber nicht kritisch, externe Abhängigkeiten

### 23. **SSO Integration mit Browo.ai** 
- **Aufwand:** 2-4 Wochen
- **Priorität:** 🟡 NIEDRIG - Convenience
- **Begründung:** Nice-to-have, hängt von JWT-Umstellung ab

**Phase 7 Gesamt:** 6-10 Wochen

---

## 🎯 Strategische Begründung der Priorisierung

### 🔴 **Kritischer Pfad (Phase 1-2):**
1. **Quick Wins** → Sofortige Verbesserungen ohne Risiko
2. **JWT-Umstellung** → Security-Foundation für alles weitere
3. **Zugriffskontrolle** → Compliance und rechtliche Absicherung

### 🟢 **Business Critical (Phase 3):**
4. **Onboarding/Stammdaten** → Operativ notwendige HR-Prozesse
5. **Dokumentenverwaltung** → Rechtliche Compliance + Effizienz

### 🟠 **Strategic Value (Phase 4-6):**
6. **Organisationsstruktur** → Skalierbarkeit und Management
7. **Learning Management** → Mitarbeiterentwicklung und Retention
8. **Advanced Management** → Data-driven HR decisions

### 🟡 **Nice-to-Have (Phase 7):**
9. **Integrationen** → Workflow-Optimierung und Convenience

---

## ⚡ Umsetzungsempfehlung

### **Sprint-Planung (2-Wochen-Sprints):**
- **Phase 1:** 3-4 Sprints (Quick Wins + Foundation)
- **Phase 2:** 2-3 Sprints (Security Critical)
- **Phase 3:** 6-8 Sprints (Core HR Features)
- **Phase 4:** 5-7 Sprints (Organisation Structure)
- **Phase 5:** 4-6 Sprints (Learning Management)
- **Phase 6:** 4-6 Sprints (Advanced Management)
- **Phase 7:** 3-5 Sprints (Integrations)

### **Parallelisierung möglich:**
- **Phase 1 Features** können teilweise parallel entwickelt werden
- **Phase 3** kann mit Phase 4 überlappen (nach JWT-Fertigstellung)
- **Learning Management** kann parallel zu Organisationsstruktur laufen

### **Risiko-Mitigation:**
- **JWT-Umstellung** hat höchstes technisches Risiko → Buffer einplanen
- **Organigramm** ist UI-komplex → Prototyping empfohlen  
- **DATEV-Integration** hat externe Abhängigkeiten → Alternative APIs recherchieren

---

## 📈 Business Impact Matrix

| Phase | Business Value | Technical Risk | Resource Need | ROI Timeline |
|-------|---------------|----------------|---------------|--------------|
| 1     | Mittel        | Niedrig        | Niedrig       | Sofort       |
| 2     | Hoch          | Hoch           | Hoch          | 3-6 Monate   |
| 3     | Sehr Hoch     | Mittel         | Hoch          | 1-3 Monate   |
| 4     | Mittel        | Mittel         | Hoch          | 6-12 Monate  |
| 5     | Mittel        | Mittel         | Mittel        | 6-18 Monate  |
| 6     | Niedrig       | Niedrig        | Mittel        | 12+ Monate   |
| 7     | Niedrig       | Hoch           | Mittel        | 12+ Monate   |

**Empfehlung:** Fokus auf Phase 1-3 für maximalen Business Impact bei kontrolliertem Risiko.