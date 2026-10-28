import type { VercelRequest, VercelResponse } from "@vercel/node";
import Stripe from "stripe";
import { getUserFromBearer } from "../_lib/authUser";
import { getSiteUrl } from "../_lib/siteUrl";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const secret = process.env.STRIPE_SECRET_KEY?.trim();
  const priceId = process.env.STRIPE_PRICE_ID?.trim();
  if (!secret || !priceId) {
    return res.status(503).json({ error: "Stripe is not configured on the server." });
  }

  const { user, error: authError } = await getUserFromBearer(req.headers.authorization);
  if (!user) {
    return res.status(401).json({ error: authError ?? "Unauthorized" });
  }

  const stripe = new Stripe(secret);
  const site = getSiteUrl();

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${site}/dashboard?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${site}/pricing?checkout=canceled`,
      client_reference_id: user.id,
      customer_email: user.email ?? undefined,
      metadata: {
        supabase_user_id: user.id,
      },
      payment_intent_data: {
        metadata: {
          supabase_user_id: user.id,
        },
      },
    });

    if (!session.url) {
      return res.status(502).json({ error: "Could not create checkout session." });
    }

    return res.status(200).json({ url: session.url });
  } catch (e) {
    console.error("[stripe/create-checkout-session]", e);
    return res.status(502).json({ error: "Could not start checkout. Try again later." });
  }
}
