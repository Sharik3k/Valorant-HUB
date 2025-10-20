// OpenRouter AI Service для чат-асистента
export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface OpenRouterResponse {
  id: string;
  choices: Array<{
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

class AIService {
  private apiKey: string;
  private model: string;
  private baseURL = 'https://openrouter.ai/api/v1';

  constructor() {
    this.apiKey = import.meta.env.VITE_OPENROUTER_API_KEY || '';
    this.model = import.meta.env.VITE_AI_MODEL || 'meta-llama/llama-3.2-3b-instruct:free';
  }

  async sendMessage(messages: Message[]): Promise<string> {
    if (!this.apiKey || this.apiKey === 'your_openrouter_api_key_here') {
      throw new Error('OpenRouter API ключ не налаштовано. Додайте VITE_OPENROUTER_API_KEY в .env файл.');
    }

    try {
      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'VALORANT HUB AI Assistant',
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            {
              role: 'system',
              content: 'Ти — AI асистент для VALORANT HUB. Допомагаєш гравцям з питаннями про гру VALORANT: агенти, мапи, зброя, стратегії, VCT змагання. Відповідай коротко та по суті українською мовою.'
            },
            ...messages
          ],
          temperature: 0.7,
          max_tokens: 500,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error?.message || 
          `OpenRouter API помилка: ${response.status} ${response.statusText}`
        );
      }

      const data: OpenRouterResponse = await response.json();
      
      if (!data.choices || data.choices.length === 0) {
        throw new Error('Отримано пусту відповідь від AI');
      }

      return data.choices[0].message.content;
    } catch (error) {
      if (error instanceof Error) {
        console.error('AI Service Error:', error);
        throw error;
      }
      throw new Error('Невідома помилка при зверненні до AI');
    }
  }

  isConfigured(): boolean {
    return !!(this.apiKey && this.apiKey !== 'your_openrouter_api_key_here');
  }

  getModel(): string {
    return this.model;
  }
}

export const aiService = new AIService();
