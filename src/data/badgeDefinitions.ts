import type { Badge } from '../types';

// As 6 conquistas reais do jogo — os ícones em public/badges/*.svg já
// existiam prontos no repo (medalhões hexagonais no mesmo estilo visual dos
// monstros de public/game/), mas profile.badges nunca era preenchido por
// nenhum fluxo do app. Este arquivo é o catálogo; a concessão de fato
// acontece em useClassLocalState.ts (grantBadge), amarrada a marcos reais
// já existentes no jogo — nenhuma conquista nova precisou ser inventada,
// só conectada.
export const BADGE_DEFINITIONS: Array<Omit<Badge, 'unlockedAt'>> = [
  {
    id: 'first-code',
    name: 'Primeira Linha de Código',
    description: 'Aceitou sua primeira missão na Trilha.',
    icon: '/badges/first-code.svg'
  },
  {
    id: 'circuit-master',
    name: 'Mestre dos Circuitos',
    description: 'Desbloqueou Eletrônica Básica com Arduino.',
    icon: '/badges/circuit-master.svg'
  },
  {
    id: 'bot-builder',
    name: 'Construtor de Robôs',
    description: 'Desbloqueou sua primeira habilidade de robótica (Lego ou micro:bit).',
    icon: '/badges/bot-builder.svg'
  },
  {
    id: 'scrum-leader',
    name: 'Líder Scrum',
    description: 'Fundou uma guilda e se tornou Scrum Master.',
    icon: '/badges/scrum-leader.svg'
  },
  {
    id: 'hackathon-slayer',
    name: 'Caçador de Hackathons',
    description: 'Atacou o Boss Raid do Hackathon ao lado da guilda.',
    icon: '/badges/hackathon-slayer.svg'
  },
  {
    id: 'sdg-guardian',
    name: 'Guardião dos ODS',
    description: 'Completou missões alinhadas a 3 Objetivos de Desenvolvimento Sustentável diferentes.',
    icon: '/badges/sdg-guardian.svg'
  },
  {
    id: 'self-aware',
    name: 'Autoconhecimento',
    description: 'Descobriu seu arquétipo de aventureiro no questionário de perfil.',
    icon: '🧭'
  }
];
