import type { SequencePuzzle } from '../types';

// Banco de "puzzles de sequência" — o segundo tipo de minigame de lógica,
// usado nos pontos de encontro do Mundo (Overworld). Diferente do Desafio
// Relâmpago (múltipla escolha), aqui o aluno reconstrói a ORDEM correta de
// um processo real do currículo maker, clicando os passos embaralhados na
// sequência que acredita ser certa.
export const SEQUENCE_PUZZLES: SequencePuzzle[] = [
  {
    id: 'seq-circuito-led',
    icon: '💡',
    title: 'Como Montar um Circuito com LED',
    instruction: 'Coloque os passos na ordem correta de montagem.',
    steps: [
      'Identificar o anodo (perna longa) e o catodo (perna curta) do LED',
      'Conectar o resistor de proteção em série com o LED',
      'Ligar o circuito a um pino digital do microcontrolador',
      'Fazer upload do código e testar se o LED acende'
    ],
    xpReward: 40,
    coinReward: 15
  },
  {
    id: 'seq-codigo-robo',
    icon: '🤖',
    title: 'Do Código ao Robô Andando',
    instruction: 'Coloque os passos na ordem correta, do computador até o robô se mover.',
    steps: [
      'Escrever a lógica do movimento no computador',
      'Compilar o código para checar erros de sintaxe',
      'Fazer upload do código para a placa do robô',
      'Observar o robô executar e ajustar o código se necessário'
    ],
    xpReward: 40,
    coinReward: 15
  },
  {
    id: 'seq-impressao-3d',
    icon: '🖨️',
    title: 'Da Ideia à Peça Impressa',
    instruction: 'Coloque os passos na ordem correta da fabricação digital.',
    steps: [
      'Modelar a peça em um software 3D, como o Tinkercad',
      'Exportar o modelo como um arquivo .STL',
      'Fatiar o arquivo em um software fatiador (slicer)',
      'Imprimir a peça camada por camada'
    ],
    xpReward: 40,
    coinReward: 15
  },
  {
    id: 'seq-sensor-decisao',
    icon: '🌡️',
    title: 'Como um Sensor Vira uma Decisão',
    instruction: 'Coloque os passos na ordem correta do ciclo sensor → decisão → ação.',
    steps: [
      'O sensor lê um valor do ambiente (luz, som, distância...)',
      'O código compara esse valor com um limite usando um IF',
      'Se a condição for verdadeira, um atuador é acionado',
      'O ciclo se repete na próxima passada do loop()'
    ],
    xpReward: 40,
    coinReward: 15
  },
  {
    id: 'seq-debug',
    icon: '🐞',
    title: 'Depurando um Erro (Debug)',
    instruction: 'Coloque os passos na ordem correta para resolver um bug com método.',
    steps: [
      'Ler a mensagem de erro com atenção, do início ao fim',
      'Reproduzir o problema de novo para confirmar que ele é real',
      'Isolar a linha de código ou o componente suspeito',
      'Testar uma correção por vez, sem mudar tudo de uma vez'
    ],
    xpReward: 40,
    coinReward: 15
  },
  {
    id: 'seq-apresentacao',
    icon: '📊',
    title: 'Preparando uma Apresentação de Projeto',
    instruction: 'Coloque os passos na ordem correta para apresentar bem um projeto.',
    steps: [
      'Organizar os dados e resultados reais do projeto',
      'Montar os slides contando a história do projeto',
      'Ensaiar a fala em voz alta antes da hora',
      'Apresentar e responder perguntas da plateia'
    ],
    xpReward: 40,
    coinReward: 15
  },
  {
    id: 'seq-iot',
    icon: '📡',
    title: 'Como a Internet das Coisas Funciona',
    instruction: 'Coloque os passos na ordem correta do fluxo de dados de um projeto IoT.',
    steps: [
      'O sensor mede um dado físico do ambiente',
      'O microcontrolador com Wi-Fi envia esse dado para a nuvem',
      'O dado aparece em um dashboard ou aplicativo',
      'A pessoa toma uma decisão a partir dessa informação'
    ],
    xpReward: 40,
    coinReward: 15
  },
  {
    id: 'seq-ciclo-jogo-2d',
    icon: '🎮',
    title: 'O Ciclo de um Jogo 2D',
    instruction: 'Coloque os passos na ordem correta do "game loop" que roda várias vezes por segundo.',
    steps: [
      'O jogo desenha o cenário e os personagens na tela',
      'O jogo lê a entrada do jogador (teclado, toque ou controle)',
      'O jogo atualiza a posição dos personagens com base na entrada',
      'O jogo verifica colisões e recomeça o ciclo no quadro seguinte'
    ],
    xpReward: 40,
    coinReward: 15
  }
];
