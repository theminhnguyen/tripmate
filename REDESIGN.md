# TripMate v1.0 — Redesign-Konzept

*Agentur-Briefing · Stand April 2026*

---

## 1. Ausgangslage

TripMate ist über mehrere Iterationen organisch gewachsen. Heute (v0.5.3) bietet die App 16+ Funktionsbereiche, die alle auf einer einzigen Hauptansicht gestapelt sind: Reise-Infos, Visum, Reiseplan, Notruf, Währung, Ausgaben, Dokumente, Unterkunft, Vorschläge — und darunter die Kategorien Sehenswürdigkeiten, Essen, Cafés, Bars, Einkaufen sowie die Packliste.

Das war für die ersten zwei oder drei Features sinnvoll. Mit jedem zusätzlichen Modul ist der Home-Screen aber unübersichtlicher geworden. Jedes Modul hat seine eigene Farbwelt — Gelb für Ausgaben, Grün für Währung, Dunkel für Dokumente, Lila für Reiseplan, Blau für Visum, Orange für Reiseinfos. Die App ist heute voll mit Features. Aber sie gibt keine klare Antwort auf die wichtigste Frage: **„Was muss ich gerade tun?"**

### UX-Audit: was funktioniert, was nicht

**Stärken (behalten):**
- Coral-Akzent + runde Karten als Marken-Sprache
- Multi-Trip-Modell mit Tombstone-Sync ist robust
- Karte + Geolocation
- Modale Eingaben für Items / Events / Unterkünfte
- Sync-Status-Anzeige im Header

**Schwächen (beheben):**
- **Cognitive overload:** Home-Screen scrollt 8+ Bildschirme. Keine Hierarchie zwischen „heute wichtig" und „selten gebraucht".
- **Farb-Suppe:** sechs unterschiedliche Gradient-Panels nebeneinander. Keine ruhige Lesefläche.
- **Kein „Heute"-Bewusstsein:** der Reiseplan zeigt alle Tage gleichgewichtig — auch wenn ich gerade *am 3. Reisetag* in der App bin.
- **Notruf vergraben:** der SOS-Button ist drei Scrolls vom oberen Rand entfernt. Im Notfall unbenutzbar.
- **Trip-Switch versteckt:** der Trip-Kontext steht im Header-Dropdown statt prominent.
- **Modal-Soup:** zwölf verschiedene Modale, kein konsistentes Eingabe-Muster (Bottom-Sheet vs. Dialog vs. Vollbild gemischt).
- **Empty States fehlen:** wenn ein Bereich leer ist, sieht man nur ein „Keine Einträge" — nicht *was* man als nächstes tun könnte.

---

## 2. Designprinzipien

1. **Kontext schlägt Funktionsliste.** Was die App zeigt, hängt davon ab, in welchem Stadium der Reise du bist (Planung / Anreise / unterwegs / zurück) und vom heutigen Datum.
2. **Eine Tat pro Sekunde.** Jede Hauptaktion ist in höchstens zwei Taps erreichbar. Notruf in einem Tap, ohne Untermenü.
3. **Klarheit statt Dekoration.** Eine konsistente, ruhige Oberfläche. Farbe nur dort, wo sie semantische Bedeutung hat (Status, Bestätigung, Warnung).
4. **Vertraut, nicht generisch.** Die Coral-Akzentfarbe und die runden Karten bleiben Marken­zeichen — die visuelle Sprache wird aber stark vereinfacht.
5. **Mobil zuerst, aber nicht spielzeughaft.** TripMate ist eine PWA für unterwegs. Sie soll sich wie ein durchdachtes Werkzeug anfühlen, nicht wie eine Demo.

---

## 3. Informationsarchitektur

Die App bekommt eine **untere Navigationsleiste** mit fünf Tabs — eine etablierte Konvention, die Nutzer nicht extra lernen müssen.

### Tab 1 · **Heute** (Home, kontextbasiert)

