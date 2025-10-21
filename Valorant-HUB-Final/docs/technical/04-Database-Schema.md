# VALORANT-HUB Desktop App - Database Schema and Management

## Overview
The local database system uses SQLite with SQLCipher encryption to store user data, application settings, cached content, and analytics. The database is designed for performance, security, and easy maintenance.

## Database Configuration

### Database Setup
**File**: `src/database/DatabaseManager.ts`
```typescript
import Database from 'better-sqlite3';
import { app } from 'electron';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { logger } from '../utils/logger';

export interface DatabaseConfig {
  filename: string;
  encryption: boolean;
  encryptionKey?: string;
  timeout: number;
  verbose?: boolean;
}

export class DatabaseManager {
  private db: Database.Database;
  private config: DatabaseConfig;
  private isInitialized = false;

  constructor(config?: Partial<DatabaseConfig>) {
    this.config = {
      filename: path.join(app.getPath('userData'), 'valorant-hub.db'),
      encryption: true,
      timeout: 10000,
      verbose: process.env.NODE_ENV === 'development',
      ...config
    };

    this.initializeDatabase();
  }

  private initializeDatabase(): void {
    try {
      // Ensure data directory exists
      const dbDir = path.dirname(this.config.filename);
      if (!fs.existsSync(dbDir)) {
        fs.mkdirSync(dbDir, { recursive: true });
      }

      // Initialize database connection
      this.db = new Database(this.config.filename, {
        timeout: this.config.timeout,
        verbose: this.config.verbose ? logger.debug : undefined
      });

      // Set up encryption if enabled
      if (this.config.encryption) {
        this.setupEncryption();
      }

      // Configure database settings
      this.configureDatabase();

      // Run migrations
      this.runMigrations();

      this.isInitialized = true;
      logger.info('Database initialized successfully');

    } catch (error) {
      logger.error('Database initialization failed:', error);
      throw new Error(`Database initialization failed: ${error.message}`);
    }
  }

  private setupEncryption(): void {
    if (!this.config.encryptionKey) {
      // Generate encryption key from user data
      this.config.encryptionKey = this.generateEncryptionKey();
    }

    // Set encryption key (SQLCipher)
    this.db.pragma(`key = '${this.config.encryptionKey}'`);
    
    // Verify encryption is working
    try {
      this.db.pragma('cipher_version');
      logger.info('Database encryption enabled');
    } catch (error) {
      logger.error('Database encryption setup failed:', error);
      throw new Error('Failed to enable database encryption');
    }
  }

  private generateEncryptionKey(): string {
    // Use machine-specific data for key generation
    const machineId = require('node-machine-id').machineIdSync();
    const appVersion = app.getVersion();
    const keyData = `${machineId}-${appVersion}-valorant-hub`;
    
    return crypto.createHash('sha256').update(keyData).digest('hex');
  }

  private configureDatabase(): void {
    // Performance optimizations
    this.db.pragma('journal_mode = WAL');
    this.db.pragma('synchronous = NORMAL');
    this.db.pragma('cache_size = -64000'); // 64MB cache
    this.db.pragma('temp_store = MEMORY');
    this.db.pragma('mmap_size = 268435456'); // 256MB mmap

    // Foreign key support
    this.db.pragma('foreign_keys = ON');

    // Auto vacuum
    this.db.pragma('auto_vacuum = INCREMENTAL');
  }

  private runMigrations(): void {
    const migrations = this.getMigrations();
    const currentVersion = this.getCurrentVersion();

    for (let i = currentVersion; i < migrations.length; i++) {
      logger.info(`Running migration ${i + 1}/${migrations.length}`);
      
      this.db.transaction(() => {
        migrations[i](this.db);
        this.setVersion(i + 1);
      })();
    }

    logger.info(`Database migrations completed. Current version: ${migrations.length}`);
  }

  private getCurrentVersion(): number {
    try {
      const result = this.db.prepare('SELECT version FROM schema_version ORDER BY id DESC LIMIT 1').get();
      return result ? result.version : 0;
    } catch {
      // Table doesn't exist, create it
      this.db.exec(`
        CREATE TABLE IF NOT EXISTS schema_version (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          version INTEGER NOT NULL,
          applied_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);
      return 0;
    }
  }

  private setVersion(version: number): void {
    this.db.prepare('INSERT INTO schema_version (version) VALUES (?)').run(version);
  }

  public query<T = any>(sql: string, params: any[] = []): T[] {
    if (!this.isInitialized) {
      throw new Error('Database not initialized');
    }

    try {
      const stmt = this.db.prepare(sql);
      return stmt.all(params) as T[];
    } catch (error) {
      logger.error('Query failed:', { sql, params, error });
      throw error;
    }
  }

  public queryFirst<T = any>(sql: string, params: any[] = []): T | null {
    const results = this.query<T>(sql, params);
    return results.length > 0 ? results[0] : null;
  }

  public execute(sql: string, params: any[] = []): Database.RunResult {
    if (!this.isInitialized) {
      throw new Error('Database not initialized');
    }

    try {
      const stmt = this.db.prepare(sql);
      return stmt.run(params);
    } catch (error) {
      logger.error('Execute failed:', { sql, params, error });
      throw error;
    }
  }

  public prepare(sql: string): Database.Statement {
    if (!this.isInitialized) {
      throw new Error('Database not initialized');
    }

    return this.db.prepare(sql);
  }

  public transaction(fn: () => void): () => void {
    return this.db.transaction(fn);
  }

  public close(): void {
    if (this.db) {
      this.db.close();
      logger.info('Database connection closed');
    }
  }

  public backup(backupPath: string): void {
    try {
      this.db.backup(backupPath);
      logger.info(`Database backed up to: ${backupPath}`);
    } catch (error) {
      logger.error('Database backup failed:', error);
      throw error;
    }
  }

  public vacuum(): void {
    try {
      this.db.exec('VACUUM');
      logger.info('Database vacuum completed');
    } catch (error) {
      logger.error('Database vacuum failed:', error);
      throw error;
    }
  }

  private getMigrations(): Array<(db: Database.Database) => void> {
    return [
      // Migration 1: Initial schema
      (db) => {
        db.exec(`
          -- User session table
          CREATE TABLE user_session (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            puuid TEXT UNIQUE NOT NULL,
            game_name TEXT NOT NULL,
            tag_line TEXT NOT NULL,
            region TEXT NOT NULL,
            locale TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
          );

          -- User settings table
          CREATE TABLE user_settings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            puuid TEXT NOT NULL,
            setting_key TEXT NOT NULL,
            setting_value TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (puuid) REFERENCES user_session(puuid) ON DELETE CASCADE,
            UNIQUE(puuid, setting_key)
          );

          -- Match history table
          CREATE TABLE matches (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            match_id TEXT UNIQUE NOT NULL,
            puuid TEXT NOT NULL,
            game_start_time INTEGER NOT NULL,
            game_end_time INTEGER NOT NULL,
            queue_id TEXT NOT NULL,
            game_mode TEXT NOT NULL,
            map_id TEXT NOT NULL,
            is_ranked BOOLEAN NOT NULL DEFAULT 0,
            season_id TEXT NOT NULL,
            rounds_played INTEGER NOT NULL,
            team_won BOOLEAN NOT NULL DEFAULT 0,
            character_id TEXT NOT NULL,
            kills INTEGER NOT NULL DEFAULT 0,
            deaths INTEGER NOT NULL DEFAULT 0,
            assists INTEGER NOT NULL DEFAULT 0,
            score INTEGER NOT NULL DEFAULT 0,
            economy_rating INTEGER NOT NULL DEFAULT 0,
            first_bloods INTEGER NOT NULL DEFAULT 0,
            first_blood_victims INTEGER NOT NULL DEFAULT 0,
            headshots INTEGER NOT NULL DEFAULT 0,
            bodyshots INTEGER NOT NULL DEFAULT 0,
            legshots INTEGER NOT NULL DEFAULT 0,
            damage_dealt INTEGER NOT NULL DEFAULT 0,
            damage_received INTEGER NOT NULL DEFAULT 0,
            money_spent INTEGER NOT NULL DEFAULT 0,
            loadout_value INTEGER NOT NULL DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (puuid) REFERENCES user_session(puuid) ON DELETE CASCADE
          );

          -- Content favorites table
          CREATE TABLE favorites (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            puuid TEXT NOT NULL,
            content_type TEXT NOT NULL, -- 'guide', 'article', 'video'
            content_id TEXT NOT NULL,
            title TEXT NOT NULL,
            url TEXT,
            tags TEXT, -- JSON array
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (puuid) REFERENCES user_session(puuid) ON DELETE CASCADE,
            UNIQUE(puuid, content_type, content_id)
          );

          -- AI query history table
          CREATE TABLE ai_queries (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            puuid TEXT NOT NULL,
            query_text TEXT NOT NULL,
            response_text TEXT NOT NULL,
            query_type TEXT NOT NULL, -- 'general', 'stats_analysis', 'strategy'
            tokens_used INTEGER NOT NULL DEFAULT 0,
            response_time INTEGER NOT NULL DEFAULT 0, -- milliseconds
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (puuid) REFERENCES user_session(puuid) ON DELETE CASCADE
          );

          -- AI usage tracking table
          CREATE TABLE ai_usage (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            puuid TEXT NOT NULL,
            date TEXT NOT NULL, -- YYYY-MM-DD
            query_count INTEGER NOT NULL DEFAULT 0,
            tokens_used INTEGER NOT NULL DEFAULT 0,
            tier TEXT NOT NULL DEFAULT 'free', -- 'free', 'premium'
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (puuid) REFERENCES user_session(puuid) ON DELETE CASCADE,
            UNIQUE(puuid, date)
          );

          -- Create indexes
          CREATE INDEX idx_matches_puuid ON matches(puuid);
          CREATE INDEX idx_matches_game_start ON matches(game_start_time);
          CREATE INDEX idx_matches_map_id ON matches(map_id);
          CREATE INDEX idx_matches_character_id ON matches(character_id);
          CREATE INDEX idx_favorites_puuid ON favorites(puuid);
          CREATE INDEX idx_ai_queries_puuid ON ai_queries(puuid);
          CREATE INDEX idx_ai_queries_created ON ai_queries(created_at);
          CREATE INDEX idx_ai_usage_puuid_date ON ai_usage(puuid, date);
          CREATE INDEX idx_user_settings_puuid_key ON user_settings(puuid, setting_key);
        `);
      },

      // Migration 2: Subscription and payment tracking
      (db) => {
        db.exec(`
          -- Subscription table
          CREATE TABLE subscriptions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            puuid TEXT NOT NULL,
            subscription_id TEXT UNIQUE NOT NULL, -- Stripe subscription ID
            plan_type TEXT NOT NULL, -- 'monthly', 'yearly'
            status TEXT NOT NULL, -- 'active', 'canceled', 'past_due', 'unpaid'
            current_period_start INTEGER NOT NULL,
            current_period_end INTEGER NOT NULL,
            cancel_at_period_end BOOLEAN NOT NULL DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (puuid) REFERENCES user_session(puuid) ON DELETE CASCADE
          );

          -- Payment history table
          CREATE TABLE payments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            puuid TEXT NOT NULL,
            payment_intent_id TEXT UNIQUE NOT NULL,
            amount INTEGER NOT NULL, -- in cents
            currency TEXT NOT NULL DEFAULT 'USD',
            status TEXT NOT NULL, -- 'succeeded', 'failed', 'pending'
            description TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (puuid) REFERENCES user_session(puuid) ON DELETE CASCADE
          );

          CREATE INDEX idx_subscriptions_puuid ON subscriptions(puuid);
          CREATE INDEX idx_payments_puuid ON payments(puuid);
        `);
      },

      // Migration 3: Content caching and notifications
      (db) => {
        db.exec(`
          -- Cached content table
          CREATE TABLE cached_content (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            content_type TEXT NOT NULL, -- 'news', 'guide', 'patch_note', 'esports'
            content_id TEXT UNIQUE NOT NULL,
            title TEXT NOT NULL,
            content TEXT NOT NULL, -- JSON content
            tags TEXT, -- JSON array
            author TEXT,
            published_at INTEGER,
            expires_at INTEGER,
            is_premium BOOLEAN NOT NULL DEFAULT 0,
            view_count INTEGER NOT NULL DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
          );

          -- Notification settings table
          CREATE TABLE notification_settings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            puuid TEXT NOT NULL,
            notification_type TEXT NOT NULL, -- 'new_content', 'match_updates', 'system'
            enabled BOOLEAN NOT NULL DEFAULT 1,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (puuid) REFERENCES user_session(puuid) ON DELETE CASCADE,
            UNIQUE(puuid, notification_type)
          );

          -- Notification history table
          CREATE TABLE notification_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            puuid TEXT NOT NULL,
            notification_type TEXT NOT NULL,
            title TEXT NOT NULL,
            message TEXT NOT NULL,
            data TEXT, -- JSON data
            read BOOLEAN NOT NULL DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (puuid) REFERENCES user_session(puuid) ON DELETE CASCADE
          );

          CREATE INDEX idx_cached_content_type ON cached_content(content_type);
          CREATE INDEX idx_cached_content_premium ON cached_content(is_premium);
          CREATE INDEX idx_cached_content_expires ON cached_content(expires_at);
          CREATE INDEX idx_notification_settings_puuid ON notification_settings(puuid);
          CREATE INDEX idx_notification_history_puuid ON notification_history(puuid);
          CREATE INDEX idx_notification_history_read ON notification_history(read);
        `);
      },

      // Migration 4: VOD analysis and expert reviews
      (db) => {
        db.exec(`
          -- VOD uploads table
          CREATE TABLE vod_uploads (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            puuid TEXT NOT NULL,
            upload_id TEXT UNIQUE NOT NULL,
            filename TEXT NOT NULL,
            file_size INTEGER NOT NULL,
            file_path TEXT NOT NULL,
            upload_status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed'
            analysis_type TEXT NOT NULL, -- 'ai_only', 'expert_review'
            match_id TEXT,
            agent_id TEXT,
            map_id TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (puuid) REFERENCES user_session(puuid) ON DELETE CASCADE
          );

          -- VOD analysis results table
          CREATE TABLE vod_analysis (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            upload_id TEXT NOT NULL,
            analysis_type TEXT NOT NULL, -- 'ai_analysis', 'expert_review'
            analysis_data TEXT NOT NULL, -- JSON analysis results
            score INTEGER, -- overall performance score 0-100
            key_insights TEXT, -- JSON array of insights
            improvement_areas TEXT, -- JSON array of areas to improve
            timestamps TEXT, -- JSON array of important timestamps
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (upload_id) REFERENCES vod_uploads(upload_id) ON DELETE CASCADE
          );

          -- Expert review queue table
          CREATE TABLE expert_review_queue (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            upload_id TEXT NOT NULL,
            expert_id TEXT,
            priority INTEGER NOT NULL DEFAULT 0,
            status TEXT NOT NULL DEFAULT 'queued', -- 'queued', 'assigned', 'in_progress', 'completed'
            requested_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            assigned_at DATETIME,
            completed_at DATETIME,
            FOREIGN KEY (upload_id) REFERENCES vod_uploads(upload_id) ON DELETE CASCADE
          );

          CREATE INDEX idx_vod_uploads_puuid ON vod_uploads(puuid);
          CREATE INDEX idx_vod_uploads_status ON vod_uploads(upload_status);
          CREATE INDEX idx_vod_analysis_upload ON vod_analysis(upload_id);
          CREATE INDEX idx_expert_queue_status ON expert_review_queue(status);
        `);
      },

      // Migration 5: Analytics and performance tracking
      (db) => {
        db.exec(`
          -- App usage analytics table
          CREATE TABLE app_analytics (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            puuid TEXT,
            event_type TEXT NOT NULL, -- 'app_start', 'feature_use', 'error', 'performance'
            event_name TEXT NOT NULL,
            event_data TEXT, -- JSON event data
            session_id TEXT NOT NULL,
            timestamp INTEGER NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (puuid) REFERENCES user_session(puuid) ON DELETE CASCADE
          );

          -- Performance metrics table
          CREATE TABLE performance_metrics (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            metric_type TEXT NOT NULL, -- 'startup_time', 'memory_usage', 'cpu_usage', 'api_response_time'
            metric_value REAL NOT NULL,
            timestamp INTEGER NOT NULL,
            additional_data TEXT, -- JSON additional metrics
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
          );

          -- Error logs table
          CREATE TABLE error_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            puuid TEXT,
            error_type TEXT NOT NULL,
            error_message TEXT NOT NULL,
            error_stack TEXT,
            context TEXT, -- JSON context data
            resolved BOOLEAN NOT NULL DEFAULT 0,
            timestamp INTEGER NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (puuid) REFERENCES user_session(puuid) ON DELETE CASCADE
          );

          CREATE INDEX idx_app_analytics_puuid ON app_analytics(puuid);
          CREATE INDEX idx_app_analytics_event ON app_analytics(event_type, event_name);
          CREATE INDEX idx_app_analytics_timestamp ON app_analytics(timestamp);
          CREATE INDEX idx_performance_metrics_type ON performance_metrics(metric_type);
          CREATE INDEX idx_performance_metrics_timestamp ON performance_metrics(timestamp);
          CREATE INDEX idx_error_logs_puuid ON error_logs(puuid);
          CREATE INDEX idx_error_logs_resolved ON error_logs(resolved);
        `);
      }
    ];
  }
}
```

## Data Models and Repositories

### User Repository
**File**: `src/database/repositories/UserRepository.ts`
```typescript
import { DatabaseManager } from '../DatabaseManager';

