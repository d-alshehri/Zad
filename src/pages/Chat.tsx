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

const suggestedQuestions = [
  "What are the conditions for a valid prayer?",
  "How is Zakat calculated on savings?",
  "What are the pillars of fasting in Ramadan?",
  "What is the ruling on combining prayers while traveling?",
  "What are the types of water in Islamic jurisprudence?",
];

const mockResponses: Record<string, { content: string; sources: { name: string; category: string }[] }> = {
  prayer: {
    content: "Prayer (Salah) has several conditions for validity including: ritual purity (tahara), covering the awrah, facing the Qibla, entering the prayer time, and having the intention (niyyah). The prayer also has pillars (arkan) that must be performed including standing, reciting Al-Fatiha, bowing (ruku'), prostrating (sujud), and the final sitting.",
    sources: [{ name: "Sahih al-Bukhari", category: "Hadith" }, { name: "Fiqh al-Sunnah", category: "Fiqh" }],
  },
  zakat: {
    content: "Zakat on savings is calculated at 2.5% of wealth that has reached the nisab threshold and been held for one lunar year (hawl). The nisab is equivalent to 85 grams of gold or 595 grams of silver. Only the amount above nisab is subject to Zakat.",
    sources: [{ name: "Quran 2:267", category: "Qur'an" }, { name: "Sahih Muslim", category: "Hadith" }],
  },
  fasting: {
    content: "The pillars of fasting in Ramadan are: 1) Intention (niyyah) made before Fajr each day, 2) Abstaining from food, drink, and marital relations from dawn (Fajr) to sunset (Maghrib), 3) The fasting person must be Muslim, sane, and of age.",
    sources: [{ name: "Quran 2:183-185", category: "Qur'an" }, { name: "Sahih al-Bukhari", category: "Hadith" }],
  },
  default: {
    content: "This is an excellent question about Islamic knowledge. Based on authentic scholarly sources, the answer involves careful consideration of the Qur'an, Sunnah, and scholarly consensus. Please consult with a qualified scholar for detailed guidance on your specific situation.",
    sources: [{ name: "The Noble Qur'an", category: "Qur'an" }],
  },
};

const Chat = () => {
  const { t, isRTL } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
      if (lowerText.includes("prayer") || lowerText.includes("salah")) {
        response = mockResponses.prayer;
      } else if (lowerText.includes("zakat")) {
        response = mockResponses.zakat;
      } else if (lowerText.includes("fasting") || lowerText.includes("ramadan")) {
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
          /* Empty State */
          <div className="flex-1 flex flex-col items-center justify-center text-center max-w-2xl mx-auto">
            <div className="w-20 h-20 bg-card rounded-2xl flex items-center justify-center border border-border mb-6">
              <Moon className="w-10 h-10 text-gold" />
            </div>

            <div className="flex items-center mb-2">
              <span className="text-4xl font-bold text-white">Nur</span>
              <span className="text-4xl font-bold text-gold">AI</span>
            </div>

            <p className="text-xs uppercase tracking-[0.3em] text-gray-muted mb-6">
              {t("app.subtitle")}
            </p>

            <p className="text-gray-muted mb-2">
              Ask about Islamic teachings, rulings, and guidance
            </p>
            <p className="text-gray-muted mb-6">
              powered by trusted scholarly sources.
            </p>

            <Link
              to="/sources"
              className="inline-flex items-center gap-2 px-5 py-2.5 border border-gold text-gold rounded-full text-sm hover:bg-gold/10 transition-colors mb-10"
            >
              <BookOpen className="w-4 h-4" />
              View Sources
            </Link>

            {/* Divider with label */}
            <div className="w-full flex items-center gap-4 mb-6">
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs uppercase tracking-[0.2em] text-gray-muted">
                Suggested Questions
              </span>
              <div className="flex-1 h-px bg-border" />
            </div>

            {/* Suggested Questions */}
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
          /* Chat Messages */
          <div className="flex-1 overflow-y-auto space-y-4 mb-4 pb-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-5 py-3 ${
                    message.type === "user"
                      ? "bg-gold text-background"
                      : "bg-card border border-border"
                  }`}
                >
                  <p className={message.type === "user" ? "text-background" : "text-white"}>
                    {message.content}
                  </p>
                  {message.sources && (
                    <div className="mt-3 pt-3 border-t border-border space-y-1">
                      {message.sources.map((source, idx) => (
                        <div key={idx} className="text-xs text-gray-muted">
                          <span className="font-medium">Source:</span> {source.name} •{" "}
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

        {/* Input Area */}
        <div className="sticky bottom-0 bg-background pt-4 pb-6">
          <div className="flex items-center gap-3 bg-card border border-border rounded-xl p-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask a question about Islamic knowledge..."
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
