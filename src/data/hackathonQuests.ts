import type { HackathonDisasterType } from '../types';

export type HackathonScoreAxis = 'engenharia' | 'equidade' | 'regeneracao';

export interface HackathonScoreCard {
  id: string;
  axis: HackathonScoreAxis;
  title: string;
  description: string;
  xpReward: number;
}

export interface HackathonQuest {
  id: string;
  title: string;
  disasterType: HackathonDisasterType;
  pillar: string;
  storyIntro: string;
  testObjective: string;
  scoreCards: HackathonScoreCard[];
  feedbackFail: string;
  feedbackPass: string;
  facilitationTip: string;
}

// As 4 quests do módulo EcoGuardians, escritas pelo usuário para o hackathon
// de justiça climática — transcritas como conteúdo fixo nesta rodada (não
// geradas por IA; ver PLANO_DESENVOLVIMENTO.md / plano de implementação para
// a integração com um prompt de IA como próximo passo possível, não feito
// aqui).
export const HACKATHON_QUESTS: HackathonQuest[] = [
  {
    id: 'quest-manguezais-aco',
    title: 'A Lenda dos Manguezais de Aço',
    disasterType: 'TSUNAMI',
    pillar: 'Natureza Restaurativa (Biomimética e Proteção Natural)',
    storyIntro:
      'A Cidade Costeira das Marés enfrenta o avanço das ondas gigantes provocadas pelo aquecimento das águas. No passado, florestas de manguezais barravam a força do oceano, mas a expansão urbana sem planejamento removeu essa proteção natural. Sem a barreira de raízes, as comunidades de pescadores da parte baixa da praia são as primeiras a serem atingidas a cada subida da maré. O Conselho dos Guardiões convocou sua equipe para projetar uma Barreira de Absorção Marítima que funcione como os antigos manguezais: quebrando a energia das ondas e criando um ecossistema seguro.',
    testObjective:
      'Construir uma estrutura amortecedora no tanque de ondas que reduza em pelo menos 70% o impacto da água antes que ela alcance as miniaturas das moradias na praia vulnerável.',
    scoreCards: [
      {
        id: 'bio-inspiracao',
        axis: 'engenharia',
        title: 'Gema da Bio-Inspiração',
        description: 'Protótipo utiliza formatos inspirados na natureza (raízes entrelaçadas, superfícies porosas ou curvas).',
        xpReward: 150
      },
      {
        id: 'escudo-costa',
        axis: 'equidade',
        title: 'Escudo da Costa',
        description: 'Nenhuma moradia da comunidade vulnerável é derrubada pela onda gerada no teste.',
        xpReward: 200
      },
      {
        id: 'selo-regeneracao',
        axis: 'regeneracao',
        title: 'Selo de Regeneração',
        description: 'A solução permite a passagem da água limpa sem destruir a vegetação simbólica ao redor.',
        xpReward: 100
      }
    ],
    feedbackFail:
      'Ajuste de Rota do Guardião: a maré passou dessa vez, mas cada onda testada é um dado de aprendizado — os antigos manguezais também levaram gerações para crescer fortes. Observe onde a água encontrou passagem e reforcem juntos essa parte da barreira.',
    feedbackPass:
      'Conquista Desbloqueada: a barreira segurou a força do oceano! A comunidade da praia está protegida — vocês honraram a sabedoria dos manguezais que vieram antes.',
    facilitationTip:
      'Pergunte à equipe: "quem vive na parte baixa da praia, e por que será que a proteção não chegou até lá primeiro?" — deixe a resposta vir da observação do território, não de um discurso pronto sobre injustiça.'
  },
  {
    id: 'quest-raizes-montanha',
    title: 'O Desafio das Raízes da Montanha',
    disasterType: 'DESLIZAMENTO',
    pillar: 'Racismo Climático / Proteção do Território Vulnerável',
    storyIntro:
      'No Bairro da Colina Verde, os moradores construíram suas vidas em terrenos íngremes porque não tiveram acesso às áreas planas do centro urbano. Quando os tremores e as chuvas intensas chegam, a terra da colina perde o equilíbrio e ameaça deslizar sobre a comunidade da base. A cidade precisa de um sistema de Ancoragem Inteligente e Alerta Precoce que fortaleça o solo e avise as famílias antes que o terreno se mova. Sua missão é provar que a tecnologia certa, aliada ao fortalecimento do solo, pode garantir a segurança de quem vive onde o perigo é maior.',
    testObjective:
      'Aplicar a solução de contenção na mesa de vibração/inclinação e garantir que o solo de simulação aguente 30 segundos de tremores intensos sem desmoronar sobre as casas da base.',
    scoreCards: [
      {
        id: 'guardiao-territorio',
        axis: 'equidade',
        title: 'Guardião do Território',
        description: 'A contenção protege 100% das casas localizadas na zona de maior risco da maquete.',
        xpReward: 200
      },
      {
        id: 'alarme-amanha',
        axis: 'engenharia',
        title: 'Alarme do Amanhã',
        description: 'Integração de um sensor ou mecanismo de aviso prévio que aciona antes do colapso do solo.',
        xpReward: 100
      },
      {
        id: 'engenharia-acessivel',
        axis: 'regeneracao',
        title: 'Engenharia Acessível',
        description: 'Projeto construído utilizando materiais de baixo custo ou reciclados, demonstrando viabilidade real de aplicação.',
        xpReward: 150
      }
    ],
    feedbackFail:
      'Ajuste de Rota do Guardião: a colina venceu esse round, mas todo protótipo de treino ensina algo sobre onde o solo é mais fraco. Testem reforçar exatamente o ponto onde a queda começou.',
    feedbackPass:
      'Conquista Desbloqueada: a encosta segurou firme! O Bairro da Colina Verde ganhou uma noite tranquila graças à ancoragem da sua equipe.',
    facilitationTip:
      'Antes de construir, peça para desenharem quem mora na base da colina — uma família, um idoso, uma criança — e lembre a equipe: a solução vale mais quando protege quem tem menos escolha de onde morar.'
  },
  {
    id: 'quest-canais-esmeralda',
    title: 'A Rota dos Canais Esmeralda',
    disasterType: 'ENCHENTE',
    pillar: 'Infraestrutura Verde e Justiça Territorial',
    storyIntro:
      'Durante as tempestades, o Distrito Central possui galerias de escoamento eficientes, mas a água da chuva acumulada é toda direcionada para a Baixada dos Rios, onde fica a comunidade periférica da cidade. Sem solo permeável para absorver a água, a Baixada transforma-se em um grande lago em poucos minutos. A guilda de construtores precisa redesenhar o caminho da água, criando Canais Absorventes e Jardins de Chuva que segurem o excesso de água no próprio local onde ela cai, impedindo que a periferia seja inundada.',
    testObjective:
      'Instalar a solução ao longo da calha de água e demonstrar que a retenção/absorção reduz o volume de água que chega à zona baixa da maquete durante um teste de fluxo contínuo.',
    scoreCards: [
      {
        id: 'efeito-esponja',
        axis: 'engenharia',
        title: 'Efeito Esponja',
        description: 'A solução consegue reter ou desacelerar o fluxo de água na parte alta da maquete.',
        xpReward: 150
      },
      {
        id: 'justica-hidrossocial',
        axis: 'equidade',
        title: 'Justiça Hidro-Social',
        description: 'A Baixada dos Rios permanece seca ou com nível de água seguro durante todo o teste de chuva simulada.',
        xpReward: 200
      },
      {
        id: 'cidade-permeavel',
        axis: 'regeneracao',
        title: 'Cidade Permeável',
        description: 'Uso de jardins filtrantes sintéticos que limpam a água antes de ela chegar ao destino final.',
        xpReward: 100
      }
    ],
    feedbackFail:
      'Ajuste de Rota do Guardião: a água encontrou um caminho que vocês não esperavam — ótimo dado de treino! Observem onde ela transbordou primeiro e reforcem a retenção bem ali, na parte alta.',
    feedbackPass:
      'Conquista Desbloqueada: a Baixada dos Rios ficou seca! Os canais esmeralda seguraram a chuva onde ela caiu, exatamente como planejado.',
    facilitationTip:
      'Mostre no mapa da maquete que a água "escolhe" o caminho mais fácil, não o mais justo — e pergunte à equipe onde ela pode ser convidada a parar antes de chegar à parte mais vulnerável.'
  },
  {
    id: 'quest-domo-ventos',
    title: 'O Domo dos Ventos Antagônicos',
    disasterType: 'TORNADO',
    pillar: 'Resiliência Comunitária e Abrigo Seguro',
    storyIntro:
      'Nas planícies abertas do Vale do Sol, os ventos fortes surgem repentinamente, atingindo principalmente os galpões comunitários e as moradias de estrutura leve da região rural. A força do ar costuma arrancar telhados e isolar as famílias sem comunicação. A equipe foi convocada para erguer um Domo de Proteção e Ancoragem Aerodinâmica que consiga canalizar a força do vento para longe das estruturas e manter o centro de apoio comunitário de pé e energizado.',
    testObjective:
      'Posicionar a estrutura no simulador de vento (soprador/ventilador) e demonstrar estabilidade aerodinâmica mantendo a estrutura fixa e protegida durante o teste no nível máximo do aparelho.',
    scoreCards: [
      {
        id: 'escudo-aerodinamico',
        axis: 'regeneracao',
        title: 'Escudo Aerodinâmico',
        description: 'O formato da estrutura faz o vento fluir ao redor sem levantar ou deslocar a maquete.',
        xpReward: 150
      },
      {
        id: 'ponto-encontro',
        axis: 'equidade',
        title: 'Ponto de Encontro',
        description: 'O abrigo comunitário central permanece 100% intacto após a rajada de vento.',
        xpReward: 200
      },
      {
        id: 'rede-inquebravel',
        axis: 'engenharia',
        title: 'Rede Inquebrável',
        description: 'Demonstração de um sistema de sinalização visual ou sonora que permanece funcional mesmo sob a força do vento.',
        xpReward: 100
      }
    ],
    feedbackFail:
      'Ajuste de Rota do Guardião: o vento venceu essa rajada, mas agora vocês sabem exatamente onde a estrutura cedeu. Todo domo forte começa com alguns protótipos que aprenderam a cair.',
    feedbackPass:
      'Conquista Desbloqueada: o domo segurou o vendaval! O centro de apoio comunitário do Vale do Sol continua de pé, iluminado e conectado.',
    facilitationTip:
      'Lembre a equipe que quem mora em moradias mais leves geralmente tem menos opção de reforçar sozinho a própria casa — o domo vale mais quando pensa primeiro no abrigo coletivo, não só na própria maquete.'
  }
];

