# TripMate – Deine Urlaubs-Companion-App

Dies ist die erste Version. Alles ist kostenlos, keine Kreditkarte, keine Accounts, keine API-Keys.

## Was die App kann
- Liste mit Kategorien: Sehenswürdigkeit, Restaurant, Shopping, Sonstiges
- Ort suchen (z.B. "Natural History Museum London") → Adresse, Koordinaten und (falls in OpenStreetMap hinterlegt) Öffnungszeiten + Website werden automatisch gezogen
- Kalender-Ansicht: Termine pro Tag planen
- Karten-Ansicht: alle Punkte auf einer OpenStreetMap
- Teilen: per Link an deine Frau – sie tippt drauf, sieht alle Einträge und kann eigene hinzufügen
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

### Mit deiner Frau teilen
1. Tippe oben rechts auf das **↗** Symbol.
2. "Link kopieren" tippen.
3. Link per WhatsApp/SMS/Mail an deine Frau schicken.
4. Sie öffnet ihn → sieht alle deine Einträge → kann ihre eigenen hinzufügen.
5. Wenn sie ihre Liste auch teilt, tippst du auf ihren Link und bekommst ihre Einträge importiert.

**Wichtig zum Verständnis:** Da es ohne Account keinen zentralen Server gibt, ist Sync per Link. Wer zuletzt teilt, hat die neueste Liste. In der Praxis: einer von euch (z.B. du) ist der "Hauptplaner", deine Frau schickt dir ihren Link nach dem Hinzufügen, du übernimmst.

### Kalender befüllen
- Gehe auf den Tab "Kalender".
- Tippe auf "Zeitraum ändern", um Start- und End-Datum eurer Reise einzutragen.
- Zurück in der Liste: tippe einen Eintrag an → "Bearbeiten" → Datum + Uhrzeit setzen.
- Im Kalender erscheint er dann am richtigen Tag.

### Karte
- Tab "Karte" → alle Einträge werden als farbige Pins angezeigt.
- Auf einen Pin tippen zeigt den Namen.
- So siehst du, was dicht beieinander liegt, und kannst Tage thematisch-geographisch planen.

---

## FAQ

**Was passiert mit meinen Daten?**
Alles wird lokal auf deinem Handy gespeichert (im Browser-Storage). Nichts geht an einen Server außer die Suchanfragen an OpenStreetMap (nur der Suchtext, z.B. "Shake Shack London"). Wenn du den Share-Link schickst, sind deine Daten in der URL codiert – der Empfänger sieht sie, sonst niemand.

**Ich habe versehentlich auf "Alles zurücksetzen" getippt!**
Dann sind lokale Daten weg. Wenn du vorher einen Share-Link gespeichert hast: einfach wieder öffnen und alle Daten sind zurück.

**Öffnungszeiten fehlen manchmal.**
OpenStreetMap ist ein Community-Projekt – nicht jeder Ort hat Öffnungszeiten hinterlegt. Du kannst sie manuell in das Notizfeld schreiben.

**Auf iPhone verhält sich Safari anders.**
Für Installation als App muss es Safari sein (nicht Chrome/Firefox auf iOS, die können das nicht). Generell: iOS ist bei PWAs etwas restriktiver, aber die Kernfunktionen laufen überall.

**Kann ich statt London eine andere Stadt nutzen?**
Ja: oben rechts ⚙ tippen → Stadt ändern → Speichern. Die Karte zentriert sich dann auf die neue Stadt.

---

## Was als nächstes möglich wäre (Version 2)

Falls du die App weiter ausbauen willst, wären sinnvolle nächste Schritte:
- Echter Cloud-Sync (mit Supabase-Free-Tier, ohne Kreditkarte) – dann Sync automatisch statt per Link
- Foto pro Eintrag
- Öffentliche Verkehrsmittel-Routen zwischen Punkten
- Ausgaben-Tracker für die Reise
- Packliste

Sag einfach Bescheid, was als Nächstes dran sein soll.
