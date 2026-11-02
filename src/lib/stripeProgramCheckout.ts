import type { User } from "@supabase/supabase-js";

// Busy Strong 90 program: 407 AED one payment (price_1UV5dIBylSrA2OzuCsDIeTjB).
// After payment Stripe redirects to /welcome?session_id=... (guest checkout, no sign-up needed).
const PROGRAM_PAYMENT_LINK = "https://buy.stripe.com/14AeVc9gWaY4gG09pR3cc0k";

/**
 * Stripe Payment Link for the self-guided program.
 * Logged in: carries the Supabase user id so the webhook unlocks that account.
 * Guest (no account): plain link — the webhook / /welcome create the account from the email used at Stripe.
 */
export function buildProgramCheckoutUrl(user?: User | null): string {
  // The old VITE_STRIPE_PAYMENT_LINK pointed at a deactivated 150 AED link, so the link lives here now.
  const paymentLink = PROGRAM_PAYMENT_LINK;
  const url = new URL(paymentLink);
  if (user) {
    url.searchParams.set("client_reference_id", user.id);
    if (user.email) url.searchParams.set("prefilled_email", user.email);
  }
  return url.toString();
}
