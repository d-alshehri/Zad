import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import Layout from "@/components/Layout";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";
import { Send, BookOpen, Sparkles } from "lucide-react";

interface Message {
  id: string;
  type: "user" | "assistant";
  content: string;
  sources?: string[];
  timestamp: Date;
}

const mockResponses = [
  {
    keywords: ["prayer", "salah", "salat", "صلاة", "الصلاة"],
    response: {
      en: "Prayer (Salah) is one of the Five Pillars of Islam and is obligatory for all adult Muslims. Muslims perform five daily prayers: Fajr (dawn), Dhuhr (midday), Asr (afternoon), Maghrib (sunset), and Isha (night).",
      ar: "الصلاة هي أحد أركان الإسلام الخمسة وهي فرض على كل مسلم بالغ. يؤدي المسلمون خمس صلوات يومياً: الفجر والظهر والعصر والمغرب والعشاء."
    },
    sources: ["Sahih al-Bukhari, Book 8, Hadith 345", "Quran 2:238", "Sahih Muslim, Book 5"]
  },
  {
    keywords: ["zakat", "charity", "زكاة", "الزكاة"],
    response: {
      en: "Zakat is obligatory charity that Muslims must pay annually on their wealth if it meets the nisab (minimum threshold). The standard rate is 2.5% of savings held for a lunar year.",
      ar: "الزكاة هي صدقة واجبة يدفعها المسلمون سنوياً على أموالهم إذا بلغت النصاب. المعدل القياسي هو 2.5% من المدخرات المحتفظ بها لسنة قمرية."
    },
    sources: ["Quran 2:110", "Sahih al-Bukhari, Book 24", "Fiqh al-Zakat, p. 45"]
  },
  {
    keywords: ["fasting", "ramadan", "sawm", "صيام", "رمضان"],
    response: {
      en: "Fasting during Ramadan is one of the Five Pillars of Islam. Muslims abstain from food, drink, and marital relations from dawn (Fajr) until sunset (Maghrib).",
      ar: "الصيام في رمضان هو أحد أركان الإسلام الخمسة. يمتنع المسلمون عن الطعام والشراب والعلاقات الزوجية من الفجر حتى المغرب."
    },
    sources: ["Quran 2:183-185", "Sahih al-Bukhari, Book 31", "Sahih Muslim, Book 13"]
  }
];

const Chat = () => {
  const { t, language, isRTL } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "assistant",
      content: t("chat.welcome"),
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    setTimeout(() => {
      const lowercaseInput = inputValue.toLowerCase();
      const matchingResponse = mockResponses.find(response =>
        response.keywords.some(keyword => lowercaseInput.includes(keyword))
      );

      let assistantResponse: Message;
      
      if (matchingResponse) {
        assistantResponse = {
          id: (Date.now() + 1).toString(),
          type: "assistant",
          content: matchingResponse.response[language],
          sources: matchingResponse.sources,
          timestamp: new Date(),
        };
      } else {
        assistantResponse = {
          id: (Date.now() + 1).toString(),
          type: "assistant",
          content: t("chat.noAnswer"),
          timestamp: new Date(),
        };
      }

      setMessages(prev => [...prev, assistantResponse]);
      setIsLoading(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-6 py-12 max-w-4xl">
        {/* Premium Hero Section */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="relative inline-flex items-center justify-center mb-6">
            <div className="w-20 h-20 gradient-hero rounded-3xl flex items-center justify-center shadow-xl animate-scale-in">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <div className="absolute -inset-3 gradient-hero rounded-3xl opacity-20 blur-xl animate-pulse"></div>
          </div>
          <h1 className="text-5xl md:text-6xl font-display font-bold bg-gradient-to-r from-primary via-primary to-secondary bg-clip-text text-transparent mb-4 text-balance">
            {t("app.name")}
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">{t("chat.disclaimer")}</p>
        </div>

        {/* Enhanced Chat Area */}
        <div className="flex flex-col h-[calc(100vh-28rem)]">
          <div className="flex-1 overflow-y-auto space-y-6 mb-6 px-2">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === "user" ? (isRTL ? "justify-start" : "justify-end") : (isRTL ? "justify-end" : "justify-start")} animate-fade-in`}
              >
                <Card className={`max-w-[85%] shadow-medium border-0 overflow-hidden ${
                  message.type === "user" 
                    ? "gradient-primary text-white" 
                    : "bg-card shadow-soft"
                }`}>
                  <CardContent className="p-6">
                    <p className={`text-sm leading-relaxed ${message.type === "user" ? "text-white" : "text-foreground"}`}>
                      {message.content}
                    </p>
                    
                    {message.sources && message.sources.length > 0 && (
                      <div className="mt-6 pt-4 border-t border-white/20">
                        <div className="flex items-center gap-2 text-xs mb-3 opacity-90">
                          <BookOpen className="h-4 w-4" />
                          <span className="font-semibold">{t("chat.sources")}:</span>
                        </div>
                        <div className="space-y-2">
                          {message.sources.map((source, index) => (
                            <div key={index} className="text-xs bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/20">
                              {source}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            ))}
            
            {isLoading && (
              <div className={`flex ${isRTL ? "justify-end" : "justify-start"} animate-fade-in`}>
                <Card className="bg-card shadow-soft border-0">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 bg-primary rounded-full animate-bounce"></div>
                        <div className="w-2.5 h-2.5 bg-secondary rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                        <div className="w-2.5 h-2.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                      </div>
                      <span className="text-sm text-muted-foreground font-medium">{t("chat.searching")}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
          
          {/* Enhanced Input Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={t("chat.placeholder")}
                className="flex-1 h-14 bg-card border-2 border-border/50 focus:border-primary shadow-medium rounded-2xl text-base px-6 transition-all duration-200"
                disabled={isLoading}
                dir={isRTL ? "rtl" : "ltr"}
              />
              <Button 
                onClick={handleSendMessage} 
                disabled={!inputValue.trim() || isLoading}
                size="lg"
                className="h-14 w-14 gradient-primary hover:shadow-large transition-all duration-300 rounded-2xl"
              >
                <Send className={`h-5 w-5 ${isRTL ? "rotate-180" : ""}`} />
              </Button>
            </div>
            
            <Button asChild variant="outline" className="w-full h-12 border-primary/30 text-primary hover:bg-primary/10 hover:border-primary/50 rounded-2xl font-medium transition-all duration-200 shadow-soft">
              <Link to="/sources" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                {t("chat.viewSources")}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Chat;