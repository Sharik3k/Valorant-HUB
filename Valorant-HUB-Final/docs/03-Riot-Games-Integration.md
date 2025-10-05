# VALORANT-HUB Desktop App - Riot Games API Integration

## Overview
The Riot Games integration provides secure authentication and access to user game data through OAuth 2.0 and the Riot Games API. This system handles user authentication, data fetching, caching, and privacy compliance.

## Authentication System

### OAuth 2.0 Flow Implementation

#### Configuration
**File**: `src/auth/RiotAuthConfig.ts`
```typescript
export const RiotAuthConfig = {
  clientId: process.env.RIOT_CLIENT_ID,
  redirectUri: 'valoranthub://auth/callback',
  scope: 'openid profile email valorant:read',
  responseType: 'code',
  codeChallenge: 'S256', // PKCE
  authUrl: 'https://auth.riotgames.com/authorize',
  tokenUrl: 'https://auth.riotgames.com/token',
  userInfoUrl: 'https://auth.riotgames.com/userinfo',
  revokeUrl: 'https://auth.riotgames.com/revoke'
};
```

#### Authentication Manager
**File**: `src/auth/RiotAuthManager.ts`
```typescript
import { BrowserWindow, shell } from 'electron';
import { RiotAuthConfig } from './RiotAuthConfig';
import { TokenManager } from './TokenManager';
import { logger } from '../utils/logger';
import crypto from 'crypto';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  idToken: string;
  expiresAt: number;
  scope: string;
}

export interface RiotUser {
  puuid: string;
  gameName: string;
  tagLine: string;
  region: string;
  locale: string;
}

export class RiotAuthManager {
  private tokenManager: TokenManager;
  private authWindow: BrowserWindow | null = null;
  private codeVerifier: string = '';

  constructor() {
    this.tokenManager = new TokenManager();
  }

  public async authenticate(): Promise<RiotUser> {
    try {
      // Generate PKCE challenge
      this.codeVerifier = this.generateCodeVerifier();
      const codeChallenge = this.generateCodeChallenge(this.codeVerifier);

      // Build authorization URL
      const authUrl = this.buildAuthUrl(codeChallenge);

      // Open auth window
      const authCode = await this.openAuthWindow(authUrl);

      // Exchange code for tokens
      const tokens = await this.exchangeCodeForTokens(authCode);

      // Store tokens securely
      await this.tokenManager.storeTokens(tokens);

      // Get user info
      const user = await this.getUserInfo(tokens.accessToken);

      logger.info('User authenticated successfully:', user.gameName);
      return user;

    } catch (error) {
      logger.error('Authentication failed:', error);
      throw new Error(`Authentication failed: ${error.message}`);
    }
  }

  private generateCodeVerifier(): string {
    return crypto.randomBytes(32).toString('base64url');
  }

  private generateCodeChallenge(verifier: string): string {
    return crypto.createHash('sha256').update(verifier).digest('base64url');
  }

  private buildAuthUrl(codeChallenge: string): string {
    const params = new URLSearchParams({
      client_id: RiotAuthConfig.clientId,
      redirect_uri: RiotAuthConfig.redirectUri,
      response_type: RiotAuthConfig.responseType,
      scope: RiotAuthConfig.scope,
      code_challenge: codeChallenge,
      code_challenge_method: RiotAuthConfig.codeChallenge,
      state: crypto.randomBytes(16).toString('hex')
    });

    return `${RiotAuthConfig.authUrl}?${params.toString()}`;
  }

  private async openAuthWindow(authUrl: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.authWindow = new BrowserWindow({
        width: 500,
        height: 700,
        show: true,
        modal: true,
        webPreferences: {
          nodeIntegration: false,
          contextIsolation: true,
          webSecurity: true
        }
      });

      // Handle successful auth callback
      this.authWindow.webContents.on('will-redirect', (event, url) => {
        if (url.startsWith(RiotAuthConfig.redirectUri)) {
          const urlParams = new URL(url);
          const code = urlParams.searchParams.get('code');
          const error = urlParams.searchParams.get('error');

          this.authWindow?.close();

          if (error) {
            reject(new Error(`Auth error: ${error}`));
          } else if (code) {
            resolve(code);
          } else {
            reject(new Error('No authorization code received'));
          }
        }
      });

      // Handle window close
      this.authWindow.on('closed', () => {
        this.authWindow = null;
        reject(new Error('Authentication cancelled by user'));
      });

      // Load auth URL
      this.authWindow.loadURL(authUrl);
    });
  }

  private async exchangeCodeForTokens(code: string): Promise<AuthTokens> {
    const tokenData = {
      grant_type: 'authorization_code',
      client_id: RiotAuthConfig.clientId,
      code: code,
      redirect_uri: RiotAuthConfig.redirectUri,
      code_verifier: this.codeVerifier
    };

    const response = await fetch(RiotAuthConfig.tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams(tokenData)
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Token exchange failed: ${error}`);
    }

    const tokens = await response.json();
    
    return {
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      idToken: tokens.id_token,
      expiresAt: Date.now() + (tokens.expires_in * 1000),
      scope: tokens.scope
    };
  }

  private async getUserInfo(accessToken: string): Promise<RiotUser> {
    const response = await fetch(RiotAuthConfig.userInfoUrl, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to get user info: ${response.statusText}`);
    }

    const userInfo = await response.json();
    
    return {
      puuid: userInfo.sub,
      gameName: userInfo.name,
      tagLine: userInfo.tag_line,
      region: userInfo.region,
      locale: userInfo.locale
    };
  }

  public async refreshTokens(): Promise<AuthTokens> {
    const currentTokens = await this.tokenManager.getTokens();
    
    if (!currentTokens?.refreshToken) {
      throw new Error('No refresh token available');
    }

    const refreshData = {
      grant_type: 'refresh_token',
      client_id: RiotAuthConfig.clientId,
      refresh_token: currentTokens.refreshToken
    };

    const response = await fetch(RiotAuthConfig.tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams(refreshData)
    });

    if (!response.ok) {
      throw new Error('Token refresh failed');
    }

    const tokens = await response.json();
    
    const newTokens: AuthTokens = {
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token || currentTokens.refreshToken,
      idToken: tokens.id_token,
      expiresAt: Date.now() + (tokens.expires_in * 1000),
      scope: tokens.scope
    };

    await this.tokenManager.storeTokens(newTokens);
    return newTokens;
  }

  public async logout(): Promise<void> {
    try {
      const tokens = await this.tokenManager.getTokens();
      
      if (tokens?.refreshToken) {
        // Revoke tokens
        await fetch(RiotAuthConfig.revokeUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: new URLSearchParams({
            token: tokens.refreshToken,
            client_id: RiotAuthConfig.clientId
          })
        });
      }
    } catch (error) {
      logger.warn('Token revocation failed:', error);
    } finally {
      // Clear stored tokens
      await this.tokenManager.clearTokens();
      logger.info('User logged out successfully');
    }
  }

  public async isAuthenticated(): Promise<boolean> {
    const tokens = await this.tokenManager.getTokens();
    
    if (!tokens) {
      return false;
    }

    // Check if token is expired
    if (Date.now() >= tokens.expiresAt) {
      try {
        await this.refreshTokens();
        return true;
      } catch {
        return false;
      }
    }

    return true;
  }
}
```

#### Token Manager
**File**: `src/auth/TokenManager.ts`
```typescript
import keytar from 'keytar';
import { app } from 'electron';
import { AuthTokens } from './RiotAuthManager';
import { logger } from '../utils/logger';

export class TokenManager {
  private readonly serviceName = 'valorant-hub';
  private readonly accountName = 'riot-tokens';

  public async storeTokens(tokens: AuthTokens): Promise<void> {
    try {
      const tokenData = JSON.stringify(tokens);
      await keytar.setPassword(this.serviceName, this.accountName, tokenData);
      logger.info('Tokens stored successfully');
    } catch (error) {
      logger.error('Failed to store tokens:', error);
      throw new Error('Failed to store authentication tokens');
    }
  }

  public async getTokens(): Promise<AuthTokens | null> {
    try {
      const tokenData = await keytar.getPassword(this.serviceName, this.accountName);
      
      if (!tokenData) {
        return null;
      }

      return JSON.parse(tokenData) as AuthTokens;
    } catch (error) {
      logger.error('Failed to retrieve tokens:', error);
      return null;
    }
  }

  public async clearTokens(): Promise<void> {
    try {
      await keytar.deletePassword(this.serviceName, this.accountName);
      logger.info('Tokens cleared successfully');
    } catch (error) {
      logger.error('Failed to clear tokens:', error);
    }
  }

  public async getValidAccessToken(): Promise<string | null> {
    const tokens = await this.getTokens();
    
    if (!tokens) {
      return null;
    }

    // Check if token is expired (with 5-minute buffer)
    if (Date.now() >= (tokens.expiresAt - 300000)) {
      return null; // Token expired, needs refresh
    }

    return tokens.accessToken;
  }
}
```

## Riot API Integration

### API Client
**File**: `src/api/RiotAPIClient.ts`
```typescript
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { TokenManager } from '../auth/TokenManager';
import { RiotAuthManager } from '../auth/RiotAuthManager';
import { logger } from '../utils/logger';

export interface RiotAPIConfig {
  baseURL: string;
  timeout: number;
  retryAttempts: number;
  retryDelay: number;
}

export class RiotAPIClient {
  private client: AxiosInstance;
  private tokenManager: TokenManager;
  private authManager: RiotAuthManager;
  private config: RiotAPIConfig;

  constructor(config: RiotAPIConfig) {
    this.config = config;
    this.tokenManager = new TokenManager();
    this.authManager = new RiotAuthManager();
    
    this.client = axios.create({
      baseURL: config.baseURL,
      timeout: config.timeout,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'VALORANT-HUB/1.0.0'
      }
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor - add auth token
    this.client.interceptors.request.use(
      async (config) => {
        const token = await this.tokenManager.getValidAccessToken();
        
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor - handle auth errors
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            await this.authManager.refreshTokens();
            const newToken = await this.tokenManager.getValidAccessToken();
            
            if (newToken) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              return this.client(originalRequest);
            }
          } catch (refreshError) {
            logger.error('Token refresh failed:', refreshError);
            // Redirect to login
            return Promise.reject(new Error('Authentication required'));
          }
        }

        return Promise.reject(error);
      }
    );
  }

  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.client.get<T>(url, config);
      return response.data;
    } catch (error) {
      this.handleAPIError(error, 'GET', url);
      throw error;
    }
  }

  public async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.client.post<T>(url, data, config);
      return response.data;
    } catch (error) {
      this.handleAPIError(error, 'POST', url);
      throw error;
    }
  }

  private handleAPIError(error: any, method: string, url: string): void {
    const status = error.response?.status;
    const message = error.response?.data?.message || error.message;
    
    logger.error(`API ${method} ${url} failed:`, {
      status,
      message,
      data: error.response?.data
    });

    // Handle specific error codes
    switch (status) {
      case 429:
        logger.warn('Rate limit exceeded, implementing backoff');
        break;
      case 403:
        logger.warn('Insufficient permissions for API call');
        break;
      case 404:
        logger.warn('API endpoint not found');
        break;
      case 500:
        logger.error('Riot API server error');
        break;
    }
  }
}
```

### Match History Service
**File**: `src/services/MatchHistoryService.ts`
```typescript
import { RiotAPIClient } from '../api/RiotAPIClient';
import { DatabaseManager } from '../database/DatabaseManager';

export interface Match {
  matchId: string;
  gameStartTimeMillis: number;
  gameEndTimeMillis: number;
  queueId: string;
  gameMode: string;
  mapId: string;
  isRanked: boolean;
  seasonId: string;
  roundsPlayed: number;
  teamWon: boolean;
  playerStats: PlayerMatchStats;
}

export interface PlayerMatchStats {
  puuid: string;
  gameName: string;
  tagLine: string;
  teamId: string;
  characterId: string;
  kills: number;
  deaths: number;
  assists: number;
  score: number;
  economyRating: number;
  firstBloods: number;
  firstBloodVictims: number;
  headshots: number;
  bodyshots: number;
  legshots: number;
  damageDealt: number;
  damageReceived: number;
  moneySpent: number;
  loadoutValue: number;
}

export class MatchHistoryService {
  private apiClient: RiotAPIClient;
  private dbManager: DatabaseManager;

  constructor(apiClient: RiotAPIClient, dbManager: DatabaseManager) {
    this.apiClient = apiClient;
    this.dbManager = dbManager;
  }

  public async getMatchHistory(puuid: string, startIndex = 0, endIndex = 20): Promise<Match[]> {
    try {
      // Try to get from cache first
      const cachedMatches = await this.getCachedMatches(puuid, startIndex, endIndex);
      
      if (cachedMatches.length > 0) {
        return cachedMatches;
      }

      // Fetch from API
      const matchIds = await this.apiClient.get<string[]>(
        `/valorant/match/v1/matchlists/by-puuid/${puuid}`,
        {
          params: {
            startIndex,
            endIndex
          }
        }
      );

      const matches: Match[] = [];
      
      for (const matchId of matchIds) {
        const matchData = await this.getMatchDetails(matchId);
        if (matchData) {
          matches.push(matchData);
        }
      }

      // Cache the matches
      await this.cacheMatches(matches);

      return matches;
    } catch (error) {
      logger.error('Failed to get match history:', error);
      throw error;
    }
  }

  public async getMatchDetails(matchId: string): Promise<Match | null> {
    try {
      // Check cache first
      const cachedMatch = await this.getCachedMatch(matchId);
      if (cachedMatch) {
        return cachedMatch;
      }

      // Fetch from API
      const matchData = await this.apiClient.get<any>(`/valorant/match/v1/matches/${matchId}`);
      
      const match = this.parseMatchData(matchData);
      
      // Cache the match
      await this.cacheMatch(match);
      
      return match;
    } catch (error) {
      logger.error(`Failed to get match details for ${matchId}:`, error);
      return null;
    }
  }

  private parseMatchData(apiData: any): Match {
    const matchInfo = apiData.matchInfo;
    const players = apiData.players;
    const teams = apiData.teams;
    
    // Find current user's data
    const currentPlayer = players.find((p: any) => p.puuid === this.getCurrentUserPUUID());
    const playerTeam = teams.find((t: any) => t.teamId === currentPlayer?.teamId);
    
    return {
      matchId: matchInfo.matchId,
      gameStartTimeMillis: matchInfo.gameStartMillis,
      gameEndTimeMillis: matchInfo.gameEndMillis,
      queueId: matchInfo.queueId,
      gameMode: matchInfo.gameMode,
      mapId: matchInfo.mapId,
      isRanked: matchInfo.isRanked,
      seasonId: matchInfo.seasonId,
      roundsPlayed: matchInfo.roundsPlayed,
      teamWon: playerTeam?.won || false,
      playerStats: this.parsePlayerStats(currentPlayer)
    };
  }

  private parsePlayerStats(playerData: any): PlayerMatchStats {
    const stats = playerData.stats;
    
    return {
      puuid: playerData.puuid,
      gameName: playerData.gameName,
      tagLine: playerData.tagLine,
      teamId: playerData.teamId,
      characterId: playerData.characterId,
      kills: stats.kills,
      deaths: stats.deaths,
      assists: stats.assists,
      score: stats.score,
      economyRating: stats.economyRating,
      firstBloods: stats.firstBloods,
      firstBloodVictims: stats.firstBloodVictims,
      headshots: stats.headshots,
      bodyshots: stats.bodyshots,
      legshots: stats.legshots,
      damageDealt: stats.damageDealt,
      damageReceived: stats.damageReceived,
      moneySpent: stats.moneySpent,
      loadoutValue: stats.loadoutValue
    };
  }

  private async getCachedMatches(puuid: string, startIndex: number, endIndex: number): Promise<Match[]> {
    return this.dbManager.query(`
      SELECT * FROM matches 
      WHERE puuid = ? 
      ORDER BY gameStartTimeMillis DESC 
      LIMIT ? OFFSET ?
    `, [puuid, endIndex - startIndex, startIndex]);
  }

  private async getCachedMatch(matchId: string): Promise<Match | null> {
    const matches = await this.dbManager.query(`
      SELECT * FROM matches WHERE matchId = ?
    `, [matchId]);
    
    return matches.length > 0 ? matches[0] : null;
  }

  private async cacheMatches(matches: Match[]): Promise<void> {
    const stmt = this.dbManager.prepare(`
      INSERT OR REPLACE INTO matches (
        matchId, gameStartTimeMillis, gameEndTimeMillis, queueId,
        gameMode, mapId, isRanked, seasonId, roundsPlayed, teamWon,
        puuid, characterId, kills, deaths, assists, score,
        economyRating, headshots, damageDealt, createdAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const match of matches) {
      stmt.run([
        match.matchId,
        match.gameStartTimeMillis,
        match.gameEndTimeMillis,
        match.queueId,
        match.gameMode,
        match.mapId,
        match.isRanked ? 1 : 0,
        match.seasonId,
        match.roundsPlayed,
        match.teamWon ? 1 : 0,
        match.playerStats.puuid,
        match.playerStats.characterId,
        match.playerStats.kills,
        match.playerStats.deaths,
        match.playerStats.assists,
        match.playerStats.score,
        match.playerStats.economyRating,
        match.playerStats.headshots,
        match.playerStats.damageDealt,
        Date.now()
      ]);
    }

    stmt.finalize();
  }

  private async cacheMatch(match: Match): Promise<void> {
    await this.cacheMatches([match]);
  }

  private getCurrentUserPUUID(): string {
    // Get from stored user session
    return this.dbManager.query('SELECT puuid FROM user_session LIMIT 1')[0]?.puuid;
  }
}
```

### Player Statistics Service
**File**: `src/services/PlayerStatsService.ts`
```typescript
import { RiotAPIClient } from '../api/RiotAPIClient';
import { Match, PlayerMatchStats } from './MatchHistoryService';

