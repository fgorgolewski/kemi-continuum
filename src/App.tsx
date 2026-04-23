import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Index from "./pages/Index";
import Services from "./pages/Services";
import Practice from "./pages/Practice";
import About from "./pages/About";
import NotFound from "./pages/NotFound";

import { AuthProvider } from "@/providers/AuthProvider";
import { RequireAuth } from "@/components/ops/RequireAuth";
import { OpsLayout } from "@/layouts/OpsLayout";
import { OpsLogin } from "@/pages/ops/Login";
import { Today } from "@/pages/ops/Today";
import { Clients } from "@/pages/ops/Clients";
import { ClientDetail } from "@/pages/ops/ClientDetail";
import { Assistant } from "@/pages/ops/Assistant";
import { Orders } from "@/pages/ops/Orders";
import { Vendors } from "@/pages/ops/Vendors";
import {
  AnnualMap,
  WardrobeOps,
  WelcomePackages,
  Collaborators,
  Intensives,
  Financials,
  OpsNotFound,
} from "@/pages/ops/Stubs";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 30_000,
    },
  },
});

/**
 * Hostname gating — apex vs. `ops.` subdomain.
 *
 * Both hostnames point to the same Worker and serve the same bundle.
 * At runtime, we read window.location.hostname and mount only one
 * of the two route trees. The other returns 404 for any path.
 *
 * Localhost dev default is apex (marketing). Append `?ops=1` to any
 * dev URL to test the ops tree without fiddling with /etc/hosts.
 */
function isOpsHost(): boolean {
  if (typeof window === "undefined") return false;
  const { hostname, search } = window.location;
  if (hostname.startsWith("admin.")) return true;
  const localhost =
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname.endsWith(".local");
  if (localhost && new URLSearchParams(search).get("ops") === "1") return true;
  return false;
}

function MarketingRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/services" element={<Services />} />
      <Route path="/practice" element={<Practice />} />
      <Route path="/about" element={<About />} />
      {/* ADD ALL CUSTOM MARKETING ROUTES ABOVE THE CATCH-ALL */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function OpsRoutes() {
  return (
    <Routes>
      <Route path="/ops/login" element={<OpsLogin />} />
      <Route
        element={
          <RequireAuth>
            <OpsLayout />
          </RequireAuth>
        }
      >
        <Route path="/ops" element={<Today />} />
        <Route path="/ops/dila" element={<Assistant />} />
        <Route path="/ops/clients" element={<Clients />} />
        <Route path="/ops/clients/:id" element={<ClientDetail />} />
        <Route path="/ops/orders" element={<Orders />} />
        <Route path="/ops/vendors" element={<Vendors />} />
        <Route path="/ops/annual-map" element={<AnnualMap />} />
        <Route path="/ops/wardrobe" element={<WardrobeOps />} />
        <Route path="/ops/welcome-packages" element={<WelcomePackages />} />
        <Route path="/ops/collaborators" element={<Collaborators />} />
        <Route path="/ops/intensives" element={<Intensives />} />
        <Route path="/ops/financials" element={<Financials />} />
      </Route>
      {/* Any non-ops path on the subdomain redirects to /ops. */}
      <Route path="/" element={<Navigate to="/ops" replace />} />
      <Route path="*" element={<OpsNotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          {isOpsHost() ? <OpsRoutes /> : <MarketingRoutes />}
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
