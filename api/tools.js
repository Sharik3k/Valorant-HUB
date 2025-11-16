/**
 * Отримує детальну статистику гравця Valorant з henrikdev.xyz API (аналог Tracker.gg)
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
    
    // Отримуємо дані паралельно для швидкості
    const [mmrResp, matchesResp, lifetimeResp] = await Promise.allSettled([
      fetch(`${base}/v1/mmr/${encodeURIComponent(reg)}/${encodeURIComponent(name)}/${encodeURIComponent(tag)}`),
      fetch(`${base}/v3/matches/${encodeURIComponent(reg)}/${encodeURIComponent(name)}/${encodeURIComponent(tag)}?size=10`),
      fetch(`${base}/v1/lifetime-matches/${encodeURIComponent(reg)}/${encodeURIComponent(name)}/${encodeURIComponent(tag)}?mode=competitive&size=1`)
    ]);

    // Обробка MMR даних
    let mmrData = null;
    if (mmrResp.status === 'fulfilled' && mmrResp.value.ok) {
      mmrData = await mmrResp.value.json();
    }

    // Обробка матчів
    let matchesData = null;
    if (matchesResp.status === 'fulfilled' && matchesResp.value.ok) {
      matchesData = await matchesResp.value.json();
    }

    // Обробка загальної статистики
    let lifetimeData = null;
    if (lifetimeResp.status === 'fulfilled' && lifetimeResp.value.ok) {
      lifetimeData = await lifetimeResp.value.json();
    }

    if (!mmrData || !mmrData.data) {
      return JSON.stringify({ 
        error: `Не вдалося отримати статистику гравця. Перевірте Riot ID та регіон.` 
      });
    }

    // Розрахунок статистики з останніх матчів
    let recentStats = {
      wins: 0,
      losses: 0,
      totalKills: 0,
      totalDeaths: 0,
      totalAssists: 0,
      totalRounds: 0,
      avgACS: 0,
      headshotPercent: 0,
      agents: {}
    };

    if (matchesData && matchesData.data && matchesData.data.length > 0) {
      const matches = matchesData.data;
      let totalACS = 0;
      let totalHS = 0;
      let totalShots = 0;

      matches.forEach(match => {
        if (match.metadata && match.metadata.mode === 'Competitive') {
          const player = match.players?.all_players?.find(p => 
            p.name.toLowerCase() === name.toLowerCase() && 
            p.tag.toLowerCase() === tag.toLowerCase()
          );

          if (player) {
            if (match.teams && match.teams.red && match.teams.blue) {
              const playerTeam = player.team === 'Red' ? match.teams.red : match.teams.blue;
              const won = playerTeam.has_won;
              if (won) recentStats.wins++;
              else recentStats.losses++;
            }

            recentStats.totalKills += player.stats?.kills || 0;
            recentStats.totalDeaths += player.stats?.deaths || 0;
            recentStats.totalAssists += player.stats?.assists || 0;
            recentStats.totalRounds += match.metadata?.rounds_played || 0;
            
            const acs = player.stats?.score || 0;
            totalACS += acs;
            
            const hs = player.stats?.headshots || 0;
            const shots = player.stats?.bodyshots || 0;
            totalHS += hs;
            totalShots += (hs + shots);

            // Статистика по агентах
            const agentName = player.character || 'Unknown';
            if (!recentStats.agents[agentName]) {
              recentStats.agents[agentName] = { matches: 0, wins: 0 };
            }
            recentStats.agents[agentName].matches++;
            if (match.teams) {
              const playerTeam = player.team === 'Red' ? match.teams.red : match.teams.blue;
              if (playerTeam.has_won) recentStats.agents[agentName].wins++;
            }
          }
        }
      });

      const matchCount = matches.length;
      if (matchCount > 0) {
        recentStats.avgACS = Math.round(totalACS / matchCount);
        recentStats.headshotPercent = totalShots > 0 ? Math.round((totalHS / totalShots) * 100) : 0;
      }
    }

    // Формуємо детальну відповідь
    const detailedStats = {
      player: {
        riotId: `${mmrData.data.name}#${mmrData.data.tag}`,
        region: reg,
      },
      rank: {
        current: mmrData.data.currenttierpatched || 'Unranked',
        elo: mmrData.data.ranking_in_tier || 0,
        mmr: mmrData.data.elo || 0,
        peakRank: mmrData.data.old || null,
      },
      recentMatches: {
        total: recentStats.wins + recentStats.losses,
        wins: recentStats.wins,
        losses: recentStats.losses,
        winRate: recentStats.wins + recentStats.losses > 0 
          ? Math.round((recentStats.wins / (recentStats.wins + recentStats.losses)) * 100) 
          : 0,
      },
      performance: {
        kdRatio: recentStats.totalDeaths > 0 
          ? (recentStats.totalKills / recentStats.totalDeaths).toFixed(2) 
          : '0.00',
        avgACS: recentStats.avgACS,
        headshotPercent: recentStats.headshotPercent,
        kills: recentStats.totalKills,
        deaths: recentStats.totalDeaths,
        assists: recentStats.totalAssists,
      },
      agents: Object.entries(recentStats.agents)
        .map(([agent, stats]) => ({
          name: agent,
          matches: stats.matches,
          wins: stats.wins,
          winRate: stats.matches > 0 ? Math.round((stats.wins / stats.matches) * 100) : 0,
        }))
        .sort((a, b) => b.matches - a.matches)
        .slice(0, 5), // Топ 5 агентів
    };

    return JSON.stringify(detailedStats);

  } catch (error) {
    console.error('Помилка при отриманні статистики Valorant:', error);
    return JSON.stringify({ 
      error: `Внутрішня помилка при отриманні статистики: ${error.message}` 
    });
  }
};

/**
 * Отримує детальну статистику останніх матчів гравця
 * @param {object} args - Аргументи функції.
 * @param {string} args.riotId - Riot ID гравця у форматі "Name#TAG".
 * @param {string} [args.region='eu'] - Регіон гравця.
 * @param {number} [args.count=5] - Кількість матчів для аналізу.
 * @returns {Promise<string>} JSON-рядок зі статистикою матчів.
 */
