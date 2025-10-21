# ⚠️ ВАЖЛИВО: Оновити .env файл

## 🔄 Зміни в змінних середовища

API ключ тепер зберігається **БЕЗ VITE_** префіксу для безпеки!

---

## 📝 Що потрібно зробити

### 1. Відкрийте файл `.env`

### 2. Видаліть або закоментуйте старі змінні:

```env
# Видалити або закоментувати:
# VITE_OPENROUTER_API_KEY=...
# VITE_AI_MODEL=...
```

### 3. Додайте нові змінні (БЕЗ VITE_):

```env
# 🔒 БЕЗПЕЧНІ серверні змінні (БЕЗ VITE_)
OPENROUTER_API_KEY=your_openrouter_api_key_here
AI_MODEL=meta-llama/llama-3.2-3b-instruct:free
```

### 4. Замініть `your_openrouter_api_key_here` на ваш справжній ключ

Якщо у вас ще немає ключа:
1. Перейдіть на https://openrouter.ai/keys
2. Зареєструйтесь (безкоштовно)
3. Створіть API ключ
4. Скопіюйте його (починається з `sk-or-v1-...`)

---

## ✅ Приклад правильного .env

```env
# ======================================
# VALORANT HUB - Frontend Environment Variables
# ======================================

# 🐍 Django Backend URL
VITE_DJANGO_BACKEND_URL=http://localhost:8000

# 🌐 КЛІЄНТСЬКІ ЗМІННІ (з префіксом VITE_)
VITE_DEFAULT_AI_MODEL=meta-llama/llama-3.2-3b-instruct:free

# 🔒 СЕРВЕРНІ ЗМІННІ (БЕЗ VITE_ префіксу)
# Ці змінні НЕ доступні в браузері - це безпечно!
OPENROUTER_API_KEY=sk-or-v1-ваш_реальний_ключ_тут
AI_MODEL=meta-llama/llama-3.2-3b-instruct:free
```

---

## 🔄 Після оновлення .env

### Перезапустіть dev сервер:

```powershell
# Ctrl+C для зупинки
# Потім:
npm run dev
```

---

## ✅ Перевірка

Чат має працювати через `/api/chat` endpoint.

Щоб перевірити що все правильно:
1. Відкрийте http://localhost:5173
2. F12 → Network tab
3. Напишіть щось у чат
4. Має бути запит до `/api/chat` (не до openrouter.ai)

---

## 🆘 Проблеми?

Якщо чат не працює:
1. Перевірте що `.env` оновлено правильно
2. Перезапустіть dev сервер
3. Перевірте що API ключ правильний

---

**Готово! Тепер ваш API ключ захищено! 🔒**
