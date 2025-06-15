import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package2, Heart, Users } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <div className="container mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="flex justify-center mb-8">
            <div className="bg-primary rounded-lg p-4">
              <Package2 className="h-12 w-12 text-white" />
            </div>
          </div>
          
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Food Bank Management
          </h1>
          
          <p className="mt-6 text-lg leading-8 text-gray-600 max-w-3xl mx-auto">
            Streamline your food pantry operations with our comprehensive inventory management system.
            Track donations, manage distributions, and help feed your community more effectively.
          </p>

          <div className="mt-10">
            <Button
              size="lg"
              className="text-lg px-8 py-3"
              onClick={() => window.location.href = "/api/login"}
            >
              Get Started
            </Button>
          </div>
        </div>

        <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-3">
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Package2 className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Inventory Management
              </h3>
              <p className="text-gray-600">
                Track food items, quantities, and expiration dates with ease.
                Get alerts for low stock and expiring items.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Heart className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Donation Tracking
              </h3>
              <p className="text-gray-600">
                Record and manage donations from individuals and organizations.
                Keep detailed records for reporting and gratitude.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Distribution Events
              </h3>
              <p className="text-gray-600">
                Schedule and manage food distribution events.
                Track families served and maintain organized distributions.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-16 text-center">
          <p className="text-sm text-gray-500">
            Designed for food pantries, food banks, and community organizations
          </p>
        </div>
      </div>
    </div>
  );
}
