# 🔄 Альтернативи Gemini API

## 🚨 Проблема з Gemini Free Tier

Gemini API має **дуже жорсткі обмеження** на безкоштовному tier:
- Часто блокує навіть перший запит
- Rate limit 429 помилки
- Непередбачувана поведінка квоти

## ✅ Рекомендовані альтернативи

### 1. **OpenRouter** (НАЙКРАЩЕ для безкоштовного використання)

```bash
npm install openrouter-sdk
```

**Переваги:**
- ✅ Llama 3.2 3B безкоштовно
- ✅ 200 запитів на день
- ✅ Без жорстких RPM лімітів
- ✅ Багато моделей на вибір
- ✅ Стабільна робота

**Як підключити:**

1. Отримайте API ключ на [openrouter.ai](https://openrouter.ai/keys)

2. Оновіть `api/chat.js`:
```javascript
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

const response = await fetch(OPENROUTER_API_URL, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
    'Content-Type': 'application/json',
    'HTTP-Referer': process.env.APP_URL,
  },
  body: JSON.stringify({
    model: 'meta-llama/llama-3.2-3b-instruct:free',
    messages: messages,
  }),
});
```

3. Додайте в `.env`:
```env
OPENROUTER_API_KEY=your_key_here
```

**Вартість:** Безкоштовно для Llama 3.2 3B

---

### 2. **Transformers.js** (Локально в браузері)

```bash
npm install @xenova/transformers
```

**Переваги:**
- ✅ Повністю безкоштовно
- ✅ Без API ключів
- ✅ Без лімітів
- ✅ Приватність (все локально)

**Недоліки:**
- ❌ Повільніше
- ❌ Менша якість відповідей
- ❌ Потребує більше RAM

**Як підключити:**

1. Створіть `frontend/src/services/localAI.ts`:
```typescript
import { pipeline } from '@xenova/transformers';

let generator: any = null;

export async function initLocalAI() {
  if (!generator) {
    generator = await pipeline(
      'text-generation',
      'Xenova/LaMini-Flan-T5-783M'
    );
  }
  return generator;
}

export async function generateResponse(prompt: string): Promise<string> {
  const gen = await initLocalAI();
  const result = await gen(prompt, {
    max_length: 200,
    temperature: 0.7,
  });
  return result[0].generated_text;
}
```

2. Використовуйте як fallback:
```typescript
try {
  // Спробувати Gemini
  const response = await aiService.sendMessage(messages);
} catch (error) {
  // Fallback на локальну модель
  const response = await generateResponse(lastMessage);
}
```

---

### 3. **Groq** (Швидкий і безкоштовний)

**Переваги:**
- ✅ Дуже швидкий (найшвидший inference)
- ✅ Generous free tier
- ✅ Llama 3.1 70B безкоштовно
- ✅ 30 запитів на хвилину

**Як підключити:**

1. Отримайте API ключ на [console.groq.com](https://console.groq.com)

2. Оновіть `api/chat.js`:
```javascript
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

const response = await fetch(GROQ_API_URL, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    model: 'llama-3.1-70b-versatile',
    messages: messages,
    temperature: 0.7,
    max_tokens: 500,
  }),
});
```

**Вартість:** Безкоштовно до 30 RPM

---

### 4. **Together AI** (Багато моделей)

**Переваги:**
- ✅ Багато open-source моделей
- ✅ $25 безкоштовних кредитів
- ✅ Llama 3.1 405B доступна
- ✅ Стабільна робота

**Вартість:** $0.20 / 1M tokens (після безкоштовних кредитів)

---

### 5. **Hugging Face Inference API**

**Переваги:**
- ✅ Безкоштовний tier
- ✅ Тисячі моделей
- ✅ Легко переключатися між моделями

**Недоліки:**
- ❌ Повільніше (cold start)
- ❌ Обмежена квота

---

## 🎯 Рекомендація для вашого проекту

### Для демо/навчання:
**OpenRouter** - найкращий вибір
- Стабільно працює
- Generous free tier
- Легко налаштувати

### Для продакшну:
**Groq** - найшвидший
- Відмінна швидкість
- Хороші ліміти
- Професійна підтримка

### Для приватності:
**Transformers.js** - локально
- Без API ключів
- Повна приватність
- Без лімітів

---

## 🔧 Швидке переключення на OpenRouter

1. **Встановіть залежності:**
```bash
# Не потрібно, використовуємо fetch
```

2. **Оновіть `.env`:**
```env
OPENROUTER_API_KEY=sk-or-v1-your-key-here
AI_MODEL=meta-llama/llama-3.2-3b-instruct:free
```

3. **Замініть в `api/chat.js`:**
```javascript
// Замість GoogleGenerativeAI
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

const response = await fetch(OPENROUTER_API_URL, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
    'HTTP-Referer': process.env.APP_URL || 'http://localhost:3000',
    'X-Title': 'VALORANT HUB',
  },
  body: JSON.stringify({
    model: modelName,
    messages: messages.map(msg => ({
      role: msg.role === 'model' ? 'assistant' : msg.role,
      content: msg.parts ? msg.parts[0].text : msg.content,
    })),
    temperature: 0.7,
    max_tokens: 500,
  }),
});

const data = await response.json();
return data.choices[0].message.content;
```

4. **Готово!** Тепер використовується OpenRouter замість Gemini

---

## 📊 Порівняння

| Провайдер | Безкоштовно | RPM | Якість | Швидкість |
|-----------|-------------|-----|--------|-----------|
| **OpenRouter** | ✅ Llama 3.2 | ~30 | ⭐⭐⭐⭐ | ⚡⚡⚡ |
| **Groq** | ✅ Llama 3.1 70B | 30 | ⭐⭐⭐⭐⭐ | ⚡⚡⚡⚡⚡ |
| **Gemini** | ✅ Flash | ~2-5 | ⭐⭐⭐⭐ | ⚡⚡⚡⚡ |
| **Transformers.js** | ✅ Локально | ∞ | ⭐⭐⭐ | ⚡⚡ |
| **Together AI** | 💰 $25 кредит | 60 | ⭐⭐⭐⭐⭐ | ⚡⚡⚡⚡ |

---

## 💡 Висновок

Для вашого проекту **рекомендую OpenRouter**:
1. Стабільніше за Gemini
2. Більше безкоштовних запитів
3. Легко налаштувати
4. Хороша якість відповідей

Gemini залишіть як альтернативу або для платного tier.
