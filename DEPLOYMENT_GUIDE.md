# 🚀 Інструкція з деплою VALORANT HUB

Ваш проєкт тепер налаштований для деплою на **Vercel** або **Netlify**.

## 📦 Варіант 1: Vercel (Рекомендовано)

### Чому Vercel?
- ✅ Найшвидший хостинг для Vite/React
- ✅ Автоматичні деплої з GitHub
- ✅ Безкоштовний SSL сертифікат
- ✅ Глобальний CDN
- ✅ Безкоштовний план для особистих проєктів

### Кроки для деплою:

1. **Зареєструйтесь на Vercel**
   - Перейдіть на [vercel.com](https://vercel.com)
   - Увійдіть через GitHub акаунт

2. **Імпортуйте проєкт**
   - Натисніть "Add New Project"
   - Виберіть репозиторій `Sharik3k/Valorant-HUB`
   - Vercel автоматично визначить Vite framework

3. **Налаштуйте змінні середовища (якщо потрібно)**
   - В розділі "Environment Variables" додайте всі змінні з `.env`
   - Наприклад: `VITE_API_KEY`, `VITE_OPENROUTER_API_KEY` тощо

4. **Деплой**
   - Натисніть "Deploy"
   - Очікуйте 2-3 хвилини
   - Готово! 🎉

### Автоматичні деплої:
- Кожен push в `main` або `master` автоматично деплоїться
- Pull requests створюють preview деплої

---

## 📦 Варіант 2: Netlify

### Чому Netlify?
- ✅ Дуже простий у використанні
- ✅ Drag & Drop деплой
- ✅ Безкоштовний план
- ✅ Form handling та Functions

### Кроки для деплою:

1. **Зареєструйтесь на Netlify**
   - Перейдіть на [netlify.com](https://netlify.com)
   - Увійдіть через GitHub

2. **Імпортуйте проєкт**
   - "Add new site" → "Import an existing project"
   - Виберіть GitHub та репозиторій
   - Netlify автоматично визначить налаштування з `netlify.toml`

3. **Налаштування деплою (автоматично заповнені)**
   - Build command: `npm run build`
   - Publish directory: `dist`

4. **Додайте змінні середовища**
   - Site settings → Environment variables
   - Додайте всі змінні з `.env`

5. **Деплой**
   - Натисніть "Deploy site"
   - Очікуйте 2-3 хвилини

---

## 🔧 Локальне тестування перед деплоєм

```bash
# Встановіть залежності (якщо ще не встановлені)
npm install

# Зберіть проєкт
npm run build

# Перевірте білд локально
npm run preview
```

---

## 🌐 Власний домен (опціонально)

### Для Vercel:
1. Settings → Domains
2. Додайте ваш домен
3. Налаштуйте DNS записи згідно інструкцій

### Для Netlify:
1. Domain settings → Add custom domain
2. Налаштуйте DNS записи

---

## 📝 Важливі зміни

### Що було змінено:
1. ✅ `vite.config.ts` - змінено `base` з `/Valorant-HUB/` на `/`
2. ✅ Створено `vercel.json` - конфігурація для Vercel
3. ✅ Створено `netlify.toml` - конфігурація для Netlify
4. ✅ `package.json` - видалено скрипти `gh-pages`

### Старий хостинг (GitHub Pages):
- Було: `https://Sharik3k.github.io/Valorant-HUB`
- Проблеми: повільніший, обмежений функціонал

### Новий хостинг (Vercel/Netlify):
- Буде: `https://valorant-hub.vercel.app` (або ваш власний домен)
- Переваги: швидше, більше можливостей, кращий SEO

---

## 🆘 Підтримка

Якщо виникнуть проблеми:
- Vercel: [vercel.com/docs](https://vercel.com/docs)
- Netlify: [docs.netlify.com](https://docs.netlify.com)

---

## 🎯 Що далі?

1. Деплойте на Vercel або Netlify
2. Отримайте URL вашого сайту
3. Оновіть посилання в README та соціальних мережах
4. Насолоджуйтесь швидким та надійним хостингом! 🚀
