import { supabase } from "@/lib/supabase";

const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY as string | undefined;

export type PushSupport = "supported" | "unsupported" | "ios-needs-install";

function isIos(): boolean {
  return /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
}

function isStandalone(): boolean {
  return window.matchMedia("(display-mode: standalone)").matches || (navigator as Navigator & { standalone?: boolean }).standalone === true;
}

/** iOS only allows web push for the app added to the Home Screen (iOS 16.4+). */
export function getPushSupport(): PushSupport {
  if (typeof window === "undefined") return "unsupported";
  const hasApis = "serviceWorker" in navigator && "PushManager" in window && "Notification" in window;
  if (isIos() && !isStandalone()) return "ios-needs-install";
  return hasApis && VAPID_PUBLIC_KEY ? "supported" : "unsupported";
}

function urlBase64ToUint8Array(base64: string): Uint8Array {
  const padding = "=".repeat((4 - (base64.length % 4)) % 4);
  const raw = atob((base64 + padding).replace(/-/g, "+").replace(/_/g, "/"));
  return Uint8Array.from(raw, (c) => c.charCodeAt(0));
}

export async function getCurrentPushSubscription(): Promise<PushSubscription | null> {
  if (getPushSupport() !== "supported") return null;
  const registration = await navigator.serviceWorker.ready;
  return registration.pushManager.getSubscription();
}

/** Asks for permission, subscribes this device and stores it for the daily motivation sender. */
export async function enableDailyMotivation(userId: string, locale: string): Promise<void> {
  if (getPushSupport() !== "supported" || !VAPID_PUBLIC_KEY) throw new Error("Push notifications are not supported on this device.");
  const permission = await Notification.requestPermission();
  if (permission !== "granted") throw new Error("Notifications are blocked. Allow them in your browser or phone settings.");

  const registration = await navigator.serviceWorker.ready;
  const subscription =
    (await registration.pushManager.getSubscription()) ??
    (await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
    }));
  const json = subscription.toJSON();

  const { error } = await supabase.from("push_subscriptions").upsert(
    {
      user_id: userId,
      endpoint: subscription.endpoint,
      p256dh: json.keys?.p256dh ?? "",
      auth: json.keys?.auth ?? "",
      locale: locale.split("-")[0],
      user_agent: navigator.userAgent.slice(0, 300),
    },
    { onConflict: "endpoint" },
  );
  if (error) throw error;

  const prefs = await supabase.from("notification_preferences").upsert({ user_id: userId, push_enabled: true }, { onConflict: "user_id" });
  if (prefs.error) throw prefs.error;
}

/** Unsubscribes this device and removes it from the sender. */
export async function disableDailyMotivation(userId: string): Promise<void> {
  const subscription = await getCurrentPushSubscription();
  if (subscription) {
    await supabase.from("push_subscriptions").delete().eq("endpoint", subscription.endpoint);
    await subscription.unsubscribe();
  }
  const { count } = await supabase.from("push_subscriptions").select("id", { count: "exact", head: true }).eq("user_id", userId);
  if (!count) {
    await supabase.from("notification_preferences").upsert({ user_id: userId, push_enabled: false }, { onConflict: "user_id" });
  }
}
