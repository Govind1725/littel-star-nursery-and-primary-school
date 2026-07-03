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

// ========== MEDIA (API-backed, centralized database) ==========
export async function getMediaItems(): Promise<MediaItem[]> {
  try {
    const res = await fetch(`/api/media?t=${Date.now()}`, { cache: 'no-store' });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export async function addMediaItem(item: Omit<MediaItem, 'id' | 'createdAt'>): Promise<MediaItem | null> {
  try {
    const res = await fetch('/api/media', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Server error (${res.status})`);
    }
    return res.json();
  } catch (err) {
    if (err instanceof Error) throw err;
    return null;
  }
}

export async function deleteMediaItem(id: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/media/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Server error (${res.status})`);
    }
    return true;
  } catch (err) {
    if (err instanceof Error) throw err;
    return false;
  }
}

// ========== ANNOUNCEMENTS (API-backed, centralized database) ==========

export async function getAnnouncements(): Promise<Announcement[]> {
  try {
    const res = await fetch(`/api/announcements?t=${Date.now()}`, { cache: 'no-store' });
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
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Server error (${res.status})`);
    }
    return res.json();
  } catch (err) {
    if (err instanceof Error) throw err;
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
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Server error (${res.status})`);
    }
    return res.json();
  } catch (err) {
    if (err instanceof Error) throw err;
    return null;
  }
}

export async function deleteAnnouncement(id: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/announcements/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Server error (${res.status})`);
    }
    return true;
  } catch (err) {
    if (err instanceof Error) throw err;
    return false;
  }
}
