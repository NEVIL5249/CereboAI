// aiService.ts - FREE MODELS ONLY

interface AIModelConfig {
    apiKey: string;
    baseUrl?: string;
  }
  
  interface ChatMessage {
    role: 'user' | 'assistant' | 'system';
    content: string;
  }
  
  interface AIResponse {
    content: string;
    model: string;
    usage?: {
      promptTokens: number;
      completionTokens: number;
      totalTokens: number;
    };
  }
  
  /* ------------------ Gemini Service (FREE) ------------------ */
  class GeminiService {
    private apiKey: string;
    private baseUrl: string;
  
    constructor(config: AIModelConfig) {
      this.apiKey = config.apiKey;
      this.baseUrl = config.baseUrl || 'https://generativelanguage.googleapis.com/v1beta';
    }
  
    async chat(messages: ChatMessage[], model: string = 'gemini-1.5-flash'): Promise<AIResponse> {
      // Convert chat messages to Gemini format
      const contents = messages
        .filter(m => m.role !== 'system')
        .map(m => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content }]
        }));
  
      // Handle system messages by prepending to first user message
      const systemMessage = messages.find(m => m.role === 'system');
      if (systemMessage && contents.length > 0) {
        contents[0].parts[0].text = `${systemMessage.content}\n\n${contents[0].parts[0].text}`;
      }
  
      const res = await fetch(
        `${this.baseUrl}/models/${model}:generateContent?key=${this.apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: contents,
            generationConfig: {
              maxOutputTokens: 1000,
              temperature: 0.7,
            }
          }),
        }
      );
  
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Gemini API error: ${res.status} ${res.statusText} - ${errorText}`);
      }
  
      const data = await res.json();
  
      return {
        content: data.candidates?.[0]?.content?.parts?.[0]?.text || "No response",
        model,
      };
    }
  }
  
  /* ------------------ OpenRouter Service (FREE MODELS) ------------------ */
  class OpenRouterService {
    private apiKey: string;
    private baseUrl: string;
  
    constructor(config: AIModelConfig) {
      this.apiKey = config.apiKey;
      this.baseUrl = config.baseUrl || 'https://openrouter.ai/api/v1';
    }
  
    async chat(messages: ChatMessage[], model: string): Promise<AIResponse> {
      const res = await fetch(`${this.baseUrl}/chat/completions`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": window.location.origin,
          "X-Title": "AI Learning Tool",
        },
        body: JSON.stringify({ 
          model, 
          messages,
          max_tokens: 1000,
          temperature: 0.7
        }),
      });
  
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`OpenRouter API error: ${res.status} ${res.statusText} - ${errorText}`);
      }
  
      const data = await res.json();
  
      return {
        content: data.choices?.[0]?.message?.content || 'No response',
        model,
        usage: data.usage,
      };
    }
  }
  
  /* ------------------ FREE MODEL PROVIDERS ------------------ */
  export interface ModelProvider {
    id: string;
    name: string;
    provider: string;
    requiresApiKey: boolean;
    freeLimit?: string;
    description: string;
  }
  
  export const availableModels: ModelProvider[] = [
    // 🟢 Google Gemini - Best free option
    { 
      id: 'gemini-1.5-flash', 
      name: 'Gemini 1.5 Flash', 
      provider: 'Google', 
      requiresApiKey: true, 
      freeLimit: '15 req/min, 1500/day',
      description: 'Fast, excellent for most tasks'
    },
    // 🟢 OpenRouter free models
    { 
      id: 'deepseek/deepseek-chat', 
      name: 'DeepSeek Chat', 
      provider: 'OpenRouter', 
      requiresApiKey: true,
      freeLimit: '$1 credit',
      description: 'Great coding assistant'
    },
  ];
  
  /* ------------------ FREE AI SERVICE ------------------ */
  export class AIService {
    private services: Map<string, GeminiService | OpenRouterService> = new Map();
  
    constructor() {
      this.initializeServices();
    }
  
    private initializeServices() {
      // 🆓 Google Gemini (FREE - Best option)
      const googleKey = import.meta.env.VITE_GOOGLE_API_KEY;
      if (googleKey && googleKey !== 'your_google_gemini_api_key_here') {
        const geminiService = new GeminiService({ apiKey: googleKey });
        this.services.set('gemini-1.5-flash', geminiService);
      }
  
      // 🆓 OpenRouter (FREE models + DeepSeek)
      const openrouterKey = import.meta.env.VITE_OPENROUTER_API_KEY;
      if (openrouterKey && openrouterKey !== 'your_openrouter_api_key_here') {
        const openrouterService = new OpenRouterService({ apiKey: openrouterKey });
        this.services.set('deepseek/deepseek-chat', openrouterService);
      }
    }
  
    setApiKey(provider: string, apiKey: string) {
      switch (provider) {
        case 'Google':
          const geminiService = new GeminiService({ apiKey });
          this.services.set('gemini-1.5-flash', geminiService);
          break;
        case 'OpenRouter':
          const openrouterService = new OpenRouterService({ apiKey });
          this.services.set('deepseek/deepseek-chat', openrouterService);
          break;
      }
    }
  
    async chat(modelId: string, messages: ChatMessage[]): Promise<AIResponse> {
      const service = this.services.get(modelId);
      if (!service) {
        throw new Error(`No API key configured for model: ${modelId}`);
      }
      return await service.chat(messages, modelId);
    }
  
    async compareModels(modelIds: string[], prompt: string): Promise<Record<string, AIResponse | Error>> {
      const messages: ChatMessage[] = [{ role: 'user', content: prompt }];
      const results: Record<string, AIResponse | Error> = {};
  
      // Process with small delays to avoid rate limits
      for (const modelId of modelIds) {
        try {
          const response = await this.chat(modelId, messages);
          results[modelId] = response;
          // Small delay between requests
          await new Promise(resolve => setTimeout(resolve, 500));
        } catch (error) {
          results[modelId] = error as Error;
        }
      }
  
      return results;
    }
  
    hasApiKey(modelId: string): boolean {
      return this.services.has(modelId);
    }
  
    // 🎯 Get the best free model available
    getBestFreeModel(): string | null {
      if (this.hasApiKey('gemini-1.5-flash')) return 'gemini-1.5-flash';
      if (this.hasApiKey('deepseek/deepseek-chat')) return 'deepseek/deepseek-chat';
      return null;
    }
  
    // 🎯 Get all available free models
    getAvailableFreeModels(): ModelProvider[] {
      return availableModels.filter(model => this.hasApiKey(model.id));
    }
  }
  
  export const aiService = new AIService();