import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { put } from '@vercel/blob';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const ext = path.extname(file.name) || '.jpg';
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;

    // Cloud storage upload if BLOB token is configured on Vercel
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const blob = await put(filename, file, { 
        access: 'public',
        storeId: process.env.littelstarnp_STORE_ID,
      });
      return NextResponse.json({ url: blob.url });
    }

    // Local fallback for local development
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const dir = path.join(process.cwd(), 'public', 'uploads');
    await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, filename), buffer);

    return NextResponse.json({ url: `/uploads/${filename}` });
  } catch (err) {
    console.error('Upload failed:', err);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
