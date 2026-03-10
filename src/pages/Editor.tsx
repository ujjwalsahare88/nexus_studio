import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  RotateCw, Sun, Contrast, Palette, Download, Upload, ZoomIn, ZoomOut,
  FlipHorizontal, FlipVertical, Undo, Redo
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface EditorState {
  brightness: number;
  contrast: number;
  saturation: number;
  hue: number;
  blur: number;
  rotation: number;
  flipH: boolean;
  flipV: boolean;
  zoom: number;
}

const defaultState: EditorState = {
  brightness: 100,
  contrast: 100,
  saturation: 100,
  hue: 0,
  blur: 0,
  rotation: 0,
  flipH: false,
  flipV: false,
  zoom: 1,
};

const FILTERS = [
  { name: 'None', values: defaultState },
  { name: 'Vivid', values: { ...defaultState, saturation: 150, contrast: 120 } },
  { name: 'Warm', values: { ...defaultState, hue: 15, brightness: 105 } },
  { name: 'Cool', values: { ...defaultState, hue: -15, saturation: 90 } },
  { name: 'B&W', values: { ...defaultState, saturation: 0, contrast: 130 } },
  { name: 'Fade', values: { ...defaultState, contrast: 80, brightness: 110, saturation: 80 } },
  { name: 'Drama', values: { ...defaultState, contrast: 150, saturation: 120, brightness: 90 } },
];

