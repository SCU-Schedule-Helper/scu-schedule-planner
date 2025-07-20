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
      core_curriculum_pathways: {
        Row: {
          associated_courses: string | null
          created_at: string
          description: string | null
          id: string
          name: string
          src: string | null
          updated_at: string
        }
        Insert: {
          associated_courses?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name: string
          src?: string | null
          updated_at?: string
        }
        Update: {
          associated_courses?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          src?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      core_curriculum_requirements: {
        Row: {
          applies_to: string | null
          created_at: string
          description: string | null
          fulfilled_by: string | null
          id: string
          name: string
          src: string | null
          updated_at: string
        }
        Insert: {
          applies_to?: string | null
          created_at?: string
          description?: string | null
          fulfilled_by?: string | null
          id?: string
          name: string
          src?: string | null
          updated_at?: string
        }
        Update: {
          applies_to?: string | null
          created_at?: string
          description?: string | null
          fulfilled_by?: string | null
          id?: string
          name?: string
          src?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      courses: {
        Row: {
          code: string
          corequisites: Json | null
          created_at: string
          description: string | null
          id: string
          prerequisites: Json | null
          professor: string | null
          quarters_offered: Json | null
          src: string | null
          title: string
          units: string | null
          updated_at: string
        }
        Insert: {
          code: string
          corequisites?: Json | null
          created_at?: string
          description?: string | null
          id?: string
          prerequisites?: Json | null
          professor?: string | null
          quarters_offered?: Json | null
          src?: string | null
          title: string
          units?: string | null
          updated_at?: string
        }
        Update: {
          code?: string
          corequisites?: Json | null
          created_at?: string
          description?: string | null
          id?: string
          prerequisites?: Json | null
          professor?: string | null
          quarters_offered?: Json | null
          src?: string | null
          title?: string
          units?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      departments_and_programs: {
        Row: {
          created_at: string
          description: string | null
          emphases: Json | null
          id: string
          majors_offered: Json | null
          minors_offered: Json | null
          name: string
          school_name: string | null
          src: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          emphases?: Json | null
          id?: string
          majors_offered?: Json | null
          minors_offered?: Json | null
          name: string
          school_name?: string | null
          src?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          emphases?: Json | null
          id?: string
          majors_offered?: Json | null
          minors_offered?: Json | null
          name?: string
          school_name?: string | null
          src?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      emphasis_areas_enhanced: {
        Row: {
          applies_to: string | null
          course_requirements_expression: string | null
          created_at: string
          department_code: string | null
          description: string | null
          id: string
          name: string
          name_of_which_it_applies_to: string | null
          other_notes: string | null
          other_requirements: Json | null
          src: string | null
          unit_requirements: Json | null
          updated_at: string
        }
        Insert: {
          applies_to?: string | null
          course_requirements_expression?: string | null
          created_at?: string
          department_code?: string | null
          description?: string | null
          id?: string
          name: string
          name_of_which_it_applies_to?: string | null
          other_notes?: string | null
          other_requirements?: Json | null
          src?: string | null
          unit_requirements?: Json | null
          updated_at?: string
        }
        Update: {
          applies_to?: string | null
          course_requirements_expression?: string | null
          created_at?: string
          department_code?: string | null
          description?: string | null
          id?: string
          name?: string
          name_of_which_it_applies_to?: string | null
          other_notes?: string | null
          other_requirements?: Json | null
          src?: string | null
          unit_requirements?: Json | null
          updated_at?: string
        }
        Relationships: []
      }
      majors: {
        Row: {
          course_requirements_expression: string | null
          created_at: string
          department_code: string | null
          description: string | null
          id: string
          name: string
          other_notes: string | null
          other_requirements: Json | null
          requires_emphasis: number | null
          src: string | null
          unit_requirements: Json | null
          updated_at: string
        }
        Insert: {
          course_requirements_expression?: string | null
          created_at?: string
          department_code?: string | null
          description?: string | null
          id?: string
          name: string
          other_notes?: string | null
          other_requirements?: Json | null
          requires_emphasis?: number | null
          src?: string | null
          unit_requirements?: Json | null
          updated_at?: string
        }
        Update: {
          course_requirements_expression?: string | null
          created_at?: string
          department_code?: string | null
          description?: string | null
          id?: string
          name?: string
          other_notes?: string | null
          other_requirements?: Json | null
          requires_emphasis?: number | null
          src?: string | null
          unit_requirements?: Json | null
          updated_at?: string
        }
        Relationships: []
      }
      planned_courses: {
        Row: {
          course_code: string
          created_at: string
          id: string
          plan_id: string
          quarter: string
          status: Database["public"]["Enums"]["course_status"] | null
          updated_at: string
          year: number
        }
        Insert: {
          course_code: string
          created_at?: string
          id?: string
          plan_id: string
          quarter: string
          status?: Database["public"]["Enums"]["course_status"] | null
          updated_at?: string
          year: number
        }
        Update: {
          course_code?: string
          created_at?: string
          id?: string
          plan_id?: string
          quarter?: string
          status?: Database["public"]["Enums"]["course_status"] | null
          updated_at?: string
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "planned_courses_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "plans"
            referencedColumns: ["id"]
          },
        ]
      }
      plans: {
        Row: {
          created_at: string
          emphasis: string | null
          emphasis_id: string | null
          graduation_year: number | null
          id: string
          major: string | null
          metadata: Json | null
          name: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          emphasis?: string | null
          emphasis_id?: string | null
          graduation_year?: number | null
          id?: string
          major?: string | null
          metadata?: Json | null
          name: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          emphasis?: string | null
          emphasis_id?: string | null
          graduation_year?: number | null
          id?: string
          major?: string | null
          metadata?: Json | null
          name?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      schools: {
        Row: {
          course_requirements_expression: string | null
          created_at: string
          description: string | null
          id: string
          name: string
          other_requirements: Json | null
          src: string | null
          unit_requirements: Json | null
          updated_at: string
        }
        Insert: {
          course_requirements_expression?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name: string
          other_requirements?: Json | null
          src?: string | null
          unit_requirements?: Json | null
          updated_at?: string
        }
        Update: {
          course_requirements_expression?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          other_requirements?: Json | null
          src?: string | null
          unit_requirements?: Json | null
          updated_at?: string
        }
        Relationships: []
      }
      substitutions: {
        Row: {
          approved: boolean | null
          created_at: string
          id: string
          original_course_code: string
          plan_id: string
          reason: string | null
          substitute_course_code: string
          updated_at: string
        }
        Insert: {
          approved?: boolean | null
          created_at?: string
          id?: string
          original_course_code: string
          plan_id: string
          reason?: string | null
          substitute_course_code: string
          updated_at?: string
        }
        Update: {
          approved?: boolean | null
          created_at?: string
          id?: string
          original_course_code?: string
          plan_id?: string
          reason?: string | null
          substitute_course_code?: string
          updated_at?: string
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
      course_status: "planned" | "completed" | "in-progress" | "not_started"
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
      course_status: ["planned", "completed", "in-progress", "not_started"],
    },
  },
} as const

