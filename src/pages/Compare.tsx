import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Send, AlertCircle, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { aiService, availableModels } from "@/services/aiService";
import { useToast } from "@/hooks/use-toast";

interface ComparisonResult {
  content?: string;
  error?: string;
  loading?: boolean;
  tokens?: number;
}

const Compare = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [prompt, setPrompt] = useState("");
  const [responses, setResponses] = useState<Record<string, ComparisonResult>>({});
  const [loading, setLoading] = useState(false);

  const availableModelIds = availableModels.filter(model => aiService.hasApiKey(model.id));
  
  if (availableModelIds.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation title="Comparison Mode" showBackButton backTo="/" />
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="pt-6 text-center">
              <AlertCircle className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No API Keys Configured</h3>
              <p className="text-muted-foreground mb-4">
                You need to configure at least one API key to use the comparison feature.
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Check your .env file to configure API keys.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const handleSubmit = async () => {
    if (!prompt.trim()) return;
    
    setLoading(true);
    const modelIds = availableModelIds.map(m => m.id);
    
    // Initialize loading states
    const initialResponses: Record<string, ComparisonResult> = {};
    modelIds.forEach(id => {
      initialResponses[id] = { loading: true };
    });
    setResponses(initialResponses);
    
    try {
      const results = await aiService.compareModels(modelIds, prompt);
      
      const finalResponses: Record<string, ComparisonResult> = {};
      Object.entries(results).forEach(([modelId, result]) => {
        if (result instanceof Error) {
          finalResponses[modelId] = { error: result.message };
        } else {
          finalResponses[modelId] = { 
            content: result.content,
            tokens: result.usage?.totalTokens
          };
        }
      });
      
      setResponses(finalResponses);
    } catch (error) {
      toast({
        title: "Comparison failed",
        description: "An error occurred while comparing models.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation title="Comparison Mode" showBackButton backTo="/" />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Input Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Enter your prompt</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Enter your prompt here to compare responses across different AI models..."
                className="min-h-[120px]"
              />
              <Button 
                onClick={handleSubmit} 
                disabled={loading || !prompt.trim()}
                className="w-full md:w-auto"
              >
                {loading ? "Processing..." : "Compare Models"}
                <Send className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Responses Grid */}
        {Object.keys(responses).length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableModelIds.map((model) => {
              const result = responses[model.id];
              return (
                <Card key={model.id} className="h-fit">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">{model.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{model.provider}</p>
                      </div>
                      {result?.tokens && (
                        <Badge variant="secondary" className="text-xs">
                          {result.tokens} tokens
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    {result?.loading ? (
                      <div className="space-y-3">
                        <div className="h-4 bg-muted rounded animate-pulse"></div>
                        <div className="h-4 bg-muted rounded animate-pulse w-4/5"></div>
                        <div className="h-4 bg-muted rounded animate-pulse w-3/5"></div>
                      </div>
                    ) : result?.error ? (
                      <div className="flex items-start space-x-2 text-destructive">
                        <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <p className="text-sm">{result.error}</p>
                      </div>
                    ) : result?.content ? (
                      <div className="space-y-2">
                        <div className="flex items-center space-x-1 text-green-600">
                          <CheckCircle className="w-3 h-3" />
                          <span className="text-xs">Success</span>
                        </div>
                        <p className="text-sm leading-relaxed">{result.content}</p>
                      </div>
                    ) : null}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {Object.keys(responses).length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground">
              Enter a prompt above to see responses from {availableModelIds.length} AI model{availableModelIds.length !== 1 ? 's' : ''} side by side.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Available models: {availableModelIds.map(m => m.name).join(', ')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Compare;