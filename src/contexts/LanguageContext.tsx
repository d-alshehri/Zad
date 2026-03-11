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
    en: "Zad",
    ar: "زاد"
  },
  "app.subtitle": {
    en: "وَقُل رَّبِّ زِدْنِى عِلْمًۭا",
    ar: "وَقُل رَّبِّ زِدْنِى عِلْمًۭا"
  },
  "app.description": {
    en: "Ask about Islamic teachings, rulings, and guidance powered by trusted scholarly sources.",
    ar: "اسأل عن التعاليم والأحكام والإرشاد الإسلامي"
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
    en: "Assalamu Alaikum! I'm Zad, your Islamic knowledge assistant.",
    ar: "السلام عليكم! أنا زاد، مساعدك للمعرفة الإسلامية."
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

  "sources.items.1.name": {
    en: "The Noble Qur'an",
    ar: "القرآن الكريم"
  },
  "sources.items.1.author": {
    en: "Divine Revelation",
    ar: "وحي من الله"
  },
  "sources.items.1.language": {
    en: "Arabic / English",
    ar: "العربية / الإنجليزية"
  },
  "sources.items.1.description": {
    en: "The holy book of Islam, the primary source of Islamic law and guidance. Complete text with multiple translations.",
    ar: "الكتاب المقدس في الإسلام، وهو المصدر الأول للتشريع والهداية. يتضمن النص الكامل مع عدة ترجمات."
  },
  "sources.items.2.name": {
    en: "Mushaf Al-Madinah",
    ar: "مصحف المدينة"
  },
  "sources.items.2.author": {
    en: "King Fahd Complex",
    ar: "مجمع الملك فهد"
  },
  "sources.items.2.language": {
    en: "Arabic",
    ar: "العربية"
  },
  "sources.items.2.description": {
    en: "The official Quranic text printed by the King Fahd Complex, widely accepted and distributed globally.",
    ar: "النص الرسمي للمصحف المطبوع من مجمع الملك فهد، وهو معتمد ومنتشر على نطاق واسع حول العالم."
  },
  "sources.items.3.name": {
    en: "Sahih al-Bukhari",
    ar: "صحيح البخاري"
  },
  "sources.items.3.author": {
    en: "Imam Muhammad al-Bukhari",
    ar: "الإمام محمد البخاري"
  },
  "sources.items.3.language": {
    en: "Arabic / English",
    ar: "العربية / الإنجليزية"
  },
  "sources.items.3.description": {
    en: "The most authentic collection of Prophetic traditions with over 7,000 hadith.",
    ar: "أصح كتب السنة النبوية، ويضم أكثر من 7000 حديث."
  },
  "sources.items.4.name": {
    en: "Sahih Muslim",
    ar: "صحيح مسلم"
  },
  "sources.items.4.author": {
    en: "Imam Muslim ibn al-Hajjaj",
    ar: "الإمام مسلم بن الحجاج"
  },
  "sources.items.4.language": {
    en: "Arabic / English",
    ar: "العربية / الإنجليزية"
  },
  "sources.items.4.description": {
    en: "The second most authentic hadith collection, complementing Sahih al-Bukhari.",
    ar: "ثاني أصح كتب الحديث، ويكمل صحيح البخاري في جمع الروايات الصحيحة."
  },
  "sources.items.5.name": {
    en: "Sunan Abu Dawud",
    ar: "سنن أبي داود"
  },
  "sources.items.5.author": {
    en: "Imam Abu Dawud",
    ar: "الإمام أبو داود"
  },
  "sources.items.5.language": {
    en: "Arabic / English",
    ar: "العربية / الإنجليزية"
  },
  "sources.items.5.description": {
    en: "A comprehensive collection focusing on legal matters and Islamic jurisprudence.",
    ar: "مجموعة حديثية شاملة تركز على مسائل الأحكام والفقه الإسلامي."
  },
  "sources.items.6.name": {
    en: "Tafsir Ibn Kathir",
    ar: "تفسير ابن كثير"
  },
  "sources.items.6.author": {
    en: "Imam Ibn Kathir",
    ar: "الإمام ابن كثير"
  },
  "sources.items.6.language": {
    en: "Arabic / English",
    ar: "العربية / الإنجليزية"
  },
  "sources.items.6.description": {
    en: "Classical Quranic commentary widely accepted for its authenticity and scholarly methodology.",
    ar: "تفسير قرآني كلاسيكي مشهور ومعتمد لما يتميز به من أصالة ومنهج علمي."
  },
  "sources.items.7.name": {
    en: "Tafsir al-Tabari",
    ar: "تفسير الطبري"
  },
  "sources.items.7.author": {
    en: "Imam al-Tabari",
    ar: "الإمام الطبري"
  },
  "sources.items.7.language": {
    en: "Arabic",
    ar: "العربية"
  },
  "sources.items.7.description": {
    en: "One of the earliest and most comprehensive Quranic commentaries in Islamic scholarship.",
    ar: "من أقدم وأشمل كتب التفسير في التراث الإسلامي."
  },

  // About page
  "about.title": {
    en: "About Zad",
    ar: "عن زاد"
  },
  "about.description": {
    en: "Zad is a digital reference tool designed to help Muslims access answers grounded in authentic scholarly sources.",
    ar: "زاد أداة مرجعية رقمية مصممة لمساعدة المسلمين في الوصول إلى إجابات مؤسسة على المصادر العلمية الأصيلة."
  },
  "about.methodology": {
    en: "Our Methodology",
    ar: "منهجيتنا"
  },
  "about.methodologyText": {
    en: "Zad aggregates knowledge from the Quran, authentic Hadith, classical Tafsir, and recognized scholarly opinions to provide reliable Islamic guidance.",
    ar: "يجمع زاد المعرفة من القرآن الكريم والأحاديث الصحيحة والتفاسير الكلاسيكية والآراء العلمية المعتبرة لتقديم إرشاد إسلامي موثوق."
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
  },
  "admin.access": {
    en: "Admin Access",
    ar: "دخول الإدارة"
  },
  "admin.accessDesc": {
    en: "Enter the admin password to access the dashboard.",
    ar: "أدخل كلمة مرور المدير للوصول إلى لوحة التحكم."
  },
  "admin.prototypeNote": {
    en: "This is a prototype UI — not connected to a real backend.",
    ar: "هذه واجهة تجريبية — غير متصلة بخادم حقيقي."
  },
  "admin.totalSources": {
    en: "Total Sources",
    ar: "إجمالي المصادر"
  },
  "admin.recentlyAdded": {
    en: "Recently Added",
    ar: "أُضيفت مؤخراً"
  },
  "admin.categories": {
    en: "Categories",
    ar: "التصنيفات"
  },
  "admin.sourceDeleted": {
    en: "Source deleted",
    ar: "تم حذف المصدر"
  },
  "admin.sourceAdded": {
    en: "Source added",
    ar: "تم إضافة المصدر"
  }
  ,
  "chat.descriptionLine1": {
    en: "Ask about Islamic teachings, rulings, and guidance",
    ar: "اسأل عن التعاليم والأحكام والإرشاد الإسلامي"
  },
  "chat.descriptionLine2": {
    en: "powered by trusted scholarly sources.",
    ar: "بالاعتماد على مصادر علمية موثوقة."
  },
  "chat.sourceLabel": {
    en: "Source:",
    ar: "المصدر:"
  },
  "chat.response.prayer": {
    en: "Prayer (Salah) has several conditions for validity including: ritual purity (tahara), covering the awrah, facing the Qibla, entering the prayer time, and having the intention (niyyah). The prayer also has pillars (arkan) that must be performed including standing, reciting Al-Fatiha, bowing (ruku'), prostrating (sujud), and the final sitting.",
    ar: "للصلاة شروط صحة منها: الطهارة، وستر العورة، واستقبال القبلة، ودخول الوقت، والنية. كما أن لها أركانا لا تصح بدونها، مثل القيام، وقراءة الفاتحة، والركوع، والسجود، والجلوس الأخير."
  },
  "chat.response.zakat": {
    en: "Zakat on savings is calculated at 2.5% of wealth that has reached the nisab threshold and been held for one lunar year (hawl). The nisab is equivalent to 85 grams of gold or 595 grams of silver. Only the amount above nisab is subject to Zakat.",
    ar: "زكاة المال تكون بنسبة 2.5% من المال الذي بلغ النصاب وحال عليه الحول. ويقدّر النصاب بما يعادل 85 غراما من الذهب أو 595 غراما من الفضة. والزكاة تجب في المقدار الذي بلغ النصاب فأكثر."
  },
  "chat.response.fasting": {
    en: "The pillars of fasting in Ramadan are: 1) Intention (niyyah) made before Fajr each day, 2) Abstaining from food, drink, and marital relations from dawn (Fajr) to sunset (Maghrib), 3) The fasting person must be Muslim, sane, and of age.",
    ar: "من أركان الصيام في رمضان: 1) تبييت النية قبل الفجر، 2) الإمساك عن الطعام والشراب والجماع من طلوع الفجر إلى غروب الشمس، 3) أن يكون الصائم مسلما عاقلا ممن يجب عليه الصوم."
  },
  "chat.response.default": {
    en: "This is an excellent question about Islamic knowledge. Based on authentic scholarly sources, the answer involves careful consideration of the Qur'an, Sunnah, and scholarly consensus. Please consult with a qualified scholar for detailed guidance on your specific situation.",
    ar: "هذا سؤال مهم في المعرفة الإسلامية. والجواب فيه يحتاج إلى نظر في القرآن والسنة وأقوال أهل العلم المعتبرين. وللحالات الخاصة أو التفصيلية ينبغي الرجوع إلى عالم مؤهل."
  },
  "chat.source.hadith": {
    en: "Hadith",
    ar: "حديث"
  },
  "chat.source.fiqh": {
    en: "Fiqh",
    ar: "فقه"
  },
  "chat.source.quran": {
    en: "Qur'an",
    ar: "القرآن"
  },
  "about.messageSent": {
    en: "Message Sent",
    ar: "تم إرسال الرسالة"
  },
  "about.messageSentDesc": {
    en: "Thank you for your message. We'll get back to you soon.",
    ar: "شكرا لرسالتك. سنتواصل معك قريبا."
  },
  "common.language.arabic": {
    en: "العربية",
    ar: "العربية"
  },
  "common.language.english": {
    en: "English",
    ar: "English"
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
