import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, BookOpen, Users, AlertTriangle } from "lucide-react";

const About = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">About Our Methodology</h1>
            <p className="text-xl text-muted-foreground">
              Learn how our Islamic Knowledge Assistant works and why source restriction is crucial
            </p>
          </div>

          {/* Overview */}
          <div className="mb-12">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-6 w-6 text-primary" />
                  Our Approach
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  The Islamic Knowledge Assistant is designed as a <strong>knowledge retrieval tool</strong>, not an AI that 
                  generates Islamic rulings from its general training. Instead, it searches through a carefully curated 
                  collection of authentic Islamic texts to find relevant information for your questions.
                </p>
                <p>
                  This approach ensures that all answers come from established Islamic scholarship rather than AI 
                  interpretations or general knowledge that might not be accurate for Islamic matters.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Key Principles */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-6 w-6 text-primary" />
                  Source Restriction
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• Only uses pre-approved Islamic texts</li>
                  <li>• Cannot generate answers from general AI knowledge</li>
                  <li>• All responses must be backed by authentic sources</li>
                  <li>• If no source exists, the assistant says so clearly</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-6 w-6 text-primary" />
                  Scholar Approval
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• All sources reviewed by qualified Islamic scholars</li>
                  <li>• Only mainstream, accepted texts included</li>
                  <li>• Regular updates and quality control</li>
                  <li>• Transparency in source selection process</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* How It Works */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-6 text-center">How It Works</h2>
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>1. Question Processing</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    When you ask a question, the system analyzes your query to understand what Islamic topics, 
                    concepts, or rulings you're asking about.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>2. Source Search</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    The assistant searches through our database of approved Islamic texts including Quranic verses, 
                    authentic Hadith, classical commentary (tafsir), and contemporary scholarly works.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>3. Answer Generation</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    If relevant information is found, the assistant provides a clear answer with citations. 
                    If no supporting source exists, it honestly states that the answer cannot be found in 
                    the approved materials.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* What We Include */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Source Categories</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Primary Sources</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1 text-sm">
                    <li>• Holy Quran (multiple translations)</li>
                    <li>• Sahih al-Bukhari</li>
                    <li>• Sahih Muslim</li>
                    <li>• Other authentic Hadith collections</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Secondary Sources</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1 text-sm">
                    <li>• Classical Tafsir (Quranic commentary)</li>
                    <li>• Fiqh (jurisprudence) texts</li>
                    <li>• Contemporary scholarly fatwas</li>
                    <li>• Approved Islamic encyclopedias</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Limitations */}
          <div className="mb-12">
            <Card className="border-destructive/20 bg-destructive/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-destructive">
                  <AlertTriangle className="h-6 w-6" />
                  Important Limitations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Not a Mufti</h4>
                  <p className="text-sm text-muted-foreground">
                    This assistant does not issue new Islamic rulings (fatwas). It only retrieves and 
                    summarizes information from existing sources.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Personal Matters</h4>
                  <p className="text-sm text-muted-foreground">
                    For personal religious guidance, family matters, or complex legal issues, 
                    please consult qualified Islamic scholars in person.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Scholarly Differences</h4>
                  <p className="text-sm text-muted-foreground">
                    Where Islamic scholars have different valid opinions, the assistant will mention 
                    this and may present multiple perspectives.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact */}
          <div className="text-center bg-muted/30 p-8 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Questions About Our Methodology?</h3>
            <p className="text-muted-foreground mb-4">
              If you have questions about how we select sources or our approach to Islamic knowledge, 
              we're happy to provide more details about our scholarly review process.
            </p>
            <p className="text-sm text-muted-foreground">
              This project is developed with guidance from qualified Islamic scholars to ensure 
              accuracy and authenticity in all materials used.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default About;