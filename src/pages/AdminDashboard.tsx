import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Database, Clock, Layers, BookOpen, Trash2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import { useLanguage } from "@/contexts/LanguageContext";

interface Source {
  id: string;
  name: string;
  author: string;
  category: string;
}

const initialSources: Source[] = [
  { id: "1", name: "The Noble Qur'an", author: "Divine Revelation", category: "Qur'an" },
  { id: "2", name: "Mushaf Al-Madinah", author: "King Fahd Complex", category: "Qur'an" },
  { id: "3", name: "Sahih al-Bukhari", author: "Imam al-Bukhari", category: "Hadith" },
  { id: "4", name: "Sahih Muslim", author: "Imam Muslim", category: "Hadith" },
  { id: "5", name: "Sunan Abu Dawud", author: "Imam Abu Dawud", category: "Hadith" },
  { id: "6", name: "Tafsir Ibn Kathir", author: "Imam Ibn Kathir", category: "Tafsir" },
  { id: "7", name: "Tafsir al-Tabari", author: "Imam al-Tabari", category: "Tafsir" },
];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [sources, setSources] = useState(initialSources);

  const handleDelete = (id: string) => {
    setSources(sources.filter((s) => s.id !== id));
    toast({ title: t("admin.sourceDeleted") });
  };

  const handleAddSource = () => {
    const newSource: Source = {
      id: Date.now().toString(),
      name: "New Source",
      author: "Unknown Author",
      category: "Fatwa",
    };
    setSources([...sources, newSource]);
    toast({ title: t("admin.sourceAdded") });
  };

  const stats = [
    { label: t("admin.totalSources"), value: sources.length, icon: Database, color: "text-primary" },
    { label: t("admin.recentlyAdded"), value: 0, icon: Clock, color: "text-orange-500" },
    { label: t("admin.categories"), value: 4, icon: Layers, color: "text-green-source" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        {/* Dashboard Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-foreground">{t("admin.title")}</h1>
          <Button
            variant="outline"
            onClick={() => navigate("/admin")}
            className="border-border text-foreground hover:bg-card"
          >
            {t("admin.logout")}
          </Button>
        </div>

        {/* Warning Banner */}
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg px-4 py-3 flex items-center gap-3 mb-8">
          <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0" />
          <p className="text-yellow-500 text-sm">{t("admin.prototypeNote")}</p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-card border border-border rounded-xl p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-muted text-sm">{stat.label}</span>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <p className="text-3xl font-bold text-foreground">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Sources Management */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-foreground">{t("admin.sources")}</h2>
            <Button onClick={handleAddSource} className="bg-primary hover:bg-primary/90 text-primary-foreground">
              + {t("admin.addSource")}
            </Button>
          </div>

          <div className="space-y-3">
            {sources.map((source) => (
              <div
                key={source.id}
                className="flex items-center justify-between py-3 border-b border-border last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-background rounded-lg flex items-center justify-center border border-border">
                    <BookOpen className="w-5 h-5 text-gray-muted" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{source.name}</p>
                    <p className="text-sm text-gray-muted">
                      {source.author} · {source.category}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(source.id)}
                  className="p-2 text-gray-muted hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
