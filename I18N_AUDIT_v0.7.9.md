# TripMate i18n-Audit · v0.7.9 · 2026-05-07

Live-Test in Chrome: `tm_lang` auf `en` und `vi` umgeschaltet, alle 5 Tabs + Modale durchgegangen. Befund kurz: das I18N-Object enthält ca. 80 Keys, aber die App hat geschätzt 300+ user-facing Strings. Bottom-Nav, Page-Header und Mehr-Tab funktionieren. Fast alles andere bleibt deutsch.

## Status pro Tab

| Tab | Übersetzt | Hardcoded DE |
|---|---|---|
| **Heute** | Bottom-Nav-Label | Wochentag, Datum, "Heute ist ungeplant", Empty-Hint, Termin/Hotel-Buttons, SCHNELLAKTIONEN-Header, Quick-Actions (Hotel/Ausgabe/Wechseln), DEINE REISE-Header, Stat-Labels (Hotels/Orte/Termine/Ausgaben) |
| **Plan** | Page-Header (Itinerary/Lịch trình) | Counter "0 Termine · 2 Orte · 0 Hotels", Reiseinfos-Card komplett (Zeitzone/Steckdose/Verkehr/Trinkgeld/...), Reiseplan-Sektion-Header, Notfall-Assistent-Header, Dokumenten-Safe-Header, Sehenswürdigkeit-Section-Header, Bewerten-Label, "von Minh", COUNTRY_INFO-Werte |
| **Karte** | Page-Header, Bottom-Nav | Filter-Chips (Alle/Sehenswürdigkeit/Vor Ort kaufen/Unterkunft), "0 Orte", "Tippe Handle zum Erweitern" |
| **Geld** | Page-Header + Sub-Tabs | "Großbritannien"-Subtitle, Ausgaben-Sektion, GESAMT, "0 Ausgaben", Empty-Hint, "+ Ausgabe hinzufügen", Split-Empty, Währungsrechner-Header, Kurs-aktualisiert-Hint, Visa-Card komplett (Aufenthalt/Reisedokument/eTA erforderlich/Details & Antrag/Foto-Screenshot anhängen/Note-Text) |
| **Mehr** | Page-Header, alle Menü-Items, Sektion-Header, Bottom-Nav | Subtitle "Werkzeuge, Trip-Settings & Profil"; "aktiv"/"aus"-Badge bei Sync; "Angemeldet seit DD.MM.YYYY" (zusätzlich `de-DE` locale hardcoded); Land-Suffix "Großbritannien" |
| **Modale** | btn.save/cancel/delete-Keys existieren, werden aber teils nicht via tr() benutzt | "Neuer Eintrag"-Modal komplett, Hotel/Event/Expense/Doc/Pack-Modale komplett, Sync-Modal, Email-Import-Modal, Trip-Edit-Modal, Auth-Confirm-Mail-Hinweis |
| **SOS** | – | Notfall-Assistent-Header, "Allgemeiner Notruf"-Label, Krankenhaus/Apotheke/Botschaft-Labels, "in der Nähe finden", "in [city] finden" |
| **Hilfe** | – | Alle Erklärungstexte sind DE (`renderHelpAccordion`) |
| **Toasts** | toast.saved/synced existieren | Restliche Toasts (Sync-Fehler, Import, Export-Bestätigungen, Reise-Aktiv, etc.) sind DE |

## Konkrete Fundstellen mit Zeilennummern

### Heute-Tab — `renderHeute()`
- 4298 `Heute ist ungeplant`
- 4299 `Keine Termine, keine Items für ${dateLong}.`
- 4301–4302 Buttons `📅 Termin` / `🏨 Hotel`
- 4310–4312 Quick-Actions: `Hotel`, `Ausgabe`, `Wechseln` (+ Safe/Email-Import in benachbarten Zeilen)
- 4332–4335 Stat-Labels `Hotels`, `Orte`, `Termine`, `Ausgaben`
- 4380–4382 Counter-Strings `1 Termin` / `n Termine` / `n Hotels`
- 4393 Type-Labels `Flug`, `Zug`, `Transfer`, `Termin`

