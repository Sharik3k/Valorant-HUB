# 🐍 Повна інструкція деплою Django Backend

## 🎯 Архітектура

```
Frontend (Vercel)  ←→  Django Backend (Railway)  ←→  OpenRouter API
     React                   Python                      AI Models
```

**Frontend:** Vercel (безкоштовно)  
**Backend:** Railway або Heroku (безкоштовно)  
**API ключ:** Захищений на Django сервері

---

## 📋 Перед деплоєм

### ✅ Чеклист:

- [ ] Python 3.11+ встановлено
- [ ] Git встановлено
- [ ] API ключ з OpenRouter
- [ ] GitHub акаунт
- [ ] Railway/Heroku акаунт

---

## 🚀 Варіант 1: Railway (Рекомендовано)

### Чому Railway?
✅ Простіше за Heroku  
✅ 500 годин безкоштовно/місяць  
✅ Автодеплой з GitHub  
✅ PostgreSQL included  
✅ Не потрібна кредитна картка  

### Крок 1: Підготовка коду

```bash
cd backend

# Створіть віртуальне середовище
python -m venv venv
venv\Scripts\activate  # Windows

# Встановіть залежності
pip install -r requirements.txt

# Створіть .env
copy .env.example .env
```

Відредагуйте `.env`:
```env
DJANGO_SECRET_KEY=ваш-секретний-ключ-тут
DEBUG=False
OPENROUTER_API_KEY=sk-or-v1-ваш_ключ
APP_URL=https://your-frontend.vercel.app
```

### Крок 2: Push на GitHub

```bash
cd ..  # Корінь проєкту
git add .
git commit -m "Add Django backend"
git push origin main
```

### Крок 3: Deploy на Railway

