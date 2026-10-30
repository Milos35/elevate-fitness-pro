import type { VercelRequest, VercelResponse } from "@vercel/node";
import getRawBody from "raw-body";
import Stripe from "stripe";
import { fulfillPaidSession, sendWelcomeEmail } from "../_lib/fulfillCheckout.js";

const DEFAULT_NOTIFY = "info@ptmilosilic.com";

async function notifyAdminPurchase(email: string | null, userId: string) {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) return;

  const to = process.env.STRIPE_NOTIFY_EMAIL?.trim() || process.env.COACHING_NOTIFY_EMAIL?.trim() || DEFAULT_NOTIFY;
  const from = process.env.COACHING_FROM_EMAIL?.trim() || "Coach Milos <info@ptmilosilic.com>";

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject: "New Stripe purchase — BUSY STRONG 90",
      html: `<p>A customer completed payment.</p><p><strong>User ID:</strong> ${userId}</p><p><strong>Email:</strong> ${
        email ?? "unknown"
      }</p>`,
    }),
  });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).end("Method Not Allowed");
  }

  const secret = process.env.STRIPE_SECRET_KEY?.trim();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET?.trim();
  if (!secret || !webhookSecret) {
    console.error("[stripe/webhook] Missing STRIPE_SECRET_KEY or STRIPE_WEBHOOK_SECRET");
    return res.status(503).send("Webhook not configured");
  }

  const sig = req.headers["stripe-signature"];
  if (!sig || typeof sig !== "string") {
    return res.status(400).send("Missing stripe-signature");
  }

  let rawBody: Buffer;
  try {
    rawBody = await getRawBody(req);
  } catch (err) {
    console.error("[stripe/webhook] raw body", err);
    return res.status(400).send("Invalid body");
  }

  const stripe = new Stripe(secret);

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (err) {
    console.error("[stripe/webhook] signature", err);
    return res.status(400).send(`Webhook signature verification failed`);
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      if (session.payment_status !== "paid") {
        return res.status(200).json({ received: true });
      }

      // Logged-in buyer, existing account by email, or a guest: the account is created here.
      const result = await fulfillPaidSession(session);

      if (result) {
        if (result.createdAccount && result.email) {
          await sendWelcomeEmail(result.email, session.customer_details?.name ?? null);
        }
        await notifyAdminPurchase(result.email, result.userId);
      } else {
        console.error("[stripe/webhook] Could not map checkout session to a user", {
          sessionId: session.id,
          customer_email: session.customer_email,
          client_reference_id: session.client_reference_id,
        });
      }
    }
  } catch (err) {
    console.error("[stripe/webhook] handler", err);
    return res.status(500).json({ error: "Webhook handler failed" });
  }

  return res.status(200).json({ received: true });
}
