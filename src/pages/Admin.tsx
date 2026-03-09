import { useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Upload, Trash2, Eye, Lock } from "lucide-react";

interface Source {
  id: string;
  title: string;
  author: string;
  type: string;
  status: "active" | "pending" | "disabled";
  uploadDate: string;
  fileSize: string;
}

const mockSources: Source[] = [
  {
    id: "1",
    title: "Sahih al-Bukhari",
    author: "Imam al-Bukhari", 
    type: "hadith",
    status: "active",
    uploadDate: "2024-01-01",
    fileSize: "2.4 MB"
  },
  {
    id: "2", 
    title: "Tafsir Ibn Kathir",
    author: "Ibn Kathir",
    type: "tafsir", 
    status: "active",
    uploadDate: "2024-01-02",
    fileSize: "5.8 MB"
  },
  {
    id: "3",
    title: "Contemporary Fiqh Issues",
    author: "Dr. Muhammad Ali",
    type: "fiqh",
    status: "pending",
    uploadDate: "2024-01-10", 
    fileSize: "1.2 MB"
  }
];

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [sources, setSources] = useState(mockSources);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const { toast } = useToast();

  const handleLogin = () => {
    if (password === "admin123") {
      setIsAuthenticated(true);
      toast({
        title: "Access Granted",
        description: "Welcome to the admin dashboard.",
      });
    } else {
      toast({
        title: "Access Denied", 
        description: "Incorrect password.",
        variant: "destructive",
      });
    }
  };

  const handleFileUpload = () => {
    if (!uploadFile) {
      toast({
        title: "No File Selected",
        description: "Please select a file to upload.",
        variant: "destructive",
      });
      return;
    }

    // Mock upload - in real app this would send to backend
    const newSource: Source = {
      id: Date.now().toString(),
      title: uploadFile.name.replace(/\.[^/.]+$/, ""), // Remove extension
      author: "Unknown Author",
      type: "document",
      status: "pending",
      uploadDate: new Date().toISOString().split('T')[0],
      fileSize: `${(uploadFile.size / 1024 / 1024).toFixed(1)} MB`
    };

    setSources(prev => [...prev, newSource]);
    setUploadFile(null);
    
    toast({
      title: "File Uploaded", 
      description: `${uploadFile.name} has been uploaded and is pending review.`,
    });
  };

  const handleDeleteSource = (sourceId: string) => {
    setSources(prev => prev.filter(s => s.id !== sourceId));
    toast({
      title: "Source Removed",
      description: "The source has been deleted from the system.",
    });
  };

  const handleToggleStatus = (sourceId: string) => {
    setSources(prev => prev.map(s => 
      s.id === sourceId 
        ? { ...s, status: s.status === "active" ? "disabled" : "active" } 
        : s
    ));
    
    toast({
      title: "Status Updated",
      description: "Source status has been changed.",
    });
  };

  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 max-w-md">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-primary rounded-full flex items-center justify-center mb-4">
                <Lock className="h-6 w-6 text-primary-foreground" />
              </div>
              <CardTitle>Admin Access</CardTitle>
              <CardDescription>
                Enter the admin password to manage Islamic sources
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleLogin()}
                  placeholder="Enter admin password"
                />
              </div>
              <Button onClick={handleLogin} className="w-full">
                Access Dashboard
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                For demo purposes, password is: admin123
              </p>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
              <p className="text-muted-foreground">Manage Islamic knowledge sources</p>
            </div>
            <Button 
              variant="outline" 
              onClick={() => setIsAuthenticated(false)}
            >
              Logout
            </Button>
          </div>

          {/* Upload Section */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Upload New Source
              </CardTitle>
              <CardDescription>
                Add new Islamic texts to the knowledge base
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="file-upload">Select File (PDF, TXT, DOCX)</Label>
                <Input
                  id="file-upload"
                  type="file"
                  accept=".pdf,.txt,.docx"
                  onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                  className="cursor-pointer"
                />
              </div>
              <Button onClick={handleFileUpload} disabled={!uploadFile}>
                <Upload className="h-4 w-4 mr-2" />
                Upload Source
              </Button>
            </CardContent>
          </Card>

          {/* Sources Management */}
          <Card>
            <CardHeader>
              <CardTitle>Manage Sources</CardTitle>
              <CardDescription>
                Review, activate, or remove sources from the knowledge base
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Upload Date</TableHead>
                    <TableHead>Size</TableHead>
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
                        <Badge 
                          variant={
                            source.status === "active" 
                              ? "default"
                              : source.status === "pending"
                              ? "secondary" 
                              : "destructive"
                          }
                        >
                          {source.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{source.uploadDate}</TableCell>
                      <TableCell>{source.fileSize}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleToggleStatus(source.id)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleDeleteSource(source.id)}
                          >
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
          <div className="grid md:grid-cols-4 gap-4 mt-8">
            <Card>
              <CardContent className="p-6">
                <div className="text-2xl font-bold text-green-600">
                  {sources.filter(s => s.status === "active").length}
                </div>
                <p className="text-muted-foreground">Active Sources</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-2xl font-bold text-yellow-600">
                  {sources.filter(s => s.status === "pending").length}
                </div>
                <p className="text-muted-foreground">Pending Review</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-2xl font-bold text-red-600">
                  {sources.filter(s => s.status === "disabled").length}
                </div>
                <p className="text-muted-foreground">Disabled</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-2xl font-bold">
                  {sources.length}
                </div>
                <p className="text-muted-foreground">Total Sources</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Admin;