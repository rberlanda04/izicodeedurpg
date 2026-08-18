import type { Guild, SkillNode, Quest, HardwareItem, CuriosityCard, BossRaidCampaign, QuickHackAlert } from '../types';
import { PROJECT_CATALOG } from './projectCatalog';

export const INITIAL_GUILDS: Guild[] = [
  {
    id: 'guild-1',
    name: 'Mágicos do Solder',
    motto: 'Transformando código em circuitos reais!',
    emblemUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=150&auto=format&fit=crop&q=80',
    leaderId: 'user-77',
    leaderName: 'CyberKnight_99',
    members: [
      { uid: 'user-77', name: 'CyberKnight_99', role: 'MAKER', avatarHead: '🤖' },
      { uid: 'user-88', name: 'PixelCoder_X', role: 'SCRUM_MASTER', avatarHead: '🧙‍♂️' },
      { uid: 'user-99', name: 'CircuitQueen', role: 'DEVELOPER', avatarHead: '🦊' },
      { uid: 'user-100', name: 'RoboBuilder_99', role: 'PRODUCT_OWNER', avatarHead: '👨‍🚀' }
    ],
    score: 4850,
    canvaFigmaLink: 'https://figma.com/file/sample-izicode-guild'
  },
  {
    id: 'guild-2',
    name: 'Hackers da Amazônia',
    motto: 'Tecnologia verde contra o aquecimento global!',
    emblemUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=150&auto=format&fit=crop&q=80',
    leaderId: 'user-201',
    leaderName: 'GreenHacker',
    members: [
      { uid: 'user-201', name: 'GreenHacker', role: 'SCRUM_MASTER', avatarHead: '🌿' },
      { uid: 'user-202', name: 'EcoMaker', role: 'MAKER', avatarHead: '🔋' }
    ],
    score: 4200
  }
];

// Árvore de habilidades — os ids batem com os que src/data/projectCatalog.ts
// (gerado do catálogo real de 37 projetos do izicode-landing) usa em
// requiredSkills, então cada ferramenta real (Arduino, Python, Tinkercad,
// Raspberry Pi, Makey Makey) tem um nó correspondente para destravar.
export const SKILL_NODES: SkillNode[] = [
  // Tier Básico
  {
    id: 'logic_unplugged',
    title: 'Lógica Unplugged & Algoritmos',
    tier: 'BASIC',
    category: 'LOGIC',
    prerequisites: [],
    description: 'Compreensão fundamental de sequenciamento, loops manuais e fluxo de pensamento computacional sem computador.',
    icon: '🧩'
  },
  {
    id: 'conditionals_basic',
    title: 'Tomadas de Decisão (IF / ELSE)',
    tier: 'BASIC',
    category: 'LOGIC',
    prerequisites: ['logic_unplugged'],
    description: 'Fluxogramas e lógica condicional aplicada à resolução de problemas cotidianos.',
    icon: '🔀'
  },
  {
    id: 'circuitos_makey_makey',
    title: 'Circuitos com Makey Makey',
    tier: 'BASIC',
    category: 'ELECTRONICS',
    prerequisites: [],
    hardwareUnlocked: ['makey_makey'],
    description: 'Condutividade elétrica de materiais do dia a dia (frutas, água, grafite) para fechar circuitos com o próprio corpo.',
    icon: '🍌'
  },
  {
    id: 'arduino_basico',
    title: 'Eletrônica Básica com Arduino',
    tier: 'BASIC',
    category: 'ELECTRONICS',
    prerequisites: ['logic_unplugged'],
    hardwareUnlocked: ['arduino_uno', 'leds', 'resistores', 'sensores_basicos'],
    description: 'LEDs, resistores, botões e sensores simples com Arduino Uno e C++ — a porta de entrada para eletrônica programável.',
    icon: '🔌'
  },
  {
    id: 'lego_wedo',
    title: 'Robótica Inicial com Lego WeDo 2.0',
    tier: 'BASIC',
    category: 'ELECTRONICS',
    prerequisites: [],
    hardwareUnlocked: ['lego_wedo2'],
    description: 'Primeiro contato com robótica motorizada: engrenagens simples, um motor e um sensor, programados em blocos no app oficial.',
    icon: '🧱'
  },
  {
    id: 'identidade_visual_canva',
    title: 'Identidade Visual com Canva',
    tier: 'BASIC',
    category: 'DESIGN',
    prerequisites: [],
    description: 'Criação de logotipos, paletas de cor e materiais gráficos simples para dar cara a um projeto ou a uma guilda.',
    icon: '🎨'
  },
  // Tier Intermediário
  {
    id: 'scratch_basics',
    title: 'Programação em Blocos (Scratch/Code.org)',
    tier: 'INTERMEDIATE',
    category: 'BLOCKS',
    prerequisites: ['logic_unplugged', 'conditionals_basic'],
    description: 'Criação de jogos 2D, animações interativas e simulações com variáveis e eventos.',
    icon: '🐈'
  },
  {
    id: 'app_inventor',
    title: 'Criador de Apps (App Inventor)',
    tier: 'INTERMEDIATE',
    category: 'BLOCKS',
    prerequisites: ['scratch_basics'],
    description: 'Desenvolvimento de aplicativos móveis para Android usando sensores de smartphone.',
    icon: '📱'
  },
  {
    id: 'python_intro',
    title: 'Programação em Python',
    tier: 'INTERMEDIATE',
    category: 'LOGIC',
    prerequisites: ['scratch_basics'],
    description: 'Salto dos blocos para código em texto: variáveis, laços, condicionais e strings em Python puro.',
    icon: '🐍'
  },
  {
    id: 'modelagem_3d_tinkercad',
    title: 'Modelagem 3D no Tinkercad',
    tier: 'INTERMEDIATE',
    category: 'PROTOTYPING',
    prerequisites: ['logic_unplugged'],
    hardwareUnlocked: ['tinkercad'],
    description: 'Geometria espacial e prototipagem digital: sólidos, agrupamentos e furos para desenhar antes de fabricar.',
    icon: '🧊'
  },
  {
    id: 'minecraft_education',
    title: 'Pensamento Computacional no Minecraft Education',
    tier: 'INTERMEDIATE',
    category: 'BLOCKS',
    prerequisites: ['scratch_basics'],
    description: 'Code Builder e circuitos de redstone para resolver desafios de construção e automação dentro do jogo.',
    icon: '⛏️'
  },
  {
    id: 'open_roberta_lab',
    title: 'Programação de Robôs no Open Roberta Lab',
    tier: 'INTERMEDIATE',
    category: 'BLOCKS',
    prerequisites: ['scratch_basics'],
    description: 'Ambiente de blocos livre (NEPO) usado para programar diferentes robôs educacionais na mesma interface.',
    icon: '🧭'
  },
  {
    id: 'apresentacao_publica',
    title: 'Apresentação de Projetos com Gamma & Office 365',
    tier: 'INTERMEDIATE',
    category: 'DESIGN',
    prerequisites: ['identidade_visual_canva'],
    description: 'Estruturar um pitch: slides gerados com IA no Gamma e documentação/planilhas de dados no Office 365.',
    icon: '📊'
  },
  // Tier Avançado
  {
    id: 'microbit_starter',
    title: 'Micro:bit & Matata Robotics',
    tier: 'ADVANCED',
    category: 'ELECTRONICS',
    prerequisites: ['scratch_basics'],
    hardwareUnlocked: ['microbit', 'matata_kit'],
    description: 'Matriz de LEDs, acelerômetro básico, bússola e rádio frequência em microcontroladores de entrada.',
    icon: '📟'
  },
  {
    id: 'lego_ev3',
    title: 'Automação & Robótica Lego Mindstorms',
    tier: 'ADVANCED',
    category: 'ELECTRONICS',
    prerequisites: ['microbit_starter'],
    hardwareUnlocked: ['lego_ev3'],
    description: 'Engrenagens, servomotores, sensores ultrassônicos e de cor.',
    icon: '🤖'
  },
  // Tier Especialista
  {
    id: 'esp8266_advanced',
    title: 'Microcontroladores IoT (ESP8266 & NodeMCU 1.0)',
    tier: 'SPECIALIST',
    category: 'PROTOTYPING',
    prerequisites: ['arduino_basico'],
    hardwareUnlocked: ['esp8266', 'nodemcu_1.0', 'mma8451_accel'],
    description: 'Conectividade Wi-Fi, comunicação bus I2C, leitura de acelerômetros analógicos/digitais e telemetria HTTP/MQTT.',
    icon: '📡'
  },
  {
    id: 'fablab_machining',
    title: 'Fabricação Digital (Laser & Impressora 3D)',
    tier: 'SPECIALIST',
    category: 'PROTOTYPING',
    prerequisites: ['modelagem_3d_tinkercad'],
    allowsResourceBooking: true,
    description: 'Do modelo 3D à peça física: fatiamento no Cura e corte vetorial em acrílico/MDF.',
    icon: '🖨️'
  },
  {
    id: 'raspberry_pi_avancado',
    title: 'Sistemas Embarcados com Raspberry Pi',
    tier: 'SPECIALIST',
    category: 'PROTOTYPING',
    prerequisites: ['python_intro'],
    hardwareUnlocked: ['raspberry_pi'],
    description: 'Linux embarcado, GPIO e projetos completos de computador de placa única.',
    icon: '🍓'
  },
  {
    id: 'drone_intro',
    title: 'Aeromodelismo Programável (Drones)',
    tier: 'SPECIALIST',
    category: 'ELECTRONICS',
    prerequisites: ['arduino_basico'],
    hardwareUnlocked: ['drone_kit'],
    description: 'Controladoras de voo, calibração de motores e missões autônomas simples com drones educacionais.',
    icon: '🚁'
  },
  // Secret Node (Hacker Hidden Quest)
  {
    id: 'secret_cypher_node',
    title: 'Nó Oculto: Cypherpunk Protocol',
    tier: 'SPECIALIST',
    category: 'PROTOTYPING',
    prerequisites: ['esp8266_advanced'],
    isSecretNode: true,
    secretHint: 'Execute o comando /unlock-quest IZI-CYBER no Terminal Hacker',
    description: 'Comunicação criptografada AES entre placas ESP8266 e nós ocultos da rede da escola.',
    icon: '🕵️'
  }
];

