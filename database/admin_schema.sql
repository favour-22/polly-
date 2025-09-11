-- Create a custom type for user roles to ensure data consistency
CREATE TYPE public.user_role AS ENUM ('admin', 'user');

-- Add the new 'role' column to the 'profiles' table
-- Default to 'user' for all new and existing profiles
ALTER TABLE public.profiles
ADD COLUMN role public.user_role DEFAULT 'user' NOT NULL;

-- Add an index on the 'role' column for faster queries
CREATE INDEX idx_profiles_role ON public.profiles(role);

-- Note: You will need to update your Row Level Security (RLS) policies
-- to grant admin-level permissions. For example, admins might have
-- permissions to view or modify all polls, while users can only manage their own.

/*
-- Example of how to manually assign the 'admin' role to a user:
-- 1. Get the user's ID from the 'auth.users' table after they have signed up.
-- 2. Run the following SQL command, replacing the user ID with the actual ID.

UPDATE public.profiles
SET role = 'admin'
WHERE id = 'paste_user_id_here';
*/
