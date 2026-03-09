import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, FileText, Globe } from "lucide-react";

interface Source {
  id: string;
  title: string;
  author: string;
  type: "quran" | "hadith" | "tafsir" | "fiqh" | "fatwa";
  description: string;
  language: string;
  addedDate: string;
}

const mockSources: Source[] = [
  {
    id: "1",
    title: "The Holy Quran",
    author: "Divine Revelation",
    type: "quran",
    description: "Complete Quran with multiple translations including Sahih International, Yusuf Ali, and Pickthall.",
    language: "Arabic, English",
    addedDate: "2024-01-01"
  },
  {
    id: "2",
    title: "Sahih al-Bukhari",
    author: "Imam al-Bukhari",
    type: "hadith",
    description: "The most authentic collection of Prophetic traditions, containing over 7,000 hadith.",
    language: "Arabic, English",
    addedDate: "2024-01-01"
  },
  {
    id: "3",
    title: "Sahih Muslim",
    author: "Imam Muslim",
    type: "hadith",
    description: "Second most authentic hadith collection, complementing Sahih al-Bukhari.",
    language: "Arabic, English",
    addedDate: "2024-01-01"
  },
  {
    id: "4",
    title: "Tafsir Ibn Kathir",
    author: "Ibn Kathir",
    type: "tafsir",
    description: "Classical Quranic commentary widely accepted by Sunni scholars for its authenticity and clarity.",
    language: "Arabic, English",
    addedDate: "2024-01-02"
  },
  {
    id: "5",
    title: "Sunan Abu Dawud",
    author: "Abu Dawud",
    type: "hadith",
    description: "Collection of hadith focusing on legal matters and Islamic jurisprudence.",
    language: "Arabic, English",
    addedDate: "2024-01-02"
  },
  {
    id: "6",
    title: "Fiqh al-Zakat",
    author: "Yusuf al-Qaradawi",
    type: "fiqh",
    description: "Comprehensive contemporary work on the Islamic law of charity and wealth redistribution.",
    language: "Arabic, English",
    addedDate: "2024-01-03"
  },
  {
    id: "7",
    title: "IslamQA Fatwa Database",
    author: "Sheikh Muhammad Salih al-Munajjid",
    type: "fatwa",
    description: "Authentic Islamic rulings on contemporary issues from qualified scholars.",
    language: "Arabic, English",
    addedDate: "2024-01-05"
  },
  {
    id: "8",
    title: "Jami' at-Tirmidhi",
    author: "Imam at-Tirmidhi",
    type: "hadith",
    description: "One of the six major hadith collections, known for its detailed hadith classification.",
    language: "Arabic, English",
    addedDate: "2024-01-07"
  }
];

const typeIcons = {
  quran: BookOpen,
  hadith: FileText,
  tafsir: BookOpen,
  fiqh: FileText,
  fatwa: Globe
};

const typeColors = {
  quran: "default" as const,
  hadith: "secondary" as const, 
  tafsir: "outline" as const,
  fiqh: "secondary" as const,
  fatwa: "destructive" as const
};

const Sources = () => {
  const sourcesByType = mockSources.reduce((acc, source) => {
    if (!acc[source.type]) {
      acc[source.type] = [];
    }
    acc[source.type].push(source);
    return acc;
  }, {} as Record<string, Source[]>);

  const typeLabels = {
    quran: "Holy Quran",
    hadith: "Hadith Collections", 
    tafsir: "Quran Commentary (Tafsir)",
    fiqh: "Islamic Jurisprudence",
    fatwa: "Contemporary Rulings"
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Approved Islamic Sources</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              All answers from our Islamic Knowledge Assistant are based exclusively on these 
              authenticated and scholar-approved sources. No general AI knowledge is used.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12">
            {Object.entries(typeLabels).map(([type, label]) => {
              const count = sourcesByType[type]?.length || 0;
              const Icon = typeIcons[type as keyof typeof typeIcons];
              
              return (
                <Card key={type} className="text-center">
                  <CardContent className="p-4">
                    <Icon className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <div className="text-2xl font-bold">{count}</div>
                    <div className="text-sm text-muted-foreground">{label}</div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Sources by Category */}
          <div className="space-y-8">
            {Object.entries(sourcesByType).map(([type, sources]) => (
              <div key={type}>
                <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                  {(() => {
                    const Icon = typeIcons[type as keyof typeof typeIcons];
                    return <Icon className="h-6 w-6 text-primary" />;
                  })()}
                  {typeLabels[type as keyof typeof typeLabels]} ({sources.length})
                </h2>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {sources.map((source) => (
                    <Card key={source.id} className="h-full">
                      <CardHeader>
                        <div className="flex justify-between items-start mb-2">
                          <Badge variant={typeColors[source.type as keyof typeof typeColors]}>
                            {source.type.toUpperCase()}
                          </Badge>
                        </div>
                        <CardTitle className="text-lg">{source.title}</CardTitle>
                        <CardDescription className="font-medium">
                          {source.author}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-3">
                          {source.description}
                        </p>
                        <div className="flex justify-between items-center text-xs text-muted-foreground">
                          <span>Languages: {source.language}</span>
                          <span>Added: {source.addedDate}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Important Notice */}
          <div className="mt-12 p-6 bg-accent/50 rounded-lg border-l-4 border-primary">
            <h3 className="font-semibold text-lg mb-2">Source Verification Process</h3>
            <p className="text-muted-foreground">
              All sources in this database have been reviewed and approved by qualified Islamic scholars. 
              We only include texts that are widely accepted by the mainstream Islamic scholarly community. 
              Sources are regularly reviewed and updated to maintain accuracy and authenticity.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Sources;