// Mural inicial de uma turma nova: um recorte real do catálogo
// (src/data/projectCatalog.ts) com boa variedade de tier e ferramenta —
// todos com guideContent (tutorial completo), mais a quest secreta do
// Terminal Hacker. Ampliado de 9 para 24 projetos nesta rodada.
const STARTER_PROJECT_IDS = [
  // BASIC
  'proj-piano-de-frutas', // Makey Makey
  'proj-jogo-reciclagem-scratch', // Scratch
  'proj-semaforo-inteligente', // Arduino
  'proj-estacao-meteorologica-microbit', // Micro:bit
  'proj-chat-python-ia', // Python
  'proj-jogo-pong-scratch', // Scratch
  'proj-dado-digital-calliope', // Calliope
  'proj-jogo-reacao-leds', // Arduino + LEDs
  'proj-estacao-lcd-arduino', // Arduino + LCD
  // INTERMEDIATE
  'proj-robo-seguidor-linha', // Arduino
  'proj-cidade-inteligente-tinkercad', // Tinkercad
  'proj-pedometro-microbit', // Micro:bit + Python
  'proj-piano-luz-microbit', // Micro:bit
  'proj-sistema-irrigacao-inteligente', // Sensores
  'proj-contador-pessoas-sensor', // Sensor
  'proj-sinalizador-morse', // Arduino
  'proj-introducao-raspberry-pi', // Raspberry Pi
  'proj-horta-iot-cloud', // IoT Cloud
  // ADVANCED
  'proj-braco-robotico-servo', // Arduino
  'proj-carro-autonomo-nepo', // Arduino + NEPO
  'proj-robo-desenhista', // Arduino
  'proj-estacao-qualidade-ar', // Sensores
  'proj-cofre-eletronico-keypad', // Arduino + Keypad
  // SPECIALIST
  'proj-retropie-console' // Raspberry Pi
];

