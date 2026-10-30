import type { VercelRequest, VercelResponse } from "@vercel/node";

const DEFAULT_NOTIFY = "info@ptmilosilic.com";
const DEFAULT_FROM = "Coach Milos <info@ptmilosilic.com>";
/** Evergreen Calendly link; override with CALENDLY_CONSULT_URL in Vercel if needed. */
const DEFAULT_CALENDLY = "https://calendly.com/ptmilosilic/quick-consultation-";

type ApplyPayload = {
  firstName?: string;
  lastName?: string;
  email?: string;
  whatsapp?: string;
  location?: string;
  age?: string;
  role?: string;
  fitness?: string;
  goal?: string;
  triedBefore?: string;
  minutes?: string;
  anythingElse?: string;
  /** `coached-strong-90` | `private-transformation` from apply page query string */
  coachingPlan?: string;
  /** Localized plan label from client (EUR or AED display) */
  coachingPlanLabel?: string;
};

const COACHING_PLAN_LABEL: Record<string, string> = {
  "coached-strong-90": "Coached Strong 90 — Core Coaching (1,299 AED/mo)",
  "private-transformation": "Private Transformation — Elite (2,999 AED/mo)",
};

function coachingPlanHuman(slug: string, labelOverride?: string): string {
  const override = trimMax(labelOverride, 120);
  if (override) return override;
  const s = slug.trim().toLowerCase();
  return COACHING_PLAN_LABEL[s] ?? "Not specified (applicant did not use a plan-specific link)";
}

const AGE_LABEL: Record<string, string> = {
  "25-34": "25–34",
  "35-39": "35–39",
  "40-44": "40–44",
  "45-49": "45–49",
  "50+": "50+",
};

const ROLE_LABEL: Record<string, string> = {
  founder: "Business Owner / Founder",
  corporate: "Corporate Professional",
  parent: "Parent (stay-at-home or part-time)",
  freelance: "Freelancer / Self-Employed",
  other: "Other",
};

const FITNESS_LABEL: Record<string, string> = {
  scratch: "Haven't trained in 6+ months",
  inconsistent: "Inconsistent — train sometimes but can't stick to it",
  "no-results": "Training regularly but not seeing results",
  experienced: "Experienced — just need structure and accountability",
};

const MINUTES_LABEL: Record<string, string> = {
  "20-30": "20–30 minutes",
  "30-40": "30–40 minutes",
  "40-60": "40–60 minutes",
  less: "Less than 20 minutes",
};

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function trimMax(s: string | undefined, max: number): string {
  const t = (s ?? "").trim();
  return t.length > max ? t.slice(0, max) : t;
}

