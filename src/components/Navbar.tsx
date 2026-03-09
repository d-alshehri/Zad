import { Link, useLocation } from "react-router-dom";
import { Moon, Globe, MessageSquare, BookOpen, Info } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const Navbar = () => {
  const location = useLocation();
  const { language, setLanguage, t, isRTL } = useLanguage();

  const navLinks = [
    { path: "/", label: t("nav.chat"), icon: MessageSquare },
    { path: "/sources", label: t("nav.sources"), icon: BookOpen },
    { path: "/about", label: t("nav.about"), icon: Info },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 w-full bg-background border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Left: Logo */}
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-card rounded-lg flex items-center justify-center border border-border">
            <Moon className="w-5 h-5 text-gold" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center">
              <span className="font-bold text-lg text-white">Nur</span>
              <span className="font-bold text-lg text-gold">AI</span>
            </div>
            <span className="text-[10px] uppercase tracking-widest text-gray-muted">
              {t("app.subtitle")}
            </span>
          </div>
        </Link>

        {/* Center: Nav Links */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center gap-2 text-sm transition-colors ${
                isActive(link.path)
                  ? "text-white"
                  : "text-gray-muted hover:text-white"
              }`}
            >
              <link.icon className="w-4 h-4" />
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right: Language & Settings */}
        <div className="flex items-center gap-3">
          <Globe className="w-4 h-4 text-gray-muted" />
          <button
            onClick={() => setLanguage(language === "en" ? "ar" : "en")}
            className="px-3 py-1.5 text-sm border border-border rounded-full text-gray-muted hover:text-white hover:border-gray-muted transition-colors"
          >
            {language === "en" ? "العربية" : "English"}
          </button>
          <Link to="/admin" className="px-3 py-1.5 text-sm text-gray-muted hover:text-white transition-colors">
            Admin
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
