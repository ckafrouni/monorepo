import { Database } from "@/database.types";
import {
  createClient as _createClient,
  // SupabaseClient,
} from "@supabase/supabase-js";
import { env } from "@/lib/env";

export const createClient = () => {
  return _createClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
};
