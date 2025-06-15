import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package2, Shield, Users, BarChart3 } from "lucide-react";

export default function Login() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Logo and Title */}
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-primary rounded-lg p-4">
              <Package2 className="h-12 w-12 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">
            Welcome Back
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to your food bank management account
          </p>
        </div>

        {/* Login Card */}
        <Card className="shadow-lg">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl text-gray-900">
              Access Your Dashboard
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Features List */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-sm text-gray-600">
                <Package2 className="h-5 w-5 text-primary" />
                <span>Manage inventory and track stock levels</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-600">
                <Users className="h-5 w-5 text-primary" />
                <span>Record donations and schedule distributions</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-600">
                <BarChart3 className="h-5 w-5 text-primary" />
                <span>View reports and analytics</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-600">
                <Shield className="h-5 w-5 text-primary" />
                <span>Secure authentication with Replit</span>
              </div>
            </div>

            {/* Login Button */}
            <div className="pt-4">
              <Button
                size="lg"
                className="w-full text-lg"
                onClick={() => window.location.href = "/api/login"}
              >
                Sign In with Replit
              </Button>
            </div>

            <div className="text-center">
              <p className="text-xs text-gray-500">
                Secure authentication powered by Replit
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center">
          <p className="text-sm text-gray-500">
            Designed for food pantries and community organizations
          </p>
        </div>
      </div>
    </div>
  );
}