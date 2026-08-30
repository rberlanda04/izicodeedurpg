export interface ChallengePortal {
  id: string;
  name: string;
  org: string;
  description: string;
  audience?: string;
  calendar?: string;
  url?: string; // omitido quando não há uma URL oficial confirmada
  logo?: string; // path under /public — prioridade sobre `icon`
  icon: string; // emoji de fallback quando não há logo
}

/**
 * Competições e olimpíadas reais de tecnologia com foco em 6º ano ao Ensino
 * Médio. OBI/OBR/FLL/Technovation/Scratch Day vêm do guia
 * public/docs/02-GUIA-OLIMPIADAS-COMPETICOES.md do izicode-landing
 * (github.com/izicripto/izicode-landing), com detalhes completos de público
 * e calendário. OBA/OBT/OBES/FMR vieram dos logos em src/assets/logos —
 * são reais, mas sem essa mesma fonte detalhada, então `audience`/
 * `calendar`/`url` ficam de fora quando não confirmados, em vez de
 * inventar datas ou links. "Google Code-in" foi deixado de fora de
 * propósito: o Google encerrou o programa em 2019.
 */
export const CHALLENGE_PORTALS: ChallengePortal[] = [
  {
    id: 'obi',
    name: 'OBI — Olimpíada Brasileira de Informática',
    org: 'Sociedade Brasileira de Computação (SBC)',
    description:
      'Modalidades Iniciação (lógica, sem programação) e Programação. Fases local, estadual e nacional.',
    audience: '4º ano do Fundamental ao Ensino Médio',
    calendar: 'Inscrições em março · Fase nacional em outubro',
    url: 'https://olimpiada.ic.unicamp.br',
    logo: '/portal-logos/obi.jpg',
    icon: '💻'
  },
  {
    id: 'obr',
    name: 'OBR — Olimpíada Brasileira de Robótica',
    org: 'MNRC',
    description:
      'Modalidade Teórica (prova escrita) e Prática (Resgate e Sumô com robôs) em arenas por faixa etária.',
    audience: 'Até 19 anos, 3 categorias de arena',
    calendar: 'Prova teórica em junho · Etapas práticas em setembro',
    url: 'http://www.obr.robocup.org.br',
    logo: '/portal-logos/obr.png',
    icon: '🤖'
  },
  {
    id: 'fll',
    name: 'FIRST LEGO League (FLL)',
    org: 'FIRST / SESI',
    description:
      'Temporada anual com tema global: projeto de inovação, design e programação de robô LEGO, e Core Values de trabalho em equipe.',
    audience: '9 a 16 anos',
    calendar: 'Treinos a partir de fevereiro · Torneios em novembro/dezembro',
    url: 'https://www.firstlegoleague.org',
    logo: '/portal-logos/fll.jpg',
    icon: '🧱'
  },
  {
    id: 'technovation',
    name: 'Technovation Girls',
    org: 'Technovation (EUA)',
    description:
      'Competição global gratuita de apps para impacto social, com mentoria — foco em protagonismo feminino na tecnologia.',
    audience: 'Meninas de 8 a 18 anos',
    calendar: 'Inscrições em outubro · Submissão regional em abril',
    url: 'https://www.technovationchallenge.org',
    logo: '/portal-logos/technovation.jpg',
    icon: '💜'
  },
  {
    id: 'scratch-day',
    name: 'Scratch Day & Competições de Scratch',
    org: 'Scratch Foundation (MIT)',
    description:
      'Celebração global anual em maio, além de competições e eventos locais organizados por escolas na comunidade Scratch.',
    audience: 'Todas as idades',
    calendar: 'Scratch Day em maio',
    url: 'https://scratch.mit.edu',
    logo: '/portal-logos/scratch-day.jpg',
    icon: '🐈'
  },
  {
    id: 'oba',
    name: 'OBA — Olimpíada Brasileira de Astronomia e Astronáutica',
    org: 'OBA/AEB',
    description: 'Olimpíada nacional de astronomia e astronáutica para escolas públicas e privadas.',
    logo: '/portal-logos/oba.png',
    icon: '🚀'
  },
  {
    id: 'obt',
    name: 'OBT — Olimpíada Brasileira de Tecnologia',
    org: 'OBT',
    description: 'Olimpíada nacional de tecnologia. Peça ao Game Master os detalhes de inscrição da sua região.',
    logo: '/portal-logos/obt.png',
    icon: '🧠'
  },
  {
    id: 'obes',
    name: 'OBES — Olimpíada Brasileira de Empreendedorismo Social',
    org: 'OBES',
    description:
      'Olimpíada nacional voltada a projetos de empreendedorismo com impacto social. Peça ao Game Master os detalhes de inscrição.',
    logo: '/portal-logos/obes.jpg',
    icon: '🤝'
  },
  {
    id: 'fmr',
    name: 'Festival Marista de Robótica — Cidades Fraternas',
    org: 'Rede Marista',
    description:
      'Festival de robótica da rede de escolas Marista, aberto às unidades da rede — confirme com a coordenação se sua escola participa.',
    logo: '/portal-logos/fmr.jpg',
    icon: '🏙️'
  }
];
