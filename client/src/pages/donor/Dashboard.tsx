import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";
import { Droplet, Heart, Calendar, LogOut } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function DonorDashboard() {
  const { user, logout } = useAuth();
  const [, navigate] = useLocation();
  const { data: donor } = trpc.donor.getProfile.useQuery();
  const { data: inventory } = trpc.inventory.getSummary.useQuery();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Droplet className="w-8 h-8 text-red-600" />
            <h1 className="text-2xl font-bold text-gray-900">BloodBank</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">{user?.name}</span>
            <Button onClick={handleLogout} variant="outline" size="sm" className="gap-2">
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Donor Dashboard</h2>

        {!donor ? (
          <Card className="p-8 text-center">
            <Heart className="w-16 h-16 text-red-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Complete Your Profile</h3>
            <p className="text-gray-600 mb-6">Register your blood type and medical information to become an active donor.</p>
            <Button onClick={() => navigate("/donor/register")} size="lg" className="bg-red-600 hover:bg-red-700">
              Register Now
            </Button>
          </Card>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            <DashboardCard
              icon={<Droplet className="w-8 h-8 text-red-600" />}
              title="Blood Type"
              value={donor.bloodType}
            />
            <DashboardCard
              icon={<Calendar className="w-8 h-8 text-blue-600" />}
              title="Last Donation"
              value={donor.lastDonationDate ? new Date(donor.lastDonationDate).toLocaleDateString() : "Never"}
            />
            <DashboardCard
              icon={<Heart className="w-8 h-8 text-pink-600" />}
              title="Status"
              value={donor.isEligible ? "Eligible" : "Not Eligible"}
            />
          </div>
        )}

        {/* Blood Inventory Summary */}
        <div className="mt-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Current Blood Inventory</h3>
          <div className="grid md:grid-cols-4 gap-4">
            {Object.entries(inventory || {}).map(([bloodType, quantity]) => (
              <Card key={bloodType} className="p-6 text-center hover:shadow-lg transition-shadow">
                <div className="text-3xl font-bold text-red-600 mb-2">{quantity}</div>
                <div className="text-sm text-gray-600">Units of {bloodType}</div>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

function DashboardCard({ icon, title, value }: { icon: React.ReactNode; title: string; value: string }) {
  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div>{icon}</div>
      </div>
      <p className="text-gray-600 text-sm mb-1">{title}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </Card>
  );
}
