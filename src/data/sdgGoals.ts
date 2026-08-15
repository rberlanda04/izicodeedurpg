import type { SDGGoal } from '../types';

/**
 * Nomes oficiais (abreviados) dos ODS da ONU realmente usados no catálogo
 * de projetos (src/data/projectCatalog.ts). Só os 8 que aparecem lá —
 * evita inventar metas que nenhum conteúdo real usa.
 */
export const SDG_NAMES: Record<SDGGoal, string> = {
  '2': 'Fome Zero e Agricultura Sustentável',
  '3': 'Saúde e Bem-Estar',
  '4': 'Educação de Qualidade',
  '9': 'Indústria, Inovação e Infraestrutura',
  '11': 'Cidades e Comunidades Sustentáveis',
  '12': 'Consumo e Produção Responsáveis',
  '13': 'Ação Climática',
  '16': 'Paz, Justiça e Instituições Eficazes'
};

export const SDG_COLORS: Record<SDGGoal, string> = {
  '2': 'text-[#DDA63A]',
  '3': 'text-[#4C9F38]',
  '4': 'text-stem-coral',
  '9': 'text-[#FD6925]',
  '11': 'text-stem-amber',
  '12': 'text-stem-teal',
  '13': 'text-stem-violet',
  '16': 'text-[#00689D]'
};

export const ALL_SDG_GOALS = Object.keys(SDG_NAMES) as SDGGoal[];
