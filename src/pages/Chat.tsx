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
      <div className="container mx-auto px-4 py-6 max-w-3xl">
        {/* Hero */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl shadow-xl mb-4">
            <Sparkles className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary via-primary to-secondary bg-clip-text text-transparent mb-2">
            {t("app.name")}
          </h1>
          <p className="text-muted-foreground">{t("chat.disclaimer")}</p>
        </div>

        {/* Chat Area */}
        <div className="flex flex-col h-[calc(100vh-22rem)]">
          <div className="flex-1 overflow-y-auto space-y-4 mb-4 px-1">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === "user" ? (isRTL ? "justify-start" : "justify-end") : (isRTL ? "justify-end" : "justify-start")}`}
              >
                <Card className={`max-w-[85%] shadow-lg border-0 ${
                  message.type === "user" 
                    ? "bg-gradient-to-br from-primary to-primary/90 text-primary-foreground" 
                    : "bg-card"
                }`}>
                  <CardContent className="p-4">
                    <p className="text-sm leading-relaxed">
                      {message.content}
                    </p>
                    
                    {message.sources && message.sources.length > 0 && (
                      <div className="mt-4 pt-3 border-t border-border/20">
                        <div className="flex items-center gap-2 text-xs mb-2 opacity-70">
                          <BookOpen className="h-3 w-3" />
                          <span className="font-semibold">{t("chat.sources")}:</span>
                        </div>
                        <div className="space-y-1">
                          {message.sources.map((source, index) => (
                            <div key={index} className="text-xs bg-secondary/20 rounded-lg px-3 py-1.5">
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
              <div className={`flex ${isRTL ? "justify-end" : "justify-start"}`}>
                <Card className="bg-card shadow-lg border-0">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-secondary rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-secondary rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                        <div className="w-2 h-2 bg-secondary rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                      </div>
                      <span className="text-sm text-muted-foreground">{t("chat.searching")}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
          
          {/* Input */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={t("chat.placeholder")}
                className="flex-1 h-12 bg-card border-2 border-border/50 focus:border-primary shadow-lg"
                disabled={isLoading}
                dir={isRTL ? "rtl" : "ltr"}
              />
              <Button 
                onClick={handleSendMessage} 
                disabled={!inputValue.trim() || isLoading}
                size="lg"
                className="h-12 w-12 bg-gradient-to-br from-primary to-secondary hover:opacity-90 shadow-lg"
              >
                <Send className={`h-5 w-5 ${isRTL ? "rotate-180" : ""}`} />
              </Button>
            </div>
            
            <Button asChild variant="outline" className="w-full border-secondary/50 text-secondary-foreground hover:bg-secondary/10">
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