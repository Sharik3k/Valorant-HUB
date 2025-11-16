/**
 * Отримує статистику гравця Valorant (ранг, ELO) за допомогою API henrikdev.xyz.
 * @param {object} args - Аргументи функції.
 * @param {string} args.riotId - Riot ID гравця у форматі "Name#TAG".
 * @param {string} [args.region='eu'] - Регіон гравця (наприклад, 'eu', 'na', 'ap').
 * @returns {Promise<string>} JSON-рядок зі статистикою гравця.
 */
const getPlayerStats = async ({ riotId, region = 'eu' }) => {
  if (!riotId || !riotId.includes('#')) {
    return JSON.stringify({ error: "Неправильний формат Riot ID. Використовуйте 'Ім'я#TAG'." });
  }

  const [name, tag] = riotId.split('#');
  const reg = region.toLowerCase();

  try {
    const base = 'https://api.henrikdev.xyz/valorant';
    const mmrUrl = `${base}/v1/mmr/${encodeURIComponent(reg)}/${encodeURIComponent(name)}/${encodeURIComponent(tag)}`;
    
    const mmrResp = await fetch(mmrUrl);
    if (!mmrResp.ok) {
      const errorData = await mmrResp.json().catch(() => ({}));
      console.error('Помилка MMR API:', mmrResp.status, errorData);
      return JSON.stringify({ error: `Не вдалося отримати ранг гравця. Статус: ${mmrResp.status}` });
    }
    const mmrData = await mmrResp.json();

    // Спрощена відповідь для AI моделі
    const simplifiedStats = {
      riotId: `${mmrData.data.name}#${mmrData.data.tag}`,
      region: reg,
      rank: mmrData.data.currenttierpatched,
      elo: mmrData.data.ranking_in_tier,
    };

    return JSON.stringify(simplifiedStats);

  } catch (error) {
    console.error('Помилка при отриманні статистики Valorant:', error);
    return JSON.stringify({ error: 'Внутрішня помилка при отриманні статистики.' });
  }
};

/**
 * Виконує гібридний пошук (агенти + гравці) Valorant.
 * @param {object} args - Аргументи функції.
 * @param {string} args.query - Пошуковий запит.
 * @returns {Promise<string>} JSON-рядок з результатами пошуку.
 */
const hybridSearch = async ({ query }) => {
  try {
    const response = await fetch('http://localhost:3001/api/search/hybrid', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, topK: 5 }),
    });
    if (!response.ok) {
      return JSON.stringify({ error: `Помилка гібридного пошуку. Статус: ${response.status}` });
    }
    const results = await response.json();
    return JSON.stringify(results);
  } catch (error) {
    return JSON.stringify({ error: 'Не вдалося підключитися до сервісу пошуку. Можливо сервер не запущений.' });
  }
};

// Словник доступних інструментів
const availableTools = {
  getPlayerStats,
  hybridSearch,
};

// Специфікація інструментів для моделі OpenAI
const toolDefinitions = [
  {
    name: 'getPlayerStats',
    description: 'Отримати точну статистику гравця Valorant (ранг, ELO) за його унікальним Riot ID.',
    parameters: {
      type: 'object',
      properties: {
        riotId: {
          type: 'string',
          description: 'Riot ID гравця, наприклад, "PlayerName#TAG".',
        },
        region: {
          type: 'string',
          description: 'Регіон гравця (наприклад, "eu", "na", "ap"). За замовчуванням "eu".',
        },
      },
      required: ['riotId'],
    },
  },
  {
    name: 'hybridSearch',
    description: 'Знайти агентів Valorant або професійних гравців за описом. Працює для пошуку агентів (наприклад, "агресивний дуелянт"), гравців (наприклад, "гравці з Fnatic") або обох.',
    parameters: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Природномовний опис того, що потрібно знайти (агенти, гравці, команди).',
        },
      },
      required: ['query'],
    },
  },
];

module.exports = {
  availableTools,
  toolDefinitions,
};
