import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Send, Bot, User, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { aiService, availableModels } from "@/services/aiService";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant' | 'system';
  timestamp: Date;
  tokens?: number;
  error?: string;
}

const Chat = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const availableModelsList = availableModels.filter(model => aiService.hasApiKey(model.id));
  
  // Remove auto-selection to allow manual model choice
  
  if (availableModelsList.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation title="Single Model Chat" showBackButton backTo="/" />
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <Card>
            <CardContent className="pt-6 text-center">
              <AlertCircle className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No API Keys Configured</h3>
              <p className="text-muted-foreground mb-4">
                You need to configure at least one API key to use the chat feature.
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !selectedModel) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput("");
    setLoading(true);

    try {
      // Prepare conversation history
      const conversationHistory = [...messages, userMessage].map(msg => ({
        role: msg.role as 'user' | 'assistant' | 'system',
        content: msg.content
      }));

      const response = await aiService.chat(selectedModel, conversationHistory);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.content,
        role: 'assistant',
        timestamp: new Date(),
        tokens: response.usage?.totalTokens
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Sorry, I encountered an error processing your request. Please check your API key configuration and try again.",
        role: 'assistant',
        timestamp: new Date(),
        error: error instanceof Error ? error.message : 'Unknown error'
      };
      
      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        title: "Chat error",
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const selectedModelInfo = availableModelsList.find(m => m.id === selectedModel);

  return (
    <div className="min-h-screen bg-background">
      <Navigation title="Single Model Chat" showBackButton backTo="/" />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Model Selection */}
        {!selectedModel && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Choose an AI Model</CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={selectedModel} onValueChange={setSelectedModel}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select an AI model to start chatting" />
                </SelectTrigger>
                <SelectContent>
                  {availableModelsList.map((model) => (
                    <SelectItem key={model.id} value={model.id}>
                      <div className="flex items-center justify-between w-full">
                        <span>{model.name}</span>
                        <span className="text-sm text-muted-foreground ml-4">{model.provider}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        )}

        {/* Chat Interface */}
        {selectedModel && (
          <div className="space-y-4">
            {/* Model Info */}
            <Card>
              <CardContent className="py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{selectedModelInfo?.name}</p>
                    <p className="text-sm text-muted-foreground">{selectedModelInfo?.provider}</p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setSelectedModel("");
                      setMessages([]);
                    }}
                  >
                    Change Model
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Messages */}
            <div className="space-y-4 min-h-[400px] max-h-[600px] overflow-y-auto">
              {messages.length === 0 && (
                <div className="text-center py-16">
                  <Bot className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    Start a conversation with {selectedModelInfo?.name}
                  </p>
                </div>
              )}

              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start space-x-3 ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {message.role === 'assistant' && (
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      message.error ? 'bg-destructive/10' : 'bg-primary/10'
                    }`}>
                      <Bot className={`w-4 h-4 ${
                        message.error ? 'text-destructive' : 'text-primary'
                      }`} />
                    </div>
                  )}
                  <div className="max-w-[70%] space-y-2">
                    <div
                      className={`p-4 rounded-lg ${
                        message.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : message.error
                          ? 'bg-destructive/10 border border-destructive/20'
                          : 'bg-muted'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                    </div>
                    {message.tokens && (
                      <Badge variant="secondary" className="text-xs w-fit">
                        {message.tokens} tokens
                      </Badge>
                    )}
                  </div>
                  {message.role === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-secondary/50 flex items-center justify-center">
                      <User className="w-4 h-4 text-secondary-foreground" />
                    </div>
                  )}
                </div>
              ))}

              {loading && (
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-primary" />
                  </div>
                  <div className="bg-muted p-4 rounded-lg">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="flex space-x-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={`Type your message to ${selectedModelInfo?.name}...`}
                className="flex-1"
                disabled={loading}
              />
              <Button type="submit" disabled={loading || !input.trim()}>
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;