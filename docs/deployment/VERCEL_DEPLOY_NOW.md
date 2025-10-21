# 🚀 ДЕПЛОЙ НА VERCEL - ІНСТРУКЦІЯ

## ✅ Що вже зроблено

- ✅ Код на GitHub (https://github.com/Sharik3k/Valorant-HUB)
- ✅ Всі файли закомічено
- ✅ AI асистент готовий
- ✅ Документація створена

---

## 🎯 Деплой на Vercel (2 способи)

### Спосіб 1: Через веб-інтерфейс Vercel (Рекомендовано) ⭐

#### Крок 1: Перейти на Vercel
```
https://vercel.com
```

#### Крок 2: Увійти через GitHub
- Клік на "Sign Up" або "Login"
- Обрати "Continue with GitHub"
- Авторизуватися

#### Крок 3: Створити новий проект
- Клік "Add New..." → "Project"
- Знайти репозиторій "Valorant-HUB"
- Клік "Import"

#### Крок 4: Налаштування проекту
```
Framework Preset:    Vite
Build Command:       npm run build
Output Directory:    dist
Install Command:     npm install
```

#### Крок 5: Environment Variables ⚠️ ВАЖЛИВО
Додати ці змінні (клік "Add"):

```env
VITE_OPENROUTER_API_KEY
Значення: your_openrouter_api_key_here

VITE_AI_MODEL
Значення: meta-llama/llama-3.2-3b-instruct:free

VITE_DJANGO_BACKEND_URL
Значення: http://localhost:8000
```

**ПРИМІТКА**: Замість `your_openrouter_api_key_here` вставте справжній ключ з https://openrouter.ai/keys

#### Крок 6: Deploy
- Клік "Deploy"
- Дочекатися завершення (2-3 хв)
- Отримати URL типу: `https://valorant-hub-xxx.vercel.app`

---

### Спосіб 2: Через Vercel CLI

#### Крок 1: Встановити Vercel CLI
```powershell
npm install -g vercel
```

#### Крок 2: Авторизуватися
```powershell
vercel login
```

#### Крок 3: Deploy
```powershell
cd "c:\Users\Мій ПК\OneDrive\Робочий стіл\valoranthub-devs-github-speckit\Valorant-HUB-Final"
vercel
```

Відповісти на питання:
```
? Set up and deploy? [Y/n] y
? Which scope? Your Name
? Link to existing project? [y/N] n
? What's your project's name? valorant-hub
? In which directory is your code located? ./
? Want to override the settings? [y/N] n
```

#### Крок 4: Додати Environment Variables
```powershell
vercel env add VITE_OPENROUTER_API_KEY
# Вставити ваш API ключ

vercel env add VITE_AI_MODEL
# Вставити: meta-llama/llama-3.2-3b-instruct:free

vercel env add VITE_DJANGO_BACKEND_URL
# Вставити: http://localhost:8000
```

#### Крок 5: Redeploy з новими змінними
```powershell
vercel --prod
```

---

## 🔑 Отримання OpenRouter API ключа

### Якщо ще не маєте ключа:

1. Перейти: https://openrouter.ai/keys
2. Sign Up (безкоштовно)
3. Create Key
4. Скопіювати ключ (починається з `sk-or-v1-...`)
5. Додати в Vercel Environment Variables

---

## ✅ Перевірка після деплою

### 1. Відкрити URL
```
https://your-project.vercel.app
```

### 2. Перевірити чат
- Знайти кнопку 💬 справа знизу
- Клікнути на неї
- Написати "Привіт"
- Чекати відповідь

### 3. Якщо чат не працює
- Перевірити Environment Variables в Vercel
- Переконатися що API ключ правильний
- Зробити Redeploy

---

## 📊 Статус деплою

Перевірити статус можна тут:
```
https://vercel.com/dashboard
```

Або в CLI:
```powershell
vercel ls
```

---

## 🆘 Усунення проблем

### Проблема: "Build failed"
**Рішення:**
- Перевірити що всі файли закомічено
- Запустити `npm run build` локально
- Перевірити логи в Vercel Dashboard

### Проблема: "AI не відповідає"
**Рішення:**
- Перевірити Environment Variables
- Переконатися що VITE_OPENROUTER_API_KEY правильний
- Перевірити що ключ активний на openrouter.ai

### Проблема: "404 Not Found"
**Рішення:**
- Перевірити Build Output Directory (має бути `dist`)
- Перевірити що vercel.json існує

---

## 📚 Корисні команди

```powershell
# Переглянути деплої
vercel ls

# Переглянути логи
vercel logs

# Відкрити проект в браузері
vercel open

# Видалити проект
vercel remove valorant-hub
```

---

## 🎉 Після успішного деплою

1. ✅ Отримали URL проекту
2. ✅ Сайт доступний онлайн
3. ✅ AI чат працює
4. ✅ Проект готовий до демонстрації

### Що можна зробити далі:

- 📱 Протестувати на мобільних пристроях
- 🔗 Поділитися посиланням
- 📊 Переглянути аналітику в Vercel
- 🎨 Додати custom domain (опціонально)

---

## 💡 Важливо

**⚠️ НЕ публікуйте API ключі в GitHub!**
- .env файл в .gitignore ✅
- Ключі тільки в Vercel Environment Variables ✅

**💰 Вартість:**
- Vercel Hobby Plan: 🆓 БЕЗКОШТОВНО
- OpenRouter Free Models: 🆓 БЕЗКОШТОВНО

---

## 🚀 Готово!

Тепер ваш VALORANT HUB з AI асистентом доступний всім! 🎮🤖

**URL**: https://your-project.vercel.app
