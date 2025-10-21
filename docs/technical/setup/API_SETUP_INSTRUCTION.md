# 🔑 Як Підключити API Ключ

## Швидка Інструкція

### Крок 1: Отримай API Ключ

1. Перейди на **https://openrouter.ai**
2. Зареєструйся (можна через GitHub)
3. Перейди в розділ **API Keys**: https://openrouter.ai/keys
4. Натисни **"Create Key"**
5. Скопіюй ключ (виглядає так: `sk-or-v1-...`)

### Крок 2: Вставити Ключ в Код

Відкрий файл:
```
src/services/openrouter.ts
```

Знайди рядок 7:
```typescript
const API_KEY = 'YOUR_API_KEY_HERE';
```

Заміни на свій ключ:
```typescript
const API_KEY = 'sk-or-v1-твій-ключ-тут';
```

### Крок 3: Запустити

```bash
npm run dev
```

Відкрий http://localhost:5173 і чат готовий до роботи!

---

## 🆓 Безкоштовна Модель

За замовчуванням використовується **безкоштовна** модель:
```
meta-llama/llama-3.1-8b-instruct:free
```

Не потрібно платити! Працює без кредитів.

---

## 🔧 Зміна Моделі (Опціонально)

Якщо хочеш використовувати іншу модель, відкрий:
```
src/services/openrouter.ts
```

Рядок 10:
```typescript
const DEFAULT_MODEL = 'meta-llama/llama-3.1-8b-instruct:free';
```

### Інші Безкоштовні Моделі:
```typescript
// Gemini від Google
const DEFAULT_MODEL = 'google/gemini-flash-1.5';

// Llama від Meta
const DEFAULT_MODEL = 'meta-llama/llama-3.1-8b-instruct:free';
```

### Платні Моделі (потрібні кредити):
```typescript
// GPT-3.5 Turbo
const DEFAULT_MODEL = 'openai/gpt-3.5-turbo';

// GPT-4
const DEFAULT_MODEL = 'openai/gpt-4';

// Claude 3
const DEFAULT_MODEL = 'anthropic/claude-3-haiku';
```

---

## ⚠️ Важливо

- **НЕ КОМІТЬТЕ** файл з API ключем в Git!
- API ключ вже захардкоджений в коді
- Користувачі не можуть міняти ключ через UI
- Це зроблено для простоти

---

## 🎯 Що Далі

Після підключення API:
1. ✅ Чат буде працювати з AI
2. ✅ Аналіз стилю гри буде давати рекомендації
3. ✅ Експорт та збереження чату працюватиме

---

## 📞 Допомога

Якщо щось не працює:
- Перевір чи правильно скопійований ключ
- Перевір чи немає зайвих пробілів
- Перезапусти dev сервер (`npm run dev`)

**Готово!** 🚀
