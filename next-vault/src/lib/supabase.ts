import { createClient } from "@supabase/supabase-js";

// We use the standard JS client for simple client-side and server-side data fetching.
// In a highly secure app with Auth, we would use @supabase/ssr, but this vault
// relies entirely on public/anon access for the single collection (as it did before).

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);
