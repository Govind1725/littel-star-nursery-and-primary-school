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

  const dateStr = body.date || new Date().toISOString().split('T')[0];
  const parsed = new Date(dateStr);
  if (isNaN(parsed.getTime())) {
    return NextResponse.json({ error: 'Invalid date format' }, { status: 400, headers: noCacheHeaders });
  }
  const validDate = parsed.toISOString().split('T')[0];
  const now = new Date();
  const minDate = new Date(now.getFullYear() - 5, 0, 1);
  const maxDate = new Date(now.getFullYear() + 2, 11, 31);
  if (parsed < minDate || parsed > maxDate) {
    return NextResponse.json({ error: 'Date is out of valid range (5 years ago to 2 years ahead)' }, { status: 400, headers: noCacheHeaders });
  }

  const items = await readAnnouncements();
  const newItem: Announcement = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    title: body.title.trim(),
    content: body.content.trim(),
    category: body.category || 'general',
    date: validDate,
    createdAt: new Date().toISOString(),
  };
  items.unshift(newItem);
  await writeAnnouncements(items);

  return NextResponse.json(newItem, { status: 201, headers: noCacheHeaders });
}
