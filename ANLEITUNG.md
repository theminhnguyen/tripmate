# TripMate – Deine Urlaubs-Companion-App

Dies ist die erste Version. Alles ist kostenlos, keine Kreditkarte, keine Accounts, keine API-Keys.

## Was die App kann
- Liste mit Kategorien: Sehenswürdigkeit, Restaurant, Shopping, Sonstiges
- Ort suchen (z.B. "Natural History Museum London") → Adresse, Koordinaten und (falls in OpenStreetMap hinterlegt) Öffnungszeiten + Website werden automatisch gezogen
- Kalender-Ansicht: Termine pro Tag planen
- Karten-Ansicht: alle Punkte auf einer OpenStreetMap
- Packliste mit Kategorien, Fortschrittsbalken und Schnell-Chips
- Teilen: per Link an deine Frau – sie tippt drauf, sieht alle Einträge und kann eigene hinzufügen
- **NEU:** Optional Cloud-Sync via Supabase – ihr seht automatisch die Einträge des anderen (siehe Teil 5)
- Funktioniert offline (nach dem ersten Laden)
- Als App auf dem Homescreen installierbar (iOS + Android)

## Enthaltene Dateien
- `index.html` – die App selbst
- `manifest.json` – macht sie installierbar
- `sw.js` – Service Worker für Offline-Modus
- `icon-192.png`, `icon-512.png` – App-Icons

---

## Teil 1: Schnell lokal testen (1 Minute)

1. Öffne den Ordner auf deinem Computer.
2. Doppelklick auf `index.html`.
3. Die App öffnet sich im Browser. Du siehst die Demo-Daten für London.

**Wichtig:** Lokal funktioniert fast alles, aber die Installation auf dem Handy als "echte App" braucht HTTPS. Dafür Teil 2.

---

## Teil 2: Kostenlos online stellen mit Cloudflare Pages

Cloudflare Pages ist dauerhaft kostenlos, ohne Kreditkarte, ohne Bandbreiten-Limit, und die Seite bleibt für immer online. Dauert beim ersten Mal ca. 5 Minuten.

### Schritt 1: Cloudflare-Account anlegen
1. Öffne am Computer: https://dash.cloudflare.com/sign-up
2. Trage deine E-Mail-Adresse und ein Passwort ein.
3. Klicke "Sign Up".
4. Bestätige die E-Mail, die Cloudflare dir schickt (Link in der E-Mail anklicken).

### Schritt 2: Pages-Projekt anlegen
1. Nach dem Login bist du im Cloudflare Dashboard.
2. In der linken Sidebar → "Compute (Workers)" → "Workers & Pages" anklicken.
3. Klicke auf "Create application".
4. Wähle den Reiter "Pages".
5. Scrolle runter zu "Create using direct upload" und klicke "Upload assets".
6. Projektname eingeben: z.B. `tripmate` (nur Kleinbuchstaben, Bindestrich erlaubt).
7. Klicke "Create project".

### Schritt 3: Dateien hochladen
1. Du siehst jetzt eine Seite mit einem Upload-Feld.
2. Ziehe alle 5 Dateien (`index.html`, `manifest.json`, `sw.js`, `icon-192.png`, `icon-512.png`) in das Feld — oder klicke "Select from computer" und wähle sie aus.
3. Klicke "Deploy site".
4. Warte ca. 30 Sekunden. Cloudflare zeigt dir dann "Success! Your project is live at …".
5. Kopiere die URL (Format: `https://tripmate.pages.dev` oder `https://tripmate-abc.pages.dev`).

**Das ist deine App-Adresse — dauerhaft, kostenlos, ohne Credits.**

### Später Updates hochladen
Wenn du eine neue Version der App hast:
1. Ins Cloudflare Dashboard gehen → "Workers & Pages" → dein `tripmate`-Projekt anklicken.
2. "Create deployment" → "Upload assets".
3. Neue Dateien ziehen → "Deploy".
4. Deine URL bleibt gleich, nur der Inhalt wird aktualisiert.

---

## Teil 3: Auf dem Handy installieren

