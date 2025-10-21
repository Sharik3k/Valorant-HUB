# 🔧 Усунення проблем

## ✅ Виправлені помилки

### 1. ✅ TypeScript Error TS2367 (ВИПРАВЛЕНО)

**Помилка:**
```
api/chat.ts(33,7): error TS2367: This comparison appears to be unintentional 
because the types '"POST"' and '"OPTIONS"' have no overlap.
```

**Причина:**
Неправильний порядок перевірки HTTP методів - OPTIONS перевірявся після відхилення всіх не-POST запитів.

**Рішення:**
```typescript
// ❌ БУЛО (неправильно):
if (req.method !== 'POST') {
  return res.status(405).json({ error: 'Method not allowed' });
}
if (req.method === 'OPTIONS') {  // Ніколи не виконається!
  return res.status(200).end();
}

// ✅ СТАЛО (правильно):
if (req.method === 'OPTIONS') {  // Спочатку OPTIONS
  return res.status(200).end();
}
if (req.method !== 'POST') {     // Потім POST
  return res.status(405).json({ error: 'Method not allowed' });
}
```

**Статус:** ✅ Виправлено і закомічено

---

### 2. ⚠️ Vite CJS API Warning (не критично)

**Попередження:**
```
The CJS build of Vite's Node API is deprecated.
```

**Причина:**
Застаріла версія CommonJS API в Vite 5.x

**Вплив:**
- Не впливає на роботу додатку
- Просто попередження, не помилка
- Буде видалено в Vite 6.x

**Рішення (опціонально):**
Можна ігнорувати або оновити до останньої версії Vite у майбутньому.

**Статус:** ⚠️ Можна ігнорувати

---

## 🚀 Перевірка готовності до деплою

### Чеклист перед деплоєм:

```
□ TypeScript компілюється без помилок (npm run build)
□ Локально працює (npm run dev)
□ API ключ в .env (OPENROUTER_API_KEY)
□ Файл api/chat.ts існує і закомічений
□ package.json має @vercel/node
□ .gitignore містить .env
```

### Команди для перевірки:

```powershell
# 1. Перевірка TypeScript
npm run build

# 2. Локальний запуск
npm run dev

# 3. Перевірка git статусу
git status

# 4. Перевірка що api/chat.ts в git
git ls-files api/
```

---

## 🌐 Налаштування Vercel

### Environment Variables (ОБОВ'ЯЗКОВО!)

На Vercel потрібно додати ці змінні **БЕЗ VITE_ префіксу**:

| Variable | Value | Required |
|----------|-------|----------|
| `OPENROUTER_API_KEY` | `sk-or-v1-ваш_ключ` | ✅ Так |
| `AI_MODEL` | `meta-llama/llama-3.2-3b-instruct:free` | ✅ Так |

### Як додати:

1. https://vercel.com/dashboard
2. Обрати проект → Settings → Environment Variables
3. Додати обидві змінні
4. Зберегти
5. Deployments → Redeploy

---

## 🐛 Типові помилки при деплої

### Помилка: "Build failed"

**Можливі причини:**
1. TypeScript помилки
2. Відсутні залежності
3. Неправильний Node.js версія

**Рішення:**
```powershell
# Перевірити локально
npm run build

# Якщо помилка - виправити код
# Якщо успішно - закомітити і push
git add .
git commit -m "Fix build errors"
git push
```

---

### Помилка: "API key not configured"

**Причина:**
Environment Variables не налаштовані на Vercel

**Рішення:**
1. Vercel Dashboard → Settings → Environment Variables
2. Додати `OPENROUTER_API_KEY`
3. Додати `AI_MODEL`
4. Redeploy

**Перевірка:**
```
Vercel Logs → повинно бути:
✓ Environment variables loaded
```

---

### Помилка: "404 /api/chat"

**Причина:**
Файл `api/chat.ts` не знайдено на Vercel

**Рішення:**
```powershell
# Перевірити що файл в git
git ls-files api/

# Якщо немає - додати
git add api/chat.ts
git commit -m "Add serverless function"
git push

# На Vercel - Redeploy
```

