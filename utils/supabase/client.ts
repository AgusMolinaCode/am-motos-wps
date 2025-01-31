import { createBrowserClient } from "@supabase/ssr";

export const getSession = async () => {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  return supabase.auth.getSession();
};
