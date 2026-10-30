import type { VercelRequest, VercelResponse } from "@vercel/node";
import Stripe from "stripe";
import { createLoginLink, fulfillPaidSession } from "../_lib/fulfillCheckout.js";

type Body = { sessionId?: string };

/** A buyer can open the app straight from the thank-you page for this long after paying. */
const CLAIM_WINDOW_SECONDS = 3 * 60 * 60;

/**
 * Called by /welcome after Stripe redirects back (?session_id=cs_...).
 * Confirms the payment, makes sure the account exists with access (same as the webhook, idempotent)
 * and returns a one-time login link, so the buyer lands in the app without creating a password.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const secret = process.env.STRIPE_SECRET_KEY?.trim();
  if (!secret) return res.status(503).json({ error: "Stripe is not configured on the server." });

  let body: Body = {};
  try {
    body = typeof req.body === "string" ? (JSON.parse(req.body) as Body) : ((req.body as Body) ?? {});
  } catch {
    return res.status(400).json({ error: "Invalid JSON" });
  }

  const sessionId = typeof body.sessionId === "string" ? body.sessionId.trim() : "";
  if (!sessionId.startsWith("cs_")) return res.status(400).json({ error: "Invalid session id" });

  const stripe = new Stripe(secret);
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.payment_status !== "paid") return res.status(400).json({ error: "Payment not completed" });

    const result = await fulfillPaidSession(session);
    if (!result) return res.status(422).json({ error: "Could not match this payment to an email" });

    const value = session.amount_total != null ? session.amount_total / 100 : undefined;
    const currency = session.currency ? session.currency.toUpperCase() : undefined;

    const fresh = Date.now() / 1000 - session.created < CLAIM_WINDOW_SECONDS;
    const loginUrl = fresh && result.email ? await createLoginLink(result.email) : null;

    return res.status(200).json({ ok: true, email: result.email, loginUrl, value, currency });
  } catch (e) {
    console.error("[stripe/claim]", e);
    return res.status(502).json({ error: "Could not confirm the payment" });
  }
}
