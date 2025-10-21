# 🚀 Безпечний деплой на Vercel

## 📋 Передумови

1. ✅ Обліковий запис на [Vercel](https://vercel.com)
2. ✅ Репозиторій на GitHub/GitLab/Bitbucket
3. ✅ API ключ від [OpenRouter](https://openrouter.ai/keys)

---

## 🔧 Крок 1: Налаштування локальної розробки

### 1.1 Створіть файл `.env`

У корені проєкту створіть файл `.env` (скопіюйте з `.env.example`):

```bash
# Windows PowerShell
Copy-Item .env.example .env
```

### 1.2 Додайте ваш API ключ

Відредагуйте `.env` файл:

```env
VITE_OPENROUTER_API_KEY=sk-or-v1-ваш_реальний_ключ_тут
VITE_OPENROUTER_API_URL=https://openrouter.ai/api/v1/chat/completions
VITE_APP_NAME=Valorant-HUB
VITE_APP_URL=http://localhost:5173
VITE_DEFAULT_AI_MODEL=meta-llama/llama-3.2-3b-instruct:free
```

⚠️ **ВАЖЛИВО:** Файл `.env` вже в `.gitignore` - він НЕ потрапить в Git!

### 1.3 Перевірте локально

```bash
npm install
npm run dev
```

Відкрийте http://localhost:5173 та перевірте, що AI чат працює.

---

## 🌐 Крок 2: Деплой на Vercel

### Варіант A: Через Vercel Dashboard (рекомендовано)

1. **Зайдіть на [Vercel Dashboard](https://vercel.com/dashboard)**

2. **Натисніть "Add New..." → "Project"**

3. **Імпортуйте свій репозиторій:**
   - Оберіть GitHub/GitLab/Bitbucket
   - Знайдіть репозиторій `Valorant-HUB`
   - Натисніть "Import"

4. **Налаштуйте проєкт:**
   ```
   Framework Preset: Vite
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```

5. **⚠️ НЕ ДЕПЛОЙТЕ ЩЕ! Спочатку додайте змінні оточення:**

### Варіант B: Через Vercel CLI

```bash
# Встановіть Vercel CLI
npm i -g vercel

# Залогіньтеся
vercel login

# Деплой (спочатку додайте змінні - див. Крок 3!)
vercel
```

---

## 🔐 Крок 3: Додавання змінних оточення в Vercel

### 3.1 У Vercel Dashboard

1. Перейдіть в **Settings** вашого проєкту
2. Оберіть **Environment Variables** в лівому меню
3. Додайте кожну змінну:

| Name | Value | Environment |
|------|-------|-------------|
| `VITE_OPENROUTER_API_KEY` | `sk-or-v1-ваш_ключ` | Production, Preview, Development |
| `VITE_OPENROUTER_API_URL` | `https://openrouter.ai/api/v1/chat/completions` | Production, Preview, Development |
| `VITE_APP_NAME` | `Valorant-HUB` | Production, Preview, Development |
| `VITE_APP_URL` | `https://ваш-домен.vercel.app` | Production |
| `VITE_DEFAULT_AI_MODEL` | `meta-llama/llama-3.2-3b-instruct:free` | Production, Preview, Development |

4. **Натисніть "Save" після кожної змінної**

### 3.2 Через Vercel CLI

```bash
# Додайте всі змінні
vercel env add VITE_OPENROUTER_API_KEY
# Вставте ваш ключ коли запитає

vercel env add VITE_OPENROUTER_API_URL
# Вставте: https://openrouter.ai/api/v1/chat/completions

vercel env add VITE_APP_NAME
# Вставте: Valorant-HUB

vercel env add VITE_APP_URL
# Вставте: https://ваш-домен.vercel.app

vercel env add VITE_DEFAULT_AI_MODEL
# Вставте: meta-llama/llama-3.2-3b-instruct:free
```

---

## 🎯 Крок 4: Деплой!

### Через Dashboard:
1. Натисніть **"Deploy"**
2. Почекайте 1-2 хвилини
3. Отримаєте URL типу `https://valorant-hub-xxx.vercel.app`

### Через CLI:
```bash
vercel --prod
```

---

## ✅ Крок 5: Перевірка

1. **Відкрийте ваш сайт** на Vercel URL
2. **Перевірте AI чат** - він повинен працювати
3. **Перевірте консоль браузера** (F12) - не повинно бути помилок

---

## 🔒 Безпека - Що захищено?

✅ **API ключ НЕ в коді** - тільки в змінних оточення  
✅ **`.env` в `.gitignore`** - не потрапляє в Git  
✅ **Змінні в Vercel** - зашифровані та безпечні  
✅ **Публічний код безпечний** - можна шерити на GitHub  

⚠️ **ЩО НЕ ТРЕБА РОБИТИ:**
- ❌ Не коммітити `.env` файл
- ❌ Не хардкодити API ключі в коді
- ❌ Не шерити screenshots з `.env` файлом
- ❌ Не публікувати API ключ в Issues/PR/Discord

---

## 🔄 Оновлення після деплою

### Зміна коду:
```bash
git add .
git commit -m "Update features"
git push
```
Vercel автоматично задеплоїть нову версію!

### Зміна API ключа:
1. Vercel Dashboard → Settings → Environment Variables
2. Знайдіть `VITE_OPENROUTER_API_KEY`
3. Натисніть **"Edit"** → вставте новий ключ → **"Save"**
4. Натисніть **"Redeploy"** у вкладці Deployments

---

## 🆘 Troubleshooting

### Проблема: AI чат не працює після деплою

**Рішення:**
1. Перевірте змінні в Vercel Dashboard → Settings → Environment Variables
2. Переконайтеся, що `VITE_OPENROUTER_API_KEY` встановлено
3. Зробіть Redeploy: Deployments → ⋮ → "Redeploy"

### Проблема: Build fails

**Рішення:**
```bash
# Перевірте локально
npm run build

# Якщо працює локально, перевірте в Vercel:
# Settings → General → Build & Output Settings
# Build Command: npm run build
# Output Directory: dist
```

### Проблема: 404 на роутах

**Рішення:**
Файл `vercel.json` вже налаштований:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

---

## 📚 Корисні посилання

- [Vercel Dashboard](https://vercel.com/dashboard)
- [Vercel Docs - Environment Variables](https://vercel.com/docs/projects/environment-variables)
- [OpenRouter Dashboard](https://openrouter.ai/keys)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)

---

## 🎉 Готово!

Тепер ваш сайт на Vercel з безпечно захищеним API ключем!

**Ваш URL:** `https://ваш-домен.vercel.app`

Можете безпечно публікувати код на GitHub - API ключ захищений! 🔒
