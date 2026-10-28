import type { VercelRequest, VercelResponse } from "@vercel/node";
import webpush from "web-push";
import { getSupabaseAdmin } from "../_lib/supabaseAdmin";
import { getMotivationMessage } from "../_lib/motivationMessages";

const DAY_MS = 24 * 60 * 60 * 1000;

/** 1-based program day from the access start (activation), falling back to when the device subscribed. */
function programDay(anchorIso: string): number {
  const start = new Date(anchorIso);
  const startUtc = Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), start.getUTCDate());
  const now = new Date();
  const todayUtc = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  return Math.max(1, Math.floor((todayUtc - startUtc) / DAY_MS) + 1);
}

/**
 * Daily motivation push, run by Vercel Cron (vercel.json) once a day for everyone.
 * Sends today's message (by each member's program day) to every subscribed device with push enabled.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  const cronSecret = process.env.CRON_SECRET?.trim();
  if (cronSecret && req.headers.authorization !== `Bearer ${cronSecret}`) {
    return res.status(401).json({ ok: false, error: "Unauthorized" });
  }

  const publicKey = process.env.VAPID_PUBLIC_KEY?.trim();
  const privateKey = process.env.VAPID_PRIVATE_KEY?.trim();
  const subject = process.env.VAPID_SUBJECT?.trim() || "mailto:info@ptmilosilic.com";
  if (!publicKey || !privateKey) {
    return res.status(500).json({ ok: false, error: "Missing VAPID_PUBLIC_KEY or VAPID_PRIVATE_KEY" });
  }
  webpush.setVapidDetails(subject, publicKey, privateKey);

  const supabase = getSupabaseAdmin();
  const { data: subs, error } = await supabase
    .from("push_subscriptions")
    .select("id, user_id, endpoint, p256dh, auth, locale, created_at");
  if (error) return res.status(500).json({ ok: false, error: error.message });
  if (!subs?.length) return res.status(200).json({ ok: true, sent: 0, removed: 0, skipped: 0 });

  const userIds = [...new Set(subs.map((s) => s.user_id))];
  const [{ data: prefs }, { data: access }] = await Promise.all([
    supabase.from("notification_preferences").select("user_id, push_enabled").in("user_id", userIds),
    supabase.from("member_access").select("user_id, has_access, activated_at, created_at").in("user_id", userIds),
  ]);
  const pushOn = new Set((prefs ?? []).filter((p) => p.push_enabled).map((p) => p.user_id));
  const anchorByUser = new Map(
    (access ?? [])
      .filter((a) => a.has_access)
      .map((a) => [a.user_id, (a.activated_at ?? a.created_at) as string]),
  );

  let sent = 0;
  let removed = 0;
  let skipped = 0;
  const sentIds: string[] = [];

  await Promise.all(
    subs.map(async (sub) => {
      if (!pushOn.has(sub.user_id)) {
        skipped += 1;
        return;
      }
      const day = programDay(anchorByUser.get(sub.user_id) ?? sub.created_at);
      const { title, body } = getMotivationMessage(day, sub.locale);
      try {
        await webpush.sendNotification(
          { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
          JSON.stringify({ title, body, url: "/dashboard", tag: "daily-motivation" }),
          { TTL: 12 * 60 * 60 },
        );
        sent += 1;
        sentIds.push(sub.id);
      } catch (err) {
        const status = (err as { statusCode?: number }).statusCode;
        // 404/410: the device unsubscribed or the subscription expired
        if (status === 404 || status === 410) {
          await supabase.from("push_subscriptions").delete().eq("id", sub.id);
          removed += 1;
        } else {
          console.error("push failed", status, (err as Error).message);
        }
      }
    }),
  );

  if (sentIds.length) {
    await supabase.from("push_subscriptions").update({ last_sent_at: new Date().toISOString() }).in("id", sentIds);
  }

  return res.status(200).json({ ok: true, sent, removed, skipped });
}
