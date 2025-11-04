import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';

export interface PlayerData {
  playerName: string;
  team: string;
  rating: string;
  region?: string;
  playerStatistics: {
    average_combat_score: string;
    kill_deaths: string;
    kill_assists_survived_traded: string;
    average_damage_per_round: string;
    kills_per_round: string;
    assists_per_round: string;
    first_kills_per_round: string;
    first_deaths_per_round: string;
    headshot_percentage: string;
    clutch_success_percentage: string;
  };
  agent: string[];
  playerCategory: string;
}

export interface MatchData {
  date: string;
  match_id: string;
  time: string;
  team1: string;
  score1: string;
  team2: string;
  score2: string;
  score: string;
  winner: string;
  status: string;
  week: string;
  stage: string;
}

const DATA_DIR = path.join(__dirname, '..', 'data');

// Load all player data from JSON files
export async function loadPlayerData(): Promise<PlayerData[]> {
  const players: PlayerData[] = [];
  
  const jsonFiles = [
    'vct-international.json',
    'vct-game-changer.json',
    'vct-challengers.json'
  ];

  for (const file of jsonFiles) {
    const filePath = path.join(DATA_DIR, file);
    try {
      if (fs.existsSync(filePath)) {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        players.push(...data);
        console.log(`[DataService] Loaded ${data.length} players from ${file}`);
      }
    } catch (error) {
      console.error(`[DataService] Error loading ${file}:`, error);
    }
  }

  return players;
}

// Load match data from CSV
export async function loadMatchData(): Promise<MatchData[]> {
  return new Promise((resolve, reject) => {
    const matches: MatchData[] = [];
    const filePath = path.join(DATA_DIR, 'matches.csv');

    if (!fs.existsSync(filePath)) {
      console.warn(`[DataService] matches.csv not found`);
      resolve([]);
      return;
    }

    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => {
        matches.push(row as MatchData);
      })
      .on('end', () => {
        console.log(`[DataService] Loaded ${matches.length} matches from CSV`);
        resolve(matches);
      })
      .on('error', (error) => {
        console.error('[DataService] Error loading matches.csv:', error);
        reject(error);
      });
  });
}

// Create text description for a player (for embedding)
export function createPlayerDescription(player: PlayerData): string {
  const agents = player.agent.join(', ');
  const stats = player.playerStatistics;
  
  return `Player: ${player.playerName}. Team: ${player.team}. ${player.region ? `Region: ${player.region}.` : ''} Rating: ${player.rating}. Agents: ${agents}. Average Combat Score: ${stats.average_combat_score}. K/D Ratio: ${stats.kill_deaths}. KAST: ${stats.kill_assists_survived_traded}. ADR: ${stats.average_damage_per_round}. Headshot %: ${stats.headshot_percentage}. Clutch Success: ${stats.clutch_success_percentage}.`;
}

// Create text description for a match (for embedding)
export function createMatchDescription(match: MatchData): string {
  return `Match on ${match.date} at ${match.time}. ${match.team1} vs ${match.team2}. Score: ${match.score}. Winner: ${match.winner}. Stage: ${match.stage}. Week: ${match.week}. Status: ${match.status}.`;
}
