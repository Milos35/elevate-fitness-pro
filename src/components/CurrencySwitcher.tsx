import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDisplayCurrency } from "@/context/CurrencyContext";
import type { DisplayCurrency } from "@/lib/pricing";

const LABEL_KEY: Record<DisplayCurrency, "eur" | "aed" | "rsd"> = {
  EUR: "eur",
  AED: "aed",
  RSD: "rsd",
};

type Props = {
  className?: string;
  variant?: "ghost" | "outline";
};

export function CurrencySwitcher({ className, variant = "ghost" }: Props) {
  const { t } = useTranslation();
  const { currency, setCurrency, currencies } = useDisplayCurrency();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant={variant}
          size="sm"
          className={className}
          aria-label={t("currency.label")}
        >
          <span className="text-xs font-semibold uppercase">{currency}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {currencies.map((code) => (
          <DropdownMenuItem
            key={code}
            onClick={() => setCurrency(code)}
            className={currency === code ? "font-semibold text-primary" : undefined}
          >
            {t(`currency.${LABEL_KEY[code]}`)}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
