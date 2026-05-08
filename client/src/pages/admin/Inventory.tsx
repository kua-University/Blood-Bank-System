import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";
import { Droplet, LogOut, ArrowLeft, Plus } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

const BLOOD_TYPES = ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"];

export default function AdminInventory() {
  const { user, logout } = useAuth();
  const [, navigate] = useLocation();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    bloodType: "",
    quantity: 1,
    expirationDate: "",
  });

  const { data: inventory, refetch } = trpc.inventory.getAll.useQuery();
  const addMutation = trpc.inventory.addUnit.useMutation();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addMutation.mutateAsync({
        bloodType: formData.bloodType as any,
        quantity: formData.quantity,
        expirationDate: new Date(formData.expirationDate),
      });
      toast.success("Blood unit added successfully!");
      setFormData({ bloodType: "", quantity: 1, expirationDate: "" });
      setShowForm(false);
      refetch();
    } catch (error) {
      toast.error("Failed to add blood unit. Please try again.");
    }
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
        <Button
          onClick={() => navigate("/admin/dashboard")}
          variant="outline"
          className="gap-2 mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Button>

        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Inventory Management</h2>
          <Button onClick={() => setShowForm(!showForm)} size="lg" className="gap-2 bg-red-600 hover:bg-red-700">
            <Plus className="w-4 h-4" />
            Add Blood Unit
          </Button>
        </div>

        {/* Add Form */}
        {showForm && (
          <Card className="p-8 mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Add New Blood Unit</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Blood Type *</label>
                  <select
                    required
                    value={formData.bloodType}
                    onChange={(e) => setFormData({ ...formData, bloodType: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="">Select blood type</option>
                    {BLOOD_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Quantity (Units) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Expiration Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.expirationDate}
                    onChange={(e) => setFormData({ ...formData, expirationDate: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  type="button"
                  onClick={() => setShowForm(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={addMutation.isPending || !formData.bloodType || !formData.expirationDate}
                  className="flex-1 bg-red-600 hover:bg-red-700"
                >
                  {addMutation.isPending ? "Adding..." : "Add Unit"}
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* Inventory Table */}
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Blood Type</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Quantity</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Expiration Date</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Collection Date</th>
                </tr>
              </thead>
              <tbody>
                {inventory && inventory.length > 0 ? (
                  inventory.map((item) => (
                    <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900 font-semibold">{item.bloodType}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{item.quantity}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          item.status === "available"
                            ? "bg-green-100 text-green-800"
                            : item.status === "reserved"
                            ? "bg-yellow-100 text-yellow-800"
                            : item.status === "used"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-red-100 text-red-800"
                        }`}>
                          {item.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {item.expirationDate ? new Date(item.expirationDate).toLocaleDateString() : "N/A"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(item.collectionDate).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-600">
                      No blood units in inventory
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </main>
    </div>
  );
}
