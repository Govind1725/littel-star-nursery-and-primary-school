import { NextRequest, NextResponse } from 'next/server';
import { readAnnouncements, writeAnnouncements } from '@/lib/db';

export const dynamic = 'force-dynamic';

const noCacheHeaders = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
  'Pragma': 'no-cache',
  'Expires': '0',
  'Surrogate-Control': 'no-store',
};

export async function PUT(request: NextRequest, context: { params: Promise<unknown> }) {
  const { id } = (await context.params) as { id: string };
  const body = await request.json();
  const items = await readAnnouncements();
  const index = items.findIndex((item) => item.id === id);

  if (index === -1) {
    return NextResponse.json({ error: 'Announcement not found' }, { status: 404, headers: noCacheHeaders });
  }

  const dateStr = body.date ?? items[index].date;
  if (body.date !== undefined) {
    const parsed = new Date(dateStr);
    if (isNaN(parsed.getTime())) {
      return NextResponse.json({ error: 'Invalid date format' }, { status: 400, headers: noCacheHeaders });
    }
    const now = new Date();
    const minDate = new Date(now.getFullYear() - 5, 0, 1);
    const maxDate = new Date(now.getFullYear() + 2, 11, 31);
    if (parsed < minDate || parsed > maxDate) {
      return NextResponse.json({ error: 'Date is out of valid range (5 years ago to 2 years ahead)' }, { status: 400, headers: noCacheHeaders });
    }
  }

  items[index] = {
    ...items[index],
    title: body.title?.trim() ?? items[index].title,
    content: body.content?.trim() ?? items[index].content,
    category: body.category ?? items[index].category,
    date: dateStr,
  };
  await writeAnnouncements(items);

  return NextResponse.json(items[index], { headers: noCacheHeaders });
}

export async function DELETE(_request: NextRequest, context: { params: Promise<unknown> }) {
  const { id } = (await context.params) as { id: string };
  const items = await readAnnouncements();
  const index = items.findIndex((item) => item.id === id);

  if (index === -1) {
    return NextResponse.json({ error: 'Announcement not found' }, { status: 404, headers: noCacheHeaders });
  }

  items.splice(index, 1);
  await writeAnnouncements(items);

  return NextResponse.json({ success: true }, { headers: noCacheHeaders });
}
