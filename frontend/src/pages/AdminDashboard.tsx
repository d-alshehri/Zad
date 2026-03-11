import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Database, Clock, Layers, BookOpen, Trash2, Upload, Link as LinkIcon, X, ExternalLink, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import { useLanguage } from "@/contexts/LanguageContext";
import { getSources, ingestURL, ingestPDF, deleteSource } from "@/services/api";
import type { KnowledgeSource } from "@/services/api";

type ModalType = "url" | "pdf" | null;

const CATEGORIES = [
  { value: "quran",  labelEn: "Qur'an",  labelAr: "القرآن" },
  { value: "hadith", labelEn: "Hadith",  labelAr: "الحديث" },
  { value: "tafsir", labelEn: "Tafsir",  labelAr: "التفسير" },
  { value: "fatwa",  labelEn: "Fatwa & Scholarly",  labelAr: "الفتوى" },
  { value: "other",  labelEn: "Other",   labelAr: "أخرى" },
];

const categoryBadge: Record<string, string> = {
  quran:  "bg-emerald-500/20 text-emerald-400",
  hadith: "bg-sky-500/20 text-sky-400",
  tafsir: "bg-amber-500/20 text-amber-400",
  fatwa:  "bg-rose-500/20 text-rose-400",
  other:  "bg-gray-500/20 text-gray-400",
};

// Shared form fields for both URL and PDF modals
interface SourceForm {
  nameEn: string;
  nameAr: string;
  category: string;
  description: string;
}

