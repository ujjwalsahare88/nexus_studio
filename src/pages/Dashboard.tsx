import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Upload, Image, Sparkles, Clock, HardDrive, Folder, Wand2,
  ArrowRight, TrendingUp, Zap
} from 'lucide-react';
import { GlassCard } from '@/components/studio/GlassCard';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay },
});

export default function Dashboard() {
  useAuth();

  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Hero Section */}
      <motion.section {...fadeUp(0)} className="relative overflow-hidden rounded-3xl p-8 lg:p-12">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-neon-violet/10 via-neon-blue/5 to-neon-cyan/10 rounded-3xl" />
        <div className="absolute inset-0 glass-panel rounded-3xl" />
        
        <div className="relative z-10 flex flex-col lg:flex-row items-center gap-8">
          <div className="flex-1 space-y-6">
            <motion.h1 {...fadeUp(0.1)} className="text-4xl lg:text-6xl font-bold tracking-tight">
              <span className="text-foreground">Next-Gen </span>
              <span className="gradient-text">Creative Studio</span>
            </motion.h1>
            <motion.p {...fadeUp(0.2)} className="text-lg text-muted-foreground max-w-xl leading-relaxed">
              Upload, edit, enhance, and manage your media with AI-powered tools.
              Your creative workspace, reimagined.
            </motion.p>
            <motion.div {...fadeUp(0.3)} className="flex flex-wrap gap-3">
              <Link to="/upload">
                <Button className="bg-gradient-to-r from-neon-blue to-neon-violet text-primary-foreground hover:opacity-90 glow-blue px-6 h-11 text-sm">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Create New
                </Button>
              </Link>
              <Link to="/gallery">
                <Button variant="outline" className="border-border/50 hover:bg-muted/50 h-11 px-6 text-sm">
                  <Image className="w-4 h-4 mr-2" />
                  Browse Gallery
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* Hero visual */}
          <motion.div
            {...fadeUp(0.4)}
            className="w-64 h-64 lg:w-80 lg:h-80 relative shrink-0"
          >
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-neon-blue/20 via-neon-violet/20 to-neon-cyan/20 animate-glow-pulse" />
            <div className="absolute inset-4 rounded-2xl glass-panel flex items-center justify-center">
              <div className="space-y-3 text-center">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-neon-blue to-neon-violet flex items-center justify-center animate-float">
                  <Zap className="w-8 h-8 text-primary-foreground" />
                </div>
                <p className="text-xs text-muted-foreground">AI-Powered Studio</p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Image, label: 'Total Media', value: '0', color: 'text-neon-blue' },
          { icon: HardDrive, label: 'Storage Used', value: '0 MB', color: 'text-neon-violet' },
          { icon: Folder, label: 'Projects', value: '0', color: 'text-neon-cyan' },
          { icon: TrendingUp, label: 'This Week', value: '0 uploads', color: 'text-neon-blue' },
        ].map((stat, i) => (
          <motion.div key={stat.label} {...fadeUp(0.1 * i)}>
            <GlassCard className="p-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center ${stat.color}`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xl font-semibold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {/* Dashboard Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Uploads */}
        <motion.div {...fadeUp(0.2)} className="lg:col-span-2">
          <GlassCard>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Clock className="w-5 h-5 text-neon-blue" />
                Recent Uploads
              </h2>
              <Link to="/gallery" className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                View all <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="flex items-center justify-center h-40 border border-dashed border-border/50 rounded-xl">
              <div className="text-center space-y-2">
                <Upload className="w-8 h-8 text-muted-foreground mx-auto" />
                <p className="text-sm text-muted-foreground">No uploads yet</p>
                <Link to="/upload">
                  <Button size="sm" variant="outline" className="text-xs mt-2">
                    Upload Media
                  </Button>
                </Link>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Quick Tools */}
        <motion.div {...fadeUp(0.3)}>
          <GlassCard>
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-4">
              <Wand2 className="w-5 h-5 text-neon-violet" />
              Quick Tools
            </h2>
            <div className="space-y-2">
              {[
                { label: 'Upload Media', icon: Upload, path: '/upload', desc: 'Drag & drop files' },
                { label: 'Image Editor', icon: Pen, path: '/editor', desc: 'Crop, filter, enhance' },
                { label: 'AI Enhance', icon: Sparkles, path: '/tools', desc: 'Smart upscaling' },
                { label: 'Gallery', icon: Image, path: '/gallery', desc: 'Browse all media' },
              ].map((tool) => (
                <Link
                  key={tool.path}
                  to={tool.path}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-all group"
                >
                  <div className="w-9 h-9 rounded-lg bg-muted/50 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                    <tool.icon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{tool.label}</p>
                    <p className="text-xs text-muted-foreground">{tool.desc}</p>
                  </div>
                </Link>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
}

// Need Pen icon import
import { Pen } from 'lucide-react';
