-- Setup script for Little Star Nursery and Primary School CMS
-- Execute this script in the Supabase SQL Editor

-- 1. CLEANUP (Drop existing old tables if they exist)
DROP TABLE IF EXISTS public.announcements CASCADE;
DROP TABLE IF EXISTS public.media CASCADE;
DROP TABLE IF EXISTS public.gallery CASCADE;

-- 2. CREATE GALLERY TABLE
CREATE TABLE public.gallery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  media_type TEXT NOT NULL CHECK (media_type IN ('image', 'video')),
  media_url TEXT NOT NULL,
  thumbnail_url TEXT DEFAULT '',
  is_active BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Enable RLS for gallery
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;

-- Select policy (everyone can read active gallery items)
CREATE POLICY "Allow public read access for gallery" ON public.gallery
  FOR SELECT USING (is_active = true);

-- Admin policy (authenticated users can perform all operations)
CREATE POLICY "Allow admin all access for gallery" ON public.gallery
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 3. CREATE ANNOUNCEMENTS TABLE
CREATE TABLE public.announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL, -- This stores the content of the announcement
  category TEXT NOT NULL DEFAULT 'general' CHECK (category IN ('general', 'event', 'holiday', 'urgent')),
  is_active BOOLEAN NOT NULL DEFAULT true,
  is_pinned BOOLEAN NOT NULL DEFAULT false,
  expiry_date DATE DEFAULT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Enable RLS for announcements
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

-- Select policy (everyone can read active announcements)
CREATE POLICY "Allow public read access for announcements" ON public.announcements
  FOR SELECT USING (is_active = true);

-- Admin policy (authenticated users can perform all operations)
CREATE POLICY "Allow admin all access for announcements" ON public.announcements
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 4. STORAGE SETUP (Create uploads bucket and set policies)
-- Inserts the uploads bucket if it does not already exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('uploads', 'uploads', true)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS for storage buckets (enabled by default, but let's declare policies)
CREATE POLICY "Allow public read access to uploads" ON storage.objects
  FOR SELECT USING (bucket_id = 'uploads');

CREATE POLICY "Allow authenticated admin to manage uploads" ON storage.objects
  FOR ALL TO authenticated USING (bucket_id = 'uploads') WITH CHECK (bucket_id = 'uploads');

-- 5. ENABLE REALTIME SYNC
-- Add tables to the supabase_realtime publication to enable subscriptions
-- Check if tables are already in the publication to prevent duplicate errors
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'gallery'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.gallery;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'announcements'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.announcements;
  END IF;
END $$;

-- 6. CREATE ADMIN USER
-- Creates an admin user in auth.users with email 'admin@littlestar.com' and password 'littlestar2024'
-- pgcrypto extension is standard in Supabase and available under extensions schema
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'admin@littlestar.com') THEN
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at
    )
    VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'admin@littlestar.com',
      extensions.crypt('12345', extensions.gen_salt('bf')),
      now(),
      '{"provider": "email", "providers": ["email"]}',
      '{"role": "admin"}',
      now(),
      now()
    );
  END IF;
END $$;