const emptyForm = (): SourceForm => ({ nameEn: "", nameAr: "", category: "other", description: "" });

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();

  const [sources, setSources] = useState<KnowledgeSource[]>([]);
  const [totalChunks, setTotalChunks] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [modal, setModal] = useState<ModalType>(null);

  // URL form
  const [urlForm, setUrlForm] = useState<SourceForm>(emptyForm());
  const [urlValue, setUrlValue] = useState("");
  const [urlLoading, setUrlLoading] = useState(false);

  // PDF form
  const [pdfForm, setPdfForm] = useState<SourceForm>(emptyForm());
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfLoading, setPdfLoading] = useState(false);

  const fetchSources = async () => {
    try {
      const data = await getSources();
      setSources(data.sources);
      setTotalChunks(data.total_chunks);
    } catch {
      toast({ title: "Could not connect to backend", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchSources(); }, []);

  const handleDelete = async (name: string) => {
    if (!confirm(`Delete all chunks from "${name}"?`)) return;
    try {
      await deleteSource(name);
      toast({ title: `"${name}" removed` });
      fetchSources();
    } catch (err) {
      toast({ title: err instanceof Error ? err.message : "Delete failed", variant: "destructive" });
    }
  };

  const handleAddURL = async () => {
    if (!urlForm.nameEn.trim() || !urlValue.trim()) return;
    setUrlLoading(true);
    try {
      const data = await ingestURL(urlValue, urlForm.nameEn, urlForm.nameAr, urlForm.category, urlForm.description);
      toast({ title: `Added "${urlForm.nameEn}" — ${data.chunks_added} chunks` });
      setUrlForm(emptyForm()); setUrlValue(""); setModal(null);
      fetchSources();
    } catch (err) {
      toast({ title: err instanceof Error ? err.message : "Failed", variant: "destructive" });
    } finally {
      setUrlLoading(false);
    }
  };

  const handleAddPDF = async () => {
    if (!pdfForm.nameEn.trim() || !pdfFile) return;
    setPdfLoading(true);
    try {
      const data = await ingestPDF(pdfFile, pdfForm.nameEn, pdfForm.nameAr, pdfForm.category, pdfForm.description);
      toast({ title: `Added "${pdfForm.nameEn}" — ${data.chunks_added} chunks` });
      setPdfForm(emptyForm()); setPdfFile(null); setModal(null);
      fetchSources();
    } catch (err) {
      toast({ title: err instanceof Error ? err.message : "Failed", variant: "destructive" });
    } finally {
      setPdfLoading(false);
    }
  };

  const uniqueCategories = new Set(sources.map((s) => s.category)).size;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-foreground">{t("admin.title")}</h1>
          <Button variant="outline" onClick={() => navigate("/admin")} className="border-border text-foreground hover:bg-card">
            {t("admin.logout")}
          </Button>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-muted text-sm">{t("admin.totalSources")}</span>
              <Database className="w-5 h-5 text-primary" />
            </div>
            <p className="text-3xl font-bold text-foreground">{sources.length}</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-muted text-sm">Total Chunks</span>
              <Clock className="w-5 h-5 text-orange-500" />
            </div>
            <p className="text-3xl font-bold text-foreground">{totalChunks}</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-muted text-sm">{t("admin.categories")}</span>
              <Layers className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-3xl font-bold text-foreground">{uniqueCategories}</p>
          </div>
        </div>

        {/* Sources table */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-foreground">{t("admin.sources")}</h2>
            <div className="flex gap-2">
              <Button onClick={() => setModal("url")} variant="outline" className="border-border text-foreground hover:bg-background gap-2">
                <LinkIcon className="w-4 h-4" /> Add URL
              </Button>
              <Button onClick={() => setModal("pdf")} className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
                <Upload className="w-4 h-4" /> Upload PDF
              </Button>
            </div>
          </div>

          {isLoading ? (
            <p className="text-gray-muted text-sm py-8 text-center">Loading knowledge base...</p>
          ) : sources.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="w-10 h-10 text-gray-muted mx-auto mb-3 opacity-40" />
              <p className="text-gray-muted text-sm">No sources yet. Add a URL or upload a PDF.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {sources.map((source) => (
                <div key={source.name} className="flex items-center justify-between py-3 px-2 border-b border-border last:border-0 gap-4">
                  {/* Icon */}
                  <div className="w-9 h-9 bg-background rounded-lg flex items-center justify-center border border-border flex-shrink-0">
                    <BookOpen className="w-4 h-4 text-gray-muted" />
                  </div>

                  {/* Names + meta */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-medium text-foreground">{source.name}</p>
                      {source.name_ar && (
                        <p className="text-gold text-sm" dir="rtl">{source.name_ar}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-1 flex-wrap">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${categoryBadge[source.category] ?? categoryBadge.other}`}>
                        {CATEGORIES.find(c => c.value === source.category)?.labelEn ?? source.category}
                      </span>
                      <span className="text-xs text-gray-muted">{source.chunks} chunks</span>
                      {source.url ? (
                        <a href={source.url} target="_blank" rel="noopener noreferrer"
                          className="text-xs text-gold hover:underline inline-flex items-center gap-1">
                          <ExternalLink className="w-3 h-3" /> View Source
                        </a>
                      ) : (
                        <span className="text-xs text-gray-muted inline-flex items-center gap-1">
                          <FileText className="w-3 h-3" /> PDF
                        </span>
                      )}
                    </div>
                    {source.description && (
                      <p className="text-xs text-gray-muted mt-1 truncate">{source.description}</p>
                    )}
                  </div>

                  {/* Delete */}
                  <button onClick={() => handleDelete(source.name)}
                    className="p-2 text-gray-muted hover:text-red-500 transition-colors flex-shrink-0">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* ── Add URL Modal ── */}
      {modal === "url" && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
          onClick={(e) => e.target === e.currentTarget && setModal(null)}>
          <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-white text-lg">Add Website</h3>
              <button onClick={() => setModal(null)} className="text-gray-muted hover:text-white"><X className="w-5 h-5" /></button>
            </div>

            <label className="text-xs text-gray-muted block mb-1">Source Name (English) *</label>
            <Input value={urlForm.nameEn} onChange={(e) => setUrlForm(f => ({...f, nameEn: e.target.value}))}
              placeholder='e.g. "Sahih al-Bukhari"' className="bg-background border-border text-white mb-3" />

            <label className="text-xs text-gray-muted block mb-1">اسم المصدر (عربي)</label>
            <Input value={urlForm.nameAr} onChange={(e) => setUrlForm(f => ({...f, nameAr: e.target.value}))}
              placeholder='مثال: صحيح البخاري' className="bg-background border-border text-white mb-3 text-right" dir="rtl" />

            <label className="text-xs text-gray-muted block mb-1">Category</label>
            <select value={urlForm.category} onChange={(e) => setUrlForm(f => ({...f, category: e.target.value}))}
              className="w-full bg-background border border-border text-white rounded-md px-3 py-2 text-sm mb-3 outline-none focus:border-primary">
              {CATEGORIES.map(c => (
                <option key={c.value} value={c.value}>{c.labelEn} — {c.labelAr}</option>
              ))}
            </select>

            <label className="text-xs text-gray-muted block mb-1">Description (optional)</label>
            <Input value={urlForm.description} onChange={(e) => setUrlForm(f => ({...f, description: e.target.value}))}
              placeholder="Short description shown to users" className="bg-background border-border text-white mb-3" />

            <label className="text-xs text-gray-muted block mb-1">URL *</label>
            <Input value={urlValue} onChange={(e) => setUrlValue(e.target.value)}
              placeholder="https://sunnah.com/bukhari/1" className="bg-background border-border text-white mb-4" />

            <Button onClick={handleAddURL} disabled={urlLoading || !urlForm.nameEn.trim() || !urlValue.trim()}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
              {urlLoading ? "Adding..." : "Add to Knowledge Base"}
            </Button>
          </div>
        </div>
      )}

      {/* ── Upload PDF Modal ── */}
      {modal === "pdf" && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
          onClick={(e) => e.target === e.currentTarget && setModal(null)}>
          <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-white text-lg">Upload PDF</h3>
              <button onClick={() => setModal(null)} className="text-gray-muted hover:text-white"><X className="w-5 h-5" /></button>
            </div>

            <label className="text-xs text-gray-muted block mb-1">Source Name (English) *</label>
            <Input value={pdfForm.nameEn} onChange={(e) => setPdfForm(f => ({...f, nameEn: e.target.value}))}
              placeholder='e.g. "Fiqh al-Sunnah"' className="bg-background border-border text-white mb-3" />

            <label className="text-xs text-gray-muted block mb-1">اسم المصدر (عربي)</label>
            <Input value={pdfForm.nameAr} onChange={(e) => setPdfForm(f => ({...f, nameAr: e.target.value}))}
              placeholder='مثال: فقه السنة' className="bg-background border-border text-white mb-3 text-right" dir="rtl" />

            <label className="text-xs text-gray-muted block mb-1">Category</label>
            <select value={pdfForm.category} onChange={(e) => setPdfForm(f => ({...f, category: e.target.value}))}
              className="w-full bg-background border border-border text-white rounded-md px-3 py-2 text-sm mb-3 outline-none focus:border-primary">
              {CATEGORIES.map(c => (
                <option key={c.value} value={c.value}>{c.labelEn} — {c.labelAr}</option>
              ))}
            </select>

            <label className="text-xs text-gray-muted block mb-1">Description (optional)</label>
            <Input value={pdfForm.description} onChange={(e) => setPdfForm(f => ({...f, description: e.target.value}))}
              placeholder="Short description shown to users" className="bg-background border-border text-white mb-3" />

            <label className="text-xs text-gray-muted block mb-1">PDF File *</label>
            <input type="file" accept=".pdf" onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
              className="w-full text-sm text-gray-muted mb-4 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-sm file:bg-primary file:text-white hover:file:bg-primary/90 cursor-pointer" />

            <Button onClick={handleAddPDF} disabled={pdfLoading || !pdfForm.nameEn.trim() || !pdfFile}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
              {pdfLoading ? "Uploading..." : "Upload & Add to Knowledge Base"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
