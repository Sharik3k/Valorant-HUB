# 🤖 Швидке Налаштування OpenAI GPT

## 📋 Що Потрібно

1. **OpenAI API Key**
2. **5 хвилин** часу

---

## 🚀 Крок 1: Отримати API Ключ

1. Відкрийте: https://platform.openai.com/api-keys
2. Увійдіть у свій OpenAI акаунт
3. Натисніть **"Create new secret key"**
4. Скопіюйте ключ (починається з `sk-...`)

⚠️ **Важливо:** Зберігайте ключ в безпечному місці!

---

## 🔧 Крок 2: Налаштувати Локально

### Створіть `.env` файл в корені проекту:

```env
# OpenAI API
OPENAI_API_KEY=sk-...ваш-ключ-тут
AI_MODEL=gpt-4o

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
| `OPENAI_API_KEY` | `sk-...ваш-ключ` |
| `AI_MODEL` | `gpt-4o` |

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

- ✅ AI чат-асистент на OpenAI GPT-4o
- ✅ Висока якість відповідей
- ✅ Стабільний API
- ✅ Контекстні розмови
- ✅ Автоматична обробка помилок

---

## 🐛 Troubleshooting

### Помилка: "OpenAI API key не налаштовано"

**Локально:**
- Перевірте що `.env` файл в корені проекту
- Перевірте що `OPENAI_API_KEY` правильно вказано
- Перезапустіть dev сервер

**На Vercel:**
- Перевірте Environment Variables в Settings
- Зробіть Redeploy після додавання змінних

### Помилка: "API key expired" або "API key invalid"

- Перевірте що ключ скопійовано повністю
- Створіть новий ключ на https://platform.openai.com/api-keys
- Оновіть змінну оточення

### Чат не відповідає

1. Відкрийте консоль браузера (F12)
2. Перевірте чи є помилки
3. Перевірте Network tab - чи йдуть запити до `/api/chat`
4. Перевірте логи Vercel (якщо на продакшені)

---

## 📚 Додаткова Інформація

- **Документація OpenAI:** https://platform.openai.com/docs
- **Ціни:** https://openai.com/api/pricing
- **Детальна документація:** [AI_RATE_LIMITS.md](./AI_RATE_LIMITS.md)

---

## 🎉 Готово!

Тепер ваш AI асистент працює на **OpenAI GPT-4o**!

**Питання?** Перевірте [AI_RATE_LIMITS.md](./AI_RATE_LIMITS.md) для детальної інформації.