// Missões escritas à mão para as ferramentas que entraram na árvore depois
// do catálogo de 37 projetos (pasta de logos: App Inventor, Lego WeDo 2.0,
// Minecraft Education, Open Roberta Lab, drones, Canva, Gamma/Office 365) —
// cada uma garante que o nó de habilidade correspondente tenha pelo menos
// uma missão real para destravar, e não fique “órfão” na trilha.
const TOOL_QUESTS: Quest[] = [
  {
    id: 'tool-quest-app-inventor',
    title: 'Fiscal Verde: App de Denúncia de Descarte Irregular',
    description:
      'Crie um aplicativo com App Inventor que use a câmera e a localização do celular para registrar e mapear pontos de descarte irregular de lixo no bairro.',
    tier: 'INTERMEDIATE',
    requiredSkills: ['app_inventor'],
    sdgGoals: ['12'],
    xpReward: 350,
    coinReward: 90,
    hardwareRequired: ['App Inventor', 'Smartphone Android'],
    status: 'ACTIVE',
    validationSteps: [
      'Demonstrar o app registrando uma foto com localização em um smartphone real.',
      'Explicar ao Game Master como os dados poderiam chegar até a prefeitura.'
    ]
  },
  {
    id: 'tool-quest-lego-wedo',
    title: 'Milo, o Rover Explorador',
    description:
      'Monte e programe o Milo, o rover espacial oficial do Lego WeDo 2.0, para avançar, desviar de obstáculos e coletar uma "amostra".',
    tier: 'BASIC',
    requiredSkills: ['lego_wedo'],
    sdgGoals: ['4'],
    xpReward: 200,
    coinReward: 55,
    hardwareRequired: ['Lego WeDo 2.0'],
    status: 'ACTIVE',
    validationSteps: [
      'Demonstrar o rover se movendo e parando ao detectar o sensor de movimento.',
      'Explicar ao Game Master qual bloco controla a potência do motor.'
    ]
  },
  {
    id: 'tool-quest-minecraft',
    title: 'Cidade Circular em Minecraft',
    description:
      'Use o Code Builder do Minecraft Education para automatizar a coleta e separação de materiais recicláveis dentro de uma cidade construída no jogo.',
    tier: 'INTERMEDIATE',
    requiredSkills: ['minecraft_education'],
    sdgGoals: ['11'],
    xpReward: 350,
    coinReward: 90,
    hardwareRequired: ['Minecraft Education'],
    status: 'ACTIVE',
    validationSteps: [
      'Demonstrar o código automatizando pelo menos uma tarefa repetitiva na construção.',
      'Apresentar a planta da cidade e sua lógica de coleta seletiva ao Game Master.'
    ]
  },
  {
    id: 'tool-quest-open-roberta',
    title: 'Robô Universal: Seguidor de Linha no Open Roberta Lab',
    description:
      'Programe em blocos NEPO, no Open Roberta Lab, um robô seguidor de linha — a mesma lógica funciona em diferentes robôs compatíveis com a plataforma.',
    tier: 'INTERMEDIATE',
    requiredSkills: ['open_roberta_lab'],
    sdgGoals: ['9'],
    xpReward: 350,
    coinReward: 90,
    hardwareRequired: ['Open Roberta Lab'],
    status: 'ACTIVE',
    validationSteps: [
      'Demonstrar o robô completando o trajeto sem sair da linha.',
      'Explicar ao Game Master a diferença entre programar no Open Roberta e no Scratch.'
    ]
  },
  {
    id: 'tool-quest-drone',
    title: 'Guardião Aéreo: Monitoramento de Área Verde',
    description:
      'Calibre e pilote um drone educacional para sobrevoar e fotografar uma área verde da escola, identificando sinais de desmatamento ou lixo acumulado.',
    tier: 'SPECIALIST',
    requiredSkills: ['drone_intro'],
    sdgGoals: ['13'],
    xpReward: 650,
    coinReward: 170,
    hardwareRequired: ['Drone Educacional'],
    status: 'ACTIVE',
    validationSteps: [
      'Realizar um voo controlado completo sem colisões.',
      'Apresentar as fotos aéreas e um resumo do que foi identificado na área.'
    ]
  },
  {
    id: 'tool-quest-canva',
    title: 'Identidade da Guilda: Marca Própria',
    description:
      'Use o Canva para criar o logotipo, a paleta de cores e um banner de apresentação da sua guilda, prontos para usar no perfil e nas missões em equipe.',
    tier: 'BASIC',
    requiredSkills: ['identidade_visual_canva'],
    sdgGoals: ['4'],
    xpReward: 200,
    coinReward: 55,
    hardwareRequired: ['Canva'],
    status: 'ACTIVE',
    validationSteps: [
      'Apresentar o logotipo e a paleta de cores da guilda ao Game Master.',
      'Aplicar a identidade visual no emblema da guilda na plataforma.'
    ]
  },
  {
    id: 'tool-quest-pitch-day',
    title: 'Pitch Day: Apresente seu Protótipo',
    description:
      'Monte uma apresentação com o Gamma (gerada por IA) e organize os dados do seu projeto numa planilha do Office 365, para um pitch de 3 minutos à turma.',
    tier: 'ADVANCED',
    requiredSkills: ['apresentacao_publica'],
    sdgGoals: ['4'],
    xpReward: 500,
    coinReward: 130,
    hardwareRequired: ['Gamma', 'Office 365'],
    status: 'ACTIVE',
    validationSteps: [
      'Apresentar o pitch em até 3 minutos, com slides gerados no Gamma.',
      'Mostrar a planilha de dados/custos do projeto no Office 365.'
    ]
  },
  // --- Missões autorais adicionais — cobrindo nós de habilidade sem
  // nenhuma missão própria (lego_ev3, fablab_machining) e trazendo mais
  // variedade criativa para ferramentas já cobertas pelo catálogo real.
  {
    id: 'tool-quest-lego-ev3-sentinela',
    title: 'Sentinela do Labirinto',
    description:
      'Monte um robô com o kit Lego Mindstorms EV3 equipado com sensor ultrassônico e sensor de cor, capaz de navegar por um labirinto detectando paredes e seguindo uma trilha colorida até a saída.',
    tier: 'ADVANCED',
    requiredSkills: ['lego_ev3'],
    sdgGoals: ['9'],
    xpReward: 500,
    coinReward: 130,
    hardwareRequired: ['Lego Mindstorms EV3'],
    status: 'ACTIVE',
    validationSteps: [
      'Demonstrar o robô completando o labirinto sem colidir nas paredes.',
      'Explicar ao Game Master como o sensor ultrassônico decide quando virar.'
    ]
  },
  {
    id: 'tool-quest-fablab-emblema',
    title: 'Forja Digital: Emblema da Guilda',
    description:
      'Modele um emblema personalizado da sua guilda no Tinkercad e fabrique-o de verdade na impressora 3D ou na cortadora a laser do laboratório, transformando o design digital em um objeto físico.',
    tier: 'SPECIALIST',
    requiredSkills: ['fablab_machining'],
    sdgGoals: ['9'],
    xpReward: 650,
    coinReward: 170,
    hardwareRequired: ['Tinkercad', 'Impressora 3D', 'Cortadora a Laser'],
    status: 'ACTIVE',
    validationSteps: [
      'Apresentar o arquivo 3D/vetor já fatiado corretamente antes da fabricação.',
      'Entregar ao Game Master a peça física fabricada com o emblema da guilda.'
    ]
  },
  {
    id: 'tool-quest-python-oraculo',
    title: 'Oráculo de Dados: Relatório da Reciclagem',
    description:
      'Escreva um script em Python que leia uma planilha (CSV) com os dados de coleta seletiva da escola e calcule automaticamente qual material foi mais reciclado, gerando um pequeno relatório de texto.',
    tier: 'INTERMEDIATE',
    requiredSkills: ['python_intro'],
    sdgGoals: ['12'],
    xpReward: 350,
    coinReward: 90,
    hardwareRequired: ['Python'],
    status: 'ACTIVE',
    validationSteps: [
      'Executar o script com um arquivo CSV de exemplo e mostrar o relatório gerado.',
      'Explicar ao Game Master qual biblioteca Python foi usada para ler os dados.'
    ]
  },
  {
    id: 'tool-quest-scratch-clima',
    title: 'Guardiã do Clima: Corrida Contra o Aquecimento',
    description:
      'Crie um jogo de reflexo no Scratch onde o jogador precisa clicar em ícones de ações sustentáveis (economizar água, reciclar, plantar) antes que o termômetro do planeta suba demais.',
    tier: 'BASIC',
    requiredSkills: ['scratch_basics'],
    sdgGoals: ['13'],
    xpReward: 200,
    coinReward: 55,
    hardwareRequired: ['Scratch'],
    status: 'ACTIVE',
    validationSteps: [
      'Demonstrar o jogo funcionando com pontuação e um termômetro que sobe com o tempo.',
      'Explicar ao Game Master qual variável controla o aumento da temperatura no jogo.'
    ]
  },
  {
    id: 'tool-quest-raspberry-sentinela',
    title: 'Sentinela Noturna do Laboratório',
    description:
      'Configure um Raspberry Pi com um módulo de câmera e um sensor de movimento (PIR) para tirar uma foto automaticamente sempre que detectar presença, funcionando como um sistema simples de vigilância do laboratório.',
    tier: 'SPECIALIST',
    requiredSkills: ['raspberry_pi_avancado'],
    sdgGoals: ['11'],
    xpReward: 650,
    coinReward: 170,
    hardwareRequired: ['Raspberry Pi', 'Módulo de Câmera', 'Sensor PIR'],
    status: 'ACTIVE',
    validationSteps: [
      'Demonstrar o sistema salvando uma foto ao detectar movimento diante do sensor.',
      'Explicar ao Game Master onde as fotos ficam armazenadas no Raspberry Pi.'
    ]
  },
  {
    id: 'tool-quest-tinkercad-escudo',
    title: 'Escudo Paramétrico da Guilda',
    description:
      'Projete no Tinkercad uma capinha protetora personalizada para um microcontrolador (Arduino ou micro:bit) da sala, usando formas paramétricas e encaixes que permitam abrir e fechar sem parafusos.',
    tier: 'INTERMEDIATE',
    requiredSkills: ['modelagem_3d_tinkercad'],
    sdgGoals: ['9'],
    xpReward: 350,
    coinReward: 90,
    hardwareRequired: ['Tinkercad'],
    status: 'ACTIVE',
    validationSteps: [
      'Mostrar o modelo 3D encaixando corretamente ao redor da placa real.',
      'Explicar ao Game Master como os furos de ventilação/encaixe foram posicionados.'
    ]
  },
  {
    id: 'tool-quest-app-inventor-bussola',
    title: 'Bússola do Voluntariado',
    description:
      'Desenvolva um aplicativo com App Inventor que ajude a organizar ações voluntárias da turma, permitindo cadastrar tarefas, marcar quem topou ajudar e ver a lista de atividades pendentes.',
    tier: 'INTERMEDIATE',
    requiredSkills: ['app_inventor'],
    sdgGoals: ['11'],
    xpReward: 350,
    coinReward: 90,
    hardwareRequired: ['App Inventor', 'Smartphone Android'],
    status: 'ACTIVE',
    validationSteps: [
      'Demonstrar o cadastro de uma tarefa voluntária e a marcação de um responsável.',
      'Explicar ao Game Master como os dados das tarefas são guardados no app.'
    ]
  },
  {
    id: 'tool-quest-makey-orquestra',
    title: 'Orquestra Viva',
    description:
      'Use o Makey Makey e objetos condutores do dia a dia (frutas, folhas de alumínio, água) para criar um instrumento musical tocável no Scratch, com pelo menos 4 notas diferentes.',
    tier: 'BASIC',
    requiredSkills: ['circuitos_makey_makey'],
    sdgGoals: ['4'],
    xpReward: 200,
    coinReward: 55,
    hardwareRequired: ['Makey Makey', 'Scratch'],
    status: 'ACTIVE',
    validationSteps: [
      'Tocar uma sequência simples de notas usando os objetos condutores conectados.',
      'Explicar ao Game Master por que alguns materiais conduzem eletricidade e outros não.'
    ]
  },
  // --- Missões de síntese — combinam duas habilidades já desbloqueadas
  // num projeto só, como um "desafio de chefe" no fim de uma trilha.
  {
    id: 'tool-quest-arduino-python-vinculo',
    title: 'Vínculo Neural: Sensor Inteligente com Aprendizado',
    description:
      'Conecte um sensor analógico ao Arduino e envie as leituras pela porta serial para um script em Python que calcule a média móvel dos últimos 10 valores e dispare um alerta no terminal quando ultrapassar um limite definido.',
    tier: 'ADVANCED',
    requiredSkills: ['arduino_basico', 'python_intro'],
    sdgGoals: ['9'],
    xpReward: 500,
    coinReward: 130,
    hardwareRequired: ['Arduino Uno', 'Python'],
    status: 'ACTIVE',
    validationSteps: [
      'Demonstrar o Arduino enviando dados e o Python calculando a média em tempo real.',
      'Explicar ao Game Master como a comunicação serial entre as duas partes funciona.'
    ]
  },
  {
    id: 'tool-quest-microbit-appinventor-elo',
    title: 'Elo Sem Fio: Controle Remoto Bluetooth',
    description:
      'Use o rádio ou Bluetooth do micro:bit para receber comandos enviados por um aplicativo criado no App Inventor, acendendo diferentes padrões na matriz de LEDs conforme o botão pressionado no celular.',
    tier: 'ADVANCED',
    requiredSkills: ['microbit_starter', 'app_inventor'],
    sdgGoals: ['9'],
    xpReward: 500,
    coinReward: 130,
    hardwareRequired: ['Micro:bit', 'App Inventor', 'Smartphone Android'],
    status: 'ACTIVE',
    validationSteps: [
      'Demonstrar o app enviando pelo menos dois comandos diferentes que mudam o padrão de LEDs no micro:bit.',
      'Explicar ao Game Master como a conexão sem fio entre o celular e a placa foi configurada.'
    ]
  },
  {
    id: 'tool-quest-tinkercad-arduino-armadura',
    title: 'Armadura Sob Medida',
    description:
      'Projete no Tinkercad uma caixa sob medida para proteger um circuito com Arduino já funcionando, com furos precisos para os cabos e botões, e fabrique-a de verdade na impressora 3D.',
    tier: 'ADVANCED',
    requiredSkills: ['modelagem_3d_tinkercad', 'arduino_basico'],
    sdgGoals: ['9'],
    xpReward: 500,
    coinReward: 130,
    hardwareRequired: ['Tinkercad', 'Arduino Uno', 'Impressora 3D'],
    status: 'ACTIVE',
    validationSteps: [
      'Mostrar o circuito Arduino funcionando dentro da caixa fabricada, com os cabos e botões acessíveis pelos furos certos.',
      'Explicar ao Game Master como as medidas da caixa foram tiradas a partir do circuito real.'
    ]
  },
  {
    id: 'tool-quest-esp8266-painel',
    title: 'Rede dos Guardiões: Painel de Monitoramento',
    description:
      'Programe um ESP8266 para ler um sensor e publicar as leituras periodicamente em uma página web simples hospedada na própria placa, acessível de qualquer celular conectado à mesma rede Wi-Fi.',
    tier: 'SPECIALIST',
    requiredSkills: ['esp8266_advanced'],
    sdgGoals: ['9'],
    xpReward: 650,
    coinReward: 170,
    hardwareRequired: ['ESP8266', 'NodeMCU 1.0'],
    status: 'ACTIVE',
    validationSteps: [
      'Acessar a página web hospedada no ESP8266 pelo celular e mostrar a leitura do sensor atualizada.',
      'Explicar ao Game Master como o ESP8266 conseguiu se conectar à rede Wi-Fi da escola.'
    ]
  },
  {
    id: 'tool-quest-canva-portfolio',
    title: 'Arquivo da Expedição: Portfólio de Missão',
    description:
      'Escolha uma missão que sua equipe já completou e monte, no Canva, uma página de portfólio de uma folha só, com fotos do processo, o problema resolvido e os materiais usados — pronta para apresentar numa feira de ciências.',
    tier: 'BASIC',
    requiredSkills: ['identidade_visual_canva'],
    sdgGoals: ['4'],
    xpReward: 200,
    coinReward: 55,
    hardwareRequired: ['Canva'],
    status: 'ACTIVE',
    validationSteps: [
      'Apresentar a página de portfólio pronta, com pelo menos uma foto real do processo.',
      'Explicar ao Game Master por que a missão escolhida foi importante para o portfólio.'
    ]
  },
  {
    id: 'tool-quest-drone-python-telemetria',
    title: 'Olhos de Águia: Registro de Voo',
    description:
      'Após um voo controlado com o drone educacional, use Python para organizar os metadados das fotos aéreas (hora, ordem, quantidade) em uma lista simples que ajude a equipe a documentar o sobrevoo.',
    tier: 'SPECIALIST',
    requiredSkills: ['drone_intro', 'python_intro'],
    sdgGoals: ['13'],
    xpReward: 650,
    coinReward: 170,
    hardwareRequired: ['Drone Educacional', 'Python'],
    status: 'ACTIVE',
    validationSteps: [
      'Mostrar a lista organizada pelo script Python com pelo menos 3 fotos do voo.',
      'Explicar ao Game Master a diferença entre pilotar manualmente e uma missão autônoma programada.'
    ]
  },
  // Trilha do Eletricista Iniciante (Maker Lab) — escada de 6 níveis pedida
  // pelo usuário. Os níveis 2 e 4 já existiam no catálogo real (37 projetos)
  // como 'proj-semaforo-inteligente' e 'proj-estacao-lcd-arduino' — não
  // duplicados aqui de propósito. Os 4 abaixo (níveis 1, 3, 5 e 6) fecham a
  // trilha: LED puro, sensor de som, radar giratório com servo (diferente
  // do 'proj-radar-ultrassonico' estático já existente) e um capstone que
  // sintetiza os quatro sensores num painel único.
  {
    id: 'tool-quest-acender-led',
    title: 'Primeira Luz: Acendendo um LED',
    description:
      'A missão mais fundamental da eletrônica maker: monte o circuito de um LED com resistor de proteção e escreva o primeiro código que liga, desliga e faz piscar um componente físico pelo Arduino.',
    tier: 'BASIC',
    requiredSkills: ['arduino_basico'],
    sdgGoals: ['4'],
    xpReward: 200,
    coinReward: 55,
    hardwareRequired: ['Arduino', 'C++'],
    status: 'ACTIVE',
    validationSteps: [
      'O LED pisca no ritmo definido pelo código, sem ficar sempre aceso nem sempre apagado.',
      'Explicar ao Game Master por que o resistor é obrigatório e o que aconteceria sem ele.'
    ],
    grade: 'Ensino Fundamental II (6º ano)',
    duration: '1 aula',
    guideContent: `
# Primeira Luz: Acendendo um LED

## 🎯 Visão Geral
Todo maker começa aqui. Antes de robôs e sensores, é preciso entender a unidade mais básica da eletrônica programável: ligar e desligar um único componente por código. Este projeto é o "Nível 1" da trilha de eletrônica do laboratório — todas as missões seguintes (semáforo, sensores, radar) partem do que você aprender aqui.

## 🎓 Objetivos de Aprendizagem
- **Polaridade:** Identificar o anodo (perna longa, +) e o catodo (perna curta, -) de um LED.
- **Lei de Ohm na prática:** Entender por que um resistor em série protege o LED de queimar.
- **Ciclo Arduino:** Diferenciar o que roda uma vez (\`setup()\`) do que roda em loop infinito (\`loop()\`).

## 🔩 Materiais
- 1x Arduino Uno
- 1x LED (qualquer cor)
- 1x Resistor de 220Ω a 330Ω
- 1x Protoboard
- 2x Jumpers macho-macho

## 🛠️ Montagem
1. Espete o LED na protoboard: perna longa (anodo) numa linha, perna curta (catodo) em outra.
2. Ligue um jumper do pino digital **13** do Arduino até o anodo do LED.
3. Ligue o resistor entre o catodo do LED e o **GND** do Arduino — o resistor pode ficar de qualquer lado do LED, o que importa é estar em série no mesmo caminho.
4. Confira: sem o resistor, a corrente que passa pelo LED não tem limite e ele pode queimar em segundos.

## 💻 Código Base
\`\`\`cpp
const int pinoLED = 13;

void setup() {
  pinMode(pinoLED, OUTPUT); // define o pino como saída de energia
}

void loop() {
  digitalWrite(pinoLED, HIGH); // liga o LED
  delay(1000);                 // espera 1 segundo
  digitalWrite(pinoLED, LOW);  // desliga o LED
  delay(1000);                 // espera 1 segundo
}
\`\`\`

## 📋 Plano de Execução Completo
1. **Antes de programar (5 min):** monte o circuito e ligue o Arduino direto no pino 5V só para confirmar que o LED funciona fisicamente (retire depois).
2. **Upload do código base (10 min):** digite o código, faça upload e confirme que o LED pisca 1x por segundo.
3. **Ajuste de ritmo (10 min):** troque os dois \`delay(1000)\` para valores diferentes (ex: 200 e 800) e observe o novo ritmo.
4. **Desafios em dupla (15 min):** escolha pelo menos um desafio abaixo e implemente.
5. **Validação:** demonstre o circuito funcionando e explique a função do resistor ao Game Master.

## 🏆 Desafios
- **Nível 1 — Pisca-pisca de emergência:** faça o LED piscar bem rápido (100ms) por 3 segundos e depois voltar ao ritmo normal.
- **Nível 2 — Código Morse:** programe o LED para "dizer" SOS em Morse (··· −−− ···, pontos curtos de 200ms e traços de 600ms).
- **Nível 3 — Respiração suave (PWM):** troque o pino 13 por um pino com \`~\` (ex: 9) e use \`analogWrite()\` num loop \`for\` crescente e decrescente de 0 a 255 para simular um LED "respirando".
`
  },
  {
    id: 'tool-quest-sensor-som-aplausos',
    title: 'Ronda Sonora: Detector de Palmas',
    description:
      'Monte um sensor de som e programe um interruptor que liga uma luz ao detectar uma palma, aprendendo a diferenciar sinal analógico de digital e a filtrar ruído de sinal real.',
    tier: 'INTERMEDIATE',
    requiredSkills: ['arduino_basico'],
    sdgGoals: ['9'],
    xpReward: 350,
    coinReward: 90,
    hardwareRequired: ['Arduino', 'C++', 'Sensor de Som KY-038'],
    status: 'ACTIVE',
    validationSteps: [
      'O LED acende com uma palma e apaga com a próxima, sem disparar sozinho por ruído ambiente.',
      'Explicar ao Game Master a diferença entre a saída digital (DO) e a analógica (AO) do módulo de som.'
    ],
    grade: 'Ensino Fundamental II (7º ano)',
    duration: '2 aulas',
    guideContent: `
# Ronda Sonora: Detector de Palmas

## 🎯 Visão Geral
Depois de dominar o LED (Nível 1) e o semáforo (Nível 2), é hora do circuito ganhar "ouvidos". O módulo de som KY-038 tem um microfone de eletreto e um comparador que transforma o volume do ambiente em um pulso digital — a mesma ideia usada em interruptores "clap-on/clap-off" e em alarmes sonoros reais.

## 🎓 Objetivos de Aprendizagem
- **Sinal analógico vs. digital:** entender que o módulo entrega tanto uma leitura contínua (AO) quanto um pulso de limiar (DO).
- **Debounce por software:** evitar que um único som seja lido como vários eventos.
- **Máquina de estados simples:** alternar entre "luz ligada" e "luz desligada" a cada evento.

## 🔩 Materiais
- 1x Arduino Uno
- 1x Módulo Sensor de Som KY-038 (com potenciômetro de sensibilidade)
- 1x LED + 1x Resistor 220Ω (a "luz" controlada)
- Protoboard e jumpers

## ⚙️ Esquema de Ligação
- **VCC** do módulo → 5V do Arduino
- **GND** do módulo → GND do Arduino
- **DO** (saída digital) → Pino 2 do Arduino
- **LED** → Pino 13 (com resistor ao GND)

## 💻 Código Base
\`\`\`cpp
const int pinoSom = 2;
const int pinoLED = 13;
bool luzLigada = false;
unsigned long ultimoEvento = 0;
const unsigned long debounce = 500; // ignora sons por 500ms após detectar um

void setup() {
  pinMode(pinoSom, INPUT);
  pinMode(pinoLED, OUTPUT);
}

void loop() {
  int leitura = digitalRead(pinoSom);
  if (leitura == HIGH && millis() - ultimoEvento > debounce) {
    luzLigada = !luzLigada;
    digitalWrite(pinoLED, luzLigada ? HIGH : LOW);
    ultimoEvento = millis();
  }
}
\`\`\`

## 📋 Plano de Execução Completo
1. **Calibração física (10 min):** gire o potenciômetro do módulo até o LED de sinal dele acender só com sons altos (palma), não com conversa normal.
2. **Montagem (10 min):** monte o circuito conforme o esquema de ligação.
3. **Upload e teste isolado (10 min):** faça upload do código e teste só o "liga/desliga" com palmas.
4. **Ajuste do debounce (10 min):** teste valores diferentes de \`debounce\` (100ms, 500ms, 1000ms) e discuta o que muda.
5. **Desafios (20 min):** implemente pelo menos um desafio abaixo.
6. **Validação:** demonstre o interruptor funcionando e explique DO vs. AO ao Game Master.

## 🏆 Desafios
- **Nível 1 — Duas palmas:** só liga a luz se detectar exatamente 2 palmas dentro de 1 segundo (contador + janela de tempo com \`millis()\`).
- **Nível 2 — Medidor de volume:** troque \`digitalRead(DO)\` por \`analogRead(AO)\` e use 3 LEDs como um "barra de volume" (mais LEDs acesos = mais barulho).
- **Nível 3 — Alarme residencial:** combine com um buzzer que dispara um alarme sonoro se detectar som muito alto (>800 na leitura analógica) fora de um horário programado.
`
  },
  {
    id: 'tool-quest-radar-servo-ultrassonico',
    title: 'Radar Giratório: Vigia de 180°',
    description:
      'Combine um servomotor com um sensor ultrassônico para construir um radar giratório que varre 180° do ambiente e envia os dados de distância para o computador desenhar o mapa de obstáculos.',
    tier: 'ADVANCED',
    requiredSkills: ['arduino_basico'],
    sdgGoals: ['9'],
    xpReward: 500,
    coinReward: 130,
    hardwareRequired: ['Arduino', 'C++', 'Servo Motor SG90', 'Sensor Ultrassônico HC-SR04'],
    status: 'ACTIVE',
    validationSteps: [
      'O servo varre suavemente de 0° a 180° e volta, enquanto o sensor mede a distância em cada ângulo.',
      'Mostrar ao Game Master os dados "ângulo,distância" aparecendo no Monitor Serial ou no Serial Plotter.'
    ],
    grade: 'Ensino Fundamental II (9º ano) e Ensino Médio',
    duration: '4 aulas',
    guideContent: `
# Radar Giratório: Vigia de 180°

## 🎯 Visão Geral
Este é o projeto que une mecânica e sensoriamento: em vez de medir distância só para frente (como no Radar de Estacionamento, um sensor fixo), aqui o sensor ultrassônico HC-SR04 é montado em cima de um servomotor que varre 180° do ambiente, como o radar giratório de um navio ou aeroporto — só que de mesa.

## 🎓 Objetivos de Aprendizagem
- **Controle de servomotor:** usar a biblioteca \`Servo.h\` para posicionar um eixo em ângulos exatos (0° a 180°).
- **Sincronização de sensores:** ler a distância em cada posição do servo, formando um "mapa" de obstáculos ao redor.
- **Visualização de dados:** enviar dados estruturados via Serial para serem lidos por outro programa (Serial Plotter do Arduino IDE ou Processing).

## 🔩 Materiais
- 1x Arduino Uno
- 1x Servomotor SG90
- 1x Sensor Ultrassônico HC-SR04
- 1x Suporte de acrílico ou papelão para fixar o sensor no eixo do servo
- Protoboard e jumpers

## ⚙️ Esquema de Ligação
- **Servo:** fio de sinal (laranja/amarelo) → Pino 9 | VCC → 5V | GND → GND
- **HC-SR04:** Trig → Pino 10 | Echo → Pino 11 | VCC → 5V | GND → GND
- Fixe o HC-SR04 em cima da "chifre" (horn) do servo, para que ele gire junto com o eixo.

## 💻 Código Base
\`\`\`cpp
#include <Servo.h>

Servo radar;
const int trigPin = 10;
const int echoPin = 11;

long medirDistancia() {
  digitalWrite(trigPin, LOW); delayMicroseconds(2);
  digitalWrite(trigPin, HIGH); delayMicroseconds(10);
  digitalWrite(trigPin, LOW);
  long duracao = pulseIn(echoPin, HIGH);
  return duracao / 58; // converte para centímetros
}

void setup() {
  Serial.begin(9600);
  radar.attach(9);
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
}

void loop() {
  for (int angulo = 0; angulo <= 180; angulo += 2) {
    radar.write(angulo);
    delay(30); // tempo para o servo chegar na posição
    long distancia = medirDistancia();
    Serial.print(angulo);
    Serial.print(",");
    Serial.println(distancia);
  }
  for (int angulo = 180; angulo >= 0; angulo -= 2) {
    radar.write(angulo);
    delay(30);
    long distancia = medirDistancia();
    Serial.print(angulo);
    Serial.print(",");
    Serial.println(distancia);
  }
}
\`\`\`

## 📋 Plano de Execução Completo
1. **Montagem mecânica (30 min):** fixe o HC-SR04 no chifre do servo com cuidado para não desalinhar o eixo.
2. **Teste isolado do servo (15 min):** rode só o código do servo (sem o sensor) e confirme que ele varre 0°-180° suavemente.
3. **Teste isolado do sensor (15 min):** rode só a função \`medirDistancia()\` com o servo parado e confirme leituras coerentes (aproxime e afaste a mão).
4. **Integração (20 min):** junte os dois códigos, faça upload e abra o Serial Plotter (Ferramentas → Serial Plotter) para ver o gráfico da varredura em tempo real.
5. **Desafios (30 min):** implemente pelo menos um desafio abaixo.
6. **Validação:** demonstre a varredura completa e explique como o \`delay(30)\` entre passos evita leituras erradas durante o movimento do servo.

## 🏆 Desafios
- **Nível 1 — Alarme de intrusão:** dispare um buzzer se qualquer ângulo da varredura detectar um objeto a menos de 15cm.
- **Nível 2 — Memória do mais próximo:** ao final de cada varredura completa, imprima no Serial qual foi o ângulo com a menor distância medida ("objeto mais próximo detectado a X° e Ycm").
- **Nível 3 — Visualização gráfica:** use um sketch em Processing (ou p5.js) para desenhar o radar na tela do computador, lendo os dados "ângulo,distância" pela porta serial.
`
  },
  {
    id: 'tool-quest-central-multissensor',
    title: 'Central de Vigilância: Painel Multissensor',
    description:
      'Feche a trilha de eletrônica combinando tudo que você já construiu — LED, som, temperatura/umidade e distância — em um único painel de status que reage ao ambiente em tempo real.',
    tier: 'ADVANCED',
    requiredSkills: ['arduino_basico'],
    sdgGoals: ['11'],
    xpReward: 500,
    coinReward: 130,
    hardwareRequired: ['Arduino', 'C++', 'Sensor de Som KY-038', 'Sensor DHT11', 'Sensor Ultrassônico HC-SR04'],
    status: 'ACTIVE',
    validationSteps: [
      'O painel reflete corretamente pelo menos 3 dos 4 sensores combinados ao mesmo tempo, sem um sensor travar a leitura dos outros.',
      'Explicar ao Game Master por que o código usa millis() em vez de delay() para ler vários sensores "ao mesmo tempo".'
    ],
    grade: 'Ensino Médio',
    duration: '5 aulas',
    guideContent: `
# Central de Vigilância: Painel Multissensor

## 🎯 Visão Geral
Esta é a missão de síntese da Trilha do Eletricista Iniciante. Depois de aprender LED, semáforo, som, temperatura/umidade e radar em missões separadas, o desafio agora é integrar vários sensores no **mesmo** programa — o problema real de qualquer projeto de automação, onde nada pode "travar" esperando outro componente.

## 🎓 Objetivos de Aprendizagem
- **Multitarefa cooperativa:** ler vários sensores sem usar \`delay()\` bloqueante, usando \`millis()\` para controlar o tempo de cada leitura de forma independente.
- **Integração de sistemas:** combinar saídas de sensores diferentes (som, temperatura, distância) em um painel de decisão único.
- **Projeto real:** entender como sistemas de automação predial (ar-condicionado, iluminação, alarme) combinam vários sensores da mesma forma.

## 🔩 Materiais
- 1x Arduino Uno
- 1x Sensor de Som KY-038 (saída digital)
- 1x Sensor DHT11 (temperatura e umidade)
- 1x Sensor Ultrassônico HC-SR04
- 3x LEDs (Verde, Amarelo, Vermelho) + resistores 220Ω
- 1x Buzzer
- Protoboard e jumpers

## ⚙️ Esquema de Ligação
- **KY-038 (DO)** → Pino 2
- **DHT11 (Data)** → Pino 3
- **HC-SR04:** Trig → Pino 9 | Echo → Pino 10
- **LEDs:** Verde → Pino 4, Amarelo → Pino 5, Vermelho → Pino 6
- **Buzzer** → Pino 7

## 💻 Código Base (estrutura sem bloqueio)
\`\`\`cpp
#include <DHT.h>
#define DHTPIN 3
#define DHTTYPE DHT11
DHT dht(DHTPIN, DHTTYPE);

unsigned long ultimaLeituraDHT = 0;
const unsigned long intervaloDHT = 2000; // DHT11 só pode ser lido a cada 2s

void setup() {
  Serial.begin(9600);
  dht.begin();
  pinMode(2, INPUT);
  pinMode(4, OUTPUT); pinMode(5, OUTPUT); pinMode(6, OUTPUT);
  pinMode(7, OUTPUT);
  pinMode(9, OUTPUT); pinMode(10, INPUT);
}

long medirDistancia() {
  digitalWrite(9, LOW); delayMicroseconds(2);
  digitalWrite(9, HIGH); delayMicroseconds(10);
  digitalWrite(9, LOW);
  return pulseIn(10, HIGH) / 58;
}

void loop() {
  // Som e distância podem ser lidos a cada volta do loop (são rápidos)
  bool somAlto = digitalRead(2) == HIGH;
  long distancia = medirDistancia();

  digitalWrite(7, somAlto ? HIGH : LOW); // buzzer reage ao som na hora

  if (distancia < 15) digitalWrite(6, HIGH); else digitalWrite(6, LOW); // vermelho: perigo perto
  if (distancia >= 15 && distancia < 40) digitalWrite(5, HIGH); else digitalWrite(5, LOW); // amarelo
  if (distancia >= 40) digitalWrite(4, HIGH); else digitalWrite(4, LOW); // verde: livre

  // DHT11 só é lido a cada 2 segundos, sem travar o resto do loop
  if (millis() - ultimaLeituraDHT > intervaloDHT) {
    float temperatura = dht.readTemperature();
    float umidade = dht.readHumidity();
    Serial.print("Temp: "); Serial.print(temperatura);
    Serial.print("C | Umidade: "); Serial.print(umidade); Serial.println("%");
    ultimaLeituraDHT = millis();
  }
}
\`\`\`

## 📋 Plano de Execução Completo
1. **Reaproveitar sensores (15 min):** monte cada sensor isoladamente primeiro, reaproveitando o código das missões anteriores para confirmar que cada um funciona sozinho.
2. **Montagem completa (30 min):** monte todos os sensores e LEDs juntos no protoboard seguindo o esquema de ligação.
3. **Upload do código integrado (15 min):** faça upload do código base e observe o Monitor Serial mostrando temperatura/umidade a cada 2 segundos.
4. **Teste dos 3 LEDs (15 min):** aproxime e afaste a mão do HC-SR04 e confirme que o LED certo acende para cada faixa de distância.
5. **Teste do buzzer (10 min):** bata palmas e confirme que o buzzer reage sem atrasar a leitura de distância.
6. **Desafios (30 min):** implemente pelo menos um desafio abaixo.
7. **Validação final:** demonstre os 4 sensores funcionando juntos e explique por que \`delay()\` não foi usado para ler o DHT11.

## 🏆 Desafios
- **Nível 1 — Modo silencioso:** use uma palma para alternar entre "painel normal" e "modo silencioso" (LEDs continuam, buzzer desativado).
- **Nível 2 — Alerta de conforto térmico:** se a temperatura passar de 28°C, pisque o LED amarelo mesmo que a distância esteja segura, sinalizando "ambiente quente".
- **Nível 3 — Log de eventos:** registre no Monitor Serial cada vez que a distância ficar abaixo de 15cm, com o valor de temperatura/umidade daquele momento — um mini "log de segurança ambiental".
`
  }
];

