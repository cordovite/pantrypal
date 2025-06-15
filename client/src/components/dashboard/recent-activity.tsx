import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Edit, AlertTriangle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type { ActivityLog } from "@shared/schema";

interface RecentActivityProps {
  activity?: ActivityLog[];
  isLoading: boolean;
}

export default function RecentActivity({ activity, isLoading }: RecentActivityProps) {
  const getActivityIcon = (action: string) => {
    switch (action) {
      case "create":
        return <CheckCircle className="h-5 w-5 text-white" />;
      case "update":
        return <Edit className="h-5 w-5 text-white" />;
      case "delete":
        return <AlertTriangle className="h-5 w-5 text-white" />;
      default:
        return <CheckCircle className="h-5 w-5 text-white" />;
    }
  };

  const getActivityColor = (action: string) => {
    switch (action) {
      case "create":
        return "bg-green-500";
      case "update":
        return "bg-blue-500";
      case "delete":
        return "bg-red-500";
      default:
        return "bg-green-500";
    }
  };

  const formatTimeAgo = (date: string) => {
    const now = new Date();
    const activityDate = new Date(date);
    const diffInHours = Math.floor((now.getTime() - activityDate.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return "Less than an hour ago";
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    }
  };

  return (
    <Card className="bg-white shadow rounded-lg">
      <CardHeader className="px-4 py-5 sm:px-6 border-b border-gray-200">
        <CardTitle className="text-lg leading-6 font-medium text-gray-900">
          Recent Activity
        </CardTitle>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          Latest inventory updates and donations
        </p>
      </CardHeader>
      <CardContent className="px-4 py-5 sm:p-6">
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex space-x-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : !activity || activity.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-gray-500">No recent activity</p>
          </div>
        ) : (
          <div className="flow-root">
            <ul className="-mb-8">
              {activity.map((item, index) => (
                <li key={item.id}>
                  <div className={`relative ${index !== activity.length - 1 ? 'pb-8' : ''}`}>
                    {index !== activity.length - 1 && (
                      <span
                        className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                        aria-hidden="true"
                      />
                    )}
                    <div className="relative flex space-x-3">
                      <div>
                        <span
                          className={`h-8 w-8 rounded-full ${getActivityColor(item.action)} flex items-center justify-center ring-8 ring-white`}
                        >
                          {getActivityIcon(item.action)}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div>
                          <div className="text-sm text-gray-900">
                            {item.description}
                          </div>
                          <p className="mt-0.5 text-sm text-gray-500">
                            {formatTimeAgo(item.createdAt!)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
