import type { SkillQuizQuestion } from '../types';

// Banco de "desafios relâmpago" — 3 perguntas por nó de habilidade real da
// árvore (SKILL_NODES em mockData.ts), exclui o nó secreto
// (secret_cypher_node), que se destrava pelo Terminal Hacker, não por este
// fluxo. QuizChallenge filtra pelo skillId e sorteia uma pergunta do grupo a
// cada tentativa, para reduzir repetição de quem tenta várias vezes.
/** Sorteia uma pergunta de um pool já filtrado por skillId — mantém a
 * memoização no chamador (useMemo) responsável por não resortear a cada
 * re-render incidental, só quando o nó/missão selecionado muda de verdade. */
export function pickSkillQuiz(pool: SkillQuizQuestion[]): SkillQuizQuestion | undefined {
  if (pool.length === 0) return undefined;
  return pool[Math.floor(Math.random() * pool.length)];
}

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
    skillId: 'logic_unplugged',
    question: 'O que significa "pensar como um programador" antes mesmo de escrever qualquer código?',
    options: [
      'Decorar a sintaxe de várias linguagens',
      'Comprar um computador mais rápido',
      'Quebrar um problema grande em passos menores e mais claros',
      'Desenhar bem no papel'
    ],
    correctIndex: 2
  },
  {
    skillId: 'logic_unplugged',
    question: 'Em um fluxograma manual (sem computador), o que um losango costuma representar?',
    options: ['O início do processo', 'Uma decisão (sim/não)', 'Uma instrução simples', 'O fim do processo'],
    correctIndex: 1
  },
  {
    skillId: 'conditionals_basic',
    question: 'Qual estrutura de decisão faz o programa escolher entre dois caminhos diferentes?',
    options: ['O laço FOR', 'A variável', 'O IF / ELSE', 'O comentário de código'],
    correctIndex: 2
  },
  {
    skillId: 'conditionals_basic',
    question: 'Qual é a função de um fluxograma quando aplicado à lógica condicional?',
    options: [
      'Mostrar visualmente os caminhos possíveis que um programa pode seguir',
      'Substituir o código totalmente',
      'Desenhar o hardware do computador',
      'Armazenar dados permanentemente'
    ],
    correctIndex: 0
  },
  {
    skillId: 'conditionals_basic',
    question: '"Se está chovendo, eu levo guarda-chuva; senão, não levo" é um exemplo do dia a dia de:',
    options: ['Um laço infinito', 'Uma variável', 'Uma estrutura condicional', 'Um erro de lógica'],
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
    skillId: 'circuitos_makey_makey',
    question: 'O que o cabo "EARTH" (terra) do Makey Makey precisa estar fazendo para o circuito funcionar?',
    options: [
      'Conectado a uma tomada',
      'Sendo segurado pela mão da pessoa, fechando o circuito pelo corpo',
      'Desconectado da placa',
      'Mergulhado em água'
    ],
    correctIndex: 1
  },
  {
    skillId: 'circuitos_makey_makey',
    question: 'Um objeto de plástico seco (como uma régua) funciona bem como tecla no Makey Makey?',
    options: [
      'Sim, sempre',
      'Não, porque plástico seco é isolante elétrico e não conduz corrente',
      'Só se for colorido',
      'Só se for muito grande'
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
      'É só decoração, sem função elétrica'
    ],
    correctIndex: 1
  },
  {
    skillId: 'arduino_basico',
    question: 'O que faz o comando pinMode() no início de um sketch Arduino?',
    options: [
      'Liga o LED imediatamente',
      'Define se um pino vai funcionar como entrada (INPUT) ou saída (OUTPUT)',
      'Mede a temperatura ambiente',
      'Conecta a placa ao Wi-Fi'
    ],
    correctIndex: 1
  },
  {
    skillId: 'arduino_basico',
    question: 'Qual a diferença entre digitalWrite() e analogWrite()?',
    options: [
      'Não há diferença nenhuma',
      'digitalWrite liga/desliga (HIGH/LOW); analogWrite varia a intensidade via PWM',
      'analogWrite só funciona com sensores de som',
      'digitalWrite é sempre mais rápido'
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
      'Apenas comandos de voz'
    ],
    correctIndex: 1
  },
  {
    skillId: 'lego_wedo',
    question: 'Para que serve o Hub do Lego WeDo 2.0?',
    options: [
      'É o "cérebro" que se conecta por Bluetooth ao app e controla motor/sensor',
      'É só uma peça decorativa',
      'Serve para imprimir peças em 3D',
      'É uma bateria extra sem outra função'
    ],
    correctIndex: 0
  },
  {
    skillId: 'lego_wedo',
    question: 'Qual é o principal objetivo pedagógico do WeDo 2.0 antes de avançar para o EV3?',
    options: [
      'Ensinar Python avançado direto',
      'Dar o primeiro contato com robótica motorizada de forma simples',
      'Ensinar técnicas de soldagem',
      'Ensinar a programar em C++'
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
    skillId: 'identidade_visual_canva',
    question: 'Por que manter as mesmas cores e fontes em todos os materiais de um projeto?',
    options: [
      'Para gastar mais tinta',
      'Para criar consistência visual e reconhecimento da marca/guilda',
      'Não tem importância nenhuma',
      'Só para deixar bonito, sem outro motivo'
    ],
    correctIndex: 1
  },
  {
    skillId: 'identidade_visual_canva',
    question: 'O que é uma "paleta de cores" em um projeto de design?',
    options: [
      'Um conjunto pequeno e definido de cores usadas de forma consistente',
      'Qualquer cor disponível no Canva',
      'Uma ferramenta de desenho 3D',
      'Um tipo específico de fonte'
    ],
    correctIndex: 0
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
    skillId: 'scratch_basics',
    question: 'Para que serve uma "variável" no Scratch, como o placar de um jogo?',
    options: [
      'Guardar e atualizar um valor que muda durante o jogo',
      'Mudar a cor do fundo',
      'Desenhar o sprite',
      'Conectar o projeto à internet'
    ],
    correctIndex: 0
  },
  {
    skillId: 'scratch_basics',
    question: 'O que é um "evento" no Scratch, como o bloco "quando a bandeira verde for clicada"?',
    options: ['Um erro de código', 'Um gatilho que inicia um bloco de comandos', 'Um tipo de sprite', 'Uma variável numérica'],
    correctIndex: 1
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
    skillId: 'app_inventor',
    question: 'Como o App Inventor é estruturado para programar?',
    options: [
      'Só em texto, como Python',
      'Em blocos visuais, parecido com o Scratch',
      'Apenas por comando de voz',
      'Não permite programar, só usar apps prontos'
    ],
    correctIndex: 1
  },
  {
    skillId: 'app_inventor',
    question: 'Qual sensor de celular é comumente usado em apps de App Inventor para localizar pontos no mapa?',
    options: ['Sensor de localização (GPS)', 'Sensor de impressão digital', 'Câmera traseira apenas', 'Sensor de temperatura da bateria'],
    correctIndex: 0
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
    skillId: 'python_intro',
    question: 'O que é uma "string" em Python?',
    options: ['Um tipo de laço', 'Um dado de texto, entre aspas', 'Um erro de sintaxe', 'Um componente eletrônico'],
    correctIndex: 1
  },
  {
    skillId: 'python_intro',
    question: 'O que faz um laço "for" em Python?',
    options: [
      'Repete um bloco de código um número definido de vezes',
      'Executa o código só uma vez',
      'Pausa o programa para sempre',
      'Apaga todas as variáveis'
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
    skillId: 'modelagem_3d_tinkercad',
    question: 'O que significa "agrupar" (Group) duas formas no Tinkercad?',
    options: ['Apagar as duas formas', 'Uni-las em um único objeto sólido', 'Girar a câmera', 'Mudar a cor das peças'],
    correctIndex: 1
  },
  {
    skillId: 'modelagem_3d_tinkercad',
    question: 'Por que modelar em 3D antes de imprimir é importante?',
    options: [
      'Não é importante, dá pra imprimir sem modelo nenhum',
      'Permite planejar e corrigir a peça digitalmente antes de gastar material',
      'Serve só para decoração',
      'É uma exigência apenas burocrática'
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
    skillId: 'minecraft_education',
    question: 'O que são "circuitos de redstone" no Minecraft?',
    options: [
      'Um tipo de comida do jogo',
      'O sistema do jogo que simula eletricidade e permite construir mecanismos automáticos',
      'Um comando de chat',
      'Uma skin especial'
    ],
    correctIndex: 1
  },
  {
    skillId: 'minecraft_education',
    question: 'Qual habilidade de pensamento computacional o Code Builder reforça principalmente?',
    options: [
      'Sequenciamento e automação de tarefas dentro de um ambiente 3D',
      'Apenas desenho artístico',
      'Digitação rápida',
      'Edição de vídeo'
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
    skillId: 'open_roberta_lab',
    question: 'O Open Roberta Lab é executado onde?',
    options: [
      'Só instalado localmente, sem internet',
      'No navegador, sem precisar instalar nada',
      'Apenas em tablets de uma marca específica',
      'Só em supercomputadores'
    ],
    correctIndex: 1
  },
  {
    skillId: 'open_roberta_lab',
    question: 'Por que ter um ambiente único (NEPO) para programar vários robôs diferentes é uma vantagem pedagógica?',
    options: [
      'Não é uma vantagem',
      'Os alunos aprendem uma lógica que se aplica a robôs diferentes, sem recomeçar do zero',
      'Torna tudo mais lento',
      'Limita a criatividade dos alunos'
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
    skillId: 'apresentacao_publica',
    question: 'O que o Gamma faz de diferente na criação de slides?',
    options: [
      'Gera apresentações usando IA a partir de um texto',
      'Só permite slides em preto e branco',
      'É um editor de vídeo',
      'Não existe geração automática nele'
    ],
    correctIndex: 0
  },
  {
    skillId: 'apresentacao_publica',
    question: 'Por que organizar dados em planilhas (Office 365) antes de apresentar um projeto?',
    options: [
      'Não tem utilidade nenhuma',
      'Ajuda a mostrar resultados de forma clara e confiável',
      'É apenas decorativo',
      'Substitui o projeto em si'
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
    skillId: 'microbit_starter',
    question: 'O que o acelerômetro do micro:bit permite detectar?',
    options: [
      'Temperatura ambiente',
      'Movimento e inclinação da placa (como um "shake")',
      'A cor de objetos próximos',
      'Distância de obstáculos'
    ],
    correctIndex: 1
  },
  {
    skillId: 'microbit_starter',
    question: 'Como um micro:bit pode se comunicar com outro micro:bit sem fio?',
    options: ['Apenas por cabo USB', 'Usando o rádio embutido', 'Não é possível', 'Apenas com Bluetooth pareado manualmente'],
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
    skillId: 'lego_ev3',
    question: 'O que diferencia um sensor de cor de um sensor ultrassônico no EV3?',
    options: [
      'São o mesmo sensor com nomes diferentes',
      'O de cor identifica cores/luz; o ultrassônico mede distância por som',
      'O sensor de cor também mede distância',
      'O ultrassônico só funciona no escuro'
    ],
    correctIndex: 1
  },
  {
    skillId: 'lego_ev3',
    question: 'O EV3 é programado principalmente através de:',
    options: [
      'Comandos de voz',
      'Um software de blocos próprio (compatível com ambientes como o NEPO)',
      'Apenas C++ puro, sem blocos',
      'Não é programável'
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
    skillId: 'esp8266_advanced',
    question: 'O que significa "MQTT", um protocolo comum em projetos com ESP8266?',
    options: [
      'Um tipo de resistor',
      'Um protocolo leve de mensagens para comunicação IoT',
      'Uma linguagem de programação',
      'Um sistema operacional'
    ],
    correctIndex: 1
  },
  {
    skillId: 'esp8266_advanced',
    question: 'Por que o ESP8266 é tão usado em projetos de Internet das Coisas (IoT)?',
    options: [
      'Porque é o único microcontrolador que existe',
      'Porque combina baixo custo com conectividade Wi-Fi embutida',
      'Porque não precisa de nenhum código',
      'Porque é fisicamente maior que outras placas'
    ],
    correctIndex: 1
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
    skillId: 'fablab_machining',
    question: 'O que é "corte vetorial" feito por uma cortadora a laser?',
    options: [
      'Corte seguindo linhas e curvas definidas digitalmente com alta precisão',
      'Corte aleatório sem controle',
      'Uma técnica de pintura',
      'Um tipo de solda'
    ],
    correctIndex: 0
  },
  {
    skillId: 'fablab_machining',
    question: 'Por que testar/simular o arquivo de fatiamento antes de mandar para a máquina?',
    options: [
      'Não é necessário testar nada',
      'Para identificar erros antes de gastar material e tempo de máquina',
      'Só para deixar o processo mais lento de propósito',
      'É uma etapa puramente decorativa'
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
    skillId: 'raspberry_pi_avancado',
    question: 'O que é "GPIO" em um Raspberry Pi?',
    options: [
      'O sistema de arquivos do Linux',
      'Os pinos de entrada/saída de uso geral, como no Arduino',
      'O processador principal',
      'O cartão de memória'
    ],
    correctIndex: 1
  },
  {
    skillId: 'raspberry_pi_avancado',
    question: 'Por que o Raspberry Pi é indicado para projetos que exigem mais processamento, como visão computacional?',
    options: [
      'Porque tem um processador completo, capaz de tarefas mais pesadas que um microcontrolador simples',
      'Porque é mais barato que qualquer sensor',
      'Porque não tem sistema operacional',
      'Porque só processa texto simples'
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
  },
  {
    skillId: 'drone_intro',
    question: 'O que costuma ser necessário fazer antes do primeiro voo de um drone educacional?',
    options: [
      'Nada, pode voar direto da caixa',
      'Calibrar os sensores e motores',
      'Desmontar o drone completamente',
      'Trocar as hélices por peças mais pesadas'
    ],
    correctIndex: 1
  },
  {
    skillId: 'drone_intro',
    question: 'O que caracteriza uma "missão autônoma" em um drone programável?',
    options: [
      'O piloto controla manualmente o tempo todo',
      'O drone segue um roteiro pré-programado de pontos, sem controle manual constante',
      'O drone não decola',
      'É apenas um modo especial de câmera'
    ],
    correctIndex: 1
  }
];
