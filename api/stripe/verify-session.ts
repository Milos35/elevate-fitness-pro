import type { VercelRequest, VercelResponse } from "@vercel/node";
import Stripe from "stripe";
import { getUserFromBearer } from "../_lib/authUser.js";
import { grantProgramAccess } from "../_lib/grantProgramAccess.js";

type Body = { sessionId?: string };

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const secret = process.env.STRIPE_SECRET_KEY?.trim();
  if (!secret) {
    return res.status(503).json({ error: "Stripe is not configured on the server." });
  }

  const { user, error: authError } = await getUserFromBearer(req.headers.authorization);
  if (!user) {
    return res.status(401).json({ error: authError ?? "Unauthorized" });
  }

  let body: Body = {};
  try {
    body =
      typeof req.body === "string" ? (JSON.parse(req.body) as Body) : ((req.body as Body) ?? {});
  } catch {
    return res.status(400).json({ error: "Invalid JSON" });
  }

  const sessionId = typeof body.sessionId === "string" ? body.sessionId.trim() : "";
  if (!sessionId.startsWith("cs_")) {
    return res.status(400).json({ error: "Invalid session id" });
  }

  const stripe = new Stripe(secret);

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      return res.status(400).json({ error: "Payment not completed" });
    }

    /** Payment Links pass user id via `client_reference_id` (see buildProgramCheckoutUrl); hosted Checkout sets metadata.supabase_user_id. */
    const linkedUserId =
      (typeof session.metadata?.supabase_user_id === "string" ? session.metadata.supabase_user_id : "") ||
      (typeof session.client_reference_id === "string" ? session.client_reference_id : "") ||
      null;

    if (!linkedUserId || linkedUserId !== user.id) {
      return res.status(403).json({ error: "Session does not belong to this account" });
    }

    await grantProgramAccess(user.id, "stripe");

    const value = session.amount_total != null ? session.amount_total / 100 : undefined;
    const currency = session.currency ? session.currency.toUpperCase() : undefined;

    return res.status(200).json({ ok: true, value, currency });
  } catch (e) {
    console.error("[stripe/verify-session]", e);
    return res.status(502).json({ error: "Could not verify payment" });
  }
}
