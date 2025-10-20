// AI Service для чат-асистента
// 🔒 БЕЗПЕЧНА версія - використовує Vercel Serverless Function
// API ключ зберігається на сервері і не доступний в браузері

export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface APIResponse {
  message: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

class AIService {
  private apiEndpoint: string;

  constructor() {
    // Використовуємо Vercel Serverless Function
    // В продакшені: /api/chat
    // Локально: http://localhost:5173/api/chat (через Vite proxy)
    this.apiEndpoint = '/api/chat';
  }

  async sendMessage(messages: Message[]): Promise<string> {
    try {
      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || 
          `API помилка: ${response.status} ${response.statusText}`
        );
      }

      const data: APIResponse = await response.json();
      
      if (!data.message) {
        throw new Error('Отримано пусту відповідь від AI');
      }

      return data.message;
    } catch (error) {
      if (error instanceof Error) {
        console.error('AI Service Error:', error);
        throw error;
      }
      throw new Error('Невідома помилка при зверненні до AI');
    }
  }

  isConfigured(): boolean {
    // Завжди true, оскільки конфігурація на сервері
    return true;
  }

  getModel(): string {
    return 'Serverless API';
  }
}

export const aiService = new AIService();
