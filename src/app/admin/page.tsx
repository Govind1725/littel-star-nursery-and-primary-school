'use client';

import { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { supabase, TABLES } from '@/lib/supabase';
import { useRealtimeSubscription } from '@/lib/queries';
import styles from './admin.module.css';

import ReceiptGenerator from './ReceiptGenerator';

type Tab = 'media' | 'announcements' | 'receipts';
type MediaFilter = 'all' | 'image' | 'video';
type VisibilityFilter = 'all' | 'active' | 'inactive';

const ADMIN_PASSWORD = 'littlestarnp123';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [password, setPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  const [tab, setTab] = useState<Tab>('media');
  const queryClient = useQueryClient();

  // Search & Filter state
  const [mediaSearch, setMediaSearch] = useState('');
  const [mediaFilter, setMediaFilter] = useState<MediaFilter>('all');
  const [mediaVisibilityFilter, setMediaVisibilityFilter] = useState<VisibilityFilter>('all');

  const [annSearch, setAnnSearch] = useState('');
  const [annCategoryFilter, setAnnCategoryFilter] = useState<string>('all');
  const [annVisibilityFilter, setAnnVisibilityFilter] = useState<VisibilityFilter>('all');

  // Media form states
  const [mediaForm, setMediaForm] = useState({
    type: 'image' as 'image' | 'video',
    title: '',
    description: '',
    url: '',
    display_order: 0,
    is_active: true,
  });
  const [mediaLoading, setMediaLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const previewUrlRef = useRef('');

  // Announcement form states
  const [annForm, setAnnForm] = useState({
    title: '',
    description: '',
    category: 'general' as 'general' | 'event' | 'holiday' | 'urgent',
    is_active: true,
    is_pinned: false,
    expiry_date: '',
  });
  const [annLoading, setAnnLoading] = useState(false);

  // Modals & Editing states
  const [deleteConfirm, setDeleteConfirm] = useState<{ type: 'media' | 'ann'; item: any } | null>(null);
  
  const [editingAnn, setEditingAnn] = useState<any | null>(null);
  const [editAnnForm, setEditAnnForm] = useState({
    title: '',
    description: '',
    category: 'general' as 'general' | 'event' | 'holiday' | 'urgent',
    is_active: true,
    is_pinned: false,
    expiry_date: '',
  });

  const [editingMedia, setEditingMedia] = useState<any | null>(null);
  const [editMediaForm, setEditMediaForm] = useState({
    title: '',
    description: '',
    display_order: 0,
    is_active: true,
  });

  // Check session on mount
  useEffect(() => {
    const authed = sessionStorage.getItem('admin_authenticated') === 'true';
    setIsAuthenticated(authed);
    
    if (authed && supabase) {
      // Ensure Supabase client is signed in behind the scenes to pass RLS policy checks
      supabase.auth.getSession().then(async ({ data: { session } }) => {
        if (!session) {
          try {
            const { error } = await supabase.auth.signInWithPassword({
              email: 'admin@littlestar.com',
              password: '12345',
            });
            if (error) {
              // Try fallback password
              await supabase.auth.signInWithPassword({
                email: 'admin@littlestar.com',
                password: 'littlestar2024',
              });
            }
          } catch (err) {
            console.error('Background Supabase auth failed:', err);
          }
        }
      });
    }
    setAuthLoading(false);
  }, []);

  // Cleanup object URL previews to prevent memory leak
  useEffect(() => {
    return () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
    };
  }, []);

  function setPreviewUrlSafe(url: string) {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
    }
    previewUrlRef.current = url;
    setPreviewUrl(url);
  }

  // --- REALTIME SUBSCRIPTIONS ---
  useRealtimeSubscription(TABLES.announcements, ['admin-announcements']);
  useRealtimeSubscription(TABLES.gallery, ['admin-gallery']);

  // --- QUERY HOOKS ---
  const { data: announcements = [], isLoading: isAnnLoading } = useQuery({
    queryKey: ['admin-announcements'],
    queryFn: async () => {
      if (!supabase) return [];
      const { data, error } = await supabase
        .from(TABLES.announcements)
        .select('*')
        .order('is_pinned', { ascending: false })
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!isAuthenticated,
  });

  const { data: gallery = [], isLoading: isGalleryLoading } = useQuery({
    queryKey: ['admin-gallery'],
    queryFn: async () => {
      if (!supabase) return [];
      const { data, error } = await supabase
        .from(TABLES.gallery)
        .select('*')
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!isAuthenticated,
  });

  // --- MUTATION HOOKS (ANNOUNCEMENTS) ---
  const createAnnMutation = useMutation({
    mutationFn: async (newAnn: any) => {
      if (!supabase) throw new Error('Supabase client not initialized');
      const { data, error } = await supabase
        .from(TABLES.announcements)
        .insert([newAnn])
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-announcements'] });
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
      setAnnForm({
        title: '',
        description: '',
        category: 'general',
        is_active: true,
        is_pinned: false,
        expiry_date: '',
      });
      toast.success('Announcement published successfully!');
    },
    onError: (err: any) => {
      toast.error(`Publish failed: ${err.message}`);
    },
  });

  const updateAnnMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      if (!supabase) throw new Error('Supabase client not initialized');
      const { data, error } = await supabase
        .from(TABLES.announcements)
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-announcements'] });
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
      setEditingAnn(null);
      toast.success('Announcement updated successfully!');
    },
    onError: (err: any) => {
      toast.error(`Update failed: ${err.message}`);
    },
  });

  const deleteAnnMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!supabase) throw new Error('Supabase client not initialized');
      const { error } = await supabase
        .from(TABLES.announcements)
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-announcements'] });
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
      setDeleteConfirm(null);
      toast.success('Announcement deleted successfully!');
    },
    onError: (err: any) => {
      toast.error(`Delete failed: ${err.message}`);
    },
  });

  // --- MUTATION HOOKS (GALLERY) ---
  const createGalleryMutation = useMutation({
    mutationFn: async (newItem: any) => {
      if (!supabase) throw new Error('Supabase client not initialized');
      const { data, error } = await supabase
        .from(TABLES.gallery)
        .insert([newItem])
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-gallery'] });
      queryClient.invalidateQueries({ queryKey: ['gallery'] });
      setMediaForm({
        type: 'image',
        title: '',
        description: '',
        url: '',
        display_order: gallery.length + 1,
        is_active: true,
      });
      setPreviewUrlSafe('');
      if (fileInputRef.current) fileInputRef.current.value = '';
      toast.success('Media added successfully!');
    },
    onError: (err: any) => {
      toast.error(`Failed to add media: ${err.message}`);
    },
  });

  const updateGalleryMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      if (!supabase) throw new Error('Supabase client not initialized');
      const { data, error } = await supabase
        .from(TABLES.gallery)
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-gallery'] });
      queryClient.invalidateQueries({ queryKey: ['gallery'] });
      setEditingMedia(null);
      toast.success('Media item updated successfully!');
    },
    onError: (err: any) => {
      toast.error(`Update failed: ${err.message}`);
    },
  });

  const deleteGalleryMutation = useMutation({
    mutationFn: async (item: any) => {
      if (!supabase) throw new Error('Supabase client not initialized');
      
      // 1. Delete from database first
      const { error: dbError } = await supabase
        .from(TABLES.gallery)
        .delete()
        .eq('id', item.id);
      if (dbError) throw dbError;

      // 2. Delete file from storage if it is hosted on our Supabase bucket
      if (item.media_url && item.media_url.includes('/storage/v1/object/public/uploads/')) {
        const parts = item.media_url.split('/uploads/');
        const fileName = parts[parts.length - 1];
        if (fileName) {
          const { error: storageError } = await supabase.storage
            .from('uploads')
            .remove([fileName]);
          if (storageError) {
            console.error('Failed to clean up storage file:', storageError.message);
          }
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-gallery'] });
      queryClient.invalidateQueries({ queryKey: ['gallery'] });
      setDeleteConfirm(null);
      toast.success('Media item deleted successfully!');
    },
    onError: (err: any) => {
      toast.error(`Delete failed: ${err.message}`);
    },
  });

  // --- AUTH HANDLERS ---
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginLoading(true);
    setAuthError('');

    if (password === ADMIN_PASSWORD) {
      if (supabase) {
        try {
          // Sign in to Supabase Auth behind the scenes to pass RLS checking
          let { error } = await supabase.auth.signInWithPassword({
            email: 'admin@littlestar.com',
            password: '12345',
          });
          
          if (error) {
            console.warn("Supabase auth failed with '12345', trying 'littlestar2024'...");
            const fallbackRes = await supabase.auth.signInWithPassword({
              email: 'admin@littlestar.com',
              password: 'littlestar2024',
            });
            error = fallbackRes.error;
          }
          
          if (error) {
            console.error('Supabase RLS Auth failed:', error.message);
            toast.error(`Database session failed: ${error.message}. Writes may be restricted.`);
          }
        } catch (err: any) {
          console.error('Supabase RLS Auth error:', err);
        }
      }
      
      sessionStorage.setItem('admin_authenticated', 'true');
      setIsAuthenticated(true);
      toast.success('Admin login successful!');
    } else {
      setAuthError('Incorrect password. Please try again.');
      toast.error('Incorrect password. Please try again.');
    }

    setLoginLoading(false);
  }

  async function handleLogout() {
    sessionStorage.removeItem('admin_authenticated');
    setIsAuthenticated(false);
    if (supabase) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.error('Supabase sign out error:', err);
      }
    }
    toast.success('Logged out successfully');
  }

  // --- FILE COMPRESSION & UPLOAD ---
  async function compressImage(file: File, maxW = 1200): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        URL.revokeObjectURL(img.src);
        const canvas = document.createElement('canvas');
        let { width, height } = img;
        if (width > maxW) {
          height = Math.round((height * maxW) / width);
          width = maxW;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (b) => {
            if (b) resolve(b);
            else reject(new Error('Image compression failed'));
          },
          'image/webp',
          0.8
        );
      };
      img.onerror = () => {
        URL.revokeObjectURL(img.src);
        reject(new Error('Failed to load image for compression'));
      };
      img.src = URL.createObjectURL(file);
    });
  }

  async function uploadToSupabase(file: File, type: 'image' | 'video'): Promise<string> {
    if (!supabase) throw new Error('Supabase client is not initialized');

    // 1. File Type Validation
    const allowedImages = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'];
    const allowedVideos = ['video/mp4', 'video/webm', 'video/quicktime']; // quicktime is MOV

    if (type === 'image' && !allowedImages.includes(file.type)) {
      throw new Error('Unsupported image format. Upload JPEG, PNG, WEBP, GIF, or AVIF.');
    }
    if (type === 'video' && !allowedVideos.includes(file.type)) {
      throw new Error('Unsupported video format. Upload MP4, WEBM, or MOV.');
    }

    // 2. File Size Validation (Image: 10MB, Video: 200MB)
    const maxBytes = type === 'image' ? 10 * 1024 * 1024 : 200 * 1024 * 1024;
    if (file.size > maxBytes) {
      const sizeStr = type === 'image' ? '10MB' : '200MB';
      throw new Error(`File exceeds maximum size limit of ${sizeStr}`);
    }

    // 3. Optimize image if applicable
    let fileToUpload = file;
    let extension = file.name.split('.').pop() || (type === 'image' ? 'webp' : 'mp4');

    if (type === 'image') {
      try {
        setUploadProgress(5);
        const compressedBlob = await compressImage(file);
        fileToUpload = new File([compressedBlob], file.name.replace(/\.[^/.]+$/, '') + '.webp', {
          type: 'image/webp',
        });
        extension = 'webp';
      } catch (compErr) {
        console.warn('Image compression failed, uploading original:', compErr);
      }
    }

    // 4. Generate unique name
    const uniqueName = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}.${extension}`;

    // 5. Upload File
    setUploadProgress(20);
    const { data, error } = await supabase.storage
      .from('uploads')
      .upload(uniqueName, fileToUpload, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) throw error;
    setUploadProgress(80);

    // 6. Get Public URL
    const { data: { publicUrl } } = supabase.storage
      .from('uploads')
      .getPublicUrl(uniqueName);

    setUploadProgress(100);
    setTimeout(() => setUploadProgress(null), 800);

    return publicUrl;
  }

  // --- CRUD ACTIONS ---
  async function handleAddMedia(e: React.FormEvent) {
    e.preventDefault();
    if (!mediaForm.title.trim()) {
      toast.error('Title is required');
      return;
    }

    const fileInput = fileInputRef.current;
    const file = fileInput?.files?.[0];

    if (!file) {
      toast.error('Please select a file to upload');
      return;
    }

    setMediaLoading(true);
    try {
      const finalUrl = await uploadToSupabase(file, mediaForm.type);

      // Prepare thumbnail URL (for videos)
      let thumbnailUrl = '';
      if (mediaForm.type === 'video') {
        thumbnailUrl = finalUrl; // HTML5 video can play directly
      }

      createGalleryMutation.mutate({
        title: mediaForm.title.trim(),
        description: mediaForm.description.trim(),
        media_type: mediaForm.type,
        media_url: finalUrl,
        thumbnail_url: thumbnailUrl,
        is_active: true, // Always make visible on live website
        display_order: 0, // Default display order
      });
    } catch (err: any) {
      toast.error(err.message || 'An error occurred during media creation');
    } finally {
      setMediaLoading(false);
    }
  }

  async function handleAddAnnouncement(e: React.FormEvent) {
    e.preventDefault();
    if (!annForm.title.trim() || !annForm.description.trim()) {
      toast.error('Title and content details are required');
      return;
    }

    setAnnLoading(true);
    try {
      createAnnMutation.mutate({
        title: annForm.title.trim(),
        description: annForm.description.trim(),
        category: annForm.category,
        is_active: annForm.is_active,
        is_pinned: annForm.is_pinned,
        expiry_date: annForm.expiry_date || null,
      });
    } catch (err: any) {
      toast.error(err.message || 'Failed to submit announcement');
    } finally {
      setAnnLoading(false);
    }
  }

  // --- EDIT MODAL LAUNCHERS ---
  function openEditAnnModal(ann: any) {
    setEditingAnn(ann);
    setEditAnnForm({
      title: ann.title,
      description: ann.description,
      category: ann.category,
      is_active: ann.is_active,
      is_pinned: ann.is_pinned,
      expiry_date: ann.expiry_date || '',
    });
  }

  function handleSaveAnnEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editingAnn) return;

    if (!editAnnForm.title.trim() || !editAnnForm.description.trim()) {
      toast.error('Title and content are required');
      return;
    }

    setAnnLoading(true);
    try {
      updateAnnMutation.mutate({
        id: editingAnn.id,
        updates: {
          title: editAnnForm.title.trim(),
          description: editAnnForm.description.trim(),
          category: editAnnForm.category,
          is_active: editAnnForm.is_active,
          is_pinned: editAnnForm.is_pinned,
          expiry_date: editAnnForm.expiry_date || null,
          updated_at: new Date().toISOString(),
        },
      });
    } catch (err: any) {
      toast.error(err.message || 'Update failed');
    } finally {
      setAnnLoading(false);
    }
  }

  function openEditMediaModal(item: any) {
    setEditingMedia(item);
    setEditMediaForm({
      title: item.title,
      description: item.description || '',
      display_order: item.display_order || 0,
      is_active: item.is_active,
    });
  }

  function handleSaveMediaEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editingMedia) return;

    if (!editMediaForm.title.trim()) {
      toast.error('Title is required');
      return;
    }

    setMediaLoading(true);
    try {
      updateGalleryMutation.mutate({
        id: editingMedia.id,
        updates: {
          title: editMediaForm.title.trim(),
          description: editMediaForm.description.trim(),
          display_order: Number(editMediaForm.display_order) || 0,
          is_active: editMediaForm.is_active,
          updated_at: new Date().toISOString(),
        },
      });
    } catch (err: any) {
      toast.error(err.message || 'Update failed');
    } finally {
      setMediaLoading(false);
    }
  }

  // --- ADMIN SEARCH & FILTER LOGIC ---
  const filteredGallery = gallery.filter((item: any) => {
    const matchesSearch =
      item.title.toLowerCase().includes(mediaSearch.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(mediaSearch.toLowerCase()));
    const matchesType = mediaFilter === 'all' || item.media_type === mediaFilter;
    
    let matchesVisibility = true;
    if (mediaVisibilityFilter === 'active') matchesVisibility = item.is_active;
    if (mediaVisibilityFilter === 'inactive') matchesVisibility = !item.is_active;

    return matchesSearch && matchesType && matchesVisibility;
  });

  const filteredAnnouncements = announcements.filter((ann: any) => {
    const matchesSearch =
      ann.title.toLowerCase().includes(annSearch.toLowerCase()) ||
      ann.description.toLowerCase().includes(annSearch.toLowerCase());
    const matchesCategory = annCategoryFilter === 'all' || ann.category === annCategoryFilter;

    let matchesVisibility = true;
    if (annVisibilityFilter === 'active') matchesVisibility = ann.is_active;
    if (annVisibilityFilter === 'inactive') matchesVisibility = !ann.is_active;

    return matchesSearch && matchesCategory && matchesVisibility;
  });

  const categoryConfig = {
    general: { label: 'General Notice', color: '#7C3AED' },
    event: { label: 'Event', color: '#059669' },
    holiday: { label: 'Holiday', color: '#D97706' },
    urgent: { label: 'Urgent', color: '#DC2626' },
  };

  // --- LOADING / SECURING SCREENS ---
  if (authLoading) {
    return (
      <div className={styles.loginPage}>
        <div className={styles.loginBox}>
          <div className={styles.spinner} style={{ margin: '20px auto' }} />
          <p style={{ textAlign: 'center', color: 'var(--gray-600)' }}>Initializing Admin CMS...</p>
        </div>
      </div>
    );
  }

  // LOGIN SCREEN
  if (!isAuthenticated) {
    return (
      <div className={styles.loginPage}>
        <div className={styles.loginBox}>
          <div className={styles.loginLogo}></div>
          <h1 className={styles.loginTitle}>Admin Portal Login</h1>
          <p className={styles.loginSub}>Little Star School CMS Dashboard</p>
          
          <form onSubmit={handleLogin} className={styles.loginForm} style={{ marginTop: '20px' }}>
            <div className={styles.loginGroup}>
              <label htmlFor="admin-password">Password</label>
              <input
                id="admin-password"
                type="password"
                placeholder="Enter admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles.loginInput}
                autoFocus
              />
            </div>
            <button
              type="submit"
              className={`btn-primary ${styles.loginBtn}`}
              id="admin-login-btn"
              disabled={loginLoading}
              style={{ width: '100%', padding: '12px', fontSize: '1rem' }}
            >
              {loginLoading ? 'Authenticating...' : 'Access Admin Dashboard'}
            </button>
          </form>

          {authError && (
            <div className={styles.authError} style={{ color: '#DC2626', marginTop: '12px', fontSize: '0.85rem', fontWeight: '500', textAlign: 'center' }}>
              ⚠️ {authError}
            </div>
          )}
        </div>
      </div>
    );
  }

  // MAIN DASHBOARD SCREEN
  return (
    <div className={styles.adminPage}>
      {/* Admin Header */}
      <div className={styles.adminHeader}>
        <div className="container">
          <div className={styles.adminHeaderInner}>
            <div className={styles.adminBrand}>
              <div className={styles.adminLogoIcon}></div>
              <div>
                <div className={styles.adminLogoTitle}>Admin Dashboard</div>
                <div className={styles.adminLogoSub}>Little Star Nursery & Primary School</div>
              </div>
            </div>
            <div className={styles.adminHeaderRight}>
              <div className={styles.adminBadge}>Active CMS Session</div>
              <button
                className={`btn-outline ${styles.logoutBtn}`}
                onClick={handleLogout}
                id="admin-logout-btn"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className={`container ${styles.adminContent}`}>
        {/* Stats Summary Panel */}
        <div className={styles.statsRow}>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>🖼️</div>
            <div className={styles.statNum}>{gallery.filter((m: any) => m.media_type === 'image').length}</div>
            <div className={styles.statLabel}>Photos</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>🎬</div>
            <div className={styles.statNum}>{gallery.filter((m: any) => m.media_type === 'video').length}</div>
            <div className={styles.statLabel}>Videos</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>📢</div>
            <div className={styles.statNum}>{announcements.length}</div>
            <div className={styles.statLabel}>Announcements</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>⚡</div>
            <div className={styles.statNum}>{gallery.filter((m: any) => m.is_active).length + announcements.filter((a: any) => a.is_active).length}</div>
            <div className={styles.statLabel}>Active Items</div>
          </div>
        </div>

        {/* Tab Controls */}
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${tab === 'media' ? styles.tabActive : ''}`}
            onClick={() => setTab('media')}
            id="admin-tab-media"
          >
            Gallery Management
          </button>
          <button
            className={`${styles.tab} ${tab === 'announcements' ? styles.tabActive : ''}`}
            onClick={() => setTab('announcements')}
            id="admin-tab-announcements"
          >
            Announcements
          </button>
          <button
            className={`${styles.tab} ${tab === 'receipts' ? styles.tabActive : ''}`}
            onClick={() => setTab('receipts')}
            id="admin-tab-receipts"
          >
            Receipt Generator
          </button>
        </div>

        {/* ===== GALLERY TAB CONTENTS ===== */}
        {tab === 'media' && (
          <div className={styles.tabContent}>
            {/* Create Media Item Panel */}
            <div className={styles.panel}>
              <h2 className={styles.panelTitle}>Upload New Media</h2>
              <form onSubmit={handleAddMedia} className={styles.mediaForm} autoComplete="off">
                <div className={styles.typeToggle}>
                  <button
                    type="button"
                    className={`${styles.typeBtn} ${mediaForm.type === 'image' ? styles.typeBtnActive : ''}`}
                    onClick={() => setMediaForm((p) => ({ ...p, type: 'image' }))}
                    id="media-type-image"
                  >
                    Image Upload
                  </button>
                  <button
                    type="button"
                    className={`${styles.typeBtn} ${mediaForm.type === 'video' ? styles.typeBtnActive : ''}`}
                    onClick={() => setMediaForm((p) => ({ ...p, type: 'video' }))}
                    id="media-type-video"
                  >
                    Video Upload
                  </button>
                </div>

                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label htmlFor="media-title">Title *</label>
                    <input
                      id="media-title"
                      type="text"
                      placeholder={`Provide a title for the ${mediaForm.type}`}
                      value={mediaForm.title}
                      onChange={(e) => setMediaForm((p) => ({ ...p, title: e.target.value }))}
                      className={styles.input}
                      autoComplete="off"
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="media-file">
                      File Selection ({mediaForm.type === 'image' ? 'JPG/PNG/WEBP, max 10MB' : 'MP4/MOV, max 200MB'})
                    </label>
                    <input
                      id="media-file"
                      ref={fileInputRef}
                      type="file"
                      accept={mediaForm.type === 'image' ? 'image/*' : 'video/*'}
                      className={styles.fileInput}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setPreviewUrlSafe(URL.createObjectURL(file));
                          setMediaForm((p) => ({ ...p, url: '' }));
                        }
                      }}
                    />
                  </div>

                  <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                    <label htmlFor="media-desc">Brief Description (optional)</label>
                    <input
                      id="media-desc"
                      type="text"
                      placeholder="Enter a descriptive caption"
                      value={mediaForm.description}
                      onChange={(e) => setMediaForm((p) => ({ ...p, description: e.target.value }))}
                      className={styles.input}
                      autoComplete="off"
                    />
                  </div>
                </div>

                {uploadProgress !== null && (
                  <div style={{ margin: '15px 0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '0.85rem' }}>
                      <span>Uploading resource...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div style={{ width: '100%', height: '8px', background: 'var(--gray-200)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: `${uploadProgress}%`, height: '100%', background: 'var(--violet)', transition: 'width 0.2s' }} />
                    </div>
                  </div>
                )}

                {previewUrl && (
                  <div className={styles.filePreview} style={{ marginTop: '15px' }}>
                    {mediaForm.type === 'image' ? (
                      <img src={previewUrl} alt="Upload Preview" style={{ maxHeight: '200px', borderRadius: '8px' }} />
                    ) : (
                      <video src={previewUrl} controls style={{ maxHeight: '200px', borderRadius: '8px' }} />
                    )}
                  </div>
                )}

                <button
                  type="submit"
                  className="btn-primary"
                  disabled={mediaLoading}
                  style={{ marginTop: '15px' }}
                  id="admin-add-media-btn"
                >
                  {mediaLoading ? 'Processing file...' : `Add New ${mediaForm.type === 'image' ? 'Image' : 'Video'}`}
                </button>
              </form>
            </div>

            {/* Gallery Search, Filter, and Grid */}
            <div className={styles.panel}>
              <div className={styles.panelHeader} style={{ flexWrap: 'wrap', gap: '15px' }}>
                <h2 className={styles.panelTitle} style={{ margin: 0 }}>Gallery Library ({filteredGallery.length})</h2>
                
                {/* Search & Filters */}
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <input
                    type="text"
                    placeholder="Search gallery..."
                    value={mediaSearch}
                    onChange={(e) => setMediaSearch(e.target.value)}
                    className={styles.input}
                    style={{ width: '200px', padding: '6px 12px', fontSize: '0.85rem' }}
                  />

                  <select
                    value={mediaFilter}
                    onChange={(e) => setMediaFilter(e.target.value as MediaFilter)}
                    className={styles.input}
                    style={{ width: '120px', padding: '6px 12px', fontSize: '0.85rem' }}
                  >
                    <option value="all">All Media</option>
                    <option value="image">Images</option>
                    <option value="video">Videos</option>
                  </select>

                  <select
                    value={mediaVisibilityFilter}
                    onChange={(e) => setMediaVisibilityFilter(e.target.value as VisibilityFilter)}
                    className={styles.input}
                    style={{ width: '120px', padding: '6px 12px', fontSize: '0.85rem' }}
                  >
                    <option value="all">All Visibility</option>
                    <option value="active">Visible Only</option>
                    <option value="inactive">Hidden Only</option>
                  </select>
                </div>
              </div>

              {isGalleryLoading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 0' }}>
                  <div className={styles.spinner} />
                </div>
              ) : filteredGallery.length === 0 ? (
                <div className={styles.emptyState}>
                  <p>No gallery items matched the criteria.</p>
                </div>
              ) : (
                <div className={styles.mediaGrid}>
                  {filteredGallery.map((item: any) => (
                    <div key={item.id} className={styles.mediaItem} style={{ border: !item.is_active ? '2px dashed var(--gray-300)' : 'none', opacity: !item.is_active ? 0.75 : 1 }}>
                      <div className={styles.mediaItemThumb}>
                        {item.media_url ? (
                          item.media_type === 'image' ? (
                            <img src={item.media_url} alt={item.title} className={styles.thumbImg} />
                          ) : (
                            <video src={item.media_url} className={styles.thumbImg} />
                          )
                        ) : (
                          <span>{item.media_type === 'image' ? '🖼️' : '🎬'}</span>
                        )}
                        {!item.is_active && (
                          <div style={{ position: 'absolute', top: '8px', left: '8px', background: 'rgba(239, 68, 68, 0.9)', color: '#fff', fontSize: '0.65rem', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>
                            HIDDEN
                          </div>
                        )}
                        <div style={{ position: 'absolute', top: '8px', right: '8px', background: 'rgba(124, 58, 237, 0.9)', color: '#fff', fontSize: '0.65rem', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>
                          Seq: {item.display_order}
                        </div>
                      </div>
                      <div className={styles.mediaItemInfo}>
                        <div className={styles.mediaItemTitle}>{item.title}</div>
                        <div className={styles.mediaItemMeta}>
                          <span className={styles.mediaItemType}>{item.media_type.toUpperCase()}</span>
                          <span>{new Date(item.created_at).toLocaleDateString()}</span>
                        </div>
                        {item.description && <div className={styles.mediaItemDesc}>{item.description}</div>}
                      </div>

                      <div style={{ display: 'flex', gap: '8px', padding: '0 12px 12px 12px' }}>
                        <button
                          className={styles.editBtn}
                          onClick={() => openEditMediaModal(item)}
                          style={{ flex: 1, padding: '6px', fontSize: '0.8rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                          title="Edit Info"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          className={styles.deleteBtn}
                          onClick={() => setDeleteConfirm({ type: 'media', item })}
                          id={`admin-delete-media-${item.id}`}
                          style={{ flex: 1, padding: '6px', fontSize: '0.8rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                          title="Delete Item"
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ===== ANNOUNCEMENTS TAB CONTENTS ===== */}
        {tab === 'announcements' && (
          <div className={styles.tabContent}>
            {/* Create Announcement Panel */}
            <div className={styles.panel}>
              <h2 className={styles.panelTitle}>Publish New Announcement</h2>
              <form onSubmit={handleAddAnnouncement} className={styles.annForm} autoComplete="off">
                <div className={styles.formGrid}>
                  <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                    <label htmlFor="ann-title">Title *</label>
                    <input
                      id="ann-title"
                      type="text"
                      placeholder="Enter announcement heading"
                      value={annForm.title}
                      onChange={(e) => setAnnForm((p) => ({ ...p, title: e.target.value }))}
                      className={styles.input}
                      autoComplete="off"
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="ann-category">Category Notice Type *</label>
                    <select
                      id="ann-category"
                      value={annForm.category}
                      onChange={(e) => setAnnForm((p) => ({ ...p, category: e.target.value as any }))}
                      className={styles.input}
                    >
                      <option value="general">📢 General Notice</option>
                      <option value="event">🎉 Special Event</option>
                      <option value="holiday">🏖️ Holiday Declaration</option>
                      <option value="urgent">🚨 Urgent Bulletin</option>
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="ann-expiry">Expiry Date (optional)</label>
                    <input
                      id="ann-expiry"
                      type="date"
                      value={annForm.expiry_date}
                      onChange={(e) => setAnnForm((p) => ({ ...p, expiry_date: e.target.value }))}
                      className={styles.input}
                    />
                  </div>

                  <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                    <label htmlFor="ann-desc">Description Details *</label>
                    <textarea
                      id="ann-desc"
                      placeholder="Provide complete announcement content here..."
                      value={annForm.description}
                      onChange={(e) => setAnnForm((p) => ({ ...p, description: e.target.value }))}
                      className={`${styles.input} ${styles.textarea}`}
                      rows={4}
                      required
                    />
                  </div>

                  <div className={styles.formGroup} style={{ display: 'flex', gap: '15px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={annForm.is_pinned}
                        onChange={(e) => setAnnForm((p) => ({ ...p, is_pinned: e.target.checked }))}
                      />
                      Pin at top
                    </label>

                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={annForm.is_active}
                        onChange={(e) => setAnnForm((p) => ({ ...p, is_active: e.target.checked }))}
                      />
                      Active (Live)
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn-primary"
                  disabled={annLoading}
                  style={{ marginTop: '15px' }}
                  id="admin-publish-ann-btn"
                >
                  {annLoading ? 'Publishing...' : 'Publish Announcement'}
                </button>
              </form>
            </div>

            {/* Announcements Search, Filter, and List */}
            <div className={styles.panel}>
              <div className={styles.panelHeader} style={{ flexWrap: 'wrap', gap: '15px' }}>
                <h2 className={styles.panelTitle} style={{ margin: 0 }}>All Announcements ({filteredAnnouncements.length})</h2>
                
                {/* Search & Filters */}
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <input
                    type="text"
                    placeholder="Search announcements..."
                    value={annSearch}
                    onChange={(e) => setAnnSearch(e.target.value)}
                    className={styles.input}
                    style={{ width: '200px', padding: '6px 12px', fontSize: '0.85rem' }}
                  />

                  <select
                    value={annCategoryFilter}
                    onChange={(e) => setAnnCategoryFilter(e.target.value)}
                    className={styles.input}
                    style={{ width: '120px', padding: '6px 12px', fontSize: '0.85rem' }}
                  >
                    <option value="all">All Types</option>
                    <option value="general">General</option>
                    <option value="event">Event</option>
                    <option value="holiday">Holiday</option>
                    <option value="urgent">Urgent</option>
                  </select>

                  <select
                    value={annVisibilityFilter}
                    onChange={(e) => setAnnVisibilityFilter(e.target.value as VisibilityFilter)}
                    className={styles.input}
                    style={{ width: '120px', padding: '6px 12px', fontSize: '0.85rem' }}
                  >
                    <option value="all">All Statuses</option>
                    <option value="active">Active Only</option>
                    <option value="inactive">Inactive Only</option>
                  </select>
                </div>
              </div>

              {isAnnLoading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 0' }}>
                  <div className={styles.spinner} />
                </div>
              ) : filteredAnnouncements.length === 0 ? (
                <div className={styles.emptyState}>
                  <p>No announcements found matching the criteria.</p>
                </div>
              ) : (
                <div className={styles.annList}>
                  {filteredAnnouncements.map((ann: any) => {
                    const cfg = categoryConfig[ann.category as keyof typeof categoryConfig] || categoryConfig.general;
                    return (
                      <div
                        key={ann.id}
                        className={styles.annItem}
                        style={{
                          borderLeft: `5px solid ${cfg.color}`,
                          opacity: !ann.is_active ? 0.75 : 1,
                          borderStyle: !ann.is_active ? 'dashed' : 'solid',
                        }}
                      >
                        <div className={styles.annItemBody}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                            <div className={styles.annItemTitle}>
                              {ann.is_pinned && <span style={{ marginRight: '6px', fontSize: '1rem' }}>📌</span>}
                              {ann.title}
                            </div>
                            
                            {!ann.is_active && (
                              <span style={{ background: '#ef4444', color: '#fff', fontSize: '0.65rem', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>
                                HIDDEN (DRAFT)
                              </span>
                            )}
                          </div>
                          
                          <div className={styles.annItemMeta}>
                            <span className={styles.annCat} style={{ color: cfg.color }}>{cfg.label}</span>
                            <span>Created: {new Date(ann.created_at).toLocaleDateString()}</span>
                            {ann.expiry_date && (
                              <span style={{ color: '#ef4444' }}>Expires: {new Date(ann.expiry_date).toLocaleDateString()}</span>
                            )}
                          </div>
                          <p className={styles.annItemContent}>{ann.description}</p>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          <button
                            className={styles.editBtn}
                            onClick={() => openEditAnnModal(ann)}
                            id={`admin-edit-ann-${ann.id}`}
                            title="Edit Details"
                            style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                          >
                            ✏️ Edit
                          </button>
                          <button
                            className={styles.deleteBtn}
                            onClick={() => setDeleteConfirm({ type: 'ann', item: ann })}
                            id={`admin-delete-ann-${ann.id}`}
                            title="Delete Announcement"
                            style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ===== RECEIPTS TAB CONTENTS ===== */}
        {tab === 'receipts' && <ReceiptGenerator />}
      </div>

      {/* --- EDIT ANNOUNCEMENT MODAL --- */}
      {editingAnn && (
        <div className={styles.modal} onClick={() => setEditingAnn(null)}>
          <div className={styles.modalBox} onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
            <h3 style={{ borderBottom: '1px solid var(--gray-200)', paddingBottom: '10px', marginBottom: '15px' }}>
              Edit Announcement
            </h3>
            <form onSubmit={handleSaveAnnEdit} className={styles.annForm}>
              <div className={styles.formGrid}>
                <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                  <label htmlFor="edit-ann-title">Title *</label>
                  <input
                    id="edit-ann-title"
                    type="text"
                    value={editAnnForm.title}
                    onChange={(e) => setEditAnnForm((p) => ({ ...p, title: e.target.value }))}
                    className={styles.input}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="edit-ann-category">Category *</label>
                  <select
                    id="edit-ann-category"
                    value={editAnnForm.category}
                    onChange={(e) => setEditAnnForm((p) => ({ ...p, category: e.target.value as any }))}
                    className={styles.input}
                  >
                    <option value="general">General Notice</option>
                    <option value="event">Special Event</option>
                    <option value="holiday">Holiday Declaration</option>
                    <option value="urgent">Urgent Bulletin</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="edit-ann-expiry">Expiry Date</label>
                  <input
                    id="edit-ann-expiry"
                    type="date"
                    value={editAnnForm.expiry_date}
                    onChange={(e) => setEditAnnForm((p) => ({ ...p, expiry_date: e.target.value }))}
                    className={styles.input}
                  />
                </div>
                <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                  <label htmlFor="edit-ann-content">Details Content *</label>
                  <textarea
                    id="edit-ann-content"
                    value={editAnnForm.description}
                    onChange={(e) => setEditAnnForm((p) => ({ ...p, description: e.target.value }))}
                    className={`${styles.input} ${styles.textarea}`}
                    rows={4}
                    required
                  />
                </div>
                <div className={styles.formGroup} style={{ display: 'flex', gap: '15px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={editAnnForm.is_pinned}
                      onChange={(e) => setEditAnnForm((p) => ({ ...p, is_pinned: e.target.checked }))}
                    />
                    Pin at top
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={editAnnForm.is_active}
                      onChange={(e) => setEditAnnForm((p) => ({ ...p, is_active: e.target.checked }))}
                    />
                    Active (Live)
                  </label>
                </div>
              </div>
              
              <div className={styles.modalBtns} style={{ marginTop: '20px' }}>
                <button
                  type="button"
                  className={styles.cancelBtn}
                  onClick={() => setEditingAnn(null)}
                  id="admin-edit-cancel-btn"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={annLoading}
                  id="admin-edit-save-btn"
                >
                  {annLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- EDIT GALLERY ITEM MODAL --- */}
      {editingMedia && (
        <div className={styles.modal} onClick={() => setEditingMedia(null)}>
          <div className={styles.modalBox} onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
            <h3 style={{ borderBottom: '1px solid var(--gray-200)', paddingBottom: '10px', marginBottom: '15px' }}>
              Edit Gallery Item Details
            </h3>
            <form onSubmit={handleSaveMediaEdit} className={styles.mediaForm}>
              <div className={styles.formGrid}>
                <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                  <label htmlFor="edit-media-title">Title *</label>
                  <input
                    id="edit-media-title"
                    type="text"
                    value={editMediaForm.title}
                    onChange={(e) => setEditMediaForm((p) => ({ ...p, title: e.target.value }))}
                    className={styles.input}
                    required
                  />
                </div>

                <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                  <label htmlFor="edit-media-desc">Description (optional)</label>
                  <input
                    id="edit-media-desc"
                    type="text"
                    value={editMediaForm.description}
                    onChange={(e) => setEditMediaForm((p) => ({ ...p, description: e.target.value }))}
                    className={styles.input}
                  />
                </div>
              </div>

              <div className={styles.modalBtns} style={{ marginTop: '20px' }}>
                <button
                  type="button"
                  className={styles.cancelBtn}
                  onClick={() => setEditingMedia(null)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={mediaLoading}
                >
                  {mediaLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- DELETE CONFIRMATION MODAL --- */}
      {deleteConfirm && (
        <div className={styles.modal} onClick={() => setDeleteConfirm(null)}>
          <div className={styles.modalBox} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalIcon} style={{ fontSize: '2rem', textAlign: 'center', marginBottom: '10px' }}>⚠️</div>
            <h3 style={{ textAlign: 'center', marginBottom: '10px' }}>Confirm Permanent Deletion</h3>
            <p style={{ textAlign: 'center', color: 'var(--gray-600)', fontSize: '0.9rem', marginBottom: '20px' }}>
              Are you sure you want to delete &quot;{deleteConfirm.item.title}&quot;?
              This action is permanent and cannot be undone. All associated files will be removed.
            </p>
            <div className={styles.modalBtns} style={{ justifyContent: 'center', gap: '15px' }}>
              <button
                className={styles.cancelBtn}
                onClick={() => setDeleteConfirm(null)}
                id="admin-delete-cancel-btn"
              >
                Cancel
              </button>
              <button
                className={styles.confirmDeleteBtn}
                onClick={() => {
                  if (deleteConfirm.type === 'media') {
                    deleteGalleryMutation.mutate(deleteConfirm.item);
                  } else {
                    deleteAnnMutation.mutate(deleteConfirm.item.id);
                  }
                }}
                id="admin-delete-confirm-btn"
                style={{ background: '#ef4444', color: '#fff' }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