---

### Помилка: "500 Internal Server Error"

**Можливі причини:**
1. API ключ неправильний
2. Помилка в коді api/chat.ts
3. OpenRouter API недоступний

**Рішення:**
```powershell
# Переглянути логи
vercel logs

# Або в Dashboard:
Vercel → Your Project → Deployments → Click deployment → View Function Logs
```

---

### Помилка: "CORS error"

**Причина:**
CORS headers не налаштовані

**Рішення:**
У `api/chat.ts` має бути:
```typescript
res.setHeader('Access-Control-Allow-Origin', '*');
res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST,PUT');
```

**Перевірка:**
```javascript
// F12 → Network → /api/chat → Response Headers
Access-Control-Allow-Origin: *  ✓
```

---

## 🔍 Діагностика

### Локальна перевірка:

```powershell
# 1. Build
npm run build
# Очікується: ✓ built in X.XXs

# 2. Dev server
npm run dev
# Очікується: VITE ready in XXX ms

# 3. Тест API
# Відкрити http://localhost:5173
# F12 → Network → Написати в чат
# Має бути: POST /api/chat → 200 OK
```

### Vercel перевірка:

```powershell
# 1. Статус деплою
vercel ls

# 2. Логи
vercel logs --follow

# 3. Env variables
vercel env ls
# Має бути: OPENROUTER_API_KEY, AI_MODEL
```

---

## 📊 Таблиця помилок

| Код | Помилка | Причина | Рішення |
|-----|---------|---------|---------|
| TS2367 | Type comparison error | Неправильна логіка | ✅ Виправлено |
| 404 | /api/chat not found | Файл не в git | git add api/chat.ts |
| 401 | Unauthorized | Неправильний API key | Перевірити ключ |
| 405 | Method not allowed | Не POST запит | Перевірити клієнт |
| 500 | Internal server | Помилка в коді | Переглянути логи |
| CORS | CORS error | Немає headers | Додати CORS headers |

---

## ✅ Перевірка що все працює

### Локально:
```
□ npm run build - без помилок
□ npm run dev - запускається
□ http://localhost:5173 - відкривається
□ Чат відповідає на повідомлення
□ F12 → Network → /api/chat → 200 OK
□ Console - без помилок
```

### На Vercel:
```
□ Build successful
□ Environment variables налаштовані
□ Сайт відкривається
□ Чат відповідає на повідомлення
□ F12 → Network → /api/chat → 200 OK
□ API ключ не видно в браузері
```

---

## 🆘 Швидка допомога

### Якщо нічого не працює:

1. **Локально:**
   ```powershell
   rm -rf node_modules package-lock.json
   npm install
   npm run build
   npm run dev
   ```

2. **На Vercel:**
   - Settings → General → Node.js Version → 18.x
   - Environment Variables → Перевірити всі змінні
   - Deployments → Redeploy

3. **Якщо все ще не працює:**
   - Переглянути Vercel Logs
   - Перевірити Console в браузері (F12)
   - Звірити з `api/chat.ts` чи немає помилок

---

## 📚 Корисні команди

```powershell
# Локальна діагностика
npm run build                  # Перевірка TypeScript
npm run dev                    # Запуск dev сервера
npm list @vercel/node         # Перевірка залежностей

# Git
git status                     # Статус змін
git ls-files api/             # Файли в git
git push origin main          # Відправити зміни

# Vercel
vercel                        # Deploy
vercel logs                   # Логи
vercel env ls                 # Environment variables
vercel --prod                 # Production deploy
```

---

## 🎯 Підсумок

### ✅ Виправлено:
- TypeScript error TS2367
- Логіка перевірки HTTP методів
- Build тепер успішний

### ✅ Перевірено:
- npm run build - успішно
- Код закомічено і на GitHub

### 📋 Наступні кроки:
1. Додати Environment Variables на Vercel
2. Redeploy
3. Протестувати

---

**Всі критичні помилки виправлено! Готово до деплою! 🚀**
