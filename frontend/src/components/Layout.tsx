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
    <div className={`min-h-screen gradient-surface ${isRTL ? 'font-arabic' : 'font-sans'}`}>
      {/* Professional Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-xl border-b border-border/50 shadow-soft">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="w-10 h-10 gradient-hero rounded-2xl flex items-center justify-center shadow-medium group-hover:shadow-large transition-all duration-300">
                  <span className="text-white font-bold text-lg">☪</span>
                </div>
                <div className="absolute -inset-0.5 gradient-hero rounded-2xl opacity-30 blur-sm group-hover:opacity-50 transition-opacity duration-300"></div>
              </div>
              <div className="hidden sm:block">
                <span className="font-display font-bold text-xl bg-gradient-to-r from-primary via-primary to-secondary bg-clip-text text-transparent">
                  {t("app.name")}
                </span>
              </div>
            </Link>
            
            <div className="flex items-center gap-1">
              {location.pathname !== "/about" && (
                <Button asChild variant="ghost" size="sm" className="font-medium hover:bg-primary/10">
                  <Link to="/about">{t("nav.about")}</Link>
                </Button>
              )}
              {location.pathname !== "/admin" && (
                <Button asChild variant="ghost" size="sm" className="font-medium hover:bg-primary/10">
                  <Link to="/admin">{t("nav.admin")}</Link>
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={toggleLanguage}
                className="flex items-center gap-2 border-primary/20 hover:border-primary/40 hover:bg-primary/5 transition-all duration-200"
              >
                <Globe className="h-4 w-4" />
                <span className="font-medium">{language === "en" ? "عربي" : "EN"}</span>
              </Button>
            </div>
          </div>
        </div>
      </header>
      
      <main className="pt-16">{children}</main>
      
      <footer className="border-t border-border/30 bg-card/80 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-8">
          <p className="text-center text-sm text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {t("footer.disclaimer")}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;