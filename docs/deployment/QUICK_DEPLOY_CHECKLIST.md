# ⚡ Швидкий чеклист деплою

## 🚨 НЕГАЙНО (перед пушем в Git):

### 1. Створіть локальний `.env` файл

```bash
# PowerShell
Copy-Item .env.example .env
```

Відредагуйте `.env` та додайте ваш API ключ:
```
VITE_OPENROUTER_API_KEY=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
```

### 2. Перевірте `.gitignore`

✅ Вже налаштовано! Файл `.env` не потрапить в Git.

### 3. Видаліть старий ключ з коду (якщо закоммітили)

```bash
# Очистити історію Git (якщо ключ був закоммічений):
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch src/services/openrouter.ts" \
  --prune-empty --tag-name-filter cat -- --all
```

⚠️ **КРАЩЕ:** Згенеруйте новий API ключ на https://openrouter.ai/keys

---

## 📦 Деплой на Vercel (5 хвилин):

### Крок 1: Push код
```bash
git add .
git commit -m "Secure API keys with environment variables"
git push
```

### Крок 2: Vercel Dashboard
1. Зайдіть на https://vercel.com/dashboard
2. "Add New..." → "Project"
3. Імпортуйте ваш GitHub репозиторій

### Крок 3: Додайте змінні (ДО деплою!)
Settings → Environment Variables → Add:

```
VITE_OPENROUTER_API_KEY = sk-or-v1-ваш_ключ
VITE_OPENROUTER_API_URL = https://openrouter.ai/api/v1/chat/completions
VITE_APP_NAME = Valorant-HUB
VITE_APP_URL = https://ваш-домен.vercel.app
VITE_DEFAULT_AI_MODEL = meta-llama/llama-3.2-3b-instruct:free
```

Оберіть **всі середовища** (Production, Preview, Development)

### Крок 4: Deploy
Натисніть "Deploy" → Почекайте 1-2 хв → Готово! 🎉

---

## ✅ Перевірка

- [ ] `.env` файл створено локально
- [ ] `.env` НЕ в Git (перевірте `git status`)
- [ ] Код працює локально (`npm run dev`)
- [ ] Змінні додано в Vercel Dashboard
- [ ] Сайт задеплоєно на Vercel
- [ ] AI чат працює на продакшені
- [ ] API ключ НЕ видно в коді на GitHub

---

## 📖 Детальна інструкція

Дивіться: `VERCEL_DEPLOY_GUIDE.md`
