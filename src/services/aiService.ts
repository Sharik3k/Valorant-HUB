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
  error?: string;
  retryAfter?: number;
}

class AIService {
  private apiEndpoint: string;
  private lastRequestTime: number = 0;
  private minRequestInterval: number = 2000; // Мінімум 2 секунди між запитами

  constructor() {
    // Використовуємо Vercel Serverless Function
    // В продакшені: /api/chat
    // Локально: http://localhost:5173/api/chat (через Vite proxy)
    this.apiEndpoint = '/api/chat';
  }

  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async sendMessage(messages: Message[], retryCount: number = 0): Promise<string> {
    // Обмеження частоти запитів
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    if (timeSinceLastRequest < this.minRequestInterval) {
      await this.delay(this.minRequestInterval - timeSinceLastRequest);
    }
    this.lastRequestTime = Date.now();

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
        
        // Обробка 429 (Rate Limit)
        if (response.status === 429) {
          const retryAfter = errorData.retryAfter || 60;
          
          if (retryCount < 2) {
            // Спробувати ще раз після затримки
            console.log(`Rate limit hit. Retrying after ${retryAfter} seconds...`);
            await this.delay(retryAfter * 1000);
            return this.sendMessage(messages, retryCount + 1);
          }
          
          throw new Error(
            errorData.error || 
            '⏱️ Перевищено ліміт запитів. Будь ласка, зачекайте 1-2 хвилини перед наступним запитом.'
          );
        }
        
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
    return 'Google Gemini 2.0 Flash';
  }
}

export const aiService = new AIService();
