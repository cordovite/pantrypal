import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { Download, FileText, TrendingUp, Package, Heart, Users } from "lucide-react";

export default function Reports() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const [dateRange, setDateRange] = useState({
    from: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    to: new Date().toISOString().split('T')[0],
  });
  const [reportType, setReportType] = useState("overview");

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

  const { data: stats } = useQuery({
    queryKey: ["/api/dashboard/stats"],
    retry: false,
  });

  const { data: inventory = [] } = useQuery({
    queryKey: ["/api/inventory"],
    retry: false,
  });

  const { data: donations = [] } = useQuery({
    queryKey: ["/api/donations"],
    retry: false,
  });

  const { data: distributions = [] } = useQuery({
    queryKey: ["/api/distributions"],
    retry: false,
  });

  // Prepare chart data
  const inventoryByCategory = inventory.reduce((acc: any, item: any) => {
    acc[item.category] = (acc[item.category] || 0) + item.quantity;
    return acc;
  }, {});

  const inventoryChartData = Object.entries(inventoryByCategory).map(([category, quantity]) => ({
    category,
    quantity,
  }));

  const donationsByType = donations.reduce((acc: any, donation: any) => {
    acc[donation.donationType] = (acc[donation.donationType] || 0) + 1;
    return acc;
  }, {});

  const donationsChartData = Object.entries(donationsByType).map(([type, count]) => ({
    type: type.charAt(0).toUpperCase() + type.slice(1),
    count,
  }));

  const monthlyDonations = donations.reduce((acc: any, donation: any) => {
    const month = new Date(donation.donationDate).toLocaleString('default', { month: 'short' });
    acc[month] = (acc[month] || 0) + 1;
    return acc;
  }, {});

  const monthlyDonationsData = Object.entries(monthlyDonations).map(([month, count]) => ({
    month,
    donations: count,
  }));

  const COLORS = ['#059669', '#0D9488', '#10B981', '#34D399', '#6EE7B7'];

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
      <div className="sm:flex sm:items-center mb-8">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="mt-2 text-sm text-gray-700">
            View comprehensive reports and analytics for your food bank operations.
          </p>
        </div>

      </div>

      {/* Report Filters */}
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div>
            <Label htmlFor="report-type">Report Type</Label>
            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="overview">Overview</SelectItem>
                <SelectItem value="inventory">Inventory</SelectItem>
                <SelectItem value="donations">Donations</SelectItem>
                <SelectItem value="distributions">Distributions</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="date-from">Date From</Label>
            <Input
              id="date-from"
              type="date"
              value={dateRange.from}
              onChange={(e) => setDateRange(prev => ({ ...prev, from: e.target.value }))}
            />
          </div>
          <div>
            <Label htmlFor="date-to">Date To</Label>
            <Input
              id="date-to"
              type="date"
              value={dateRange.to}
              onChange={(e) => setDateRange(prev => ({ ...prev, to: e.target.value }))}
            />
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalItems || 0}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 inline mr-1" />
              In inventory
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Donations</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.monthlyDonations || 0}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Families Served</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.familiesServed || 0}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Alerts</CardTitle>
            <Package className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats?.lowStockCount || 0}</div>
            <p className="text-xs text-muted-foreground">Need attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Inventory by Category */}
        <Card>
          <CardHeader>
            <CardTitle>Inventory by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={inventoryChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="quantity" fill="#059669" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Donations by Type */}
        <Card>
          <CardHeader>
            <CardTitle>Donations by Type</CardTitle>
          </CardHeader>
          <CardContent>
            {donationsChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={donationsChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {donationsChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-gray-500">
                <div className="text-center">
                  <Heart className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No donation data available</p>
                  <p className="text-sm">Start logging donations to see charts here</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Monthly Donations Trend */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Monthly Donations Trend</CardTitle>
        </CardHeader>
        <CardContent>
          {monthlyDonationsData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyDonationsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="donations" stroke="#059669" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-gray-500">
              <div className="text-center">
                <TrendingUp className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No donation trend data available</p>
                <p className="text-sm">Start logging donations to see trends here</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Summary Report */}
      <Card>
        <CardHeader>
          <CardTitle>Summary Report</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none">
            <h3 className="text-lg font-semibold mb-4">Report Period: {dateRange.from} to {dateRange.to}</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-2">Inventory Overview</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>Total items in inventory: {stats?.totalItems || 0}</li>
                  <li>Low stock items: {stats?.lowStockCount || 0}</li>
                  <li>Items expiring soon: {stats?.expiringCount || 0}</li>
                  <li>Most stocked category: {inventoryChartData.length > 0 ? inventoryChartData.reduce((a, b) => a.quantity > b.quantity ? a : b).category : 'N/A'}</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Donations & Distributions</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>Total donations this month: {stats?.monthlyDonations || 0}</li>
                  <li>Total families served: {stats?.familiesServed || 0}</li>
                  <li>Upcoming events: {stats?.upcomingEvents || 0}</li>
                  <li>Most common donation type: {donationsChartData.length > 0 ? donationsChartData.reduce((a, b) => a.count > b.count ? a : b).type : 'N/A'}</li>
                </ul>
              </div>
            </div>

            <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
              <h4 className="font-medium text-yellow-800 mb-2">Recommendations</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                {stats?.lowStockCount > 0 && <li>Consider reaching out to donors for items with low stock</li>}
                {stats?.expiringCount > 0 && <li>Schedule distribution events to prioritize expiring items</li>}
                <li>Continue tracking donation patterns to predict future inventory needs</li>
                <li>Regular inventory audits help maintain accurate stock levels</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
