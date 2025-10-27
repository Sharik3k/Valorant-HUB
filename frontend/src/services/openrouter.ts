// OpenRouter API Service - DISABLED FOR SECURITY
// API ключі не повинні бути в клієнтському коді!

const DEFAULT_MODEL = 'meta-llama/llama-3.2-3b-instruct:free'; 

export class OpenRouterService {
  constructor() {
    console.warn('🚫 AI Chat функціонал відключений для безпеки. API ключі не повинні бути в клієнтському коді!');
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
    throw new Error('🚫 AI Chat функціонал відключений. Для безпеки API ключі не зберігаються в клієнтському коді.');
  }

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
    throw new Error('🚫 AI Chat функціонал відключений. Для безпеки API ключі не зберігаються в клієнтському коді.');
  }

  async getModels(): Promise<any[]> {
    console.warn('🚫 AI Chat функціонал відключений');
    return [];
  }
}

// Helper function to create service instance
export const createOpenRouterService = (): OpenRouterService => {
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
