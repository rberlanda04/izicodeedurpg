import type { SkillArchetype, SkillArchetypeResult, SkillNode } from '../types';

export const SURVEY_VERSION = 1;
export const SKILL_SURVEY_XP_REWARD = 80;
export const SKILL_SURVEY_COIN_REWARD = 20;

export interface SurveyOption {
  id: string;
  label: string;
  icon: string;
  scores?: Partial<Record<SkillArchetype, number>>;
}

export interface SurveyQuestion {
  id: string;
  prompt: string;
  options: SurveyOption[];
}

/**
 * Curto de propósito: fadiga de pesquisa em criança/adolescente é um risco
 * real de qualidade de dado. 2 perguntas de contexto (sem `scores` — só
 * dado de perfil, não entram no cálculo do arquétipo) + 6 cenários que
 * cobrem os 5 arquétipos com phrasing distinta, pra não fixar o resultado
 * numa única pergunta mal interpretada.
 */
export const SURVEY_QUESTIONS: SurveyQuestion[] = [
  {
    id: 'device_access',
    prompt: 'Qual aparelho você mais usa em casa pra estudar ou se divertir?',
    options: [
      { id: 'smartphone', label: 'Celular', icon: '📱' },
      { id: 'computer', label: 'Computador ou notebook', icon: '💻' },
      { id: 'tablet', label: 'Tablet', icon: '📲' },
      { id: 'shared', label: 'Divido com a família', icon: '👨‍👩‍👧‍👦' },
      { id: 'none', label: 'Não tenho em casa', icon: '🏫' }
    ]
  },
  {
    id: 'screen_time',
    prompt: 'Fora da escola, quanto tempo de tela você usa por dia?',
    options: [
      { id: 'lt1', label: 'Menos de 1 hora', icon: '⏱️' },
      { id: '1to3', label: '1 a 3 horas', icon: '🕑' },
      { id: '3to5', label: '3 a 5 horas', icon: '🕓' },
      { id: 'gt5', label: 'Mais de 5 horas', icon: '🕕' }
    ]
  },
  {
    id: 'team_stuck',
    prompt: 'Sua equipe trava no meio de um projeto. Você geralmente...',
    options: [
      { id: 'logic', label: 'Propõe uma solução de lógica ou código', icon: '🧩', scores: { PROGRAMADOR: 2 } },
      { id: 'hardware', label: 'Confere se o fio ou a peça está certo', icon: '🔌', scores: { ENGENHEIRO: 2 } },
      { id: 'look', label: 'Repensa como isso vai ficar pra quem for ver', icon: '🎨', scores: { DESIGNER: 2 } },
      { id: 'organize', label: 'Organiza quem faz o quê', icon: '📋', scores: { LIDER: 2 } },
      { id: 'different', label: 'Sugere tentar um jeito totalmente diferente', icon: '🚀', scores: { EXPLORADOR: 2 } }
    ]
  },
  {
    id: 'build_excitement',
    prompt: 'Na hora de montar algo nas aulas, o que mais te empolga?',
    options: [
      { id: 'code', label: 'Escrever o código que faz funcionar', icon: '⌨️', scores: { PROGRAMADOR: 2 } },
      { id: 'assemble', label: 'Montar o circuito ou mecanismo com as mãos', icon: '🛠️', scores: { ENGENHEIRO: 2 } },
      { id: 'pretty', label: 'Deixar bonito e fácil de entender', icon: '✨', scores: { DESIGNER: 2 } },
      { id: 'explain', label: 'Explicar pro grupo como vai funcionar', icon: '🗣️', scores: { LIDER: 2 } },
      { id: 'crazy', label: 'Testar uma ideia maluca que ninguém tentou', icon: '🧪', scores: { EXPLORADOR: 2 } }
    ]
  },
  {
    id: 'this_month',
    prompt: 'Se pudesse escolher o que aprender esse mês...',
    options: [
      { id: 'app', label: 'Um jogo ou app novo', icon: '🎮', scores: { PROGRAMADOR: 2 } },
      { id: 'robot', label: 'Um robô ou circuito', icon: '🤖', scores: { ENGENHEIRO: 2 } },
      { id: 'identity', label: 'Uma identidade visual ou apresentação', icon: '🖌️', scores: { DESIGNER: 2 } },
      { id: 'lead', label: 'Como liderar um projeto em grupo', icon: '🧭', scores: { LIDER: 2 } },
      { id: 'unknown', label: 'Qualquer coisa que eu nunca vi antes', icon: '🌌', scores: { EXPLORADOR: 2 } }
    ]
  },
  {
    id: 'presentation_day',
    prompt: 'Chegou o dia de apresentar o projeto da turma. Qual parte você quer tocar?',
    options: [
      { id: 'demo_code', label: 'Mostrar o código ou a lógica funcionando', icon: '📟', scores: { PROGRAMADOR: 1, ENGENHEIRO: 1 } },
      { id: 'demo_build', label: 'Mostrar a montagem física ao vivo', icon: '⚙️', scores: { ENGENHEIRO: 2 } },
      { id: 'demo_visual', label: 'Cuidar dos slides e do visual', icon: '🖼️', scores: { DESIGNER: 2 } },
      { id: 'demo_talk', label: 'Falar pra plateia e conduzir a apresentação', icon: '🎤', scores: { LIDER: 2 } },
      { id: 'demo_whatever', label: 'Topo qualquer parte, só quero ver como vai ser', icon: '🎲', scores: { EXPLORADOR: 1 } }
    ]
  },
  {
    id: 'when_it_breaks',
    prompt: 'Algo dá errado bem na sua frente. O que você faz primeiro?',
    options: [
      { id: 'debug', label: 'Reviso o código passo a passo', icon: '🐞', scores: { PROGRAMADOR: 2 } },
      { id: 'inspect', label: 'Examino as peças e conexões físicas', icon: '🔍', scores: { ENGENHEIRO: 2 } },
      { id: 'simplify', label: 'Penso em como simplificar pra ninguém se perder', icon: '🧭', scores: { DESIGNER: 1, LIDER: 1 } },
      { id: 'delegate', label: 'Chamo o time pra decidir juntos o próximo passo', icon: '🤝', scores: { LIDER: 2 } },
      { id: 'restart', label: 'Aproveito e testo uma abordagem nova do zero', icon: '🔄', scores: { EXPLORADOR: 2 } }
    ]
  },
  {
    id: 'free_time',
    prompt: 'No seu tempo livre, o que mais rola?',
    options: [
      { id: 'games_code', label: 'Jogos, apps ou sites', icon: '🕹️', scores: { PROGRAMADOR: 2 } },
      { id: 'take_apart', label: 'Desmontar ou consertar alguma coisa', icon: '🔧', scores: { ENGENHEIRO: 2 } },
      { id: 'draw', label: 'Desenhar, editar vídeo ou criar', icon: '🎬', scores: { DESIGNER: 2 } },
      { id: 'hang_out', label: 'Organizar um encontro ou atividade em grupo', icon: '🎉', scores: { LIDER: 2 } },
      { id: 'anything_new', label: 'Depende — gosto de variar bastante', icon: '🎈', scores: { EXPLORADOR: 2 } }
    ]
  }
];

