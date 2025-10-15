// OpenRouter API Service
import { OpenRouterRequest, OpenRouterResponse } from '../types/chat';

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';


const API_KEY = '';

const DEFAULT_MODEL = 'meta-llama/llama-3.2-3b-instruct:free'; 

export class OpenRouterService {
  private apiKey: string;
  private appName: string;
  private appUrl: string;

  constructor() {
    this.apiKey = API_KEY;
    this.appName = 'Valorant-HUB';
    this.appUrl = 'https://sharik3k.github.io/Valorant-HUB';
  }

  async sendMessage(
    messages: { role: string; content: string }[],
    model: string = DEFAULT_MODEL,
    options?: {
      temperature?: number;
      max_tokens?: number;
      top_p?: number;
    }
  ): Promise<string> {
    try {
      const requestBody: OpenRouterRequest = {
        model,
        messages,
        temperature: options?.temperature ?? 0.1,
        max_tokens: options?.max_tokens ?? 4000,
        top_p: options?.top_p ?? 1,
      };

      const response = await fetch(OPENROUTER_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': this.appUrl,
          'X-Title': this.appName,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error?.message || 
          `OpenRouter API Error: ${response.status} ${response.statusText}`
        );
      }

      const data: OpenRouterResponse = await response.json();

      if (!data.choices || data.choices.length === 0) {
        throw new Error('No response from AI model');
      }

      return data.choices[0].message.content;
    } catch (error) {
      console.error('OpenRouter API Error:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to communicate with OpenRouter API');
    }
  }

  // Stream response support
  async sendMessageStream(
    messages: { role: string; content: string }[],
    model: string = DEFAULT_MODEL,
    onChunk: (chunk: string) => void,
    options?: {
      temperature?: number;
      max_tokens?: number;
      top_p?: number;
    }
  ): Promise<void> {
    try {
      const requestBody: OpenRouterRequest = {
        model,
        messages,
        temperature: options?.temperature ?? 0.7,
        max_tokens: options?.max_tokens ?? 2000,
        top_p: options?.top_p ?? 1,
        stream: true,
      };

      const response = await fetch(OPENROUTER_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': this.appUrl,
          'X-Title': this.appName,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error?.message || 
          `OpenRouter API Error: ${response.status} ${response.statusText}`
        );
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('Response body is not readable');
      }

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') continue;

            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices?.[0]?.delta?.content;
              if (content) {
                onChunk(content);
              }
            } catch (e) {
              // Skip invalid JSON
            }
          }
        }
      }
    } catch (error) {
      console.error('OpenRouter Stream Error:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to stream response from OpenRouter API');
    }
  }

  // Get available models
  async getModels(): Promise<any[]> {
    try {
      const response = await fetch('https://openrouter.ai/api/v1/models', {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch models: ${response.statusText}`);
      }

      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Error fetching models:', error);
      return [];
    }
  }
}

// Helper function to create service instance
export const createOpenRouterService = (): OpenRouterService => {
  if (!API_KEY || API_KEY === 'YOUR_API_KEY_HERE') {
    throw new Error('⚠️ Будь ласка, вставте ваш API ключ в src/services/openrouter.ts');
  }
  return new OpenRouterService();
};

// Export default model
export const getDefaultModel = () => DEFAULT_MODEL;

// Popular model presets
export const POPULAR_MODELS = [
  {
    id: 'meta-llama/llama-3.2-3b-instruct:free',
    name: 'Llama 3.2 3B (Free)',
    description: 'Fast and efficient, great for general conversation',
  },
  {
    id: 'google/gemini-flash-1.5',
    name: 'Gemini Flash 1.5',
    description: 'Fast and intelligent from Google',
  },
  {
    id: 'openai/gpt-3.5-turbo',
    name: 'GPT-3.5 Turbo',
    description: 'OpenAI\'s efficient model',
  },
  {
    id: 'anthropic/claude-3-haiku',
    name: 'Claude 3 Haiku',
    description: 'Fast and accurate from Anthropic',
  },
  {
    id: 'openai/gpt-4',
    name: 'GPT-4',
    description: 'Most capable OpenAI model (requires credits)',
  },
];