export const QUESTS: Quest[] = [
  ...PROJECT_CATALOG.filter((q) => STARTER_PROJECT_IDS.includes(q.id)),
  ...TOOL_QUESTS,
  {
    id: 'quest-secret-1',
    title: 'Enigma Cypher: O Sinal Criptografado',
    description: 'Quest Secreta encontrada através do Terminal Hacker. Encontre o código hex gravado na Cortadora Laser para destravar o sinal.',
    tier: 'SPECIALIST',
    requiredSkills: ['logic_unplugged'],
    sdgGoals: ['4'],
    xpReward: 600,
    coinReward: 200,
    hardwareRequired: ['Terminal CLI', 'Scanner de QR Code'],
    isSecretQuest: true,
    secretPasscode: 'IZI-CYBER',
    status: 'ACTIVE',
    validationSteps: [
      'Decodificar a mensagem binária no Terminal CLI.',
      'Digitar o comando de destrava.'
    ]
  }
];

// Mesmo conteúdo de QUESTS, sem o campo `id` — usado para semear o mural de
// missões de uma turma nova no Firestore (cada turma recebe suas PRÓPRIAS
// cópias dos documentos, com IDs gerados pelo Firestore).
export const STARTER_QUEST_TEMPLATES: Array<Omit<Quest, 'id'>> = QUESTS.map(({ id: _id, ...rest }) => rest);

