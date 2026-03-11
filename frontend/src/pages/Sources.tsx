import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { BookOpen, User, Globe, ArrowLeft, ExternalLink, FileText } from "lucide-react";
import Navbar from "@/components/Navbar";
import { useLanguage } from "@/contexts/LanguageContext";
import { getSources } from "@/services/api";
import type { KnowledgeSource } from "@/services/api";

const categoryStyles: Record<string, { badge: string; icon: string }> = {
  quran:  { badge: "bg-emerald-500/20 text-emerald-400", icon: "bg-emerald-500/10" },
  hadith: { badge: "bg-sky-500/20 text-sky-400",         icon: "bg-sky-500/10" },
  tafsir: { badge: "bg-amber-500/20 text-amber-400",      icon: "bg-amber-500/10" },
  fatwa:  { badge: "bg-rose-500/20 text-rose-400",        icon: "bg-rose-500/10" },
  other:  { badge: "bg-gray-500/20 text-gray-400",        icon: "bg-gray-500/10" },
};

const categoryLabels: Record<string, { en: string; ar: string }> = {
  quran:  { en: "Qur'an",  ar: "القرآن" },
  hadith: { en: "Hadith",  ar: "الحديث" },
  tafsir: { en: "Tafsir",  ar: "التفسير" },
  fatwa:  { en: "Fatwa",   ar: "الفتوى" },
  other:  { en: "Other",   ar: "أخرى" },
};

const Sources = () => {
  const { isRTL, t, language } = useLanguage();
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [sources, setSources] = useState<KnowledgeSource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    getSources()
      .then((data) => setSources(data.sources))
      .catch(() => setError(true))
      .finally(() => setIsLoading(false));
  }, []);

  const filters = [
    { key: "all",    label: t("sources.filter.all") },
    { key: "quran",  label: t("sources.filter.quran") },
    { key: "hadith", label: t("sources.filter.hadith") },
    { key: "tafsir", label: t("sources.filter.tafsir") },
    { key: "fatwa",  label: t("sources.filter.fatwa") },
    { key: "other",  label: "Other" },
  ];

  const filtered = selectedFilter === "all"
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

        {/* Filter tabs */}
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

        {/* Loading */}
        {isLoading && (
          <div className="grid md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-card border border-border rounded-xl p-5 animate-pulse">
                <div className="h-4 bg-border rounded w-1/2 mb-3" />
                <div className="h-3 bg-border rounded w-3/4 mb-2" />
                <div className="h-3 bg-border rounded w-full" />
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {error && !isLoading && (
          <div className="text-center py-16">
            <p className="text-red-400 text-sm">Could not connect to the backend server.</p>
            <p className="text-muted-foreground text-xs mt-1">Make sure it is running on port 8000.</p>
          </div>
        )}

        {/* Empty */}
        {!isLoading && !error && sources.length === 0 && (
          <div className="text-center py-16">
            <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-30" />
            <p className="text-muted-foreground">No sources have been added yet.</p>
            <p className="text-muted-foreground text-sm mt-1">An admin can add sources from the Admin Dashboard.</p>
          </div>
        )}

        {/* Source cards */}
        {!isLoading && !error && filtered.length > 0 && (
          <div className="grid md:grid-cols-2 gap-4">
            {filtered.map((source) => {
              const style = categoryStyles[source.category] ?? categoryStyles.other;
              const catLabel = categoryLabels[source.category] ?? categoryLabels.other;
              const isURL = !!source.url;

              return (
                <div key={source.name} className="bg-card border border-border rounded-xl p-5 flex flex-col gap-3">
                  {/* Header row */}
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 ${style.icon} rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <BookOpen className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      {/* English + Arabic name */}
                      <h3 className="font-bold text-white leading-tight">{source.name}</h3>
                      {source.name_ar && (
                        <p className="text-gold text-sm font-medium mt-0.5" dir="rtl">{source.name_ar}</p>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  {source.description && (
                    <p className="text-sm text-muted-foreground leading-relaxed">{source.description}</p>
                  )}

                  {/* Footer row: category badge + view link */}
                  <div className="flex items-center justify-between mt-auto pt-1">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${style.badge}`}>
                      {language === "ar" ? catLabel.ar : catLabel.en}
                    </span>

                    {/* View source button */}
                    {isURL ? (
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-gold hover:underline"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        View Source
                      </a>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                        <FileText className="w-3.5 h-3.5" />
                        PDF Document
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* No results after filter */}
        {!isLoading && !error && sources.length > 0 && filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground text-sm">
            No sources in this category yet.
          </div>
        )}

      </main>
    </div>
  );
};

export default Sources;
