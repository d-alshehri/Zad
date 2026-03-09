import { useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, User, Globe, ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import { useLanguage } from "@/contexts/LanguageContext";

interface Source {
  id: string;
  name: string;
  author: string;
  language: string;
  description: string;
  category: "quran" | "hadith" | "tafsir" | "fatwa";
}

const sources: Source[] = [
  { id: "1", name: "The Noble Qur'an", author: "Divine Revelation", language: "Arabic / English", description: "The holy book of Islam, the primary source of Islamic law and guidance. Complete text with multiple translations.", category: "quran" },
  { id: "2", name: "Mushaf Al-Madinah", author: "King Fahd Complex", language: "Arabic", description: "The official Quranic text printed by the King Fahd Complex, widely accepted and distributed globally.", category: "quran" },
  { id: "3", name: "Sahih al-Bukhari", author: "Imam Muhammad al-Bukhari", language: "Arabic / English", description: "The most authentic collection of Prophetic traditions with over 7,000 hadith.", category: "hadith" },
  { id: "4", name: "Sahih Muslim", author: "Imam Muslim ibn al-Hajjaj", language: "Arabic / English", description: "The second most authentic hadith collection, complementing Sahih al-Bukhari.", category: "hadith" },
  { id: "5", name: "Sunan Abu Dawud", author: "Imam Abu Dawud", language: "Arabic / English", description: "A comprehensive collection focusing on legal matters and Islamic jurisprudence.", category: "hadith" },
  { id: "6", name: "Tafsir Ibn Kathir", author: "Imam Ibn Kathir", language: "Arabic / English", description: "Classical Quranic commentary widely accepted for its authenticity and scholarly methodology.", category: "tafsir" },
  { id: "7", name: "Tafsir al-Tabari", author: "Imam al-Tabari", language: "Arabic", description: "One of the earliest and most comprehensive Quranic commentaries in Islamic scholarship.", category: "tafsir" },
];

const categoryStyles: Record<string, { badge: string; icon: string; label: string }> = {
  quran: { badge: "bg-emerald-500/20 text-emerald-400", icon: "bg-emerald-500/10", label: "QUR'AN" },
  hadith: { badge: "bg-sky-500/20 text-sky-400", icon: "bg-sky-500/10", label: "HADITH" },
  tafsir: { badge: "bg-amber-500/20 text-amber-400", icon: "bg-amber-500/10", label: "TAFSIR" },
  fatwa: { badge: "bg-rose-500/20 text-rose-400", icon: "bg-rose-500/10", label: "FATWA" },
};

const filters = [
  { key: "all", label: "All" },
  { key: "quran", label: "Qur'an" },
  { key: "hadith", label: "Hadith" },
  { key: "tafsir", label: "Tafsir" },
  { key: "fatwa", label: "Fatwa & Scholarly References" },
];

const Sources = () => {
  const { isRTL } = useLanguage();
  const [selectedFilter, setSelectedFilter] = useState("all");

  const filteredSources = selectedFilter === "all"
    ? sources
    : sources.filter((s) => s.category === selectedFilter);

  return (
    <div className="min-h-screen bg-background flex flex-col" dir={isRTL ? "rtl" : "ltr"}>
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-5xl">
        {/* Back */}
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-white transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to Chat
        </Link>

        {/* Header */}
        <h1 className="text-3xl font-bold text-white mb-2">Approved Sources</h1>
        <p className="text-muted-foreground mb-8">
          Our assistant draws answers exclusively from verified and trusted Islamic scholarly references.
        </p>

        {/* Filters */}
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

        {/* Grid */}
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
                    <h3 className="font-bold text-white mb-2">{source.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                      <User className="w-3.5 h-3.5" />
                      {source.author}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Globe className="w-3.5 h-3.5" />
                      {source.language}
                    </div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-3">{source.description}</p>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${style.badge}`}>
                  {style.label}
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
