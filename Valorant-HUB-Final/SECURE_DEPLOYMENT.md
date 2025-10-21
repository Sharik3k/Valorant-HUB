# 🔒 БЕЗПЕЧНИЙ ДЕПЛОЙ - API ключ захищено!

## ✅ Що змінилося

### ❌ БУЛО (небезпечно):
```
Frontend → OpenRouter API
         ↑
    VITE_OPENROUTER_API_KEY
    (видно в браузері!)
```

### ✅ СТАЛО (безпечно):
```
Frontend → /api/chat → OpenRouter API
                ↑
           OPENROUTER_API_KEY
           (тільки на сервері!)
```

---

## 🎯 Переваги нової архітектури

1. **🔒 API ключ захищено** - не доступний в браузері
2. **💰 Контроль витрат** - всі запити через ваш сервер
3. **🛡️ Додаткова безпека** - можна додати rate limiting
4. **📊 Моніторинг** - легко відстежувати використання

---

## 📁 Що було створено

### 1. Serverless Function: `api/chat.ts`
```typescript
// Безпечна серверна функція
// API ключ зберігається в Environment Variables
// Недоступний в браузері
```

### 2. Оновлений клієнт: `src/services/aiService.ts`
```typescript
// Тепер викликає /api/chat
// Більше не використовує VITE_OPENROUTER_API_KEY
// API ключ не потрібен на клієнті
```

### 3. Нові змінні: `.env.example`
```env
# БЕЗ VITE_ = серверні змінні (безпечно)
OPENROUTER_API_KEY=...
AI_MODEL=...
```

---

## 🚀 ДЕПЛОЙ НА VERCEL

### Крок 1: Оновити .env локально (для розробки)

Видаліть старі VITE_ змінні і додайте нові:

```env
# Видалити:
# VITE_OPENROUTER_API_KEY=...
# VITE_AI_MODEL=...

# Додати:
OPENROUTER_API_KEY=sk-or-v1-ваш_ключ_тут
AI_MODEL=meta-llama/llama-3.2-3b-instruct:free
```

### Крок 2: Закомітити зміни

```powershell
git add .
git commit -m "Add secure serverless API for OpenRouter"
git push origin main
```

### Крок 3: Налаштувати Vercel

#### Варіант А: Через веб-інтерфейс ⭐ РЕКОМЕНДОВАНО

1. Перейти на https://vercel.com/dashboard
2. Обрати проект або створити новий
3. Settings → Environment Variables
4. Додати **БЕЗ VITE_ префіксу**:

```
Name:  OPENROUTER_API_KEY
Value: sk-or-v1-ваш_реальний_ключ

Name:  AI_MODEL
Value: meta-llama/llama-3.2-3b-instruct:free
```

5. Зберегти і зробити Redeploy

#### Варіант Б: Через CLI

```powershell
# Додати змінні
vercel env add OPENROUTER_API_KEY
# Вставити: sk-or-v1-ваш_ключ

vercel env add AI_MODEL
# Вставити: meta-llama/llama-3.2-3b-instruct:free

# Redeploy
vercel --prod
```

---

## ✅ Перевірка безпеки

### Як перевірити що API ключ захищено:

1. **Відкрити сайт у браузері**
2. **F12 → Network tab**
3. **Написати в чат**
4. **Перевірити запит до `/api/chat`**

✅ **Правильно**: Запит до `/api/chat`, без Authorization header
❌ **Неправильно**: Запит до `openrouter.ai/api`, з Authorization header

### Перевірити в коді браузера:

```javascript
// F12 → Console
console.log(import.meta.env.OPENROUTER_API_KEY)
// Має бути: undefined ✅

// Старий спосіб (небезпечний):
console.log(import.meta.env.VITE_OPENROUTER_API_KEY)
// Теж має бути: undefined ✅
```

---

## 🔧 Локальна розробка

### Для тестування локально:

1. Створіть `.env` з правильними змінними:
```env
OPENROUTER_API_KEY=sk-or-v1-ваш_ключ
AI_MODEL=meta-llama/llama-3.2-3b-instruct:free
```

2. Запустіть dev сервер:
```powershell
npm run dev
```

3. Serverless функція `/api/chat` працюватиме через Vite

---

## 📊 Що відбувається на продакшені

```
1. Користувач пише в чат
   ↓
2. Frontend → POST /api/chat { messages: [...] }
   ↓
3. Vercel Serverless Function (api/chat.ts)
   - Читає OPENROUTER_API_KEY з process.env
   - Викликає OpenRouter API
   - Повертає відповідь
   ↓
4. Frontend отримує відповідь
   ↓
5. Показує користувачу
```

**🔒 API ключ ніколи не покидає сервер!**

---

## 🆘 Усунення проблем

### "API помилка: 404"
**Рішення:**
- Переконайтесь що файл `api/chat.ts` існує
- Перевірте що він закомічений в git
- Redeploy проекту

### "API помилка: 500"
**Рішення:**
- Перевірте Vercel Logs: `vercel logs`
- Переконайтесь що `OPENROUTER_API_KEY` налаштовано
- Перевірте що ключ правильний на openrouter.ai

### "Локально не працює"
**Рішення:**
- Переконайтесь що `.env` файл існує
- Перевірте що змінні БЕЗ VITE_ префіксу
- Перезапустіть dev сервер

---

## 💡 Додаткові можливості

### Rate Limiting (обмеження запитів)

Додайте в `api/chat.ts`:
```typescript
// Перевірка кількості запитів від одного IP
const rateLimit = new Map();

export default async function handler(req, res) {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  
  // Макс 10 запитів на хвилину
  const now = Date.now();
  const requests = rateLimit.get(ip) || [];
  const recentRequests = requests.filter(time => now - time < 60000);
  
  if (recentRequests.length >= 10) {
    return res.status(429).json({ error: 'Too many requests' });
  }
  
  rateLimit.set(ip, [...recentRequests, now]);
  
  // ... решта коду
}
```

### Логування використання

```typescript
console.log('AI Request:', {
  ip: req.headers['x-forwarded-for'],
  messagesCount: messages.length,
  timestamp: new Date().toISOString(),
});
```

---

## 🎓 Навчальна цінність

Ви навчилися:
- ✅ Використовувати Vercel Serverless Functions
- ✅ Захищати API ключі
- ✅ Розділяти клієнт і сервер
- ✅ Працювати з Environment Variables
- ✅ Правильно структурувати full-stack додаток

---

## 📚 Корисні посилання

- [Vercel Serverless Functions](https://vercel.com/docs/functions)
- [Environment Variables](https://vercel.com/docs/environment-variables)
- [OpenRouter API](https://openrouter.ai/docs)

---

## ✅ Чеклист безпеки

```
□ API ключ БЕЗ VITE_ префіксу
□ .env файл в .gitignore
□ Змінні додані в Vercel Environment Variables
□ API ключ не видно в Network tab
□ console.log(import.meta.env.OPENROUTER_API_KEY) = undefined
□ Serverless function працює
□ Чат відповідає на запити
```

---

## 🎉 Готово!

Тепер ваш API ключ повністю захищено! 🔒

**API ключ зберігається тільки на сервері Vercel і ніколи не потрапляє в браузер користувача.**

---

*Безпека понад усе! 🛡️*