### Plan-Tab — `renderPlanList()` & Sub-Renderer
- 5411 `${evCount} Termine · ${itCount} Orte · ${acCount} Hotels`
- 5462–5467 Sterne-Label `Bewerten`
- 5481 `<div class="by">von ${addedBy}</div>`
- 5627 `🌍 Reiseinfos ${name}` Card-Title
- 5657 Default-Title `Termin`
- 5707 `🗺️ Reiseplan` Section-Header
- 8046, 8912 weitere `von ${...}`-Stellen

### Map-Tab — Filter-Chips & Sheet
- 1654ff Chips `🏛 Sehenswürdigkeit`, `🍽 Restaurant`, `🛍 Shopping`, `🛒 Vor Ort kaufen`, `🏨 Unterkunft`
- 1665 Sheet-Counter `0 Orte`
- 1666 `Tippe Handle zum Erweitern`

### Geld-Tab — Money + Visa + FX
- 4525–4526 Split-Empty: `Noch keine Ausgaben`, `Trage erst Ausgaben unter "Ausgaben" ein...`
- 5841 SOS-Label `Allgemeiner Notruf ${info.name}`
- 5850–5865 SOS-Items `Krankenhaus` / `Apotheke` / `Botschaft` / `in der Nähe finden`
- 5911 Visa-Empty `Keine Visa-Daten` + `Für ${name} liegen aktuell keine Visa-Infos…`
- 5940–5945 Visa-Rows `Aufenthalt`, `Reisedokument`, `🔗 Details & Antrag`, `📷 Foto/Screenshot anhängen` / `🖼 Foto ersetzen`
- 6098 FX-Header `💱 Währungsrechner`
- 6177 FX-Hint `Kurs aktualisiert · ${ageH}h` / `eben`

### Mehr-Tab — `renderMehr()`
- 4593 `Werkzeuge, Trip-Settings &amp; Profil` (Subtitle)
- 4643 Sync-Badge `aktiv` / `aus`
- 4659 `Angemeldet seit ${date.toLocaleDateString('de-DE')}` — Locale ist hardcoded `de-DE`, sollte je nach lang variieren

### Modale (HTML hardcoded — gar nicht via tr)
- 1787–1828 **Item-Modal** "Neuer Eintrag": Suchen/Name/Kategorie/Adresse/Wird automatisch gefüllt/Datum/Uhrzeit/Notiz/Speichern/Abbrechen + Select-Optionen
- 1797 Select-Optionen `Sehenswürdigkeit`, `Restaurant`, `Shopping`, `Vor Ort kaufen`, `Unterkunft`
- 1854 Settings-Modal `Speichern`
- 1882–1903 Trip-Manager-Hint + `Land (für Reiseinfos: ...)`-Label
- 1946–1947 Trip-Edit `Abbrechen`/`Speichern`
- 2028 `Sync deaktivieren`
- 2056 `Teile diesen Link mit deiner Frau...`
- 2078–2096 Pack-Modal: Kategorie/Notiz/Speichern/Abbrechen
- 2126–2147 Event-Modal: Uhrzeit/Speichern/Abbrechen
- 2161–2186 Accom-Modal: Adresse/Notiz/Speichern/Abbrechen
- 2197–2265 **Expense-Modal** "💶 Ausgabe": Währung/Kategorie/Notiz/Speichern/Abbrechen
- 2276 `💶 Alle Ausgaben`
- 2297 Doc-Passphrase `Abbrechen`
- 2307 Email-Import-Hint `Kopiere den kompletten Email-Text rein...`
- 2313–2330 Email-Import + Doc-Add: `Abbrechen`
- 2322 `📄 Dokument hinzufügen`
- 2326 Doc-Add `Notiz (optional)`
- 1776 Auth-Confirm-Mail `Wir haben eine Bestätigungs-Email an ... geschickt...`

### Hilfe-Page — `renderHelpAccordion()`
- 5275–5297 alle Accordion-Bodies sind DE (Filter-Chips/Ausgaben/Wechseln/Visum/Dokumenten-Safe/Sync-Fehler)

