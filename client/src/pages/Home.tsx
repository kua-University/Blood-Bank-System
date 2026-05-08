import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { getLoginUrl } from "@/const";
import { useLocation } from "wouter";
import { Droplet, Users, Heart, Shield } from "lucide-react";

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      if (user?.role === "donor") navigate("/donor/dashboard");
      else if (user?.role === "hospital_staff") navigate("/hospital/dashboard");
      else if (user?.role === "admin") navigate("/admin/dashboard");
    } else {
      window.location.href = getLoginUrl();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50">
      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Droplet className="w-8 h-8 text-red-600" />
            <span className="text-2xl font-bold text-gray-900">BloodBank</span>
          </div>
          <div className="flex gap-4">
            {isAuthenticated ? (
              <>
                <span className="text-sm text-gray-600 py-2">Welcome, {user?.name}</span>
                <Button onClick={() => navigate(user?.role === "donor" ? "/donor/dashboard" : user?.role === "hospital_staff" ? "/hospital/dashboard" : "/admin/dashboard")} variant="default">
                  Dashboard
                </Button>
              </>
            ) : (
              <Button onClick={() => (window.location.href = getLoginUrl())} variant="default">
                Sign In
              </Button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
          Save Lives with <span className="text-red-600">BloodBank</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          A modern, secure platform connecting blood donors with hospitals. Real-time inventory tracking, intelligent matching, and seamless coordination for critical blood supplies.
        </p>
        <Button onClick={handleGetStarted} size="lg" className="bg-red-600 hover:bg-red-700">
          Get Started
        </Button>
      </section>

      {/* Features Section */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-900">Key Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Droplet className="w-12 h-12 text-red-600" />}
              title="Real-Time Inventory"
              description="Track blood stock levels by type with live updates and intelligent alerts."
            />
            <FeatureCard
              icon={<Users className="w-12 h-12 text-blue-600" />}
              title="Donor Management"
              description="Streamlined registration and profile management for blood donors."
            />
            <FeatureCard
              icon={<Heart className="w-12 h-12 text-pink-600" />}
              title="Smart Matching"
              description="Automatic blood type matching engine linking donors to hospital requests."
            />
            <FeatureCard
              icon={<Shield className="w-12 h-12 text-green-600" />}
              title="Secure & Compliant"
              description="Enterprise-grade security with role-based access and audit logging."
            />
            <FeatureCard
              icon={<Users className="w-12 h-12 text-purple-600" />}
              title="Role-Based Access"
              description="Tailored interfaces for donors, hospital staff, and administrators."
            />
            <FeatureCard
              icon={<Heart className="w-12 h-12 text-orange-600" />}
              title="Emergency Alerts"
              description="Real-time notifications for urgent blood requests and matches."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-red-600 to-red-700 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Make a Difference?</h2>
          <p className="text-red-100 mb-8">Join our platform and help save lives through efficient blood bank management.</p>
          <Button onClick={handleGetStarted} size="lg" variant="secondary">
            Start Now
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2026 BloodBank. All rights reserved. Saving lives through technology.</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="p-8 rounded-lg border border-gray-200 hover:border-red-300 hover:shadow-lg transition-all">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
