import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Users, DollarSign, Package } from "lucide-react";
import AddDonationModal from "@/components/donations/add-donation-modal";
import type { Donation } from "@shared/schema";

export default function Donations() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const [showAddModal, setShowAddModal] = useState(false);
  const [filters, setFilters] = useState({
    donationType: "all",
    dateFrom: "",
    dateTo: "",
  });

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

  const { data: donations = [], isLoading: donationsLoading } = useQuery({
    queryKey: ["/api/donations", filters],
    retry: false,
  });

  const deleteDonationMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/donations/${id}`);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Donation deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/donations"] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
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
      toast({
        title: "Error",
        description: "Failed to delete donation",
        variant: "destructive",
      });
    },
  });

  const getDonationTypeIcon = (type: string) => {
    switch (type) {
      case "food":
        return <Package className="h-4 w-4" />;
      case "monetary":
        return <DollarSign className="h-4 w-4" />;
      default:
        return <Heart className="h-4 w-4" />;
    }
  };

  const getDonationTypeBadge = (type: string) => {
    const colors = {
      food: "bg-green-100 text-green-800",
      monetary: "bg-blue-100 text-blue-800",
      other: "bg-purple-100 text-purple-800",
    };
    
    return (
      <Badge className={colors[type as keyof typeof colors] || colors.other}>
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </Badge>
    );
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleDeleteDonation = async (id: number, donorName: string) => {
    if (window.confirm(`Are you sure you want to delete the donation from "${donorName}"?`)) {
      deleteDonationMutation.mutate(id);
    }
  };

  // Calculate summary stats
  const totalDonations = donations.length;
  const foodDonations = donations.filter((d: Donation) => d.donationType === "food").length;
  const monetaryTotal = donations
    .filter((d: Donation) => d.donationType === "monetary")
    .reduce((sum: number, d: Donation) => sum + (parseFloat(d.value || "0")), 0);

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
          <h1 className="text-2xl font-bold text-gray-900">Donation Management</h1>
          <p className="mt-2 text-sm text-gray-700">
            Track and manage donations from individuals and organizations.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <Button onClick={() => setShowAddModal(true)}>
            <Heart className="h-4 w-4 mr-2" />
            Record Donation
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Donations</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDonations}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Food Donations</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{foodDonations}</div>
            <p className="text-xs text-muted-foreground">Food items received</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monetary Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${monetaryTotal.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Cash donations</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unique Donors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(donations.map((d: Donation) => d.donorEmail || d.donorName)).size}
            </div>
            <p className="text-xs text-muted-foreground">Individual contributors</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div>
            <Label htmlFor="donation-type">Donation Type</Label>
            <Select value={filters.donationType} onValueChange={(value) => handleFilterChange("donationType", value)}>
              <SelectTrigger>
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="food">Food</SelectItem>
                <SelectItem value="monetary">Monetary</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="date-from">Date From</Label>
            <Input
              id="date-from"
              type="date"
              value={filters.dateFrom}
              onChange={(e) => handleFilterChange("dateFrom", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="date-to">Date To</Label>
            <Input
              id="date-to"
              type="date"
              value={filters.dateTo}
              onChange={(e) => handleFilterChange("dateTo", e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Donations Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Donation Records</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            {donations.length} donations recorded
          </p>
        </div>
        
        {donationsLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-sm text-gray-500">Loading donations...</p>
          </div>
        ) : donations.length === 0 ? (
          <div className="p-8 text-center">
            <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">No donations recorded yet.</p>
            <Button onClick={() => setShowAddModal(true)}>
              Record Your First Donation
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Donor</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {donations.map((donation: Donation) => (
                  <TableRow key={donation.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{donation.donorName}</div>
                        {donation.donorEmail && (
                          <div className="text-sm text-gray-500">{donation.donorEmail}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getDonationTypeIcon(donation.donationType)}
                        {getDonationTypeBadge(donation.donationType)}
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {donation.description || "No description"}
                    </TableCell>
                    <TableCell>
                      {donation.value ? `$${parseFloat(donation.value).toFixed(2)}` : "N/A"}
                    </TableCell>
                    <TableCell>
                      {new Date(donation.donationDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-900"
                        onClick={() => handleDeleteDonation(donation.id, donation.donorName)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Add Donation Modal */}
      <AddDonationModal
        open={showAddModal}
        onOpenChange={setShowAddModal}
      />
    </div>
  );
}
