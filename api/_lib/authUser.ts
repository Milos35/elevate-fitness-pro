import { createClient } from "@supabase/supabase-js";

export async function getUserFromBearer(authHeader: string | undefined) {
  const token = authHeader?.replace(/^Bearer\s+/i, "").trim();
  if (!token) return { user: null as null, error: "Missing authorization" };

  const url = process.env.SUPABASE_URL?.trim();
  const anon = process.env.SUPABASE_ANON_KEY?.trim();
  if (!url || !anon) {
    return { user: null as null, error: "Server missing SUPABASE_URL or SUPABASE_ANON_KEY" };
  }

  const supabase = createClient(url, anon);
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token);

  if (error || !user) {
    return { user: null as null, error: error?.message ?? "Invalid session" };
  }
  return { user, error: null as null };
}
