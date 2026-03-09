import { useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";
import { Upload, Trash2, Eye, Lock, ArrowLeft, ArrowRight } from "lucide-react";

interface Source {
  id: string;
  title: string;
  author: string;
  type: string;
  status: "active" | "pending" | "disabled";
  uploadDate: string;
}

const mockSources: Source[] = [
  { id: "1", title: "Sahih al-Bukhari", author: "Imam al-Bukhari", type: "hadith", status: "active", uploadDate: "2024-01-01" },
  { id: "2", title: "Tafsir Ibn Kathir", author: "Ibn Kathir", type: "tafsir", status: "active", uploadDate: "2024-01-02" },
  { id: "3", title: "Contemporary Fiqh", author: "Dr. Muhammad Ali", type: "fiqh", status: "pending", uploadDate: "2024-01-10" }
];

const Admin = () => {
  const { t, isRTL } = useLanguage();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [sources, setSources] = useState(mockSources);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const { toast } = useToast();
  const ArrowIcon = isRTL ? ArrowRight : ArrowLeft;

  const handleLogin = () => {
    if (password === "admin123") {
      setIsAuthenticated(true);
      toast({ title: "Access Granted" });
    } else {
      toast({ title: "Access Denied", variant: "destructive" });
    }
  };

  const handleFileUpload = () => {
    if (!uploadFile) return;
    const newSource: Source = {
      id: Date.now().toString(),
      title: uploadFile.name.replace(/\.[^/.]+$/, ""),
      author: "Unknown",
      type: "document",
      status: "pending",
      uploadDate: new Date().toISOString().split('T')[0]
    };
    setSources(prev => [...prev, newSource]);
    setUploadFile(null);
    toast({ title: "File Uploaded" });
  };

  const handleDeleteSource = (id: string) => {
    setSources(prev => prev.filter(s => s.id !== id));
    toast({ title: "Source Removed" });
  };

  const handleToggleStatus = (id: string) => {
    setSources(prev => prev.map(s => 
      s.id === id ? { ...s, status: s.status === "active" ? "disabled" : "active" } : s
    ));
  };

  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 max-w-md">
          <Button asChild variant="ghost" className="mb-6">
            <Link to="/" className="flex items-center gap-2">
              <ArrowIcon className="h-4 w-4" />
              {isRTL ? "العودة" : "Back"}
            </Link>
          </Button>

          <Card className="border-0 shadow-xl">
            <CardHeader className="text-center">
              <div className="mx-auto w-14 h-14 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg mb-2">
                <Lock className="h-7 w-7 text-primary-foreground" />
              </div>
              <CardTitle>{t("admin.title")}</CardTitle>
              <CardDescription>{t("admin.password")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleLogin()}
                placeholder="••••••••"
              />
              <Button onClick={handleLogin} className="w-full bg-gradient-to-r from-primary to-secondary">
                {t("admin.login")}
              </Button>
              <p className="text-xs text-muted-foreground text-center">Demo: admin123</p>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {t("admin.title")}
            </h1>
          </div>
          <Button variant="outline" onClick={() => setIsAuthenticated(false)}>
            {t("admin.logout")}
          </Button>
        </div>

        {/* Upload */}
        <Card className="mb-6 border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" /> Upload Source
            </CardTitle>
          </CardHeader>
          <CardContent className="flex gap-4">
            <Input
              type="file"
              accept=".pdf,.txt,.docx"
              onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
              className="flex-1"
            />
            <Button onClick={handleFileUpload} disabled={!uploadFile} className="bg-gradient-to-r from-primary to-secondary">
              Upload
            </Button>
          </CardContent>
        </Card>

        {/* Sources Table */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Manage Sources</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sources.map((source) => (
                  <TableRow key={source.id}>
                    <TableCell className="font-medium">{source.title}</TableCell>
                    <TableCell>{source.author}</TableCell>
                    <TableCell className="capitalize">{source.type}</TableCell>
                    <TableCell>
                      <Badge variant={source.status === "active" ? "default" : source.status === "pending" ? "secondary" : "destructive"}>
                        {source.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" onClick={() => handleToggleStatus(source.id)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteSource(source.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <Card className="border-0 shadow-lg text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-primary">{sources.filter(s => s.status === "active").length}</div>
              <p className="text-sm text-muted-foreground">Active</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-secondary-foreground">{sources.filter(s => s.status === "pending").length}</div>
              <p className="text-sm text-muted-foreground">Pending</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{sources.length}</div>
              <p className="text-sm text-muted-foreground">Total</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Admin;