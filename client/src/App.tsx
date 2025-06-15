import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import Login from "@/pages/login";
import Dashboard from "@/pages/dashboard";
import Inventory from "@/pages/inventory";
import Donations from "@/pages/donations";
import Distributions from "@/pages/distributions";
import Reports from "@/pages/reports";
import Sidebar from "@/components/layout/sidebar";
import { cn } from "@/lib/utils";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <Switch>
      {!isAuthenticated ? (
        <>
          <Route path="/" component={Landing} />
          <Route path="/login" component={Login} />
        </>
      ) : (
        <div className="flex h-screen bg-gray-50">
          <Sidebar />
          <div className="md:pl-64 flex flex-col flex-1">
            <main className="flex-1">
              <Route path="/" component={Dashboard} />
              <Route path="/inventory" component={Inventory} />
              <Route path="/donations" component={Donations} />
              <Route path="/distributions" component={Distributions} />
              <Route path="/reports" component={Reports} />
            </main>
          </div>
        </div>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
