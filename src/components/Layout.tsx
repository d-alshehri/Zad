import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Globe } from "lucide-react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const { language, setLanguage, t, isRTL } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "ar" : "en");
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-background via-background to-accent/20 ${isRTL ? 'font-arabic' : ''}`}>
      {/* Minimal Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-md border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-9 h-9 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-primary-foreground font-bold text-sm">☪</span>
              </div>
              <span className="font-semibold text-lg hidden sm:block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                {t("app.name")}
              </span>
            </Link>
            
            <div className="flex items-center gap-2">
              {location.pathname !== "/about" && (
                <Button asChild variant="ghost" size="sm">
                  <Link to="/about">{t("nav.about")}</Link>
                </Button>
              )}
              {location.pathname !== "/admin" && (
                <Button asChild variant="ghost" size="sm">
                  <Link to="/admin">{t("nav.admin")}</Link>
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={toggleLanguage}
                className="flex items-center gap-1"
              >
                <Globe className="h-4 w-4" />
                <span>{language === "en" ? "عربي" : "EN"}</span>
              </Button>
            </div>
          </div>
        </div>
      </header>
      
      <main className="pt-14">{children}</main>
      
      <footer className="border-t bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-sm text-muted-foreground">
            {t("footer.disclaimer")}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;