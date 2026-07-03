import { NextRequest, NextResponse } from 'next/server';
import { readMediaItems, writeMediaItems } from '@/lib/db';

const noCacheHeaders = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
  'Pragma': 'no-cache',
  'Expires': '0',
  'Surrogate-Control': 'no-store',
};

export async function DELETE(_request: NextRequest, context: { params: Promise<unknown> }) {
  const { id } = (await context.params) as { id: string };
  const items = await readMediaItems();
  const index = items.findIndex((item) => item.id === id);

  if (index === -1) {
    return NextResponse.json({ error: 'Media item not found' }, { status: 404, headers: noCacheHeaders });
  }

  items.splice(index, 1);
  await writeMediaItems(items);

  return NextResponse.json({ success: true }, { headers: noCacheHeaders });
}
