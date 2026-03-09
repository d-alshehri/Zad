import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";
import { useState } from "react";
import { BookOpen, FileText, Globe, ArrowLeft, ArrowRight, Scroll, Users } from "lucide-react";

interface Source {
  id: string;
  title: { en: string; ar: string };
  author: { en: string; ar: string };
  type: "quran" | "hadith" | "tafsir" | "fatwa" | "fiqh";
  description: { en: string; ar: string };
  language: string[];
  publisher?: { en: string; ar: string };
}

const mockSources: Source[] = [
  {
    id: "1",
    title: { en: "The Noble Quran", ar: "القرآن الكريم" },
    author: { en: "Divine Revelation", ar: "الوحي الإلهي" },
    type: "quran",
    description: { 
      en: "The holy book of Islam, the primary source of Islamic law and guidance. Complete text with multiple translations and interpretations.",
      ar: "كتاب الإسلام المقدس، المصدر الأساسي للشريعة الإسلامية والهداية. النص الكامل مع ترجمات وتفسيرات متعددة."
    },
    language: ["Arabic", "English"],
  },
  {
    id: "2",
    title: { en: "Mushaf Al-Madinah", ar: "مصحف المدينة" },
    author: { en: "King Fahd Complex", ar: "مجمع الملك فهد" },
    type: "quran",
    publisher: { en: "King Fahd Complex for Printing the Holy Quran", ar: "مجمع الملك فهد لطباعة المصحف الشريف" },
    description: { 
      en: "The official Quranic text printed by the King Fahd Complex, widely accepted and distributed globally.",
      ar: "النص القرآني الرسمي المطبوع من مجمع الملك فهد، مقبول على نطاق واسع وموزع عالمياً."
    },
    language: ["Arabic"],
  },
  {
    id: "3",
    title: { en: "Sahih al-Bukhari", ar: "صحيح البخاري" },
    author: { en: "Imam Muhammad al-Bukhari", ar: "الإمام محمد البخاري" },
    type: "hadith",
    description: { 
      en: "The most authentic collection of Prophetic traditions with over 7,000 hadith, compiled by Imam al-Bukhari.",
      ar: "أصح مجموعة من الأحاديث النبوية تحتوي على أكثر من 7000 حديث، جمعها الإمام البخاري."
    },
    language: ["Arabic", "English"],
  },
  {
    id: "4",
    title: { en: "Sahih Muslim", ar: "صحيح مسلم" },
    author: { en: "Imam Muslim ibn al-Hajjaj", ar: "الإمام مسلم بن الحجاج" },
    type: "hadith",
    description: { 
      en: "The second most authentic hadith collection, complementing Sahih al-Bukhari with rigorous authentication standards.",
      ar: "ثاني أصح مجموعة حديث، مكملة لصحيح البخاري بمعايير توثيق صارمة."
    },
    language: ["Arabic", "English"],
  },
  {
    id: "5",
    title: { en: "Sunan Abu Dawud", ar: "سنن أبي داود" },
    author: { en: "Imam Abu Dawud", ar: "الإمام أبو داود" },
    type: "hadith",
    description: { 
      en: "A comprehensive collection focusing on legal matters and Islamic jurisprudence, essential for understanding Islamic law.",
      ar: "مجموعة شاملة تركز على المسائل القانونية والفقه الإسلامي، أساسية لفهم الشريعة الإسلامية."
    },
    language: ["Arabic", "English"],
  },
  {
    id: "6",
    title: { en: "Tafsir Ibn Kathir", ar: "تفسير ابن كثير" },
    author: { en: "Imam Ibn Kathir", ar: "الإمام ابن كثير" },
    type: "tafsir",
    description: { 
      en: "Classical Quranic commentary widely accepted for its authenticity, clarity, and scholarly methodology.",
      ar: "تفسير قرآني كلاسيكي مقبول على نطاق واسع لأصالته ووضوحه ومنهجيته العلمية."
    },
    language: ["Arabic", "English"],
  },
  {
    id: "7",
    title: { en: "Jami' at-Tirmidhi", ar: "جامع الترمذي" },
    author: { en: "Imam at-Tirmidhi", ar: "الإمام الترمذي" },
    type: "hadith",
    description: { 
      en: "One of the six major hadith collections with detailed classifications and commentary on hadith authenticity.",
      ar: "أحد مجاميع الحديث الستة الرئيسية مع تصنيفات مفصلة وتعليقات على صحة الحديث."
    },
    language: ["Arabic"],
  },
  {
    id: "8",
    title: { en: "Fiqh al-Sunnah", ar: "فقه السنة" },
    author: { en: "Sayyid Sabiq", ar: "السيد سابق" },
    type: "fiqh",
    description: { 
      en: "A comprehensive guide to Islamic jurisprudence based on Quran and Sunnah, covering all aspects of Islamic law.",
      ar: "دليل شامل للفقه الإسلامي القائم على القرآن والسنة، يغطي جميع جوانب الشريعة الإسلامية."
    },
    language: ["Arabic", "English"],
  },
  {
    id: "9",
    title: { en: "Fatawa al-Lajnah ad-Da'imah", ar: "فتاوى اللجنة الدائمة" },
    author: { en: "Permanent Committee for Scholarly Research", ar: "اللجنة الدائمة للبحوث العلمية" },
    type: "fatwa",
    description: { 
      en: "Official fatwas from the Permanent Committee for Scholarly Research and Ifta in Saudi Arabia.",
      ar: "الفتاوى الرسمية من اللجنة الدائمة للبحوث العلمية والإفتاء في المملكة العربية السعودية."
    },
    language: ["Arabic"],
  }
];