// Pool completo (todos os 37 projetos reais) usado pelo Motor de Missões IA
// (src/services/questEngine.ts como fallback local, e o serviço de IA da
// NVIDIA como inspiração) para recomendar missões com base nas
// habilidades/hardware já desbloqueados pela guilda.
export const QUEST_TEMPLATES: Omit<Quest, 'id' | 'status'>[] = [
  ...PROJECT_CATALOG.map(({ id: _id, status: _status, ...rest }) => rest),
  ...TOOL_QUESTS.map(({ id: _id, status: _status, ...rest }) => rest)
];

export const HARDWARE_CATALOG: HardwareItem[] = [
  {
    id: 'hw-1',
    name: 'Placa NodeMCU 1.0 (ESP8266)',
    category: 'MICROCONTROLLER',
    stockQuantity: 14,
    coinCost: 100,
    icon: '📟',
    pinoutDiagramUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&auto=format&fit=crop&q=80',
    troubleshootingGuide: {
      overview: 'Guia de Interface e Resolução de Conflitos para ESP8266 & Módulos I2C (ex: Acelerômetro MMA845x).',
      commonErrors: [
        {
          error: "Erro 'Adafruit_MMA8451.h: No such file or directory'",
          solution: 'Vá no Gerenciador de Bibliotecas da Arduino IDE (Ctrl+Shift+I) e instale Adafruit MMA8451 + Adafruit Unified Sensor.'
        },
        {
          error: "ESP8266 reiniciando constantemente (WDT Reset / Cause 2)",
          solution: 'Alimentação insuficiente via USB ou falta de resistor pull-up de 4.7kΩ nas linhas SDA (D2/GPIO4) e SCL (D1/GPIO5).'
        },
        {
          error: "Endereço I2C não encontrado no I2C Scanner (0x1C ou 0x1D)",
          solution: 'Verifique se o pino SA0 do MMA8451 está ligado ao GND (para 0x1C) ou 3.3V (para 0x1D).'
        }
      ],
      compatibleLibraries: ['Adafruit_MMA8451.h', 'Wire.h', 'ESP8266WiFi.h', 'PubSubClient.h'],
      wiringDiagram: [
        { pinFrom: 'MMA8451 VCC', pinTo: 'NodeMCU 3V3', note: 'NÃO ligar no 5V (Vin) para não queimar o sensor!' },
        { pinFrom: 'MMA8451 GND', pinTo: 'NodeMCU GND', note: 'GND comum de referência.' },
        { pinFrom: 'MMA8451 SDA', pinTo: 'NodeMCU D2 (GPIO4)', note: 'Barramento de Dados I2C.' },
        { pinFrom: 'MMA8451 SCL', pinTo: 'NodeMCU D1 (GPIO5)', note: 'Barramento de Clock I2C.' }
      ]
    }
  },
  {
    id: 'hw-2',
    name: 'Arduino Uno R3 SMD',
    category: 'MICROCONTROLLER',
    stockQuantity: 22,
    coinCost: 80,
    icon: '🔌',
    pinoutDiagramUrl: 'https://images.unsplash.com/photo-1553406830-ef2513450d76?w=500&auto=format&fit=crop&q=80',
    troubleshootingGuide: {
      overview: 'Guia de Interface Serial (USB), Upload de Sketch e Compatibilidade de Nível Lógico para Arduino Uno R3.',
      commonErrors: [
        {
          error: "Porta COM não aparece no Gerenciador de Dispositivos / Arduino IDE",
          solution: 'Placas com chip CH340/CH341 (clones SMD) precisam do driver CH340 instalado manualmente — o Windows não reconhece nativamente. Placas originais usam FTDI e já são plug-and-play. Baixe o driver CH340 no site do fabricante e reinicie o PC. Confira também se o cabo USB é de dados (não apenas de carregamento).'
        },
        {
          error: "avrdude: stk500_recv(): programmer is not responding",
          solution: 'Verifique se a porta e a placa corretas estão selecionadas em Ferramentas > Placa/Porta. Feche o Monitor Serial antes de subir o código (ele ocupa a porta). Pressione o botão RESET físico da placa 1-2 segundos antes de clicar em "Carregar". Se persistir, o bootloader pode estar corrompido — regrave via outro Arduino como ISP.'
        },
        {
          error: "Sensor I2C de 3.3V (ex: MMA8451) queima ou trava a leitura ao ligar no Arduino Uno",
          solution: 'O Arduino Uno opera em lógica de 5V nos pinos digitais/analógicos, mas muitos sensores (MMA8451, MPU6050 sem regulador) toleram apenas 3.3V. Use a saída 3.3V da própria placa para alimentar o sensor e, se o módulo não tiver level shifter embutido, use um conversor de nível lógico bidirecional nas linhas SDA/SCL.'
        }
      ],
      compatibleLibraries: ['Wire.h', 'Adafruit_MMA8451.h', 'Adafruit_Unified_Sensor.h', 'Servo.h'],
      wiringDiagram: [
        { pinFrom: 'MMA8451 VCC', pinTo: 'Arduino 3.3V', note: 'Confira o datasheet do módulo antes de ligar no 5V — muitos breakouts MMA8451 não têm regulador.' },
        { pinFrom: 'MMA8451 GND', pinTo: 'Arduino GND', note: 'GND comum de referência.' },
        { pinFrom: 'MMA8451 SDA', pinTo: 'Arduino A4 (SDA)', note: 'No Uno R3 o barramento I2C usa os pinos analógicos A4/A5, diferente do NodeMCU (D1/D2).' },
        { pinFrom: 'MMA8451 SCL', pinTo: 'Arduino A5 (SCL)', note: 'Barramento de Clock I2C.' }
      ]
    }
  },
  {
    id: 'hw-3',
    name: 'Acelerômetro & Giroscópio MMA8451 / MPU6050',
    category: 'SENSOR',
    stockQuantity: 18,
    coinCost: 60,
    icon: '🧭',
    troubleshootingGuide: {
      overview: 'Guia de Diagnóstico para Sensores Inerciais I2C — cobre tanto o Acelerômetro MMA8451 quanto o IMU MPU6050 (Acelerômetro + Giroscópio), incluindo conflitos de endereço e escolha correta de biblioteca.',
      commonErrors: [
        {
          error: "I2C Scanner não encontra o MMA8451 nem em 0x1C nem em 0x1D",
          solution: 'O pino SA0 do MMA8451 define o endereço: ligado ao GND = 0x1C, ligado ao 3.3V = 0x1D. Confira se o pino não está flutuando (sem ligação) — isso deixa o endereço instável.'
        },
        {
          error: "Dois sensores MPU6050 no mesmo barramento colidem em 0x68",
          solution: 'O MPU6050 usa o pino AD0 para alternar endereço: AD0 em GND (padrão interno) = 0x68, AD0 em 3.3V = 0x69. Ligue o AD0 de um dos dois módulos ao 3.3V para rodar ambos no mesmo barramento I2C.'
        },
        {
          error: "I2C Scanner não encontra NENHUM dispositivo (0 devices found)",
          solution: 'Falta de resistores pull-up de 4.7kΩ nas linhas SDA/SCL. A maioria dos breakouts já traz pull-ups onboard, mas ao encadear vários módulos no mesmo barramento os pull-ups se somam e podem enfraquecer o sinal — remova os resistores extras dos módulos secundários se o scanner ainda falhar.'
        },
        {
          error: "Erro de compilação ou leituras absurdas (NaN / valores travados em zero)",
          solution: 'Confusão entre bibliotecas: Adafruit_MMA8451.h é exclusiva para o chip MMA8451 (acelerômetro simples), enquanto MPU6050.h (ex: bibliotecas Electronic Cats ou i2cdevlib) é para o MPU6050 (acelerômetro + giroscópio). Confirme o chip impresso no módulo físico antes de instalar a biblioteca — usar a errada compila mas lê registradores I2C incorretos.'
        }
      ],
      compatibleLibraries: ['Adafruit_MMA8451.h', 'Adafruit_Unified_Sensor.h', 'Wire.h', 'MPU6050.h', 'I2Cdev.h'],
      wiringDiagram: [
        { pinFrom: 'Sensor VCC', pinTo: 'Placa 3V3', note: 'MMA8451 e MPU6050 operam em 3.3V — nunca ligar diretamente no 5V (Vin).' },
        { pinFrom: 'Sensor GND', pinTo: 'Placa GND', note: 'GND comum de referência.' },
        { pinFrom: 'Sensor SDA', pinTo: 'D2/GPIO4 (NodeMCU) ou A4 (Arduino Uno)', note: 'Barramento de Dados I2C — o pino varia conforme a placa controladora usada.' },
        { pinFrom: 'Sensor SCL', pinTo: 'D1/GPIO5 (NodeMCU) ou A5 (Arduino Uno)', note: 'Barramento de Clock I2C.' },
        { pinFrom: 'MMA8451 SA0 / MPU6050 AD0', pinTo: 'GND ou 3V3', note: 'Define o endereço I2C do sensor: SA0 GND=0x1C / 3V3=0x1D (MMA8451); AD0 GND=0x68 / 3V3=0x69 (MPU6050).' }
      ]
    }
  },
  {
    id: 'hw-4',
    name: 'Filamento PLA 1.75mm para Impressora 3D',
    category: 'TOOLS',
    stockQuantity: 8,
    coinCost: 40,
    icon: '🧵',
    troubleshootingGuide: {
      overview: 'Guia rápido de armazenamento e diagnóstico de falhas de extrusão para Filamento PLA — o PLA é higroscópico e absorve umidade do ar, o que compromete a impressão.',
      commonErrors: [
        {
          error: "Estalos/crepitação (crackling) e bolhas na superfície durante a impressão",
          solution: 'Sinal clássico de filamento úmido. Seque o rolo em desidratador de alimentos ou forno doméstico a 45-50°C por 4-6 horas antes de reimprimir.'
        },
        {
          error: "Sub-extrusão ou entupimento (clog) no bico",
          solution: 'Filamento guardado fora da embalagem selada por longos períodos incha levemente e passa a raspar dentro do hotend. Armazene sempre em recipiente hermético com sachês de sílica gel entre usos.'
        },
        {
          error: "Fios (stringing) excessivos entre partes da peça",
          solution: 'Normalmente não é umidade, e sim temperatura do bico muito alta ou retração mal calibrada. Reduza a temperatura em 5-10°C e aumente a distância/velocidade de retração no fatiador (Cura/PrusaSlicer).'
        }
      ],
      compatibleLibraries: [],
      wiringDiagram: []
    }
  },
  {
    id: 'hw-5',
    name: 'Sensor de Movimento PIR (HC-SR501)',
    category: 'SENSOR',
    stockQuantity: 12,
    coinCost: 50,
    icon: '🚨',
    troubleshootingGuide: {
      overview: 'Guia de calibração e diagnóstico para o sensor infravermelho passivo HC-SR501, usado em projetos de alarme, contagem de pessoas e câmeras que só fotografam quando detectam presença.',
      commonErrors: [
        {
          error: 'Sensor "disparando sozinho" sem ninguém por perto',
          solution: 'Fontes de calor (ar-condicionado, luz solar direta, radiadores) enganam o PIR. Reposicione o sensor longe de janelas/saídas de ar, ou reduza a sensibilidade no trimmer "Sx" (giro anti-horário).'
        },
        {
          error: 'Sensor não desliga o sinal de saída rápido depois de detectar',
          solution: 'O trimmer "Tx" controla o tempo que o pino de saída fica em HIGH após a detecção (de ~3s a 5min de fábrica). Gire anti-horário para o menor tempo possível durante testes.'
        },
        {
          error: 'Sensor parece "burro" logo ao ligar o circuito',
          solution: 'O HC-SR501 precisa de 30 a 60 segundos de aquecimento após ser energizado para estabilizar as leituras infravermelhas — ignore os primeiros disparos aleatórios desse período.'
        },
        {
          error: 'Sensor só detecta uma vez e não dispara de novo mesmo com movimento contínuo',
          solution: 'Confira o jumper de modo: posição "L" é não-repetível (só reinicia a contagem depois do tempo Tx acabar), posição "H" é repetível (reinicia o tempo a cada novo movimento). Para alarmes contínuos, use "H".'
        }
      ],
      compatibleLibraries: [],
      wiringDiagram: [
        { pinFrom: 'PIR VCC', pinTo: 'Placa 5V', note: 'Aceita de 4.5V a 20V graças ao regulador onboard, mas 5V é o padrão mais estável.' },
        { pinFrom: 'PIR GND', pinTo: 'Placa GND', note: 'GND comum de referência.' },
        { pinFrom: 'PIR OUT', pinTo: 'Pino digital (ex: D2 no Arduino, GPIO no Raspberry Pi)', note: 'Sinal digital: HIGH quando detecta movimento, LOW em repouso — não precisa de resistor pull-up.' }
      ]
    }
  },
  {
    id: 'hw-6',
    name: 'Makey Makey',
    category: 'ACTUATOR',
    stockQuantity: 6,
    coinCost: 70,
    icon: '🍌',
    troubleshootingGuide: {
      overview: 'Guia de conexão para o Makey Makey — uma placa que transforma qualquer material levemente condutor em teclado/mouse USB, sem precisar escrever nenhum código.',
      commonErrors: [
        {
          error: 'Nada funciona, nenhuma tecla é acionada',
          solution: 'O circuito só fecha se a pessoa estiver segurando o fio "EARTH" (aterramento) com uma mão enquanto toca o objeto conectado a uma entrada com a outra — sem isso, nenhuma entrada funciona, mesmo que os fios estejam certos.'
        },
        {
          error: 'Um objeto específico não aciona a tecla dele, mas os outros funcionam',
          solution: 'Confira se o jacaré está bem preso ao fio de cobre/alumínio que toca o objeto — contato solto é a causa mais comum. Objetos muito secos (algumas frutas, madeira) conduzem mal; umedeça levemente ou use grafite de lápis como alternativa.'
        },
        {
          error: 'Várias teclas parecem acionar ao mesmo tempo sem querer',
          solution: 'Isso costuma acontecer quando dois objetos conectados a entradas diferentes encostam um no outro (ou numa superfície metálica comum), fechando o circuito dos dois ao mesmo tempo. Separe fisicamente os objetos condutores.'
        }
      ],
      compatibleLibraries: [],
      wiringDiagram: [
        { pinFrom: 'Fio EARTH', pinTo: 'Segurado pela mão da pessoa', note: 'Fecha o circuito através do corpo humano — sem isso, nenhuma entrada do Makey Makey funciona.' },
        { pinFrom: 'Entrada (SPACE/UP/DOWN/LEFT/RIGHT/CLICK)', pinTo: 'Objeto condutor (fruta, grafite, água, papel alumínio)', note: 'O Makey Makey aparece pro computador como um teclado/mouse comum — não precisa de driver nem código.' }
      ]
    }
  }
];

