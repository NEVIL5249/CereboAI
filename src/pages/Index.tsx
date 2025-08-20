import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, GitCompare, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            CereboAI
          </h1>
          <h2 className="text-3xl font-bold mb-6 text-foreground/90">One Brain, Many Minds</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Harness the power of every model, side by side. Test your prompts across multiple AI models or dive deep with focused conversations using only free APIs.
          </p>
        </div>

        {/* Mode Selection Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Comparison Mode */}
          <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 group">
            <CardHeader className="text-center">
              <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <GitCompare className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">Comparison Mode</CardTitle>
              <CardDescription className="text-base">
                Send one prompt to multiple AI models and compare responses side by side
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <ul className="text-sm text-muted-foreground mb-6 space-y-2">
                <li>• Test prompt effectiveness across models</li>
                <li>• Side-by-side response comparison</li>
                <li>• Parallel processing for speed</li>
                <li>• Perfect for research and testing</li>
              </ul>
              <Button 
                className="w-full group" 
                onClick={() => navigate('/compare')}
              >
                Start Comparing
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </CardContent>
          </Card>

          {/* Single Model Mode */}
          <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 group">
            <CardHeader className="text-center">
              <div className="w-16 h-16 mx-auto bg-secondary/50 rounded-full flex items-center justify-center mb-4 group-hover:bg-secondary/70 transition-colors">
                <MessageSquare className="w-8 h-8 text-secondary-foreground" />
              </div>
              <CardTitle className="text-2xl">Single Model Mode</CardTitle>
              <CardDescription className="text-base">
                Choose one AI model and have focused conversations to save tokens
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <ul className="text-sm text-muted-foreground mb-6 space-y-2">
                <li>• Deep conversations with one model</li>
                <li>• Token-efficient interactions</li>
                <li>• Persistent chat history</li>
                <li>• Perfect for development work</li>
              </ul>
              <Button 
                variant="secondary" 
                className="w-full group"
                onClick={() => navigate('/chat')}
              >
                Start Chatting
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Features Section */}
        <div className="mt-24 text-center">
          <h3 className="text-3xl font-bold mb-8">Supported AI Models</h3>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Compare responses from multiple AI models using only free APIs. No subscriptions required.
          </p>
          <div className="flex justify-center items-center space-x-8 max-w-md mx-auto">
            <div className="text-center">
              <p className="font-medium">Google Gemini</p>
              <p className="text-sm text-muted-foreground">Free tier</p>
            </div>
            <div className="text-center">
              <p className="font-medium">DeepSeek Chat</p>
              <p className="text-sm text-muted-foreground">Free credit</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
