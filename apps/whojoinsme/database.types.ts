export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      embeddings: {
        Row: {
          content: string;
          embedding: string | null;
          id: number;
        };
        Insert: {
          content: string;
          embedding?: string | null;
          id?: never;
        };
        Update: {
          content?: string;
          embedding?: string | null;
          id?: never;
        };
        Relationships: [];
      };
      guests: {
        Row: {
          created_at: string;
          has_search_result: boolean;
          id: string;
          linkedin_data: Json | null;
          linkedin_is_private: boolean | null;
          luma_guest_id: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          has_search_result?: boolean;
          id?: string;
          linkedin_data?: Json | null;
          linkedin_is_private?: boolean | null;
          luma_guest_id: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          has_search_result?: boolean;
          id?: string;
          linkedin_data?: Json | null;
          linkedin_is_private?: boolean | null;
          luma_guest_id?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      luma_linkedin_users: {
        Row: {
          ai_summary: Json | null;
          created_at: string;
          linkedin_json_data: Json | null;
          linkedin_profile_url: string | null;
          luma_linkedin_user_id: string;
          scraped: boolean;
          scraped_failed: boolean | null;
          updated_at: string;
        };
        Insert: {
          ai_summary?: Json | null;
          created_at?: string;
          linkedin_json_data?: Json | null;
          linkedin_profile_url?: string | null;
          luma_linkedin_user_id: string;
          scraped?: boolean;
          scraped_failed?: boolean | null;
          updated_at?: string;
        };
        Update: {
          ai_summary?: Json | null;
          created_at?: string;
          linkedin_json_data?: Json | null;
          linkedin_profile_url?: string | null;
          luma_linkedin_user_id?: string;
          scraped?: boolean;
          scraped_failed?: boolean | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      users: {
        Row: {
          email: string | null;
          last_login_at: string;
          luma_linkedin_user_id: string | null;
          user_id: string;
        };
        Insert: {
          email?: string | null;
          last_login_at: string;
          luma_linkedin_user_id?: string | null;
          user_id?: string;
        };
        Update: {
          email?: string | null;
          last_login_at?: string;
          luma_linkedin_user_id?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "users_luma_linkedin_user_id_fkey";
            columns: ["luma_linkedin_user_id"];
            isOneToOne: true;
            referencedRelation: "luma_linkedin_users";
            referencedColumns: ["luma_linkedin_user_id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;