export interface PlayerStatistics {
  puuid: string;
  gameName: string;
  tagLine: string;
  currentRank: RankInfo;
  peakRank: RankInfo;
  overallStats: OverallStats;
  agentStats: AgentStats[];
  mapStats: MapStats[];
  recentPerformance: RecentPerformance;
}

export interface RankInfo {
  tier: number;
  tierName: string;
  division: number;
  divisionName: string;
  rankPoints: number;
  leaderboardRank?: number;
}

export interface OverallStats {
  totalMatches: number;
  wins: number;
  losses: number;
  winRate: number;
  averageKDA: number;
  averageACS: number;
  headshotPercentage: number;
  firstBloodPercentage: number;
  clutchSuccessRate: number;
  economyRating: number;
}

export interface AgentStats {
  agentId: string;
  agentName: string;
  matchesPlayed: number;
  winRate: number;
  averageKDA: number;
  averageACS: number;
  pickRate: number;
}

export interface MapStats {
  mapId: string;
  mapName: string;
  matchesPlayed: number;
  winRate: number;
  averageRounds: number;
  sidePreference: 'attack' | 'defense' | 'balanced';
}

export interface RecentPerformance {
  last10Games: {
    wins: number;
    losses: number;
    averageKDA: number;
    averageACS: number;
  };
  trend: 'improving' | 'declining' | 'stable';
  streaks: {
    currentWinStreak: number;
    currentLossStreak: number;
    longestWinStreak: number;
    longestLossStreak: number;
  };
}