### iPhone (Safari):
1. Öffne die pages.dev-URL in Safari (nicht Chrome!).
2. Tippe unten auf das Teilen-Symbol (Quadrat mit Pfeil nach oben).
3. Scrolle runter und wähle "Zum Home-Bildschirm".
4. Tippe "Hinzufügen" – TripMate ist jetzt auf deinem Homescreen wie eine echte App.

### Android (Chrome):
1. Öffne die pages.dev-URL in Chrome.
2. Tippe oben rechts auf das Drei-Punkte-Menü.
3. Wähle "Zum Startbildschirm hinzufügen" oder "App installieren".
4. Bestätigen – fertig.

---

## Teil 4: Die App benutzen

**Beim ersten Start** fragt dich die App nach deinem Namen. Der erscheint dann bei deinen Einträgen.

### Einen Ort hinzufügen
1. Tippe unten rechts auf den blauen **+** Button.
2. Ins Suchfeld den Namen eintippen (z.B. "Shake Shack Covent Garden").
3. Aus den Vorschlägen auswählen – Name, Adresse, Koordinaten und oft auch Öffnungszeiten werden automatisch ausgefüllt.
4. Kategorie prüfen (wird meist automatisch erkannt).
5. Optional: Datum + Uhrzeit eintragen, wenn du schon planst.
6. "Speichern" tippen.

### Mit deiner Frau teilen (per Link, ohne Cloud-Sync)
1. Tippe oben rechts auf das **↗** Symbol.
2. "Link kopieren" tippen.
3. Link per WhatsApp/SMS/Mail an deine Frau schicken.
4. Sie öffnet ihn → sieht alle deine Einträge → kann ihre eigenen hinzufügen.
5. Wenn sie ihre Liste auch teilt, tippst du auf ihren Link und bekommst ihre Einträge importiert.

**Wichtig zum Verständnis:** Ohne Cloud-Sync (Teil 5) ist das Teilen manuell — wer zuletzt teilt, hat die neueste Liste. Für echten gemeinsamen Sync siehe Teil 5.

### Kalender befüllen
- Gehe auf den Tab "Kalender".
- Tippe auf "Zeitraum ändern", um Start- und End-Datum eurer Reise einzutragen.
- Zurück in der Liste: tippe einen Eintrag an → "Bearbeiten" → Datum + Uhrzeit setzen.
- Im Kalender erscheint er dann am richtigen Tag.

### Karte
- Tab "Karte" → alle Einträge werden als farbige Pins angezeigt.
- Auf einen Pin tippen zeigt den Namen.
- So siehst du, was dicht beieinander liegt, und kannst Tage thematisch-geographisch planen.

### Packliste
- Tab "Packliste" → Fortschrittsbalken zeigt, wieviel schon gepackt ist.
- "Schnell hinzufügen" Chips für typische Sachen (Reisepass, Ladegerät, …).
- Tippen auf einen Eintrag hakt ihn ab, Stift-Icon zum Bearbeiten.

---

## Teil 5: Echter Cloud-Sync (optional, 5 Minuten)

Bisher sind Einträge nur auf dem Handy, auf dem sie angelegt wurden. Mit Cloud-Sync sehen du und deine Frau automatisch die Einträge des anderen — ohne Link zu schicken. Weiterhin kostenlos, weiterhin ohne Kreditkarte.

### Schritt 1: Supabase-Account anlegen
1. Auf einem Computer: https://supabase.com öffnen → "Start your project".
2. Mit GitHub oder E-Mail einloggen (kostenlos, keine Karte verlangt).
3. "New Project" → Name: `tripmate` → Datenbank-Passwort setzen (irgendeines — musst du dir nicht merken) → Region: "Frankfurt (eu-central-1)" → "Create".
4. Warten, bis das Projekt aufgebaut ist (~1 Minute).

### Schritt 2: Datenbank-Tabelle anlegen
1. Links im Menü: **SQL Editor** → oben rechts "+ New query".
2. Folgendes einfügen und "Run" klicken:

```sql
create table trips (
  room_code text primary key,
  state jsonb,
  updated_at timestamptz default now()
);
alter table trips enable row level security;
create policy "r" on trips for select using (true);
create policy "i" on trips for insert with check (true);
create policy "u" on trips for update using (true);
```

Du siehst "Success. No rows returned" — alles gut.