export interface HackathonStation {
  id: HackathonDisasterType;
  label: string;
  icon: string;
  simulatorLabel: string;
  questId: string;
}

export const HACKATHON_STATIONS: HackathonStation[] = [
  {
    id: 'TSUNAMI',
    label: 'Ondas / Tsunami',
    icon: '🌊',
    simulatorLabel: 'Tanque de ondas',
    questId: 'quest-manguezais-aco'
  },
  {
    id: 'DESLIZAMENTO',
    label: 'Terremoto / Deslizamento',
    icon: '⛰️',
    simulatorLabel: 'Mesa de vibração',
    questId: 'quest-raizes-montanha'
  },
  {
    id: 'ENCHENTE',
    label: 'Enchente / Alagamento',
    icon: '💧',
    simulatorLabel: 'Calha de água inclinada',
    questId: 'quest-canais-esmeralda'
  },
  {
    id: 'TORNADO',
    label: 'Tornado / Vendaval',
    icon: '🌪️',
    simulatorLabel: 'Simulador de vento',
    questId: 'quest-domo-ventos'
  }
];

export function getHackathonQuest(questId: string | undefined): HackathonQuest | undefined {
  return HACKATHON_QUESTS.find((q) => q.id === questId);
}

export function getHackathonStation(disasterType: HackathonDisasterType): HackathonStation | undefined {
  return HACKATHON_STATIONS.find((s) => s.id === disasterType);
}
