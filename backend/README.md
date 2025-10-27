# Valorant HUB AI Server

Бекенд-сервер для Valorant HUB з використанням OpenAI function calling та structured output.

## Функції

Сервер підтримує 5 основних функцій, які AI може викликати автоматично:

1. **get_agents_for_map(map_name)** - Рекомендує агентів для карти
2. **generate_strategy(map, style)** - Створює стратегію для команди
3. **get_agent_stats(map)** - Показує winrate агентів на карті
4. **get_team_balance(team)** - Аналізує команду і радить, кого додати
5. **get_loadout(agent, round_type)** - Пропонує зброю та утиліти

## Встановлення

```bash
# Встановити залежності
npm install

# Створити .env файл з API ключем
cp .env.example .env
# Додати ваш OpenAI API ключ в .env
```

## Запуск

```bash
# Розробка
npm run dev

# Білд
npm run build

# Продакшн
npm start
```

## API Ендпоінти

### POST /api/chat

Приймає повідомлення користувача і повертає JSON відповідь від AI.

**Request:**
```json
{
  "message": "Порадь агентів для Ascent"
}
```

**Response:**
```json
{
  "map": "Ascent",
  "recommended_agents": [
    {"agent": "Jett", "role": "Duelist"},
    {"agent": "Omen", "role": "Controller"},
    {"agent": "Sova", "role": "Initiator"},
    {"agent": "Killjoy", "role": "Sentinel"}
  ]
}
```

## Приклади запитів

- "Порадь агентів для Ascent" → викликає get_agents_for_map
- "Створи агресивну стратегію для Bind" → викликає generate_strategy
- "Хто має найвищий winrate на Haven?" → викликає get_agent_stats
- "Моя команда — Jett, Killjoy, Sova. Кого ще додати?" → викликає get_team_balance
- "Що купити Jett на економічному раунді?" → викликає get_loadout
