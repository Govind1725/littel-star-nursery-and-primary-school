import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { supabase, STORAGE_BUCKET } from '@/lib/supabase';

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
    const ext = type === 'image' ? '.jpg' : '.mp4';
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;

    // Upload to Supabase Storage if configured
    if (supabase) {
      const { error } = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(filename, buffer, {
          contentType: contentType || (type === 'image' ? 'image/jpeg' : 'video/mp4'),
          cacheControl: '3600',
          upsert: false,
        });

      if (error) {
        if (error.message?.includes('bucket')) {
          return NextResponse.json({ error: `Storage bucket "${STORAGE_BUCKET}" not found. Please create it in your Supabase dashboard.` }, { status: 500 });
        }
        console.error('Supabase upload error:', error);
        return NextResponse.json({ error: `Import failed: ${error.message}` }, { status: 500 });
      }

      const { data: { publicUrl } } = supabase.storage
        .from(STORAGE_BUCKET)
        .getPublicUrl(filename);

      return NextResponse.json({ url: publicUrl });
    }

    // Local fallback
    const dir = path.join(process.cwd(), 'public', 'uploads');
    await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, filename), buffer);

    return NextResponse.json({ url: `/uploads/${filename}` });
  } catch (err) {
    console.error('Import failed:', err);
    return NextResponse.json({ error: 'Import failed' }, { status: 500 });
  }
}
