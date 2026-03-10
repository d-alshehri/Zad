import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/Navbar";
import { useLanguage } from "@/contexts/LanguageContext";

const Admin = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const { t } = useLanguage();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/admin/dashboard");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-sm text-center">
          <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8 text-primary-foreground" />
          </div>
          <p className="text-xs uppercase tracking-[0.2em] text-gray-muted mb-2">
            {t("admin.access")}
          </p>
          <p className="text-gray-muted text-sm mb-6">
            {t("admin.accessDesc")}
          </p>
          <div className="bg-card border border-border rounded-xl p-6 mb-4">
            <form onSubmit={handleLogin} className="space-y-4">
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t("admin.password")}
                className="bg-background border-border text-foreground placeholder:text-gray-muted"
              />
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                {t("admin.login")}
              </Button>
            </form>
          </div>
          <p className="text-xs text-gray-muted">{t("admin.prototypeNote")}</p>
        </div>
      </main>
      <footer className="py-6 text-center">
        <p className="text-xs text-gray-muted">© 2026 NurAI — {t("app.subtitle")}</p>
      </footer>
    </div>
  );
};

export default Admin;
