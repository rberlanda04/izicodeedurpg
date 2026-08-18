import type { StudyWizard } from '../types';

// Conteúdo didático do "Estúdio de Estudos" do Maker Lab — 5 wizards, um por
// família de material do laboratório. Cada um é uma sequência curta de
// passos (não um projeto de "mão na massa" como os do Mural de Missões) que
// ensina o conceito por trás dos materiais antes do aluno pegar peça
// emprestada e sair construindo. Completar um wizard concede XP + Izicoins
// uma única vez (controlado por profile.completedWizards).
export const LAB_WIZARDS: StudyWizard[] = [
  {
    id: 'wizard-microcontroladores',
    category: 'MICROCONTROLLER',
    title: 'O que é um Microcontrolador?',
    icon: '📟',
    summary: 'A diferença entre um Arduino, um ESP8266, um Raspberry Pi e um micro:bit — e por que isso importa na hora de escolher a placa certa.',
    xpReward: 70,
    coinReward: 30,
    steps: [
      {
        title: 'Um computador do tamanho de um selo',
        content: `
Um **microcontrolador** é um chip único que já vem com processador, memória e portas de entrada/saída (I/O) — tudo junto na mesma pastilha. É diferente de um computador comum, que tem processador, memória RAM e disco como peças separadas conectadas por fios.

Essa simplicidade é a vantagem: um microcontrolador liga em segundos, consome pouquíssima energia e custa poucos reais — perfeito para controlar UMA coisa específica (um LED, um motor, um sensor) em vez de rodar um sistema operacional inteiro.
`
      },
      {
        title: 'As placas do laboratório',
        content: `
No Maker Lab você vai encontrar 4 famílias de placas, cada uma com um ponto forte:

- **Arduino Uno:** o clássico. Chip ATmega328P, sem Wi-Fi, sem Bluetooth — só GPIO puro e C++. Ideal para aprender os fundamentos de eletrônica.
- **ESP8266 / NodeMCU:** parecido com o Arduino, mas com **Wi-Fi embutido**. Usado sempre que o projeto precisa mandar dados para a internet (IoT).
- **Raspberry Pi:** não é um microcontrolador, é um **microcomputador** completo — roda Linux de verdade, tem HDMI, USB, tudo. Usado quando o projeto precisa de mais poder de processamento (visão computacional, servidores locais).
- **micro:bit:** feito para educação. Já vem com matriz de LEDs, acelerômetro, bússola e rádio embutidos — sem precisar comprar sensores extras para começar.
`
      },
      {
        title: 'GPIO: as portas que conversam com o mundo real',
        content: `
**GPIO** significa *General Purpose Input/Output* — pinos de uso geral que podem ser configurados por código como **entrada** (lendo um sensor) ou **saída** (ligando um LED, um motor).

Cada pino GPIO só entende dois estados no modo digital: **HIGH** (ligado, ~5V ou 3.3V dependendo da placa) e **LOW** (desligado, 0V). É a mesma lógica de um interruptor de luz, só que controlado por código em vez de por uma mão.
`
      },
      {
        title: 'O ciclo setup() → loop()',
        content: `
Todo programa de Arduino (chamado de "sketch") segue a mesma estrutura de duas funções:

\`\`\`cpp
void setup() {
  // roda UMA VEZ, quando a placa liga ou reseta
  pinMode(13, OUTPUT);
}

void loop() {
  // roda PARA SEMPRE, em looping, enquanto a placa estiver ligada
  digitalWrite(13, HIGH);
}
\`\`\`

\`setup()\` é onde você configura os pinos e inicializa bibliotecas. \`loop()\` é onde a lógica do projeto de fato roda, repetidamente, várias vezes por segundo.
`
      }
    ]
  },
  {
    id: 'wizard-sensores',
    category: 'SENSOR',
    title: 'Como um Sensor "Sente" o Mundo',
    icon: '🌡️',
    summary: 'Sinal analógico vs. digital, o que é I2C e como ler um datasheet sem se perder.',
    xpReward: 70,
    coinReward: 30,
    steps: [
      {
        title: 'Sensor: um tradutor de grandeza física para sinal elétrico',
        content: `
Um **sensor** é um componente que transforma alguma grandeza do mundo físico — luz, som, temperatura, distância, movimento — em um sinal elétrico que o microcontrolador consegue ler.

Ele é o oposto de um **atuador**: o sensor traz informação do mundo real *para dentro* do código; o atuador leva uma decisão do código *para fora*, de volta ao mundo real.
`
      },
      {
        title: 'Sinal digital vs. sinal analógico',
        content: `
Sensores respondem de duas formas bem diferentes:

- **Digital (HIGH/LOW):** só tem dois estados possíveis, como o PIR (detectou movimento ou não) ou a saída DO do sensor de som (som passou do limiar ou não). Lido com \`digitalRead()\`.
- **Analógico (um valor contínuo):** entrega uma faixa de valores, geralmente de 0 a 1023 no Arduino Uno. Um LDR (sensor de luz) ou a saída AO de um sensor de som funcionam assim. Lido com \`analogRead()\`.

A escolha entre os dois muda completamente a lógica do código: digital vira um \`if\`, analógico vira uma faixa de comparação ou um mapeamento de valores.
`
      },
      {
        title: 'I2C: um barramento, vários sensores',
        content: `
Alguns sensores mais avançados (como o acelerômetro MMA8451) não usam um pino próprio — eles conversam por **I2C**, um protocolo que usa só 2 fios (SDA para dados, SCL para clock) e permite ligar **vários sensores diferentes ao mesmo tempo** nos mesmos 2 fios.

Cada sensor no barramento tem um **endereço** único (ex: 0x1C) para o microcontrolador saber com quem está "falando". Quando dois sensores do mesmo modelo têm o mesmo endereço de fábrica, é preciso mudar o endereço de um deles (geralmente ligando um pino específico ao GND ou ao 3.3V).
`
      },
      {
        title: 'Como ler um datasheet em 30 segundos',
        content: `
Antes de ligar qualquer sensor novo, procure 3 informações no datasheet (ou na etiqueta/embalagem):

- **Tensão de operação:** 3.3V ou 5V? Ligar um sensor de 3.3V direto no 5V pode queimá-lo.
- **Tipo de sinal:** digital, analógico ou I2C?
- **Pinagem:** qual pino é VCC, GND, e qual é o(s) pino(s) de sinal?

Com essas 3 respostas, qualquer sensor novo do laboratório vira só mais uma variação do que você já sabe.
`
      }
    ]
  },
  {
    id: 'wizard-atuadores',
    category: 'ACTUATOR',
    title: 'Atuadores: Fazendo o Mundo se Mexer',
    icon: '⚙️',
    summary: 'PWM, a diferença entre motor DC e servomotor, e por que motores precisam de um driver.',
    xpReward: 70,
    coinReward: 30,
    steps: [
      {
        title: 'Do sinal elétrico ao movimento',
        content: `
Um **atuador** converte um sinal elétrico em ação física: girar, empurrar, vibrar, emitir som ou luz. LEDs, buzzers, motores e servomotores são todos atuadores — cada um responde de um jeito diferente ao mesmo tipo de sinal que sai de um pino digital.
`
      },
      {
        title: 'PWM: fingindo um valor "intermediário"',
        content: `
Um pino digital só sabe fazer HIGH (5V) ou LOW (0V) — não existe "meio ligado". Para simular intensidades intermediárias (brilho de um LED, velocidade de um motor), a placa usa **PWM** (*Pulse Width Modulation*): liga e desliga o pino MUITO rápido, variando a proporção de tempo ligado.

\`\`\`cpp
analogWrite(9, 128); // ~50% do tempo ligado = brilho "na metade"
analogWrite(9, 255); // 100% do tempo ligado = brilho máximo
\`\`\`

Só pinos marcados com **~** no Arduino (ex: 3, 5, 6, 9, 10, 11) suportam PWM.
`
      },
      {
        title: 'Motor DC vs. Servomotor vs. Motor de passo',
        content: `
- **Motor DC:** gira continuamente enquanto receber energia. Você controla a *velocidade* (com PWM) e a *direção* (invertendo a polaridade), mas não um ângulo exato.
- **Servomotor (ex: SG90):** gira até um **ângulo específico** (0° a 180°) e para lá. Controlado por pulsos de posição via a biblioteca \`Servo.h\`, não por PWM comum.
- **Motor de passo:** gira em pequenos "passos" fixos e precisos, ótimo para posicionamento exato (usado em impressoras 3D, por exemplo).
`
      },
      {
        title: 'Por que motores precisam de um driver',
        content: `
Um pino digital do Arduino entrega no máximo ~20-40mA de corrente. Um motor DC pequeno já pede muito mais que isso — ligar o motor direto no pino pode queimar a placa.

A solução é um **driver de motor** (como a ponte H L298N) ou um **módulo relé**: o Arduino manda um sinal de baixa corrente para o driver, e o driver — alimentado por uma fonte externa — é quem de fato entrega a corrente alta que o motor precisa. O Arduino nunca toca diretamente na corrente do motor.
`
      }
    ]
  },
  {
    id: 'wizard-impressora-3d',
    category: 'PRINTER_3D',
    title: 'Da Tela à Peça Física: Impressão 3D',
    icon: '🖨️',
    summary: 'Como a impressão FDM funciona, PLA vs. ABS, e o caminho do modelo 3D até a peça impressa.',
    xpReward: 70,
    coinReward: 30,
    steps: [
      {
        title: 'Como a impressora "desenha" em 3D',
        content: `
As impressoras do laboratório usam a tecnologia **FDM** (*Fused Deposition Modeling*): um filamento plástico sólido é puxado, derretido dentro de um bico quente (hotend) e depositado em camadas finíssimas, uma sobre a outra, até formar o objeto completo — como uma pistola de cola quente controlada por um robô de precisão.
`
      },
      {
        title: 'PLA, ABS e PETG: qual filamento usar?',
        content: `
- **PLA:** o mais fácil de imprimir (temperatura baixa, quase não empena). Biodegradável, mas quebra mais fácil sob impacto ou calor forte. É o padrão do laboratório para a maioria dos projetos.
- **ABS:** mais resistente a impacto e calor, mas exige temperaturas mais altas e uma sala fechada (sem correntes de ar) para não empenar — mais difícil para iniciantes.
- **PETG:** um meio-termo: quase tão fácil quanto o PLA, porém mais resistente e flexível — bom para peças que vão levar algum esforço mecânico.
`
      },
      {
        title: 'Do modelo ao G-code',
        content: `
O caminho de uma ideia até a peça física passa por 3 etapas:

1. **Modelagem:** desenhar a peça em 3D (no laboratório, usamos o Tinkercad) e exportar como arquivo \`.STL\`.
2. **Fatiamento (slicing):** um programa fatiador (Cura, PrusaSlicer) corta o modelo 3D em centenas de camadas 2D e gera o **G-code** — uma lista de instruções de movimento que a impressora entende.
3. **Impressão:** a impressora lê o G-code e deposita o filamento camada por camada, do fundo para cima.
`
      },
      {
        title: 'As 3 configurações que mais mudam o resultado',
        content: `
- **Altura de camada:** camadas mais finas (ex: 0.1mm) dão mais detalhe e demoram mais; camadas mais grossas (ex: 0.28mm) imprimem rápido mas ficam mais "riscadas".
- **Preenchimento (infill):** a porcentagem do interior da peça que é sólida (o resto fica oco com um padrão treliçado). 15-20% já é suficiente para a maioria dos projetos escolares.
- **Suportes:** estruturas descartáveis que o fatiador adiciona embaixo de partes "flutuantes" do modelo, para elas não desabarem durante a impressão — removidas manualmente no final.
`
      }
    ]
  },
  {
    id: 'wizard-ferramentas',
    category: 'TOOLS',
    title: 'A Bancada do Maker: Ferramentas Essenciais',
    icon: '🧰',
    summary: 'Protoboard, multímetro, ferro de solda e as regras de segurança que valem para qualquer projeto.',
    xpReward: 70,
    coinReward: 30,
    steps: [
      {
        title: 'As ferramentas que aparecem em quase todo projeto',
        content: `
- **Protoboard:** uma placa com furos conectados internamente em fileiras, para montar circuitos sem precisar soldar — ideal para testar e desmontar rápido.
- **Jumpers:** os fios com pontas de encaixe que ligam a protoboard aos componentes e à placa controladora.
- **Multímetro:** mede tensão, corrente, resistência e continuidade — a principal ferramenta de diagnóstico quando "nada funciona".
- **Alicate desencapador:** remove a capa plástica de um fio sem cortar o metal por dentro.
`
      },
      {
        title: 'Segurança com o ferro de solda',
        content: `
O ferro de solda passa dos **300°C** — mais quente que um forno doméstico no máximo. Três regras que valem sempre:

- Sempre **pousar o ferro na base de apoio** entre um uso e outro, nunca direto na bancada.
- Trabalhar em ambiente **ventilado** — a fumaça da solda derretida não deve ser respirada de perto.
- Nunca tocar na ponta metálica, mesmo "desligado há pouco tempo" — ela demora para esfriar de verdade.
`
      },
      {
        title: 'Multímetro: as 3 medições mais usadas',
        content: `
- **Continuidade** (modo "bipe"): confirma se dois pontos estão eletricamente conectados — ótimo para achar um fio partido ou uma solda fria.
- **Tensão (V):** mede a diferença de potencial entre dois pontos — confirma se uma fonte está entregando os volts esperados (ex: 5V do Arduino).
- **Resistência (Ω):** mede o valor de um resistor quando as faixas de cor estão difíceis de ler, ou testa se um componente está em curto.
`
      },
      {
        title: 'Organização evita 90% dos problemas',
        content: `
A maioria dos "bugs" de hardware não é de código — é fiação solta, componente no lugar errado ou peça queimada por descuido. Três hábitos que economizam horas de troubleshooting:

- Guarde componentes sensíveis (sensores I2C, microcontroladores) em **saquinhos antiestáticos**, especialmente em dias secos.
- **Desconecte a alimentação antes de mexer na fiação** — trocar um fio com o circuito ligado é a causa mais comum de curto-circuito acidental.
- No fim da sessão, devolva cada item ao Maker Lab pelo menu de requisição — é assim que o estoque continua confiável para a próxima turma.
`
      }
    ]
  }
];
