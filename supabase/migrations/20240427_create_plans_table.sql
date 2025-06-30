-- 20240427_create_plans_table.sql
-- Migration to create the public.plans table that stores user degree-planning data.

-- Enable pgcrypto for UUID generation (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create the plans table
CREATE TABLE IF NOT EXISTS public.plans (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    user_id uuid NOT NULL,
    emphasis_id uuid NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

-- FK to auth.users (Supabase users table)
ALTER TABLE public.plans
    ADD CONSTRAINT plans_user_id_fkey
    FOREIGN KEY (user_id)
    REFERENCES auth.users(id)
    ON DELETE CASCADE;

-- FK to emphasis_areas (if the table exists)
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'emphasis_areas'
    ) THEN
        ALTER TABLE public.plans
            ADD CONSTRAINT plans_emphasis_id_fkey
            FOREIGN KEY (emphasis_id)
            REFERENCES public.emphasis_areas(id);
    END IF;
END$$;

-- Audit trigger to keep updated_at current
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_timestamp ON public.plans;
CREATE TRIGGER set_timestamp
BEFORE UPDATE ON public.plans
FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();