export interface User {
  id?: number;
  puuid: string;
  gameName: string;
  tagLine: string;
  region: string;
  locale: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserSettings {
  id?: number;
  puuid: string;
  settingKey: string;
  settingValue: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class UserRepository {
  private db: DatabaseManager;

  constructor(db: DatabaseManager) {
    this.db = db;
  }

  public async createOrUpdateUser(user: User): Promise<User> {
    const existing = await this.getUserByPUUID(user.puuid);
    
    if (existing) {
      return this.updateUser(user.puuid, user);
    } else {
      return this.createUser(user);
    }
  }

  public async createUser(user: User): Promise<User> {
    const result = this.db.execute(`
      INSERT INTO user_session (puuid, game_name, tag_line, region, locale)
      VALUES (?, ?, ?, ?, ?)
    `, [user.puuid, user.gameName, user.tagLine, user.region, user.locale]);

    return {
      ...user,
      id: result.lastInsertRowid as number,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  public async updateUser(puuid: string, updates: Partial<User>): Promise<User> {
    const setClause = [];
    const values = [];

    if (updates.gameName) {
      setClause.push('game_name = ?');
      values.push(updates.gameName);
    }
    if (updates.tagLine) {
      setClause.push('tag_line = ?');
      values.push(updates.tagLine);
    }
    if (updates.region) {
      setClause.push('region = ?');
      values.push(updates.region);
    }
    if (updates.locale) {
      setClause.push('locale = ?');
      values.push(updates.locale);
    }

    setClause.push('updated_at = CURRENT_TIMESTAMP');
    values.push(puuid);

    this.db.execute(`
      UPDATE user_session 
      SET ${setClause.join(', ')}
      WHERE puuid = ?
    `, values);

    return this.getUserByPUUID(puuid)!;
  }

  public async getUserByPUUID(puuid: string): Promise<User | null> {
    return this.db.queryFirst<User>(`
      SELECT id, puuid, game_name as gameName, tag_line as tagLine, 
             region, locale, created_at as createdAt, updated_at as updatedAt
      FROM user_session 
      WHERE puuid = ?
    `, [puuid]);
  }

  public async deleteUser(puuid: string): Promise<void> {
    this.db.execute('DELETE FROM user_session WHERE puuid = ?', [puuid]);
  }

  public async getUserSetting(puuid: string, key: string): Promise<string | null> {
    const result = this.db.queryFirst<{ settingValue: string }>(`
      SELECT setting_value as settingValue 
      FROM user_settings 
      WHERE puuid = ? AND setting_key = ?
    `, [puuid, key]);

    return result?.settingValue || null;
  }

  public async setUserSetting(puuid: string, key: string, value: string): Promise<void> {
    this.db.execute(`
      INSERT OR REPLACE INTO user_settings (puuid, setting_key, setting_value, updated_at)
      VALUES (?, ?, ?, CURRENT_TIMESTAMP)
    `, [puuid, key, value]);
  }

  public async getUserSettings(puuid: string): Promise<Record<string, string>> {
    const settings = this.db.query<{ settingKey: string; settingValue: string }>(`
      SELECT setting_key as settingKey, setting_value as settingValue
      FROM user_settings 
      WHERE puuid = ?
    `, [puuid]);

    const result: Record<string, string> = {};
    for (const setting of settings) {
      result[setting.settingKey] = setting.settingValue;
    }

    return result;
  }

  public async deleteUserSetting(puuid: string, key: string): Promise<void> {
    this.db.execute(`
      DELETE FROM user_settings 
      WHERE puuid = ? AND setting_key = ?
    `, [puuid, key]);
  }
}
```

### Match Repository
**File**: `src/database/repositories/MatchRepository.ts`
```typescript
import { DatabaseManager } from '../DatabaseManager';

export interface MatchRecord {
  id?: number;
  matchId: string;
  puuid: string;
  gameStartTime: number;
  gameEndTime: number;
  queueId: string;
  gameMode: string;
  mapId: string;
  isRanked: boolean;
  seasonId: string;
  roundsPlayed: number;
  teamWon: boolean;
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
  createdAt?: Date;
}

export interface MatchFilters {
  puuid?: string;
  mapId?: string;
  characterId?: string;
  isRanked?: boolean;
  gameMode?: string;
  dateFrom?: Date;
  dateTo?: Date;
  limit?: number;
  offset?: number;
}

export class MatchRepository {
  private db: DatabaseManager;

  constructor(db: DatabaseManager) {
    this.db = db;
  }

  public async saveMatch(match: MatchRecord): Promise<MatchRecord> {
    const result = this.db.execute(`
      INSERT OR REPLACE INTO matches (
        match_id, puuid, game_start_time, game_end_time, queue_id,
        game_mode, map_id, is_ranked, season_id, rounds_played,
        team_won, character_id, kills, deaths, assists, score,
        economy_rating, first_bloods, first_blood_victims,
        headshots, bodyshots, legshots, damage_dealt,
        damage_received, money_spent, loadout_value
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      match.matchId, match.puuid, match.gameStartTime, match.gameEndTime,
      match.queueId, match.gameMode, match.mapId, match.isRanked ? 1 : 0,
      match.seasonId, match.roundsPlayed, match.teamWon ? 1 : 0,
      match.characterId, match.kills, match.deaths, match.assists,
      match.score, match.economyRating, match.firstBloods,
      match.firstBloodVictims, match.headshots, match.bodyshots,
      match.legshots, match.damageDealt, match.damageReceived,
      match.moneySpent, match.loadoutValue
    ]);

    return {
      ...match,
      id: result.lastInsertRowid as number,
      createdAt: new Date()
    };
  }

  public async getMatches(filters: MatchFilters = {}): Promise<MatchRecord[]> {
    const conditions = [];
    const params = [];

    if (filters.puuid) {
      conditions.push('puuid = ?');
      params.push(filters.puuid);
    }

    if (filters.mapId) {
      conditions.push('map_id = ?');
      params.push(filters.mapId);
    }

    if (filters.characterId) {
      conditions.push('character_id = ?');
      params.push(filters.characterId);
    }

    if (filters.isRanked !== undefined) {
      conditions.push('is_ranked = ?');
      params.push(filters.isRanked ? 1 : 0);
    }

    if (filters.gameMode) {
      conditions.push('game_mode = ?');
      params.push(filters.gameMode);
    }

    if (filters.dateFrom) {
      conditions.push('game_start_time >= ?');
      params.push(filters.dateFrom.getTime());
    }

    if (filters.dateTo) {
      conditions.push('game_start_time <= ?');
      params.push(filters.dateTo.getTime());
    }

    let sql = `
      SELECT 
        id, match_id as matchId, puuid, game_start_time as gameStartTime,
        game_end_time as gameEndTime, queue_id as queueId, game_mode as gameMode,
        map_id as mapId, is_ranked as isRanked, season_id as seasonId,
        rounds_played as roundsPlayed, team_won as teamWon, character_id as characterId,
        kills, deaths, assists, score, economy_rating as economyRating,
        first_bloods as firstBloods, first_blood_victims as firstBloodVictims,
        headshots, bodyshots, legshots, damage_dealt as damageDealt,
        damage_received as damageReceived, money_spent as moneySpent,
        loadout_value as loadoutValue, created_at as createdAt
      FROM matches
    `;

    if (conditions.length > 0) {
      sql += ` WHERE ${conditions.join(' AND ')}`;
    }

    sql += ' ORDER BY game_start_time DESC';

    if (filters.limit) {
      sql += ` LIMIT ${filters.limit}`;
      if (filters.offset) {
        sql += ` OFFSET ${filters.offset}`;
      }
    }

    const matches = this.db.query<any>(sql, params);
    
    return matches.map(match => ({
      ...match,
      isRanked: Boolean(match.isRanked),
      teamWon: Boolean(match.teamWon),
      createdAt: new Date(match.createdAt)
    }));
  }

  public async getMatchById(matchId: string): Promise<MatchRecord | null> {
    const matches = await this.getMatches({ limit: 1 });
    return matches.length > 0 ? matches[0] : null;
  }

  public async getMatchStatistics(puuid: string): Promise<any> {
    const stats = this.db.queryFirst<any>(`
      SELECT 
        COUNT(*) as totalMatches,
        SUM(CASE WHEN team_won = 1 THEN 1 ELSE 0 END) as wins,
        SUM(CASE WHEN team_won = 0 THEN 1 ELSE 0 END) as losses,
        AVG(kills) as avgKills,
        AVG(deaths) as avgDeaths,
        AVG(assists) as avgAssists,
        AVG(score) as avgScore,
        AVG(economy_rating) as avgEconomyRating,
        SUM(headshots) as totalHeadshots,
        SUM(bodyshots + headshots + legshots) as totalShots,
        AVG(damage_dealt) as avgDamage,
        MAX(kills) as bestKills,
        MAX(score) as bestScore
      FROM matches 
      WHERE puuid = ?
    `, [puuid]);

    if (!stats || stats.totalMatches === 0) {
      return this.getEmptyStats();
    }

    return {
      totalMatches: stats.totalMatches,
      wins: stats.wins,
      losses: stats.losses,
      winRate: (stats.wins / stats.totalMatches) * 100,
      averageKDA: stats.avgDeaths > 0 ? (stats.avgKills + stats.avgAssists) / stats.avgDeaths : stats.avgKills + stats.avgAssists,
      averageACS: stats.avgScore,
      headshotPercentage: stats.totalShots > 0 ? (stats.totalHeadshots / stats.totalShots) * 100 : 0,
      averageEconomyRating: stats.avgEconomyRating,
      averageDamage: stats.avgDamage,
      bestKills: stats.bestKills,
      bestScore: stats.bestScore
    };
  }

  public async getAgentStatistics(puuid: string): Promise<any[]> {
    return this.db.query<any>(`
      SELECT 
        character_id as agentId,
        COUNT(*) as matchesPlayed,
        SUM(CASE WHEN team_won = 1 THEN 1 ELSE 0 END) as wins,
        AVG(kills) as avgKills,
        AVG(deaths) as avgDeaths,
        AVG(assists) as avgAssists,
        AVG(score) as avgScore,
        AVG(economy_rating) as avgEconomyRating
      FROM matches 
      WHERE puuid = ?
      GROUP BY character_id
      ORDER BY matchesPlayed DESC
    `, [puuid]);
  }

  public async getMapStatistics(puuid: string): Promise<any[]> {
    return this.db.query<any>(`
      SELECT 
        map_id as mapId,
        COUNT(*) as matchesPlayed,
        SUM(CASE WHEN team_won = 1 THEN 1 ELSE 0 END) as wins,
        AVG(rounds_played) as avgRounds,
        AVG(score) as avgScore
      FROM matches 
      WHERE puuid = ?
      GROUP BY map_id
      ORDER BY matchesPlayed DESC
    `, [puuid]);
  }

  public async deleteOldMatches(puuid: string, keepCount: number = 100): Promise<number> {
    const result = this.db.execute(`
      DELETE FROM matches 
      WHERE puuid = ? 
      AND id NOT IN (
        SELECT id FROM matches 
        WHERE puuid = ? 
        ORDER BY game_start_time DESC 
        LIMIT ?
      )
    `, [puuid, puuid, keepCount]);

    return result.changes;
  }

  private getEmptyStats(): any {
    return {
      totalMatches: 0,
      wins: 0,
      losses: 0,
      winRate: 0,
      averageKDA: 0,
      averageACS: 0,
      headshotPercentage: 0,
      averageEconomyRating: 0,
      averageDamage: 0,
      bestKills: 0,
      bestScore: 0
    };
  }
}
```

### AI Repository
**File**: `src/database/repositories/AIRepository.ts`
```typescript
import { DatabaseManager } from '../DatabaseManager';

export interface AIQuery {
  id?: number;
  puuid: string;
  queryText: string;
  responseText: string;
  queryType: 'general' | 'stats_analysis' | 'strategy';
  tokensUsed: number;
  responseTime: number;
  createdAt?: Date;
}

export interface AIUsage {
  id?: number;
  puuid: string;
  date: string; // YYYY-MM-DD
  queryCount: number;
  tokensUsed: number;
  tier: 'free' | 'premium';
  createdAt?: Date;
  updatedAt?: Date;
}

export class AIRepository {
  private db: DatabaseManager;

  constructor(db: DatabaseManager) {
    this.db = db;
  }

  public async saveQuery(query: AIQuery): Promise<AIQuery> {
    const result = this.db.execute(`
      INSERT INTO ai_queries (puuid, query_text, response_text, query_type, tokens_used, response_time)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [query.puuid, query.queryText, query.responseText, query.queryType, query.tokensUsed, query.responseTime]);

    return {
      ...query,
      id: result.lastInsertRowid as number,
      createdAt: new Date()
    };
  }

  public async getQueryHistory(puuid: string, limit: number = 50, offset: number = 0): Promise<AIQuery[]> {
    return this.db.query<AIQuery>(`
      SELECT 
        id, puuid, query_text as queryText, response_text as responseText,
        query_type as queryType, tokens_used as tokensUsed,
        response_time as responseTime, created_at as createdAt
      FROM ai_queries 
      WHERE puuid = ?
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `, [puuid, limit, offset]);
  }

  public async getDailyUsage(puuid: string, date?: string): Promise<AIUsage | null> {
    const queryDate = date || new Date().toISOString().split('T')[0];
    
    return this.db.queryFirst<AIUsage>(`
      SELECT 
        id, puuid, date, query_count as queryCount,
        tokens_used as tokensUsed, tier,
        created_at as createdAt, updated_at as updatedAt
      FROM ai_usage 
      WHERE puuid = ? AND date = ?
    `, [puuid, queryDate]);
  }

  public async updateDailyUsage(puuid: string, tier: 'free' | 'premium', tokensUsed: number = 0): Promise<void> {
    const today = new Date().toISOString().split('T')[0];
    
    this.db.execute(`
      INSERT INTO ai_usage (puuid, date, query_count, tokens_used, tier, updated_at)
      VALUES (?, ?, 1, ?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(puuid, date) DO UPDATE SET
        query_count = query_count + 1,
        tokens_used = tokens_used + ?,
        tier = ?,
        updated_at = CURRENT_TIMESTAMP
    `, [puuid, today, tokensUsed, tier, tokensUsed, tier]);
  }

  public async canMakeQuery(puuid: string, tier: 'free' | 'premium'): Promise<boolean> {
    const usage = await this.getDailyUsage(puuid);
    
    if (!usage) {
      return true; // No usage recorded yet
    }

    if (tier === 'premium') {
      return true; // Premium users have unlimited queries
    }

    // Free tier limit: 5 queries per day
    return usage.queryCount < 5;
  }

  public async getUsageStatistics(puuid: string, days: number = 30): Promise<any> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    const startDateStr = startDate.toISOString().split('T')[0];

    return this.db.queryFirst<any>(`
      SELECT 
        COUNT(*) as totalDays,
        SUM(query_count) as totalQueries,
        SUM(tokens_used) as totalTokens,
        AVG(query_count) as avgQueriesPerDay,
        MAX(query_count) as maxQueriesInDay
      FROM ai_usage 
      WHERE puuid = ? AND date >= ?
    `, [puuid, startDateStr]);
  }

  public async findSimilarQueries(puuid: string, queryText: string, limit: number = 5): Promise<AIQuery[]> {
    // Simple similarity search using LIKE
    // In a production app, you might want to use FTS or vector similarity
    const searchTerms = queryText.toLowerCase().split(' ').filter(term => term.length > 3);
    
    if (searchTerms.length === 0) {
      return [];
    }

    const likeConditions = searchTerms.map(() => 'LOWER(query_text) LIKE ?').join(' OR ');
    const params = [puuid, ...searchTerms.map(term => `%${term}%`)];

    return this.db.query<AIQuery>(`
      SELECT 
        id, puuid, query_text as queryText, response_text as responseText,
        query_type as queryType, tokens_used as tokensUsed,
        response_time as responseTime, created_at as createdAt
      FROM ai_queries 
      WHERE puuid = ? AND (${likeConditions})
      ORDER BY created_at DESC
      LIMIT ?
    `, [...params, limit]);
  }

  public async deleteOldQueries(puuid: string, keepDays: number = 90): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - keepDays);
    
    const result = this.db.execute(`
      DELETE FROM ai_queries 
      WHERE puuid = ? AND created_at < ?
    `, [puuid, cutoffDate.toISOString()]);

    return result.changes;
  }

  public async getQueryTypeStatistics(puuid: string): Promise<any[]> {
    return this.db.query<any>(`
      SELECT 
        query_type as queryType,
        COUNT(*) as count,
        AVG(tokens_used) as avgTokens,
        AVG(response_time) as avgResponseTime
      FROM ai_queries 
      WHERE puuid = ?
      GROUP BY query_type
      ORDER BY count DESC
    `, [puuid]);
  }
}
```

## Database Maintenance

### Maintenance Manager
**File**: `src/database/MaintenanceManager.ts`
```typescript
import { DatabaseManager } from './DatabaseManager';
import { logger } from '../utils/logger';
import { app } from 'electron';
import path from 'path';
import fs from 'fs';

export class MaintenanceManager {
  private db: DatabaseManager;
  private maintenanceInterval: NodeJS.Timeout | null = null;

