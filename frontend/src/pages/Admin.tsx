import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/Navbar";
import { useLanguage } from "@/contexts/LanguageContext";

// The admin password is set in your frontend .env as VITE_ADMIN_PASSWORD
// It should match the ADMIN_PASSWORD in your backend .env
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || "admin";

const Admin = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const { t, language } = useLanguage();
  const appName = language === "ar" ? "زاد" : "Zad";

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setError(false);
      navigate("/admin/dashboard");
    } else {
      setError(true);
      setPassword("");
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-sm text-center">
          <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8 text-primary-foreground" />
          </div>
          <p className="text-xs uppercase tracking-[0.2em] text-gray-muted mb-2">{t("admin.access")}</p>
          <p className="text-gray-muted text-sm mb-6">{t("admin.accessDesc")}</p>
          <div className="bg-card border border-border rounded-xl p-6 mb-4">
            <form onSubmit={handleLogin} className="space-y-4">
              <Input
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(false); }}
                placeholder={t("admin.password")}
                className={`bg-background border-border text-foreground placeholder:text-gray-muted ${error ? "border-red-500" : ""}`}
              />
              {error && <p className="text-red-400 text-xs text-left">Incorrect password</p>}
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                {t("admin.login")}
              </Button>
            </form>
          </div>
          <p className="text-xs text-gray-muted">Set your password in the <code className="bg-card px-1 rounded">.env</code> file</p>
        </div>
      </main>
      <footer className="py-6 text-center">
        <p className="text-xs text-gray-muted">© 2026 {appName} — {t("app.subtitle")}</p>
      </footer>
    </div>
  );
};

export default Admin;
