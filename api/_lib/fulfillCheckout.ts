import type Stripe from "stripe";
import { grantProgramAccess } from "./grantProgramAccess.js";
import { getSiteUrl } from "./siteUrl.js";
import { getSupabaseAdmin } from "./supabaseAdmin.js";

export type FulfillResult = {
  userId: string;
  email: string | null;
  /** true when this checkout created the member's account (guest checkout). */
  createdAccount: boolean;
};

export function sessionEmail(session: Stripe.Checkout.Session): string | null {
  return (
    session.customer_details?.email?.trim().toLowerCase() ||
    session.customer_email?.trim().toLowerCase() ||
    null
  );
}

async function findUserIdByEmail(email: string): Promise<string | null> {
  const admin = getSupabaseAdmin();
  const { data: profile } = await admin.from("profiles").select("id").eq("email", email).maybeSingle();
  return profile?.id ?? null;
}

/**
 * Maps a paid Checkout Session to a member and unlocks the program.
 * Works for both flows:
 *  - logged-in buyer (client_reference_id / metadata.supabase_user_id)
 *  - guest buyer (no account yet): finds the account by the email used at Stripe, or creates it.
 * Idempotent: the webhook and the /welcome page can both call it for the same session.
 */
export async function fulfillPaidSession(session: Stripe.Checkout.Session): Promise<FulfillResult | null> {
  if (session.payment_status !== "paid") return null;

  const email = sessionEmail(session);
  let userId = session.metadata?.supabase_user_id || session.client_reference_id || null;
  let createdAccount = false;

  if (!userId && email) {
    userId = await findUserIdByEmail(email);
  }

  if (!userId && email) {
    const admin = getSupabaseAdmin();
    const fullName = session.customer_details?.name?.trim() || undefined;
    const { data, error } = await admin.auth.admin.createUser({
      email,
      email_confirm: true,
      user_metadata: fullName ? { full_name: fullName } : undefined,
    });
    if (error) {
      // Another request (webhook vs /welcome) may have created it a moment ago.
      userId = await findUserIdByEmail(email);
      if (!userId) throw error;
    } else {
      userId = data.user?.id ?? null;
      createdAccount = Boolean(userId);
    }
  }

  if (!userId) return null;

  await grantProgramAccess(userId, "stripe_webhook");
  return { userId, email, createdAccount };
}

/** One-time login link that signs the member in and opens the app. */
export async function createLoginLink(email: string): Promise<string | null> {
  const admin = getSupabaseAdmin();
  const { data, error } = await admin.auth.admin.generateLink({
    type: "magiclink",
    email,
    options: { redirectTo: `${getSiteUrl()}/auth/callback` },
  });
  if (error) {
    console.error("[fulfillCheckout] generateLink", error);
    return null;
  }
  return data.properties?.action_link ?? null;
}

/** Welcome email with a login link, so a guest buyer can always get into the app. */
export async function sendWelcomeEmail(email: string, name: string | null): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const link = await createLoginLink(email);
  const site = getSiteUrl();

  if (!apiKey || !link) {
    // Fallback: Supabase's own magic-link email.
    const admin = getSupabaseAdmin();
    const { error } = await admin.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${site}/auth/callback`, shouldCreateUser: false },
    });
    if (error) console.error("[fulfillCheckout] signInWithOtp fallback", error);
    return !error;
  }

  const from = process.env.COACHING_FROM_EMAIL?.trim() || "Coach Milos <info@ptmilosilic.com>";
  const hello = name ? `Hi ${name.split(" ")[0]},` : "Hi,";
  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from,
      to: [email],
      subject: "Your Busy Strong 90 app is ready",
      html: `<p>${hello}</p>
<p>Thank you for joining Busy Strong 90. Your program is unlocked.</p>
<p><a href="${link}" style="display:inline-block;background:#43BABB;color:#07070a;padding:12px 22px;border-radius:999px;font-weight:700;text-decoration:none">Open my app</a></p>
<p>The button logs you in automatically (it works once). Later you can always log in at <a href="${site}/login">${site.replace(/^https?:\/\//, "")}/login</a> with this email: <strong>${email}</strong> and tap "Email me a login link". No password needed.</p>
<p>Start with Week 1, Day 1. If anything is unclear, just reply to this email. I read every message.</p>
<p>Coach Milos</p>`,
    }),
  });
  if (!r.ok) console.error("[fulfillCheckout] resend", r.status, await r.text().catch(() => ""));
  return r.ok;
}
