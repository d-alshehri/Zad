import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Database, Clock, Layers, BookOpen, Trash2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

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
  const [sources, setSources] = useState(initialSources);

  const handleDelete = (id: string) => {
    setSources(sources.filter((s) => s.id !== id));
    toast({ title: "Source deleted" });
  };

  const handleAddSource = () => {
    const newSource: Source = {
      id: Date.now().toString(),
      name: "New Source",
      author: "Unknown Author",
      category: "Fatwa",
    };
    setSources([...sources, newSource]);
    toast({ title: "Source added" });
  };

  const stats = [
    { label: "Total Sources", value: sources.length, icon: Database, color: "text-purple" },
    { label: "Recently Added", value: 0, icon: Clock, color: "text-orange-500" },
    { label: "Categories", value: 4, icon: Layers, color: "text-green-source" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="text-xl font-bold text-white">Admin Dashboard</h1>
          <Button
            variant="outline"
            onClick={() => navigate("/admin")}
            className="border-border text-white hover:bg-card"
          >
            Logout
          </Button>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        {/* Warning Banner */}
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg px-4 py-3 flex items-center gap-3 mb-8">
          <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0" />
          <p className="text-yellow-500 text-sm">
            This is a prototype UI — not connected to a real backend.
          </p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-500 text-sm">{stat.label}</span>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Sources Management */}
        <div className="bg-white rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900">Manage Sources</h2>
            <Button
              onClick={handleAddSource}
              className="bg-purple hover:bg-purple/90 text-white"
            >
              + Add New Source
            </Button>
          </div>

          <div className="space-y-3">
            {sources.map((source) => (
              <div
                key={source.id}
                className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-gray-500" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{source.name}</p>
                    <p className="text-sm text-gray-500">
                      {source.author} · {source.category}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(source.id)}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors"
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
