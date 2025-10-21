# ⚡ Django Backend: Швидкий старт

## 🎯 За 10 хвилин від нуля до деплою

### 1️⃣ Локально (2 хв)

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
```

Відредагуйте `.env`:
```env
OPENROUTER_API_KEY=sk-or-v1-ваш_ключ
DEBUG=True
```

```bash
python manage.py migrate
python manage.py runserver 8000
```

Перевірте: http://localhost:8000/api/health/

✅ Backend працює!

---

### 2️⃣ Railway Deploy (5 хв)

1. **Push на GitHub:**
   ```bash
   git add .
   git commit -m "Add Django backend"
   git push
   ```

2. **Railway.app:**
   - New Project → Deploy from GitHub
   - Оберіть репо → Railway автодеплоїть

3. **Додайте змінні (Settings → Variables):**
   ```
   OPENROUTER_API_KEY = sk-or-v1-xxx
   DEBUG = False
   ALLOWED_HOSTS = your-app.railway.app
   CORS_ALLOWED_ORIGINS = https://your-frontend.vercel.app
   ```

4. **Міграції (Run Command):**
   ```bash
   python manage.py migrate
   ```

✅ Backend на Railway!

---

### 3️⃣ З'єднання Frontend (3 хв)

У корені frontend створіть `.env`:
```env
VITE_DJANGO_BACKEND_URL=https://your-app.railway.app
```

```bash
git add .
git commit -m "Connect to Django backend"
git push
```

Vercel автодеплоїть → Готово! 🎉

---

## ✅ Чеклист

- [ ] Backend працює локально
- [ ] Backend на Railway
- [ ] Змінні додано
- [ ] Frontend з'єднано
- [ ] AI чат працює
- [ ] API ключ НЕ в коді

---

## 🔗 Endpoints

```
GET  /api/health/   - Health check
POST /api/chat/     - AI chat
GET  /api/models/   - Available models
```

---

## 📖 Детальна інструкція

Дивіться: `DJANGO_DEPLOY_GUIDE.md`

---

**Django + React + Railway + Vercel = Готово! 🚀**
