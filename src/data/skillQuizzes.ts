import type { SkillQuizQuestion } from '../types';

// Um "desafio relâmpago" por nó de habilidade real da árvore (SKILL_NODES em
// mockData.ts) — exclui o nó secreto (secret_cypher_node), que se destrava
// pelo Terminal Hacker, não por este fluxo. Usado tanto para desbloquear uma
// habilidade na Trilha quanto para aceitar uma missão que exige essa
// habilidade (QuizChallenge escolhe a pergunta a partir de requiredSkills).
export const SKILL_QUIZZES: SkillQuizQuestion[] = [
  {
    skillId: 'logic_unplugged',
    question: 'Em pensamento computacional, o que é um "algoritmo"?',
    options: [
      'Um programa de computador escrito em Python',
      'Uma sequência finita e ordenada de passos para resolver um problema',
      'Um tipo de erro de sintaxe no código',
      'O nome de um componente eletrônico'
    ],
    correctIndex: 1
  },
  {
    skillId: 'conditionals_basic',
    question: 'Qual estrutura de decisão faz o programa escolher entre dois caminhos diferentes?',
    options: ['O laço FOR', 'A variável', 'O IF / ELSE', 'O comentário de código'],
    correctIndex: 2
  },
  {
    skillId: 'circuitos_makey_makey',
    question: 'Por que uma banana consegue "apertar" uma tecla no Makey Makey?',
    options: [
      'Porque ela tem uma pilha escondida',
      'Porque ela conduz eletricidade o suficiente para fechar o circuito',
      'Porque o Makey Makey tem Bluetooth',
      'Porque a casca da banana é magnética'
    ],
    correctIndex: 1
  },
  {
    skillId: 'arduino_basico',
    question: 'Por que um LED precisa de um resistor em série ao ser ligado no Arduino?',
    options: [
      'Para deixar o LED mais brilhante',
      'Para limitar a corrente e evitar que o LED queime',
      'Porque o Arduino não liga sem resistor',
      'Só é decoração, não tem função elétrica'
    ],
    correctIndex: 1
  },
  {
    skillId: 'lego_wedo',
    question: 'O que o Lego WeDo 2.0 usa para dar as primeiras noções de robótica motorizada?',
    options: [
      'Apenas peças estáticas, sem motor',
      'Um motor e um sensor programados por blocos',
      'Um teclado físico externo',
      'Comandos de voz apenas'
    ],
    correctIndex: 1
  },
  {
    skillId: 'identidade_visual_canva',
    question: 'O que compõe a "identidade visual" de um projeto ou guilda?',
    options: [
      'Só o nome escolhido',
      'Logotipo, paleta de cores e materiais gráficos consistentes',
      'A senha da conta do Canva',
      'O código-fonte do projeto'
    ],
    correctIndex: 1
  },
  {
    skillId: 'scratch_basics',
    question: 'No Scratch, o que faz um jogo "reagir" quando dois sprites se tocam?',
    options: [
      'Um bloco de lógica de colisão/toque',
      'A cor de fundo do palco',
      'O nome do projeto',
      'O tamanho da tela'
    ],
    correctIndex: 0
  },
  {
    skillId: 'app_inventor',
    question: 'O que diferencia o App Inventor do Scratch?',
    options: [
      'App Inventor não usa blocos',
      'App Inventor gera aplicativos para celular Android, usando sensores do próprio aparelho',
      'App Inventor só funciona offline',
      'Não existe diferença nenhuma'
    ],
    correctIndex: 1
  },
  {
    skillId: 'python_intro',
    question: 'Qual é o "salto" que Python representa em relação ao Scratch?',
    options: [
      'Sair dos blocos visuais para escrever código em texto puro',
      'Deixar de usar variáveis',
      'Programar sem lógica condicional',
      'Programar só para robôs, nunca para jogos'
    ],
    correctIndex: 0
  },
  {
    skillId: 'modelagem_3d_tinkercad',
    question: 'No Tinkercad, para que serve a operação "Hole" (furo)?',
    options: [
      'Para colorir a peça',
      'Para subtrair uma forma de outra, criando um vazio',
      'Para exportar o projeto',
      'Para girar a câmera 3D'
    ],
    correctIndex: 1
  },
  {
    skillId: 'minecraft_education',
    question: 'O que o "Code Builder" do Minecraft Education permite fazer?',
    options: [
      'Programar ações e construções dentro do próprio jogo',
      'Apenas trocar a skin do personagem',
      'Jogar em modo multiplayer sem código',
      'Editar vídeos do jogo'
    ],
    correctIndex: 0
  },
  {
    skillId: 'open_roberta_lab',
    question: 'O que torna o Open Roberta Lab (NEPO) especial entre os ambientes de blocos?',
    options: [
      'Só funciona com um único modelo de robô',
      'É um ambiente livre que programa vários robôs educacionais diferentes na mesma interface',
      'Não precisa de internet nunca',
      'Substitui o Arduino por completo'
    ],
    correctIndex: 1
  },
  {
    skillId: 'apresentacao_publica',
    question: 'O que forma um bom "pitch" de projeto, segundo esta trilha (Gamma + Office 365)?',
    options: [
      'Só um vídeo sem slides',
      'Slides bem estruturados e documentação/dados organizados',
      'Um código-fonte sem explicação',
      'Uma apresentação sem nenhum dado'
    ],
    correctIndex: 1
  },
  {
    skillId: 'microbit_starter',
    question: 'Quais recursos JÁ vêm embutidos no micro:bit, sem precisar comprar sensor extra?',
    options: [
      'Só a matriz de LEDs, nada mais',
      'Matriz de LEDs, acelerômetro, bússola e rádio',
      'Apenas Wi-Fi',
      'Uma câmera de alta resolução'
    ],
    correctIndex: 1
  },
  {
    skillId: 'lego_ev3',
    question: 'O que o Lego Mindstorms EV3 acrescenta em relação ao WeDo 2.0?',
    options: [
      'Nada, são idênticos',
      'Servomotores e sensores mais avançados, como ultrassônico e de cor',
      'Deixa de usar motores',
      'Só funciona com comando de voz'
    ],
    correctIndex: 1
  },
  {
    skillId: 'esp8266_advanced',
    question: 'O que o ESP8266/NodeMCU tem de diferente de um Arduino Uno comum?',
    options: [
      'Tem Wi-Fi embutido, permitindo conectividade IoT',
      'É mais lento e sem GPIO',
      'Não pode ser programado em C++',
      'Só funciona com baterias especiais'
    ],
    correctIndex: 0
  },
  {
    skillId: 'fablab_machining',
    question: 'Qual é o caminho correto do modelo digital até a peça física em fabricação digital?',
    options: [
      'Direto do desenho para a impressora, sem etapas',
      'Modelar em 3D → fatiar no software (slicer) → imprimir/cortar',
      'Cortar primeiro, modelar depois',
      'Não é preciso modelar nada'
    ],
    correctIndex: 1
  },
  {
    skillId: 'raspberry_pi_avancado',
    question: 'O que diferencia o Raspberry Pi de um microcontrolador como o Arduino?',
    options: [
      'É um microcomputador completo, rodando um sistema operacional Linux de verdade',
      'É menor que um Arduino',
      'Não tem portas GPIO',
      'Só roda jogos, nada de programação'
    ],
    correctIndex: 0
  },
  {
    skillId: 'drone_intro',
    question: 'O que é uma "controladora de voo" em um drone educacional?',
    options: [
      'O controle remoto físico do piloto',
      'O componente que estabiliza e comanda os motores durante o voo',
      'A bateria do drone',
      'A hélice traseira'
    ],
    correctIndex: 1
  }
];