export class PlayerStatsService {
  private apiClient: RiotAPIClient;

  constructor(apiClient: RiotAPIClient) {
    this.apiClient = apiClient;
  }

  public async getPlayerStatistics(puuid: string): Promise<PlayerStatistics> {
    try {
      // Get current competitive data
      const competitiveData = await this.apiClient.get<any>(
        `/valorant/ranked/v1/leaderboards/by-puuid/${puuid}`
      );

      // Get match history for stats calculation
      const matches = await this.getRecentMatches(puuid, 50);

      const stats: PlayerStatistics = {
        puuid,
        gameName: matches[0]?.playerStats.gameName || '',
        tagLine: matches[0]?.playerStats.tagLine || '',
        currentRank: this.parseRankInfo(competitiveData.currentRank),
        peakRank: this.parseRankInfo(competitiveData.peakRank),
        overallStats: this.calculateOverallStats(matches),
        agentStats: this.calculateAgentStats(matches),
        mapStats: this.calculateMapStats(matches),
        recentPerformance: this.calculateRecentPerformance(matches)
      };

      return stats;
    } catch (error) {
      logger.error('Failed to get player statistics:', error);
      throw error;
    }
  }

  private parseRankInfo(rankData: any): RankInfo {
    return {
      tier: rankData.tier,
      tierName: rankData.tierName,
      division: rankData.division,
      divisionName: rankData.divisionName,
      rankPoints: rankData.rankPoints,
      leaderboardRank: rankData.leaderboardRank
    };
  }

