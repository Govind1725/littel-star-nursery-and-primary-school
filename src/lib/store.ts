// Simple client-side data store using localStorage
// In a real app, this would use a database

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
const ANNOUNCEMENTS_KEY = 'lsn_announcements';

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

// ========== ANNOUNCEMENTS ==========
export function getAnnouncements(): Announcement[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(ANNOUNCEMENTS_KEY);
    return data ? JSON.parse(data) : getDefaultAnnouncements();
  } catch {
    return getDefaultAnnouncements();
  }
}

export function saveAnnouncements(items: Announcement[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(ANNOUNCEMENTS_KEY, JSON.stringify(items));
}

export function addAnnouncement(ann: Omit<Announcement, 'id' | 'createdAt'>): Announcement {
  const newAnn: Announcement = {
    ...ann,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };
  const items = getAnnouncements();
  items.unshift(newAnn);
  saveAnnouncements(items);
  return newAnn;
}

export function deleteAnnouncement(id: string): void {
  const items = getAnnouncements().filter((item) => item.id !== id);
  saveAnnouncements(items);
}

function getDefaultAnnouncements(): Announcement[] {
  return [
    {
      id: '1',
      title: 'Admissions Open for 2024–25',
      content: 'We are pleased to announce that admissions for the academic year 2024–25 are now open! Visit our school office or contact us to secure your child\'s spot.',
      category: 'general',
      date: '2024-06-01',
      createdAt: '2024-06-01T09:00:00Z',
    },
    {
      id: '2',
      title: 'Annual Sports Day – July 15, 2024',
      content: 'Our Annual Sports Day will be held on July 15, 2024. All students are required to wear their sports uniforms. Parents are warmly invited to attend.',
      category: 'event',
      date: '2024-07-15',
      createdAt: '2024-06-15T09:00:00Z',
    },
    {
      id: '3',
      title: 'School Holiday – Pongal',
      content: 'The school will remain closed from January 13–17 for the Pongal festival. Classes will resume on January 18th.',
      category: 'holiday',
      date: '2024-01-13',
      createdAt: '2024-01-05T09:00:00Z',
    },
    {
      id: '4',
      title: 'Fee Payment Reminder',
      content: 'This is a reminder that the second-term school fees are due by August 31. Please pay at the school office or via bank transfer.',
      category: 'urgent',
      date: '2024-08-15',
      createdAt: '2024-08-10T09:00:00Z',
    },
  ];
}
