import { ReactNode } from 'react';
import { TopNav } from './TopNav';
import { StudioSidebar } from './StudioSidebar';
import { ParticleBackground } from './ParticleBackground';

interface StudioLayoutProps {
  children: ReactNode;
}

export function StudioLayout({ children }: StudioLayoutProps) {
  return (
    <div className="min-h-screen bg-background relative">
      <ParticleBackground />
      <TopNav />
      <StudioSidebar />
      <main className="pt-16 md:pl-16 min-h-screen relative z-10">
        {children}
      </main>
    </div>
  );
}
