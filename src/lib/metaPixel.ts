declare global {
  interface Window {
    fbq?: Fbq;
    _fbq?: Fbq;
  }
}

type Fbq = {
  (...args: unknown[]): void;
  callMethod?: (...args: unknown[]) => void;
  queue?: unknown[];
  push?: Fbq;
  loaded?: boolean;
  version?: string;
};

export const META_PIXEL_ID = import.meta.env.VITE_META_PIXEL_ID?.trim() || "1530200815324243";

let scriptRequested = false;

function getFbq(): Fbq | undefined {
  return typeof window !== "undefined" ? window.fbq : undefined;
}

/** Load Meta Pixel base script once (skipped when index.html already injected fbq). */
export function ensureMetaPixelScript(): void {
  if (typeof window === "undefined" || !META_PIXEL_ID || scriptRequested) return;
  if (getFbq()) {
    scriptRequested = true;
    initialized = true;
    return;
  }
  scriptRequested = true;

  const fbq: Fbq = function (...args: unknown[]) {
    if (fbq.callMethod) {
      fbq.callMethod(...args);
    } else {
      fbq.queue?.push(args);
    }
  };
  if (!window._fbq) window._fbq = fbq;
  window.fbq = fbq;
  fbq.push = fbq;
  fbq.loaded = true;
  fbq.version = "2.0";
  fbq.queue = [];

  const script = document.createElement("script");
  script.async = true;
  script.src = "https://connect.facebook.net/en_US/fbevents.js";
  const first = document.getElementsByTagName("script")[0];
  first?.parentNode?.insertBefore(script, first);
}

let initialized = false;

export function initMetaPixel(): void {
  if (!META_PIXEL_ID || initialized) return;
  if (getFbq()) {
    initialized = true;
    return;
  }
  ensureMetaPixelScript();
  getFbq()?.("init", META_PIXEL_ID);
  initialized = true;
}

export type MetaEventParams = Record<string, string | number | boolean | undefined>;

export function trackMetaEvent(
  event: string,
  params?: MetaEventParams,
  options?: { eventID?: string },
): void {
  if (!META_PIXEL_ID) return;
  initMetaPixel();
  const fbq = getFbq();
  if (!fbq) return;
  if (params && options?.eventID) {
    fbq("track", event, params, { eventID: options.eventID });
  } else if (params) {
    fbq("track", event, params);
  } else if (options?.eventID) {
    fbq("track", event, {}, { eventID: options.eventID });
  } else {
    fbq("track", event);
  }
}

export function trackPageView(): void {
  trackMetaEvent("PageView");
}

const VIEW_CONTENT_PATHS: Record<string, MetaEventParams> = {
  "/pricing": { content_name: "Pricing", content_category: "product" },
  "/program": { content_name: "Program", content_category: "product" },
  "/app": { content_name: "App", content_category: "product" },
  "/coaching-apply": { content_name: "Coaching Apply", content_category: "lead" },
};

export function trackViewContentForPath(pathname: string): void {
  const params = VIEW_CONTENT_PATHS[pathname];
  if (params) trackMetaEvent("ViewContent", params);
}

export function trackLead(contentName: string, extra?: MetaEventParams): void {
  trackMetaEvent("Lead", { content_name: contentName, content_category: "lead", ...extra });
}

export function trackInitiateCheckout(value: number, currency: string): void {
  trackMetaEvent("InitiateCheckout", {
    content_name: "Busy Strong 90",
    content_type: "product",
    value,
    currency,
  });
}

export function trackPurchase(value: number, currency: string, sessionId: string): void {
  trackMetaEvent(
    "Purchase",
    {
      content_name: "Busy Strong 90",
      content_type: "product",
      value,
      currency,
    },
    { eventID: sessionId },
  );
}
