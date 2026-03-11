import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { Shield, Mail } from "lucide-react";
import Navbar from "@/components/Navbar";

const About = () => {
  const { language, isRTL, t } = useLanguage();
  const { toast } = useToast();
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const appName = language === "ar" ? "زاد" : "Zad";

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: t("about.messageSent"),
      description: t("about.messageSentDesc"),
    });
    setFormData({ name: "", email: "", message: "" });
  };

  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const c =
    language === "en"
      ? {
          aboutTitle: `About ${appName}`,
          p1: `${appName} is a digital reference tool designed to help Muslims access answers grounded in authentic scholarly sources. Our platform aggregates knowledge from the Quran, authentic Hadith, classical Tafsir, and recognized scholarly opinions to provide reliable Islamic guidance.`,
          p2: "Our system operates with strict adherence to authentic Islamic sources. Every response is derived from verified scholarly texts, ensuring that users receive guidance rooted in traditional Islamic scholarship.",
          disclaimer:
            "Important: This tool is a learning and reference aid. It is not a substitute for consulting qualified scholars regarding personal or complex matters.",
          contactTitle: "Contact Us",
          name: "Name",
          email: "Email",
          message: "Message",
          submit: "Send Message",
          namePh: "Enter your name",
          emailPh: "your.email@example.com",
          messagePh: "Share your thoughts, questions, or feedback...",
        }
      : {
          aboutTitle: `عن ${appName}`,
          p1: `${appName} أداة مرجعية رقمية تساعد المسلمين على الوصول إلى إجابات مبنية على مصادر علمية موثوقة من القرآن والسنة والتفاسير المعتمدة وأقوال أهل العلم.`,
          p2: "يعتمد النظام على مصادر إسلامية أصيلة، وكل إجابة تُبنى على نصوص موثقة لضمان تقديم إرشاد موثوق.",
          disclaimer: "مهم: هذه الأداة للتعلّم والمراجعة، وليست بديلا عن استشارة العلماء المؤهلين في المسائل الخاصة أو المعقدة.",
          contactTitle: "تواصل معنا",
          name: "الاسم",
          email: "البريد الإلكتروني",
          message: "الرسالة",
          submit: "إرسال الرسالة",
          namePh: "أدخل اسمك",
          emailPh: "your.email@example.com",
          messagePh: "شاركنا أفكارك أو أسئلتك أو ملاحظاتك...",
        };

  return (
    <div className="min-h-screen bg-background flex flex-col" dir={isRTL ? "rtl" : "ltr"}>
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-10 max-w-3xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-card rounded-lg flex items-center justify-center border border-border">
            <Shield className="w-5 h-5 text-gold" />
          </div>
          <h1 className="text-2xl font-bold text-white">{c.aboutTitle}</h1>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 mb-10">
          <p className="text-muted-foreground leading-relaxed mb-4">{c.p1}</p>
          <p className="text-muted-foreground leading-relaxed mb-6">{c.p2}</p>

          <div className="border-l-4 border-gold bg-gold/5 rounded-r-lg p-4 flex items-start gap-3">
            <Shield className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
            <p className="text-sm text-muted-foreground leading-relaxed">{c.disclaimer}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-card rounded-lg flex items-center justify-center border border-border">
            <Mail className="w-5 h-5 text-gold" />
          </div>
          <h1 className="text-2xl font-bold text-white">{c.contactTitle}</h1>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <form onSubmit={handleContactSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-muted-foreground mb-1.5 block">{c.name}</label>
                <input
                  value={formData.name}
                  onChange={handleInputChange("name")}
                  placeholder={c.namePh}
                  required
                  className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-white placeholder:text-muted-foreground text-sm focus:outline-none focus:border-gold/50"
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1.5 block">{c.email}</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange("email")}
                  placeholder={c.emailPh}
                  required
                  className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-white placeholder:text-muted-foreground text-sm focus:outline-none focus:border-gold/50"
                />
              </div>
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1.5 block">{c.message}</label>
              <textarea
                value={formData.message}
                onChange={handleInputChange("message")}
                placeholder={c.messagePh}
                required
                rows={5}
                className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-white placeholder:text-muted-foreground text-sm focus:outline-none focus:border-gold/50 resize-none"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gold hover:bg-gold/90 text-background font-medium rounded-lg py-2.5 text-sm transition-colors"
            >
              {c.submit}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default About;
