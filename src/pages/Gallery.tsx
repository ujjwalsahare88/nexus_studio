import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Download, Trash2, Pencil, Eye, X, Search, Image as ImageIcon
} from 'lucide-react';
import { GlassCard } from '@/components/studio/GlassCard';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface MediaItem {
  name: string;
  id: string;
  url: string;
  size: number;
  created_at: string;
  type: string;
}

export default function Gallery() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [preview, setPreview] = useState<MediaItem | null>(null);
  const [renaming, setRenaming] = useState<string | null>(null);
  const [newName, setNewName] = useState('');
  const { user } = useAuth();

  const fetchMedia = async () => {
    if (!user) { setLoading(false); return; }
    setLoading(true);
    const { data, error } = await supabase.storage.from('media').list(user.id, {
      sortBy: { column: 'created_at', order: 'desc' },
    });

    if (error) {
      toast.error('Failed to load media');
      setLoading(false);
      return;
    }

    const items: MediaItem[] = (data || [])
      .filter((f) => f.name !== '.emptyFolderPlaceholder')
      .map((f) => {
        const { data: urlData } = supabase.storage.from('media').getPublicUrl(`${user.id}/${f.name}`);
        return {
          name: f.name,
          id: f.id || f.name,
          url: urlData.publicUrl,
          size: f.metadata?.size || 0,
          created_at: f.created_at || '',
          type: f.metadata?.mimetype || '',
        };
      });

    setMedia(items);
    setLoading(false);
  };

  useEffect(() => { fetchMedia(); }, [user]);

  const deleteMedia = async (name: string) => {
    if (!user) return;
    const { error } = await supabase.storage.from('media').remove([`${user.id}/${name}`]);
    if (error) {
      toast.error('Failed to delete');
    } else {
      toast.success('Deleted successfully');
      setMedia((prev) => prev.filter((m) => m.name !== name));
      if (preview?.name === name) setPreview(null);
    }
  };

  const renameMedia = async (oldName: string) => {
    if (!user || !newName.trim()) return;
    const ext = oldName.split('.').pop();
    const finalName = newName.includes('.') ? newName : `${newName}.${ext}`;

    // Download, re-upload with new name, delete old
    const { data: fileData, error: dlError } = await supabase.storage.from('media').download(`${user.id}/${oldName}`);
    if (dlError || !fileData) { toast.error('Rename failed'); return; }

    const { error: upError } = await supabase.storage.from('media').upload(`${user.id}/${finalName}`, fileData);
    if (upError) { toast.error('Rename failed'); return; }

    await supabase.storage.from('media').remove([`${user.id}/${oldName}`]);
    toast.success('Renamed successfully');
    setRenaming(null);
    fetchMedia();
  };

  const downloadMedia = async (item: MediaItem) => {
    const { data, error } = await supabase.storage.from('media').download(`${user!.id}/${item.name}`);
    if (error || !data) { toast.error('Download failed'); return; }
    const url = URL.createObjectURL(data);
    const a = document.createElement('a');
    a.href = url;
    a.download = item.name;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filtered = media.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Gallery</h1>
            <p className="text-muted-foreground text-sm">{media.length} items</p>
          </div>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search media..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-9 pl-9 pr-4 rounded-lg bg-muted/50 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
            />
          </div>
        </div>
      </motion.div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <GlassCard className="flex flex-col items-center justify-center py-20">
          <ImageIcon className="w-16 h-16 text-muted-foreground mb-4" />
          <p className="text-lg text-foreground font-medium">
            {media.length === 0 ? 'No media yet' : 'No results found'}
          </p>
          <p className="text-sm text-muted-foreground">
            {media.length === 0 ? 'Upload some files to get started' : 'Try a different search term'}
          </p>
        </GlassCard>
      ) : (
        <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
          {filtered.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="break-inside-avoid"
            >
              <div className="relative group rounded-2xl overflow-hidden glass-panel neon-glow-hover transition-all">
                {item.type.startsWith('video/') ? (
                  <video src={item.url} className="w-full rounded-2xl" muted />
                ) : (
                  <img src={item.url} alt={item.name} className="w-full rounded-2xl" loading="lazy" />
                )}
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                  {renaming === item.name ? (
                    <div className="flex gap-2">
                      <input
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && renameMedia(item.name)}
                        className="flex-1 h-8 px-2 rounded-lg bg-muted/80 border border-border/50 text-xs text-foreground focus:outline-none"
                        autoFocus
                      />
                      <Button size="sm" onClick={() => renameMedia(item.name)} className="h-8 text-xs bg-primary text-primary-foreground">
                        Save
                      </Button>
                    </div>
                  ) : (
                    <>
                      <p className="text-xs text-foreground font-medium truncate mb-2">{item.name}</p>
                      <div className="flex gap-1">
                        <button onClick={() => setPreview(item)} className="p-1.5 rounded-lg bg-muted/60 hover:bg-muted text-foreground transition-colors">
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => { setRenaming(item.name); setNewName(item.name.replace(/\.[^.]+$/, '')); }} className="p-1.5 rounded-lg bg-muted/60 hover:bg-muted text-foreground transition-colors">
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => downloadMedia(item)} className="p-1.5 rounded-lg bg-muted/60 hover:bg-muted text-foreground transition-colors">
                          <Download className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => deleteMedia(item.name)} className="p-1.5 rounded-lg bg-destructive/20 hover:bg-destructive/40 text-destructive transition-colors">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Preview modal */}
      <AnimatePresence>
        {preview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-xl p-6"
            onClick={() => setPreview(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative max-w-4xl max-h-[85vh] w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setPreview(null)}
                className="absolute -top-4 -right-4 w-10 h-10 rounded-full glass-panel flex items-center justify-center hover:bg-muted/50 z-10"
              >
                <X className="w-5 h-5 text-foreground" />
              </button>
              {preview.type.startsWith('video/') ? (
                <video src={preview.url} controls className="w-full max-h-[80vh] rounded-2xl" />
              ) : (
                <img src={preview.url} alt={preview.name} className="w-full max-h-[80vh] object-contain rounded-2xl" />
              )}
              <div className="mt-3 flex items-center justify-between">
                <p className="text-sm text-foreground font-medium">{preview.name}</p>
                <p className="text-xs text-muted-foreground">{(preview.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
