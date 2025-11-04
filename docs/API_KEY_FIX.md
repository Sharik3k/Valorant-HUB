# 🔑 API Key Fix Required

## 🚨 **Проблема:**
```
API Error: Error: User not found
```

## **Причина:**
Використовується тестовий/фейковий API ключ, який не дійсний.

## 🔧 **Як виправити:**

### **Крок 1: Отримати справжній ключ**
1. Перейдіть: https://openrouter.ai/keys
2. Увійдіть через Google/GitHub (безкоштовно)
3. Натисніть **"Create Key"**
4. Дайте назву: "Valorant HUB"
5. Скопіюйте ключ (починається з `sk-or-v1-`)

### **Крок 2: Додати на Vercel**
```bash
vercel env add OPENROUTER_API_KEY
# Вставте справжній ключ коли запитає
```

### **Крок 3: Редеплой**
```bash
vercel --prod
```

## 🧪 **Перевірити ключ:**
Справжній ключ виглядає так:
```
sk-or-v1-1234567890abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnop
```

**Фейковий ключ** (який був раніше):
```
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
```

## ⚡ **Швидка перевірка:**
Після оновлення ключа:
```bash
curl -X POST https://valoranthub-devs-github-speckit-37lwu9km2.vercel.app/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "test"}'
```

## ✅ **Очікуваний результат:**
Замість "User not found" повинна бути AI відповідь або помилка валідації.

---

**Важливо:** Ніколи не діліться справжнім API ключем!
