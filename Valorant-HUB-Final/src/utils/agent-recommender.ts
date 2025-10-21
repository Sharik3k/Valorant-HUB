// Agent Recommendation System
import { AGENTS_DATABASE, AgentPlaystyle } from '../data/agents-data';

export interface PlaystyleAnswers {
  aggression: 'passive' | 'balanced' | 'aggressive';
  teamplay: 'solo' | 'balanced' | 'team';
  focus: 'aim' | 'balanced' | 'utility';
  experience: 'beginner' | 'intermediate' | 'advanced';
  preferredRole?: 'Duelist' | 'Controller' | 'Initiator' | 'Sentinel' | 'any';
}

interface ScoredAgent extends AgentPlaystyle {
  score: number;
  matchReasons: string[];
}

export function recommendAgents(answers: PlaystyleAnswers, topN: number = 5): ScoredAgent[] {
  const aggressionMap = { passive: 3, balanced: 6, aggressive: 9 };
  const teamplayMap = { solo: 3, balanced: 6, team: 9 };
  const focusMap = { aim: 3, balanced: 6, utility: 9 };
  const difficultyMap = {
    beginner: ['Easy'],
    intermediate: ['Easy', 'Medium'],
    advanced: ['Easy', 'Medium', 'Hard'],
  };

  const preferredAggression = aggressionMap[answers.aggression];
  const preferredTeamplay = teamplayMap[answers.teamplay];
  const preferredFocus = focusMap[answers.focus];
  const allowedDifficulties = difficultyMap[answers.experience];

  const scoredAgents: ScoredAgent[] = AGENTS_DATABASE
    .filter((agent) => {
      if (!allowedDifficulties.includes(agent.difficulty)) return false;
      if (answers.preferredRole && answers.preferredRole !== 'any' && agent.role !== answers.preferredRole) {
        return false;
      }
      return true;
    })
    .map((agent) => {
      const matchReasons: string[] = [];
      let totalScore = 0;
      
      const aggressionScore = 10 - Math.abs(agent.playstyle.aggression - preferredAggression);
      totalScore += aggressionScore * 0.3;
      if (aggressionScore >= 8) {
        matchReasons.push(`Відповідає вашому ${answers.aggression === 'aggressive' ? 'агресивному' : answers.aggression === 'passive' ? 'пасивному' : 'збалансованому'} стилю`);
      }
      
      const teamplayScore = 10 - Math.abs(agent.playstyle.teamplay - preferredTeamplay);
      totalScore += teamplayScore * 0.3;
      if (teamplayScore >= 8) {
        matchReasons.push(`Підходить для ${answers.teamplay === 'solo' ? 'соло гри' : answers.teamplay === 'team' ? 'командної гри' : 'будь-якого стилю'}`);
      }
      
      const focusScore = 10 - Math.abs(agent.playstyle.utility - preferredFocus);
      totalScore += focusScore * 0.25;
      if (focusScore >= 8) {
        matchReasons.push(`${answers.focus === 'aim' ? 'Фокус на aim' : answers.focus === 'utility' ? 'Багато корисних здібностей' : 'Збалансований підхід'}`);
      }
      
      const versatilityScore = agent.playstyle.versatility;
      totalScore += versatilityScore * 0.15;
      if (versatilityScore >= 8) {
        matchReasons.push('Універсальний агент');
      }
      
      if (answers.experience === 'beginner' && agent.difficulty === 'Easy') {
        totalScore += 2;
        matchReasons.push('Легкий для вивчення');
      }
      
      return {
        ...agent,
        score: totalScore,
        matchReasons,
      };
    });

  return scoredAgents.sort((a, b) => b.score - a.score).slice(0, topN);
}

export function generateAnalysisText(answers: PlaystyleAnswers): string {
  const recommendations = recommendAgents(answers, 5);
  
  let analysis = `**Аналіз вашого стилю гри:**\n\n`;
  analysis += `📊 **Ваш профіль:**\n`;
  analysis += `- Агресія: ${answers.aggression === 'aggressive' ? '🔥 Агресивний' : answers.aggression === 'passive' ? '🛡️ Пасивний' : '⚖️ Збалансований'}\n`;
  analysis += `- Командна гра: ${answers.teamplay === 'team' ? '👥 Командний гравець' : answers.teamplay === 'solo' ? '⭐ Соло гравець' : '🤝 Адаптивний'}\n`;
  analysis += `- Фокус: ${answers.focus === 'aim' ? '🎯 Aim-focused' : answers.focus === 'utility' ? '🛠️ Utility-focused' : '⚖️ Збалансований'}\n`;
  analysis += `- Досвід: ${answers.experience === 'beginner' ? '🌱 Початківець' : answers.experience === 'intermediate' ? '📈 Середній' : '🏆 Досвідчений'}\n\n`;
  
  analysis += `🎮 **ТОП-5 РЕКОМЕНДОВАНИХ АГЕНТІВ:**\n\n`;
  
  recommendations.forEach((agent, index) => {
    analysis += `**${index + 1}. ${agent.name}** (${agent.role}) - Складність: ${agent.difficulty}\n`;
    analysis += `   📝 ${agent.description}\n`;
    analysis += `   ✅ Чому підходить:\n`;
    agent.matchReasons.forEach(reason => {
      analysis += `      • ${reason}\n`;
    });
    analysis += `   💡 Поради:\n`;
    agent.tips.slice(0, 2).forEach(tip => {
      analysis += `      • ${tip}\n`;
    });
    analysis += `\n`;
  });
  
  return analysis;
}

export const PLAYSTYLE_QUESTIONS = [
  {
    id: 'aggression',
    question: 'Як ти граєш в раундах?',
    options: [
      { value: 'aggressive', label: '🔥 Агресивно - люблю першим входити, брати дуелі' },
      { value: 'balanced', label: '⚖️ Збалансовано - залежить від ситуації' },
      { value: 'passive', label: '🛡️ Пасивно - граю від оборони, підтримую команду' },
    ],
  },
  {
    id: 'teamplay',
    question: 'Як ти взаємодієш з командою?',
    options: [
      { value: 'team', label: '👥 Граю з командою, координуюсь, допомагаю' },
      { value: 'balanced', label: '🤝 Інколи з командою, інколи сам' },
      { value: 'solo', label: '⭐ Граю сам, роблю фланки, carry' },
    ],
  },
  {
    id: 'focus',
    question: 'На чому ти фокусуєшся в грі?',
    options: [
      { value: 'aim', label: '🎯 На стрільбі та дуелях' },
      { value: 'balanced', label: '⚖️ На всьому порівну' },
      { value: 'utility', label: '🛠️ На використанні здібностей та стратегії' },
    ],
  },
  {
    id: 'experience',
    question: 'Який твій рівень досвіду в VALORANT?',
    options: [
      { value: 'beginner', label: '🌱 Початківець (тільки почав грати)' },
      { value: 'intermediate', label: '📈 Середній (граю кілька місяців)' },
      { value: 'advanced', label: '🏆 Досвідчений (граю довго, знаю механіки)' },
    ],
  },
  {
    id: 'preferredRole',
    question: 'Яку роль ти віддаєш перевагу?',
    options: [
      { value: 'Duelist', label: '⚔️ Duelist - агресія, entry fragging' },
      { value: 'Controller', label: '💨 Controller - смоки, контроль карти' },
      { value: 'Initiator', label: '🔍 Initiator - інформація, підтримка атаки' },
      { value: 'Sentinel', label: '🛡️ Sentinel - захист, утримання позицій' },
      { value: 'any', label: '🎲 Будь-яка - граю на всіх ролях' },
    ],
  },
];
