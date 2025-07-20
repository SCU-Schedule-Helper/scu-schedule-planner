-- 20250119_create_initial_schema.sql
-- Complete database schema for SCU Schedule Planner
-- This migration creates the entire database structure with enhanced validation and text-based units

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create new enums
CREATE TYPE course_status AS ENUM ('planned', 'completed', 'in-progress', 'not_started');

-- =======================
-- SCHOOLS
-- =======================

CREATE TABLE IF NOT EXISTS public.schools (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    description text,
    course_requirements_expression text,
    unit_requirements jsonb DEFAULT '[]'::jsonb,
    other_requirements jsonb DEFAULT '[]'::jsonb,
    src text,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

-- =======================
-- DEPARTMENTS & PROGRAMS
-- =======================

CREATE TABLE IF NOT EXISTS public.departments_and_programs (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    description text,
    school_name text,
    majors_offered jsonb DEFAULT '[]'::jsonb,
    minors_offered jsonb DEFAULT '[]'::jsonb,
    emphases jsonb DEFAULT '[]'::jsonb,
    src text,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

-- =======================
-- MAJORS
-- =======================

CREATE TABLE IF NOT EXISTS public.majors (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    description text,
    department_code text,
    requires_emphasis int DEFAULT 0,
    course_requirements_expression text,
    unit_requirements jsonb DEFAULT '[]'::jsonb,
    other_requirements jsonb DEFAULT '[]'::jsonb,
    other_notes text,
    src text,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

-- =======================
-- EMPHASIS AREAS
-- =======================

CREATE TABLE IF NOT EXISTS public.emphasis_areas_enhanced (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    description text,
    applies_to text,
    name_of_which_it_applies_to text,
    department_code text,
    course_requirements_expression text,
    unit_requirements jsonb DEFAULT '[]'::jsonb,
    other_requirements jsonb DEFAULT '[]'::jsonb,
    other_notes text,
    src text,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

-- =======================
-- CORE CURRICULUM
-- =======================

CREATE TABLE IF NOT EXISTS public.core_curriculum_requirements (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    description text,
    applies_to text,
    fulfilled_by text,
    src text,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.core_curriculum_pathways (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    description text,
    associated_courses text,
    src text,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

-- =======================
-- COURSES (Enhanced with flexible units)
-- =======================

CREATE TABLE IF NOT EXISTS public.courses (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    code text NOT NULL UNIQUE CHECK (code ~ '^[A-Z]{2,5}\s*\d+[A-Z]{0,2}$'),
    title text NOT NULL CHECK (length(title) > 0),
    description text,
    units text CHECK (units ~ '^(\d+(\.\d+)?|\d+-\d+|\d+(\.\d+)?-\d+(\.\d+)?)$'),
    prerequisites jsonb DEFAULT '[]'::jsonb,
    corequisites jsonb DEFAULT '[]'::jsonb,
    quarters_offered jsonb DEFAULT '[]'::jsonb,
    professor text,
    src text,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

-- =======================
-- PLANS (Keep existing for app functionality)
-- =======================

CREATE TABLE IF NOT EXISTS public.plans (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL CHECK (length(name) > 0),
    user_id uuid,
    major text,
    emphasis text,
    emphasis_id uuid,
    graduation_year integer CHECK (graduation_year >= 2020 AND graduation_year <= 2050),
    metadata jsonb DEFAULT '{}',
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

-- Planned courses for each plan
CREATE TABLE IF NOT EXISTS public.planned_courses (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    plan_id uuid NOT NULL REFERENCES public.plans(id) ON DELETE CASCADE,
    course_code text NOT NULL CHECK (course_code ~ '^[A-Z]{2,5}\s*\d+[A-Z]{0,2}$'),
    quarter text NOT NULL CHECK (quarter IN ('Fall', 'Winter', 'Spring', 'Summer') OR quarter ~ '^\d{4}-(Fall|Winter|Spring|Summer)$'),
    year integer NOT NULL CHECK (year >= 2020 AND year <= 2050),
    status course_status DEFAULT 'planned',
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE(plan_id, course_code)
);

-- Course substitutions
CREATE TABLE IF NOT EXISTS public.substitutions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    plan_id uuid NOT NULL REFERENCES public.plans(id) ON DELETE CASCADE,
    original_course_code text NOT NULL CHECK (original_course_code ~ '^[A-Z]{2,5}\s*\d+[A-Z]{0,2}$'),
    substitute_course_code text NOT NULL CHECK (substitute_course_code ~ '^[A-Z]{2,5}\s*\d+[A-Z]{0,2}$'),
    reason text,
    approved boolean DEFAULT false,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

-- =======================
-- INDEXES FOR PERFORMANCE
-- =======================

CREATE INDEX IF NOT EXISTS idx_courses_code ON public.courses(code);
CREATE INDEX IF NOT EXISTS idx_courses_title ON public.courses(title);
CREATE INDEX IF NOT EXISTS idx_courses_units ON public.courses(units);
CREATE INDEX IF NOT EXISTS idx_courses_prerequisites ON public.courses USING GIN(prerequisites);
CREATE INDEX IF NOT EXISTS idx_courses_quarters_offered ON public.courses USING GIN(quarters_offered);
CREATE INDEX IF NOT EXISTS idx_majors_name ON public.majors(name);
CREATE INDEX IF NOT EXISTS idx_majors_dept ON public.majors(department_code);
CREATE INDEX IF NOT EXISTS idx_emphasis_name ON public.emphasis_areas_enhanced(name);
CREATE INDEX IF NOT EXISTS idx_emphasis_dept ON public.emphasis_areas_enhanced(department_code);
CREATE INDEX IF NOT EXISTS idx_planned_courses_plan ON public.planned_courses(plan_id);
CREATE INDEX IF NOT EXISTS idx_planned_courses_code ON public.planned_courses(course_code);
CREATE INDEX IF NOT EXISTS idx_planned_courses_status ON public.planned_courses(status);

-- =======================
-- UPDATE TRIGGERS
-- =======================

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to all tables
CREATE TRIGGER update_schools_updated_at BEFORE UPDATE ON public.schools FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_departments_updated_at BEFORE UPDATE ON public.departments_and_programs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_majors_updated_at BEFORE UPDATE ON public.majors FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_emphasis_updated_at BEFORE UPDATE ON public.emphasis_areas_enhanced FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_core_reqs_updated_at BEFORE UPDATE ON public.core_curriculum_requirements FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_core_pathways_updated_at BEFORE UPDATE ON public.core_curriculum_pathways FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON public.courses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_plans_updated_at BEFORE UPDATE ON public.plans FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_planned_courses_updated_at BEFORE UPDATE ON public.planned_courses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_substitutions_updated_at BEFORE UPDATE ON public.substitutions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column(); 