Der zentrale Neuerung. Der Heute-Tab zeigt nur, was *jetzt* relevant ist.

```
┌────────────────────────────────────────┐
│ Trip-Strip:                            │
│ Lisbon Trip · 23.04 – 27.04 · Tag 2/5  │ ← tap = Trip-Switcher
├────────────────────────────────────────┤
│                                        │
│ Donnerstag, 24. April                  │
│ Lissabon, Portugal · 19°C ☀           │ ← Wetter (optional, später)
│                                        │
│ HEUTE AUF DEM PLAN                     │
│ ┌──────────────────────────────────┐   │
│ │ 09:30 ✈️ LH456 · FRA → LIS       │   │ ← aus Itinerary
│ │ 15:00 🏨 Pestana · Check-in     │   │
│ │ 19:30 🍽 Time Out Market        │   │
│ └──────────────────────────────────┘   │
│                                        │
│ SCHNELLAKTIONEN                        │
│ [+€ Ausgabe] [€€ Wechseln] [📞 Notruf] │ ← 3 große Buttons
│ [🔒 Safe öffnen]                       │
│                                        │
│ NÄCHSTE TAGE                           │
│ Fr 25.04 · 2 Termine        ›          │
│ Sa 26.04 · 1 Termin         ›          │
│ So 27.04 · Heimreise        ›          │
│                                        │
│ DEINE REISE                            │
│ 3 Hotels · 12 Orte · 8 Termine         │ ← collapsed Übersicht
│                                        │
└────────────────────────────────────────┘
[Heute] [Plan] [Karte] [Geld] [Mehr]
```

### Tab 2 · **Plan**

Die volle Reiseplan-Ansicht (Itinerary). Filter-Chips oben: *Alle · Termine · Hotels · Aktivitäten*. Vollständige Tag-für-Tag-Liste. Der Email-Import-Button und der „+ neu"-FAB leben hier.

### Tab 3 · **Karte**

Vollbild-Leaflet-Karte. Layer-Toggle als Pillen-Reihe oben (*Alle · Sehenswürdigkeiten · Restaurants · Hotels · Einkaufen*). Bottom-Sheet (snap zu 25 % / 50 % / 90 %) zeigt die Liste der Marker. Tap auf Marker → Sheet springt zur Detail-Ansicht.

### Tab 4 · **Geld**

Drei sekundäre Tabs an der Spitze:
- **Ausgaben** — Hero zeigt „€ 247 von € 800 · 31 %" als Fortschrittsbalken. Darunter: Kategorien-Verteilung, Liste, „+ neu"-FAB.
- **Wechseln** — Währungsrechner mit Live-Kurs.
- **Visum** — nur sichtbar wenn ein Land gesetzt ist und Visa-Info verfügbar.

### Tab 5 · **Mehr**

Sammelfach für alles, was nicht täglich gebraucht wird, gruppiert in drei Abschnitten:

```
REISE
  📋 Packliste                4/12   ›
  🌍 Reiseinfos Portugal             ›
  🛂 Visum                    ✓     ›
  🔒 Dokumenten-Safe          3     ›
  🚨 Notfall-Details                 ›

TRIP
  ⚙️ Trip bearbeiten                 ›
  📤 Trip teilen                     ›
  🔄 Sync                  Synced   ›

APP
  👤 Profil                          ›
  ❓ Hilfe & Anleitung               ›
  🐞 Feedback geben                  ›
  ℹ️ Über · v1.0
```

### Trip-Switcher

Statt eines Header-Dropdowns: Tap auf den Trip-Strip (oben auf jedem Tab) öffnet ein **Bottom-Sheet** mit allen Trips als Karten. Jede Karte zeigt Reisename, Stadt, Datumsbereich und ggf. ein Ländercode-Flaggen-Emoji. Am Ende ein „+ Neue Reise"-Button.

### SOS-FAB