const getPlayerMatches = async ({ riotId, region = 'eu', count = 5 }) => {
  if (!riotId || !riotId.includes('#')) {
    return JSON.stringify({ error: "Неправильний формат Riot ID. Використовуйте 'Ім'я#TAG'." });
  }

  const [name, tag] = riotId.split('#');
  const reg = region.toLowerCase();

  try {
    const base = 'https://api.henrikdev.xyz/valorant';
    const matchesUrl = `${base}/v3/matches/${encodeURIComponent(reg)}/${encodeURIComponent(name)}/${encodeURIComponent(tag)}?size=${count}`;
    
    const matchesResp = await fetch(matchesUrl);
    if (!matchesResp.ok) {
      return JSON.stringify({ error: `Не вдалося отримати матчі. Статус: ${matchesResp.status}` });
    }
    
    const matchesData = await matchesResp.json();
    
    if (!matchesData.data || matchesData.data.length === 0) {
      return JSON.stringify({ error: 'Матчі не знайдено' });
    }

    const matches = matchesData.data.map(match => {
      const player = match.players?.all_players?.find(p => 
        p.name.toLowerCase() === name.toLowerCase() && 
        p.tag.toLowerCase() === tag.toLowerCase()
      );

      if (!player) return null;

      const playerTeam = player.team === 'Red' ? match.teams.red : match.teams.blue;
      const enemyTeam = player.team === 'Red' ? match.teams.blue : match.teams.red;

      return {
        map: match.metadata?.map || 'Unknown',
        mode: match.metadata?.mode || 'Unknown',
        result: playerTeam.has_won ? 'Win' : 'Loss',
        score: `${playerTeam.rounds_won}-${enemyTeam.rounds_won}`,
        agent: player.character || 'Unknown',
        stats: {
          kills: player.stats?.kills || 0,
          deaths: player.stats?.deaths || 0,
          assists: player.stats?.assists || 0,
          acs: player.stats?.score || 0,
          headshots: player.stats?.headshots || 0,
        },
        date: match.metadata?.game_start_patched || 'Unknown',
      };
    }).filter(Boolean);

    return JSON.stringify({
      player: `${name}#${tag}`,
      region: reg,
      matches: matches,
      summary: {
        total: matches.length,
        wins: matches.filter(m => m.result === 'Win').length,
        losses: matches.filter(m => m.result === 'Loss').length,
      }
    });

  } catch (error) {
    console.error('Помилка при отриманні матчів:', error);
    return JSON.stringify({ error: `Помилка: ${error.message}` });
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
    // Визначаємо URL backend сервера
    const backendUrl = process.env.BACKEND_URL || 
                      (process.env.VERCEL_URL 
                        ? `https://${process.env.VERCEL_URL}` 
                        : 'http://localhost:3001');
    
    const response = await fetch(`${backendUrl}/api/search/hybrid`, {
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
    return JSON.stringify({ 
      error: `Не вдалося підключитися до сервісу пошуку: ${error.message}` 
    });
  }
};

// Словник доступних інструментів
const availableTools = {
  getPlayerStats,
  getPlayerMatches,
  hybridSearch,
};

// Специфікація інструментів для моделі OpenAI
const toolDefinitions = [
  {
    name: 'getPlayerStats',
    description: 'Отримати детальну статистику гравця Valorant з Tracker (ранг, ELO, K/D, ACS, headshot %, статистика по агентах, win rate) за його Riot ID. Використовуй коли користувач питає про статистику, ранг, або продуктивність гравця.',
    parameters: {
      type: 'object',
      properties: {
        riotId: {
          type: 'string',
          description: 'Riot ID гравця у форматі "Name#TAG", наприклад "TenZ#SEN" або "PlayerName#1234".',
        },
        region: {
          type: 'string',
          description: 'Регіон гравця: "eu" (Європа), "na" (Північна Америка), "ap" (Азія-Тихоокеанський), "kr" (Корея), "latam" (Латинська Америка), "br" (Бразилія). За замовчуванням "eu".',
        },
      },
      required: ['riotId'],
    },
  },
  {
    name: 'getPlayerMatches',
    description: 'Отримати детальну інформацію про останні матчі гравця (карти, результати, статистика, агенти). Використовуй коли користувач питає про останні ігри, матчі, або історію.',
    parameters: {
      type: 'object',
      properties: {
        riotId: {
          type: 'string',
          description: 'Riot ID гравця у форматі "Name#TAG".',
        },
        region: {
          type: 'string',
          description: 'Регіон гравця (eu, na, ap, kr, latam, br). За замовчуванням "eu".',
        },
        count: {
          type: 'number',
          description: 'Кількість матчів для отримання (1-10). За замовчуванням 5.',
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
