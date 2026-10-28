export type HandbookLeadRecord = {
  name: string;
  email: string;
  handbookIds: string[];
  source?: string;
};

function supabaseConfig(): { url: string; key: string } | null {
  const url = process.env.SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !key) return null;
  return { url, key };
}

/** Persists a handbook signup via Supabase REST (no SDK import). Returns row id when saved. */
export async function saveHandbookLead(record: HandbookLeadRecord): Promise<string | null> {
  const cfg = supabaseConfig();
  if (!cfg) {
    console.warn("[handbook-lead] Supabase not configured — lead not saved to database");
    return null;
  }

  try {
    const r = await fetch(`${cfg.url}/rest/v1/handbook_leads`, {
      method: "POST",
      headers: {
        apikey: cfg.key,
        Authorization: `Bearer ${cfg.key}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify({
        name: record.name,
        email: record.email.trim().toLowerCase(),
        handbook_ids: record.handbookIds,
        source: record.source ?? "homepage",
        emails_sent: false,
      }),
    });

    if (!r.ok) {
      const text = await r.text();
      console.error("[handbook-lead] database insert failed", r.status, text);
      return null;
    }

    const rows = (await r.json()) as { id?: string }[];
    return rows[0]?.id ?? null;
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[handbook-lead] database insert error", msg);
    return null;
  }
}

export async function markHandbookLeadSent(leadId: string): Promise<void> {
  const cfg = supabaseConfig();
  if (!cfg) return;

  try {
    const r = await fetch(`${cfg.url}/rest/v1/handbook_leads?id=eq.${encodeURIComponent(leadId)}`, {
      method: "PATCH",
      headers: {
        apikey: cfg.key,
        Authorization: `Bearer ${cfg.key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ emails_sent: true }),
    });
    if (!r.ok) {
      const text = await r.text();
      console.error("[handbook-lead] database update failed", r.status, text);
    }
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[handbook-lead] database update error", msg);
  }
}
