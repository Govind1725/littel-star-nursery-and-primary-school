import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { supabase, TABLES } from './supabase';

export interface GalleryItem {
  id: string;
  title: string;
  description?: string;
  media_type: 'image' | 'video';
  media_url: string;
  thumbnail_url?: string;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface Announcement {
  id: string;
  title: string;
  description: string;
  category: 'general' | 'event' | 'holiday' | 'urgent';
  is_active: boolean;
  is_pinned: boolean;
  expiry_date?: string;
  created_at: string;
  updated_at: string;
}

// 1. Hook to fetch active gallery items (ordered by display_order, then newest created_at)
export function useGallery() {
  return useQuery<GalleryItem[]>({
    queryKey: ['gallery'],
    queryFn: async () => {
      if (!supabase) {
        throw new Error('Supabase client is not initialized');
      }
      const { data, error } = await supabase
        .from(TABLES.gallery)
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (error) throw new Error(error.message);
      return data || [];
    },
  });
}

// 2. Hook to fetch active announcements (pinned first, then newest created_at)
export function useAnnouncements() {
  return useQuery<Announcement[]>({
    queryKey: ['announcements'],
    queryFn: async () => {
      if (!supabase) {
        throw new Error('Supabase client is not initialized');
      }
      const { data, error } = await supabase
        .from(TABLES.announcements)
        .select('*')
        .eq('is_active', true)
        .order('is_pinned', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw new Error(error.message);
      return data || [];
    },
  });
}

// 3. Reusable hook to subscribe to Realtime changes and invalidate query caches
export function useRealtimeSubscription(table: string, queryKey: string[]) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!supabase) return;

    const channel = supabase
      .channel(`realtime-channel-${table}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table },
        (payload) => {
          console.log(`Realtime update received for table ${table}:`, payload);
          // Invalidate cache immediately to refetch fresh data
          queryClient.invalidateQueries({ queryKey });
        }
      )
      .subscribe((status) => {
        console.log(`Realtime subscription status for ${table}:`, status);
      });

    return () => {
      console.log(`Unsubscribing from realtime updates for table ${table}`);
      supabase?.removeChannel(channel);
    };
  }, [table, queryKey, queryClient]);
}
