import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";
import { Droplet, LogOut, ChevronRight, ChevronLeft } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

const BLOOD_TYPES = ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"];

export default function DonorRegistration() {
  const { user, logout } = useAuth();
  const [, navigate] = useLocation();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    bloodType: "",
    dateOfBirth: "",
    phone: "",
    address: "",
    medicalHistory: "",
  });

  const registerMutation = trpc.donor.register.useMutation();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async () => {
    try {
      await registerMutation.mutateAsync({
        bloodType: formData.bloodType as any,
        dateOfBirth: new Date(formData.dateOfBirth),
        phone: formData.phone,
        address: formData.address,
        medicalHistory: formData.medicalHistory,
      });
      toast.success("Registration completed successfully!");
      navigate("/donor/dashboard");
    } catch (error) {
      toast.error("Registration failed. Please try again.");
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
        <Card className="p-8">
          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex justify-between mb-4">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                      s <= step ? "bg-red-600 text-white" : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {s}
                  </div>
                  {s < 3 && <div className={`flex-1 h-1 mx-2 ${s < step ? "bg-red-600" : "bg-gray-200"}`} />}
                </div>
              ))}
            </div>
            <div className="text-sm text-gray-600">
              Step {step} of 3: {step === 1 ? "Personal Information" : step === 2 ? "Medical History" : "Confirmation"}
            </div>
          </div>

          {/* Step 1: Personal Information */}
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Personal Information</h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Blood Type *</label>
                <select
                  value={formData.bloodType}
                  onChange={(e) => setFormData({ ...formData, bloodType: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="">Select your blood type</option>
                  {BLOOD_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth *</label>
                <input
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+1 (555) 000-0000"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
            </div>
          )}

          {/* Step 2: Medical History */}
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Medical Information</h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Address *</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="123 Main Street, City, State ZIP"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Medical History</label>
                <textarea
                  value={formData.medicalHistory}
                  onChange={(e) => setFormData({ ...formData, medicalHistory: e.target.value })}
                  placeholder="Any relevant medical conditions or medications..."
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
            </div>
          )}

          {/* Step 3: Confirmation */}
          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Confirm Your Information</h2>

              <div className="bg-gray-50 p-6 rounded-lg space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Blood Type:</span>
                  <span className="font-semibold text-gray-900">{formData.bloodType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date of Birth:</span>
                  <span className="font-semibold text-gray-900">{formData.dateOfBirth}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Phone:</span>
                  <span className="font-semibold text-gray-900">{formData.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Address:</span>
                  <span className="font-semibold text-gray-900">{formData.address}</span>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  By confirming, you agree to provide accurate information and comply with blood donation guidelines.
                </p>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <Button
              onClick={handlePrev}
              variant="outline"
              disabled={step === 1}
              className="gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>

            {step < 3 ? (
              <Button
                onClick={handleNext}
                disabled={
                  (step === 1 && (!formData.bloodType || !formData.dateOfBirth || !formData.phone)) ||
                  (step === 2 && !formData.address)
                }
                className="gap-2 bg-red-600 hover:bg-red-700"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={registerMutation.isPending}
                className="bg-red-600 hover:bg-red-700"
              >
                {registerMutation.isPending ? "Registering..." : "Complete Registration"}
              </Button>
            )}
          </div>
        </Card>
      </main>
    </div>
  );
}