export interface ArchetypeInfo {
  label: string;
  tagline: string;
  icon: string;
  categories: SkillNode['category'][];
}

export const ARCHETYPE_INFO: Record<SkillArchetype, ArchetypeInfo> = {
  PROGRAMADOR: {
    label: 'Programador(a)',
    tagline: 'Você pensa em passos, lógica e como fazer a máquina obedecer.',
    icon: '⌨️',
    categories: ['LOGIC', 'BLOCKS']
  },
  ENGENHEIRO: {
    label: 'Engenheiro(a)',
    tagline: 'Você entende de fios, peças e como o mundo físico se encaixa.',
    icon: '🔧',
    categories: ['ELECTRONICS', 'PROTOTYPING']
  },
  DESIGNER: {
    label: 'Designer',
    tagline: 'Você enxerga como as coisas devem parecer e ser entendidas.',
    icon: '🎨',
    categories: ['DESIGN']
  },
  LIDER: {
    label: 'Líder',
    tagline: 'Você organiza pessoas e mantém o time andando na mesma direção.',
    icon: '🧭',
    categories: []
  },
  EXPLORADOR: {
    label: 'Explorador(a)',
    tagline: 'Você gosta de variar e testar um pouco de tudo.',
    icon: '🌌',
    categories: []
  }
};

/** União das categorias do arquétipo primário + secundário — usado por Trilha e Missões pra destacar nós/cards. */
export function getRecommendedCategories(archetype: SkillArchetypeResult | undefined): SkillNode['category'][] {
  if (!archetype) return [];
  const categories = [...ARCHETYPE_INFO[archetype.primary].categories];
  if (archetype.secondary) categories.push(...ARCHETYPE_INFO[archetype.secondary].categories);
  return categories;
}

export interface ArchetypeComputation {
  primary: SkillArchetype;
  secondary?: SkillArchetype;
  scores: Record<SkillArchetype, number>;
}

export function computeArchetype(selections: Record<string, string>): ArchetypeComputation {
  const scores: Record<SkillArchetype, number> = {
    PROGRAMADOR: 0,
    ENGENHEIRO: 0,
    DESIGNER: 0,
    LIDER: 0,
    EXPLORADOR: 0
  };

  for (const question of SURVEY_QUESTIONS) {
    const chosenId = selections[question.id];
    const option = question.options.find((o) => o.id === chosenId);
    if (!option?.scores) continue;
    for (const [archetype, points] of Object.entries(option.scores) as [SkillArchetype, number][]) {
      scores[archetype] += points;
    }
  }

  const ranked = (Object.entries(scores) as [SkillArchetype, number][]).sort((a, b) => b[1] - a[1]);
  const primary = ranked[0][1] > 0 ? ranked[0][0] : 'EXPLORADOR';
  // Segunda colocação só vira "secondary" se estiver bem perto da primeira —
  // sinal genuinamente dividido, não um empate qualquer no fundo da lista.
  const secondary =
    ranked[1][1] > 0 && ranked[0][1] - ranked[1][1] <= 1 && ranked[1][0] !== primary ? ranked[1][0] : undefined;

  return { primary, secondary, scores };
}
