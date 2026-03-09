import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Language = "en" | "ar";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isRTL: boolean;
}

const translations: Record<string, Record<Language, string>> = {
  // Header
  "app.name": {
    en: "Islamic Knowledge Assistant",
    ar: "مساعد المعرفة الإسلامية"
  },
  "nav.chat": {
    en: "Ask",
    ar: "اسأل"
  },
  "nav.sources": {
    en: "Sources",
    ar: "المصادر"
  },
  "nav.about": {
    en: "About",
    ar: "عن المشروع"
  },
  "nav.admin": {
    en: "Admin",
    ar: "الإدارة"
  },

  // Chat
  "chat.welcome": {
    en: "Assalamu Alaikum! Ask me anything about Islam based on authentic sources.",
    ar: "السلام عليكم! اسألني أي سؤال عن الإسلام استناداً إلى المصادر الموثوقة."
  },
  "chat.placeholder": {
    en: "Ask your Islamic question here...",
    ar: "اكتب سؤالك الإسلامي هنا..."
  },
  "chat.searching": {
    en: "Searching sources...",
    ar: "جاري البحث في المصادر..."
  },
  "chat.sources": {
    en: "Sources",
    ar: "المصادر"
  },
  "chat.noAnswer": {
    en: "I could not find this answer in the approved Islamic sources. Please consult a qualified scholar.",
    ar: "لم أتمكن من إيجاد الإجابة في المصادر الإسلامية المعتمدة. يرجى استشارة عالم مؤهل."
  },
  "chat.disclaimer": {
    en: "This assistant uses approved sources only. Consult scholars for personal rulings.",
    ar: "هذا المساعد يستخدم مصادر معتمدة فقط. استشر العلماء للفتاوى الشخصية."
  },
  "chat.viewSources": {
    en: "View All Sources",
    ar: "عرض جميع المصادر"
  },

  // Sources Page
  "sources.title": {
    en: "Approved Islamic Sources",
    ar: "المصادر الإسلامية المعتمدة"
  },
  "sources.description": {
    en: "All answers are based exclusively on these authenticated sources.",
    ar: "جميع الإجابات مبنية حصرياً على هذه المصادر الموثقة."
  },
  "sources.back": {
    en: "Back to Chat",
    ar: "العودة للمحادثة"
  },

  // About Page
  "about.title": {
    en: "About & Contact",
    ar: "عن المشروع والتواصل"
  },
  "about.methodology": {
    en: "Our Methodology",
    ar: "منهجيتنا"
  },
  "about.contact": {
    en: "Contact Us",
    ar: "تواصل معنا"
  },
  "about.email": {
    en: "Email",
    ar: "البريد الإلكتروني"
  },

  // Footer
  "footer.disclaimer": {
    en: "This is a learning tool. Please consult qualified scholars for personal guidance.",
    ar: "هذه أداة تعليمية. يرجى استشارة العلماء المؤهلين للإرشاد الشخصي."
  },

  // Admin
  "admin.title": {
    en: "Admin Dashboard",
    ar: "لوحة الإدارة"
  },
  "admin.password": {
    en: "Enter admin password",
    ar: "أدخل كلمة مرور المدير"
  },
  "admin.login": {
    en: "Access Dashboard",
    ar: "الدخول للوحة التحكم"
  },
  "admin.logout": {
    en: "Logout",
    ar: "تسجيل الخروج"
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>("en");

  const isRTL = language === "ar";

  useEffect(() => {
    document.documentElement.dir = isRTL ? "rtl" : "ltr";
    document.documentElement.lang = language;
  }, [language, isRTL]);

  const t = (key: string): string => {
    return translations[key]?.[language] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};