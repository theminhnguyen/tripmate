// =====================================================================
// TripMate — Cloudflare Email Worker (optional, Phase B)
// =====================================================================
// Was macht dieses Skript?
//   Wenn du dir bei Cloudflare eine kostenlose Email-Route einrichtest
//   (z.B. trips@deinedomain.de), kannst du Buchungs-Emails an diese
//   Adresse weiterleiten. Dieser Worker:
//     1. Empfängt die Email
//     2. Extrahiert From/Subject/Body
//     3. Schreibt die Email in deine Supabase-Tabelle `email_inbox`
//
//   Die TripMate-App holt sich beim nächsten Start die neuen Emails
//   aus dieser Tabelle, parst sie clientseitig (gleiche Regex wie der
//   Paste-Import) und schlägt sie als Vorschläge vor.
//
// Setup-Schritte (siehe auch EMAIL_IMPORT.md):
//   1. In Supabase: Tabelle `email_inbox` anlegen (siehe SQL unten)
//   2. Cloudflare Account anlegen (kostenlos), Workers + Email Routing
//   3. Domain bei Cloudflare registrieren oder vorhandene hinzufügen
//   4. Diesen Worker als neuen Worker in deinem Cloudflare-Account anlegen
//   5. Environment Variables setzen: SUPABASE_URL, SUPABASE_KEY, USER_ID
//   6. Email Routing Regel: trips@deinedomain.de → diesen Worker
//
// SQL (in Supabase Dashboard → SQL Editor):
//   create table public.email_inbox (
//     id uuid primary key default gen_random_uuid(),
//     user_id text not null,
//     received_at timestamptz default now(),
//     from_addr text,
//     subject text,
//     body text,
//     processed boolean default false
//   );
//   create index on public.email_inbox (user_id, processed, received_at desc);
//   alter table public.email_inbox enable row level security;
//   create policy "user reads own emails" on public.email_inbox
//     for all using (true);  -- vereinfacht; pro Use-Case anpassen
//
// =====================================================================

export default {
  async email(message, env, ctx) {
    try {
      const from = message.from;
      const subject = message.headers.get('subject') || '';
      const raw = await new Response(message.raw).text();
      const body = extractTextBody(raw);

      // POST in die Supabase email_inbox Tabelle
      const resp = await fetch(`${env.SUPABASE_URL}/rest/v1/email_inbox`, {
        method: 'POST',
        headers: {
          'apikey': env.SUPABASE_KEY,
          'Authorization': `Bearer ${env.SUPABASE_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({
          user_id: env.USER_ID,
          from_addr: from,
          subject: subject,
          body: body.slice(0, 50000),  // 50k cap
          processed: false
        })
      });

      if (!resp.ok) {
        const err = await resp.text();
        console.error('Supabase insert failed:', resp.status, err);
        // Email ablehnen, damit Cloudflare nochmal probiert
        message.setReject('Storage failed');
        return;
      }

      // Erfolg — die App holt sich den Eintrag beim nächsten Sync
    } catch (e) {
      console.error('Worker error:', e);
      message.setReject('Internal error');
    }
  }
};

// Sehr einfacher MIME-Parser: nimmt entweder text/plain (bevorzugt) oder
// fällt auf einen rohen Body-Auszug zurück.
function extractTextBody(raw) {
  // Suche nach "Content-Type: text/plain" Block
  const plainMatch = raw.match(/Content-Type:\s*text\/plain[\s\S]*?\n\n([\s\S]*?)(?=\n--|\nContent-Type|$)/i);
  if (plainMatch) return cleanBody(plainMatch[1]);

  // Fallback: Body nach erstem Doppel-Newline
  const bodyMatch = raw.match(/\r?\n\r?\n([\s\S]*)/);
  if (bodyMatch) return cleanBody(bodyMatch[1]);

  return raw.slice(0, 10000);
}

function cleanBody(text) {
  // Quoted-Printable Decoding (sehr basal)
  return text
    .replace(/=\r?\n/g, '')
    .replace(/=([0-9A-F]{2})/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
    .replace(/[\r]/g, '')
    .trim();
}
