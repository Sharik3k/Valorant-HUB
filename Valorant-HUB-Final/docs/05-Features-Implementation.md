# VALORANT-HUB Desktop App - Features Implementation

## Overview
This document details the implementation of all major features for the VALORANT-HUB Desktop App, including free tier functionality, premium features, AI assistant, VOD analysis, and monetization systems.

## Free Tier Features

### Content Management System
**File**: `src/services/ContentService.ts`
```typescript
import { RiotAPIClient } from '../api/RiotAPIClient';
import { DatabaseManager } from '../database/DatabaseManager';

export interface ContentItem {
  id: string;
  type: 'guide' | 'article' | 'news' | 'patch_note' | 'video';
  title: string;
  content: string;
  summary: string;
  author: string;
  tags: string[];
  category: string;
  isPremium: boolean;
  publishedAt: Date;
  updatedAt: Date;
  viewCount: number;
  rating: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedReadTime: number;
  thumbnailUrl?: string;
  videoUrl?: string;
}

export interface ContentFilters {
  type?: string[];
  category?: string[];
  tags?: string[];
  difficulty?: string[];
  isPremium?: boolean;
  search?: string;
  limit?: number;
  offset?: number;
  sortBy?: 'newest' | 'popular' | 'rating';
}

export class ContentService {
  private apiClient: RiotAPIClient;
  private db: DatabaseManager;
  private cacheExpiry = 30 * 60 * 1000; // 30 minutes

  constructor(apiClient: RiotAPIClient, db: DatabaseManager) {
    this.apiClient = apiClient;
    this.db = db;
  }

  public async getContent(filters: ContentFilters = {}): Promise<ContentItem[]> {
    try {
      // Check cache first
      const cachedContent = await this.getCachedContent(filters);
      if (cachedContent.length > 0) {
        return cachedContent;
      }

      // Fetch from API
      const content = await this.fetchContentFromAPI(filters);
      
      // Cache the results
      await this.cacheContent(content);

      return content;
    } catch (error) {
      logger.error('Failed to get content:', error);
      // Return cached content as fallback
      return this.getCachedContent(filters);
    }
  }

  public async getContentById(id: string): Promise<ContentItem | null> {
    try {
      // Check cache first
      const cached = await this.getCachedContentById(id);
      if (cached && !this.isCacheExpired(cached)) {
        await this.incrementViewCount(id);
        return cached;
      }

      // Fetch from API
      const content = await this.apiClient.get<any>(`/content/${id}`);
      const contentItem = this.parseContentItem(content);
      
      // Cache the content
      await this.cacheContentItem(contentItem);
      await this.incrementViewCount(id);

      return contentItem;
    } catch (error) {
      logger.error(`Failed to get content ${id}:`, error);
      return cached || null;
    }
  }

  public async searchContent(query: string, filters: ContentFilters = {}): Promise<ContentItem[]> {
    const searchFilters = { ...filters, search: query };
    return this.getContent(searchFilters);
  }

  public async getFeaturedContent(): Promise<ContentItem[]> {
    return this.getContent({
      sortBy: 'popular',
      limit: 10,
      isPremium: false
    });
  }

  public async getContentByCategory(category: string): Promise<ContentItem[]> {
    return this.getContent({
      category: [category],
      sortBy: 'newest',
      limit: 20
    });
  }

  public async getAgentGuides(agentId?: string): Promise<ContentItem[]> {
    const tags = agentId ? [agentId] : ['agent-guide'];
    return this.getContent({
      type: ['guide'],
      tags,
      sortBy: 'rating',
      limit: 50
    });
  }

  public async getMapGuides(mapId?: string): Promise<ContentItem[]> {
    const tags = mapId ? [mapId] : ['map-guide'];
    return this.getContent({
      type: ['guide'],
      tags,
      sortBy: 'rating',
      limit: 50
    });
  }

  public async getLatestNews(): Promise<ContentItem[]> {
    return this.getContent({
      type: ['news', 'patch_note'],
      sortBy: 'newest',
      limit: 20,
      isPremium: false
    });
  }

  private async fetchContentFromAPI(filters: ContentFilters): Promise<ContentItem[]> {
    const params = this.buildAPIParams(filters);
    const response = await this.apiClient.get<any>('/content', { params });
    
    return response.items.map((item: any) => this.parseContentItem(item));
  }

  private buildAPIParams(filters: ContentFilters): any {
    const params: any = {};

    if (filters.type?.length) params.type = filters.type.join(',');
    if (filters.category?.length) params.category = filters.category.join(',');
    if (filters.tags?.length) params.tags = filters.tags.join(',');
    if (filters.difficulty?.length) params.difficulty = filters.difficulty.join(',');
    if (filters.isPremium !== undefined) params.premium = filters.isPremium;
    if (filters.search) params.search = filters.search;
    if (filters.limit) params.limit = filters.limit;
    if (filters.offset) params.offset = filters.offset;
    if (filters.sortBy) params.sort = filters.sortBy;

    return params;
  }

  private parseContentItem(data: any): ContentItem {
    return {
      id: data.id,
      type: data.type,
      title: data.title,
      content: data.content,
      summary: data.summary || data.content.substring(0, 200) + '...',
      author: data.author,
      tags: data.tags || [],
      category: data.category,
      isPremium: data.is_premium || false,
      publishedAt: new Date(data.published_at),
      updatedAt: new Date(data.updated_at),
      viewCount: data.view_count || 0,
      rating: data.rating || 0,
      difficulty: data.difficulty || 'beginner',
      estimatedReadTime: data.estimated_read_time || this.calculateReadTime(data.content),
      thumbnailUrl: data.thumbnail_url,
      videoUrl: data.video_url
    };
  }

  private calculateReadTime(content: string): number {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  }

  private async getCachedContent(filters: ContentFilters): Promise<ContentItem[]> {
    const conditions = [];
    const params = [];

    if (filters.type?.length) {
      conditions.push(`content_type IN (${filters.type.map(() => '?').join(',')})`);
      params.push(...filters.type);
    }

    if (filters.isPremium !== undefined) {
      conditions.push('is_premium = ?');
      params.push(filters.isPremium ? 1 : 0);
    }

    if (filters.search) {
      conditions.push('(title LIKE ? OR content LIKE ?)');
      params.push(`%${filters.search}%`, `%${filters.search}%`);
    }

    // Only return non-expired cache
    conditions.push('expires_at > ?');
    params.push(Date.now());

    let sql = `
      SELECT 
        content_id as id, content_type as type, title, content,
        author, tags, is_premium as isPremium, published_at as publishedAt,
        view_count as viewCount, created_at as createdAt
      FROM cached_content
    `;

    if (conditions.length > 0) {
      sql += ` WHERE ${conditions.join(' AND ')}`;
    }

    // Apply sorting
    switch (filters.sortBy) {
      case 'popular':
        sql += ' ORDER BY view_count DESC';
        break;
      case 'rating':
        sql += ' ORDER BY view_count DESC'; // Placeholder for rating
        break;
      default:
        sql += ' ORDER BY published_at DESC';
    }

    if (filters.limit) {
      sql += ` LIMIT ${filters.limit}`;
      if (filters.offset) {
        sql += ` OFFSET ${filters.offset}`;
      }
    }

    const results = this.db.query<any>(sql, params);
    
    return results.map(item => ({
      ...item,
      tags: item.tags ? JSON.parse(item.tags) : [],
      isPremium: Boolean(item.isPremium),
      publishedAt: new Date(item.publishedAt),
      updatedAt: new Date(item.createdAt),
      summary: item.content.substring(0, 200) + '...',
      category: 'general',
      rating: 0,
      difficulty: 'beginner' as const,
      estimatedReadTime: this.calculateReadTime(item.content)
    }));
  }

  private async getCachedContentById(id: string): Promise<ContentItem | null> {
    const result = this.db.queryFirst<any>(`
      SELECT 
        content_id as id, content_type as type, title, content,
        author, tags, is_premium as isPremium, published_at as publishedAt,
        view_count as viewCount, expires_at as expiresAt, created_at as createdAt
      FROM cached_content
      WHERE content_id = ?
    `, [id]);

    if (!result) return null;

    return {
      ...result,
      tags: result.tags ? JSON.parse(result.tags) : [],
      isPremium: Boolean(result.isPremium),
      publishedAt: new Date(result.publishedAt),
      updatedAt: new Date(result.createdAt),
      summary: result.content.substring(0, 200) + '...',
      category: 'general',
      rating: 0,
      difficulty: 'beginner' as const,
      estimatedReadTime: this.calculateReadTime(result.content)
    };
  }

  private async cacheContent(content: ContentItem[]): Promise<void> {
    const stmt = this.db.prepare(`
      INSERT OR REPLACE INTO cached_content (
        content_type, content_id, title, content, tags, author,
        published_at, expires_at, is_premium, view_count, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `);

    const expiresAt = Date.now() + this.cacheExpiry;

    for (const item of content) {
      stmt.run([
        item.type,
        item.id,
        item.title,
        item.content,
        JSON.stringify(item.tags),
        item.author,
        item.publishedAt.getTime(),
        expiresAt,
        item.isPremium ? 1 : 0,
        item.viewCount
      ]);
    }

    stmt.finalize();
  }

  private async cacheContentItem(item: ContentItem): Promise<void> {
    await this.cacheContent([item]);
  }

  private async incrementViewCount(contentId: string): Promise<void> {
    this.db.execute(`
      UPDATE cached_content 
      SET view_count = view_count + 1, updated_at = CURRENT_TIMESTAMP
      WHERE content_id = ?
    `, [contentId]);
  }

  private isCacheExpired(item: any): boolean {
    return item.expiresAt && Date.now() > item.expiresAt;
  }
}
```

### Forum System
**File**: `src/services/ForumService.ts`
```typescript
import { RiotAPIClient } from '../api/RiotAPIClient';
import { DatabaseManager } from '../database/DatabaseManager';
import { EventEmitter } from 'events';

export interface ForumPost {
  id: string;
  title: string;
  content: string;
  author: {
    puuid: string;
    gameName: string;
    tagLine: string;
    rank?: string;
  };
  category: 'general' | 'lfg' | 'tech_support' | 'strategy' | 'esports';
  tags: string[];
  upvotes: number;
  downvotes: number;
  replyCount: number;
  isSticky: boolean;
  isLocked: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastActivityAt: Date;
}

export interface ForumReply {
  id: string;
  postId: string;
  content: string;
  author: {
    puuid: string;
    gameName: string;
    tagLine: string;
    rank?: string;
  };
  upvotes: number;
  downvotes: number;
  isAccepted: boolean;
  parentReplyId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ForumFilters {
  category?: string;
  tags?: string[];
  search?: string;
  sortBy?: 'newest' | 'popular' | 'activity';
  limit?: number;
  offset?: number;
}

export class ForumService extends EventEmitter {
  private apiClient: RiotAPIClient;
  private db: DatabaseManager;
  private socketConnection: any; // Socket.io connection

  constructor(apiClient: RiotAPIClient, db: DatabaseManager) {
    super();
    this.apiClient = apiClient;
    this.db = db;
    this.initializeSocket();
  }

  private initializeSocket(): void {
    // Initialize Socket.io connection for real-time updates
    // Implementation would depend on Socket.io setup
  }

  public async getPosts(filters: ForumFilters = {}): Promise<ForumPost[]> {
    try {
      const params = this.buildForumParams(filters);
      const response = await this.apiClient.get<any>('/forum/posts', { params });
      
      return response.posts.map((post: any) => this.parseForumPost(post));
    } catch (error) {
      logger.error('Failed to get forum posts:', error);
      return [];
    }
  }

  public async getPostById(postId: string): Promise<ForumPost | null> {
    try {
      const response = await this.apiClient.get<any>(`/forum/posts/${postId}`);
      return this.parseForumPost(response);
    } catch (error) {
      logger.error(`Failed to get post ${postId}:`, error);
      return null;
    }
  }

  public async createPost(post: Omit<ForumPost, 'id' | 'upvotes' | 'downvotes' | 'replyCount' | 'createdAt' | 'updatedAt' | 'lastActivityAt'>): Promise<ForumPost> {
    try {
      const response = await this.apiClient.post<any>('/forum/posts', {
        title: post.title,
        content: post.content,
        category: post.category,
        tags: post.tags
      });

      const newPost = this.parseForumPost(response);
      this.emit('postCreated', newPost);
      
      return newPost;
    } catch (error) {
      logger.error('Failed to create post:', error);
      throw error;
    }
  }

  public async updatePost(postId: string, updates: Partial<ForumPost>): Promise<ForumPost> {
    try {
      const response = await this.apiClient.put<any>(`/forum/posts/${postId}`, updates);
      const updatedPost = this.parseForumPost(response);
      
      this.emit('postUpdated', updatedPost);
      return updatedPost;
    } catch (error) {
      logger.error(`Failed to update post ${postId}:`, error);
      throw error;
    }
  }

  public async deletePost(postId: string): Promise<void> {
    try {
      await this.apiClient.delete(`/forum/posts/${postId}`);
      this.emit('postDeleted', postId);
    } catch (error) {
      logger.error(`Failed to delete post ${postId}:`, error);
      throw error;
    }
  }

  public async getReplies(postId: string, limit: number = 50, offset: number = 0): Promise<ForumReply[]> {
    try {
      const response = await this.apiClient.get<any>(`/forum/posts/${postId}/replies`, {
        params: { limit, offset }
      });
      
      return response.replies.map((reply: any) => this.parseForumReply(reply));
    } catch (error) {
      logger.error(`Failed to get replies for post ${postId}:`, error);
      return [];
    }
  }

  public async createReply(reply: Omit<ForumReply, 'id' | 'upvotes' | 'downvotes' | 'createdAt' | 'updatedAt'>): Promise<ForumReply> {
    try {
      const response = await this.apiClient.post<any>(`/forum/posts/${reply.postId}/replies`, {
        content: reply.content,
        parentReplyId: reply.parentReplyId
      });

      const newReply = this.parseForumReply(response);
      this.emit('replyCreated', newReply);
      
      return newReply;
    } catch (error) {
      logger.error('Failed to create reply:', error);
      throw error;
    }
  }

  public async votePost(postId: string, voteType: 'up' | 'down'): Promise<void> {
    try {
      await this.apiClient.post(`/forum/posts/${postId}/vote`, { type: voteType });
      this.emit('postVoted', { postId, voteType });
    } catch (error) {
      logger.error(`Failed to vote on post ${postId}:`, error);
      throw error;
    }
  }

  public async voteReply(replyId: string, voteType: 'up' | 'down'): Promise<void> {
    try {
      await this.apiClient.post(`/forum/replies/${replyId}/vote`, { type: voteType });
      this.emit('replyVoted', { replyId, voteType });
    } catch (error) {
      logger.error(`Failed to vote on reply ${replyId}:`, error);
      throw error;
    }
  }

  public async reportContent(contentId: string, contentType: 'post' | 'reply', reason: string): Promise<void> {
    try {
      await this.apiClient.post('/forum/report', {
        contentId,
        contentType,
        reason
      });
      
      this.emit('contentReported', { contentId, contentType, reason });
    } catch (error) {
      logger.error(`Failed to report ${contentType} ${contentId}:`, error);
      throw error;
    }
  }

  public async searchPosts(query: string, filters: ForumFilters = {}): Promise<ForumPost[]> {
    return this.getPosts({ ...filters, search: query });
  }

  public async getMyPosts(puuid: string): Promise<ForumPost[]> {
    try {
      const response = await this.apiClient.get<any>(`/forum/users/${puuid}/posts`);
      return response.posts.map((post: any) => this.parseForumPost(post));
    } catch (error) {
      logger.error(`Failed to get posts for user ${puuid}:`, error);
      return [];
    }
  }

  public async getMyReplies(puuid: string): Promise<ForumReply[]> {
    try {
      const response = await this.apiClient.get<any>(`/forum/users/${puuid}/replies`);
      return response.replies.map((reply: any) => this.parseForumReply(reply));
    } catch (error) {
      logger.error(`Failed to get replies for user ${puuid}:`, error);
      return [];
    }
  }

  private buildForumParams(filters: ForumFilters): any {
    const params: any = {};

    if (filters.category) params.category = filters.category;
    if (filters.tags?.length) params.tags = filters.tags.join(',');
    if (filters.search) params.search = filters.search;
    if (filters.sortBy) params.sort = filters.sortBy;
    if (filters.limit) params.limit = filters.limit;
    if (filters.offset) params.offset = filters.offset;

    return params;
  }

  private parseForumPost(data: any): ForumPost {
    return {
      id: data.id,
      title: data.title,
      content: data.content,
      author: {
        puuid: data.author.puuid,
        gameName: data.author.game_name,
        tagLine: data.author.tag_line,
        rank: data.author.rank
      },
      category: data.category,
      tags: data.tags || [],
      upvotes: data.upvotes || 0,
      downvotes: data.downvotes || 0,
      replyCount: data.reply_count || 0,
      isSticky: data.is_sticky || false,
      isLocked: data.is_locked || false,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
      lastActivityAt: new Date(data.last_activity_at)
    };
  }

  private parseForumReply(data: any): ForumReply {
    return {
      id: data.id,
      postId: data.post_id,
      content: data.content,
      author: {
        puuid: data.author.puuid,
        gameName: data.author.game_name,
        tagLine: data.author.tag_line,
        rank: data.author.rank
      },
      upvotes: data.upvotes || 0,
      downvotes: data.downvotes || 0,
      isAccepted: data.is_accepted || false,
      parentReplyId: data.parent_reply_id,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at)
    };
  }
}
```

## AI Assistant System

### AI Assistant Service
**File**: `src/services/AIAssistantService.ts`
```typescript
import OpenAI from 'openai';
import { AIRepository } from '../database/repositories/AIRepository';
import { UserRepository } from '../database/repositories/UserRepository';
import { MatchRepository } from '../database/repositories/MatchRepository';
import { ContentService } from './ContentService';

export interface AIQuery {
  text: string;
  type: 'general' | 'stats_analysis' | 'strategy' | 'agent_help' | 'map_help';
  context?: {
    userStats?: any;
    recentMatches?: any[];
    currentAgent?: string;
    currentMap?: string;
  };
}

export interface AIResponse {
  text: string;
  type: 'text' | 'structured' | 'recommendations';
  data?: any;
  sources?: string[];
  tokensUsed: number;
  responseTime: number;
}

export class AIAssistantService {
  private openai: OpenAI;
  private aiRepo: AIRepository;
  private userRepo: UserRepository;
  private matchRepo: MatchRepository;
  private contentService: ContentService;
  private knowledgeBase: Map<string, any> = new Map();

  constructor(
    apiKey: string,
    aiRepo: AIRepository,
    userRepo: UserRepository,
    matchRepo: MatchRepository,
    contentService: ContentService
  ) {
    this.openai = new OpenAI({ apiKey });
    this.aiRepo = aiRepo;
    this.userRepo = userRepo;
    this.matchRepo = matchRepo;
    this.contentService = contentService;
    
    this.initializeKnowledgeBase();
  }

  public async processQuery(puuid: string, query: AIQuery, tier: 'free' | 'premium'): Promise<AIResponse> {
    const startTime = Date.now();

    try {
      // Check if user can make query
      const canQuery = await this.aiRepo.canMakeQuery(puuid, tier);
      if (!canQuery) {
        throw new Error('Daily query limit exceeded. Upgrade to premium for unlimited queries.');
      }

      // Check for similar recent queries
      if (tier === 'free') {
        const similarQueries = await this.aiRepo.findSimilarQueries(puuid, query.text, 3);
        if (similarQueries.length > 0) {
          const cached = similarQueries[0];
          return {
            text: cached.responseText,
            type: 'text',
            tokensUsed: 0,
            responseTime: Date.now() - startTime
          };
        }
      }

      // Prepare context
      const context = await this.prepareContext(puuid, query, tier);
      
      // Generate response
      const response = await this.generateResponse(query, context, tier);
      
      // Save query and update usage
      await this.aiRepo.saveQuery({
        puuid,
        queryText: query.text,
        responseText: response.text,
        queryType: query.type,
        tokensUsed: response.tokensUsed,
        responseTime: response.responseTime
      });

      await this.aiRepo.updateDailyUsage(puuid, tier, response.tokensUsed);

      return response;

    } catch (error) {
      logger.error('AI query processing failed:', error);
      throw error;
    }
  }

  private async prepareContext(puuid: string, query: AIQuery, tier: 'free' | 'premium'): Promise<any> {
    const context: any = {
      userTier: tier,
      timestamp: new Date().toISOString()
    };

    // Add user profile
    const user = await this.userRepo.getUserByPUUID(puuid);
    if (user) {
      context.user = {
        gameName: user.gameName,
        tagLine: user.tagLine,
        region: user.region
      };
    }

    // For premium users or stats-related queries, add detailed stats
    if (tier === 'premium' || query.type === 'stats_analysis') {
      const stats = await this.matchRepo.getMatchStatistics(puuid);
      const recentMatches = await this.matchRepo.getMatches({ puuid, limit: 10 });
      const agentStats = await this.matchRepo.getAgentStatistics(puuid);
      
      context.playerStats = stats;
      context.recentMatches = recentMatches;
      context.agentStats = agentStats;
    }

    // Add relevant knowledge base content
    context.knowledgeBase = this.getRelevantKnowledge(query);

    // Add query-specific context
    if (query.context) {
      context.queryContext = query.context;
    }

    return context;
  }

  private async generateResponse(query: AIQuery, context: any, tier: 'free' | 'premium'): Promise<AIResponse> {
    const startTime = Date.now();

    // Select appropriate model based on tier
    const model = tier === 'premium' ? 'gpt-4' : 'gpt-3.5-turbo';
    
    // Build system prompt
    const systemPrompt = this.buildSystemPrompt(query.type, tier);
    
    // Build user message with context
    const userMessage = this.buildUserMessage(query, context);

    try {
      const completion = await this.openai.chat.completions.create({
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage }
        ],
        max_tokens: tier === 'premium' ? 1500 : 500,
        temperature: 0.7,
        presence_penalty: 0.1,
        frequency_penalty: 0.1
      });

      const responseText = completion.choices[0]?.message?.content || 'I apologize, but I could not generate a response.';
      const tokensUsed = completion.usage?.total_tokens || 0;
      const responseTime = Date.now() - startTime;

      // Process response based on query type
      return this.processResponse(responseText, query.type, tokensUsed, responseTime);

    } catch (error) {
      logger.error('OpenAI API call failed:', error);
      throw new Error('AI service temporarily unavailable. Please try again later.');
    }
  }

  private buildSystemPrompt(queryType: string, tier: 'free' | 'premium'): string {
    const basePrompt = `You are VALORANT-HUB AI Assistant, an expert VALORANT coach and analyst. You provide helpful, accurate, and actionable advice to players of all skill levels.

Key principles:
- Be concise but comprehensive
- Provide specific, actionable advice
- Reference game mechanics accurately
- Encourage positive gameplay habits
- Adapt advice to player skill level`;

    const tierSpecificPrompt = tier === 'premium' 
      ? `\n\nAs a premium assistant, you have access to detailed player statistics and can provide personalized analysis. Use the provided stats to give specific recommendations for improvement.`
      : `\n\nAs a free tier assistant, focus on general advice and basic strategies. Keep responses concise and educational.`;

    const querySpecificPrompts = {
      general: '\n\nFocus on general VALORANT knowledge, game mechanics, and basic strategies.',
      stats_analysis: '\n\nAnalyze the provided player statistics and identify specific areas for improvement. Provide concrete steps to address weaknesses.',
      strategy: '\n\nProvide tactical and strategic advice for competitive play. Include team coordination tips.',
      agent_help: '\n\nFocus on agent-specific abilities, optimal usage, and role-based gameplay advice.',
      map_help: '\n\nProvide map-specific callouts, common angles, default setups, and site execution strategies.'
    };

    return basePrompt + tierSpecificPrompt + (querySpecificPrompts[queryType] || querySpecificPrompts.general);
  }

  private buildUserMessage(query: AIQuery, context: any): string {
    let message = `Query: ${query.text}\n\n`;

    // Add context information
    if (context.user) {
      message += `Player: ${context.user.gameName}#${context.user.tagLine} (${context.user.region})\n`;
    }

    if (context.playerStats && context.userTier === 'premium') {
      message += `\nPlayer Statistics:\n`;
      message += `- Total Matches: ${context.playerStats.totalMatches}\n`;
      message += `- Win Rate: ${context.playerStats.winRate.toFixed(1)}%\n`;
      message += `- Average KDA: ${context.playerStats.averageKDA.toFixed(2)}\n`;
      message += `- Average ACS: ${context.playerStats.averageACS.toFixed(0)}\n`;
      message += `- Headshot %: ${context.playerStats.headshotPercentage.toFixed(1)}%\n`;
    }

    if (context.recentMatches && context.recentMatches.length > 0) {
      message += `\nRecent Performance (Last ${context.recentMatches.length} matches):\n`;
      const recentWins = context.recentMatches.filter(m => m.teamWon).length;
      message += `- Recent Win Rate: ${((recentWins / context.recentMatches.length) * 100).toFixed(1)}%\n`;
      
      const mostPlayedAgent = this.getMostPlayedAgent(context.recentMatches);
      if (mostPlayedAgent) {
        message += `- Most Played Agent: ${mostPlayedAgent}\n`;
      }
    }

    if (context.knowledgeBase && context.knowledgeBase.length > 0) {
      message += `\nRelevant Information:\n${context.knowledgeBase.join('\n')}\n`;
    }

    return message;
  }

  private processResponse(responseText: string, queryType: string, tokensUsed: number, responseTime: number): AIResponse {
    // Basic response processing
    const response: AIResponse = {
      text: responseText,
      type: 'text',
      tokensUsed,
      responseTime
    };

    // Enhanced processing for specific query types
    if (queryType === 'stats_analysis') {
      response.type = 'structured';
      response.data = this.extractStatsInsights(responseText);
    } else if (queryType === 'agent_help' || queryType === 'map_help') {
      response.type = 'recommendations';
      response.data = this.extractRecommendations(responseText);
    }

    return response;
  }

  private extractStatsInsights(text: string): any {
    // Extract structured insights from stats analysis
    const insights = {
      strengths: [],
      weaknesses: [],
      recommendations: []
    };

    // Simple regex-based extraction (could be enhanced with NLP)
    const strengthMatches = text.match(/strength[s]?:?\s*([^\.]+)/gi);
    const weaknessMatches = text.match(/weakness[es]*:?\s*([^\.]+)/gi);
    const recommendationMatches = text.match(/recommend[ation]*[s]?:?\s*([^\.]+)/gi);

    if (strengthMatches) insights.strengths = strengthMatches.map(m => m.replace(/strength[s]?:?\s*/i, ''));
    if (weaknessMatches) insights.weaknesses = weaknessMatches.map(m => m.replace(/weakness[es]*:?\s*/i, ''));
    if (recommendationMatches) insights.recommendations = recommendationMatches.map(m => m.replace(/recommend[ation]*[s]?:?\s*/i, ''));

    return insights;
  }

  private extractRecommendations(text: string): any {
    // Extract actionable recommendations
    const recommendations = [];
    const lines = text.split('\n');

    for (const line of lines) {
      if (line.includes('•') || line.includes('-') || line.includes('1.') || line.includes('2.')) {
        recommendations.push(line.trim());
      }
    }

    return { recommendations };
  }

  private getRelevantKnowledge(query: AIQuery): string[] {
    const knowledge = [];
    const queryLower = query.text.toLowerCase();

    // Agent-specific knowledge
    const agents = ['jett', 'reyna', 'phoenix', 'raze', 'yoru', 'neon', 'sage', 'cypher', 'sova', 'killjoy', 'breach', 'skye', 'kayo', 'chamber', 'fade', 'harbor', 'gekko', 'deadlock', 'iso'];
    for (const agent of agents) {
      if (queryLower.includes(agent)) {
        const agentKnowledge = this.knowledgeBase.get(`agent_${agent}`);
        if (agentKnowledge) knowledge.push(agentKnowledge);
      }
    }

    // Map-specific knowledge
    const maps = ['bind', 'haven', 'split', 'ascent', 'icebox', 'breeze', 'fracture', 'pearl', 'lotus', 'sunset'];
    for (const map of maps) {
      if (queryLower.includes(map)) {
        const mapKnowledge = this.knowledgeBase.get(`map_${map}`);
        if (mapKnowledge) knowledge.push(mapKnowledge);
      }
    }

    // General game knowledge
    if (queryLower.includes('aim') || queryLower.includes('crosshair')) {
      knowledge.push(this.knowledgeBase.get('aiming_tips'));
    }
    
    if (queryLower.includes('economy') || queryLower.includes('money')) {
      knowledge.push(this.knowledgeBase.get('economy_guide'));
    }

    return knowledge.filter(Boolean);
  }

  private getMostPlayedAgent(matches: any[]): string | null {
    const agentCounts = new Map();
    
    for (const match of matches) {
      const agent = match.characterId;
      agentCounts.set(agent, (agentCounts.get(agent) || 0) + 1);
    }

    let mostPlayed = null;
    let maxCount = 0;
    
    for (const [agent, count] of agentCounts.entries()) {
      if (count > maxCount) {
        maxCount = count;
        mostPlayed = agent;
      }
    }

    return mostPlayed;
  }

  private async initializeKnowledgeBase(): Promise<void> {
    // Initialize with basic VALORANT knowledge
    // In a real implementation, this would load from a comprehensive database
    
    this.knowledgeBase.set('aiming_tips', 'Keep crosshair at head level, pre-aim common angles, practice counter-strafing for accuracy.');
    this.knowledgeBase.set('economy_guide', 'Save on round 2 after pistol loss, full buy on round 4, consider force-buying on crucial rounds.');
    
    // Agent-specific knowledge would be loaded here
    this.knowledgeBase.set('agent_jett', 'Jett is an aggressive duelist. Use updrafts for off-angles, dash to safety after picks, save ultimate for eco rounds.');
    this.knowledgeBase.set('agent_sage', 'Sage is a sentinel support. Wall off chokepoints, heal teammates safely, use resurrection in secure positions.');
    
    // Map-specific knowledge would be loaded here
    this.knowledgeBase.set('map_ascent', 'Ascent has two sites with multiple entry points. Control mid for rotations, use utility to clear common angles.');
    this.knowledgeBase.set('map_bind', 'Bind has no mid, focus on A and B site control. Use teleporters for quick rotations and flanks.');
  }

  public async getQueryHistory(puuid: string, limit: number = 20): Promise<any[]> {
    return this.aiRepo.getQueryHistory(puuid, limit);
  }

  public async getUsageStatistics(puuid: string): Promise<any> {
    return this.aiRepo.getUsageStatistics(puuid);
  }
}
```

## Premium Features

### Subscription Service
**File**: `src/services/SubscriptionService.ts`
```typescript
import Stripe from 'stripe';
import { DatabaseManager } from '../database/DatabaseManager';
import { EventEmitter } from 'events';

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: 'month' | 'year';
  features: string[];
  stripePriceId: string;
}

