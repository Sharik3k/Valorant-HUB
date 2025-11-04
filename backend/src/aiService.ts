import { GoogleGenerativeAI } from '@google/generative-ai';
import { AGENTS_DATA, MAPS, AGENT_WINRATES } from './agentsData';

// Initialize Gemini API (lazy loading)
let genAI: GoogleGenerativeAI | null = null;

function getGenAI(): GoogleGenerativeAI {
  if (!genAI) {
    const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not set');
    }
    genAI = new GoogleGenerativeAI(apiKey);
  }
  return genAI;
}

export interface GetAgentsForMapParams {
  map_name: string;
}

export interface GenerateStrategyParams {
  map: string;
  style: string;
}

export interface GetAgentStatsParams {
  map: string;
}

export interface GetTeamBalanceParams {
  team: string[];
}

export interface GetLoadoutParams {
  agent: string;
  round_type: string;
}

export async function getAgentsForMap({ map_name }: GetAgentsForMapParams) {
  const map = map_name.charAt(0).toUpperCase() + map_name.slice(1).toLowerCase();
  
  if (!MAPS.includes(map)) {
    throw new Error(`Map "${map_name}" not found. Available maps: ${MAPS.join(', ')}`);
  }

  const recommendedAgents = [
    { agent: "Jett", role: "Duelist" },
    { agent: "Omen", role: "Controller" },
    { agent: "Sova", role: "Initiator" },
    { agent: "Killjoy", role: "Sentinel" }
  ];

  return {
    map: map,
    recommended_agents: recommendedAgents
  };
}

export async function generateStrategy({ map, style }: GenerateStrategyParams) {
  const mapFormatted = map.charAt(0).toUpperCase() + map.slice(1).toLowerCase();
  
  if (!MAPS.includes(mapFormatted)) {
    throw new Error(`Map "${map}" not found. Available maps: ${MAPS.join(', ')}`);
  }

  const strategies = {
    aggressive: {
      "Ascent": { site: "A", agents: ["Raze", "Jett", "Omen"], steps: ["Raze entry з Paint Shells", "Jett Tailwind для швидкого заходу", "Omen smoke для блокування кутів"] },
      "Bind": { site: "B", agents: ["Raze", "Yoru", "Viper"], steps: ["Raze entry з Double Satchel", "Viper ставить wall на B site", "Yoru телепортується за спину ворогів"] },
      "Haven": { site: "C", agents: ["Phoenix", "Jett", "Breach"], steps: ["Phoenix Blaze для блокування кутів", "Jett Tailwind для швидкого заходу", "Breach Flashpoint для осліплення"] }
    },
    defensive: {
      "Ascent": { site: "B", agents: ["Killjoy", "Sage", "Cypher"], steps: ["Killjoy Turret на вході", "Sage Slow Orb для контролю", "Cypher SpyCam для розвідки"] },
      "Bind": { site: "A", agents: ["Chamber", "Viper", "Sage"], steps: ["Chamber Trademark для контролю", "Viper Toxic Screen для блокування", "Sage Barrier Orb для затримки"] },
      "Haven": { site: "A", agents: ["Deadlock", "Killjoy", "Sage"], steps: ["Deadlock GravNet для контролю", "Killjoy Nanoswarm на сайті", "Sage Healing Orb для підтримки"] }
    }
  };

  const strategy = strategies[style as keyof typeof strategies]?.[mapFormatted as keyof typeof strategies.aggressive] || strategies.aggressive[mapFormatted as keyof typeof strategies.aggressive];

  return {
    map: mapFormatted,
    style: style,
    strategy: strategy
  };
}

export async function getAgentStats({ map }: GetAgentStatsParams) {
  const mapFormatted = map.charAt(0).toUpperCase() + map.slice(1).toLowerCase();
  
  if (!MAPS.includes(mapFormatted)) {
    throw new Error(`Map "${map}" not found. Available maps: ${MAPS.join(', ')}`);
  }

  const stats = AGENT_WINRATES[mapFormatted as keyof typeof AGENT_WINRATES];
  const agentStats = Object.entries(stats).map(([agent, winrate]) => ({
    agent,
    winrate: winrate as number
  })).sort((a, b) => (b.winrate as number) - (a.winrate as number));

  return {
    map: mapFormatted,
    agent_stats: agentStats
  };
}

