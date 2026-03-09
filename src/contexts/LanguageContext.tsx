import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Language = "en" | "ar";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isRTL: boolean;
}

const translations: Record<string, Record<Language, string>> = {
  // App branding
  "app.name": {
    en: "NurAI",
    ar: "نور الذكاء"
  },
  "app.subtitle": {
    en: "Islamic Knowledge Assistant",
    ar: "مساعد المعرفة الإسلامية"
  },
  "app.description": {
    en: "Ask about Islamic teachings, rulings, and guidance powered by trusted scholarly sources.",
    ar: "اسأل عن التعاليم والأحكام والإرشاد الإسلامي مدعوماً بمصادر علمية موثوقة."
  },

  // Navigation
  "nav.chat": {
    en: "Chat",
    ar: "المحادثة"
  },
  "nav.sources": {
    en: "Sources",
    ar: "المصادر"
  },
  "nav.about": {
    en: "About & Contact",
    ar: "عن المشروع والتواصل"
  },
  "nav.admin": {
    en: "Admin",
    ar: "الإدارة"
  },
  "nav.settings": {
    en: "Settings",
    ar: "الإعدادات"
  },

  // Chat interface
  "chat.welcome": {
    en: "Assalamu Alaikum! I'm NurAI, your Islamic knowledge assistant.",
    ar: "السلام عليكم! أنا نور الذكاء، مساعدك للمعرفة الإسلامية."
  },
  "chat.placeholder": {
    en: "Ask a question about Islamic knowledge...",
    ar: "اسأل سؤالاً عن المعرفة الإسلامية..."
  },
  "chat.viewSources": {
    en: "View Sources",
    ar: "عرض المصادر"
  },
  "chat.suggestedQuestions": {
    en: "Suggested Questions",
    ar: "أسئلة مقترحة"
  },
  "chat.send": {
    en: "Send",
    ar: "إرسال"
  },
  "chat.thinking": {
    en: "Searching authentic sources...",
    ar: "جاري البحث في المصادر الموثوقة..."
  },

  // Suggested questions
  "question.prayer": {
    en: "What are the conditions for a valid prayer?",
    ar: "ما شروط صحة الصلاة؟"
  },
  "question.zakat": {
    en: "How is Zakat calculated on savings?",
    ar: "كيف تُحسب الزكاة على المدخرات؟"
  },
  "question.fasting": {
    en: "What are the pillars of fasting in Ramadan?",
    ar: "ما أركان الصيام في رمضان؟"
  },
  "question.travel": {
    en: "What is the ruling on combining prayers while traveling?",
    ar: "ما حكم جمع الصلاة في السفر؟"
  },
  "question.water": {
    en: "What are the types of water in Islamic jurisprudence?",
    ar: "ما أنواع المياه في الفقه الإسلامي؟"
  },

  // Sources page
  "sources.title": {
    en: "Approved Sources",
    ar: "المصادر المعتمدة"
  },
  "sources.description": {
    en: "Our assistant draws answers exclusively from verified and trusted Islamic scholarly references.",
    ar: "مساعدنا يستقي الإجابات حصرياً من المراجع العلمية الإسلامية الموثقة والموثوقة."
  },
  "sources.filter.all": {
    en: "All",
    ar: "الكل"
  },
  "sources.filter.quran": {
    en: "Quran",
    ar: "القرآن"
  },
  "sources.filter.hadith": {
    en: "Hadith",
    ar: "الحديث"
  },
  "sources.filter.tafsir": {
    en: "Tafsir",
    ar: "التفسير"
  },
  "sources.filter.fatwa": {
    en: "Fatwa & Scholarly References",
    ar: "الفتاوى والمراجع العلمية"
  },
  "sources.back": {
    en: "Back to Chat",
    ar: "العودة للمحادثة"
  },

  // About page
  "about.title": {
    en: "About NurAI",
    ar: "عن نور الذكاء"
  },
  "about.description": {
    en: "NurAI is a digital reference tool designed to help Muslims access answers grounded in authentic scholarly sources.",
    ar: "نور الذكاء هو أداة مرجعية رقمية مصممة لمساعدة المسلمين في الوصول إلى إجابات مؤسسة على المصادر العلمية الأصيلة."
  },
  "about.methodology": {
    en: "Our Methodology",
    ar: "منهجيتنا"
  },
  "about.methodologyText": {
    en: "NurAI aggregates knowledge from the Quran, authentic Hadith, classical Tafsir, and recognized scholarly opinions to provide reliable Islamic guidance.",
    ar: "يجمع نور الذكاء المعرفة من القرآن الكريم والأحاديث الصحيحة والتفاسير الكلاسيكية والآراء العلمية المعتبرة لتقديم إرشاد إسلامي موثوق."
  },
  "about.disclaimer": {
    en: "Important: This tool is a learning and reference aid. It is not a substitute for consulting qualified scholars regarding personal or complex matters.",
    ar: "مهم: هذه الأداة هي مساعد تعليمي ومرجعي. وهي ليست بديلاً عن استشارة العلماء المؤهلين في المسائل الشخصية أو المعقدة."
  },
  "about.contact": {
    en: "Contact Us",
    ar: "تواصل معنا"
  },
  "about.contactDesc": {
    en: "Have questions or feedback? We'd love to hear from you.",
    ar: "هل لديك أسئلة أو ملاحظات؟ نود أن نسمع منك."
  },
  "about.nameLabel": {
    en: "Name",
    ar: "الاسم"
  },
  "about.emailLabel": {
    en: "Email",
    ar: "البريد الإلكتروني"
  },
  "about.messageLabel": {
    en: "Message",
    ar: "الرسالة"
  },
  "about.sendButton": {
    en: "Send Message",
    ar: "إرسال الرسالة"
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
  },
  "admin.sources": {
    en: "Sources Management",
    ar: "إدارة المصادر"
  },
  "admin.addSource": {
    en: "Add New Source",
    ar: "إضافة مصدر جديد"
  },
  "admin.title.field": {
    en: "Title",
    ar: "العنوان"
  },
  "admin.author.field": {
    en: "Author",
    ar: "المؤلف"
  },
  "admin.type.field": {
    en: "Type",
    ar: "النوع"
  },
  "admin.description.field": {
    en: "Description",
    ar: "الوصف"
  },
  "admin.actions": {
    en: "Actions",
    ar: "الإجراءات"
  },
  "admin.edit": {
    en: "Edit",
    ar: "تعديل"
  },
  "admin.delete": {
    en: "Delete",
    ar: "حذف"
  },
  "admin.save": {
    en: "Save",
    ar: "حفظ"
  },
  "admin.cancel": {
    en: "Cancel",
    ar: "إلغاء"
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