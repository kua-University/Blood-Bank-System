import { Button } from "@/components/ui/button";
import { getLoginUrl } from "@/const";
import { Droplet } from "lucide-react";

export default function Login() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-xl p-8 border border-gray-200">
          <div className="flex items-center justify-center gap-3 mb-8">
            <Droplet className="w-10 h-10 text-red-600" />
            <h1 className="text-3xl font-bold text-gray-900">BloodBank</h1>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">Welcome Back</h2>
          <p className="text-gray-600 text-center mb-8">Sign in to manage blood donations and requests</p>

          <Button
            onClick={() => (window.location.href = getLoginUrl())}
            size="lg"
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold"
          >
            Sign In with Manus
          </Button>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 text-center">
              First time here?{" "}
              <Button variant="link" className="p-0 text-red-600 hover:text-red-700">
                Create an account
              </Button>
            </p>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-gray-600">
          <p>Secure login powered by Manus OAuth</p>
        </div>
      </div>
    </div>
  );
}