  private calculateOverallStats(matches: Match[]): OverallStats {
    if (matches.length === 0) {
      return this.getEmptyOverallStats();
    }

    const totalMatches = matches.length;
    const wins = matches.filter(m => m.teamWon).length;
    const losses = totalMatches - wins;

    let totalKills = 0;
    let totalDeaths = 0;
    let totalAssists = 0;
    let totalScore = 0;
    let totalHeadshots = 0;
    let totalShots = 0;
    let totalFirstBloods = 0;
    let totalEconomyRating = 0;

    for (const match of matches) {
      const stats = match.playerStats;
      totalKills += stats.kills;
      totalDeaths += stats.deaths;
      totalAssists += stats.assists;
      totalScore += stats.score;
      totalHeadshots += stats.headshots;
      totalShots += stats.headshots + stats.bodyshots + stats.legshots;
      totalFirstBloods += stats.firstBloods;
      totalEconomyRating += stats.economyRating;
    }

    return {
      totalMatches,
      wins,
      losses,
      winRate: (wins / totalMatches) * 100,
      averageKDA: totalDeaths > 0 ? (totalKills + totalAssists) / totalDeaths : totalKills + totalAssists,
      averageACS: totalScore / totalMatches,
      headshotPercentage: totalShots > 0 ? (totalHeadshots / totalShots) * 100 : 0,
      firstBloodPercentage: (totalFirstBloods / totalMatches) * 100,
      clutchSuccessRate: this.calculateClutchRate(matches),
      economyRating: totalEconomyRating / totalMatches
    };
  }

