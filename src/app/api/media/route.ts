import { NextRequest, NextResponse } from 'next/server';
import { readMediaItems, writeMediaItems, type MediaItem } from '@/lib/db';

export const dynamic = 'force-dynamic';

const noCacheHeaders = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
  'Pragma': 'no-cache',
  'Expires': '0',
  'Surrogate-Control': 'no-store',
};

export async function GET() {
  const items = await readMediaItems();
  return NextResponse.json(items, { headers: noCacheHeaders });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.url || !body.title) {
      return NextResponse.json({ error: 'Title and media URL are required' }, { status: 400, headers: noCacheHeaders });
    }

    const items = await readMediaItems();
    const newItem: MediaItem = {
      id: Date.now().toString(),
      type: body.type || 'image',
      url: body.url,
      title: body.title.trim(),
      description: body.description?.trim() || '',
      createdAt: new Date().toISOString(),
    };
    items.unshift(newItem);
    await writeMediaItems(items);

    return NextResponse.json(newItem, { status: 201, headers: noCacheHeaders });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400, headers: noCacheHeaders });
  }
}
