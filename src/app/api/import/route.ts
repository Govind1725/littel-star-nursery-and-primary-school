import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

function extractGoogleDriveId(url: string): string | null {
  const patterns = [
    /\/file\/d\/([^/?#&]+)/,
    /\/uc\?.*[&]?id=([^&]+)/,
    /\/open\?.*[&]?id=([^&]+)/,
    /\/drive\/folders\/([^/?#&]+)/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return null;
}

export async function POST(req: NextRequest) {
  try {
    const { url, type } = await req.json();
    if (!url) {
      return NextResponse.json({ error: 'No URL provided' }, { status: 400 });
    }

    let downloadUrl = url;
    const fileId = extractGoogleDriveId(url);
    if (fileId) {
      downloadUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
    }

    const resp = await fetch(downloadUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      redirect: 'follow',
    });
    if (!resp.ok) {
      return NextResponse.json({ error: 'Failed to download file' }, { status: 400 });
    }

    const buffer = Buffer.from(await resp.arrayBuffer());
    const contentType = resp.headers.get('content-type') || '';
    const ext = type === 'image'
      ? '.jpg'
      : '.mp4';

    const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;
    const dir = path.join(process.cwd(), 'public', 'uploads');
    await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, filename), buffer);

    return NextResponse.json({ url: `/uploads/${filename}` });
  } catch {
    return NextResponse.json({ error: 'Import failed' }, { status: 500 });
  }
}
