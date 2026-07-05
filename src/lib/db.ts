import fs from 'fs';
import path from 'path';
import { supabase, TABLES } from './supabase';

export interface Announcement {
  id: string;
  title: string;
  content: string;
  category: 'general' | 'event' | 'holiday' | 'urgent';
  date: string;
  createdAt: string;
}

export interface MediaItem {
  id: string;
  type: 'image' | 'video';
  url: string;
  title: string;
  description?: string;
  createdAt: string;
}

const DATA_DIR = path.join(process.cwd(), 'src', 'data');
const ANNOUNCEMENTS_FILE = path.join(DATA_DIR, 'announcements.json');
const MEDIA_FILE = path.join(DATA_DIR, 'media.json');

function ensureDataDir(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

// ========== SUPABASE HELPERS ==========

async function supabaseRead<T>(table: string): Promise<T[] | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase.from(table).select('*');
    if (error) {
      console.error(`Supabase read error (${table}):`, error.message);
      return null;
    }
    return data as T[];
  } catch (err) {
    console.error(`Supabase read failed (${table}):`, err);
    return null;
  }
}

async function supabaseWrite<T extends { id: string }>(table: string, items: T[]): Promise<boolean> {
  if (!supabase) return false;
  try {
    // Delete all existing rows then insert the new set
    const { error: delError } = await supabase.from(table).delete().neq('id', '');
    if (delError) {
      console.error(`Supabase delete error (${table}):`, delError.message);
      return false;
    }

    if (items.length === 0) return true;

    const { error: insError } = await supabase.from(table).insert(items);
    if (insError) {
      console.error(`Supabase insert error (${table}):`, insError.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error(`Supabase write failed (${table}):`, err);
    return false;
  }
}

// ========== ANNOUNCEMENTS ==========

function readLocalAnnouncements(): Announcement[] {
  try {
    ensureDataDir();
    if (!fs.existsSync(ANNOUNCEMENTS_FILE)) {
      fs.writeFileSync(ANNOUNCEMENTS_FILE, JSON.stringify([], null, 2));
      return [];
    }
    return JSON.parse(fs.readFileSync(ANNOUNCEMENTS_FILE, 'utf-8'));
  } catch {
    return [];
  }
}

function writeLocalAnnouncements(items: Announcement[]): void {
  try {
    ensureDataDir();
    fs.writeFileSync(ANNOUNCEMENTS_FILE, JSON.stringify(items, null, 2));
  } catch (err) {
    console.error('Failed to write local announcements file:', err);
  }
}

export async function readAnnouncements(): Promise<Announcement[]> {
  const dbData = await supabaseRead<Announcement>(TABLES.announcements);
  if (dbData !== null) return dbData;
  return readLocalAnnouncements();
}

export async function writeAnnouncements(items: Announcement[]): Promise<void> {
  const ok = await supabaseWrite<Announcement>(TABLES.announcements, items);
  if (!ok) {
    writeLocalAnnouncements(items);
  }
}

// ========== MEDIA ==========

const defaultMedia: MediaItem[] = [
  { id: '1', type: 'image', url: '', title: 'Annual Sports Day', description: 'Students participating in sports day activities', createdAt: '2024-01-15T10:00:00Z' },
  { id: '2', type: 'image', url: '', title: 'Art Exhibition', description: 'Showcase of student artworks', createdAt: '2024-02-10T09:00:00Z' },
  { id: '3', type: 'image', url: '', title: 'Science Fair', description: 'Young scientists at work', createdAt: '2024-03-05T11:00:00Z' },
  { id: '4', type: 'image', url: '', title: 'Graduation Ceremony', description: 'Nursery graduation celebration', createdAt: '2024-04-01T09:00:00Z' },
  { id: '5', type: 'image', url: '', title: 'Cultural Program', description: 'Dance and music performances', createdAt: '2024-05-20T10:00:00Z' },
  { id: '6', type: 'image', url: '', title: 'Classroom Activities', description: 'Learning through play', createdAt: '2024-06-01T09:00:00Z' },
];

function readLocalMedia(): MediaItem[] {
  try {
    ensureDataDir();
    if (!fs.existsSync(MEDIA_FILE)) {
      fs.writeFileSync(MEDIA_FILE, JSON.stringify(defaultMedia, null, 2));
      return defaultMedia;
    }
    return JSON.parse(fs.readFileSync(MEDIA_FILE, 'utf-8'));
  } catch {
    return [];
  }
}

function writeLocalMedia(items: MediaItem[]): void {
  try {
    ensureDataDir();
    fs.writeFileSync(MEDIA_FILE, JSON.stringify(items, null, 2));
  } catch (err) {
    console.error('Failed to write local media file:', err);
  }
}

export async function readMediaItems(): Promise<MediaItem[]> {
  const dbData = await supabaseRead<MediaItem>(TABLES.gallery);
  if (dbData !== null) return dbData;
  return readLocalMedia();
}

export async function writeMediaItems(items: MediaItem[]): Promise<void> {
  const ok = await supabaseWrite<MediaItem>(TABLES.gallery, items);
  if (!ok) {
    writeLocalMedia(items);
  }
}
