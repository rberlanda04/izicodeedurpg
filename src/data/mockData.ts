import type { UserProfile, Guild, SkillNode, Quest, HardwareItem, CuriosityCard, BossRaidCampaign, QuickHackAlert } from '../types';

export const INITIAL_USER: UserProfile = {
  uid: 'user-77',
  adventureName: 'CyberKnight_99', // LGPD Anonymized Codename
  realName: 'Gabriel Oliveira',
  role: 'ADVENTURER',
  level: 4,
  xp: 1450,
  xpToNextLevel: 2000,
  izicoins: 380,
  guildId: 'guild-1',
  guildRole: 'MAKER',
  avatarConfig: {
    head: '🤖',
    body: '🛡️',
    accessory: '⚡',
    color: '#00e1ff'
  },
  unlockedSkills: ['logic_unplugged', 'scratch_basics', 'microbit_starter', 'esp8266_advanced'],
  badges: [
    { id: 'b1', name: 'Primeira Linha', description: 'Escreveu seu primeiro algoritmo sem erros.', icon: '📜' },
    { id: 'b2', name: 'Mestre da Solda', description: 'Completou um circuito impresso perfeito.', icon: '⚡' },
    { id: 'b3', name: 'Guardião ODS', description: 'Criou um projeto alinhado à Meta 7.a da ONU.', icon: '🌱' },
    { id: 'b4', name: 'Cypher Hacker', description: 'Desvendou o primeiro enigma do Terminal CLI.', icon: '👾', isSecret: true }
  ],
  inventory: [
    { itemId: 'hw-1', name: 'Placa NodeMCU 1.0 (ESP8266)', qty: 1, icon: '📟' },
    { itemId: 'hw-3', name: 'Acelerômetro MMA8451 I2C', qty: 1, icon: '🧭' },
    { itemId: 'hw-4', name: 'Kit Resistores 220Ω', qty: 5, icon: '🔋' }
  ],
  unlockedCuriosities: ['curio-1', 'curio-3'],
  heroContractSigned: true
};

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
    prerequisites: ['microbit_starter'],
    hardwareUnlocked: ['esp8266', 'nodemcu_1.0', 'arduino_uno', 'mma8451_accel'],
    description: 'Conectividade Wi-Fi, comunicação bus I2C, leitura de acelerômetros analógicos/digitais e telemetria HTTP/MQTT.',
    icon: '📡'
  },
  {
    id: 'fablab_machining',
    title: 'Fabricação Digital (Laser & Impressora 3D)',
    tier: 'SPECIALIST',
    category: 'PROTOTYPING',
    prerequisites: ['esp8266_advanced'],
    allowsResourceBooking: true,
    description: 'Modelagem 3D no Tinkercad/Fusion360, fatiamento Cura e corte vetorial em acrílico/MDF.',
    icon: '🖨️'
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

export const QUESTS: Quest[] = [
  {
    id: 'quest-1',
    title: 'Estação Meteorológica IoT Comunitária',
    description: 'Projete um protótipo com ESP8266/NodeMCU 1.0 que leia temperatura, umidade e envie alertas automáticos contra enchentes na sua região.',
    tier: 'SPECIALIST',
    requiredSkills: ['esp8266_advanced'],
    sdgGoals: ['13.a', '7.a'],
    xpReward: 450,
    coinReward: 120,
    hardwareRequired: ['NodeMCU 1.0 (ESP8266)', 'Sensor DHT11', 'Display OLED I2C'],
    status: 'ACTIVE',
    validationSteps: [
      'Montar circuito na protoboard sem curto-circuito.',
      'Conectar o ESP8266 à rede Wi-Fi da escola.',
      'Apresentar os dados no painel da guilda ao Game Master.'
    ]
  },
  {
    id: 'quest-2',
    title: 'Monitor de Consumo Consciente de Energia',
    description: 'Crie um medidor com Arduino/ESP8266 para medir o tempo de luzes acesas em salas vazias e emitir um bipe de alerta.',
    tier: 'ADVANCED',
    requiredSkills: ['microbit_starter'],
    sdgGoals: ['12.c', '7.a'],
    xpReward: 350,
    coinReward: 90,
    hardwareRequired: ['Sensor LDR de Luz', 'Buzzer 5V', 'Arduino Uno'],
    status: 'ACTIVE',
    validationSteps: [
      'Programar o limiar de iluminação.',
      'Demonstrar o disparo do alarme ao escurecer o sensor.'
    ]
  },
  {
    id: 'quest-3',
    title: 'Dispositivo Acessível para Deficientes Visuais',
    description: 'Utilize um sensor acelerômetro MMA8451 acoplado a uma bengala para detectar quedas e inclinações bruscas.',
    tier: 'SPECIALIST',
    requiredSkills: ['esp8266_advanced'],
    sdgGoals: ['4.3'],
    xpReward: 500,
    coinReward: 150,
    hardwareRequired: ['NodeMCU 1.0 (ESP8266)', 'Acelerômetro MMA8451 I2C'],
    status: 'ACTIVE',
    validationSteps: [
      'Calibrar os eixos X, Y e Z do acelerômetro.',
      'Validar o envio de alerta de queda via MQTT/Terminal.'
    ]
  },
  {
    id: 'quest-secret-1',
    title: 'Enigma Cypher: O Sinal Criptografado',
    description: 'Quest Secreta encontrada através do Terminal Hacker. Encontre o código hex gravado na Cortadora Laser para destravar o sinal.',
    tier: 'SPECIALIST',
    requiredSkills: ['logic_unplugged'],
    sdgGoals: ['4.3'],
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
    { id: 'l2', text: 'Guilda "Hackers da Amazônia" ativou o ataque crítico ODS 7.a! (-400 HP ao Boss)', time: '10:40', guildName: 'Hackers da Amazônia' },
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