async function sendResend(params: {
  apiKey: string;
  from: string;
  to: string[];
  subject: string;
  html: string;
  replyTo?: string;
}): Promise<void> {
  const payload: Record<string, unknown> = {
    from: params.from,
    to: params.to,
    subject: params.subject,
    html: params.html,
  };
  if (params.replyTo) {
    payload.reply_to = params.replyTo;
  }
  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${params.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  if (!r.ok) {
    const text = await r.text();
    let detail = text;
    try {
      const j = JSON.parse(text) as { message?: string };
      if (j.message) detail = j.message;
    } catch {
      /* keep raw */
    }
    const err = new Error(`Resend ${r.status}: ${detail}`);
    console.error("[coaching-apply] Resend error", r.status, detail);
    throw err;
  }
}

/** Vercel usually parses JSON; handle string/Buffer and empty bodies. */
function parsePayload(req: VercelRequest): ApplyPayload | null {
  const raw = req.body as unknown;
  if (raw == null) return null;
  if (typeof raw === "object" && !Buffer.isBuffer(raw)) {
    return raw as ApplyPayload;
  }
  if (typeof raw === "string") {
    try {
      return JSON.parse(raw) as ApplyPayload;
    } catch {
      return null;
    }
  }
  if (Buffer.isBuffer(raw)) {
    try {
      return JSON.parse(raw.toString("utf8")) as ApplyPayload;
    } catch {
      return null;
    }
  }
  return null;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return res.status(503).json({ error: "Email service is not configured." });
  }

  const notifyEmail = process.env.COACHING_NOTIFY_EMAIL?.trim() || DEFAULT_NOTIFY;
  const fromEmail = process.env.COACHING_FROM_EMAIL?.trim() || DEFAULT_FROM;
  const calendlyUrl = process.env.CALENDLY_CONSULT_URL?.trim() || DEFAULT_CALENDLY;

  const raw = parsePayload(req);
  if (!raw) {
    return res.status(400).json({ error: "Invalid or empty JSON body" });
  }

  const firstName = trimMax(raw.firstName, 120);
  const lastName = trimMax(raw.lastName, 120);
  const email = trimMax(raw.email, 320);
  const whatsapp = trimMax(raw.whatsapp, 80);
  const location = trimMax(raw.location, 200);
  const age = trimMax(raw.age, 40);
  const role = trimMax(raw.role, 80);
  const fitness = trimMax(raw.fitness, 80);
  const goal = trimMax(raw.goal, 8000);
  const triedBefore = trimMax(raw.triedBefore, 8000);
  const minutes = trimMax(raw.minutes, 80);
  const anythingElse = trimMax(raw.anythingElse, 8000);
  const coachingPlanSlug = trimMax(raw.coachingPlan, 80);
  const planHuman = coachingPlanHuman(coachingPlanSlug, raw.coachingPlanLabel);

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // Short form: only name, email and goal are required; the rest is optional.
  if (!firstName || !emailOk || !goal) {
    return res.status(400).json({ error: "Please complete all required fields with a valid email." });
  }

  const ageHuman = AGE_LABEL[age] ?? age;
  const roleHuman = ROLE_LABEL[role] ?? role;
  const fitnessHuman = FITNESS_LABEL[fitness] ?? fitness;
  const minutesHuman = MINUTES_LABEL[minutes] ?? minutes;

  const row = (label: string, value: string) =>
    `<tr><td style="padding:8px 12px;border:1px solid #e5e5e5;background:#fafafa;font-weight:600;width:200px;">${escapeHtml(
      label
    )}</td><td style="padding:8px 12px;border:1px solid #e5e5e5;">${escapeHtml(value).replace(/\n/g, "<br/>")}</td></tr>`;

  const coachHtml = `
<!DOCTYPE html><html><body style="font-family:system-ui,sans-serif;line-height:1.5;color:#111;">
<p><strong>New coaching application</strong></p>
<table style="border-collapse:collapse;width:100%;max-width:640px;">
<tbody>
${row("Coaching plan", planHuman)}
${row("Name", `${firstName} ${lastName}`)}
${row("Email", email)}
${whatsapp ? row("WhatsApp", whatsapp) : ""}
${location ? row("Location", location) : ""}
${row("Age range", ageHuman)}
${row("Role", roleHuman)}
${row("Fitness level", fitnessHuman)}
${row("#1 goal", goal)}
${triedBefore ? row("Tried before", triedBefore) : ""}
${row("Daily minutes", minutesHuman)}
${anythingElse ? row("Anything else", anythingElse) : ""}
</tbody></table>
</body></html>`;

  const first = escapeHtml(firstName);
  const calLink = escapeHtml(calendlyUrl);
  const applicantHtml = `
<!DOCTYPE html><html><body style="font-family:system-ui,sans-serif;line-height:1.6;color:#111;max-width:560px;">
<p>Hi ${first},</p>
<p><strong>Program:</strong> ${escapeHtml(planHuman)}</p>
<p>Thank you for submitting your coaching application — I really appreciate you taking the time to share your goals with me.</p>
<p><strong>Welcome.</strong> I read every application personally, and I&apos;ll follow up within 24 hours if we look like a good fit.</p>
<p><strong>Next step:</strong> book a quick consultation so we can connect and see how I can help you move forward.</p>
<p style="margin:24px 0;">
  <a href="${calLink}" style="display:inline-block;background:#111;color:#fff;text-decoration:none;padding:12px 20px;border-radius:8px;font-weight:600;">Book your consultation</a>
</p>
<p style="word-break:break-all;font-size:14px;color:#444;">${calLink}</p>
<p>This is a short, no-pressure conversation — just a chance to align on where you are and what you want next.</p>
<p>Talk soon,<br/>Milos</p>
</body></html>`;

  try {
    await sendResend({
      apiKey,
      from: fromEmail,
      to: [notifyEmail],
      subject: `New coaching application (${planHuman}): ${firstName} ${lastName}`,
      html: coachHtml,
      replyTo: email,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[coaching-apply] coach notify failed", msg);
    return res.status(502).json({
      error: formatResendUserMessage(msg),
    });
  }

  try {
    await sendResend({
      apiKey,
      from: fromEmail,
      to: [email],
      subject: "We received your coaching application — next step",
      html: applicantHtml,
      replyTo: notifyEmail,
    });
    return res.status(200).json({ ok: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[coaching-apply] applicant confirmation failed", msg);
    return res.status(200).json({
      ok: true,
      applicantEmailSent: false,
      warning:
        "Your application was received, but we could not send the confirmation email. You should still hear back within 24 hours.",
    });
  }
}

/** Maps Resend errors to a short hint for the UI (full detail stays in Vercel logs). */
function formatResendUserMessage(resendMessage: string): string {
  const m = resendMessage.toLowerCase();
  if (m.includes("domain") && (m.includes("verify") || m.includes("not valid"))) {
    return "Email could not be sent: the sender domain must be verified in Resend (Dashboard → Domains). Check server logs for details.";
  }
  if (m.includes("testing") || m.includes("only send") || m.includes("restricted")) {
    return "Email could not be sent: Resend may be in test mode or recipient limits apply until your domain is verified.";
  }
  if (m.includes("401") || m.includes("403")) {
    return "Email could not be sent: check RESEND_API_KEY and verified sender domain in Resend.";
  }
  return "Could not send emails. Please try again later.";
}
