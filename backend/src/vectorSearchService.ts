import { getEmbedding } from './aiService';
import { AGENTS_DATA } from './agentsData';
import { loadPlayerData, loadMatchData, createPlayerDescription, createMatchDescription, PlayerData, MatchData } from './dataService';

interface AgentVector {
  name: string;
  vector: number[];
}

interface PlayerVector {
  player: PlayerData;
  description: string;
  vector: number[];
}

interface MatchVector {
  match: MatchData;
  description: string;
  vector: number[];
}

let agentVectors: AgentVector[] = [];
let playerVectors: PlayerVector[] = [];
let matchVectors: MatchVector[] = [];

// Helper function to calculate cosine similarity
function cosineSimilarity(vecA: number[], vecB: number[]): number {
  const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
  const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
  if (magnitudeA === 0 || magnitudeB === 0) {
    return 0;
  }
  return dotProduct / (magnitudeA * magnitudeB);
}

// Initialize vectors for all agents
export async function initializeAgentVectors(): Promise<void> {
  console.log('[VectorService] Initializing agent vectors...');
  if (agentVectors.length > 0) {
    console.log('[VectorService] Agent vectors already initialized.');
    return;
  }

  const newVectors: AgentVector[] = [];
  for (const agentName in AGENTS_DATA) {
    const agent = AGENTS_DATA[agentName as keyof typeof AGENTS_DATA];
    const agentDescription = `Agent: ${agentName}. Role: ${agent.role}. Abilities: ${agent.abilities.join(', ')}.`;
    
    try {
      const vector = await getEmbedding(agentDescription);
      newVectors.push({ name: agentName, vector });
      console.log(`[VectorService] Vector created for ${agentName}`);
    } catch (error) {
      console.error(`[VectorService] Failed to create vector for ${agentName}:`, error);
    }
  }
  agentVectors = newVectors;
  console.log('[VectorService] Agent vectors initialized successfully.');
}

// Initialize vectors for all players
export async function initializePlayerVectors(): Promise<void> {
  console.log('[VectorService] Initializing player vectors...');
  if (playerVectors.length > 0) {
    console.log('[VectorService] Player vectors already initialized.');
    return;
  }

  const players = await loadPlayerData();
  const newVectors: PlayerVector[] = [];
  
  // Limit to first 100 players to avoid too many API calls during initialization
  const playersToProcess = players.slice(0, 100);
  
  for (const player of playersToProcess) {
    const description = createPlayerDescription(player);
    
    try {
      const vector = await getEmbedding(description);
      newVectors.push({ player, description, vector });
      console.log(`[VectorService] Vector created for player ${player.playerName}`);
    } catch (error) {
      console.error(`[VectorService] Failed to create vector for ${player.playerName}:`, error);
    }
  }
  
  playerVectors = newVectors;
  console.log(`[VectorService] Player vectors initialized successfully. Total: ${playerVectors.length}`);
}

// Initialize vectors for matches (optional, can be heavy)
export async function initializeMatchVectors(limit: number = 50): Promise<void> {
  console.log('[VectorService] Initializing match vectors...');
  if (matchVectors.length > 0) {
    console.log('[VectorService] Match vectors already initialized.');
    return;
  }

  const matches = await loadMatchData();
  const newVectors: MatchVector[] = [];
  
  const matchesToProcess = matches.slice(0, limit);
  
  for (const match of matchesToProcess) {
    const description = createMatchDescription(match);
    
    try {
      const vector = await getEmbedding(description);
      newVectors.push({ match, description, vector });
      console.log(`[VectorService] Vector created for match ${match.match_id}`);
    } catch (error) {
      console.error(`[VectorService] Failed to create vector for match ${match.match_id}:`, error);
    }
  }
  
  matchVectors = newVectors;
  console.log(`[VectorService] Match vectors initialized successfully. Total: ${matchVectors.length}`);
}

// Search for agents based on a query
export async function searchAgents(query: string, topK: number = 5): Promise<{ name: string; score: number }[]> {
  if (agentVectors.length === 0) {
    console.warn('[VectorService] Vectors are not initialized. Initializing now...');
    await initializeAgentVectors();
  }

  const queryVector = await getEmbedding(query);

  const similarities = agentVectors.map(agentVector => ({
    name: agentVector.name,
    score: cosineSimilarity(queryVector, agentVector.vector),
  }));

  similarities.sort((a, b) => b.score - a.score);

  return similarities.slice(0, topK);
}

// Search for players based on a query (Vector Search)
export async function searchPlayers(query: string, topK: number = 10): Promise<{ player: PlayerData; score: number }[]> {
  if (playerVectors.length === 0) {
    console.warn('[VectorService] Player vectors are not initialized. Initializing now...');
    await initializePlayerVectors();
  }

  const queryVector = await getEmbedding(query);

  const similarities = playerVectors.map(playerVector => ({
    player: playerVector.player,
    score: cosineSimilarity(queryVector, playerVector.vector),
  }));

  similarities.sort((a, b) => b.score - a.score);

  return similarities.slice(0, topK);
}

// Keyword-based search for players (for hybrid search)
function keywordSearchPlayers(query: string, players: PlayerData[]): PlayerData[] {
  const queryLower = query.toLowerCase();
  const keywords = queryLower.split(/\s+/);
  
  return players.filter(player => {
    const searchText = `${player.playerName} ${player.team} ${player.agent.join(' ')} ${player.region || ''}`.toLowerCase();
    return keywords.some(keyword => searchText.includes(keyword));
  });
}

// Hybrid Search: Combines vector search with keyword search
export async function hybridSearchPlayers(query: string, topK: number = 10): Promise<{ player: PlayerData; score: number; matchType: string }[]> {
  if (playerVectors.length === 0) {
    console.warn('[VectorService] Player vectors are not initialized. Initializing now...');
    await initializePlayerVectors();
  }

  // Vector search
  const vectorResults = await searchPlayers(query, topK * 2);
  
  // Keyword search
  const allPlayers = playerVectors.map(pv => pv.player);
  const keywordResults = keywordSearchPlayers(query, allPlayers);
  
  // Combine results with scoring
  const combinedResults = new Map<string, { player: PlayerData; score: number; matchType: string }>();
  
  // Add vector search results with higher weight
  vectorResults.forEach((result, index) => {
    const key = result.player.playerName;
    const vectorScore = result.score * 0.7; // 70% weight for vector similarity
    const rankBonus = (topK * 2 - index) / (topK * 2) * 0.3; // 30% weight for ranking
    combinedResults.set(key, {
      player: result.player,
      score: vectorScore + rankBonus,
      matchType: 'vector'
    });
  });
  
  // Add keyword search results
  keywordResults.forEach(player => {
    const key = player.playerName;
    if (combinedResults.has(key)) {
      // Boost score if found in both searches
      const existing = combinedResults.get(key)!;
      existing.score += 0.5;
      existing.matchType = 'hybrid';
    } else {
      combinedResults.set(key, {
        player,
        score: 0.5, // Lower score for keyword-only matches
        matchType: 'keyword'
      });
    }
  });
  
  // Sort by combined score and return top K
  const results = Array.from(combinedResults.values());
  results.sort((a, b) => b.score - a.score);
  
  return results.slice(0, topK);
}
