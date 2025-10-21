module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { url, riotId, region } = req.query || {};

    let name = '';
    let tag = '';
    let reg = (region || 'eu').toLowerCase();

    if (url && typeof url === 'string') {
      try {
        const u = new URL(url);
        const parts = u.pathname.split('/').filter(Boolean);
        // Шукаємо індекс після "riot" в URL типу /valorant/profile/riot/Name%23TAG/overview
        const riotIdx = parts.findIndex(p => p.toLowerCase() === 'riot');
        if (riotIdx !== -1 && parts[riotIdx + 1]) {
          // Riot ID знаходиться після "riot"
          const idPart = parts[riotIdx + 1];
          const decoded = decodeURIComponent(idPart);
          if (decoded.includes('#')) {
            const [n, t] = decoded.split('#');
            name = n;
            tag = t;
          }
        }
      } catch (_) {}
    }

    if ((!name || !tag) && riotId && typeof riotId === 'string') {
      const cleaned = riotId.trim().replace(/^@/, '');
      if (cleaned.includes('#')) {
        const [n, t] = cleaned.split('#');
        name = n;
        tag = t;
      }
    }

    if (!name || !tag) {
      return res.status(400).json({ error: 'Provide tracker URL or Riot ID in format Name#TAG' });
    }

    const base = 'https://api.henrikdev.xyz/valorant';
    const mmrUrl = `${base}/v1/mmr/${encodeURIComponent(reg)}/${encodeURIComponent(name)}/${encodeURIComponent(tag)}`;
    const matchesUrl = `${base}/v3/matches/${encodeURIComponent(reg)}/${encodeURIComponent(name)}/${encodeURIComponent(tag)}?size=5`;

    const mmrResp = await fetch(mmrUrl);
    if (!mmrResp.ok) {
      const e = await mmrResp.json().catch(() => ({}));
      return res.status(mmrResp.status).json({ error: e?.errors || e?.message || 'Failed to fetch mmr' });
    }
    const mmr = await mmrResp.json();

    const matchesResp = await fetch(matchesUrl);
    let matches = null;
    if (matchesResp.ok) {
      matches = await matchesResp.json();
    }

    return res.status(200).json({
      region: reg,
      name,
      tag,
      mmr,
      matches,
    });
  } catch (error) {
    console.error('Valorant Stats API Error:', error);
    return res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
};
