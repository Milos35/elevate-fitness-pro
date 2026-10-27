import { resolveHomepageLocale } from "@/i18n/constants";

export type DisplayCurrency = "EUR" | "AED";

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

/** Stripe checkout stays in AED fils. Display currency can differ. */
const STRIPE_SELF_GUIDED_FILS = 16900;

const AMOUNTS: Record<DisplayCurrency, { selfGuided: number; coachedStrong90: number; privateTransformation: number }> = {
  EUR: { selfGuided: 99, coachedStrong90: 299, privateTransformation: 699 },
  AED: { selfGuided: 169, coachedStrong90: 1299, privateTransformation: 2999 },
};

/** Arabic → dirham. English and Serbian → euro. */
export function currencyForLanguage(lang: string): DisplayCurrency {
  return resolveHomepageLocale(lang) === "ar" ? "AED" : "EUR";
}

export function formatPriceAmount(amount: number, currency: DisplayCurrency): string {
  if (currency === "EUR") return `€${amount}`;
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