### Schritt 3: URL + Key kopieren
1. Links im Menü unten: **Project Settings** (Zahnrad) → **API**.
2. Kopiere zwei Werte:
   - **Project URL** (z.B. `https://abcdefgh.supabase.co`)
   - **anon public** Key (langer String, beginnt mit `eyJ...`)

### Schritt 4: In der App aktivieren
1. TripMate öffnen → oben rechts ⚙ tippen.
2. Ganz unten: **Cloud-Sync einrichten** tippen.
3. Die drei Felder ausfüllen:
   - **Supabase Project URL**: die URL aus Schritt 3
   - **anon public key**: der Key aus Schritt 3
   - **Room-Code**: irgendein Name, den nur du + deine Frau kennt, z.B. `minh-jane-london2026` (nur Kleinbuchstaben, Zahlen, Bindestrich)
4. "Aktivieren" tippen.

Oben im Header erscheint jetzt ein ☁️-Symbol — Sync ist aktiv.

### Schritt 5: Bei deiner Frau genauso
Sie macht nichts Neues in Supabase. Sie öffnet nur deine App (pages.dev- oder GitHub-Pages-URL), geht ins Sync-Setup und trägt **dieselbe URL, denselben Key und denselben Room-Code** ein. Dann sieht sie ab sofort alle deine Einträge, und du alle ihre — automatisch im Hintergrund.

### Wie oft wird synchronisiert?
- Beim Öffnen der App: sofort
- Im Hintergrund: alle 15 Sekunden
- Beim Zurückwechseln von einer anderen App: sofort
- Beim Bearbeiten von dir: ~1 Sekunde nachdem du fertig bist

### Das ☁️-Icon antippen → Force-Sync
Wenn du dir sicher sein willst, dass alles frisch ist: einfach das Cloud-Icon oben antippen.

### Wenn du Sync deaktivieren willst
Einstellungen → Cloud-Sync einrichten → "Sync deaktivieren" unten. Lokale Daten bleiben bestehen.

### Konflikte
Wenn ihr beide im gleichen Eintrag gleichzeitig tippt, gewinnt der spätere Stand. Bei normalem Gebrauch (ihr bearbeitet verschiedene Einträge) passiert das praktisch nie.

---

## FAQ

**Was passiert mit meinen Daten?**
Ohne Cloud-Sync: Alles wird lokal auf deinem Handy gespeichert (im Browser-Storage). Nichts geht an einen Server außer die Suchanfragen an OpenStreetMap.
Mit Cloud-Sync: Dein kompletter State wird in deine eigene Supabase-Datenbank geschrieben. Nur Geräte mit deinem Room-Code + Key sehen ihn. Supabase gehört dir, die Daten gehören dir.

**Ich habe versehentlich auf "Alles zurücksetzen" getippt!**
Dann sind lokale Daten weg. Mit Cloud-Sync einfach neu einrichten (gleiche URL, Key, Room-Code) — Daten kommen zurück.

**Öffnungszeiten fehlen manchmal.**
OpenStreetMap ist ein Community-Projekt – nicht jeder Ort hat Öffnungszeiten hinterlegt. Du kannst sie manuell in das Notizfeld schreiben.

**Auf iPhone verhält sich Safari anders.**
Für Installation als App muss es Safari sein (nicht Chrome/Firefox auf iOS, die können das nicht). Generell: iOS ist bei PWAs etwas restriktiver, aber die Kernfunktionen laufen überall.

**Kann ich statt London eine andere Stadt nutzen?**
Ja: oben rechts ⚙ tippen → Stadt ändern → Speichern. Die Karte zentriert sich dann auf die neue Stadt.

**Ich sehe die Einträge meiner Frau nicht.**
Das ist ohne Cloud-Sync normal — die App speichert nur lokal. Richte Teil 5 ein (Cloud-Sync), dann synct automatisch.

---

## Was als nächstes möglich wäre (Version 2)

- Live-Sync per Supabase Realtime (statt Polling alle 15 s)
- Foto pro Eintrag
- Öffentliche Verkehrsmittel-Routen zwischen Punkten
- Ausgaben-Tracker für die Reise

Sag einfach Bescheid, was als Nächstes dran sein soll.
