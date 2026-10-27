import { resolveHomepageLocale } from "@/i18n/constants";

export type DisplayCurrency = "EUR" | "AED" | "RSD";

export type PricingTier = {
  amount: number;
  label: string;
  labelOneTime?: string;
  labelMonthly?: string;
  stripeAmountFils?: number;
};

export type PricingSet = {
  currency: DisplayCurrency;
  selfGuided: PricingTier & { labelOneTime: string; stripeAmountFils: number };
  coachedStrong90: PricingTier & { labelMonthly: string };
  privateTransformation: PricingTier & { labelMonthly: string };
};

type PriceSuffixes = {
  oneTime: string;
  perMonth: string;
};

/** Stripe checkout stays in AED fils. Display currency can differ.
 *  The amount actually charged comes from the Stripe price (STRIPE_PRICE_ID) — keep it in sync with this. */
const STRIPE_SELF_GUIDED_FILS = 40700;

const AMOUNTS: Record<DisplayCurrency, { selfGuided: number; coachedStrong90: number; privateTransformation: number }> = {
  EUR: { selfGuided: 99, coachedStrong90: 299, privateTransformation: 699 },
  // €99 at ~4.11 AED/EUR (mid-market, 27 Oct 2026)
  AED: { selfGuided: 407, coachedStrong90: 1299, privateTransformation: 2999 },
  // EUR prices at the NBS middle rate 117.498 RSD/EUR (26 Oct 2026), rounded to 10 dinars
  RSD: { selfGuided: 11630, coachedStrong90: 35130, privateTransformation: 82130 },
};

/** Arabic → dirham, Serbian → dinar, English → euro. */
export function currencyForLanguage(lang: string): DisplayCurrency {
  const locale = resolveHomepageLocale(lang);
  if (locale === "ar") return "AED";
  if (locale === "sr") return "RSD";
  return "EUR";
}

export function formatPriceAmount(amount: number, currency: DisplayCurrency): string {
  if (currency === "EUR") return `€${amount}`;
  if (currency === "RSD") return `${amount.toLocaleString("sr-RS")} RSD`;
  return `${amount.toLocaleString("en-US")} AED`;
}

export function buildPricing(currency: DisplayCurrency, suffixes: PriceSuffixes): PricingSet {
  const amounts = AMOUNTS[currency];
  const selfGuided = formatPriceAmount(amounts.selfGuided, currency);
  const coached = formatPriceAmount(amounts.coachedStrong90, currency);
  const privateTier = formatPriceAmount(amounts.privateTransformation, currency);

  return {
    currency,
    selfGuided: {
      amount: amounts.selfGuided,
      label: selfGuided,
      labelOneTime: `${selfGuided} ${suffixes.oneTime}`,
      stripeAmountFils: STRIPE_SELF_GUIDED_FILS,
    },
    coachedStrong90: {
      amount: amounts.coachedStrong90,
      label: coached,
      labelMonthly: `${coached} ${suffixes.perMonth}`,
    },
    privateTransformation: {
      amount: amounts.privateTransformation,
      label: privateTier,
      labelMonthly: `${privateTier} ${suffixes.perMonth}`,
    },
  };
}

/** Stripe + legacy imports — always AED amounts for payment processing. */
export const PRICING = buildPricing("AED", { oneTime: "one-time", perMonth: "/ month" });

export const CALENDLY_FREE_CALL_URL = "https://calendly.com/ptmilosilic/quick-consultation-";
