import { createClient } from "./SupabaseBaseService";

const supabase = createClient();

const MUTATIONS = {
  loginLumaUser: async (email: string, luma_linkedin_user_id: string) => {
    const { error } = await supabase.from("users").upsert(
      {
        luma_linkedin_user_id,
        email,
        last_login_at: new Date().toISOString(),
      },
      { onConflict: "luma_linkedin_user_id" }
    );
    if (error) {
      throw new Error(error.message);
    }
  },
};

export { MUTATIONS as DB_USERS_MUTATIONS };
