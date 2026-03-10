import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Plus,
  Image,
  Pen,
  Wand2,
  FolderOpen,
  HardDrive,
  Settings,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const sidebarItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: Plus, label: 'Create', path: '/upload' },
  { icon: Image, label: 'Gallery', path: '/gallery' },
  { icon: Pen, label: 'Editor', path: '/editor' },
  { icon: Wand2, label: 'Enhance', path: '/tools' },
  { icon: FolderOpen, label: 'Projects', path: '/projects' },
  { icon: HardDrive, label: 'Storage', path: '/storage' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

export function StudioSidebar() {
  const location = useLocation();

  return (
    <motion.aside
      initial={{ x: -60, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="fixed left-0 top-16 bottom-0 w-16 z-40 glass-panel border-r border-border/50 flex flex-col items-center py-4 gap-1 hidden md:flex"
    >
      {sidebarItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              'relative w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 group',
              isActive
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
            )}
          >
            {isActive && (
              <motion.div
                layoutId="sidebar-active"
                className="absolute inset-0 rounded-xl bg-primary/10 border border-primary/20"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <item.icon className="w-5 h-5 relative z-10" />
            {/* Tooltip */}
            <div className="absolute left-full ml-2 px-2 py-1 rounded-md bg-card border border-border text-xs text-foreground opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
              {item.label}
            </div>
          </Link>
        );
      })}
    </motion.aside>
  );
}
