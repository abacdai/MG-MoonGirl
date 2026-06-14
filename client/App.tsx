import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import Index from "./pages/Index";
import Timer from "./pages/Timer";
import MyApps from "./pages/MyApps";
import Community from "./pages/CommunityNew";
import Stats from "./pages/Stats";
import RoomsEnhanced from "./pages/RoomsEnhanced";
import BlockRules from "./pages/BlockRules";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Disable right-click context menu, copy, and other security measures
const setupSecurityMeasures = () => {
  // Disable right-click
  document.addEventListener("contextmenu", (e) => e.preventDefault());

  // Disable Ctrl+C, Ctrl+X, Ctrl+V only (not Ctrl+A to avoid breaking the app)
  document.addEventListener("keydown", (e) => {
    if (e.ctrlKey || e.metaKey) {
      if (e.key === "c" || e.key === "x" || e.key === "v") {
        e.preventDefault();
      }
    }
  });

  // Disable drag and drop
  document.addEventListener("dragstart", (e) => e.preventDefault());
  document.addEventListener("drop", (e) => e.preventDefault());
};

const AppContent = () => {
  useEffect(() => {
    setupSecurityMeasures();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/timer" element={<Timer />} />
        <Route path="/my-apps" element={<MyApps />} />
        <Route path="/community" element={<Community />} />
        <Route path="/stats" element={<Stats />} />
        <Route path="/rooms" element={<RoomsEnhanced />} />
        <Route path="/rooms-enhanced" element={<RoomsEnhanced />} />
        <Route path="/block-rules" element={<BlockRules />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AppContent />
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
