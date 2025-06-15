import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertTriangle, Clock } from "lucide-react";

interface AlertItem {
  id: number;
  type: "low_stock" | "expiring";
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
}

interface AlertItemsProps {
  alerts?: AlertItem[];
  isLoading: boolean;
}

export default function AlertItems({ alerts, isLoading }: AlertItemsProps) {
  const getBadgeVariant = (type: string) => {
    switch (type) {
      case "low_stock":
        return "destructive";
      case "expiring":
        return "default";
      default:
        return "default";
    }
  };

  const getBadgeText = (type: string) => {
    switch (type) {
      case "low_stock":
        return "Low Stock";
      case "expiring":
        return "Expires Soon";
      default:
        return "Alert";
    }
  };

  const getBorderColor = (type: string) => {
    switch (type) {
      case "low_stock":
        return "border-red-200";
      case "expiring":
        return "border-yellow-200";
      default:
        return "border-gray-200";
    }
  };

  const getBackgroundColor = (type: string) => {
    switch (type) {
      case "low_stock":
        return "bg-red-50";
      case "expiring":
        return "bg-yellow-50";
      default:
        return "bg-gray-50";
    }
  };

  return (
    <Card className="bg-white shadow rounded-lg">
      <CardHeader className="px-4 py-5 sm:px-6 border-b border-gray-200">
        <CardTitle className="text-lg leading-6 font-medium text-gray-900">
          Items Needing Attention
        </CardTitle>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          Low stock and expiring items
        </p>
      </CardHeader>
      <CardContent className="px-4 py-5 sm:p-6">
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="p-3 rounded-lg border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 flex-1">
                    <Skeleton className="h-6 w-20" />
                    <div className="space-y-1 flex-1">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  </div>
                  <Skeleton className="h-8 w-16" />
                </div>
              </div>
            ))}
          </div>
        ) : !alerts || alerts.length === 0 ? (
          <div className="text-center py-8">
            <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No items need immediate attention</p>
            <p className="text-sm text-gray-400 mt-1">All inventory levels are healthy</p>
          </div>
        ) : (
          <div className="space-y-4">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={`flex items-center justify-between p-3 rounded-lg border ${getBorderColor(alert.type)} ${getBackgroundColor(alert.type)}`}
              >
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <Badge variant={getBadgeVariant(alert.type)}>
                      {getBadgeText(alert.type)}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {alert.title}
                    </p>
                    <p className="text-sm text-gray-500">
                      {alert.description}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-primary hover:text-green-700"
                >
                  {alert.type === "low_stock" ? "Reorder" : "Prioritize"}
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
