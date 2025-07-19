CREATE TABLE IF NOT EXISTS public.substitutions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    plan_id uuid NOT NULL REFERENCES public.plans(id) ON DELETE CASCADE,
    requirement_group_id uuid NOT NULL,
    placeholder_code text NOT NULL,
    substitute_course_code text NOT NULL,
    is_upper_div_override boolean,
    units_override integer,
    created_at timestamptz DEFAULT now()
);