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
