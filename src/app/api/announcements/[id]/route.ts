import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

interface Announcement {
  id: string;
  title: string;
  content: string;
  category: 'general' | 'event' | 'holiday' | 'urgent';
  date: string;
  createdAt: string;
}

const DATA_FILE = path.join(process.cwd(), 'src', 'data', 'announcements.json');

function readData(): Announcement[] {
  try {
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
  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(items, null, 2));
}

const noCacheHeaders = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
  'Pragma': 'no-cache',
  'Expires': '0',
  'Surrogate-Control': 'no-store',
};

export async function PUT(request: NextRequest, { params }: { params: any }) {
  const { id } = await params;
  const body = await request.json();
  const items = readData();
  const index = items.findIndex((item) => item.id === id);

  if (index === -1) {
    return NextResponse.json({ error: 'Announcement not found' }, { status: 404, headers: noCacheHeaders });
  }

  items[index] = {
    ...items[index],
    title: body.title?.trim() ?? items[index].title,
    content: body.content?.trim() ?? items[index].content,
    category: body.category ?? items[index].category,
    date: body.date ?? items[index].date,
  };
  writeData(items);

  return NextResponse.json(items[index], { headers: noCacheHeaders });
}

export async function DELETE(_request: NextRequest, { params }: { params: any }) {
  const { id } = await params;
  const items = readData();
  const index = items.findIndex((item) => item.id === id);

  if (index === -1) {
    return NextResponse.json({ error: 'Announcement not found' }, { status: 404, headers: noCacheHeaders });
  }

  items.splice(index, 1);
  writeData(items);

  return NextResponse.json({ success: true }, { headers: noCacheHeaders });
}
