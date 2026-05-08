import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";
import { Droplet, LogOut, ArrowLeft } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

const BLOOD_TYPES = ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"];
const URGENCY_LEVELS = ["routine", "urgent", "emergency"];

export default function HospitalRequest() {
  const { user, logout } = useAuth();
  const [, navigate] = useLocation();
  const [formData, setFormData] = useState({
    hospitalName: "",
    bloodType: "",
    quantity: 1,
    urgency: "routine",
    patientName: "",
    reason: "",
  });

  const submitMutation = trpc.request.submit.useMutation();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await submitMutation.mutateAsync({
        hospitalName: formData.hospitalName,
        bloodType: formData.bloodType as any,
        quantity: formData.quantity,
        urgency: formData.urgency as any,
        patientName: formData.patientName,
        reason: formData.reason,
      });
      toast.success("Blood request submitted successfully!");
      navigate("/hospital/dashboard");
    } catch (error) {
      toast.error("Failed to submit request. Please try again.");
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

      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Button
          onClick={() => navigate("/hospital/dashboard")}
          variant="outline"
          className="gap-2 mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Button>

        <Card className="p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Submit Blood Request</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Hospital Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Hospital Name *</label>
              <input
                type="text"
                required
                value={formData.hospitalName}
                onChange={(e) => setFormData({ ...formData, hospitalName: e.target.value })}
                placeholder="Enter hospital name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>

            {/* Blood Type */}
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

            {/* Quantity */}
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

            {/* Urgency */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Urgency Level *</label>
              <select
                required
                value={formData.urgency}
                onChange={(e) => setFormData({ ...formData, urgency: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                {URGENCY_LEVELS.map((level) => (
                  <option key={level} value={level}>
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Patient Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Patient Name</label>
              <input
                type="text"
                value={formData.patientName}
                onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                placeholder="Enter patient name (optional)"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>

            {/* Reason */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Reason for Request</label>
              <textarea
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                placeholder="Describe the medical reason for this blood request..."
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>

            {/* Urgency Alert */}
            {formData.urgency === "emergency" && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-800">
                  This request has been marked as emergency. Our team will prioritize matching available blood units.
                </p>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex gap-4">
              <Button
                type="button"
                onClick={() => navigate("/hospital/dashboard")}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submitMutation.isPending || !formData.hospitalName || !formData.bloodType}
                className="flex-1 bg-red-600 hover:bg-red-700"
              >
                {submitMutation.isPending ? "Submitting..." : "Submit Request"}
              </Button>
            </div>
          </form>
        </Card>
      </main>
    </div>
  );
}
