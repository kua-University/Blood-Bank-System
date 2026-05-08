import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import DashboardLayout from "./components/DashboardLayout";
import DonorDashboard from "./pages/donor/Dashboard";
import DonorRegistration from "./pages/donor/Registration";
import HospitalDashboard from "./pages/hospital/Dashboard";
import HospitalRequest from "./pages/hospital/Request";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminInventory from "./pages/admin/Inventory";
import AdminAuditLog from "./pages/admin/AuditLog";
import { useAuth } from "./_core/hooks/useAuth";
import { Loader2 } from "lucide-react";

function ProtectedRoute({ component: Component, requiredRole }: { component: any; requiredRole?: string }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin w-8 h-8" />
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <NotFound />;
  }

  return <Component />;
}

function Router() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin w-8 h-8" />
      </div>
    );
  }

  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/login" component={Login} />

      {/* Donor Routes */}
      <Route path="/donor/dashboard" component={() => <ProtectedRoute component={DonorDashboard} requiredRole="donor" />} />
      <Route path="/donor/register" component={() => <ProtectedRoute component={DonorRegistration} requiredRole="donor" />} />

      {/* Hospital Staff Routes */}
      <Route path="/hospital/dashboard" component={() => <ProtectedRoute component={HospitalDashboard} requiredRole="hospital_staff" />} />
      <Route path="/hospital/request" component={() => <ProtectedRoute component={HospitalRequest} requiredRole="hospital_staff" />} />

      {/* Admin Routes */}
      <Route path="/admin/dashboard" component={() => <ProtectedRoute component={AdminDashboard} requiredRole="admin" />} />
      <Route path="/admin/inventory" component={() => <ProtectedRoute component={AdminInventory} requiredRole="admin" />} />
      <Route path="/admin/audit-log" component={() => <ProtectedRoute component={AdminAuditLog} requiredRole="admin" />} />

      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
