import { motion } from 'framer-motion';
import { Wand2, Sparkles, Eraser, Maximize, Paintbrush } from 'lucide-react';
import { GlassCard } from '@/components/studio/GlassCard';

const tools = [
  {
    icon: Sparkles,
    name: 'AI Enhance',
    desc: 'Automatically improve image quality with AI-powered enhancement',
    color: 'text-neon-blue',
    status: 'Coming Soon',
  },
  {
    icon: Eraser,
    name: 'Background Removal',
    desc: 'Remove backgrounds instantly using smart detection',
    color: 'text-neon-violet',
    status: 'Coming Soon',
  },
  {
    icon: Maximize,
    name: 'Image Upscaler',
    desc: 'Upscale images up to 4x without losing quality',
    color: 'text-neon-cyan',
    status: 'Coming Soon',
  },
  {
    icon: Paintbrush,
    name: 'Style Transfer',
    desc: 'Transform images into different artistic styles',
    color: 'text-neon-blue',
    status: 'Coming Soon',
  },
  {
    icon: Wand2,
    name: 'Color Grading',
    desc: 'Professional color grading presets and custom LUTs',
    color: 'text-neon-violet',
    status: 'Available',
  },
];

export default function Tools() {
  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-foreground mb-2">Smart Tools</h1>
        <p className="text-muted-foreground">AI-powered tools to enhance your creative workflow</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tools.map((tool, i) => (
          <motion.div
            key={tool.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <GlassCard className="group cursor-pointer h-full">
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl bg-muted/50 flex items-center justify-center ${tool.color} shrink-0 group-hover:scale-110 transition-transform`}>
                  <tool.icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-base font-semibold text-foreground">{tool.name}</h3>
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                      tool.status === 'Available'
                        ? 'bg-neon-cyan/10 text-neon-cyan'
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {tool.status}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{tool.desc}</p>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