export default function Editor() {
  const [image, setImage] = useState<string | null>(null);
  const [state, setState] = useState<EditorState>(defaultState);
  const [history, setHistory] = useState<EditorState[]>([defaultState]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const pushState = (newState: EditorState) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newState);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setState(newState);
  };

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setState(history[historyIndex - 1]);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setState(history[historyIndex + 1]);
    }
  };

  const loadImage = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setImage(e.target?.result as string);
      setState(defaultState);
      setHistory([defaultState]);
      setHistoryIndex(0);
    };
    reader.readAsDataURL(file);
  };

  const getFilter = () => {
    return `brightness(${state.brightness}%) contrast(${state.contrast}%) saturate(${state.saturation}%) hue-rotate(${state.hue}deg) blur(${state.blur}px)`;
  };

  const getTransform = () => {
    return `rotate(${state.rotation}deg) scaleX(${state.flipH ? -1 : 1}) scaleY(${state.flipV ? -1 : 1}) scale(${state.zoom})`;
  };

  const downloadImage = () => {
    if (!image) return;
    const canvas = document.createElement('canvas');
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d')!;
      ctx.filter = getFilter();
      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((state.rotation * Math.PI) / 180);
      ctx.scale(state.flipH ? -1 : 1, state.flipV ? -1 : 1);
      ctx.drawImage(img, -img.width / 2, -img.height / 2);
      ctx.restore();
      const link = document.createElement('a');
      link.download = 'edited-image.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
      toast.success('Image downloaded!');
    };
    img.src = image;
  };

  const SliderControl = ({ label, value, min, max, step, icon: Icon, onChange }: any) => (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground flex items-center gap-1.5">
          <Icon className="w-3.5 h-3.5" /> {label}
        </span>
        <span className="text-xs text-foreground font-mono">{value}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step || 1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1 bg-muted rounded-full appearance-none cursor-pointer accent-primary"
      />
    </div>
  );

  if (!image) {
    return (
      <div className="p-6 lg:p-8 max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold text-foreground mb-2">Image Editor</h1>
          <p className="text-muted-foreground mb-8">Open an image to start editing</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div
            onClick={() => {
              const input = document.createElement('input');
              input.type = 'file';
              input.accept = 'image/*';
              input.onchange = (e) => {
                const file = (e.target as HTMLInputElement).files?.[0];
                if (file) loadImage(file);
              };
              input.click();
            }}
            className="cursor-pointer border-2 border-dashed border-border/50 rounded-2xl p-16 text-center hover:border-primary/30 hover:bg-muted/20 transition-all"
          >
            <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-lg font-medium text-foreground">Click to open an image</p>
            <p className="text-sm text-muted-foreground">Supports all common image formats</p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col lg:flex-row">
      {/* Left toolbar */}
      <motion.div
        initial={{ x: -40, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="w-full lg:w-64 shrink-0 p-4 overflow-y-auto glass-panel border-r border-border/50"
      >
        <h3 className="text-sm font-semibold text-foreground mb-3">Filters</h3>
        <div className="grid grid-cols-4 lg:grid-cols-2 gap-2 mb-6">
          {FILTERS.map((f) => (
            <button
              key={f.name}
              onClick={() => pushState({ ...f.values, rotation: state.rotation, flipH: state.flipH, flipV: state.flipV, zoom: state.zoom })}
              className="p-2 rounded-xl text-xs text-center transition-all hover:bg-muted/50 border border-transparent hover:border-primary/20"
            >
              <div className="w-full aspect-square rounded-lg bg-muted/30 mb-1 overflow-hidden">
                <img
                  src={image}
                  alt=""
                  className="w-full h-full object-cover"
                  style={{ filter: `brightness(${f.values.brightness}%) contrast(${f.values.contrast}%) saturate(${f.values.saturation}%) hue-rotate(${f.values.hue}deg)` }}
                />
              </div>
              <span className="text-muted-foreground">{f.name}</span>
            </button>
          ))}
        </div>

        <h3 className="text-sm font-semibold text-foreground mb-3">Transform</h3>
        <div className="flex gap-1 mb-4">
          <button onClick={() => pushState({ ...state, rotation: state.rotation - 90 })} className="p-2 rounded-lg hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-all" title="Rotate left">
            <RotateCw className="w-4 h-4 scale-x-[-1]" />
          </button>
          <button onClick={() => pushState({ ...state, rotation: state.rotation + 90 })} className="p-2 rounded-lg hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-all" title="Rotate right">
            <RotateCw className="w-4 h-4" />
          </button>
          <button onClick={() => pushState({ ...state, flipH: !state.flipH })} className="p-2 rounded-lg hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-all" title="Flip H">
            <FlipHorizontal className="w-4 h-4" />
          </button>
          <button onClick={() => pushState({ ...state, flipV: !state.flipV })} className="p-2 rounded-lg hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-all" title="Flip V">
            <FlipVertical className="w-4 h-4" />
          </button>
        </div>
      </motion.div>

      {/* Canvas area */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 relative overflow-hidden bg-background/50">
        {/* Top bar */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
          <div className="flex gap-1">
            <button onClick={undo} disabled={historyIndex <= 0} className="p-2 rounded-lg glass-panel hover:bg-muted/50 disabled:opacity-30 text-foreground">
              <Undo className="w-4 h-4" />
            </button>
            <button onClick={redo} disabled={historyIndex >= history.length - 1} className="p-2 rounded-lg glass-panel hover:bg-muted/50 disabled:opacity-30 text-foreground">
              <Redo className="w-4 h-4" />
            </button>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => { setImage(null); setState(defaultState); }}>
              New
            </Button>
            <Button size="sm" onClick={downloadImage} className="bg-gradient-to-r from-neon-blue to-neon-violet text-primary-foreground">
              <Download className="w-3.5 h-3.5 mr-1.5" /> Export
            </Button>
          </div>
        </div>

        <img
          src={image}
          alt="Editing"
          className="max-w-full max-h-[70vh] rounded-xl shadow-2xl transition-all duration-200"
          style={{ filter: getFilter(), transform: getTransform() }}
        />

        {/* Zoom controls */}
        <div className="absolute bottom-4 flex items-center gap-2">
          <button onClick={() => pushState({ ...state, zoom: Math.max(0.2, state.zoom - 0.1) })} className="p-2 rounded-lg glass-panel hover:bg-muted/50 text-foreground">
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-xs text-muted-foreground font-mono w-12 text-center">{Math.round(state.zoom * 100)}%</span>
          <button onClick={() => pushState({ ...state, zoom: Math.min(3, state.zoom + 0.1) })} className="p-2 rounded-lg glass-panel hover:bg-muted/50 text-foreground">
            <ZoomIn className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Right panel - adjustments */}
      <motion.div
        initial={{ x: 40, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="w-full lg:w-56 shrink-0 p-4 overflow-y-auto glass-panel border-l border-border/50 space-y-4"
      >
        <h3 className="text-sm font-semibold text-foreground">Adjustments</h3>
        <SliderControl label="Brightness" value={state.brightness} min={0} max={200} icon={Sun} onChange={(v: number) => pushState({ ...state, brightness: v })} />
        <SliderControl label="Contrast" value={state.contrast} min={0} max={200} icon={Contrast} onChange={(v: number) => pushState({ ...state, contrast: v })} />
        <SliderControl label="Saturation" value={state.saturation} min={0} max={200} icon={Palette} onChange={(v: number) => pushState({ ...state, saturation: v })} />
        <SliderControl label="Hue Rotate" value={state.hue} min={-180} max={180} icon={Palette} onChange={(v: number) => pushState({ ...state, hue: v })} />
        <SliderControl label="Blur" value={state.blur} min={0} max={20} step={0.5} icon={Sun} onChange={(v: number) => pushState({ ...state, blur: v })} />

        <Button
          variant="outline"
          size="sm"
          className="w-full text-xs"
          onClick={() => pushState(defaultState)}
        >
          Reset All
        </Button>
      </motion.div>
    </div>
  );
}
