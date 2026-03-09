import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";
import { BookOpen, FileText, Globe, ArrowLeft, ArrowRight } from "lucide-react";

interface Source {
  id: string;
  title: { en: string; ar: string };
  author: { en: string; ar: string };
  type: "quran" | "hadith" | "tafsir" | "fiqh" | "fatwa";
  description: { en: string; ar: string };
}

const mockSources: Source[] = [
  {
    id: "1",
    title: { en: "The Holy Quran", ar: "القرآن الكريم" },
    author: { en: "Divine Revelation", ar: "الوحي الإلهي" },
    type: "quran",
    description: { 
      en: "Complete Quran with multiple translations including Sahih International and Yusuf Ali.",
      ar: "القرآن الكريم كاملاً مع ترجمات متعددة تشمل صحيح الدولية ويوسف علي."
    }
  },
  {
    id: "2",
    title: { en: "Sahih al-Bukhari", ar: "صحيح البخاري" },
    author: { en: "Imam al-Bukhari", ar: "الإمام البخاري" },
    type: "hadith",
    description: { 
      en: "The most authentic collection of Prophetic traditions with over 7,000 hadith.",
      ar: "أصح مجموعة من الأحاديث النبوية تحتوي على أكثر من 7000 حديث."
    }
  },
  {
    id: "3",
    title: { en: "Sahih Muslim", ar: "صحيح مسلم" },
    author: { en: "Imam Muslim", ar: "الإمام مسلم" },
    type: "hadith",
    description: { 
      en: "Second most authentic hadith collection, complementing Sahih al-Bukhari.",
      ar: "ثاني أصح مجموعة حديث، مكملة لصحيح البخاري."
    }
  },
  {
    id: "4",
    title: { en: "Tafsir Ibn Kathir", ar: "تفسير ابن كثير" },
    author: { en: "Ibn Kathir", ar: "ابن كثير" },
    type: "tafsir",
    description: { 
      en: "Classical Quranic commentary widely accepted for authenticity and clarity.",
      ar: "تفسير قرآني كلاسيكي مقبول على نطاق واسع لأصالته ووضوحه."
    }
  },
  {
    id: "5",
    title: { en: "Sunan Abu Dawud", ar: "سنن أبي داود" },
    author: { en: "Abu Dawud", ar: "أبو داود" },
    type: "hadith",
    description: { 
      en: "Collection focusing on legal matters and Islamic jurisprudence.",
      ar: "مجموعة تركز على المسائل القانونية والفقه الإسلامي."
    }
  },
  {
    id: "6",
    title: { en: "Jami' at-Tirmidhi", ar: "جامع الترمذي" },
    author: { en: "Imam at-Tirmidhi", ar: "الإمام الترمذي" },
    type: "hadith",
    description: { 
      en: "One of the six major hadith collections with detailed classifications.",
      ar: "أحد مجاميع الحديث الستة الرئيسية مع تصنيفات مفصلة."
    }
  }
];

const typeIcons = {
  quran: BookOpen,
  hadith: FileText,
  tafsir: BookOpen,
  fiqh: FileText,
  fatwa: Globe
};

const Sources = () => {
  const { language, t, isRTL } = useLanguage();
  const ArrowIcon = isRTL ? ArrowRight : ArrowLeft;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Button asChild variant="ghost" className="mb-6">
            <Link to="/" className="flex items-center gap-2">
              <ArrowIcon className="h-4 w-4" />
              {t("sources.back")}
            </Link>
          </Button>

          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-primary to-secondary rounded-xl shadow-lg mb-4">
              <BookOpen className="w-7 h-7 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-3">
              {t("sources.title")}
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              {t("sources.description")}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {mockSources.map((source) => {
              const Icon = typeIcons[source.type];
              
              return (
                <Card key={source.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-card/80 backdrop-blur-sm">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="p-2 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <Badge variant="secondary" className="bg-secondary/20 text-secondary-foreground">
                        {source.type}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg mt-2">{source.title[language]}</CardTitle>
                    <CardDescription className="font-medium text-primary/80">
                      {source.author[language]}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {source.description[language]}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="mt-10 p-6 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-2xl border border-primary/10">
            <p className="text-center text-sm text-muted-foreground">
              {language === "en" 
                ? "All sources are reviewed and approved by qualified Islamic scholars."
                : "جميع المصادر مراجعة ومعتمدة من قبل علماء إسلاميين مؤهلين."}
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Sources;