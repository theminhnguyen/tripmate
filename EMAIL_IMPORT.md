# Email-Import in TripMate

Es gibt zwei Wege, Buchungsbestätigungen automatisch in TripMate zu übernehmen:

## ✅ Phase A — Paste-Import (sofort nutzbar)

Bereits eingebaut in TripMate v0.5.3. Funktioniert ohne Setup, ohne Cloudflare-Konto, ohne Domain.

**So geht's:**
1. Öffne in deinem Mail-Client die Buchungs-Email (Hotel, Flug, Zug, Airbnb, …)
2. Markiere den kompletten Text der Email und kopiere ihn (`Cmd+C`)
3. In TripMate: Reiseplan-Panel → Button **"📧 Bestätigungs-Email einfügen"**
4. Text einfügen (`Cmd+V`) → **"🔍 Vorschau prüfen"**
5. Wenn die Daten stimmen: **"Hinzufügen"**

Der Parser erkennt automatisch:
- **Booking.com / Hotelbestätigungen** → Unterkunft (Name, Adresse, Check-in, Check-out)
- **Airbnb** → Unterkunft (Gastgeber, Adresse, Termine)
- **Lufthansa, Easyjet, Ryanair, …** → Flug-Termin (Flugnummer, IATA-Codes, Datum, Uhrzeit)
- **Deutsche Bahn, SNCF, Trenitalia, …** → Zug-Termin (Zugnummer, Strecke, Datum, Uhrzeit)
- **Flixbus & Co.** → Bus-Termin
- **OpenTable, Eventim, GetYourGuide, …** → Veranstaltungs-Termin

Importierte Einträge erscheinen automatisch im Reiseplan und werden via Cloud-Sync mit allen deinen Geräten geteilt.

---

## ⚙️ Phase B — Cloudflare Email Worker (optional, voll-automatisch)

Wer möchte, kann eine eigene "Drop-Adresse" einrichten (z.B. `trips@deinedomain.de`). Emails an diese Adresse werden vollautomatisch in TripMate aufgenommen — kein Copy/Paste mehr nötig.

### Voraussetzungen

- Eine Domain (eigene oder bei Cloudflare registriert)
- Cloudflare-Account (kostenlos)
- Funktionierende Supabase-Synchronisation in TripMate

### Schritt 1: Supabase-Tabelle anlegen

In Supabase → SQL Editor:

```sql
create table public.email_inbox (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  received_at timestamptz default now(),
  from_addr text,
  subject text,
  body text,
  processed boolean default false
);
create index on public.email_inbox (user_id, processed, received_at desc);
alter table public.email_inbox enable row level security;
create policy "user reads own emails" on public.email_inbox
  for all using (true);
```

### Schritt 2: Cloudflare Worker bereitstellen

1. Gehe zu [dash.cloudflare.com](https://dash.cloudflare.com) → Workers & Pages → "Create Worker"
2. Erstelle einen neuen Worker (z.B. `tripmate-email`)
3. Ersetze den Default-Code mit dem Inhalt aus `email-worker.js` aus diesem Repo
4. Unter **Settings → Variables → Environment Variables** setzen:
   - `SUPABASE_URL` — z.B. `https://xxx.supabase.co`
   - `SUPABASE_KEY` — dein Supabase `service_role` Key (nicht der `anon` Key!)
   - `USER_ID` — eine Kennung für dich (z.B. deine Email-Adresse)
5. **Deploy**

### Schritt 3: Email Routing

1. Cloudflare Dashboard → deine Domain → **Email** → **Email Routing**
2. Email Routing aktivieren (DNS-Einträge werden automatisch gesetzt)
3. Neue Routing-Regel:
   - Match: `trips@deinedomain.de` (oder welcher Alias auch immer)
   - Action: **"Send to a Worker"** → wähle den eben angelegten Worker

### Schritt 4: TripMate konfigurieren

Tba — der Polling-Code muss noch in TripMate eingebaut werden (Roadmap).
Vorläufig kannst du Emails an deine Drop-Adresse weiterleiten und manuell aus der Supabase-Tabelle prüfen.

### Sicherheit

- Der Worker schreibt nur in deine eigene Supabase-Tabelle — niemand sonst hat Zugriff
- Verwende immer den `service_role` Key, **niemals** ihn im Client-Code committen
- Beschränke das Email-Routing auf bekannte Absender wenn möglich
