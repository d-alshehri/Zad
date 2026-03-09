import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Admin = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Any password works for prototype
    navigate("/admin/dashboard");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-sm text-center">
          {/* Icon */}
          <div className="w-16 h-16 bg-purple rounded-xl flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8 text-white" />
          </div>

          {/* Heading */}
          <p className="text-xs uppercase tracking-[0.2em] text-gray-muted mb-2">
            Admin Access
          </p>
          <p className="text-gray-muted text-sm mb-6">
            Enter the admin password to access the dashboard.
          </p>

          {/* Login Card */}
          <div className="bg-white rounded-xl p-6 mb-4">
            <form onSubmit={handleLogin} className="space-y-4">
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400"
              />
              <Button
                type="submit"
                className="w-full bg-purple hover:bg-purple/90 text-white"
              >
                Enter
              </Button>
            </form>
          </div>

          <p className="text-xs text-gray-muted">
            This is a prototype UI — not connected to a real backend.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center">
        <p className="text-xs text-gray-muted">
          © 2026 NurAI — Islamic Knowledge Assistant
        </p>
      </footer>
    </div>
  );
};

export default Admin;
