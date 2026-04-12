import { ReactNode, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { DiscoveryProvider } from "@/icon-discovery/DiscoveryContext";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <DiscoveryProvider>
          <Toaster />
          <Sonner />
          {children}
        </DiscoveryProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

