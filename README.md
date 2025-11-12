# 🎮 VALORANT HUB - AI Assistant Demo

> Демонстраційний проект з використанням GenAI фреймворків для створення інтелектуального асистента

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/Valorant-HUB)

## 🚀 Особливості

- **🤖 AI Асистент** - Інтелектуальний чат-бот на базі Google Gemini 2.0 Flash
- **🛠️ Function Calling** - Агент може викликати зовнішні інструменти
- **🔒 Безпечна архітектура** - API ключі зберігаються на сервері
- **⚡ Serverless** - Використовує Vercel Serverless Functions
- **🎨 Сучасний UI** - React + TypeScript + Material-UI

## 📋 Вимоги завдання

✅ **1. Репозиторій на GitHub** - Проект розміщено на GitHub  
✅ **2. Підключення до AI API** - Використовується Google Gemini API  
✅ **3. Деплой на Vercel** - Проект задеплоєно на Vercel  

## 🏗️ Архітектура

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend (React)                      │
│  ┌──────────────────┐         ┌──────────────────┐         │
│  │  ChatAssistant   │────────▶│   aiService.ts   │         │
│  │   Component      │         │                  │         │
│  └──────────────────┘         └──────────────────┘         │
└────────────────────────────────────┬────────────────────────┘
                                     │ HTTP POST /api/chat
                                     ▼
┌─────────────────────────────────────────────────────────────┐
│              Vercel Serverless Functions                     │
│  ┌──────────────────┐         ┌──────────────────┐         │
│  │   api/chat.js    │────────▶│   api/tools.js   │         │
│  │  (Main Handler)  │         │   (Functions)    │         │
│  └──────────────────┘         └──────────────────┘         │
└────────────────────────────────────┬────────────────────────┘
                                     │ API Key (Server-side)
                                     ▼
                          ┌──────────────────────┐
                          │   Google Gemini API  │
                          │   (2.0 Flash Model)  │
                          └──────────────────────┘
```

## 🛠️ Інструменти агента

### 1. `getPlayerStats`
Отримує статистику гравця Valorant (ранг, ELO) через API henrikdev.xyz

**Приклад:**
```
Користувач: "Яка статистика гравця TenZ#NA1?"
Агент: Викликає getPlayerStats({ riotId: "TenZ#NA1", region: "na" })
```

### 2. `searchAgents`
Векторний пошук агентів Valorant за описом

**Приклад:**
```
Користувач: "Знайди агресивного дуелянта для входу на точку"
Агент: Викликає searchAgents({ query: "агресивний дуелянт" })
```

### 3. `hybridSearchPlayers`
Гібридний пошук професійних гравців

**Приклад:**
```
Користувач: "Знайди гравців з Fnatic, які грають на Viper"
Агент: Викликає hybridSearchPlayers({ query: "Fnatic Viper" })
```

## 🚀 Швидкий старт

### 1. Клонування репозиторію
```bash
git clone https://github.com/YOUR_USERNAME/Valorant-HUB.git
cd Valorant-HUB
```

### 2. Встановлення залежностей

**Frontend:**
```bash
cd frontend
npm install
```

**Backend (для локального тестування):**
```bash
cd ..
npm install
```

### 3. Налаштування Environment Variables

Створіть файл `.env` в корені проекту:
```env
GEMINI_API_KEY=your_gemini_api_key_here
AI_MODEL=gemini-2.0-flash-exp
```

**Як отримати Gemini API ключ:**
1. Перейдіть на [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Створіть новий API ключ
3. Скопіюйте його в `.env` файл

### 4. Запуск локально

**Frontend:**
```bash
cd frontend
npm run dev
```

**Backend (Vercel Dev):**
```bash
vercel dev
```

Відкрийте http://localhost:5173

## 📦 Деплой на Vercel

### Автоматичний деплой:
1. Натисніть кнопку "Deploy with Vercel" вгорі
2. Підключіть GitHub репозиторій
3. Додайте Environment Variables:
   - `GEMINI_API_KEY` - ваш Gemini API ключ
   - `AI_MODEL` - `gemini-2.0-flash-exp`
4. Натисніть "Deploy"

### Ручний деплой:
```bash
# Встановіть Vercel CLI
npm i -g vercel

# Деплой
vercel

# Додайте environment variables
vercel env add GEMINI_API_KEY
vercel env add AI_MODEL
```

## 🎯 Використання

1. Відкрийте сайт
2. Натисніть на кнопку "AI Assistant" в правому нижньому куті
3. Почніть спілкування з агентом

**Приклади запитів:**
- "Яка статистика гравця Sharik#3k?"
- "Знайди агресивного дуелянта"
- "Хто з професійних гравців грає на Jett?"
- "Розкажи про карту Ascent"

## 📁 Структура проекту

```
Valorant-HUB/
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/      # React компоненти
│   │   │   └── ChatAssistant.tsx
│   │   ├── services/        # API сервіси
│   │   │   └── aiService.ts
│   │   ├── pages/           # Сторінки
│   │   └── App.tsx
│   └── package.json
├── api/                     # Vercel Serverless Functions
│   ├── chat.js             # Головний handler
│   └── tools.js            # Інструменти агента
├── .env                    # Environment variables (не в git)
├── vercel.json             # Vercel конфігурація
└── README.md
```

## 🔧 Технології

### Frontend:
- **React 18** - UI бібліотека
- **TypeScript** - Типізація
- **Material-UI** - Компоненти
- **Vite** - Build tool
- **Lucide React** - Іконки

### Backend:
- **Vercel Serverless Functions** - Безсерверна архітектура
- **Google Gemini 2.0 Flash** - AI модель
- **@google/generative-ai** - SDK для Gemini

### APIs:
- **Google Gemini API** - Головна AI модель
- **henrikdev.xyz API** - Valorant статистика

## 🔒 Безпека

- ✅ API ключі зберігаються на сервері (Vercel Environment Variables)
- ✅ Клієнт не має доступу до ключів
- ✅ CORS налаштовано правильно
- ✅ Валідація вхідних даних
- ✅ Обробка помилок

## 📊 Оптимізація

- **Економія токенів**: Короткий системний промпт
- **Швидкість**: Gemini 2.0 Flash - одна з найшвидших моделей
- **Безкоштовно**: Використовується безкоштовний tier Gemini API
- **Паралельність**: Інструменти виконуються паралельно

## 🐛 Troubleshooting

### Помилка "API key не налаштовано"
- Перевірте, чи додали ви `GEMINI_API_KEY` в Vercel Environment Variables
- Перезапустіть деплой після додавання змінних

### Помилка "Rate limit exceeded"
- Gemini має ліміти на безкоштовному tier
- Зачекайте 1-2 хвилини і спробуйте знову

### Інструменти не працюють
- Перевірте, чи запущений локальний сервер пошуку (якщо тестуєте локально)
- В продакшені інструменти можуть бути недоступні без додаткового backend

## 📝 Ліцензія

MIT License - використовуйте вільно для навчання та комерційних проектів

## 👥 Автори

- **Sharik3k** - Розробка та імплементація

## 🙏 Подяки

- Google за Gemini API
- Riot Games за Valorant
- henrikdev.xyz за Valorant API
- Vercel за безкоштовний хостинг

---

**Made with ❤️ for VALORANT players**

*Dominate every round with AI-powered assistance!* 🎮
