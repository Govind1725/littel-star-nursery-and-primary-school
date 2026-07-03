import { NextRequest, NextResponse } from 'next/server';
import { readAnnouncements, writeAnnouncements, type Announcement } from '@/lib/db';

export const dynamic = 'force-dynamic';

const noCacheHeaders = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
  'Pragma': 'no-cache',
  'Expires': '0',
  'Surrogate-Control': 'no-store',
};

export async function GET() {
  let items = await readAnnouncements();
  const now = Date.now();
  const THREE_DAYS = 3 * 24 * 60 * 60 * 1000;

  const active = items.filter((a) => {
    if (a.category !== 'urgent') return true;
    const age = now - new Date(a.createdAt).getTime();
    return age < THREE_DAYS;
  });

  if (active.length < items.length) {
    await writeAnnouncements(active);
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

  const items = await readAnnouncements();
  const newItem: Announcement = {
    id: Date.now().toString(),
    title: body.title.trim(),
    content: body.content.trim(),
    category: body.category || 'general',
    date: body.date || new Date().toISOString().split('T')[0],
    createdAt: new Date().toISOString(),
  };
  items.unshift(newItem);
  await writeAnnouncements(items);

  return NextResponse.json(newItem, { status: 201, headers: noCacheHeaders });
}