export interface UserSubscription {
  id?: number;
  puuid: string;
  subscriptionId: string;
  planType: 'monthly' | 'yearly';
  status: 'active' | 'canceled' | 'past_due' | 'unpaid' | 'trialing';
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class SubscriptionService extends EventEmitter {
  private stripe: Stripe;
  private db: DatabaseManager;
  
  private plans: SubscriptionPlan[] = [
    {
      id: 'monthly',
      name: 'Premium Monthly',
      price: 599, // $5.99
      currency: 'USD',
      interval: 'month',
      features: [
        'Unlimited AI queries',
        'Personalized AI analysis',
        'Premium content access',
        'VOD AI analysis',
        'Priority support',
        'Ad-free experience'
      ],
      stripePriceId: process.env.STRIPE_MONTHLY_PRICE_ID!
    },
    {
      id: 'yearly',
      name: 'Premium Yearly',
      price: 5999, // $59.99
      currency: 'USD',
      interval: 'year',
      features: [
        'Unlimited AI queries',
        'Personalized AI analysis',
        'Premium content access',
        'VOD AI analysis',
        'Expert VOD reviews (1/month)',
        'Priority support',
        'Ad-free experience',
        '2 months free'
      ],
      stripePriceId: process.env.STRIPE_YEARLY_PRICE_ID!
    }
  ];

  constructor(stripeSecretKey: string, db: DatabaseManager) {
    super();
    this.stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2023-10-16'
    });
    this.db = db;
  }

  public getPlans(): SubscriptionPlan[] {
    return this.plans;
  }

  public async createCheckoutSession(puuid: string, planId: string, successUrl: string, cancelUrl: string): Promise<string> {
    try {
      const plan = this.plans.find(p => p.id === planId);
      if (!plan) {
        throw new Error('Invalid plan ID');
      }

      const session = await this.stripe.checkout.sessions.create({
        customer_email: undefined, // Will be collected during checkout
        line_items: [
          {
            price: plan.stripePriceId,
            quantity: 1
          }
        ],
        mode: 'subscription',
        success_url: successUrl,
        cancel_url: cancelUrl,
        metadata: {
          puuid,
          plan_id: planId
        },
        subscription_data: {
          metadata: {
            puuid,
            plan_id: planId
          }
        }
      });

      return session.url!;
    } catch (error) {
      logger.error('Failed to create checkout session:', error);
      throw error;
    }
  }

  public async handleWebhook(event: Stripe.Event): Promise<void> {
    try {
      switch (event.type) {
        case 'checkout.session.completed':
          await this.handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
          break;
          
        case 'customer.subscription.created':
          await this.handleSubscriptionCreated(event.data.object as Stripe.Subscription);
          break;
          
        case 'customer.subscription.updated':
          await this.handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
          break;
          
        case 'customer.subscription.deleted':
          await this.handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
          break;
          
        case 'invoice.payment_succeeded':
          await this.handlePaymentSucceeded(event.data.object as Stripe.Invoice);
          break;
          
        case 'invoice.payment_failed':
          await this.handlePaymentFailed(event.data.object as Stripe.Invoice);
          break;
          
        default:
          logger.warn(`Unhandled webhook event type: ${event.type}`);
      }
    } catch (error) {
      logger.error('Webhook handling failed:', error);
      throw error;
    }
  }

  public async getUserSubscription(puuid: string): Promise<UserSubscription | null> {
    const result = this.db.queryFirst<any>(`
      SELECT 
        id, puuid, subscription_id as subscriptionId, plan_type as planType,
        status, current_period_start as currentPeriodStart,
        current_period_end as currentPeriodEnd, cancel_at_period_end as cancelAtPeriodEnd,
        created_at as createdAt, updated_at as updatedAt
      FROM subscriptions 
      WHERE puuid = ? AND status IN ('active', 'trialing', 'past_due')
      ORDER BY created_at DESC 
      LIMIT 1
    `, [puuid]);

    if (!result) return null;

    return {
      ...result,
      cancelAtPeriodEnd: Boolean(result.cancelAtPeriodEnd),
      currentPeriodStart: new Date(result.currentPeriodStart),
      currentPeriodEnd: new Date(result.currentPeriodEnd),
      createdAt: new Date(result.createdAt),
      updatedAt: new Date(result.updatedAt)
    };
  }

  public async isUserPremium(puuid: string): Promise<boolean> {
    const subscription = await this.getUserSubscription(puuid);
    return subscription !== null && ['active', 'trialing'].includes(subscription.status);
  }

  public async cancelSubscription(puuid: string): Promise<void> {
    try {
      const subscription = await this.getUserSubscription(puuid);
      if (!subscription) {
        throw new Error('No active subscription found');
      }

      // Cancel at period end in Stripe
      await this.stripe.subscriptions.update(subscription.subscriptionId, {
        cancel_at_period_end: true
      });

      // Update local database
      this.db.execute(`
        UPDATE subscriptions 
        SET cancel_at_period_end = 1, updated_at = CURRENT_TIMESTAMP
        WHERE subscription_id = ?
      `, [subscription.subscriptionId]);

      this.emit('subscriptionCanceled', { puuid, subscriptionId: subscription.subscriptionId });

    } catch (error) {
      logger.error('Failed to cancel subscription:', error);
      throw error;
    }
  }

  public async reactivateSubscription(puuid: string): Promise<void> {
    try {
      const subscription = await this.getUserSubscription(puuid);
      if (!subscription) {
        throw new Error('No subscription found');
      }

      // Reactivate in Stripe
      await this.stripe.subscriptions.update(subscription.subscriptionId, {
        cancel_at_period_end: false
      });

      // Update local database
      this.db.execute(`
        UPDATE subscriptions 
        SET cancel_at_period_end = 0, updated_at = CURRENT_TIMESTAMP
        WHERE subscription_id = ?
      `, [subscription.subscriptionId]);

      this.emit('subscriptionReactivated', { puuid, subscriptionId: subscription.subscriptionId });

    } catch (error) {
      logger.error('Failed to reactivate subscription:', error);
      throw error;
    }
  }

  public async getPaymentHistory(puuid: string): Promise<any[]> {
    return this.db.query<any>(`
      SELECT 
        payment_intent_id as paymentIntentId, amount, currency,
        status, description, created_at as createdAt
      FROM payments 
      WHERE puuid = ?
      ORDER BY created_at DESC
    `, [puuid]);
  }

  private async handleCheckoutCompleted(session: Stripe.Checkout.Session): Promise<void> {
    const puuid = session.metadata?.puuid;
    const planId = session.metadata?.plan_id;

    if (!puuid || !planId) {
      logger.error('Missing metadata in checkout session:', session.id);
      return;
    }

    logger.info(`Checkout completed for user ${puuid}, plan ${planId}`);
    this.emit('checkoutCompleted', { puuid, planId, sessionId: session.id });
  }

  private async handleSubscriptionCreated(subscription: Stripe.Subscription): Promise<void> {
    const puuid = subscription.metadata?.puuid;
    const planId = subscription.metadata?.plan_id;

    if (!puuid || !planId) {
      logger.error('Missing metadata in subscription:', subscription.id);
      return;
    }

    const planType = planId === 'yearly' ? 'yearly' : 'monthly';

    // Store subscription in database
    this.db.execute(`
      INSERT OR REPLACE INTO subscriptions (
        puuid, subscription_id, plan_type, status,
        current_period_start, current_period_end, cancel_at_period_end,
        updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `, [
      puuid,
      subscription.id,
      planType,
      subscription.status,
      subscription.current_period_start * 1000,
      subscription.current_period_end * 1000,
      subscription.cancel_at_period_end ? 1 : 0
    ]);

    logger.info(`Subscription created for user ${puuid}: ${subscription.id}`);
    this.emit('subscriptionCreated', { puuid, subscription });
  }

  private async handleSubscriptionUpdated(subscription: Stripe.Subscription): Promise<void> {
    // Update subscription status in database
    this.db.execute(`
      UPDATE subscriptions 
      SET status = ?, current_period_start = ?, current_period_end = ?,
          cancel_at_period_end = ?, updated_at = CURRENT_TIMESTAMP
      WHERE subscription_id = ?
    `, [
      subscription.status,
      subscription.current_period_start * 1000,
      subscription.current_period_end * 1000,
      subscription.cancel_at_period_end ? 1 : 0,
      subscription.id
    ]);

    logger.info(`Subscription updated: ${subscription.id}`);
    this.emit('subscriptionUpdated', { subscription });
  }

  private async handleSubscriptionDeleted(subscription: Stripe.Subscription): Promise<void> {
    // Update subscription status to canceled
    this.db.execute(`
      UPDATE subscriptions 
      SET status = 'canceled', updated_at = CURRENT_TIMESTAMP
      WHERE subscription_id = ?
    `, [subscription.id]);

    logger.info(`Subscription deleted: ${subscription.id}`);
    this.emit('subscriptionDeleted', { subscription });
  }

  private async handlePaymentSucceeded(invoice: Stripe.Invoice): Promise<void> {
    if (!invoice.subscription) return;

    const subscription = await this.stripe.subscriptions.retrieve(invoice.subscription as string);
    const puuid = subscription.metadata?.puuid;

    if (!puuid) return;

    // Record payment
    this.db.execute(`
      INSERT INTO payments (
        puuid, payment_intent_id, amount, currency, status, description
      ) VALUES (?, ?, ?, ?, ?, ?)
    `, [
      puuid,
      invoice.payment_intent as string,
      invoice.amount_paid,
      invoice.currency,
      'succeeded',
      `Subscription payment - ${subscription.id}`
    ]);

    logger.info(`Payment succeeded for subscription: ${subscription.id}`);
    this.emit('paymentSucceeded', { puuid, invoice });
  }

  private async handlePaymentFailed(invoice: Stripe.Invoice): Promise<void> {
    if (!invoice.subscription) return;

    const subscription = await this.stripe.subscriptions.retrieve(invoice.subscription as string);
    const puuid = subscription.metadata?.puuid;

    if (!puuid) return;

    // Record failed payment
    this.db.execute(`
      INSERT INTO payments (
        puuid, payment_intent_id, amount, currency, status, description
      ) VALUES (?, ?, ?, ?, ?, ?)
    `, [
      puuid,
      invoice.payment_intent as string || 'failed',
      invoice.amount_due,
      invoice.currency,
      'failed',
      `Failed subscription payment - ${subscription.id}`
    ]);

    logger.warn(`Payment failed for subscription: ${subscription.id}`);
    this.emit('paymentFailed', { puuid, invoice });
  }
}
```

This comprehensive features implementation provides a solid foundation for both free and premium tiers of the VALORANT-HUB Desktop App, with robust content management, AI assistance, forum functionality, and subscription handling.
