import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import Layout from "@/components/Layout";
import { Send, BookOpen } from "lucide-react";

interface Message {
  id: string;
  type: "user" | "assistant";
  content: string;
  sources?: string[];
  timestamp: Date;
}

const mockResponses = [
  {
    keywords: ["prayer", "salah", "salat"],
    response: "Prayer (Salah) is one of the Five Pillars of Islam and is obligatory for all adult Muslims. Muslims are required to perform five daily prayers: Fajr (dawn), Dhuhr (midday), Asr (afternoon), Maghrib (sunset), and Isha (night).",
    sources: ["Sahih al-Bukhari, Book 8, Hadith 345", "Quran 2:238", "Sahih Muslim, Book 5, Hadith 1423"]
  },
  {
    keywords: ["zakat", "charity"],
    response: "Zakat is the obligatory charity that Muslims must pay annually on their wealth if it meets the nisab (minimum threshold). The standard rate is 2.5% of one's savings and certain assets that have been held for a lunar year.",
    sources: ["Quran 2:110", "Sahih al-Bukhari, Book 24, Hadith 486", "Fiqh al-Zakat by Yusuf al-Qaradawi, p. 45"]
  },
  {
    keywords: ["fasting", "ramadan", "sawm"],
    response: "Fasting during the month of Ramadan is one of the Five Pillars of Islam. Muslims abstain from food, drink, and marital relations from dawn (Fajr) until sunset (Maghrib). The fast is broken with the Maghrib prayer.",
    sources: ["Quran 2:183-185", "Sahih al-Bukhari, Book 31, Hadith 123", "Sahih Muslim, Book 13, Hadith 2567"]
  }
];

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "assistant",
      content: "Assalamu alaikum! I'm here to help answer your questions about Islam using only authentic Islamic sources. Please ask me anything about Islamic teachings, practices, or rulings.",
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

    // Simulate AI response with mock data
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
          content: matchingResponse.response,
          sources: matchingResponse.sources,
          timestamp: new Date(),
        };
      } else {
        assistantResponse = {
          id: (Date.now() + 1).toString(),
          type: "assistant",
          content: "I could not find this answer in the approved Islamic sources available to me. Please try rephrasing your question or ask about topics covered in the Quran, authentic Hadith collections, or classical Islamic texts. For specific personal rulings, please consult a qualified Islamic scholar.",
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
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex flex-col h-[calc(100vh-16rem)]">
          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto space-y-4 mb-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
              >
                <Card className={`max-w-[80%] ${
                  message.type === "user" 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-card"
                }`}>
                  <CardContent className="p-4">
                    <div className="text-sm">
                      {message.content}
                    </div>
                    
                    {/* Sources */}
                    {message.sources && message.sources.length > 0 && (
                      <div className="mt-4 pt-3 border-t border-border/30">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                          <BookOpen className="h-3 w-3" />
                          <span className="font-semibold">Sources:</span>
                        </div>
                        <div className="space-y-1">
                          {message.sources.map((source, index) => (
                            <div key={index} className="text-xs text-muted-foreground bg-muted/30 rounded px-2 py-1">
                              {source}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="text-xs text-muted-foreground/70 mt-2">
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <Card className="max-w-[80%] bg-card">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                      </div>
                      <span className="text-sm text-muted-foreground">Searching sources...</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
          
          {/* Input Area */}
          <div className="flex items-center space-x-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask your Islamic question here..."
              className="flex-1"
              disabled={isLoading}
            />
            <Button 
              onClick={handleSendMessage} 
              disabled={!inputValue.trim() || isLoading}
              size="icon"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="text-xs text-muted-foreground mt-2 text-center">
            This assistant only uses approved Islamic sources. For personal rulings, consult a qualified scholar.
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Chat;