### Daten-Tabellen (gehören eigentlich in i18n-Layer)
- 2407–2442 `COUNTRY_INFO` — komplett DE (`name`, `tip`, `reserv`, `lang`, `extra`)
- 2473–2482 `VISA_INFO` — `stay` und `note` sind DE-Texte
- 2366 ITEM-CATEGORIES `label: 'Sehenswürdigkeit'` etc.

### Toast-Strings (verstreut)
- 3503 `Sync-Fehler beim Speichern – ☁️-Symbol antippen für Retry`
- 4825 `Keine Termine zum Exportieren — trag erst Daten + Uhrzeiten ein`
- 4865 `📅 ${n} Termine exportiert (.ics)`
- 5379 `🧳 ${name} aktiv`
- 7019 `Konnte kein Datum finden — bitte ggf. manuell ergänzen.`
- 9319 `Import von ${by}: ${added} neu, ${updated} aktualisiert${packMsg}`

### Konflikt-Awareness / Diff-Strings
- 3676–3678 Diff-Labels `Hotel`, `Ausgabe`, `Termin` (in compare-Aufrufen)
- 4393 `getEventTypeLabel`-Funktion mit DE-Strings

## Strukturelle Probleme

1. **I18N viel zu klein.** ~80 Keys decken Bottom-Nav + Page-Header + Settings ab. Render-Funktionen erzeugen HTML direkt mit DE-Literalen.
2. **`setLang()` updated nur statische Elemente.** Es ruft `refreshCurrentView()` auf, aber die View-Renderer schreiben deutsche Strings. Resultat: Sprache wechseln triggert nur kosmetische Änderungen.
3. **`de-DE` als Locale hardcoded** an mind. einer Stelle (Zeile 4659 für Account-Datum). Andere `toLocaleDateString`-Calls vermutlich ähnlich.
4. **Daten und UI vermischt:** `COUNTRY_INFO` und `VISA_INFO` enthalten freitextige DE-Beschreibungen die kein User in EN/VI sehen sollte. Müssten als `{ de: ..., en: ..., vi: ... }`-Objekte aufgesplittet werden.
5. **Doppelter Sektion-Header im Mehr-Tab:** in DE heißen die zwei Sektionen `REISE` und `TRIP` (Anglizismus); in EN werden beide zu `TRIP`, in VI beide zu `CHUYẾN ĐI`. Die Trennung verschwindet bei Sprachwechsel. Keys `mehr.cap.reise` und `mehr.cap.trip` sollten unterschiedliche Werte in EN/VI bekommen (z.B. `Trip basics` vs `Trip actions`).
6. **`btn.save`/`btn.cancel` existieren in I18N, aber HTML-Buttons sind hardcoded.** Einfachster Quick-Win: 11 Stellen mit `<button …>Speichern</button>` durch `${tr('btn.save')}` o.ä. ersetzen.

## Empfehlung: Schichten

- **Phase A (kleiner Patch, ~30 min):** Modal-Buttons (Speichern/Abbrechen/Schließen), Stat-Labels Heute, Quick-Action-Labels, Sync-Badge, Subtitle Mehr — alles wo bereits Keys existieren oder triviale neue Keys reichen. Ergibt sofort sichtbaren Fortschritt.
- **Phase B (mittel, ~2h):** Render-Funktionen umstellen — `renderHeute`, `renderMoney`, `renderVisa`, `renderItinerary`, `renderHelpAccordion`. Pro Funktion ca. 10–20 neue Keys.
- **Phase C (groß, ~4h):** `COUNTRY_INFO`/`VISA_INFO` von Strings auf `{de,en,vi}`-Objekte umstellen + Lookup `info.name[lang] || info.name.de`. Toasts auf tr() umstellen. `toLocaleDateString` mit dynamischer Locale aus `getLang()`.

Wenn Du willst, mache ich Phase A jetzt direkt — das ist der schnellste sichtbare Gewinn und reduziert die EN/VI-Erfahrung von "deutsch mit englischer Tab-Bar" zu "größtenteils übersetzt mit DE-Daten-Inhalten".
