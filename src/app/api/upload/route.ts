import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { put } from '@vercel/blob';

const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_VIDEO_SIZE = 200 * 1024 * 1024; // 200MB
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'];
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/ogg'];

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!file.name || file.size === 0) {
      return NextResponse.json({ error: 'Invalid file' }, { status: 400 });
    }

    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');

    if (!isImage && !isVideo) {
      return NextResponse.json({ error: 'Unsupported file type. Please upload an image or video.' }, { status: 400 });
    }

    if (isImage && !ALLOWED_IMAGE_TYPES.includes(file.type)) {
      return NextResponse.json({ error: `Unsupported image format: ${file.type}. Allowed: JPEG, PNG, WebP, GIF, AVIF` }, { status: 400 });
    }

    if (isVideo && !ALLOWED_VIDEO_TYPES.includes(file.type)) {
      return NextResponse.json({ error: `Unsupported video format: ${file.type}. Allowed: MP4, WebM, OGG` }, { status: 400 });
    }

    const maxSize = isImage ? MAX_IMAGE_SIZE : MAX_VIDEO_SIZE;
    if (file.size > maxSize) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
      const maxMB = (maxSize / (1024 * 1024)).toFixed(0);
      return NextResponse.json({ error: `File too large (${sizeMB}MB). Maximum: ${maxMB}MB` }, { status: 400 });
    }

    const ext = path.extname(file.name) || (isImage ? '.webp' : '.mp4');
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;

    // Cloud storage upload if BLOB token is configured on Vercel
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const blob = await put(filename, file, { access: 'public' });
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
    const message = err instanceof Error ? err.message : 'Upload failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