export const CURIOSITY_CARDS: CuriosityCard[] = [
  {
    id: 'curio-1',
    code: 'LAB-SOLD-01',
    title: 'Como a NASA solda circuitos no espaço?',
    category: 'MAKER_HISTORY',
    content: 'Na gravidade zero, a solda derretida forma esferas flutuantes! A NASA desenvolveu técnicas com ligas especiais de bismuto-índio para evitar curtos flutuantes dentro de estações espaciais.',
    labLocation: 'Estação de Soldagem (Bancada 2)',
    xpReward: 50,
    unlocked: true
  },
  {
    id: 'curio-2',
    code: 'LAB-LASER-02',
    title: 'O Primeiro "Bug" de Computador Real',
    category: 'CYBERPUNK',
    content: 'Em 1947, a cientista Grace Hopper encontrou uma traça de verdade presa no relé do computador Harvard Mark II. Ela colou o inseto no diário de bordo com a nota: "First actual case of bug being found".',
    labLocation: 'Chassis da Cortadora a Laser',
    xpReward: 75,
    unlocked: false
  },
  {
    id: 'curio-3',
    code: 'LAB-3D-03',
    title: 'Casas impressas em 3D para Missões em Marte',
    category: 'AI_FUTURE',
    content: 'Impressoras 3D industriais estão sendo testadas para misturar solo de poeira marciana (regolito) com polímeros reutilizáveis para construir domos protetores antes da chegada dos astronautas!',
    labLocation: 'Lateral da Impressora 3D Ender-3',
    xpReward: 60,
    unlocked: true
  },
  {
    id: 'curio-4',
    code: 'LAB-ROBO-04',
    title: 'O Primeiro Robô Industrial da História',
    category: 'MAKER_HISTORY',
    content: 'Em 1961, o Unimate começou a trabalhar numa fábrica da General Motors nos EUA, empilhando peças de metal quente — foi o primeiro robô industrial programável do mundo, abrindo caminho para toda a robótica que usamos hoje.',
    labLocation: 'Perto do braço robótico da bancada de eletrônica',
    xpReward: 55,
    unlocked: false
  },
  {
    id: 'curio-5',
    code: 'LAB-LED-05',
    title: 'Por Que o LED Só Acende de um Jeito?',
    category: 'PHYSICS_HACK',
    content: 'Um LED é um diodo — ele só deixa a corrente elétrica passar numa direção. Ligue ele ao contrário e simplesmente não acende (sem estragar nada): por dentro, os elétrons só conseguem "pular" a barreira do semicondutor num sentido só.',
    labLocation: 'Caixa de componentes eletrônicos',
    xpReward: 50,
    unlocked: false
  },
  {
    id: 'curio-6',
    code: 'LAB-NET-06',
    title: 'A Primeira Mensagem da Internet Travou no Meio',
    category: 'CYBERPUNK',
    content: 'Em 29 de outubro de 1969, pesquisadores tentaram enviar a palavra "LOGIN" entre dois computadores da ARPANET (a avó da internet). O sistema travou depois de transmitir só "LO" — essas duas letras entraram pra história como a primeira mensagem digital de longa distância.',
    labLocation: 'Roteador de rede do laboratório',
    xpReward: 70,
    unlocked: false
  },
  {
    id: 'curio-7',
    code: 'LAB-GO-07',
    title: 'Quando uma IA Venceu um Campeão Imbatível',
    category: 'AI_FUTURE',
    content: 'Em 2016, o programa AlphaGo (da DeepMind) venceu Lee Sedol, um dos melhores jogadores de Go do mundo, num jogo considerado bom demais pra máquinas — Go tem mais combinações possíveis que átomos no universo observável.',
    labLocation: 'Monitor da bancada de programação',
    xpReward: 65,
    unlocked: false
  },
  {
    id: 'curio-8',
    code: 'LAB-OPEN-08',
    title: 'O Arduino Nasceu Pra Ser Copiado',
    category: 'MAKER_HISTORY',
    content: 'Diferente da maioria da eletrônica comercial, o Arduino foi criado em 2005, na Itália, como hardware de código aberto: qualquer pessoa pode ver, copiar e modificar o design das placas livremente — é por isso que existem tantos clones e variações do Arduino no mundo todo.',
    labLocation: 'Gaveta de placas Arduino',
    xpReward: 55,
    unlocked: false
  },
  {
    id: 'curio-9',
    code: 'LAB-FUSE-09',
    title: 'O Herói Invisível Que Se Sacrifica Por Você',
    category: 'PHYSICS_HACK',
    content: 'Um fusível é um fiozinho fino projetado pra derreter e "queimar" de propósito quando passa corrente elétrica demais pelo circuito — sacrificando a si mesmo pra proteger o resto do equipamento de um curto-circuito ou incêndio.',
    labLocation: 'Painel elétrico do laboratório',
    xpReward: 50,
    unlocked: false
  },
  {
    id: 'curio-10',
    code: 'LAB-MICROBIT-10',
    title: 'Um Computador de Presente Pra Um País Inteiro',
    category: 'MAKER_HISTORY',
    content: 'Em 2016, a BBC distribuiu gratuitamente um micro:bit para cada aluno de 11 e 12 anos do Reino Unido — quase 1 milhão de placas — numa das maiores iniciativas de educação em tecnologia já feitas por uma emissora de TV.',
    labLocation: 'Caixa de placas micro:bit',
    xpReward: 55,
    unlocked: false
  },
  {
    id: 'curio-11',
    code: 'LAB-IR-11',
    title: 'A Luz Que Seus Olhos Não Conseguem Ver',
    category: 'PHYSICS_HACK',
    content: 'Sensores infravermelhos (como os de controle remoto e alguns sensores de presença) usam uma luz real, só que numa frequência abaixo do que o olho humano enxerga. Aponte a câmera de um celular pro LED de um controle remoto e aperte um botão: dá pra "ver" esse piscar através da tela!',
    labLocation: 'Prateleira de sensores',
    xpReward: 50,
    unlocked: false
  }
];

