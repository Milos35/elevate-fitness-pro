import { getSupabaseAdmin } from "./supabaseAdmin";

export async function grantProgramAccess(userId: string, source: "stripe" | "stripe_webhook") {
  const admin = getSupabaseAdmin();
  const { error } = await admin.from("member_access").upsert({
    user_id: userId,
    has_access: true,
    access_type: "lifetime",
    source,
    activated_at: new Date().toISOString(),
  });
  if (error) throw error;
}
