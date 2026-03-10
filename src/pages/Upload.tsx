import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Upload as UploadIcon, X, Check, FileVideo, Loader2 } from 'lucide-react';
import { GlassCard } from '@/components/studio/GlassCard';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface UploadFile {
  file: File;
  preview: string;
  progress: number;
  status: 'pending' | 'uploading' | 'done' | 'error';
}

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'video/mp4'];

export default function Upload() {
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const addFiles = useCallback((fileList: FileList) => {
    const newFiles: UploadFile[] = Array.from(fileList)
      .filter((f) => ACCEPTED_TYPES.includes(f.type))
      .map((file) => ({
        file,
        preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : '',
        progress: 0,
        status: 'pending' as const,
      }));

    if (newFiles.length === 0) {
      toast.error('Only JPG, PNG, WEBP, and MP4 files are supported');
      return;
    }
    setFiles((prev) => [...prev, ...newFiles]);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files);
  }, [addFiles]);

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadAll = async () => {
    if (!user) {
      toast.error('Please sign in to upload');
      navigate('/auth');
      return;
    }

    for (let i = 0; i < files.length; i++) {
      if (files[i].status === 'done') continue;

      setFiles((prev) => prev.map((f, idx) => idx === i ? { ...f, status: 'uploading', progress: 30 } : f));

      const f = files[i];
      const ext = f.file.name.split('.').pop();
      const path = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

      const { error } = await supabase.storage.from('media').upload(path, f.file, {
        cacheControl: '3600',
        upsert: false,
      });

      if (error) {
        setFiles((prev) => prev.map((ff, idx) => idx === i ? { ...ff, status: 'error', progress: 0 } : ff));
        toast.error(`Failed to upload ${f.file.name}`);
      } else {
        setFiles((prev) => prev.map((ff, idx) => idx === i ? { ...ff, status: 'done', progress: 100 } : ff));
      }
    }
    toast.success('Upload complete!');
  };

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-foreground mb-2">Upload Media</h1>
        <p className="text-muted-foreground">Drag and drop files or click to browse</p>
      </motion.div>

      {/* Drop zone */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          onClick={() => {
            const input = document.createElement('input');
            input.type = 'file';
            input.multiple = true;
            input.accept = ACCEPTED_TYPES.join(',');
            input.onchange = (e) => {
              const target = e.target as HTMLInputElement;
              if (target.files) addFiles(target.files);
            };
            input.click();
          }}
          className={`relative cursor-pointer border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
            isDragOver
              ? 'border-primary bg-primary/5 glow-blue'
              : 'border-border/50 hover:border-primary/30 hover:bg-muted/20'
          }`}
        >
          <UploadIcon className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-lg font-medium text-foreground mb-1">
            {isDragOver ? 'Drop files here' : 'Drop files here or click to browse'}
          </p>
          <p className="text-sm text-muted-foreground">Supports JPG, PNG, WEBP, MP4</p>
        </div>
      </motion.div>

      {/* File list */}
      {files.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
          {files.map((f, i) => (
            <GlassCard key={i} className="p-4" hover={false}>
              <div className="flex items-center gap-4">
                {f.preview ? (
                  <img src={f.preview} alt="" className="w-12 h-12 rounded-lg object-cover" />
                ) : (
                  <div className="w-12 h-12 rounded-lg bg-muted/50 flex items-center justify-center">
                    <FileVideo className="w-5 h-5 text-muted-foreground" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{f.file.name}</p>
                  <p className="text-xs text-muted-foreground">{(f.file.size / 1024 / 1024).toFixed(2)} MB</p>
                  {f.status === 'uploading' && (
                    <div className="mt-1 h-1 rounded-full bg-muted overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-neon-blue to-neon-violet rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${f.progress}%` }}
                      />
                    </div>
                  )}
                </div>
                <div className="shrink-0">
                  {f.status === 'done' ? (
                    <Check className="w-5 h-5 text-neon-cyan" />
                  ) : f.status === 'uploading' ? (
                    <Loader2 className="w-5 h-5 text-primary animate-spin" />
                  ) : (
                    <button onClick={() => removeFile(i)} className="p-1 hover:bg-muted/50 rounded-lg transition-colors">
                      <X className="w-4 h-4 text-muted-foreground" />
                    </button>
                  )}
                </div>
              </div>
            </GlassCard>
          ))}

          <Button
            onClick={uploadAll}
            className="w-full h-11 bg-gradient-to-r from-neon-blue to-neon-violet text-primary-foreground hover:opacity-90 glow-blue"
          >
            <UploadIcon className="w-4 h-4 mr-2" />
            Upload {files.filter((f) => f.status !== 'done').length} file(s)
          </Button>
        </motion.div>
      )}
    </div>
  );
}
