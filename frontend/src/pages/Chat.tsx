import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Moon, Send, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/Navbar";
import { useLanguage } from "@/contexts/LanguageContext";
import { sendMessage } from "@/services/api";
import type { ChatSource } from "@/services/api";

interface Message {
  id: string;
  type: "user" | "assistant";
  content: string;
  sources?: ChatSource[];
  foundInSources?: boolean;
}

interface HistoryTurn {
  role: "user" | "assistant";
  content: string;
}

const Chat = () => {
  const { t, isRTL, language } = useLanguage();
  const appName = language === "ar" ? "زاد" : "Zad";
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const historyRef = useRef<HistoryTurn[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const suggestedQuestions = [
    t("question.prayer"),
    t("question.zakat"),
    t("question.fasting"),
    t("question.travel"),
    t("question.water"),
  ];

  const handleSendMessage = async (question?: string) => {
    const text = question || inputValue;
    if (!text.trim() || isLoading) return;

    setError(null);
    const userMessage: Message = { id: Date.now().toString(), type: "user", content: text };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const data = await sendMessage(text, historyRef.current);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: data.answer,
        sources: data.sources_used,
        foundInSources: data.found_in_sources,
      };
      setMessages((prev) => [...prev, assistantMessage]);
      historyRef.current = [
        ...historyRef.current,
        { role: "user", content: text },
        { role: "assistant", content: data.answer },
      ].slice(-12);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      const isConnectionError = message.includes("fetch") || message.includes("Failed to fetch");
      setError(
        isConnectionError
          ? "Cannot connect to the backend server. Make sure it is running on port 8000."
          : `Error: ${message}`
      );
      setMessages((prev) => prev.filter((m) => m.id !== userMessage.id));
    } finally {
      setIsLoading(false);
    }
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
        {error && (
          <div className="mb-4 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
            ⚠ {error}
          </div>
        )}

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
            <Link to="/sources" className="inline-flex items-center gap-2 px-5 py-2.5 border border-gold text-gold rounded-full text-sm hover:bg-gold/10 transition-colors mb-10">
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
                <button key={index} onClick={() => handleSendMessage(question)} className="px-4 py-2 border border-border rounded-full text-sm text-white hover:border-gray-muted hover:bg-card transition-colors">
                  {question}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto space-y-4 mb-4 pb-4">
            {messages.map((message) => (
              <div key={message.id} dir="ltr" className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] rounded-2xl px-5 py-3 ${message.type === "user" ? "bg-gold text-background" : "bg-card border border-border"}`}>
                  <p className={`whitespace-pre-wrap leading-relaxed ${message.type === "user" ? "text-background" : "text-white"}`}>
                    {message.content}
                  </p>
                  {message.type === "assistant" && message.sources && message.sources.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-border space-y-1">
                      {Array.from(new Map(message.sources.map((s) => [s.source_name, s])).values()).map((source, idx) => (
                        <div key={idx} className="text-xs text-gray-muted flex items-center gap-1">
                          <span className="font-medium">{t("chat.sourceLabel")}</span>
                          {source.source_url ? (
                            <a href={source.source_url} target="_blank" rel="noopener noreferrer" className="text-gold hover:underline">{source.source_name}</a>
                          ) : (
                            <span className="text-gold">{source.source_name}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                  {message.type === "assistant" && message.foundInSources === false && (
                    <div className="mt-3 pt-3 border-t border-yellow-500/30 text-xs text-yellow-400">
                      ⚠ This answer could not be found in the current knowledge base.
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
                    <div className="w-2 h-2 bg-gold rounded-full animate-bounce" style={{ animationDelay: "0.15s" }} />
                    <div className="w-2 h-2 bg-gold rounded-full animate-bounce" style={{ animationDelay: "0.3s" }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        )}

        <div className="sticky bottom-0 bg-background pt-4 pb-6">
          <div className="flex items-center gap-3 bg-card border border-border rounded-xl p-2">
            <Input value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyDown={handleKeyPress} placeholder={t("chat.placeholder")} className="flex-1 bg-transparent border-0 focus-visible:ring-0 text-white placeholder:text-gray-muted" disabled={isLoading} />
            <Button onClick={() => handleSendMessage()} disabled={!inputValue.trim() || isLoading} size="icon" className="bg-gold hover:bg-gold/90 text-background rounded-lg">
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Chat;
