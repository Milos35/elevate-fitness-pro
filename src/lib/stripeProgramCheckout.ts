import type { User } from "@supabase/supabase-js";

const DEFAULT_PAYMENT_LINK = "https://buy.stripe.com/aFa3cu1Ou1nu61mgSj3cc0b";

/**
 * Stripe Payment Link for the self-guided program.
 * Logged in: carries the Supabase user id so the webhook unlocks that account.
 * Guest (no account): plain link — the webhook / /welcome create the account from the email used at Stripe.
 */
export function buildProgramCheckoutUrl(user?: User | null): string {
  const paymentLink = import.meta.env.VITE_STRIPE_PAYMENT_LINK?.trim() || DEFAULT_PAYMENT_LINK;
  const url = new URL(paymentLink);
  if (user) {
    url.searchParams.set("client_reference_id", user.id);
    if (user.email) url.searchParams.set("prefilled_email", user.email);
  }
  return url.toString();
}
