-- SQL to create admin_users table for FL0CK
-- Run this in Supabase SQL editor or via psql against your database

-- Create table
CREATE TABLE IF NOT EXISTS public.admin_users (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  username text NOT NULL,
  role text DEFAULT 'admin' NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  enabled boolean DEFAULT true NOT NULL
);

-- Unique index on username
CREATE UNIQUE INDEX IF NOT EXISTS admin_users_username_idx ON public.admin_users (username);

-- Example insert (replace with your admin GitHub username)
INSERT INTO public.admin_users (username, role) VALUES ('F1dg3tXD', 'admin') ON CONFLICT DO NOTHING;

-- Optional: grant usage to authenticated role if needed
-- GRANT SELECT ON public.admin_users TO authenticated;
