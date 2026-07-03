-- Run this SQL in your Supabase SQL Editor (Dashboard > SQL Editor)
-- Creates the tables needed by the admin panel.

-- ========== ANNOUNCEMENTS ==========
CREATE TABLE IF NOT EXISTS public.announcements (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'general',
  date TEXT NOT NULL,
  "createdAt" TEXT NOT NULL
);

ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

-- Allow anon key and service_role full access (server-side API routes)
CREATE POLICY "Allow all for anon" ON public.announcements
  FOR ALL USING (true) WITH CHECK (true);

-- ========== MEDIA ==========
CREATE TABLE IF NOT EXISTS public.media (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  url TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  "createdAt" TEXT NOT NULL
);

ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;

-- Allow anon key and service_role full access (server-side API routes)
CREATE POLICY "Allow all for anon" ON public.media
  FOR ALL USING (true) WITH CHECK (true);
