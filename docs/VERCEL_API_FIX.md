# 🚨 Vercel API Error Fix

## Помилка:
```
API Error: Error: User not found
    at module.exports [as handler] (/var/task/api/chat.js:69:13)
```

## Причина:
Vercel serverless function не має доступу до API ключа OpenRouter.

## 🔧 Як виправити:

### 1. Додайте Environment Variables на Vercel:

#### Через Vercel Dashboard:
1. Перейдіть: https://vercel.com/dashboard
2. Виберіть проект `Valorant-HUB`
3. Settings → Environment Variables
4. Додайте:

| Name | Value | Environment |
|------|-------|-------------|
| `OPENROUTER_API_KEY` | `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` | ✓ Production ✓ Preview ✓ Development |
| `OPENAI_API_KEY` | `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` | ✓ Production ✓ Preview ✓ Development |
| `PORT` | `3001` | ✓ Production ✓ Preview ✓ Development |

#### Через CLI:
```bash
vercel env add OPENROUTER_API_KEY
# Вставте ключ: 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

vercel env add OPENAI_API_KEY  
# Вставте ключ: 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

vercel env add PORT
# Вставте: 3001
```

### 2. Редеплой проекту:
```bash
vercel --prod
```

### 3. Перевірка:
Після редеплою перевірте ендпоінт:
```
https://valorant-hub.vercel.app/api/chat
```

## 🔍 Діагностика:

### Перевірте логи на Vercel:
1. Vercel Dashboard → Functions → Logs
2. Шукайте помилку "User not found"

### Тестуйте локально:
```bash
cd backend
npm start
# В іншому терміналі:
curl -X POST http://localhost:3001/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Які агенти для Ascent?"}'
```

## 🛡️ Безпека:
- Ніколи не додавайте справжні ключі в код
- Використовуйте тільки Environment Variables
- `.env` файл не потрапляє на Vercel (в .gitignore)

## ✅ Після виправлення:
AI чат буде працювати на Vercel без помилок автентифікації.