export const HACKATHON_CAMPAIGN: BossRaidCampaign = {
  id: 'camp-2026',
  title: 'HACKATHON ÉPICO STEAM 2026: A REVOLUÇÃO VERDE',
  isActive: true,
  bossName: 'O MONSTRO DO DESPERDÍCIO DE ENERGIA (BOSS RAID)',
  bossMaxHp: 10000,
  bossCurrentHp: 3450,
  participatingGuildsCount: 44,
  totalStudentsCount: 352, // 350+ Alunos em tempo real
  concurrencyRps: 184, // Requisições por segundo via Firebase Write Batching
  timeRemainingSeconds: 3420, // 57 min
  recentLogs: [
    { id: 'l1', text: 'Guilda "Mágicos do Solder" causou 250 de dano concluindo protótipo de medidor de energia!', time: '10:42', guildName: 'Mágicos do Solder' },
    { id: 'l2', text: 'Guilda "Hackers da Amazônia" ativou o ataque crítico ODS 13! (-400 HP ao Boss)', time: '10:40', guildName: 'Hackers da Amazônia' },
    { id: 'l3', text: 'Guilda "Engenheiros do ESP8266" enviou dados em lote (Firestore Batch OK)!', time: '10:38', guildName: 'Engenheiros do ESP8266' }
  ]
};

export const QUICK_HACK_ALERT: QuickHackAlert = {
  id: 'qh-99',
  title: '⚡ ALERTA DE GLITCH NA REDE MAKER (QUICK HACK)',
  description: 'O Mestre da Sala disparou um desafio de 3 minutos para toda a turma!',
  riddle: 'Decodifique o código binário para desbloquear +150 XP extra para sua guilda: 01001001 01011010 01001001 (Dica: Representa 3 letras ASCII)',
  answerHash: 'IZI',
  timeLimitSeconds: 180,
  xpReward: 150,
  active: false
};
