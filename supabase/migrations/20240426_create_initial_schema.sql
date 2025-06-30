-- 20240426_create_initial_schema.sql
-- Initial database schema for SCU Schedule Planner
-- Creates enums and tables used by seed.sql.

-- Enable pgcrypto UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ENUM TYPES --------------------------------------------------------------

-- Enum for quarter types
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'quarter_type') THEN
        CREATE TYPE quarter_type AS ENUM ('Fall', 'Winter', 'Spring', 'Summer');
    END IF;
END $$;

-- Enum for prerequisite relationship types
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'prerequisite_type') THEN
        CREATE TYPE prerequisite_type AS ENUM ('required', 'or', 'recommended');
    END IF;
END $$;

-- Enum for course planning status
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'course_status') THEN
        CREATE TYPE course_status AS ENUM ('planned', 'completed', 'not_started');
    END IF;
END $$;

-- Enum for requirement grouping type
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'requirement_type') THEN
        CREATE TYPE requirement_type AS ENUM ('major', 'emphasis', 'core', 'university');
    END IF;
END $$;

-- TABLES ------------------------------------------------------------------

-- Courses
CREATE TABLE IF NOT EXISTS public.courses (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    code text NOT NULL UNIQUE,
    title text NOT NULL,
    units integer NOT NULL,
    department text NOT NULL,
    is_upper_division boolean NOT NULL DEFAULT false,
    description text,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

-- Course quarters (when a course is offered)
CREATE TABLE IF NOT EXISTS public.course_quarters (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    quarter quarter_type NOT NULL
);

-- Corequisite relationships
CREATE TABLE IF NOT EXISTS public.corequisites (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    corequisite_course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE
);

-- Cross-listed courses
CREATE TABLE IF NOT EXISTS public.cross_listed_courses (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    cross_listed_course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE
);

-- Prerequisites (top-level)
CREATE TABLE IF NOT EXISTS public.prerequisites (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    prerequisite_type prerequisite_type NOT NULL,
    min_grade text,
    created_at timestamptz NOT NULL DEFAULT now()
);

-- Mapping between prerequisites and the courses that satisfy them
CREATE TABLE IF NOT EXISTS public.prerequisite_courses (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    prerequisite_id uuid NOT NULL REFERENCES public.prerequisites(id) ON DELETE CASCADE,
    prerequisite_course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE
);

-- Requirement groups (major core, university core, etc.)
CREATE TABLE IF NOT EXISTS public.requirements (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    type requirement_type NOT NULL,
    notes text,
    min_units integer,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

-- Courses that belong to a requirement group
CREATE TABLE IF NOT EXISTS public.requirement_courses (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    requirement_id uuid NOT NULL REFERENCES public.requirements(id) ON DELETE CASCADE,
    course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE
);

-- Choose-from groups (e.g., "choose 2 from this list")
CREATE TABLE IF NOT EXISTS public.requirement_choose_from (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    requirement_id uuid NOT NULL REFERENCES public.requirements(id) ON DELETE CASCADE,
    count integer NOT NULL DEFAULT 0,
    created_at timestamptz NOT NULL DEFAULT now()
);

-- The course options for a choose-from group
CREATE TABLE IF NOT EXISTS public.requirement_choose_options (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    requirement_choose_from_id uuid NOT NULL REFERENCES public.requirement_choose_from(id) ON DELETE CASCADE,
    course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE
);

-- Emphasis areas
CREATE TABLE IF NOT EXISTS public.emphasis_areas (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL UNIQUE,
    description text,
    created_at timestamptz NOT NULL DEFAULT now()
);

-- Join table linking emphasis areas and requirement groups
CREATE TABLE IF NOT EXISTS public.emphasis_requirements (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    emphasis_id uuid NOT NULL REFERENCES public.emphasis_areas(id) ON DELETE CASCADE,
    requirement_id uuid NOT NULL REFERENCES public.requirements(id) ON DELETE CASCADE
); 