  constructor(db: DatabaseManager) {
    this.db = db;
  }

  public startMaintenance(): void {
    // Run maintenance every 24 hours
    this.maintenanceInterval = setInterval(() => {
      this.runMaintenance();
    }, 24 * 60 * 60 * 1000);

    // Run initial maintenance after 5 minutes
    setTimeout(() => {
      this.runMaintenance();
    }, 5 * 60 * 1000);
  }

  public stopMaintenance(): void {
    if (this.maintenanceInterval) {
      clearInterval(this.maintenanceInterval);
      this.maintenanceInterval = null;
    }
  }

  private async runMaintenance(): Promise<void> {
    try {
      logger.info('Starting database maintenance');

      await this.cleanupOldData();
      await this.optimizeDatabase();
      await this.createBackup();
      await this.checkDatabaseHealth();

      logger.info('Database maintenance completed');
    } catch (error) {
      logger.error('Database maintenance failed:', error);
    }
  }

  private async cleanupOldData(): Promise<void> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 90); // Keep 90 days of data

    // Clean old AI queries
    const aiResult = this.db.execute(`
      DELETE FROM ai_queries 
      WHERE created_at < ?
    `, [cutoffDate.toISOString()]);

    // Clean old analytics
    const analyticsResult = this.db.execute(`
      DELETE FROM app_analytics 
      WHERE created_at < ?
    `, [cutoffDate.toISOString()]);

