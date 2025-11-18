// AI Service для чат-асистента (v2 - Assistants API)

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export interface AIResponse {
  message: string;
  threadId: string;
}

class AIService {
  private apiEndpoint: string = '/api/chat';

  async sendMessage(message: string, threadId: string | null): Promise<AIResponse> {
    try {
      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message, threadId }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Не вдалося розпарсити помилку' }));
        throw new Error(errorData.error || `Помилка сервера: ${response.status}`);
      }

      const data: AIResponse = await response.json();
      if (!data.message || !data.threadId) {
        throw new Error('Неповна відповідь від сервера');
      }

      return data;
    } catch (error) {
      console.error('AI Service Error:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Невідома помилка при зверненні до AI');
    }
  }

  isConfigured(): boolean {
    // Конфігурація перевіряється на сервері
    return true;
  }

  getModel(): string {
    return 'OpenAI GPT-4o-mini';
  }
}

export const aiService = new AIService();
