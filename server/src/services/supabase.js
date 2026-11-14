import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY,
);

// Fresh client per sign-up/sign-in so a user's session is never stored on the
// shared admin client above (which would downgrade its privileges).
export function createAuthClient() {
  return createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
