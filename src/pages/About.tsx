import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";
import { Shield, BookOpen, Mail, MessageSquare, ArrowLeft, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const About = () => {
  const { language, t, isRTL } = useLanguage();
  const { toast } = useToast();
  const ArrowIcon = isRTL ? ArrowRight : ArrowLeft;

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: language === "en" ? "Message Sent" : "تم إرسال الرسالة",
      description: language === "en" 
        ? "We'll get back to you soon." 
        : "سنتواصل معك قريباً.",
    });
  };

  const content = {
    en: {
      methodology: "Our Approach",
      methodologyText: "The Islamic Knowledge Assistant retrieves information only from authenticated Islamic texts. It searches through Quran, Hadith, Tafsir, and scholarly works to find relevant answers. This ensures all responses come from established Islamic scholarship.",
      sourceRestriction: "Source Restriction",
      sourceRestrictionText: "Answers come only from pre-approved sources. The assistant cannot use general AI knowledge. If no source exists, it will clearly state that.",
      scholarApproval: "Scholar Reviewed",
      scholarApprovalText: "All sources are reviewed by qualified Islamic scholars. Only mainstream, accepted texts are included.",
      contactTitle: "Contact Us",
      contactDesc: "Have questions or feedback? We'd love to hear from you.",
      nameLabel: "Name",
      emailLabel: "Email",
      messageLabel: "Message",
      sendButton: "Send Message"
    },
    ar: {
      methodology: "منهجيتنا",
      methodologyText: "مساعد المعرفة الإسلامية يسترجع المعلومات فقط من النصوص الإسلامية الموثقة. يبحث في القرآن والحديث والتفسير والأعمال العلمية للعثور على الإجابات ذات الصلة. هذا يضمن أن جميع الردود تأتي من المنح الإسلامية الراسخة.",
      sourceRestriction: "تقييد المصادر",
      sourceRestrictionText: "الإجابات تأتي فقط من مصادر معتمدة مسبقاً. المساعد لا يستخدم المعرفة العامة للذكاء الاصطناعي. إذا لم يوجد مصدر، سيذكر ذلك بوضوح.",
      scholarApproval: "مراجعة العلماء",
      scholarApprovalText: "جميع المصادر مراجعة من قبل علماء إسلاميين مؤهلين. فقط النصوص المقبولة السائدة مضمنة.",
      contactTitle: "تواصل معنا",
      contactDesc: "هل لديك أسئلة أو ملاحظات؟ نود أن نسمع منك.",
      nameLabel: "الاسم",
      emailLabel: "البريد الإلكتروني",
      messageLabel: "الرسالة",
      sendButton: "إرسال الرسالة"
    }
  };

  const c = content[language];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Back Button */}
          <Button asChild variant="ghost" className="mb-6">
            <Link to="/" className="flex items-center gap-2">
              <ArrowIcon className="h-4 w-4" />
              {language === "en" ? "Back to Chat" : "العودة للمحادثة"}
            </Link>
          </Button>

          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {t("about.title")}
            </h1>
          </div>

          {/* Methodology Section */}
          <div className="space-y-4 mb-12">
            <Card className="border-0 shadow-lg bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg">
                    <BookOpen className="h-5 w-5 text-primary" />
                  </div>
                  {c.methodology}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{c.methodologyText}</p>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-4">
              <Card className="border-0 shadow-lg bg-card/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-lg">
                    <Shield className="h-5 w-5 text-primary" />
                    {c.sourceRestriction}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{c.sourceRestrictionText}</p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-card/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-lg">
                    <MessageSquare className="h-5 w-5 text-primary" />
                    {c.scholarApproval}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{c.scholarApprovalText}</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Contact Section */}
          <Card className="border-0 shadow-xl bg-gradient-to-br from-card to-accent/10">
            <CardHeader className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl shadow-lg mx-auto mb-2">
                <Mail className="w-6 h-6 text-primary-foreground" />
              </div>
              <CardTitle>{c.contactTitle}</CardTitle>
              <p className="text-sm text-muted-foreground">{c.contactDesc}</p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">{c.nameLabel}</label>
                  <Input placeholder={c.nameLabel} dir={isRTL ? "rtl" : "ltr"} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">{c.emailLabel}</label>
                  <Input type="email" placeholder="email@example.com" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">{c.messageLabel}</label>
                  <Textarea 
                    placeholder={language === "en" ? "Your message..." : "رسالتك..."} 
                    rows={4}
                    dir={isRTL ? "rtl" : "ltr"}
                  />
                </div>
                <Button type="submit" className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90">
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