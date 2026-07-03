import fs from 'fs';
import path from 'path';

export interface Announcement {
  id: string;
  title: string;
  content: string;
  category: 'general' | 'event' | 'holiday' | 'urgent';
  date: string;
  createdAt: string;
}

const DATA_FILE = path.join(process.cwd(), 'src', 'data', 'announcements.json');

function ensureDataDir(): void {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function readLocalData(): Announcement[] {
  try {
    ensureDataDir();
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2));
      return [];
    }
    const data = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function writeLocalData(items: Announcement[]): void {
  try {
    ensureDataDir();
    fs.writeFileSync(DATA_FILE, JSON.stringify(items, null, 2));
  } catch (err) {
    console.error('Failed to write local announcements file:', err);
  }
}

// REST call helper to Vercel KV (Upstash Redis REST API)
async function getKvData(): Promise<Announcement[] | null> {
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  if (!url || !token) return null;

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(['GET', 'announcements']),
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (data.result === null) return [];
    
    if (typeof data.result === 'string') {
      return JSON.parse(data.result);
    }
    return data.result;
  } catch (err) {
    console.error('Failed to get data from Vercel KV:', err);
    return null;
  }
}

async function setKvData(items: Announcement[]): Promise<boolean> {
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  if (!url || !token) return false;

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(['SET', 'announcements', JSON.stringify(items)]),
      cache: 'no-store',
    });
    return res.ok;
  } catch (err) {
    console.error('Failed to set data in Vercel KV:', err);
    return false;
  }
}

export async function readAnnouncements(): Promise<Announcement[]> {
  const kvData = await getKvData();
  if (kvData !== null) {
    return kvData;
  }
  return readLocalData();
}

export async function writeAnnouncements(items: Announcement[]): Promise<void> {
  const success = await setKvData(items);
  if (!success) {
    writeLocalData(items);
  }
}

// ========== MEDIA ==========
export interface MediaItem {
  id: string;
  type: 'image' | 'video';
  url: string;
  title: string;
  description?: string;
  createdAt: string;
}

const MEDIA_FILE = path.join(process.cwd(), 'src', 'data', 'media.json');

function readLocalMedia(): MediaItem[] {
  try {
    ensureDataDir();
    if (!fs.existsSync(MEDIA_FILE)) {
      const defaultMedia: MediaItem[] = [
        { id: '1', type: 'image', url: '', title: 'Annual Sports Day', description: 'Students participating in sports day activities', createdAt: '2024-01-15T10:00:00Z' },
        { id: '2', type: 'image', url: '', title: 'Art Exhibition', description: 'Showcase of student artworks', createdAt: '2024-02-10T09:00:00Z' },
        { id: '3', type: 'image', url: '', title: 'Science Fair', description: 'Young scientists at work', createdAt: '2024-03-05T11:00:00Z' },
        { id: '4', type: 'image', url: '', title: 'Graduation Ceremony', description: 'Nursery graduation celebration', createdAt: '2024-04-01T09:00:00Z' },
        { id: '5', type: 'image', url: '', title: 'Cultural Program', description: 'Dance and music performances', createdAt: '2024-05-20T10:00:00Z' },
        { id: '6', type: 'image', url: '', title: 'Classroom Activities', description: 'Learning through play', createdAt: '2024-06-01T09:00:00Z' },
      ];
      fs.writeFileSync(MEDIA_FILE, JSON.stringify(defaultMedia, null, 2));
      return defaultMedia;
    }
    const data = fs.readFileSync(MEDIA_FILE, 'utf-8');
    return JSON.parse(data);
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

async function getKvMedia(): Promise<MediaItem[] | null> {
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  if (!url || !token) return null;

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(['GET', 'media']),
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (data.result === null) return [];
    
    if (typeof data.result === 'string') {
      return JSON.parse(data.result);
    }
    return data.result;
  } catch (err) {
    console.error('Failed to get media from Vercel KV:', err);
    return null;
  }
}

async function setKvMedia(items: MediaItem[]): Promise<boolean> {
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  if (!url || !token) return false;

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(['SET', 'media', JSON.stringify(items)]),
      cache: 'no-store',
    });
    return res.ok;
  } catch (err) {
    console.error('Failed to set media in Vercel KV:', err);
    return false;
  }
}

export async function readMediaItems(): Promise<MediaItem[]> {
  const kvData = await getKvMedia();
  if (kvData !== null) {
    return kvData;
  }
  return readLocalMedia();
}

export async function writeMediaItems(items: MediaItem[]): Promise<void> {
  const success = await setKvMedia(items);
  if (!success) {
    writeLocalMedia(items);
  }
}
