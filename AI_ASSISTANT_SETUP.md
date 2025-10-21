# 🤖 Налаштування AI Асистента для VALORANT HUB

## 📋 Огляд

AI Асистент інтегровано в VALORANT HUB використовуючи **OpenRouter API** з безкоштовними моделями. Асистент допомагає гравцям з питаннями про агентів, мапи, зброю та стратегії VALORANT.

## ✅ Що вже зроблено

1. ✅ Встановлено пакет `lucide-react` для іконок
2. ✅ Створено AI сервіс (`src/services/aiService.ts`)
3. ✅ Створено компонент ChatAssistant (`src/components/ChatAssistant.tsx`)
4. ✅ Інтегровано чат-асистента в `App.tsx`
5. ✅ Додано анімації та сучасний UI

## 🔑 Крок 1: Отримання OpenRouter API ключа

1. Перейдіть на [https://openrouter.ai/keys](https://openrouter.ai/keys)
2. Зареєструйтесь або увійдіть в акаунт
3. Створіть новий API ключ (це **безкоштовно**)
4. Скопіюйте ваш API ключ

## ⚙️ Крок 2: Локальне налаштування

1. Створіть файл `.env` в корені проекту:
```bash
cp .env.example .env
```

2. Відредагуйте `.env` файл та додайте ваш OpenRouter API ключ:
```env
VITE_OPENROUTER_API_KEY=sk-or-v1-ваш_ключ_тут
VITE_AI_MODEL=meta-llama/llama-3.2-3b-instruct:free
```

3. Запустіть проект локально:
```bash
npm install
npm run dev
```

4. Відкрийте браузер за адресою `http://localhost:5173` та перевірте чат-асистента (кнопка в правому нижньому куті)

## 🚀 Крок 3: Деплой на Vercel

### 3.1 Підготовка GitHub репозиторію

Переконайтесь, що `.env` файл додано в `.gitignore` (НЕ публікуйте API ключі!):
```bash
git add .
git commit -m "Add AI Assistant with OpenRouter integration"
git push origin main
```

### 3.2 Деплой на Vercel

1. Перейдіть на [https://vercel.com](https://vercel.com)
2. Увійдіть через GitHub
3. Натисніть **"Add New Project"**
4. Виберіть ваш репозиторій `Valorant-HUB`
5. Налаштуйте проект:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

6. **ВАЖЛИВО**: Додайте Environment Variables:
   - Натисніть **"Environment Variables"**
   - Додайте:
     ```
     VITE_OPENROUTER_API_KEY = sk-or-v1-ваш_ключ_тут
     VITE_AI_MODEL = meta-llama/llama-3.2-3b-instruct:free
     VITE_DJANGO_BACKEND_URL = http://localhost:8000
     ```

7. Натисніть **"Deploy"**
8. Дочекайтесь завершення деплою (2-3 хвилини)
9. Отримаєте URL типу: `https://valorant-hub-xxx.vercel.app`

### 3.3 Оновлення змінних середовища (якщо потрібно)

1. В Vercel dashboard перейдіть в **Settings > Environment Variables**
2. Оновіть або додайте нові змінні
3. Перейдіть в **Deployments**
4. Натисніть **"Redeploy"** на останньому деплої

## 🆓 Безкоштовні моделі OpenRouter

Можна використовувати ці безкоштовні моделі (змініть `VITE_AI_MODEL`):

- `meta-llama/llama-3.2-3b-instruct:free` (рекомендовано, швидка)
- `google/gemini-2.0-flash-exp:free` (дуже швидка, хороша якість)
- `microsoft/phi-3-mini-128k-instruct:free` (велике context window)
- `qwen/qwen-2-7b-instruct:free` (хороша для складних запитів)

## 🎨 Функції AI Асистента

- ✅ Модальне вікно чату в правому нижньому куті
- ✅ Можливість мінімізувати/закривати чат
- ✅ Підтримка контексту розмови
- ✅ Індикатор завантаження
- ✅ Обробка помилок
- ✅ Сучасний Material-UI дизайн в стилі VALORANT
- ✅ Анімації та плавні переходи
- ✅ Адаптивний під теми гри

## 🔧 Технічний стек

- **Frontend Framework**: React + TypeScript
- **UI Library**: Material-UI (MUI)
- **Icons**: Lucide React
- **Build Tool**: Vite
- **AI Provider**: OpenRouter
- **AI Models**: LLaMA 3.2, Gemini, Phi-3, Qwen (безкоштовні)
- **Deployment**: Vercel

## 📝 Структура файлів

```
src/
├── components/
│   └── ChatAssistant.tsx       # UI компонент чату
├── services/
│   └── aiService.ts            # Сервіс для роботи з OpenRouter API
├── App.tsx                     # Інтеграція чату в додаток
└── index.css                   # Стилі та анімації
```

## 🐛 Усунення проблем

### Помилка: "OpenRouter API ключ не налаштовано"
- Перевірте, що ви додали `VITE_OPENROUTER_API_KEY` в `.env` (локально) або в Vercel Environment Variables
- Переконайтесь, що назва змінної починається з `VITE_`
- Перезапустіть dev сервер після зміни `.env`

### Чат не відкривається
- Перевірте консоль браузера на помилки (F12 > Console)
- Переконайтесь, що всі пакети встановлені: `npm install`

### Повільні відповіді
- Спробуйте іншу безкоштовну модель (наприклад, `google/gemini-2.0-flash-exp:free`)
- Перевірте інтернет з'єднання

## 📚 Додаткові ресурси

- [OpenRouter Documentation](https://openrouter.ai/docs)
- [OpenRouter Free Models](https://openrouter.ai/models?pricing=free)
- [Vercel Deployment Docs](https://vercel.com/docs)
- [Material-UI Documentation](https://mui.com/)

## ✨ Готово!

Тепер ваш VALORANT HUB має повнофункціонального AI асистента! 🎮🤖