1. **Зайдіть на [railway.app](https://railway.app)**

2. **Натисніть "New Project"**

3. **"Deploy from GitHub repo"**
   - Оберіть ваш репозиторій
   - Railway автоматично виявить Django

4. **Налаштування (Settings):**
   ```
   Root Directory: backend
   Build Command: pip install -r requirements.txt
   Start Command: gunicorn config.wsgi:application
   ```

5. **⚠️ Додайте змінні оточення (Variables):**

   У Railway Dashboard → Variables → Add Variables:

   ```
   DJANGO_SECRET_KEY = your-secret-key-here
   DEBUG = False
   ALLOWED_HOSTS = your-app.railway.app
   CORS_ALLOWED_ORIGINS = https://your-frontend.vercel.app
   OPENROUTER_API_KEY = sk-or-v1-ваш_ключ
   APP_NAME = Valorant-HUB
   APP_URL = https://your-frontend.vercel.app
   DEFAULT_AI_MODEL = meta-llama/llama-3.2-3b-instruct:free
   ```

6. **Deploy!**
   - Railway автоматично задеплоїть
   - Отримаєте URL: `https://your-app.railway.app`

### Крок 4: Міграції

У Railway → Settings → **Run Command:**
```bash
python manage.py migrate
```

### Крок 5: Перевірка

Відкрийте в браузері:
```
https://your-app.railway.app/api/health/
```

Повинно повернути:
```json
{
  "status": "healthy",
  "api_key_configured": true
}
```

✅ Backend готовий!

---

## 🔵 Варіант 2: Heroku

### Чому Heroku?
✅ Популярний та надійний  
⚠️ Потребує кредитну картку (але безкоштовний план є)  
✅ Добра документація  

### Крок 1: Встановіть Heroku CLI

```bash
# Windows (winget)
winget install Heroku.HerokuCLI

# Або завантажте: https://devcenter.heroku.com/articles/heroku-cli
```

### Крок 2: Логін

```bash
heroku login
```

### Крок 3: Створіть Heroku app

```bash
cd backend
heroku create valorant-hub-backend

# Або без імені (випадкове)
heroku create
```

### Крок 4: Додайте змінні оточення

```bash
heroku config:set DJANGO_SECRET_KEY="your-secret-key"
heroku config:set DEBUG=False
heroku config:set OPENROUTER_API_KEY="sk-or-v1-ваш_ключ"
heroku config:set APP_NAME="Valorant-HUB"
heroku config:set APP_URL="https://your-frontend.vercel.app"
heroku config:set DEFAULT_AI_MODEL="meta-llama/llama-3.2-3b-instruct:free"
```

### Крок 5: Deploy

```bash
git push heroku main

# Або якщо ви на іншій гілці
git push heroku your-branch:main
```

### Крок 6: Міграції

```bash
heroku run python manage.py migrate
```

### Крок 7: Відкрийте app

```bash
heroku open
```

Додайте `/api/health/` до URL для перевірки.

✅ Backend готовий!

---

## 🌐 Крок 2: Налаштування Frontend (Vercel)

### 1. Оновіть `.env` для frontend

Створіть файл `.env` в корені frontend:

```env
VITE_DJANGO_BACKEND_URL=https://your-app.railway.app
VITE_DEFAULT_AI_MODEL=meta-llama/llama-3.2-3b-instruct:free
```

### 2. Deploy frontend на Vercel

```bash
# В корені проєкту
git add .
git commit -m "Update backend URL"
git push
```

Vercel автоматично задеплоїть!

### 3. Додайте змінні в Vercel

Vercel Dashboard → Settings → Environment Variables:

```
VITE_DJANGO_BACKEND_URL = https://your-app.railway.app
VITE_DEFAULT_AI_MODEL = meta-llama/llama-3.2-3b-instruct:free
```

### 4. Оновіть CORS на backend

Railway/Heroku → Variables:

```
CORS_ALLOWED_ORIGINS = https://your-frontend.vercel.app,https://your-domain.vercel.app
```

Redeploy backend!

---

## ✅ Перевірка всієї системи

### 1. Backend Health Check

```bash
curl https://your-app.railway.app/api/health/
```

Очікуваний результат:
```json
{
  "status": "healthy",
  "api_key_configured": true,
  "app_name": "Valorant-HUB"
}
```

### 2. Frontend → Backend

1. Відкрийте ваш frontend
2. Перейдіть на AI Chat
3. Напишіть повідомлення
4. AI повинен відповісти ✅

### 3. DevTools перевірка

F12 → Network → відправте повідомлення:

✅ Запит йде до `https://your-app.railway.app/api/chat/`  
✅ API ключ НЕ видно в Headers  
✅ CORS працює  

---

## 🔄 Оновлення після деплою

### Backend (Django):

```bash
cd backend
git add .
git commit -m "Update backend"
git push

# Railway автодеплоїть
# Heroku: git push heroku main
```

### Frontend (React):

```bash
git add .
git commit -m "Update frontend"
git push

# Vercel автодеплоїть
```

---

## 🆘 Troubleshooting

### Проблема: "Application Error" на Heroku/Railway

**Причина:** Помилка в коді або налаштуваннях

**Рішення:**
```bash
# Railway
railway logs

# Heroku
heroku logs --tail
```

### Проблема: CORS Error

**Причина:** Frontend URL не в CORS_ALLOWED_ORIGINS

**Рішення:**
1. Railway/Heroku → Variables
2. Додайте ваш Vercel URL до `CORS_ALLOWED_ORIGINS`
3. Redeploy

### Проблема: "API key not configured"

**Причина:** OPENROUTER_API_KEY не встановлено

**Рішення:**
```bash
# Railway: Variables → Add
# Heroku:
heroku config:set OPENROUTER_API_KEY="sk-or-v1-xxx"
```

### Проблема: 500 Internal Server Error

**Рішення:**
```bash
# Перевірте логи
railway logs  # Railway
heroku logs --tail  # Heroku

# Найчастіші причини:
# 1. SECRET_KEY не встановлено
# 2. ALLOWED_HOSTS не включає ваш домен
# 3. Міграції не запущені
```

### Проблема: Повільний запуск (cold start)

**Причина:** Безкоштовні плани "сплять" після бездіяльності

**Рішення:**
- Railway: не спить (але обмежені години)
- Heroku: спить після 30 хв бездіяльності
- Рішення: Upgrade до платного плану або використовуйте пінгер

---

## 💰 Вартість

### Railway
- **Безкоштовно:** 500 годин/місяць ($5 у кредитах)
- **Starter:** $5/місяць (необмежені години)

### Heroku
- **Free:** Безкоштовно, але спить після 30 хв
- **Hobby:** $7/місяць (не спить)

### Vercel (Frontend)
- **Безкоштовно:** Необмежено для особистих проєктів

**Загалом для малого проєкту: $0-7/місяць**

---

## 📊 Моніторинг

### Railway Dashboard
- Real-time logs
- CPU/Memory usage
- Deploy history

### Heroku Dashboard
- Metrics
- Logs
- Dynos status

---

## 🔐 Безпека Best Practices

### ✅ ЩО ЗРОБИТИ:

1. **Генеруйте DJANGO_SECRET_KEY:**
   ```python
   from django.core.management.utils import get_random_secret_key
   print(get_random_secret_key())
   ```

2. **Встановіть DEBUG=False у продакшені**

3. **Використовуйте HTTPS (автоматично на Railway/Heroku)**

4. **Регулярно оновлюйте залежності:**
   ```bash
   pip list --outdated
   pip install --upgrade Django
   ```

5. **Додайте rate limiting (optional):**
   ```bash
   pip install django-ratelimit
   ```

### ❌ ЩО НЕ РОБИТИ:

- ❌ Не коммітити `.env` файл
- ❌ Не ставити DEBUG=True в продакшені
- ❌ Не використовувати слабкий SECRET_KEY
- ❌ Не забувати про CORS налаштування

---

## 📚 Додаткові ресурси

- [Railway Docs](https://docs.railway.app/)
- [Heroku Django Docs](https://devcenter.heroku.com/articles/django-app-configuration)
- [Django Deployment Checklist](https://docs.djangoproject.com/en/4.2/howto/deployment/checklist/)
- [Django REST Framework](https://www.django-rest-framework.org/)

---

## 🎉 Готово!

Тепер у вас:
- ✅ Django Backend на Railway/Heroku
- ✅ React Frontend на Vercel
- ✅ API ключ захищений
- ✅ Автодеплой з GitHub
- ✅ CORS налаштовано
- ✅ Production-ready

**Професійна full-stack архітектура! 🚀**

Frontend + Backend + AI = Повноцінний додаток!
