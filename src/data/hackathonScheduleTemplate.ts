import type { HackathonSchedulePhase, HackathonTestingWindow } from '../types';

// Cronograma padrão 9h–16h desenhado pelo usuário para o evento presencial —
// usado como preenchimento inicial em CreateEventPage.tsx (editável antes de
// criar o evento, não hardcoded no runtime).
export const DEFAULT_HACKATHON_SCHEDULE: HackathonSchedulePhase[] = [
  { id: 'abertura', label: 'Abertura & Convocação dos Guardiões', startTime: '09:00', endTime: '09:30' },
  { id: 'bloco1', label: 'Bloco 1: Quest de Empatia & Prototipagem Inicial', startTime: '09:30', endTime: '11:00' },
  { id: 'bloco2', label: 'Bloco 2: Bancada de Testes 1 & Ajuste de Rota', startTime: '11:00', endTime: '12:00' },
  { id: 'almoco', label: 'Pausa para Almoço & Recarga de Energia', startTime: '12:00', endTime: '13:00' },
  { id: 'bloco3', label: 'Bloco 3: Regeneração & Prototipagem Avançada', startTime: '13:00', endTime: '14:30' },
  { id: 'bancada-final', label: 'Bancada de Testes Final & Fechamento do Projeto', startTime: '14:30', endTime: '15:15' },
  { id: 'arena', label: 'Arena dos Guardiões & Celebração', startTime: '15:15', endTime: '16:00' }
];

export const DEFAULT_HACKATHON_TESTING_WINDOWS: HackathonTestingWindow[] = [
  { start: '11:00', end: '12:00' },
  { start: '14:30', end: '15:15' }
];

export const DEFAULT_CHECKIN_CHECKPOINTS = ['09:15', '10:15', '13:00', '15:00'];
