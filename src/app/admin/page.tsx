'use client';

import { useState, useEffect, useRef } from 'react';
import {
  getMediaItems, addMediaItem, deleteMediaItem,
  getAnnouncements, addAnnouncement, deleteAnnouncement,
  type MediaItem, type Announcement,
} from '@/lib/store';
import styles from './admin.module.css';

import ReceiptGenerator from './ReceiptGenerator';

const ADMIN_PASSWORD = 'littlestar2024';

type Tab = 'media' | 'announcements' | 'receipts';
type MediaFilter = 'all' | 'image' | 'video';

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [tab, setTab] = useState<Tab>('media');

  // Media state
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [mediaFilter, setMediaFilter] = useState<MediaFilter>('all');
  const [mediaForm, setMediaForm] = useState({ type: 'image' as 'image' | 'video', title: '', description: '', url: '' });
  const [mediaLoading, setMediaLoading] = useState(false);
  const [mediaSuccess, setMediaSuccess] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState('');

  // Announcement state
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [annForm, setAnnForm] = useState({ title: '', content: '', category: 'general' as Announcement['category'], date: '' });
  const [annLoading, setAnnLoading] = useState(false);
  const [annSuccess, setAnnSuccess] = useState('');

  const [deleteConfirm, setDeleteConfirm] = useState<{ type: 'media' | 'ann'; id: string } | null>(null);

  useEffect(() => {
    const saved = sessionStorage.getItem('lsn_admin_auth');
    if (saved === 'true') {
      setAuthed(true);
      loadData();
    }
  }, []);

  function loadData() {
    setMedia(getMediaItems());
    setAnnouncements(getAnnouncements());
  }

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setAuthed(true);
      sessionStorage.setItem('lsn_admin_auth', 'true');
      loadData();
      setAuthError('');
    } else {
      setAuthError('Incorrect password. Please try again.');
    }
  }

  function handleLogout() {
    setAuthed(false);
    sessionStorage.removeItem('lsn_admin_auth');
    setPassword('');
  }

  // Media handlers
  async function compressImage(file: File, maxW = 1200): Promise<Blob> {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;
        if (width > maxW) { height = Math.round(height * maxW / width); width = maxW; }
        canvas.width = width; canvas.height = height;
        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(b => resolve(b!), 'image/webp', 0.8);
      };
      img.src = URL.createObjectURL(file);
    });
  }

  async function handleAddMedia(e: React.FormEvent) {
    e.preventDefault();
    if (!mediaForm.title.trim()) return;
    setMediaLoading(true);

    let finalUrl = mediaForm.url;
    const fileInput = fileInputRef.current;

    if (finalUrl.startsWith('/uploads/')) {
      // Already imported via Drive — use as-is
    } else if (fileInput?.files?.[0] && !finalUrl.startsWith('data:')) {
      const file = fileInput.files[0];
      const uploadFile = mediaForm.type === 'image' ? await compressImage(file) : file;
      const fd = new FormData();
      fd.append('file', uploadFile, file.name);
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (data.url) finalUrl = data.url;
    } else if (finalUrl.startsWith('data:')) {
      finalUrl = mediaForm.url;
    }

    addMediaItem({ type: mediaForm.type, title: mediaForm.title, description: mediaForm.description, url: finalUrl });
    setMedia(getMediaItems());
    setMediaForm({ type: 'image', title: '', description: '', url: '' });
    setPreviewUrl('');
    if (fileInputRef.current) fileInputRef.current.value = '';
    setMediaSuccess('Media added successfully!');
    setMediaLoading(false);
    setTimeout(() => setMediaSuccess(''), 3000);
  }

  function handleDeleteMedia(id: string) {
    deleteMediaItem(id);
    setMedia(getMediaItems());
    setDeleteConfirm(null);
  }

  // Announcement handlers
  async function handleAddAnnouncement(e: React.FormEvent) {
    e.preventDefault();
    if (!annForm.title.trim() || !annForm.content.trim()) return;
    setAnnLoading(true);
    await new Promise(r => setTimeout(r, 600));
    addAnnouncement({
      title: annForm.title,
      content: annForm.content,
      category: annForm.category,
      date: annForm.date || new Date().toISOString().split('T')[0],
    });
    setAnnouncements(getAnnouncements());
    setAnnForm({ title: '', content: '', category: 'general', date: '' });
    setAnnSuccess('Announcement published!');
    setAnnLoading(false);
    setTimeout(() => setAnnSuccess(''), 3000);
  }

  function handleDeleteAnnouncement(id: string) {
    deleteAnnouncement(id);
    setAnnouncements(getAnnouncements());
    setDeleteConfirm(null);
  }

  const filteredMedia = mediaFilter === 'all' ? media : media.filter(m => m.type === mediaFilter);

  const categoryConfig = {
    general: { label: 'General', color: '#7C3AED' },
    event: { label: 'Event', color: '#059669' },
    holiday: { label: 'Holiday', color: '#D97706' },
    urgent: { label: 'Urgent', color: '#DC2626' },
  };

  // ===== LOGIN SCREEN =====
  if (!authed) {
    return (
      <div className={styles.loginPage}>
        <div className={styles.loginBox}>
          <div className={styles.loginLogo}></div>
          <h1 className={styles.loginTitle}>Admin Login</h1>
          <p className={styles.loginSub}>Little Star Nursery & Primary School</p>
          <form onSubmit={handleLogin} className={styles.loginForm}>
            <div className={styles.loginGroup}>
              <label htmlFor="admin-password">Password</label>
              <input
                id="admin-password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className={styles.loginInput}
                required
                autoFocus
              />
            </div>
            {authError && <div className={styles.authError}>{authError}</div>}
            <button type="submit" className={`btn-primary ${styles.loginBtn}`} id="admin-login-btn">
              Login
            </button>
          </form>
          <p className={styles.loginHint}>Demo password: <code>littlestar2024</code></p>
        </div>
      </div>
    );
  }

  // ===== ADMIN DASHBOARD =====
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
              <div className={styles.adminBadge}>Administrator</div>
              <button className={`btn-outline ${styles.logoutBtn}`} onClick={handleLogout} id="admin-logout-btn">
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className={`container ${styles.adminContent}`}>
        {/* Stats */}
        <div className={styles.statsRow}>
          <div className={styles.statCard}>
            <div className={styles.statIcon}></div>
            <div className={styles.statNum}>{media.filter(m => m.type === 'image').length}</div>
            <div className={styles.statLabel}>Photos</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIcon}></div>
            <div className={styles.statNum}>{media.filter(m => m.type === 'video').length}</div>
            <div className={styles.statLabel}>Videos</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIcon}></div>
            <div className={styles.statNum}>{announcements.length}</div>
            <div className={styles.statLabel}>Announcements</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIcon}></div>
            <div className={styles.statNum}>{media.length + announcements.length}</div>
            <div className={styles.statLabel}>Total Items</div>
          </div>
        </div>

        {/* Tabs */}
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

        {/* ===== MEDIA TAB ===== */}
        {tab === 'media' && (
          <div className={styles.tabContent}>
            {/* Add Media Form */}
            <div className={styles.panel}>
              <h2 className={styles.panelTitle}>Add New Media</h2>
              <form onSubmit={handleAddMedia} className={styles.mediaForm}>
                {/* Type toggle */}
                <div className={styles.typeToggle}>
                  <button
                    type="button"
                    className={`${styles.typeBtn} ${mediaForm.type === 'image' ? styles.typeBtnActive : ''}`}
                    onClick={() => setMediaForm(p => ({ ...p, type: 'image' }))}
                    id="media-type-image"
                  >
                    Image
                  </button>
                  <button
                    type="button"
                    className={`${styles.typeBtn} ${mediaForm.type === 'video' ? styles.typeBtnActive : ''}`}
                    onClick={() => setMediaForm(p => ({ ...p, type: 'video' }))}
                    id="media-type-video"
                  >
                    Video
                  </button>
                </div>

                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label htmlFor="media-title">Title *</label>
                    <input
                      id="media-title"
                      type="text"
                      placeholder={`${mediaForm.type === 'image' ? 'Photo' : 'Video'} title`}
                      value={mediaForm.title}
                      onChange={e => setMediaForm(p => ({ ...p, title: e.target.value }))}
                      className={styles.input}
                      required
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="media-file">
                      {mediaForm.type === 'image' ? 'Image' : 'Video'} File
                    </label>
                    <input
                      id="media-file"
                      ref={fileInputRef}
                      type="file"
                      accept={mediaForm.type === 'image' ? 'image/*' : 'video/*'}
                      className={styles.fileInput}
                      onChange={e => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setPreviewUrl(URL.createObjectURL(file));
                          setMediaForm(p => ({ ...p, url: '' }));
                        }
                      }}
                    />
                    {previewUrl && (
                      <div className={styles.filePreview}>
                        {mediaForm.type === 'image' ? (
                          <img src={previewUrl} alt="Preview" />
                        ) : (
                          <video src={previewUrl} controls />
                        )}
                      </div>
                    )}
                  </div>

                  <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                    <label htmlFor="media-desc">Description (optional)</label>
                    <input
                      id="media-desc"
                      type="text"
                      placeholder="Brief description of this media"
                      value={mediaForm.description}
                      onChange={e => setMediaForm(p => ({ ...p, description: e.target.value }))}
                      className={styles.input}
                    />
                  </div>
                </div>

                {mediaSuccess && <div className={styles.successMsg}>{mediaSuccess}</div>}

                <button
                  type="submit"
                  className="btn-primary"
                  disabled={mediaLoading}
                  id="admin-add-media-btn"
                >
                  {mediaLoading ? 'Adding...' : `Add ${mediaForm.type === 'image' ? 'Image' : 'Video'}`}
                </button>
              </form>
            </div>

            {/* Media List */}
            <div className={styles.panel}>
              <div className={styles.panelHeader}>
                <h2 className={styles.panelTitle}>Gallery Items ({filteredMedia.length})</h2>
                <div className={styles.filterRow}>
                  {(['all', 'image', 'video'] as MediaFilter[]).map((f) => (
                    <button
                      key={f}
                      className={`${styles.miniFilterBtn} ${mediaFilter === f ? styles.miniFilterActive : ''}`}
                      onClick={() => setMediaFilter(f)}
                      id={`admin-media-filter-${f}`}
                    >
                      {f === 'all' ? 'All' : f === 'image' ? 'Images' : 'Videos'}
                    </button>
                  ))}
                </div>
              </div>

              {filteredMedia.length === 0 ? (
                <div className={styles.emptyState}>
                  <div className={styles.emptyIcon}></div>
                  <p>No media items found.</p>
                </div>
              ) : (
                <div className={styles.mediaGrid}>
                  {filteredMedia.map((item) => (
                    <div key={item.id} className={styles.mediaItem}>
                      <div className={styles.mediaItemThumb}>
                        {item.url ? (
                          item.type === 'image' ? (
                            <img src={item.url} alt={item.title} className={styles.thumbImg} />
                          ) : (
                            <video src={item.url} className={styles.thumbImg} />
                          )
                        ) : (
                          <span>{item.type === 'image' ? '🖼️' : '🎬'}</span>
                        )}
                      </div>
                      <div className={styles.mediaItemInfo}>
                        <div className={styles.mediaItemTitle}>{item.title}</div>
                        <div className={styles.mediaItemMeta}>
                          <span className={styles.mediaItemType}>{item.type}</span>
                          <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                        </div>
                        {item.description && <div className={styles.mediaItemDesc}>{item.description}</div>}
                      </div>
                      <button
                        className={styles.deleteBtn}
                        onClick={() => setDeleteConfirm({ type: 'media', id: item.id })}
                        id={`admin-delete-media-${item.id}`}
                        title="Delete"
                        >
                        
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ===== ANNOUNCEMENTS TAB ===== */}
        {tab === 'announcements' && (
          <div className={styles.tabContent}>
            {/* Add Announcement Form */}
            <div className={styles.panel}>
              <h2 className={styles.panelTitle}>New Announcement</h2>
              <form onSubmit={handleAddAnnouncement} className={styles.annForm}>
                <div className={styles.formGrid}>
                  <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                    <label htmlFor="ann-title">Title *</label>
                    <input
                      id="ann-title"
                      type="text"
                      placeholder="Announcement title"
                      value={annForm.title}
                      onChange={e => setAnnForm(p => ({ ...p, title: e.target.value }))}
                      className={styles.input}
                      required
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="ann-category">Category *</label>
                    <select
                      id="ann-category"
                      value={annForm.category}
                      onChange={e => setAnnForm(p => ({ ...p, category: e.target.value as Announcement['category'] }))}
                      className={styles.input}
                    >
                      <option value="general">General</option>
                      <option value="event">Event</option>
                      <option value="holiday">Holiday</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="ann-date">Date *</label>
                    <input
                      id="ann-date"
                      type="date"
                      value={annForm.date}
                      onChange={e => setAnnForm(p => ({ ...p, date: e.target.value }))}
                      className={styles.input}
                      required
                    />
                  </div>
                  <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                    <label htmlFor="ann-content">Content *</label>
                    <textarea
                      id="ann-content"
                      placeholder="Write the announcement details..."
                      value={annForm.content}
                      onChange={e => setAnnForm(p => ({ ...p, content: e.target.value }))}
                      className={`${styles.input} ${styles.textarea}`}
                      rows={4}
                      required
                    />
                  </div>
                </div>

                {annSuccess && <div className={styles.successMsg}>{annSuccess}</div>}

                <button
                  type="submit"
                  className="btn-primary"
                  disabled={annLoading}
                  id="admin-publish-ann-btn"
                >
                  {annLoading ? 'Publishing...' : 'Publish Announcement'}
                </button>
              </form>
            </div>

            {/* Announcements List */}
            <div className={styles.panel}>
              <h2 className={styles.panelTitle}>All Announcements ({announcements.length})</h2>
              {announcements.length === 0 ? (
                <div className={styles.emptyState}>
                  <div className={styles.emptyIcon}></div>
                  <p>No announcements yet.</p>
                </div>
              ) : (
                <div className={styles.annList}>
                  {announcements.map((ann) => {
                    const cfg = categoryConfig[ann.category];
                    return (
                      <div key={ann.id} className={styles.annItem}>
                        <div className={styles.annItemLeft} style={{ background: cfg.color }}>
                        </div>
                        <div className={styles.annItemBody}>
                          <div className={styles.annItemTitle}>{ann.title}</div>
                          <div className={styles.annItemMeta}>
                            <span className={styles.annCat} style={{ color: cfg.color }}>{cfg.label}</span>
                            <span>{new Date(ann.date).toLocaleDateString()}</span>
                          </div>
                          <p className={styles.annItemContent}>{ann.content}</p>
                        </div>
                        <button
                          className={styles.deleteBtn}
                          onClick={() => setDeleteConfirm({ type: 'ann', id: ann.id })}
                          id={`admin-delete-ann-${ann.id}`}
                          title="Delete"
                        >
                          
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ===== RECEIPTS TAB ===== */}
        {tab === 'receipts' && (
          <ReceiptGenerator />
        )}
      </div>

      {/* Delete Confirm Modal */}
      {deleteConfirm && (
        <div className={styles.modal} onClick={() => setDeleteConfirm(null)}>
          <div className={styles.modalBox} onClick={e => e.stopPropagation()}>
            <div className={styles.modalIcon}></div>
            <h3>Are you sure?</h3>
            <p>This action cannot be undone. The {deleteConfirm.type === 'media' ? 'media item' : 'announcement'} will be permanently deleted.</p>
            <div className={styles.modalBtns}>
              <button
                className={styles.cancelBtn}
                onClick={() => setDeleteConfirm(null)}
                id="admin-delete-cancel-btn"
              >
                Cancel
              </button>
              <button
                className={styles.confirmDeleteBtn}
                onClick={() => deleteConfirm.type === 'media'
                  ? handleDeleteMedia(deleteConfirm.id)
                  : handleDeleteAnnouncement(deleteConfirm.id)
                }
                id="admin-delete-confirm-btn"
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