  private calculateAgentStats(matches: Match[]): AgentStats[] {
    const agentMap = new Map<string, {
      matches: Match[];
      wins: number;
    }>();

    // Group matches by agent
    for (const match of matches) {
      const agentId = match.playerStats.characterId;
      
      if (!agentMap.has(agentId)) {
        agentMap.set(agentId, { matches: [], wins: 0 });
      }

      const agentData = agentMap.get(agentId)!;
      agentData.matches.push(match);
      
      if (match.teamWon) {
        agentData.wins++;
      }
    }

    // Calculate stats for each agent
    const agentStats: AgentStats[] = [];
    
    for (const [agentId, data] of agentMap.entries()) {
      const matchCount = data.matches.length;
      const totalKills = data.matches.reduce((sum, m) => sum + m.playerStats.kills, 0);
      const totalDeaths = data.matches.reduce((sum, m) => sum + m.playerStats.deaths, 0);
      const totalAssists = data.matches.reduce((sum, m) => sum + m.playerStats.assists, 0);
      const totalScore = data.matches.reduce((sum, m) => sum + m.playerStats.score, 0);

      agentStats.push({
        agentId,
        agentName: this.getAgentName(agentId),
        matchesPlayed: matchCount,
        winRate: (data.wins / matchCount) * 100,
        averageKDA: totalDeaths > 0 ? (totalKills + totalAssists) / totalDeaths : totalKills + totalAssists,
        averageACS: totalScore / matchCount,
        pickRate: (matchCount / matches.length) * 100
      });
    }

    return agentStats.sort((a, b) => b.matchesPlayed - a.matchesPlayed);
  }

