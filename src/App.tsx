import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { StudioLayout } from "@/components/studio/StudioLayout";
import { lazy, Suspense } from "react";

const Dashboard = lazy(() => import("./pages/Dashboard"));
const Gallery = lazy(() => import("./pages/Gallery"));
const Upload = lazy(() => import("./pages/Upload"));
const Editor = lazy(() => import("./pages/Editor"));
const Tools = lazy(() => import("./pages/Tools"));
const Auth = lazy(() => import("./pages/Auth"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const Loader = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Sonner />
        <BrowserRouter>
          <StudioLayout>
            <Suspense fallback={<Loader />}>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/upload" element={<Upload />} />
                <Route path="/editor" element={<Editor />} />
                <Route path="/tools" element={<Tools />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/explore" element={<Gallery />} />
                <Route path="/projects" element={<Dashboard />} />
                <Route path="/storage" element={<Gallery />} />
                <Route path="/settings" element={<Dashboard />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </StudioLayout>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
