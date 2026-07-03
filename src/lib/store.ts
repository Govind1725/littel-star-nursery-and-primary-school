export interface MediaItem {
  id: string;
  type: 'image' | 'video';
  url: string;
  title: string;
  description?: string;
  createdAt: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  category: 'general' | 'event' | 'holiday' | 'urgent';
  date: string;
  createdAt: string;
}

const MEDIA_KEY = 'lsn_media';

// ========== MEDIA ==========
export function getMediaItems(): MediaItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(MEDIA_KEY);
    return data ? JSON.parse(data) : getDefaultMedia();
  } catch {
    return getDefaultMedia();
  }
}

export function saveMediaItems(items: MediaItem[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(MEDIA_KEY, JSON.stringify(items));
}

export function addMediaItem(item: Omit<MediaItem, 'id' | 'createdAt'>): MediaItem {
  const newItem: MediaItem = {
    ...item,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };
  const items = getMediaItems();
  items.unshift(newItem);
  saveMediaItems(items);
  return newItem;
}

export function deleteMediaItem(id: string): void {
  const items = getMediaItems().filter((item) => item.id !== id);
  saveMediaItems(items);
}

function getDefaultMedia(): MediaItem[] {
  return [
    { id: '1', type: 'image', url: '', title: 'Annual Sports Day', description: 'Students participating in sports day activities', createdAt: '2024-01-15T10:00:00Z' },
    { id: '2', type: 'image', url: '', title: 'Art Exhibition', description: 'Showcase of student artworks', createdAt: '2024-02-10T09:00:00Z' },
    { id: '3', type: 'image', url: '', title: 'Science Fair', description: 'Young scientists at work', createdAt: '2024-03-05T11:00:00Z' },
    { id: '4', type: 'image', url: '', title: 'Graduation Ceremony', description: 'Nursery graduation celebration', createdAt: '2024-04-01T09:00:00Z' },
    { id: '5', type: 'image', url: '', title: 'Cultural Program', description: 'Dance and music performances', createdAt: '2024-05-20T10:00:00Z' },
    { id: '6', type: 'image', url: '', title: 'Classroom Activities', description: 'Learning through play', createdAt: '2024-06-01T09:00:00Z' },
  ];
}

// ========== ANNOUNCEMENTS (API-backed, centralized database) ==========

export async function getAnnouncements(): Promise<Announcement[]> {
  try {
    const res = await fetch('/api/announcements', { cache: 'no-store' });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export async function addAnnouncement(ann: Omit<Announcement, 'id' | 'createdAt'>): Promise<Announcement | null> {
  try {
    const res = await fetch('/api/announcements', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ann),
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function updateAnnouncement(id: string, ann: Partial<Announcement>): Promise<Announcement | null> {
  try {
    const res = await fetch(`/api/announcements/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ann),
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function deleteAnnouncement(id: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/announcements/${id}`, { method: 'DELETE' });
    return res.ok;
  } catch {
    return false;
  }
}