Auf dem Heute- und Plan-Tab ist unten rechts ein **floating SOS-Button** (Coral, leicht transparent, 56 px). Tap öffnet direkt das Notfall-Sheet mit Notrufnummer als großer Wähl-Button, Krankenhaus-, Apotheke- und Botschaft-Buttons. Auf Karte und Geld-Tab nicht sichtbar — dort steht das Werkzeug im Vordergrund.

---

## 4. Visuelles Design-System

### Farben

| Token | Hex | Verwendung |
|-------|-----|------------|
| `--bg` | `#FAFAF7` | Seiten-Hintergrund (warmes Off-White) |
| `--surface` | `#FFFFFF` | Karten, Sheets |
| `--surface-soft` | `#F5F4EE` | Sekundäre Flächen |
| `--text` | `#1A1A1A` | Primärtext |
| `--text-muted` | `#6B6B6B` | Sekundärtext |
| `--text-soft` | `#A0A0A0` | Tertiärtext, Captions |
| `--border` | `#ECECEC` | Trennlinien, ruhige Outlines |
| `--accent` | `#FF385C` | Coral · Marken-Akzent (sparsam) |
| `--accent-soft` | `#FFF0F4` | Akzent-Flächen, ausgewählte Tabs |
| `--success` | `#16A34A` | Bestätigungen, „bezahlt" |
| `--warning` | `#F59E0B` | Achtung-Hinweise |
| `--danger` | `#DC2626` | Fehler, Notruf |

**Regel:** maximal *eine* gefärbte Fläche pro Bildschirm. Das Heute-Hero darf Akzent haben — der Rest bleibt ruhig.

### Typografie

| Stil | Größe / Höhe | Gewicht | Verwendung |
|------|------------|---------|------------|
| Display | 32 / 40 | 700 | Hero-Datum, Heute-Titel |
| H1 | 24 / 32 | 700 | Tab-Titel |
| H2 | 18 / 26 | 600 | Sektionsüberschriften |
| H3 | 16 / 22 | 600 | Karten-Titel |
| Body | 15 / 22 | 400 | Fließtext |
| Body Strong | 15 / 22 | 600 | Beträge, Hervorhebungen |
| Small | 13 / 18 | 400 | Meta-Infos |
| Caption | 11 / 16 | 600 uppercase, tracking 0.06em | Sektions-Label |

