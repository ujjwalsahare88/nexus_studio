import { Link, useLocation } from 'react-router-dom';
import { Search, Upload, User, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

const navLinks = [
  { name: 'Dashboard', path: '/' },
  { name: 'Explore', path: '/explore' },
  { name: 'Gallery', path: '/gallery' },
  { name: 'Tools', path: '/tools' },
];

export function TopNav() {
  const location = useLocation();
  const [searchValue, setSearchValue] = useState('');
  const { user, signOut } = useAuth();

  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 h-16 glass-panel border-b border-border/50"
    >
      <div className="h-full flex items-center px-4 gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0 mr-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neon-blue to-neon-violet flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="text-lg font-semibold tracking-tight text-foreground hidden sm:block">
            NexusStudio
          </span>
        </Link>

        {/* Nav Links */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                'px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200',
                location.pathname === link.path
                  ? 'text-foreground bg-muted'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              )}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Search */}
        <div className="flex-1 max-w-md mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search media, projects..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="w-full h-9 pl-9 pr-4 rounded-lg bg-muted/50 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/30 transition-all"
            />
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2 shrink-0">
          <Link to="/upload">
            <Button
              size="sm"
              className="bg-gradient-to-r from-neon-blue to-neon-violet text-primary-foreground hover:opacity-90 transition-opacity glow-blue text-xs"
            >
              <Upload className="w-3.5 h-3.5 mr-1.5" />
              Upload
            </Button>
          </Link>
          {user ? (
            <button
              onClick={() => signOut()}
              className="w-8 h-8 rounded-full bg-gradient-to-br from-neon-violet to-neon-cyan flex items-center justify-center text-primary-foreground text-xs font-bold hover:opacity-80 transition-opacity"
            >
              {user.email?.charAt(0).toUpperCase() || 'U'}
            </button>
          ) : (
            <Link to="/auth">
              <div className="w-8 h-8 rounded-full bg-muted border border-border flex items-center justify-center hover:border-primary/30 transition-colors">
                <User className="w-4 h-4 text-muted-foreground" />
              </div>
            </Link>
          )}
        </div>
      </div>
    </motion.header>
  );
}
