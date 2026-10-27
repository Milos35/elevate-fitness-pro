import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import i18n from "@/i18n";
import { currencyForLanguage, type DisplayCurrency } from "@/lib/pricing";

const STORAGE_KEY = "bs90-display-currency";
const CURRENCIES: DisplayCurrency[] = ["EUR", "AED", "RSD"];

function readStoredCurrency(): DisplayCurrency {
  if (typeof window === "undefined") return "EUR";
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === "EUR" || stored === "AED" || stored === "RSD") return stored;
  return currencyForLanguage(i18n.language);
}

type CurrencyContextValue = {
  currency: DisplayCurrency;
  setCurrency: (currency: DisplayCurrency) => void;
  currencies: DisplayCurrency[];
};

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<DisplayCurrency>(readStoredCurrency);

  // Until the visitor picks a currency, follow the language (e.g. opening /sr or /ar directly).
  useEffect(() => {
    const onLanguageChanged = (lng: string) => {
      if (!window.localStorage.getItem(STORAGE_KEY)) setCurrencyState(currencyForLanguage(lng));
    };
    i18n.on("languageChanged", onLanguageChanged);
    // The route may have switched the language before this effect subscribed (child effects run first).
    onLanguageChanged(i18n.language);
    return () => i18n.off("languageChanged", onLanguageChanged);
  }, []);

  const setCurrency = useCallback((next: DisplayCurrency) => {
    setCurrencyState(next);
    window.localStorage.setItem(STORAGE_KEY, next);
  }, []);

  const value = useMemo(
    () => ({ currency, setCurrency, currencies: CURRENCIES }),
    [currency, setCurrency],
  );

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export function useDisplayCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error("useDisplayCurrency must be used within CurrencyProvider");
  return ctx;
}
