import { useState } from "react";
import { Link } from "react-router-dom";
import { Moon, Send, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/Navbar";
import { useLanguage } from "@/contexts/LanguageContext";

interface Message {
  id: string;
  type: "user" | "assistant";
  content: string;
  sources?: { name: string; category: string }[];
}

const Chat = () => {
  const { t, isRTL, language } = useLanguage();
  const appName = language === "ar" ? "زاد" : "Zad";
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const suggestedQuestions = [
    t("question.prayer"),
    t("question.zakat"),
    t("question.fasting"),
    t("question.travel"),
    t("question.water"),
  ];

  const mockResponses: Record<string, { content: string; sources: { name: string; category: string }[] }> = {
    prayer: {
      content: t("chat.response.prayer"),
      sources: [
        { name: "Sahih al-Bukhari", category: t("chat.source.hadith") },
        { name: "Fiqh al-Sunnah", category: t("chat.source.fiqh") },
      ],
    },
    zakat: {
      content: t("chat.response.zakat"),
      sources: [
        { name: "Quran 2:267", category: t("chat.source.quran") },
        { name: "Sahih Muslim", category: t("chat.source.hadith") },
      ],
    },
    fasting: {
      content: t("chat.response.fasting"),
      sources: [
        { name: "Quran 2:183-185", category: t("chat.source.quran") },
        { name: "Sahih al-Bukhari", category: t("chat.source.hadith") },
      ],
    },
    default: {
      content: t("chat.response.default"),
      sources: [{ name: "The Noble Qur'an", category: t("chat.source.quran") }],
    },
  };

  const handleSendMessage = (question?: string) => {
    const text = question || inputValue;
    if (!text.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: text,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    setTimeout(() => {
      const lowerText = text.toLowerCase();
      let response = mockResponses.default;

      if (
        lowerText.includes("prayer") ||
        lowerText.includes("salah") ||
        lowerText.includes("الصلاة")
      ) {
        response = mockResponses.prayer;
      } else if (lowerText.includes("zakat") || lowerText.includes("الزكاة")) {
        response = mockResponses.zakat;
      } else if (
        lowerText.includes("fasting") ||
        lowerText.includes("ramadan") ||
        lowerText.includes("الصيام") ||
        lowerText.includes("رمضان")
      ) {
        response = mockResponses.fasting;
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: response.content,
        sources: response.sources,
      };

      setMessages((prev) => [...prev, assistantMessage]);
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
    <div className="min-h-screen bg-background flex flex-col" dir={isRTL ? "rtl" : "ltr"}>
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-8 flex flex-col">
        {messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center max-w-2xl mx-auto">
            <div className="w-20 h-20 bg-card rounded-2xl flex items-center justify-center border border-border mb-6">
              <Moon className="w-10 h-10 text-gold" />
            </div>

            <div className="flex items-center mb-2">
              <span className="text-4xl font-bold text-white">{appName}</span>
              <span className="text-4xl font-bold text-gold">AI</span>
            </div>

            <p className="text-xs uppercase tracking-[0.3em] text-gray-muted mb-6">{t("app.subtitle")}</p>

            <p className="text-gray-muted mb-2">{t("chat.descriptionLine1")}</p>
            <p className="text-gray-muted mb-6">{t("chat.descriptionLine2")}</p>

            <Link
              to="/sources"
              className="inline-flex items-center gap-2 px-5 py-2.5 border border-gold text-gold rounded-full text-sm hover:bg-gold/10 transition-colors mb-10"
            >
              <BookOpen className="w-4 h-4" />
              {t("chat.viewSources")}
            </Link>

            <div className="w-full flex items-center gap-4 mb-6">
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs uppercase tracking-[0.2em] text-gray-muted">{t("chat.suggestedQuestions")}</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            <div className="flex flex-wrap justify-center gap-3">
              {suggestedQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleSendMessage(question)}
                  className="px-4 py-2 border border-border rounded-full text-sm text-white hover:border-gray-muted hover:bg-card transition-colors"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto space-y-4 mb-4 pb-4">
            {messages.map((message) => (
              <div
                key={message.id}
                dir="ltr"
                className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-5 py-3 ${
                    message.type === "user" ? "bg-gold text-background" : "bg-card border border-border"
                  }`}
                >
                  <p className={message.type === "user" ? "text-background" : "text-white"}>{message.content}</p>
                  {message.sources && (
                    <div className="mt-3 pt-3 border-t border-border space-y-1">
                      {message.sources.map((source, idx) => (
                        <div key={idx} className="text-xs text-gray-muted">
                          <span className="font-medium">{t("chat.sourceLabel")}</span> {source.name} •{" "}
                          <span className="text-gold">{source.category}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-card border border-border rounded-2xl px-5 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-gold rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-gold rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                    <div className="w-2 h-2 bg-gold rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="sticky bottom-0 bg-background pt-4 pb-6">
          <div className="flex items-center gap-3 bg-card border border-border rounded-xl p-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={t("chat.placeholder")}
              className="flex-1 bg-transparent border-0 focus-visible:ring-0 text-white placeholder:text-gray-muted"
              disabled={isLoading}
            />
            <Button
              onClick={() => handleSendMessage()}
              disabled={!inputValue.trim() || isLoading}
              size="icon"
              className="bg-gold hover:bg-gold/90 text-background rounded-lg"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Chat;
