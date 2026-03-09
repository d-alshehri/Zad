import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Shield, BookOpen, Mail, MessageSquare, ArrowLeft, ArrowRight, Moon, Star, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const About = () => {
  const { language, t, isRTL } = useLanguage();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  const ArrowIcon = isRTL ? ArrowRight : ArrowLeft;

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock form submission
    toast({
      title: language === "en" ? "Message Sent" : "تم إرسال الرسالة",
      description: language === "en" 
        ? "Thank you for your message. We'll get back to you soon." 
        : "شكراً لك على رسالتك. سنتواصل معك قريباً.",
    });
    setFormData({ name: "", email: "", message: "" });
  };

  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  const content = {
    en: {
      description: "NurAI is a digital reference tool designed to help Muslims access answers grounded in authentic scholarly sources. Our platform aggregates knowledge from the Quran, authentic Hadith, classical Tafsir, and recognized scholarly opinions to provide reliable Islamic guidance.",
      methodology: "Our Methodology",
      methodologyText: "NurAI operates with strict adherence to authentic Islamic sources. Every response is derived from verified scholarly texts, ensuring that users receive guidance rooted in traditional Islamic scholarship. We do not generate new religious rulings but rather serve as a bridge to established Islamic knowledge.",
      sourceTypes: "Knowledge Sources",
      sourceTypesText: "Our knowledge base includes the Holy Quran, authenticated Hadith collections (including the Six Books), classical commentaries, and fatwas from recognized scholars and institutions.",
      accuracy: "Accuracy & Verification",
      accuracyText: "All sources undergo rigorous verification by qualified Islamic scholars. We maintain transparency by citing specific references for every piece of information provided.",
      disclaimer: "Important: This tool is a learning and reference aid. It is not a substitute for consulting qualified scholars regarding personal or complex matters. For specific religious rulings (fatwas) that apply to your personal situation, always consult with qualified Islamic scholars.",
      contactTitle: "Contact Us",
      contactDesc: "Have questions, feedback, or suggestions? We'd love to hear from you.",
      nameLabel: "Your Name",
      emailLabel: "Email Address",
      messageLabel: "Message",
      sendButton: "Send Message",
      namePlaceholder: "Enter your name",
      emailPlaceholder: "your.email@example.com",
      messagePlaceholder: "Share your thoughts, questions, or feedback..."
    },
    ar: {
      description: "نور الذكاء هو أداة مرجعية رقمية مصممة لمساعدة المسلمين في الوصول إلى إجابات مؤسسة على المصادر العلمية الأصيلة. منصتنا تجمع المعرفة من القرآن الكريم والأحاديث الصحيحة والتفاسير الكلاسيكية والآراء العلمية المعتبرة لتقديم إرشاد إسلامي موثوق.",
      methodology: "منهجيتنا",
      methodologyText: "يعمل نور الذكاء بالالتزام الصارم بالمصادر الإسلامية الأصيلة. كل إجابة مستمدة من النصوص العلمية الموثقة، مما يضمن حصول المستخدمين على إرشاد متجذر في المنح الإسلامية التقليدية. نحن لا ننتج فتاوى جديدة بل نعمل كجسر للمعرفة الإسلامية الراسخة.",
      sourceTypes: "مصادر المعرفة",
      sourceTypesText: "قاعدة معرفتنا تشمل القرآن الكريم ومجموعات الأحاديث الموثقة (بما في ذلك الكتب الستة) والتفاسير الكلاسيكية والفتاوى من العلماء والمؤسسات المعتبرة.",
      accuracy: "الدقة والتحقق",
      accuracyText: "جميع المصادر تخضع للتحقق الصارم من قبل علماء إسلاميين مؤهلين. نحافظ على الشفافية من خلال الاستشهاد بمراجع محددة لكل معلومة نقدمها.",
      disclaimer: "مهم: هذه الأداة هي مساعد تعليمي ومرجعي. وهي ليست بديلاً عن استشارة العلماء المؤهلين في المسائل الشخصية أو المعقدة. للحصول على فتاوى دينية محددة تنطبق على وضعك الشخصي، استشر دائماً علماء إسلاميين مؤهلين.",
      contactTitle: "تواصل معنا",
      contactDesc: "هل لديك أسئلة أو ملاحظات أو اقتراحات؟ نود أن نسمع منك.",
      nameLabel: "اسمك",
      emailLabel: "عنوان البريد الإلكتروني",
      messageLabel: "الرسالة",
      sendButton: "إرسال الرسالة",
      namePlaceholder: "أدخل اسمك",
      emailPlaceholder: "your.email@example.com",
      messagePlaceholder: "شاركنا أفكارك وأسئلتك وملاحظاتك..."
    }
  };

  const c = content[language];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Button asChild variant="ghost" className="mb-6 group">
            <Link to="/" className="flex items-center gap-2">
              <ArrowIcon className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              {t("sources.back")}
            </Link>
          </Button>

          {/* Header */}
          <div className="text-center mb-12">
            <div className="crescent-star mx-auto mb-6 animate-pulse-glow">
              <Moon className="h-8 w-8 text-background" />
              <Star className="h-4 w-4 text-background absolute -top-1 -right-1" />
            </div>
            <h1 className="text-4xl font-bold gradient-text-gold mb-4">
              {t("about.title")}
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed">
              {c.description}
            </p>
          </div>

          {/* Main Content */}
          <div className="space-y-8 mb-12">
            {/* Methodology */}
            <Card className="card-gradient border-border/50 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <div className="p-3 bg-primary/10 rounded-xl">
                    <BookOpen className="h-6 w-6 text-primary" />
                  </div>
                  {c.methodology}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed text-lg">{c.methodologyText}</p>
              </CardContent>
            </Card>

            {/* Feature Cards Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="card-gradient border-border/50 shadow-lg hover:shadow-xl hover:glow-purple transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-accent" />
                    {c.sourceTypes}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">{c.sourceTypesText}</p>
                </CardContent>
              </Card>

              <Card className="card-gradient border-border/50 shadow-lg hover:shadow-xl hover:glow-purple transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <MessageSquare className="h-5 w-5 text-primary" />
                    {c.accuracy}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">{c.accuracyText}</p>
                </CardContent>
              </Card>
            </div>

            {/* Disclaimer */}
            <Alert className="border-accent/20 bg-accent/5">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="text-sm leading-relaxed">
                {c.disclaimer}
              </AlertDescription>
            </Alert>
          </div>

          {/* Contact Section */}
          <Card className="card-gradient border-border/50 shadow-2xl glow-gold">
            <CardHeader className="text-center">
              <div className="crescent-star mx-auto mb-4">
                <Mail className="h-6 w-6 text-background" />
              </div>
              <CardTitle className="text-2xl gradient-text-gold">{c.contactTitle}</CardTitle>
              <p className="text-muted-foreground">{c.contactDesc}</p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleContactSubmit} className="space-y-6">
                <div>
                  <label className="text-sm font-medium mb-2 block">{c.nameLabel}</label>
                  <Input 
                    placeholder={c.namePlaceholder}
                    value={formData.name}
                    onChange={handleInputChange("name")}
                    required
                    className="bg-background/50"
                    dir={isRTL ? "rtl" : "ltr"} 
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">{c.emailLabel}</label>
                  <Input 
                    type="email" 
                    placeholder={c.emailPlaceholder}
                    value={formData.email}
                    onChange={handleInputChange("email")}
                    required
                    className="bg-background/50"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">{c.messageLabel}</label>
                  <Textarea 
                    placeholder={c.messagePlaceholder}
                    value={formData.message}
                    onChange={handleInputChange("message")}
                    required
                    rows={5}
                    className="bg-background/50 resize-none"
                    dir={isRTL ? "rtl" : "ltr"}
                  />
                </div>
                
                <Button type="submit" className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 glow-purple text-lg py-6">
                  <Mail className="h-5 w-5 mr-2" />
                  {c.sendButton}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default About;