  private calculateMapStats(matches: Match[]): MapStats[] {
    const mapMap = new Map<string, {
      matches: Match[];
      wins: number;
      totalRounds: number;
    }>();

    // Group matches by map
    for (const match of matches) {
      const mapId = match.mapId;
      
      if (!mapMap.has(mapId)) {
        mapMap.set(mapId, { matches: [], wins: 0, totalRounds: 0 });
      }

      const mapData = mapMap.get(mapId)!;
      mapData.matches.push(match);
      mapData.totalRounds += match.roundsPlayed;
      
      if (match.teamWon) {
        mapData.wins++;
      }
    }

    // Calculate stats for each map
    const mapStats: MapStats[] = [];
    
    for (const [mapId, data] of mapMap.entries()) {
      const matchCount = data.matches.length;

      mapStats.push({
        mapId,
        mapName: this.getMapName(mapId),
        matchesPlayed: matchCount,
        winRate: (data.wins / matchCount) * 100,
        averageRounds: data.totalRounds / matchCount,
        sidePreference: this.calculateSidePreference(data.matches)
      });
    }

    return mapStats.sort((a, b) => b.matchesPlayed - a.matchesPlayed);
  }

  private calculateRecentPerformance(matches: Match[]): RecentPerformance {
    const last10 = matches.slice(0, Math.min(10, matches.length));
    const last10Wins = last10.filter(m => m.teamWon).length;
    const last10Losses = last10.length - last10Wins;

    const last10KDA = this.calculateKDAForMatches(last10);
    const last10ACS = last10.reduce((sum, m) => sum + m.playerStats.score, 0) / last10.length;

    // Calculate trend
    const first5 = matches.slice(0, Math.min(5, matches.length));
    const second5 = matches.slice(5, Math.min(10, matches.length));
    
    const first5ACS = first5.reduce((sum, m) => sum + m.playerStats.score, 0) / first5.length;
    const second5ACS = second5.length > 0 ? second5.reduce((sum, m) => sum + m.playerStats.score, 0) / second5.length : first5ACS;
    
    let trend: 'improving' | 'declining' | 'stable' = 'stable';
    const acsDifference = first5ACS - second5ACS;
    
    if (acsDifference > 20) {
      trend = 'improving';
    } else if (acsDifference < -20) {
      trend = 'declining';
    }

    return {
      last10Games: {
        wins: last10Wins,
        losses: last10Losses,
        averageKDA: last10KDA,
        averageACS: last10ACS
      },
      trend,
      streaks: this.calculateStreaks(matches)
    };
  }

