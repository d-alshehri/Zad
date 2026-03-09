import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Layout from "@/components/Layout";
import { Link } from "react-router-dom";
import { MessageCircle, BookOpen, Shield, Users } from "lucide-react";

const Home = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
            Islamic Knowledge Assistant
          </h1>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            Get answers to your Islamic questions based only on authentic sources: 
            the Qur'an, authenticated Hadith, and trusted scholarly works.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-lg px-8">
              <Link to="/chat">
                <MessageCircle className="mr-2 h-5 w-5" />
                Ask a Question
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8">
              <Link to="/sources">
                <BookOpen className="mr-2 h-5 w-5" />
                View Sources
              </Link>
            </Button>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card>
            <CardHeader className="text-center">
              <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle className="text-lg">Source-Restricted</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                Answers come only from pre-approved Islamic sources, not general AI knowledge.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <BookOpen className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle className="text-lg">With Citations</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                Every answer includes references to the specific source used.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <MessageCircle className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle className="text-lg">Easy to Use</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                Simple chat interface - just ask your question in plain language.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <Users className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle className="text-lg">Scholar Approved</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                All sources are curated and approved by qualified Islamic scholars.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* How It Works */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary text-primary-foreground rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Ask Your Question</h3>
              <p className="text-muted-foreground">
                Type your Islamic question in the chat interface using natural language.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary text-primary-foreground rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Source Search</h3>
              <p className="text-muted-foreground">
                The system searches only through approved Islamic sources for relevant information.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary text-primary-foreground rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Get Answer</h3>
              <p className="text-muted-foreground">
                Receive a clear answer with citations, or a notice if no source contains the answer.
              </p>
            </div>
          </div>
        </div>

        {/* Important Notice */}
        <div className="max-w-4xl mx-auto mt-16">
          <Card className="border-destructive/20 bg-destructive/5">
            <CardHeader>
              <CardTitle className="text-center text-destructive">Important Notice</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground">
                This assistant is a learning and research tool. It does not issue religious rulings (fatwas). 
                For personal religious guidance or complex matters, please consult qualified Islamic scholars 
                in your local community or recognized Islamic institutions.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Home;