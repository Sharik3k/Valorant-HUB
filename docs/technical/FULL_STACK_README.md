# 🎮 VALORANT HUB - Full Stack Project

Професійний full-stack додаток з React frontend та Django backend.

---

## 📁 Структура проєкту

```
Valorant-HUB-Final/
│
├── src/                          # 🌐 Frontend (React + TypeScript)
│   ├── pages/
│   │   └── AIChatPage.tsx       # AI чат
│   ├── services/
│   │   ├── openrouter-django.ts # ✅ Django backend client
│   │   ├── openrouter-backend.ts # Vercel serverless client
│   │   └── openrouter.ts        # ❌ Старий (небезпечний)
│   └── ...
│
├── backend/                      # 🐍 Backend (Django REST API)
│   ├── config/
│   │   ├── settings.py          # Django налаштування
│   │   └── urls.py              # URL маршрути
│   ├── api/
│   │   ├── views.py             # API endpoints
│   │   └── urls.py              # API маршрути
│   ├── requirements.txt         # Python залежності
│   ├── manage.py                # Django CLI
│   ├── .env.example             # Приклад змінних
│   └── README.md                # Backend документація
│
├── api/                          # ⚡ Альтернатива: Vercel Serverless
│   ├── chat.ts                  # (Не використовується зараз)
│   └── models.ts
│
├── docs/                         # 📖 Документація
│   ├── DJANGO_DEPLOY_GUIDE.md   # ✅ Деплой Django
│   ├── DJANGO_QUICK_START.md    # ⚡ Швидкий старт
│   ├── BACKEND_COMPARISON.md    # Порівняння backends
│   └── ...
│
├── .env.example                  # Frontend змінні
├── package.json                  # Frontend залежності
└── vite.config.ts                # Vite конфігурація
```

---

## 🚀 Швидкий старт

### 1️⃣ Backend (Django)

```bash
cd backend

# Створіть віртуальне середовище
python -m venv venv
venv\Scripts\activate  # Windows

# Встановіть залежності
pip install -r requirements.txt

# Створіть .env
copy .env.example .env
# Відредагуйте .env з вашим API ключем

# Запустіть сервер
python manage.py migrate
python manage.py runserver 8000
```

Backend: http://localhost:8000

---

### 2️⃣ Frontend (React)

```bash
# В корені проєкту
npm install

# Створіть .env
copy .env.example .env
# Додайте URL Django backend

# Запустіть dev server
npm run dev
```

Frontend: http://localhost:5173

---

## 🌐 Деплой

### Backend → Railway

```bash
cd backend
git add .
git commit -m "Add Django backend"
git push
```

1. [railway.app](https://railway.app) → New Project
2. Deploy from GitHub
3. Додайте змінні оточення
4. Deploy автоматично!

**Детально:** `DJANGO_DEPLOY_GUIDE.md`

---

### Frontend → Vercel

```bash
# В корені
git add .
git commit -m "Update frontend"
git push
```

Vercel автоматично задеплоїть!

**Додайте змінну в Vercel:**
```
VITE_DJANGO_BACKEND_URL = https://your-app.railway.app
```

---

## 📡 API Endpoints

### Django Backend:

```
GET  /api/health/         # Health check
POST /api/chat/           # AI chat
GET  /api/models/         # Available models
```

### Приклад запиту:

```bash
curl -X POST https://your-app.railway.app/api/chat/ \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [{"role": "user", "content": "Hello"}],
    "model": "meta-llama/llama-3.2-3b-instruct:free"
  }'
```

---

## 🔐 Безпека

### ✅ Що захищено:

- API ключ ТІЛЬКИ на Django сервері
- `.env` файли в `.gitignore`
- CORS налаштовано
- Django CSRF protection
- Secure headers

### ❌ Що НЕ треба робити:

- Не коммітити `.env`
- Не ставити DEBUG=True в продакшені
- Не хардкодити секрети в коді

---

## 🛠️ Технології

### Frontend:
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Material-UI** - Components
- **React Router** - Routing

### Backend:
- **Django 4.2** - Web framework
- **Django REST Framework** - API
- **Python 3.11** - Language
- **Gunicorn** - WSGI server
- **WhiteNoise** - Static files

### Деплой:
- **Vercel** - Frontend hosting
- **Railway** - Backend hosting
- **GitHub** - Source control

---

## 📚 Документація

### Для початківців:
- `DJANGO_QUICK_START.md` - Швидкий старт за 10 хвилин
- `backend/README.md` - Backend документація

### Детальні гайди:
- `DJANGO_DEPLOY_GUIDE.md` - Повна інструкція деплою
- `BACKEND_COMPARISON.md` - Порівняння backend рішень
- `SECURITY_COMPARISON.md` - Безпека frontend vs backend

---

## 🔄 Workflow розробки

### Локальна розробка:

```bash
# Термінал 1: Backend
cd backend
venv\Scripts\activate
python manage.py runserver 8000

# Термінал 2: Frontend
npm run dev
```

### Деплой змін:

```bash
# Backend зміни
cd backend
git add .
git commit -m "Update backend"
git push
# Railway автодеплоїть

# Frontend зміни
git add .
git commit -m "Update frontend"
git push
# Vercel автодеплоїть
```

---

## ✅ Чеклист для продакшену

### Backend:
- [ ] `DEBUG=False` встановлено
- [ ] `DJANGO_SECRET_KEY` згенеровано
- [ ] `ALLOWED_HOSTS` налаштовано
- [ ] `CORS_ALLOWED_ORIGINS` налаштовано
- [ ] API ключ додано в Railway
- [ ] Міграції запущені
- [ ] Health check працює

### Frontend:
- [ ] `VITE_DJANGO_BACKEND_URL` встановлено
- [ ] Build проходить без помилок
- [ ] AI чат працює
- [ ] CORS налаштовано
- [ ] Всі endpoints працюють

---

## 🆘 Troubleshooting

### Backend не запускається:
```bash
cd backend
python manage.py check
python manage.py migrate
```

### CORS Error:
Додайте ваш frontend URL в `backend/.env`:
```env
CORS_ALLOWED_ORIGINS=https://your-frontend.vercel.app,http://localhost:5173
```

### API key not configured:
Додайте в `backend/.env`:
```env
OPENROUTER_API_KEY=sk-or-v1-ваш_ключ
```

---

## 📊 Статистика проєкту

- **Frontend:** ~15,000 lines of code
- **Backend:** ~500 lines of Python
- **API Endpoints:** 3
- **Pages:** 10+
- **Components:** 30+

---

## 🎯 Roadmap

### Поточна версія (v1.0):
- ✅ React Frontend
- ✅ Django Backend
- ✅ AI Chat
- ✅ Agent recommendations
- ✅ Playstyle analysis

### Майбутні features:
- [ ] User authentication
- [ ] Save chat history
- [ ] Match statistics
- [ ] Team builder
- [ ] Agent tier lists

---

## 👥 Команда

**Frontend:** React + TypeScript  
**Backend:** Django + Python  
**AI:** OpenRouter API  
**Design:** Material-UI  

---

## 📄 Ліцензія

MIT License - використовуйте вільно!

---

## 🙏 Подяки

- OpenRouter AI за API
- Railway за hosting
- Vercel за frontend hosting
- Riot Games за VALORANT

---

## 🚀 Готово до деплою!

Професійна full-stack архітектура з безпечним backend!

**Frontend + Backend + AI = Full Stack Success! 🎉**