    // Clean old performance metrics
    const metricsResult = this.db.execute(`
      DELETE FROM performance_metrics 
      WHERE created_at < ?
    `, [cutoffDate.toISOString()]);

    // Clean old error logs (keep resolved ones for 30 days, unresolved for 90 days)
    const errorCutoff = new Date();
    errorCutoff.setDate(errorCutoff.getDate() - 30);
    
    const errorResult = this.db.execute(`
      DELETE FROM error_logs 
      WHERE resolved = 1 AND created_at < ?
    `, [errorCutoff.toISOString()]);

    logger.info('Cleanup completed:', {
      aiQueries: aiResult.changes,
      analytics: analyticsResult.changes,
      metrics: metricsResult.changes,
      errors: errorResult.changes
    });
  }

  private async optimizeDatabase(): Promise<void> {
    // Analyze tables for query optimization
    this.db.execute('ANALYZE');

    // Vacuum database to reclaim space
    this.db.vacuum();

    // Update statistics
    this.db.execute('PRAGMA optimize');

    logger.info('Database optimization completed');
  }

  private async createBackup(): Promise<void> {
    try {
      const backupDir = path.join(app.getPath('userData'), 'backups');
      
      if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir, { recursive: true });
      }

      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupPath = path.join(backupDir, `backup-${timestamp}.db`);

      this.db.backup(backupPath);

      // Keep only last 7 backups
      this.cleanupOldBackups(backupDir, 7);

      logger.info(`Database backup created: ${backupPath}`);
    } catch (error) {
      logger.error('Backup creation failed:', error);
    }
  }

  private cleanupOldBackups(backupDir: string, keepCount: number): void {
    try {
      const files = fs.readdirSync(backupDir)
        .filter(file => file.startsWith('backup-') && file.endsWith('.db'))
        .map(file => ({
          name: file,
          path: path.join(backupDir, file),
          stat: fs.statSync(path.join(backupDir, file))
        }))
        .sort((a, b) => b.stat.mtime.getTime() - a.stat.mtime.getTime());

      // Delete old backups
      for (let i = keepCount; i < files.length; i++) {
        fs.unlinkSync(files[i].path);
        logger.debug(`Deleted old backup: ${files[i].name}`);
      }
    } catch (error) {
      logger.error('Backup cleanup failed:', error);
    }
  }

  private async checkDatabaseHealth(): Promise<void> {
    try {
      // Check database integrity
      const integrityResult = this.db.queryFirst<{ integrity_check: string }>('PRAGMA integrity_check');
      
      if (integrityResult?.integrity_check !== 'ok') {
        logger.error('Database integrity check failed:', integrityResult);
      }

      // Check foreign key constraints
      const foreignKeyResult = this.db.query('PRAGMA foreign_key_check');
      
      if (foreignKeyResult.length > 0) {
        logger.error('Foreign key constraint violations found:', foreignKeyResult);
      }

      // Log database statistics
      const stats = this.getDatabaseStatistics();
      logger.info('Database health check completed:', stats);

    } catch (error) {
      logger.error('Database health check failed:', error);
    }
  }

  private getDatabaseStatistics(): any {
    const tables = [
      'user_session', 'matches', 'ai_queries', 'cached_content',
      'subscriptions', 'vod_uploads', 'app_analytics'
    ];

    const stats: any = {};

    for (const table of tables) {
      try {
        const count = this.db.queryFirst<{ count: number }>(`SELECT COUNT(*) as count FROM ${table}`);
        stats[table] = count?.count || 0;
      } catch (error) {
        stats[table] = 'error';
      }
    }

    return stats;
  }

  public async exportUserData(puuid: string): Promise<any> {
    try {
      const userData = {
        profile: this.db.queryFirst('SELECT * FROM user_session WHERE puuid = ?', [puuid]),
        settings: this.db.query('SELECT * FROM user_settings WHERE puuid = ?', [puuid]),
        matches: this.db.query('SELECT * FROM matches WHERE puuid = ? ORDER BY game_start_time DESC LIMIT 100', [puuid]),
        aiQueries: this.db.query('SELECT * FROM ai_queries WHERE puuid = ? ORDER BY created_at DESC LIMIT 50', [puuid]),
        favorites: this.db.query('SELECT * FROM favorites WHERE puuid = ?', [puuid]),
        subscriptions: this.db.query('SELECT * FROM subscriptions WHERE puuid = ?', [puuid])
      };

      return userData;
    } catch (error) {
      logger.error('User data export failed:', error);
      throw error;
    }
  }

  public async deleteUserData(puuid: string): Promise<void> {
    try {
      // Delete user data (cascading deletes will handle related records)
      this.db.execute('DELETE FROM user_session WHERE puuid = ?', [puuid]);
      
      logger.info(`User data deleted for PUUID: ${puuid}`);
    } catch (error) {
      logger.error('User data deletion failed:', error);
      throw error;
    }
  }
}
```

This comprehensive database schema and management system provides a solid foundation for the VALORANT-HUB Desktop App, with proper encryption, performance optimization, and maintenance procedures.
