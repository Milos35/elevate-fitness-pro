export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string | null;
          full_name: string | null;
          avatar_url: string | null;
          role: "member" | "admin";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          role?: "member" | "admin";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          role?: "member" | "admin";
          created_at?: string;
          updated_at?: string;
        };
      };
      member_access: {
        Row: {
          user_id: string;
          has_access: boolean;
          access_type: "lifetime" | "trial" | "expired";
          source: string;
          activated_at: string | null;
          expires_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          has_access?: boolean;
          access_type?: "lifetime" | "trial" | "expired";
          source?: string;
          activated_at?: string | null;
          expires_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          user_id?: string;
          has_access?: boolean;
          access_type?: "lifetime" | "trial" | "expired";
          source?: string;
          activated_at?: string | null;
          expires_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      progress_checkins: {
        Row: {
          id: string;
          user_id: string;
          week_number: number;
          weight_kg: number | null;
          waist_cm: number | null;
          chest_cm: number | null;
          energy_level: number | null;
          compliance_score: number | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          week_number: number;
          weight_kg?: number | null;
          waist_cm?: number | null;
          chest_cm?: number | null;
          energy_level?: number | null;
          compliance_score?: number | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          week_number?: number;
          weight_kg?: number | null;
          waist_cm?: number | null;
          chest_cm?: number | null;
          energy_level?: number | null;
          compliance_score?: number | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      workout_session_logs: {
        Row: {
          id: string;
          user_id: string;
          week_number: number;
          slot: "mon" | "wed" | "fri" | "sat_bonus";
          variant: "gym" | "home" | "emergency";
          completed: boolean;
          main_lifts_note: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          week_number: number;
          slot: "mon" | "wed" | "fri" | "sat_bonus";
          variant?: "gym" | "home" | "emergency";
          completed?: boolean;
          main_lifts_note?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          week_number?: number;
          slot?: "mon" | "wed" | "fri" | "sat_bonus";
          variant?: "gym" | "home" | "emergency";
          completed?: boolean;
          main_lifts_note?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      nutrition_adherence_logs: {
        Row: {
          id: string;
          user_id: string;
          log_date: string;
          meals_on_plan: number | null;
          protein_focus: boolean | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          log_date: string;
          meals_on_plan?: number | null;
          protein_focus?: boolean | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          log_date?: string;
          meals_on_plan?: number | null;
          protein_focus?: boolean | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      notification_preferences: {
        Row: {
          user_id: string;
          email_reminders: boolean;
          push_enabled: boolean;
          preferred_reminder_time: string | null;
          timezone: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          email_reminders?: boolean;
          push_enabled?: boolean;
          preferred_reminder_time?: string | null;
          timezone?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          user_id?: string;
          email_reminders?: boolean;
          push_enabled?: boolean;
          preferred_reminder_time?: string | null;
          timezone?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      push_subscriptions: {
        Row: {
          id: string;
          user_id: string;
          endpoint: string;
          p256dh: string;
          auth: string;
          locale: string;
          user_agent: string | null;
          created_at: string;
          last_sent_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          endpoint: string;
          p256dh: string;
          auth: string;
          locale?: string;
          user_agent?: string | null;
          created_at?: string;
          last_sent_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          endpoint?: string;
          p256dh?: string;
          auth?: string;
          locale?: string;
          user_agent?: string | null;
          created_at?: string;
          last_sent_at?: string | null;
        };
      };
      reminder_jobs: {
        Row: {
          id: string;
          user_id: string;
          kind: string;
          scheduled_for: string;
          payload: Json;
          status: "pending" | "sent" | "cancelled" | "failed";
          sent_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          kind: string;
          scheduled_for: string;
          payload?: Json;
          status?: "pending" | "sent" | "cancelled" | "failed";
          sent_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          kind?: string;
          scheduled_for?: string;
          payload?: Json;
          status?: "pending" | "sent" | "cancelled" | "failed";
          sent_at?: string | null;
          created_at?: string;
        };
      };
      content_resources: {
        Row: {
          id: string;
          slug: string;
          title: string;
          body: string;
          audience: "public" | "member";
          published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          body?: string;
          audience?: "public" | "member";
          published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          title?: string;
          body?: string;
          audience?: "public" | "member";
          published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      coach_notes: {
        Row: {
          id: string;
          member_id: string;
          coach_id: string;
          body: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          member_id: string;
          coach_id: string;
          body: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          member_id?: string;
          coach_id?: string;
          body?: string;
          created_at?: string;
        };
      };
      handbook_leads: {
        Row: {
          id: string;
          name: string;
          email: string;
          handbook_ids: string[];
          source: string;
          emails_sent: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          handbook_ids: string[];
          source?: string;
          emails_sent?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          handbook_ids?: string[];
          source?: string;
          emails_sent?: boolean;
          created_at?: string;
        };
      };
      homepage_content: {
        Row: {
          locale: "en" | "ar" | "sr";
          draft: Json;
          published: Json;
          review_status: "draft" | "pending_review" | "published";
          review_requested_at: string | null;
          published_at: string | null;
          updated_at: string;
          updated_by: string | null;
        };
        Insert: {
          locale: "en" | "ar" | "sr";
          draft?: Json;
          published?: Json;
          review_status?: "draft" | "pending_review" | "published";
          review_requested_at?: string | null;
          published_at?: string | null;
          updated_at?: string;
          updated_by?: string | null;
        };
        Update: {
          locale?: "en" | "ar" | "sr";
          draft?: Json;
          published?: Json;
          review_status?: "draft" | "pending_review" | "published";
          review_requested_at?: string | null;
          published_at?: string | null;
          updated_at?: string;
          updated_by?: string | null;
        };
      };
      site_content: {
        Row: {
          page_key:
            | "pricing"
            | "faq"
            | "handbooks"
            | "program"
            | "nutrition"
            | "coaching"
            | "member_dashboard"
            | "member_nutrition"
            | "member_roadmap"
            | "testimonials"
            | "member_workouts"
            | "blog";
          locale: "en" | "ar" | "sr";
          draft: Json;
          published: Json;
          review_status: "draft" | "pending_review" | "published";
          review_requested_at: string | null;
          published_at: string | null;
          updated_at: string;
          updated_by: string | null;
        };
        Insert: {
          page_key:
            | "pricing"
            | "faq"
            | "handbooks"
            | "program"
            | "nutrition"
            | "coaching"
            | "member_dashboard"
            | "member_nutrition"
            | "member_roadmap"
            | "testimonials"
            | "member_workouts"
            | "blog";
          locale: "en" | "ar" | "sr";
          draft?: Json;
          published?: Json;
          review_status?: "draft" | "pending_review" | "published";
          review_requested_at?: string | null;
          published_at?: string | null;
          updated_at?: string;
          updated_by?: string | null;
        };
        Update: {
          page_key?:
            | "pricing"
            | "faq"
            | "handbooks"
            | "program"
            | "nutrition"
            | "coaching"
            | "member_dashboard"
            | "member_nutrition"
            | "member_roadmap"
            | "testimonials"
            | "member_workouts"
            | "blog";
          locale?: "en" | "ar" | "sr";
          draft?: Json;
          published?: Json;
          review_status?: "draft" | "pending_review" | "published";
          review_requested_at?: string | null;
          published_at?: string | null;
          updated_at?: string;
          updated_by?: string | null;
        };
      };
    };
    Views: Record<string, never>;
    Functions: {
      is_admin: { Args: Record<string, never>; Returns: boolean };
      get_published_homepage: { Args: { p_locale: string }; Returns: Json };
      get_published_site_content: { Args: { p_page_key: string; p_locale: string }; Returns: Json };
    };
    Enums: Record<string, never>;
  };
};
