# 🐍 Django Backend для Valorant HUB

Безпечний Django REST API backend для AI чату з захищеним OpenRouter API ключем.

## 🚀 Швидкий старт (локально)

### 1. Створіть віртуальне середовище

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate
```

### 2. Встановіть залежності

```bash
pip install -r requirements.txt
```

### 3. Створіть .env файл

```bash
copy .env.example .env
```

Відредагуйте `.env`:
```env
DJANGO_SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:5173
OPENROUTER_API_KEY=sk-or-v1-your_api_key_here
APP_URL=http://localhost:5173
```

### 4. Запустіть міграції

```bash
python manage.py migrate
```

### 5. Створіть суперюзера (опціонально)

```bash
python manage.py createsuperuser
```

### 6. Запустіть сервер

```bash
python manage.py runserver 8000
```

Backend доступний на http://localhost:8000

## 📡 API Endpoints

### POST /api/chat/
```json
{
  "messages": [{"role": "user", "content": "Hello"}],
  "model": "meta-llama/llama-3.2-3b-instruct:free",
  "temperature": 0.7,
  "max_tokens": 2000
}
```

### GET /api/models/
Повертає список доступних AI моделей

### GET /api/health/
Health check endpoint

## 🌐 Деплой

### Railway (рекомендовано)
1. Push код на GitHub
2. Import проєкт на Railway.app
3. Додайте змінні оточення з `.env.example`
4. Deploy автоматично!

### Heroku
1. Встановіть Heroku CLI
2. `heroku create your-app-name`
3. `heroku config:set OPENROUTER_API_KEY=your_key`
4. `git push heroku main`

Детальніше: `../DJANGO_DEPLOY_GUIDE.md`

## 🔒 Безпека

✅ API ключ ТІЛЬКИ на сервері  
✅ CORS налаштовано  
✅ Django CSRF protection  
✅ Secure headers  

## 📚 Технології

- Django 4.2
- Django REST Framework
- django-cors-headers
- Gunicorn (production server)
- WhiteNoise (static files)