System-Font-Stack bleibt: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, …` — nativ, schnell, vertraut.

### Spacing-Skala

`4 · 8 · 12 · 16 · 20 · 24 · 32 · 48` (8-Punkt-Raster mit zwei Mikro-Stufen)

### Radien

- Klein: `8px` — Buttons, Eingabefelder
- Medium: `12px` — Listenelemente
- Karten: `20px` — Inhalts-Karten
- Sheets / Modale: `28px` (top corners)

### Schatten

- `xs`: `0 1px 2px rgba(0,0,0,0.04)` — Trennung gegen Background
- `sm`: `0 2px 8px rgba(0,0,0,0.06)` — Standard-Karten
- `md`: `0 4px 16px rgba(0,0,0,0.08)` — Hover / Active
- `lg`: `0 12px 32px rgba(0,0,0,0.12)` — Sheets, Modale

### Iconografie

Emojis bleiben für **Datentypen** (✈️ Flug, 🍽 Essen, 🏨 Hotel) — sie sind selbsterklärend und schnell scannbar. Für **UI-Aktionen** (Suche, Settings, Filter) wechseln wir auf eine konsistente Icon-Library: **Lucide** oder **Phosphor** (beide MIT, SVG, klein).

---

## 5. Microinteractions

- **Tab-Wechsel:** sanfter Fade (120 ms), kein Slide — die Tabs sind unabhängig
- **Karten-Tap:** Skala 0.98 + Schatten verstärken (100 ms)
- **Modal-Open:** Bottom-Sheet schiebt von unten (220 ms, easeOut)
- **Pull-to-Refresh** auf Heute & Plan
- **Skeleton Screens** beim ersten Laden (statt Spinner) — fühlt sich schneller an
- **Haptisches Feedback** auf wichtigen Aktionen (iOS via `navigator.vibrate(10)`)

---

## 6. Empty States

Aktueller Zustand: „Noch keine Ausgaben."  
Neu:

```
┌─────────────────────────────┐
│         💶                  │
│                             │
│   Noch nichts ausgegeben    │
│                             │
│ Tippe auf „+", um deine     │
│ erste Ausgabe zu erfassen.  │
│                             │
│      [+ Erste Ausgabe]      │
└─────────────────────────────┘
```

Jeder Empty State hat: Icon · Klarer Status-Satz · Erklärung · Primäre Aktion. Kein passiver Text mehr.

---

## 7. Implementierungs-Roadmap

Vorschlag: drei Phasen über zwei bis drei Sprints.

### Phase 1 · Foundation (2 – 3 Tage)
- Design-Token-System einführen (CSS Custom Properties zentralisieren)
- Bottom-Navigation einbauen (5 Tabs, Routing über `state.activeTab`)
- Heute-Tab als neuen Default-Screen implementieren
- Trip-Switcher als Bottom-Sheet
- SOS-FAB als globale Komponente

### Phase 2 · Tab-Migration (3 – 5 Tage)
- Bestehende Panels in die neuen Tabs umsiedeln (kein Verlust an Funktion)
- Plan-Tab: Reiseplan + Filter-Chips + Email-Import + neue Termine
- Geld-Tab: Sub-Tabs Ausgaben / Wechseln / Visum
- Mehr-Tab: gruppierte Liste mit Detail-Sub-Pages
- Karte: Vollbild + Bottom-Sheet
- Alle Modale auf Bottom-Sheet-Pattern vereinheitlichen

### Phase 3 · Polish (2 – 3 Tage)
- Empty States überall
- Microinteractions + Skeleton-Loader
- Visuelle QA: Kontrast, Touch-Targets ≥ 44 px, Lesbarkeit
- Onboarding-Flow für Erstnutzer (3 Slides: Trips · Sync · Privacy)
- Zugänglichkeit: ARIA-Labels, Tastatur-Navigation, `prefers-reduced-motion`

### Phase 4 · v1.1 Stretch
- Wetter-Integration auf Heute-Tab
- Foto-Galerie pro Tag (Erinnerungen nach der Reise)
- iCal-Export der Itinerary
- Onboarding-Tour mit Tooltip-Highlight

---

## 8. Was *nicht* geändert wird

Damit klar ist, was unverändert bleibt:

- Datenmodell (Trips, Items, Events, Accommodations, Expenses, Documents, Packlist) — kein Migrations-Bedarf
- Tombstone-Merge-Logik
- Supabase-Sync-Mechanismus
- AES-GCM Doc-Safe Crypto
- FX-Cache & Fallback-Logik
- Email-Import-Parser
- Single-HTML-File-Architektur

Der Refactor ist **rein in der View-Schicht**.

---

## 9. Erfolgs-Metriken

Wenn das Redesign live ist, sollten wir diese Fragen einfach beantworten können:

1. **Time-to-Action für Notruf:** im Notfall ≤ 2 Sekunden, ein Tap.
2. **Heute-Relevanz:** auf dem Heute-Tab werden mindestens 70 % der Inhalte heute aktiv genutzt (nicht nur „existieren").
3. **Cognitive Load:** der Heute-Screen passt vollständig auf einen Smartphone-Bildschirm ohne Scrollen.
4. **Konsistenz:** ein einziges Modal-Pattern (Bottom-Sheet), eine einzige Akzentfarbe, ein einziges Karten-Pattern.
5. **Onboarding:** ein Erstnutzer baut innerhalb von 2 Minuten seine erste Reise auf, ohne dass jemand erklären muss.

---

*Mockup als HTML: `redesign-mockup.html`*
