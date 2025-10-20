# 🚀 Безпечний деплой на Vercel з Backend API

## 🎯 Що змінилося?

### ✅ РАНІШЕ (небезпечно):
- API ключ був у клієнтському коді
- Будь-хто міг подивитись ключ у DevTools браузера
- Ключ міг бути викрадений

### ✅ ЗАРАЗ (безпечно):
- API ключ ТІЛЬКИ на сервері Vercel
- Клієнт НЕ має доступу до ключа
- Використовуємо Vercel Serverless Functions як backend

---

## 📁 Структура проєкту

```
Valorant-HUB-Final/
├── api/                          # 🔒 Backend (Vercel Serverless Functions)
│   ├── chat.ts                   # Endpoint для чату з AI
│   └── models.ts                 # Endpoint для отримання моделей
│
├── src/
│   ├── services/
│   │   ├── openrouter.ts         # ❌ Старий (небезпечний)
│   │   └── openrouter-backend.ts # ✅ Новий (безпечний)
│   └── pages/
│       └── AIChatPage.tsx        # Використовує backend API
│
└── .env.example                  # Шаблон змінних оточення
```

---

## 🔐 Як це працює?

### Стара схема (небезпечна):
```
Браузер → OpenRouter API (з API ключем)
         ↑ API ключ видно в коді!
```

### Нова схема (безпечна):
```
Браузер → Vercel Backend → OpenRouter API
                ↑ API ключ захищений!
```

**Клієнт НЕ знає API ключ!** Він робить запити до `/api/chat`, а наш сервер Vercel вже використовує ключ.

---

## 📋 Крок 1: Встановіть залежності

```bash
npm install
```

Це встановить `@vercel/node` для TypeScript типів.

---

## 🔧 Крок 2: Локальна розробка

### 2.1 Встановіть Vercel CLI (для тестування API локально)

```bash
npm i -g vercel
```

### 2.2 Створіть `.env` файл

```bash
# PowerShell
Copy-Item .env.example .env
```

Відредагуйте `.env`:

```env
# 🔒 СЕРВЕРНІ ЗМІННІ (БЕЗ VITE_)
OPENROUTER_API_KEY=sk-or-v1-ваш_справжній_ключ
APP_NAME=Valorant-HUB
APP_URL=http://localhost:3000
DEFAULT_AI_MODEL=meta-llama/llama-3.2-3b-instruct:free

# 🌐 КЛІЄНТСЬКІ ЗМІННІ (з VITE_)
VITE_DEFAULT_AI_MODEL=meta-llama/llama-3.2-3b-instruct:free
```

⚠️ **Зверніть увагу:** Серверні змінні БЕЗ префіксу `VITE_`!

### 2.3 Запустіть проєкт локально

```bash
# Термінал 1: Frontend (Vite)
npm run dev

# Термінал 2: Backend (Vercel Dev)
vercel dev
```

Відкрийте http://localhost:3000 - backend API буде працювати!

---

## 🌐 Крок 3: Деплой на Vercel

### 3.1 Push код на GitHub

```bash
git add .
git commit -m "Add secure backend API for OpenRouter"
git push
```

### 3.2 Імпорт проєкту в Vercel

