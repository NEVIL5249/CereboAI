import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, CheckCircle, XCircle, Gift } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Navigation from "@/components/Navigation";
import { aiService } from "@/services/aiService";

const Settings = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [freeModelsStatus, setFreeModelsStatus] = useState({
    gemini: false,
    openrouter: false,
  });

  useEffect(() => {
    // Check which free API keys are configured
    const googleKey = import.meta.env.VITE_GOOGLE_API_KEY;
    const openrouterKey = import.meta.env.VITE_OPENROUTER_API_KEY;

    setFreeModelsStatus({
      gemini: !!(googleKey && googleKey !== 'your_google_gemini_api_key_here'),
      openrouter: !!(openrouterKey && openrouterKey !== 'your_openrouter_api_key_here'),
    });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navigation title="Settings" showBackButton backTo="/" />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Tabs defaultValue="free-models" className="space-y-6">
          <TabsList>
            <TabsTrigger value="free-models">🆓 Free AI Models</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
          </TabsList>

          <TabsContent value="free-models" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gift className="w-5 h-5" />
                  Free AI Models Status
                </CardTitle>
                <CardDescription>
                  AIfiesta uses only free AI models - no paid subscriptions required!
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Google Gemini Status */}
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">Google Gemini 1.5 Flash</h3>
                      <p className="text-sm text-muted-foreground">15 req/min, 1500/day - FREE</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {freeModelsStatus.gemini ? (
                      <>
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          ✅ Ready
                        </Badge>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-5 h-5 text-red-600" />
                        <Badge variant="destructive">
                          ❌ Not Setup
                        </Badge>
                      </>
                    )}
                  </div>
                </div>

                {/* OpenRouter DeepSeek Status */}
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">DeepSeek Chat (via OpenRouter)</h3>
                      <p className="text-sm text-muted-foreground">$1 free credit - Great for coding</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {freeModelsStatus.openrouter ? (
                      <>
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          ✅ Ready
                        </Badge>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-5 h-5 text-red-600" />
                        <Badge variant="destructive">
                          ❌ Not Setup
                        </Badge>
                      </>
                    )}
                  </div>
                </div>

                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-medium mb-2 text-green-800">🎉 Why Free Models?</h4>
                  <ul className="text-sm text-green-700 space-y-1 list-disc list-inside">
                    <li><strong>No cost:</strong> Use powerful AI without paying</li>
                    <li><strong>No limits:</strong> Perfect for learning and experimenting</li>
                    <li><strong>High quality:</strong> Gemini 1.5 Flash rivals paid models</li>
                    <li><strong>Easy setup:</strong> Just get free API keys</li>
                  </ul>
                </div>

                <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-medium mb-2">🔧 Setup Instructions:</h4>
                  <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                    <li><strong>Google Gemini:</strong> Get free API key from <code>ai.google.dev</code></li>
                    <li><strong>OpenRouter:</strong> Sign up at <code>openrouter.ai</code> for $1 free credit</li>
                    <li>Add keys to <code>.env</code> file and restart the app</li>
                  </ol>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preferences" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>User Preferences</CardTitle>
                <CardDescription>
                  Customize your AIfiesta experience
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Account Email</h4>
                      <p className="text-sm text-muted-foreground">{user?.email}</p>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <h4 className="font-medium mb-2">Available Models</h4>
                    <div className="space-y-2">
                      {aiService.getAvailableFreeModels().map((model) => (
                        <div key={model.id} className="flex items-center justify-between p-2 bg-muted/30 rounded">
                          <div>
                            <span className="text-sm font-medium">{model.name}</span>
                            <p className="text-xs text-muted-foreground">{model.description}</p>
                          </div>
                          <Badge variant="outline" className="text-xs">{model.freeLimit}</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <p className="text-sm text-muted-foreground">
                      More preference options coming soon...
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Settings;
