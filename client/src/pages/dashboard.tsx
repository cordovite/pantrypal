import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Button } from "@/components/ui/button";
import { Download, Plus } from "lucide-react";
import StatsCards from "@/components/dashboard/stats-cards";
import RecentActivity from "@/components/dashboard/recent-activity";
import AlertItems from "@/components/dashboard/alert-items";
import AddItemModal from "@/components/inventory/add-item-modal";
import { useLocation } from "wouter";

export default function Dashboard() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const [showQuickAddModal, setShowQuickAddModal] = useState(false);
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/dashboard/stats"],
    retry: false,
  });

  const { data: recentActivity, isLoading: activityLoading } = useQuery({
    queryKey: ["/api/dashboard/recent-activity"],
    retry: false,
  });

  const { data: alerts, isLoading: alertsLoading } = useQuery({
    queryKey: ["/api/dashboard/alerts"],
    retry: false,
  });

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="mb-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              Dashboard
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Overview of your food bank operations
            </p>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4 space-x-3">
            <Button variant="outline">
              <Download className="-ml-1 mr-2 h-5 w-5" />
              Export Report
            </Button>
            <Button onClick={() => setShowQuickAddModal(true)}>
              <Plus className="-ml-1 mr-2 h-5 w-5" />
              Quick Add Item
            </Button>
          </div>
        </div>
      </div>

      {/* Alert Section */}
      {alerts && alerts.length > 0 && (
        <div className="mb-6">
          <div className="rounded-md bg-red-50 p-4 border-l-4 border-red-400">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-800">
                  <strong>{alerts.filter(a => a.type === "low_stock").length} items</strong> are running low on stock and{" "}
                  <strong>{alerts.filter(a => a.type === "expiring").length} items</strong> expire within the next 7 days.
                  <button 
                    onClick={() => setLocation('/inventory')}
                    className="font-medium underline text-red-800 hover:text-red-600 ml-1"
                  >
                    View details
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats Overview */}
      <div className="mb-8">
        <StatsCards stats={stats} isLoading={statsLoading} />
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <RecentActivity activity={recentActivity} isLoading={activityLoading} />
        <AlertItems alerts={alerts} isLoading={alertsLoading} />
      </div>

      {/* Quick Add Item Modal */}
      <AddItemModal
        open={showQuickAddModal}
        onOpenChange={setShowQuickAddModal}
      />
    </div>
  );
}