1. Зайдіть на [Vercel Dashboard](https://vercel.com/dashboard)
2. Натисніть **"Add New..." → "Project"**
3. Оберіть ваш GitHub репозиторій
4. Натисніть **"Import"**

### 3.3 Налаштування проєкту

```
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
Install Command: npm install
Root Directory: ./
```

### 3.4 ⚠️ ДОДАЙТЕ ЗМІННІ ОТОЧЕННЯ (КРИТИЧНО!)

**Settings → Environment Variables**

Додайте ці змінні для **всіх середовищ** (Production, Preview, Development):

| Змінна | Значення | Доступність |
|--------|----------|-------------|
| `OPENROUTER_API_KEY` | `sk-or-v1-ваш_ключ` | 🔒 Тільки сервер |
| `APP_NAME` | `Valorant-HUB` | 🔒 Тільки сервер |
| `APP_URL` | `https://ваш-домен.vercel.app` | 🔒 Тільки сервер |
| `DEFAULT_AI_MODEL` | `meta-llama/llama-3.2-3b-instruct:free` | 🔒 Тільки сервер |
| `VITE_DEFAULT_AI_MODEL` | `meta-llama/llama-3.2-3b-instruct:free` | 🌐 Клієнт + сервер |

⚠️ **ВАЖЛИВО:** 
- Змінні БЕЗ `VITE_` - тільки на сервері (безпечні)
- Змінні З `VITE_` - доступні в браузері (не для секретів!)

### 3.5 Деплой!

Натисніть **"Deploy"** → Почекайте 1-2 хв → Готово! 🎉

---

## ✅ Крок 4: Перевірка

### 4.1 Перевірте API endpoints

Відкрийте в браузері:
- `https://ваш-домен.vercel.app/api/chat` - повинно повернути 405 (Method Not Allowed) ✅
- Це нормально, бо endpoint приймає тільки POST

### 4.2 Перевірте AI чат

1. Відкрийте ваш сайт
2. Перейдіть на сторінку AI Chat
3. Напишіть повідомлення
4. AI повинен відповісти ✅

### 4.3 Перевірте безпеку

Відкрийте DevTools (F12) → Network:
- Запити йдуть до `/api/chat` (не до OpenRouter напряму) ✅
- API ключ НЕ видно в запитах ✅
- Перегляньте код у Sources - ключа немає ✅

---

## 🔒 Безпека - Що захищено?

✅ **API ключ ТІЛЬКИ на сервері** - клієнт його НЕ бачить  
✅ **Backend фільтрує запити** - захист від зловживань  
✅ **CORS налаштовано** - контроль доступу  
✅ **`.env` в `.gitignore`** - не потрапить в Git  
✅ **Змінні в Vercel зашифровані** - максимальна безпека  

### Порівняння безпеки:

| Аспект | Без Backend | З Backend |
|--------|-------------|-----------|
| API ключ у коді | ❌ Так (небезпечно) | ✅ Ні |
| Ключ у DevTools | ❌ Видно | ✅ Не видно |
| Ключ у Git | ⚠️ Ризик | ✅ Неможливо |
| Контроль запитів | ❌ Немає | ✅ Є |
| Rate limiting | ❌ Немає | ✅ Можна додати |

---

## 🔄 Оновлення після деплою

### Зміна коду:
```bash
git add .
git commit -m "Update features"
git push
```
Vercel автоматично задеплоїть!

### Зміна API ключа:
1. **Vercel Dashboard** → вибрати проєкт
2. **Settings** → **Environment Variables**
3. Знайти `OPENROUTER_API_KEY`
4. Натиснути **"Edit"** → вставити новий ключ
5. **"Save"** → перейти до **Deployments**
6. Натиснути **⋮** → **"Redeploy"**

---

## 📊 API Endpoints

### POST `/api/chat`

**Request:**
```json
{
  "messages": [
    { "role": "user", "content": "Hello!" }
  ],
  "model": "meta-llama/llama-3.2-3b-instruct:free",
  "temperature": 0.7,
  "max_tokens": 2000
}
```

**Response:**
```json
{
  "choices": [
    {
      "message": {
        "content": "Hi! How can I help you?"
      }
    }
  ]
}
```

### GET `/api/models`

**Response:**
```json
{
  "data": [
    {
      "id": "meta-llama/llama-3.2-3b-instruct:free",
      "name": "Llama 3.2 3B"
    }
  ]
}
```

---

## 🆘 Troubleshooting

### Проблема: "API key not configured"

**Причина:** Змінна `OPENROUTER_API_KEY` не встановлена на Vercel

**Рішення:**
1. Vercel Dashboard → Settings → Environment Variables
2. Додати `OPENROUTER_API_KEY` для всіх середовищ
3. Redeploy проєкт

### Проблема: CORS Error

**Причина:** Backend не дозволяє запити з вашого домену

**Рішення:**
Файл `api/chat.ts` вже має CORS headers:
```typescript
res.setHeader('Access-Control-Allow-Origin', '*');
```

### Проблема: 404 на /api/chat

**Причина:** Vercel не бачить папку `/api`

**Рішення:**
1. Перевірте, чи існує `api/chat.ts` в корені проєкту
2. Vercel автоматично розпізнає файли в `/api` як serverless functions
3. Зробіть Redeploy

### Проблема: API працює локально, але не на Vercel

**Рішення:**
```bash
# Перевірте логи на Vercel
vercel logs <deployment-url>

# Або в Dashboard → Deployments → Runtime Logs
```

---

## 📚 Архітектура Backend

### Чому Vercel Serverless Functions?

✅ **Безкоштовно** - 100,000 запитів/місяць  
✅ **Автомасштабування** - під будь-яке навантаження  
✅ **Нуль конфігурації** - працює з коробки  
✅ **TypeScript підтримка** - типи з `@vercel/node`  
✅ **Швидкий деплой** - секунди, не хвилини  

### Альтернативи:

- **Express Server** - складніше, потрібен хостинг
- **AWS Lambda** - дорожче для малих проєктів
- **Firebase Functions** - прив'язка до Firebase
- **Cloudflare Workers** - інший синтаксис

**Vercel Serverless = найпростіше рішення для Vite/React проєктів! 🚀**

---

## 📖 Корисні посилання

- [Vercel Serverless Functions Docs](https://vercel.com/docs/functions/serverless-functions)
- [Vercel Environment Variables](https://vercel.com/docs/projects/environment-variables)
- [OpenRouter API Docs](https://openrouter.ai/docs)
- [@vercel/node TypeScript Types](https://www.npmjs.com/package/@vercel/node)

---

## 🎉 Готово!

Тепер ваш сайт на Vercel з **максимально безпечним backend**! 🔒

- ✅ API ключ захищений на сервері
- ✅ Клієнт НЕ має доступу до ключа
- ✅ Код безпечно публікувати на GitHub
- ✅ Професійна архітектура backend

**URL:** `https://ваш-домен.vercel.app`

Можете безпечно шерити проєкт - API ключ під надійним захистом! 🛡️
