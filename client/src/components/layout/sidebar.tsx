import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { Package2, LayoutDashboard, Package, Heart, Users, FileText, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Inventory", href: "/inventory", icon: Package },
  { name: "Donations", href: "/donations", icon: Heart },
  { name: "Distributions", href: "/distributions", icon: Users },
  { name: "Reports", href: "/reports", icon: FileText },
];

export default function Sidebar() {
  const [location] = useLocation();
  const { user } = useAuth();

  const getUserInitials = (user: any) => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`;
    }
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return "U";
  };

  const getUserName = (user: any) => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    if (user?.email) {
      return user.email;
    }
    return "User";
  };

  return (
    <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
      <div className="flex-1 flex flex-col min-h-0 bg-white shadow-lg">
        <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0 px-4 mb-8">
            <div className="bg-primary rounded-lg p-2">
              <Package2 className="h-8 w-8 text-white" />
            </div>
            <h1 className="ml-3 text-xl font-semibold text-gray-900">PantryPal</h1>
          </div>

          {/* Navigation */}
          <nav className="mt-5 flex-1 px-2 space-y-1">
            {navigation.map((item) => {
              const isActive = location === item.href;
              return (
                <Link key={item.name} href={item.href}>
                  <div
                    className={cn(
                      isActive
                        ? "bg-primary text-white"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                      "group flex items-center px-2 py-2 text-sm font-medium rounded-md cursor-pointer"
                    )}
                  >
                    <item.icon
                      className={cn(
                        isActive ? "text-white" : "text-gray-400",
                        "mr-3 h-6 w-6"
                      )}
                    />
                    {item.name}
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Profile */}
        <div className="flex-shrink-0 flex bg-gray-50 p-4">
          <div className="flex-shrink-0 w-full group block">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={user?.profileImageUrl} alt={getUserName(user)} />
                  <AvatarFallback className="bg-primary text-white">
                    {getUserInitials(user)}
                  </AvatarFallback>
                </Avatar>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                    {getUserName(user)}
                  </p>
                  <p className="text-xs font-medium text-gray-500 group-hover:text-gray-700">
                    {user?.role || "Volunteer"}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.location.href = "/api/logout"}
                className="text-gray-500 hover:text-gray-700"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