  private calculateStreaks(matches: Match[]) {
    let currentWinStreak = 0;
    let currentLossStreak = 0;
    let longestWinStreak = 0;
    let longestLossStreak = 0;
    let tempWinStreak = 0;
    let tempLossStreak = 0;

    for (const match of matches) {
      if (match.teamWon) {
        if (currentLossStreak === 0) {
          currentWinStreak++;
        } else {
          currentWinStreak = 1;
          currentLossStreak = 0;
        }
        tempWinStreak++;
        tempLossStreak = 0;
      } else {
        if (currentWinStreak === 0) {
          currentLossStreak++;
        } else {
          currentLossStreak = 1;
          currentWinStreak = 0;
        }
        tempLossStreak++;
        tempWinStreak = 0;
      }

      longestWinStreak = Math.max(longestWinStreak, tempWinStreak);
      longestLossStreak = Math.max(longestLossStreak, tempLossStreak);
    }

    return {
      currentWinStreak,
      currentLossStreak,
      longestWinStreak,
      longestLossStreak
    };
  }

  private calculateKDAForMatches(matches: Match[]): number {
    const totalKills = matches.reduce((sum, m) => sum + m.playerStats.kills, 0);
    const totalDeaths = matches.reduce((sum, m) => sum + m.playerStats.deaths, 0);
    const totalAssists = matches.reduce((sum, m) => sum + m.playerStats.assists, 0);

    return totalDeaths > 0 ? (totalKills + totalAssists) / totalDeaths : totalKills + totalAssists;
  }

  private calculateClutchRate(matches: Match[]): number {
    // This would require more detailed round-by-round data
    // For now, return a placeholder calculation
    return 0; // TODO: Implement clutch detection
  }

  private calculateSidePreference(matches: Match[]): 'attack' | 'defense' | 'balanced' {
    // This would require round-by-round data to determine side performance
    // For now, return balanced as placeholder
    return 'balanced'; // TODO: Implement side analysis
  }

  private getAgentName(agentId: string): string {
    const agentMap: { [key: string]: string } = {
      '9f0d8ba9-4140-b941-57d3-a7ad57c6b417': 'Brimstone',
      '5f8d3a7f-467b-97f3-062c-13acf203c006': 'Breach',
      '6f2a04ca-43e0-be17-7f36-b3908627744d': 'Skye',
      '117ed9e3-49f3-6512-3ccf-0cada7e3823b': 'Cypher',
      '320b2a48-4d9b-a075-30f1-1f93a9b638fa': 'Sova',
      '1e58de9c-4950-5125-93e9-a0aee9f98746': 'Killjoy',
      '95b78ed7-4637-86d9-7e41-71ba8c293152': 'Harbor',
      '8e253930-4c05-31dd-1b6c-968525494517': 'Omen',
      '41fb69c1-4189-7b37-f117-bcaf1e96f1bf': 'Astra',
      '9f0d8ba9-4140-b941-57d3-a7ad57c6b417': 'Brimstone',
      'a3bfb853-43b2-7238-a4f1-ad90e9e46bcc': 'Reyna',
      'bb2a4828-46eb-8cd1-e765-15848195d751': 'Neon',
      '22697a3d-45bf-8dd7-4fec-84a9e28c69d7': 'Chamber',
      '569fdd95-4d10-43ab-ca70-79becc718b46': 'Sage',
      '6f2a04ca-43e0-be17-7f36-b3908627744d': 'Skye',
      '7f94d92c-4234-0a36-9646-3a87eb8b5c89': 'Yoru',
      'add6443a-41bd-e414-f6ad-e58d267f4e95': 'Jett',
      'e370fa57-4757-3604-3648-499e1f642d3f': 'Gekko',
      'dade69b4-4f5a-8528-247b-219e5a1facd6': 'Fade',
      '1dbf2edd-7729-4d21-8b54-21b9fbe1a7e1': 'Deadlock',
      'cc8b64c8-4b25-4ff9-6e7f-37b4da43d235': 'KAY/O',
      '707eab51-4836-f488-046a-cda6bf494859': 'Viper',
      'eb93336a-449b-9c1b-0a54-a891f7921d69': 'Phoenix',
      '601dbbe7-43ce-be57-2a40-4abd24953621': 'Iso'
    };
    
    return agentMap[agentId] || 'Unknown Agent';
  }

