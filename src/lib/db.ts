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
  ensureDataDir();
  fs.writeFileSync(DATA_FILE, JSON.stringify(items, null, 2));
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
