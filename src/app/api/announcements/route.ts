import { NextRequest, NextResponse } from 'next/server';
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

function readData(): Announcement[] {
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

function writeData(items: Announcement[]): void {
  ensureDataDir();
  fs.writeFileSync(DATA_FILE, JSON.stringify(items, null, 2));
}

const noCacheHeaders = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
  'Pragma': 'no-cache',
  'Expires': '0',
  'Surrogate-Control': 'no-store',
};

export async function GET() {
  let items = readData();
  const now = Date.now();
  const THREE_DAYS = 3 * 24 * 60 * 60 * 1000;

  const active = items.filter((a) => {
    if (a.category !== 'urgent') return true;
    const age = now - new Date(a.createdAt).getTime();
    return age < THREE_DAYS;
  });

  if (active.length < items.length) {
    writeData(active);
  }

  const sorted = [...active].sort((a, b) => {
    if (a.category === 'urgent' && b.category !== 'urgent') return -1;
    if (a.category !== 'urgent' && b.category === 'urgent') return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return NextResponse.json(sorted, { headers: noCacheHeaders });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  if (!body.title?.trim() || !body.content?.trim()) {
    return NextResponse.json({ error: 'Title and content are required' }, { status: 400, headers: noCacheHeaders });
  }

  const items = readData();
  const newItem: Announcement = {
    id: Date.now().toString(),
    title: body.title.trim(),
    content: body.content.trim(),
    category: body.category || 'general',
    date: body.date || new Date().toISOString().split('T')[0],
    createdAt: new Date().toISOString(),
  };
  items.unshift(newItem);
  writeData(items);

  return NextResponse.json(newItem, { status: 201, headers: noCacheHeaders });
}
