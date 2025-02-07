import { LumaGuest } from "../Luma";
import { Tables } from "@/database.types";

import { createClient } from "./SupabaseBaseService";

const supabase = createClient();

const QUERIES = {
  getLumaLinkedinUsersByLumaUserIds: async (lumaUserIds: string[]) => {
    const { data, error } = await supabase
      .from("luma_linkedin_users")
      .select("*")
      .in("luma_linkedin_user_id", lumaUserIds);
    if (error) {
      throw new Error(error.message);
    }
    return data ?? [];
  },
};

const MUTATIONS = {
  updateAiSummary: async (userId: string, summary: string) => {
    const { error } = await supabase
      .from("luma_linkedin_users")
      .update({ ai_summary: summary })
      .eq("luma_linkedin_user_id", userId);
    if (error) {
      throw new Error(error.message);
    }
  },
  upsertLumaUsers: async (lumaUsers: LumaGuest[]) => {
    const lumaLinkedinUsers = lumaUsers.map(
      (user) =>
        ({
          luma_linkedin_user_id: user.api_id,
          linkedin_profile_url: user.linkedin_handle?.startsWith(
            "https://www.linkedin.com/"
          )
            ? user.linkedin_handle
            : user.linkedin_handle
              ? `https://www.linkedin.com/${user.linkedin_handle}`
              : null,
        }) as Tables<"luma_linkedin_users">
    );

    const { error } = await supabase
      .from("luma_linkedin_users")
      .upsert(lumaLinkedinUsers);
    if (error) {
      console.error("Error upserting luma_linkedin_users:", error);
      throw error;
    }
  },
  addLumaLinkedinUser: async (luma_linkedin_user_id: string) => {
    const { error } = await supabase.from("luma_linkedin_users").upsert(
      {
        luma_linkedin_user_id,
      },
      { onConflict: "luma_linkedin_user_id" }
    );
    if (error) {
      throw new Error(error.message);
    }
  },
  upsertLumaLinkedinUsers: async (
    lumaLinkedinUsers: Tables<"luma_linkedin_users">[]
  ) => {
    const { error } = await supabase
      .from("luma_linkedin_users")
      .upsert(lumaLinkedinUsers);
    if (error) {
      throw new Error(error.message);
    }
  },
};

export {
  QUERIES as DB_LUMA_LINKEDIN_QUERIES,
  MUTATIONS as DB_LUMA_LINKEDIN_MUTATIONS,
};
