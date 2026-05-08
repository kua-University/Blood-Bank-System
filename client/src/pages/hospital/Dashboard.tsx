import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";
import { Droplet, AlertCircle, CheckCircle, Clock, LogOut } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function HospitalDashboard() {
  const { user, logout } = useAuth();
  const [, navigate] = useLocation();
  const { data: requests } = trpc.request.getAll.useQuery();
  const { data: inventory } = trpc.inventory.getSummary.useQuery();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const pendingRequests = requests?.filter((r) => r.status === "pending") || [];
  const matchedRequests = requests?.filter((r) => r.status === "matched") || [];
  const fulfilledRequests = requests?.filter((r) => r.status === "fulfilled") || [];

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
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Hospital Dashboard</h2>
          <Button onClick={() => navigate("/hospital/request")} size="lg" className="bg-red-600 hover:bg-red-700">
            New Blood Request
          </Button>
        </div>

        {/* Request Status Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <StatusCard
            icon={<Clock className="w-8 h-8 text-yellow-600" />}
            title="Pending Requests"
            value={pendingRequests.length}
            color="yellow"
          />
          <StatusCard
            icon={<CheckCircle className="w-8 h-8 text-green-600" />}
            title="Matched Requests"
            value={matchedRequests.length}
            color="green"
          />
          <StatusCard
            icon={<AlertCircle className="w-8 h-8 text-blue-600" />}
            title="Fulfilled Requests"
            value={fulfilledRequests.length}
            color="blue"
          />
        </div>

        {/* Blood Inventory */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Available Blood Inventory</h3>
          <div className="grid md:grid-cols-4 gap-4">
            {Object.entries(inventory || {}).map(([bloodType, quantity]) => (
              <Card key={bloodType} className="p-6 text-center hover:shadow-lg transition-shadow">
                <div className="text-3xl font-bold text-red-600 mb-2">{quantity}</div>
                <div className="text-sm text-gray-600">Units of {bloodType}</div>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Requests */}
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Recent Requests</h3>
          {requests && requests.length > 0 ? (
            <div className="space-y-4">
              {requests.slice(0, 5).map((request) => (
                <Card key={request.id} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-gray-900">{request.hospitalName}</h4>
                      <p className="text-sm text-gray-600">Patient: {request.patientName || "N/A"}</p>
                      <p className="text-sm text-gray-600">Blood Type: {request.bloodType}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-red-600">{request.quantity}</div>
                      <div className={`text-xs font-semibold px-3 py-1 rounded-full ${
                        request.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : request.status === "matched"
                          ? "bg-green-100 text-green-800"
                          : "bg-blue-100 text-blue-800"
                      }`}>
                        {request.status.toUpperCase()}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center">
              <p className="text-gray-600">No requests yet</p>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}

function StatusCard({
  icon,
  title,
  value,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  value: number;
  color: string;
}) {
  return (
    <Card className={`p-6 border-l-4 border-${color}-600 hover:shadow-lg transition-shadow`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-600 text-sm mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div>{icon}</div>
      </div>
    </Card>
  );
}