const typeIcons = {
  quran: BookOpen,
  hadith: FileText,
  tafsir: Scroll,
  fiqh: Users,
  fatwa: Globe
};

const typeColors = {
  quran: "bg-accent/20 text-accent",
  hadith: "bg-primary/20 text-primary",
  tafsir: "bg-secondary/20 text-secondary-foreground",
  fiqh: "bg-muted/40 text-muted-foreground",
  fatwa: "bg-destructive/20 text-destructive"
};

const Sources = () => {
  const { language, t, isRTL } = useLanguage();
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const ArrowIcon = isRTL ? ArrowRight : ArrowLeft;

  const filters = [
    { key: "all", label: t("sources.filter.all") },
    { key: "quran", label: t("sources.filter.quran") },
    { key: "hadith", label: t("sources.filter.hadith") },
    { key: "tafsir", label: t("sources.filter.tafsir") },
    { key: "fatwa", label: t("sources.filter.fatwa") }
  ];

  const filteredSources = selectedFilter === "all" 
    ? mockSources 
    : mockSources.filter(source => source.type === selectedFilter);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Back Button */}
          <Button asChild variant="ghost" className="mb-6 group">
            <Link to="/" className="flex items-center gap-2">
              <ArrowIcon className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              {t("sources.back")}
            </Link>
          </Button>

          {/* Header */}
          <div className="text-center mb-10">
            <div className="crescent-star mx-auto mb-6 animate-pulse-glow">
              <BookOpen className="h-8 w-8 text-background" />
            </div>
            <h1 className="text-4xl font-bold gradient-text-gold mb-4">
              {t("sources.title")}
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed">
              {t("sources.description")}
            </p>
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {filters.map((filter) => (
              <Button
                key={filter.key}
                onClick={() => setSelectedFilter(filter.key)}
                variant={selectedFilter === filter.key ? "default" : "outline"}
                className={selectedFilter === filter.key ? "glow-purple" : ""}
              >
                {filter.label}
              </Button>
            ))}
          </div>

          {/* Sources Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {filteredSources.map((source) => {
              const Icon = typeIcons[source.type];
              const typeColor = typeColors[source.type];
              
              return (
                <Card key={source.id} className="card-gradient border-border/50 hover:shadow-2xl hover:glow-purple transition-all duration-300 group animate-fade-in">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className={`p-3 rounded-xl ${typeColor.replace('/20', '/10')} group-hover:scale-110 transition-transform`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <Badge className={`${typeColor} text-xs font-medium`}>
                        {source.type.charAt(0).toUpperCase() + source.type.slice(1)}
                      </Badge>
                    </div>
                    
                    <CardTitle className="text-xl mb-2 group-hover:gradient-text-gold transition-all">
                      {source.title[language]}
                    </CardTitle>
                    
                    <CardDescription className="font-medium text-accent/80 text-base">
                      {source.author[language]}
                    </CardDescription>

                    {source.publisher && (
                      <CardDescription className="text-sm text-muted-foreground">
                        {source.publisher[language]}
                      </CardDescription>
                    )}
                  </CardHeader>
                  
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                      {source.description[language]}
                    </p>
                    
                    <div className="flex flex-wrap gap-2">
                      {source.language.map((lang) => (
                        <Badge key={lang} variant="secondary" className="text-xs">
                          {lang}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Footer Note */}
          <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-2xl border border-primary/10 p-6">
            <div className="text-center">
              <BookOpen className="h-6 w-6 text-accent mx-auto mb-3" />
              <p className="text-muted-foreground leading-relaxed">
                {language === "en" 
                  ? "All sources are carefully reviewed and approved by qualified Islamic scholars to ensure authenticity and reliability. Our assistant draws exclusively from these verified references to provide accurate Islamic knowledge."
                  : "جميع المصادر مراجعة ومعتمدة بعناية من قبل علماء إسلاميين مؤهلين لضمان الأصالة والموثوقية. مساعدنا يستقي حصرياً من هذه المراجع الموثقة لتقديم معرفة إسلامية دقيقة."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Sources;