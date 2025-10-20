# ⚡ Backend: Швидкий старт (5 хвилин)

## 🎯 Що зроблено?

✅ Створено Vercel Serverless Functions:
- `/api/chat.ts` - endpoint для AI чату
- `/api/models.ts` - endpoint для моделей

✅ Оновлено клієнт:
- Використовує `/api/chat` замість прямих запитів
- API ключ більше НЕ в коді!

✅ Безпека:
- API ключ ТІЛЬКИ на сервері Vercel
- Клієнт НЕ має доступу до ключа

---

## 🚀 Локальне тестування

### 1. Встановіть залежності
```bash
npm install
```

### 2. Встановіть Vercel CLI
```bash
npm i -g vercel
```

### 3. Створіть `.env`
```bash
Copy-Item .env.example .env
```

Відредагуйте `.env`:
```env
OPENROUTER_API_KEY=sk-or-v1-ваш_ключ
APP_NAME=Valorant-HUB
APP_URL=http://localhost:3000
DEFAULT_AI_MODEL=meta-llama/llama-3.2-3b-instruct:free
VITE_DEFAULT_AI_MODEL=meta-llama/llama-3.2-3b-instruct:free
```

### 4. Запустіть
```bash
# Термінал 1: Frontend
npm run dev

# Термінал 2: Backend API
vercel dev
```

Відкрийте http://localhost:3000 ✅

---

## 🌐 Деплой на Vercel

### 1. Push на GitHub
```bash
git add .
git commit -m "Add secure backend API"
git push
```

### 2. Import в Vercel
- https://vercel.com/dashboard
- "Add New..." → "Project"
- Оберіть репозиторій → "Import"

### 3. Додайте змінні оточення

⚠️ **КРИТИЧНО!** Settings → Environment Variables:

```
OPENROUTER_API_KEY = sk-or-v1-ваш_ключ
APP_NAME = Valorant-HUB
APP_URL = https://ваш-домен.vercel.app
DEFAULT_AI_MODEL = meta-llama/llama-3.2-3b-instruct:free
VITE_DEFAULT_AI_MODEL = meta-llama/llama-3.2-3b-instruct:free
```

Оберіть **всі середовища** ✅

### 4. Deploy
Натисніть "Deploy" → Готово! 🎉

---

## ✅ Перевірка

- [ ] `npm install` - залежності встановлено
- [ ] `.env` створено з вашим API ключем
- [ ] `vercel dev` працює локально
- [ ] AI чат працює на http://localhost:3000
- [ ] Код запушено на GitHub
- [ ] Проєкт імпортовано в Vercel
- [ ] Змінні додано в Vercel Dashboard
- [ ] Deploy успішний
- [ ] AI чат працює на продакшені
- [ ] API ключ НЕ видно в DevTools (F12)

---

## 🔐 Перевірка безпеки

Відкрийте DevTools (F12) → Network:

✅ Запити йдуть до `/api/chat` (не до openrouter.ai)  
✅ API ключ НЕ видно в Headers  
✅ API ключ НЕ видно в Payload  

Перейдіть до Sources → перегляньте код:
✅ API ключ відсутній у всіх файлах

**Безпека 100%!** 🛡️

---

## 📖 Детальна документація

- `VERCEL_BACKEND_DEPLOY.md` - повна інструкція
- `api/chat.ts` - код backend endpoint
- `src/services/openrouter-backend.ts` - клієнтський сервіс

---

## 🆘 Проблеми?

### "API key not configured"
→ Додайте `OPENROUTER_API_KEY` в Vercel Environment Variables

### CORS Error
→ Вже налаштовано в `api/chat.ts`

### 404 на /api/chat
→ Перевірте, чи існує файл `api/chat.ts`

### API не працює локально
→ Запустіть `vercel dev` замість `npm run dev` для API

---

**Готово! API ключ під надійним захистом на сервері Vercel! 🔒**
