# 🤖 Структура AI Агента

## 📍 Де знаходиться агент?

Ваш AI агент складається з **3 основних частин**:

```
📦 Проект
│
├── 🎨 FRONTEND (UI - те що бачить користувач)
│   └── frontend/src/
│       ├── components/
│       │   └── 💬 ChatAssistant.tsx          ← Головний UI компонент чату
│       │
│       └── services/
│           └── 🔌 aiService.ts               ← Сервіс для зв'язку з backend
│
├── ⚙️ BACKEND (Serverless Functions - логіка на сервері)
│   └── api/
│       ├── 🧠 chat.js                        ← Головний handler агента
│       ├── 🛠️ tools.js                       ← Інструменти (function calling)
│       └── 📊 valorant-stats.js              ← Додатковий API для статистики
│
└── 📚 ДОКУМЕНТАЦІЯ
    ├── README.md                             ← Головна документація
    ├── RATE_LIMITS.md                        ← Про ліміти
    └── GEMINI_ALTERNATIVES.md                ← Альтернативи Gemini
```

---

## 🎯 Детальна структура

### 1. **Frontend (Клієнтська частина)**

#### 📁 `frontend/src/components/ChatAssistant.tsx`
**Що робить:** Відображає UI чату
```typescript
- Кнопка "AI Assistant" в правому нижньому куті
- Вікно чату з повідомленнями
- Поле для введення тексту
- Таймер cooldown
- Обробка помилок
```

**Основні функції:**
- `handleSendMessage()` - відправляє повідомлення
- `scrollToBottom()` - прокручує до останнього повідомлення
- Cooldown таймер для rate limiting

**Розташування:** `frontend/src/components/ChatAssistant.tsx`

---

#### 📁 `frontend/src/services/aiService.ts`
**Що робить:** Комунікація з backend
```typescript
- Відправляє HTTP POST запити на /api/chat
- Обробляє відповіді від сервера
- Обробляє помилки
```

**Основні методи:**
- `sendMessage(messages)` - відправляє повідомлення на сервер
- `isConfigured()` - перевіряє чи налаштовано API
- `getModel()` - повертає назву моделі

**Розташування:** `frontend/src/services/aiService.ts`

---

### 2. **Backend (Серверна частина)**

#### 📁 `api/chat.js` - **ГОЛОВНИЙ ФАЙЛ АГЕНТА** 🧠
**Що робить:** Обробляє всі запити до AI
```javascript
1. Отримує повідомлення від клієнта
2. Перевіряє rate limiting
3. Відправляє до Gemini API
4. Обробляє function calling (виклики інструментів)
5. Повертає відповідь клієнту
```

**Основні компоненти:**
```javascript
// Rate Limiting
const requestCache = new Map();
const MAX_REQUESTS_PER_WINDOW = 3;
const RATE_LIMIT_WINDOW = 120000; // 2 хвилини

// Gemini AI
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ 
  model: 'gemini-2.0-flash-exp',
  systemInstruction: 'AI асистент VALORANT HUB',
  tools: [{ functionDeclarations: toolDefinitions }],
});

// Обробка запиту
module.exports = async (req, res) => {
  // 1. CORS headers
  // 2. Rate limiting
  // 3. Gemini API call
  // 4. Function calling
  // 5. Response
}
```

**Розташування:** `api/chat.js` ⭐ **ГОЛОВНИЙ ФАЙЛ**

---

#### 📁 `api/tools.js` - **ІНСТРУМЕНТИ АГЕНТА** 🛠️
**Що робить:** Надає агенту можливість викликати зовнішні функції
```javascript
// 3 інструменти:

1. getPlayerStats({ riotId, region })
   - Отримує статистику гравця з Valorant API
   - Приклад: "Яка статистика TenZ#NA1?"

2. searchAgents({ query })
   - Векторний пошук агентів
   - Приклад: "Знайди агресивного дуелянта"

3. hybridSearchPlayers({ query })
   - Пошук професійних гравців
   - Приклад: "Гравці з Fnatic на Viper"
```

