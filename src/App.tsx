
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import AudioPlayer from "./components/AudioPlayer";
import HomePage from "./pages/HomePage";
import CatalogPage from "./pages/CatalogPage";
import LoginPage from "./pages/LoginPage";
import AdminPage from "./pages/AdminPage";
import AudiobookDetailPage from "./pages/AudiobookDetailPage";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./contexts/AuthContext";
import { AudioPlayerProvider } from "./contexts/AudioPlayerContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <AudioPlayerProvider>
          <BrowserRouter>
            <div className="min-h-screen flex flex-col bg-background">
              <Navbar />
              <main className="flex-1 pb-20"> {/* Add padding for the audio player */}
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/catalog" element={<CatalogPage />} />
                  <Route path="/audiobook/:id" element={<AudiobookDetailPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/admin" element={<AdminPage />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              <AudioPlayer />
              <footer className="py-6 border-t border-border">
                <div className="container-custom text-center text-sm text-muted-foreground">
                  © {new Date().getFullYear()} Audio Serenity. All rights reserved.
                </div>
              </footer>
            </div>
          </BrowserRouter>
        </AudioPlayerProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