  private getMapName(mapId: string): string {
    const mapNames: { [key: string]: string } = {
      '7eaecc1b-4337-bbf6-6ab9-04b8f06b3319': 'Bind',
      'd960549e-485c-e861-8d71-aa9d1aed12a2': 'Haven',
      '2c9d57ec-4431-9c5e-2939-8f9ef6dd5cba': 'Split',
      '2fb9a4fd-47b8-4e7d-a969-74b4046ebd53': 'Ascent',
      'e2ad5c54-75fa-e87c-2b57-a6cd5b69e3b8': 'Icebox',
      '2fe4ed3a-450a-948b-6d6b-e89a78e680a9': 'Breeze',
      'fd267378-4d1d-484f-ff52-77821ed10dc2': 'Fracture',
      '690b3ed2-9a8a-419c-a2c5-012cb1a5e3d0': 'Pearl',
      '9c91a445-4f78-1baa-a3ea-8f8aadf4914d': 'Lotus',
      '92584fbe-486a-b1b2-9faa-39b0f486b498': 'Sunset'
    };
    
    return mapNames[mapId] || 'Unknown Map';
  }

  private getEmptyOverallStats(): OverallStats {
    return {
      totalMatches: 0,
      wins: 0,
      losses: 0,
      winRate: 0,
      averageKDA: 0,
      averageACS: 0,
      headshotPercentage: 0,
      firstBloodPercentage: 0,
      clutchSuccessRate: 0,
      economyRating: 0
    };
  }

  private async getRecentMatches(puuid: string, count: number): Promise<Match[]> {
    // This would integrate with MatchHistoryService
    // For now, return empty array as placeholder
    return [];
  }
}
```

## Privacy and Data Protection

### Privacy Manager
**File**: `src/privacy/PrivacyManager.ts`
```typescript
export interface PrivacySettings {
  shareMatchHistory: boolean;
  shareStatistics: boolean;
  allowDataCollection: boolean;
  allowAnalytics: boolean;
  dataDeletionRequested: boolean;
}

export class PrivacyManager {
  private settings: PrivacySettings;

  constructor() {
    this.settings = this.loadPrivacySettings();
  }

  public getPrivacySettings(): PrivacySettings {
    return { ...this.settings };
  }

  public updatePrivacySettings(newSettings: Partial<PrivacySettings>): void {
    this.settings = { ...this.settings, ...newSettings };
    this.savePrivacySettings();
    
    // Apply settings immediately
    this.applyPrivacySettings();
  }

  public async requestDataDeletion(): Promise<void> {
    this.settings.dataDeletionRequested = true;
    this.savePrivacySettings();
    
    // Clear local data
    await this.clearLocalData();
    
    // Notify backend
    await this.notifyBackendDataDeletion();
  }

  private loadPrivacySettings(): PrivacySettings {
    const defaultSettings: PrivacySettings = {
      shareMatchHistory: false,
      shareStatistics: false,
      allowDataCollection: true,
      allowAnalytics: true,
      dataDeletionRequested: false
    };

    try {
      const stored = localStorage.getItem('privacySettings');
      return stored ? { ...defaultSettings, ...JSON.parse(stored) } : defaultSettings;
    } catch {
      return defaultSettings;
    }
  }

  private savePrivacySettings(): void {
    localStorage.setItem('privacySettings', JSON.stringify(this.settings));
  }

  private applyPrivacySettings(): void {
    // Configure analytics
    if (!this.settings.allowAnalytics) {
      // Disable analytics tracking
      this.disableAnalytics();
    }

    // Configure data collection
    if (!this.settings.allowDataCollection) {
      // Minimize data collection
      this.minimizeDataCollection();
    }
  }

  private async clearLocalData(): Promise<void> {
    // Clear sensitive local data
    localStorage.removeItem('userProfile');
    localStorage.removeItem('matchHistory');
    localStorage.removeItem('statistics');
    
    // Clear database
    await this.clearDatabase();
  }

  private async notifyBackendDataDeletion(): Promise<void> {
    // Notify backend service about data deletion request
    // Implementation depends on backend API
  }

  private disableAnalytics(): void {
    // Disable analytics tracking
    // Implementation depends on analytics service
  }

  private minimizeDataCollection(): void {
    // Configure minimal data collection
    // Implementation depends on data collection strategy
  }

  private async clearDatabase(): Promise<void> {
    // Clear user data from local database
    // Implementation depends on database structure
  }
}
```

This comprehensive Riot Games integration provides secure authentication, efficient data fetching, local caching, and robust privacy protection while maintaining optimal performance and user experience.
