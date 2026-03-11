import { useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, User, Globe, ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import { useLanguage } from "@/contexts/LanguageContext";

interface Source {
  id: string;
  nameKey: string;
  authorKey: string;
  languageKey: string;
  descriptionKey: string;
  category: "quran" | "hadith" | "tafsir" | "fatwa";
}

const sources: Source[] = [
  {
    id: "1",
    nameKey: "sources.items.1.name",
    authorKey: "sources.items.1.author",
    languageKey: "sources.items.1.language",
    descriptionKey: "sources.items.1.description",
    category: "quran",
  },
  {
    id: "2",
    nameKey: "sources.items.2.name",
    authorKey: "sources.items.2.author",
    languageKey: "sources.items.2.language",
    descriptionKey: "sources.items.2.description",
    category: "quran",
  },
  {
    id: "3",
    nameKey: "sources.items.3.name",
    authorKey: "sources.items.3.author",
    languageKey: "sources.items.3.language",
    descriptionKey: "sources.items.3.description",
    category: "hadith",
  },
  {
    id: "4",
    nameKey: "sources.items.4.name",
    authorKey: "sources.items.4.author",
    languageKey: "sources.items.4.language",
    descriptionKey: "sources.items.4.description",
    category: "hadith",
  },
  {
    id: "5",
    nameKey: "sources.items.5.name",
    authorKey: "sources.items.5.author",
    languageKey: "sources.items.5.language",
    descriptionKey: "sources.items.5.description",
    category: "hadith",
  },
  {
    id: "6",
    nameKey: "sources.items.6.name",
    authorKey: "sources.items.6.author",
    languageKey: "sources.items.6.language",
    descriptionKey: "sources.items.6.description",
    category: "tafsir",
  },
  {
    id: "7",
    nameKey: "sources.items.7.name",
    authorKey: "sources.items.7.author",
    languageKey: "sources.items.7.language",
    descriptionKey: "sources.items.7.description",
    category: "tafsir",
  },
];

const categoryStyles: Record<string, { badge: string; icon: string; translationKey: string }> = {
  quran: { badge: "bg-emerald-500/20 text-emerald-400", icon: "bg-emerald-500/10", translationKey: "sources.filter.quran" },
  hadith: { badge: "bg-sky-500/20 text-sky-400", icon: "bg-sky-500/10", translationKey: "sources.filter.hadith" },
  tafsir: { badge: "bg-amber-500/20 text-amber-400", icon: "bg-amber-500/10", translationKey: "sources.filter.tafsir" },
  fatwa: { badge: "bg-rose-500/20 text-rose-400", icon: "bg-rose-500/10", translationKey: "sources.filter.fatwa" },
};

const Sources = () => {
  const { isRTL, t } = useLanguage();
  const [selectedFilter, setSelectedFilter] = useState("all");

  const filters = [
    { key: "all", label: t("sources.filter.all") },
    { key: "quran", label: t("sources.filter.quran") },
    { key: "hadith", label: t("sources.filter.hadith") },
    { key: "tafsir", label: t("sources.filter.tafsir") },
    { key: "fatwa", label: t("sources.filter.fatwa") },
  ];

  const filteredSources = selectedFilter === "all"
    ? sources
    : sources.filter((s) => s.category === selectedFilter);

  return (
    <div className="min-h-screen bg-background flex flex-col" dir={isRTL ? "rtl" : "ltr"}>
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-5xl">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-white transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" />
          {t("sources.back")}
        </Link>

        <h1 className="text-3xl font-bold text-white mb-2">{t("sources.title")}</h1>
        <p className="text-muted-foreground mb-8">{t("sources.description")}</p>

        <div className="flex flex-wrap gap-2 mb-8">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setSelectedFilter(f.key)}
              className={`px-4 py-2 rounded-full text-sm transition-colors ${
                selectedFilter === f.key
                  ? "bg-gold text-background font-medium"
                  : "border border-border text-muted-foreground hover:text-white hover:border-muted-foreground"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {filteredSources.map((source) => {
            const style = categoryStyles[source.category];
            return (
              <div key={source.id} className="bg-card border border-border rounded-xl p-5">
                <div className="flex items-start gap-4 mb-3">
                  <div className={`w-10 h-10 ${style.icon} rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <BookOpen className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-white mb-2">{t(source.nameKey)}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                      <User className="w-3.5 h-3.5" />
                      {t(source.authorKey)}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Globe className="w-3.5 h-3.5" />
                      {t(source.languageKey)}
                    </div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-3">{t(source.descriptionKey)}</p>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${style.badge}`}>
                  {t(style.translationKey)}
                </span>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default Sources;