export async function getTeamBalance({ team }: GetTeamBalanceParams) {
  const roles = { Duelist: 0, Controller: 0, Initiator: 0, Sentinel: 0 };
  const validAgents = [];
  
  for (const agentName of team) {
    const agent = agentName.charAt(0).toUpperCase() + agentName.slice(1).toLowerCase();
    if (AGENTS_DATA[agent as keyof typeof AGENTS_DATA]) {
      roles[AGENTS_DATA[agent as keyof typeof AGENTS_DATA].role as keyof typeof roles]++;
      validAgents.push(agent);
    }
  }

  const missingRoles = Object.entries(roles)
    .filter(([_, count]) => count === 0)
    .map(([role]) => role);

  const recommendedAgents = [];
  if (missingRoles.includes("Controller")) recommendedAgents.push("Omen", "Viper");
  if (missingRoles.includes("Initiator")) recommendedAgents.push("Sova", "Skye");
  if (missingRoles.includes("Sentinel")) recommendedAgents.push("Killjoy", "Sage");
  if (missingRoles.includes("Duelist")) recommendedAgents.push("Jett", "Raze");

  return {
    current_team: validAgents,
    missing_roles: missingRoles,
    recommended_agents: recommendedAgents.slice(0, 2)
  };
}

export async function getLoadout({ agent, round_type }: GetLoadoutParams) {
  const agentFormatted = agent.charAt(0).toUpperCase() + agent.slice(1).toLowerCase();
  
  if (!AGENTS_DATA[agentFormatted as keyof typeof AGENTS_DATA]) {
    throw new Error(`Agent "${agent}" not found.`);
  }

  const loadouts = {
    eco: {
      weapons: ["Sheriff", "Shorty", "Frenzy"],
      utilities: ["Базові утиліти", "Економія кредитів"]
    },
    semi_buy: {
      weapons: ["Spectre", "Judge", "Bulldog"],
      utilities: ["Ключові утиліти", "Light Shield"]
    },
    full_buy: {
      weapons: ["Vandal", "Phantom", "Operator"],
      utilities: ["Повний набір утиліт", "Heavy Shield"]
    }
  };

  const loadout = loadouts[round_type as keyof typeof loadouts] || loadouts.semi_buy;

  return {
    agent: agentFormatted,
    round_type: round_type,
    recommended_weapons: loadout.weapons,
    utilities: loadout.utilities
  };
}

export const FUNCTIONS = [
  {
    name: "get_agents_for_map",
    description: "Provides a balanced and recommended team composition for a specific Valorant map. Use this when a user wants to know the best agents for a map.",
    parameters: {
      type: "object",
      properties: {
        map_name: {
          type: "string",
          description: "The name of the map (e.g., Ascent, Bind, Haven)"
        }
      },
      required: ["map_name"]
    }
  },
  {
    name: "generate_strategy",
    description: "Generates a tactical strategy for a given map and play style (e.g., aggressive, defensive). Use this to get step-by-step plans for attacking or defending a site.",
    parameters: {
      type: "object",
      properties: {
        map: {
          type: "string",
          description: "The name of the map"
        },
        style: {
          type: "string",
          enum: ["aggressive", "defensive", "balanced"],
          description: "The play style"
        }
      },
      required: ["map", "style"]
    }
  },
  {
    name: "get_agent_stats",
    description: "Get win rate statistics for agents on a specific map",
    parameters: {
      type: "object",
      properties: {
        map: {
          type: "string",
          description: "The name of the map"
        }
      },
      required: ["map"]
    }
  },
  {
    name: "get_team_balance",
    description: "Analyze team composition and recommend missing agents",
    parameters: {
      type: "object",
      properties: {
        team: {
          type: "array",
          items: { type: "string" },
          description: "List of agent names in the current team"
        }
      },
      required: ["team"]
    }
  },
  {
    name: "get_loadout",
    description: "Get recommended weapons and utilities for an agent and round type",
    parameters: {
      type: "object",
      properties: {
        agent: {
          type: "string",
          description: "The name of the agent"
        },
        round_type: {
          type: "string",
          enum: ["eco", "semi_buy", "full_buy"],
          description: "The economic situation of the round"
        }
      },
      required: ["agent", "round_type"]
    }
  }
];

export async function getEmbedding(text: string): Promise<number[]> {
  try {
    const model = getGenAI().getGenerativeModel({ model: "embedding-001" });
    const result = await model.embedContent(text);
    const embedding = result.embedding;
    
    if (!embedding || !embedding.values) {
      throw new Error('No embedding values returned from Gemini API');
    }
    
    return embedding.values;
  } catch (error) {
    console.error('[AI Service] Error creating embedding with Gemini:', error);
    throw new Error(`Failed to create text embedding: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function processUserMessage(message: string) {
  console.log(`[AI Service] Processing message: "${message}"`);
  try {
    const model = getGenAI().getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt = `You are a helpful Valorant assistant. Your goal is to provide accurate and strategic advice to players. 
    
User question: ${message}

Please provide a concise and strategic answer.`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    
    console.log('[AI Service] Received response from Gemini');
    return { reply: text };
  } catch (error) {
    console.error('[AI Service] Error processing message:', error);
    if (error instanceof Error) {
      throw new Error(`AI Provider Error: ${error.message}`);
    }
    throw new Error('Failed to process message due to an unknown error');
  }
}
