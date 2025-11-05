# 🤖 Швидке Налаштування Gemini AI

## 📋 Що Потрібно

1. **Gemini API Key** (безкоштовно)
2. **5 хвилин** часу

---

## 🚀 Крок 1: Отримати API Ключ

1. Відкрийте: https://aistudio.google.com/app/apikey
2. Увійдіть через Google акаунт
3. Натисніть **"Create API Key"**
4. Виберіть **"Create API key in new project"**
5. Скопіюйте ключ (починається з `AIza...`)

⚠️ **Важливо:** Зберігайте ключ в безпечному місці!

---

## 🔧 Крок 2: Налаштувати Локально

### Створіть `.env` файл в корені проекту:

```env
# Google Gemini API
GEMINI_API_KEY=AIzaSy...ваш-ключ-тут
AI_MODEL=gemini-2.0-flash-exp

# Django Backend (якщо потрібно)
VITE_DJANGO_BACKEND_URL=http://localhost:8000
```

### Встановіть залежності:

```bash
# В папці api
cd api
npm install

# Повернутись назад
cd ..
```

---

## ☁️ Крок 3: Налаштувати на Vercel

### Через Dashboard:

1. Відкрийте: https://vercel.com/dashboard
2. Виберіть ваш проект
3. Перейдіть в **Settings** → **Environment Variables**
4. Додайте змінні:

| Name | Value |
|------|-------|
| `GEMINI_API_KEY` | `AIzaSy...ваш-ключ` |
| `AI_MODEL` | `gemini-2.0-flash-exp` |

5. Натисніть **Save**
6. Перейдіть в **Deployments** → **Redeploy**

---

## ✅ Крок 4: Перевірити

### Локально:

```bash
# Запустити frontend
cd frontend
npm run dev

# В іншому терміналі - backend (якщо потрібно)
cd backend
npm run dev
```

Відкрийте http://localhost:3000 і натисніть на іконку чату 💬

### На Vercel:

Відкрийте ваш сайт і натисніть на іконку чату 💬

---

## 🎯 Що Тепер Працює

- ✅ AI чат-асистент з Gemini 2.0 Flash
- ✅ 1500 безкоштовних запитів на день
- ✅ Швидкі відповіді (1-2 секунди)
- ✅ Контекстні розмови
- ✅ Автоматична обробка помилок

---

## 🐛 Troubleshooting

### Помилка: "Gemini API key не налаштовано"

**Локально:**
- Перевірте що `.env` файл в корені проекту
- Перевірте що `GEMINI_API_KEY` правильно вказано
- Перезапустіть dev сервер

**На Vercel:**
- Перевірте Environment Variables в Settings
- Зробіть Redeploy після додавання змінних

### Помилка: "API key expired" або "API key invalid"

- Перевірте що ключ скопійовано повністю
- Створіть новий ключ на https://aistudio.google.com/app/apikey
- Оновіть змінну оточення

### Чат не відповідає

1. Відкрийте консоль браузера (F12)
2. Перевірте чи є помилки
3. Перевірте Network tab - чи йдуть запити до `/api/chat`
4. Перевірте логи Vercel (якщо на продакшені)

---

## 📚 Додаткова Інформація

- **Документація Gemini:** https://ai.google.dev/docs
- **Ліміти API:** https://ai.google.dev/pricing
- **Детальна документація:** [AI_RATE_LIMITS.md](./AI_RATE_LIMITS.md)

---

## 🎉 Готово!

Тепер ваш AI асистент працює на **Google Gemini 2.0 Flash** - найшвидшій і найновішій моделі від Google!

**Питання?** Перевірте [AI_RATE_LIMITS.md](./AI_RATE_LIMITS.md) для детальної інформації.
