export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      corequisites: {
        Row: {
          corequisite_course_id: string
          course_id: string
          id: string
        }
        Insert: {
          corequisite_course_id: string
          course_id: string
          id?: string
        }
        Update: {
          corequisite_course_id?: string
          course_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "corequisites_corequisite_course_id_fkey"
            columns: ["corequisite_course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "corequisites_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      course_quarters: {
        Row: {
          course_id: string
          id: string
          quarter: Database["public"]["Enums"]["quarter_type"]
        }
        Insert: {
          course_id: string
          id?: string
          quarter: Database["public"]["Enums"]["quarter_type"]
        }
        Update: {
          course_id?: string
          id?: string
          quarter?: Database["public"]["Enums"]["quarter_type"]
        }
        Relationships: [
          {
            foreignKeyName: "course_quarters_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          code: string
          created_at: string
          department: string
          description: string | null
          id: string
          is_upper_division: boolean
          title: string
          units: number
          updated_at: string
        }
        Insert: {
          code: string
          created_at?: string
          department: string
          description?: string | null
          id?: string
          is_upper_division?: boolean
          title: string
          units: number
          updated_at?: string
        }
        Update: {
          code?: string
          created_at?: string
          department?: string
          description?: string | null
          id?: string
          is_upper_division?: boolean
          title?: string
          units?: number
          updated_at?: string
        }
        Relationships: []
      }
      cross_listed_courses: {
        Row: {
          course_id: string
          cross_listed_course_id: string
          id: string
        }
        Insert: {
          course_id: string
          cross_listed_course_id: string
          id?: string
        }
        Update: {
          course_id?: string
          cross_listed_course_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cross_listed_courses_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cross_listed_courses_cross_listed_course_id_fkey"
            columns: ["cross_listed_course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      emphasis_areas: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      emphasis_requirements: {
        Row: {
          emphasis_id: string
          id: string
          requirement_id: string
        }
        Insert: {
          emphasis_id: string
          id?: string
          requirement_id: string
        }
        Update: {
          emphasis_id?: string
          id?: string
          requirement_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "emphasis_requirements_emphasis_id_fkey"
            columns: ["emphasis_id"]
            isOneToOne: false
            referencedRelation: "emphasis_areas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "emphasis_requirements_requirement_id_fkey"
            columns: ["requirement_id"]
            isOneToOne: false
            referencedRelation: "requirements"
            referencedColumns: ["id"]
          },
        ]
      }
      plans: {
        Row: {
          created_at: string
          emphasis_id: string | null
          id: string
          metadata: Json | null
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          emphasis_id?: string | null
          id?: string
          metadata?: Json | null
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          emphasis_id?: string | null
          id?: string
          metadata?: Json | null
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "plans_emphasis_id_fkey"
            columns: ["emphasis_id"]
            isOneToOne: false
            referencedRelation: "emphasis_areas"
            referencedColumns: ["id"]
          },
        ]
      }
      prerequisite_courses: {
        Row: {
          id: string
          prerequisite_course_id: string
          prerequisite_id: string
        }
        Insert: {
          id?: string
          prerequisite_course_id: string
          prerequisite_id: string
        }
        Update: {
          id?: string
          prerequisite_course_id?: string
          prerequisite_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "prerequisite_courses_prerequisite_course_id_fkey"
            columns: ["prerequisite_course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prerequisite_courses_prerequisite_id_fkey"
            columns: ["prerequisite_id"]
            isOneToOne: false
            referencedRelation: "prerequisites"
            referencedColumns: ["id"]
          },
        ]
      }
      prerequisites: {
        Row: {
          course_id: string
          created_at: string
          id: string
          min_grade: string | null
          prerequisite_type: Database["public"]["Enums"]["prerequisite_type"]
        }
        Insert: {
          course_id: string
          created_at?: string
          id?: string
          min_grade?: string | null
          prerequisite_type: Database["public"]["Enums"]["prerequisite_type"]
        }
        Update: {
          course_id?: string
          created_at?: string
          id?: string
          min_grade?: string | null
          prerequisite_type?: Database["public"]["Enums"]["prerequisite_type"]
        }
        Relationships: [
          {
            foreignKeyName: "prerequisites_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      requirement_choose_from: {
        Row: {
          count: number
          created_at: string
          id: string
          requirement_id: string
        }
        Insert: {
          count?: number
          created_at?: string
          id?: string
          requirement_id: string
        }
        Update: {
          count?: number
          created_at?: string
          id?: string
          requirement_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "requirement_choose_from_requirement_id_fkey"
            columns: ["requirement_id"]
            isOneToOne: false
            referencedRelation: "requirements"
            referencedColumns: ["id"]
          },
        ]
      }
      requirement_choose_options: {
        Row: {
          course_id: string
          id: string
          requirement_choose_from_id: string
        }
        Insert: {
          course_id: string
          id?: string
          requirement_choose_from_id: string
        }
        Update: {
          course_id?: string
          id?: string
          requirement_choose_from_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "requirement_choose_options_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "requirement_choose_options_requirement_choose_from_id_fkey"
            columns: ["requirement_choose_from_id"]
            isOneToOne: false
            referencedRelation: "requirement_choose_from"
            referencedColumns: ["id"]
          },
        ]
      }
      requirement_courses: {
        Row: {
          course_id: string
          id: string
          requirement_id: string
        }
        Insert: {
          course_id: string
          id?: string
          requirement_id: string
        }
        Update: {
          course_id?: string
          id?: string
          requirement_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "requirement_courses_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "requirement_courses_requirement_id_fkey"
            columns: ["requirement_id"]
            isOneToOne: false
            referencedRelation: "requirements"
            referencedColumns: ["id"]
          },
        ]
      }
      requirements: {
        Row: {
          created_at: string
          id: string
          min_units: number | null
          name: string
          notes: string | null
          type: Database["public"]["Enums"]["requirement_type"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          min_units?: number | null
          name: string
          notes?: string | null
          type: Database["public"]["Enums"]["requirement_type"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          min_units?: number | null
          name?: string
          notes?: string | null
          type?: Database["public"]["Enums"]["requirement_type"]
          updated_at?: string
        }
        Relationships: []
      }
      substitutions: {
        Row: {
          created_at: string | null
          id: string
          is_upper_div_override: boolean | null
          placeholder_code: string
          plan_id: string
          requirement_group_id: string
          substitute_course_code: string
          units_override: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_upper_div_override?: boolean | null
          placeholder_code: string
          plan_id: string
          requirement_group_id: string
          substitute_course_code: string
          units_override?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_upper_div_override?: boolean | null
          placeholder_code?: string
          plan_id?: string
          requirement_group_id?: string
          substitute_course_code?: string
          units_override?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "substitutions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "plans"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      course_status: "planned" | "completed" | "not_started"
      prerequisite_type: "required" | "or" | "recommended"
      quarter_type: "Fall" | "Winter" | "Spring" | "Summer"
      requirement_type: "major" | "emphasis" | "core" | "university"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      course_status: ["planned", "completed", "not_started"],
      prerequisite_type: ["required", "or", "recommended"],
      quarter_type: ["Fall", "Winter", "Spring", "Summer"],
      requirement_type: ["major", "emphasis", "core", "university"],
    },
  },
} as const

