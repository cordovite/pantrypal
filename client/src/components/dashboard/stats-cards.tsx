import { Card, CardContent } from "@/components/ui/card";
import { Package, Heart, Users, Clock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface StatsCardsProps {
  stats?: {
    totalItems: number;
    monthlyDonations: number;
    familiesServed: number;
    upcomingEvents: number;
  };
  isLoading: boolean;
}

export default function StatsCards({ stats, isLoading }: StatsCardsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Skeleton className="w-8 h-8 rounded-md" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-6 w-16" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: "Total Items",
      value: stats?.totalItems || 0,
      icon: Package,
      color: "bg-blue-500",
    },
    {
      title: "This Month's Donations",
      value: stats?.monthlyDonations || 0,
      icon: Heart,
      color: "bg-green-500",
    },
    {
      title: "Families Served",
      value: stats?.familiesServed || 0,
      icon: Users,
      color: "bg-purple-500",
    },
    {
      title: "Upcoming Events",
      value: stats?.upcomingEvents || 0,
      icon: Clock,
      color: "bg-yellow-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => (
        <Card key={index} className="bg-white overflow-hidden shadow rounded-lg">
          <CardContent className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className={`w-8 h-8 ${card.color} rounded-md flex items-center justify-center`}>
                  <card.icon className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    {card.title}
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {card.value.toLocaleString()}
                  </dd>
                </dl>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
