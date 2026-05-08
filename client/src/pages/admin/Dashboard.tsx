import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";
import { Droplet, Users, AlertCircle, LogOut, BarChart3 } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [, navigate] = useLocation();
  const { data: requests } = trpc.request.getAll.useQuery();
  const { data: inventory } = trpc.inventory.getSummary.useQuery();
  const { data: auditLogs } = trpc.audit.getAll.useQuery();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const totalRequests = requests?.length || 0;
  const totalUnits = Object.values(inventory || {}).reduce((sum, val) => sum + (val as number), 0);
  const totalAuditEntries = auditLogs?.length || 0;

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
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h2>

        {/* Key Metrics */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <MetricCard
            icon={<Droplet className="w-8 h-8 text-red-600" />}
            title="Total Blood Units"
            value={totalUnits}
          />
          <MetricCard
            icon={<AlertCircle className="w-8 h-8 text-yellow-600" />}
            title="Active Requests"
            value={totalRequests}
          />
          <MetricCard
            icon={<BarChart3 className="w-8 h-8 text-blue-600" />}
            title="Audit Entries"
            value={totalAuditEntries}
          />
          <MetricCard
            icon={<Users className="w-8 h-8 text-green-600" />}
            title="System Status"
            value="Operational"
          />
        </div>

        {/* Management Sections */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <Card className="p-8 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/admin/inventory")}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Inventory Management</h3>
                <p className="text-gray-600 text-sm mt-1">Add, update, and track blood units</p>
              </div>
              <Droplet className="w-8 h-8 text-red-600" />
            </div>
            <Button variant="outline" className="w-full mt-4">
              Manage Inventory
            </Button>
          </Card>

          <Card className="p-8 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/admin/audit-log")}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Audit Logs</h3>
                <p className="text-gray-600 text-sm mt-1">View all system activities and changes</p>
              </div>
              <BarChart3 className="w-8 h-8 text-blue-600" />
            </div>
            <Button variant="outline" className="w-full mt-4">
              View Audit Logs
            </Button>
          </Card>
        </div>

        {/* Blood Inventory Overview */}
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Blood Inventory Overview</h3>
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

function MetricCard({ icon, title, value }: { icon: React.ReactNode; title: string; value: string | number }) {
  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div>{icon}</div>
      </div>
      <p className="text-gray-600 text-sm mb-1">{title}</p>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </Card>
  );
}