**Структура:**
```javascript
// Словник функцій
const availableTools = {
  getPlayerStats,
  searchAgents,
  hybridSearchPlayers,
};

// Специфікація для Gemini
const toolDefinitions = [
  {
    name: 'getPlayerStats',
    description: 'Отримати статистику гравця',
    parameters: { ... }
  },
  // ...
];
```

**Розташування:** `api/tools.js`

---

### 3. **Як це працює разом?**

```
┌─────────────────────────────────────────────────────────────┐
│  1. Користувач пише "Яка статистика TenZ#NA1?"              │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│  2. ChatAssistant.tsx відправляє через aiService.ts         │
│     POST /api/chat                                           │
│     { messages: [...] }                                      │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│  3. api/chat.js отримує запит                                │
│     - Перевіряє rate limiting ✓                             │
│     - Відправляє до Gemini API                              │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│  4. Gemini розуміє що потрібно викликати інструмент         │
│     functionCall: {                                          │
│       name: "getPlayerStats",                                │
│       args: { riotId: "TenZ#NA1", region: "na" }            │
│     }                                                        │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│  5. api/chat.js викликає функцію з tools.js                 │
│     const result = await getPlayerStats({                    │
│       riotId: "TenZ#NA1",                                    │
│       region: "na"                                           │
│     });                                                      │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│  6. tools.js робить запит до Valorant API                   │
│     fetch('https://api.henrikdev.xyz/valorant/...')         │
│     Отримує: { rank: "Radiant", elo: 500 }                  │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│  7. Результат повертається до Gemini                         │
│     Gemini формує відповідь:                                 │
│     "TenZ має ранг Radiant з 500 ELO"                       │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│  8. api/chat.js повертає відповідь клієнту                  │
│     { message: "TenZ має ранг Radiant з 500 ELO" }          │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│  9. ChatAssistant.tsx відображає відповідь                  │
│     Користувач бачить повідомлення в чаті                   │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔑 Ключові файли

### ⭐ Найважливіші:

1. **`api/chat.js`** - Мозок агента (обробка запитів, Gemini API)
2. **`api/tools.js`** - Руки агента (інструменти для дій)
3. **`frontend/src/components/ChatAssistant.tsx`** - Обличчя агента (UI)
4. **`frontend/src/services/aiService.ts`** - Зв'язок між UI і backend

### 📝 Конфігурація:

- **`.env`** - API ключі (не в git!)
- **`vercel.json`** - Налаштування Vercel
- **`package.json`** - Залежності

---

## 🛠️ Як редагувати агента?

### Змінити поведінку агента:
📝 Редагуйте: `api/chat.js`
```javascript
const systemPrompt = 'Твій новий промпт тут';
```

### Додати новий інструмент:
📝 Редагуйте: `api/tools.js`
```javascript
const myNewTool = async ({ param }) => {
  // Твоя логіка
  return JSON.stringify(result);
};

// Додай в availableTools
const availableTools = {
  getPlayerStats,
  searchAgents,
  hybridSearchPlayers,
  myNewTool, // ← новий інструмент
};

// Додай в toolDefinitions
const toolDefinitions = [
  // ...існуючі
  {
    name: 'myNewTool',
    description: 'Опис що робить',
    parameters: { ... }
  }
];
```

### Змінити UI чату:
📝 Редагуйте: `frontend/src/components/ChatAssistant.tsx`

### Змінити модель AI:
📝 Редагуйте: `api/chat.js`
```javascript
const modelName = 'gemini-2.0-flash-exp'; // ← тут
```

---

## 📊 Статистика проекту

```
Frontend:
  - React компоненти: 5
  - Сервіси: 2
  - Сторінки: 5

Backend:
  - API endpoints: 1 (chat.js)
  - Інструменти: 3
  - Rate limiting: ✓

AI:
  - Модель: Gemini 2.0 Flash
  - Function calling: ✓
  - Streaming: ✗ (можна додати)
```

---

## 🎯 Швидкі посилання

- **Головний агент:** `api/chat.js`
- **Інструменти:** `api/tools.js`
- **UI чату:** `frontend/src/components/ChatAssistant.tsx`
- **API сервіс:** `frontend/src/services/aiService.ts`
- **Документація:** `README.md`

---

**Тепер ви знаєте де все знаходиться! 🎮**
