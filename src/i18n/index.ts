import { createI18n } from 'vue-i18n'

export const supportedLocales = ['pt-BR', 'es-ES', 'en-EU'] as const
export type AppLocale = (typeof supportedLocales)[number]

const messages = {
  'en-EU': {
    app: {
      title: '8-Puzzle AI Game',
      menu: {
        contact: 'Contact',
        documentation: 'Documentation',
        about: 'About the 8-Puzzle'
      },
      language: {
        ptBR: 'Portuguese (Brazil)',
        esES: 'Spanish (Spain)',
        enEU: 'English (Europe)'
      },
      footer: '8-Puzzle AI Game © 2023 Created by Pumba Developer'
    },
    about: {
      title: 'About the 8-Puzzle',
      paragraph1:
        'The 8-puzzle is a sliding-tile game played on a 3x3 board. Eight tiles are numbered from 1 to 8, and one position is empty. A state is solved when the board matches the goal configuration.',
      paragraph2:
        'In this app, the empty position is represented by 0 in the setup board. Every move slides one adjacent tile into the empty space, generating a new state that algorithms can explore.',
      goalTitle: 'Goal State',
      goalDescription: 'The search ends when this arrangement is reached.',
      rule1: 'Only legal moves are allowed: up, down, left, and right relative to the empty tile.',
      rule2:
        'Each algorithm explores the state space differently, balancing speed and memory usage.',
      rule3: 'Heuristic-based methods in this project use Manhattan Distance to guide the search.'
    },
    setup: {
      title: 'Game Setup',
      tooltip:
        'Click each tile in the board to choose values from 0 to 8. Value 0 represents the empty spot.'
    },
    algorithms: {
      title: 'Search Algorithms',
      tooltip:
        'Select the algorithm you want to use to search the state border. The heuristic used is Manhattan Distance.',
      bfs: {
        label: 'Breadth First Search',
        explanation: 'Explores all neighboring nodes before exploring child nodes.'
      },
      dfs: {
        label: 'Depth First Search',
        explanation: 'Explores all child nodes before exploring neighboring nodes.'
      },
      gs: {
        label: 'Greedy Search',
        explanation:
          'Explores the node that appears to be the most promising according to a heuristic.'
      },
      aStar: {
        label: 'A* Search',
        explanation:
          'Explores the node that appears to be the most promising according to a heuristic and path cost.'
      }
    },
    actions: {
      randomValues: 'Random Values',
      checkHValue: 'Check h-value',
      startGame: 'Start Game',
      stepByStep: 'Step By Step',
      resetGame: 'Reset Game',
      nextStep: 'Next Step'
    },
    solution: {
      title: 'Solution',
      stepTitle: 'Step by Step Solution State',
      stateBorder: 'State Border'
    },
    stats: {
      solutionNodes: 'Solution Nodes',
      generatedNodes: 'Generated Nodes',
      openNodes: 'Open Nodes',
      maxDepth: 'Max Depth',
      maxStatesBorderSize: 'Max States Border Size',
      executionTime: 'Execution Time',
      maxQueueSize: 'Max Queue Size',
      tooltip: {
        solutionNodes: 'The number of operations required to reach the goal state.',
        generatedNodes: 'The number of different nodes generated during the search.',
        openNodes: 'The number of nodes opened during the search.',
        maxDepth: 'The maximum depth reached by the search.',
        maxStatesBorderSize: 'The maximum number of nodes in the state border.',
        executionTime: 'The time taken to find the solution (in milliseconds).'
      }
    },
    boardInput: {
      emptyTile: 'Empty (0)',
      clearCell: 'Clear Cell',
      set: 'set',
      hint: 'Click a tile to choose a value from 0 to 8. 0 means the empty space.'
    },
    board: {
      hValue: 'h = {value}'
    },
    messages: {
      hValue: 'h-value: {value}',
      invalidSetup: 'Please, insert a valid game setup.',
      unsolvableSetup: 'This setup is not solvable. Please, insert a solvable game setup.',
      noSolution: 'No solution found!',
      algorithmCompleted: 'Algorithm already completed.'
    }
  },
  'pt-BR': {
    app: {
      title: 'Jogo 8-Puzzle com IA',
      menu: {
        contact: 'Contato',
        documentation: 'Documentacao',
        about: 'Sobre o 8-Puzzle'
      },
      language: {
        ptBR: 'Portugues (Brasil)',
        esES: 'Espanhol (Espanha)',
        enEU: 'Ingles (Europa)'
      },
      footer: 'Jogo 8-Puzzle com IA © 2023 Criado por Pumba Developer'
    },
    about: {
      title: 'Sobre o 8-Puzzle',
      paragraph1:
        'O 8-puzzle e um jogo de pecas deslizantes em um tabuleiro 3x3. Oito pecas sao numeradas de 1 a 8, e uma posicao fica vazia. Um estado esta resolvido quando o tabuleiro corresponde a configuracao objetivo.',
      paragraph2:
        'Neste app, a posicao vazia e representada por 0 no tabuleiro de configuracao. Cada movimento desliza uma peca adjacente para o espaco vazio, gerando um novo estado para os algoritmos explorarem.',
      goalTitle: 'Estado Objetivo',
      goalDescription: 'A busca termina quando este arranjo e alcancado.',
      rule1:
        'Somente movimentos legais sao permitidos: cima, baixo, esquerda e direita em relacao ao espaco vazio.',
      rule2:
        'Cada algoritmo explora o espaco de estados de forma diferente, equilibrando velocidade e uso de memoria.',
      rule3:
        'Metodos baseados em heuristica neste projeto usam Distancia de Manhattan para guiar a busca.'
    },
    setup: {
      title: 'Configuracao do Jogo',
      tooltip:
        'Clique em cada peca do tabuleiro para escolher valores de 0 a 8. O valor 0 representa o espaco vazio.'
    },
    algorithms: {
      title: 'Algoritmos de Busca',
      tooltip:
        'Selecione o algoritmo para realizar a busca na borda de estados. A heuristica utilizada e Distancia de Manhattan.',
      bfs: {
        label: 'Busca em Largura',
        explanation: 'Explora todos os nos vizinhos antes de explorar os nos filhos.'
      },
      dfs: {
        label: 'Busca em Profundidade',
        explanation: 'Explora todos os nos filhos antes de explorar os nos vizinhos.'
      },
      gs: {
        label: 'Busca Gulosa',
        explanation: 'Explora o no que parece mais promissor de acordo com uma heuristica.'
      },
      aStar: {
        label: 'Busca A*',
        explanation: 'Explora o no mais promissor de acordo com heuristica e custo do caminho.'
      }
    },
    actions: {
      randomValues: 'Valores Aleatorios',
      checkHValue: 'Verificar h-value',
      startGame: 'Iniciar Jogo',
      stepByStep: 'Passo a Passo',
      resetGame: 'Reiniciar Jogo',
      nextStep: 'Proximo Passo'
    },
    solution: {
      title: 'Solucao',
      stepTitle: 'Estado da Solucao Passo a Passo',
      stateBorder: 'Borda de Estados'
    },
    stats: {
      solutionNodes: 'Nos da Solucao',
      generatedNodes: 'Nos Gerados',
      openNodes: 'Nos Abertos',
      maxDepth: 'Profundidade Maxima',
      maxStatesBorderSize: 'Tamanho Maximo da Borda de Estados',
      executionTime: 'Tempo de Execucao',
      maxQueueSize: 'Tamanho Maximo da Fila',
      tooltip: {
        solutionNodes: 'Quantidade de operacoes necessarias para chegar ao estado objetivo.',
        generatedNodes: 'Quantidade de nos diferentes gerados durante a busca.',
        openNodes: 'Quantidade de nos abertos durante a busca.',
        maxDepth: 'Maior profundidade alcancada durante a busca.',
        maxStatesBorderSize: 'Maior quantidade de nos na borda de estados.',
        executionTime: 'Tempo gasto para encontrar a solucao (em milissegundos).'
      }
    },
    boardInput: {
      emptyTile: 'Vazio (0)',
      clearCell: 'Limpar Casa',
      set: 'definir',
      hint: 'Clique em uma peca para escolher um valor de 0 a 8. 0 significa espaco vazio.'
    },
    board: {
      hValue: 'h = {value}'
    },
    messages: {
      hValue: 'h-value: {value}',
      invalidSetup: 'Por favor, insira uma configuracao valida do jogo.',
      unsolvableSetup: 'Esta configuracao nao tem solucao. Insira uma configuracao solucionavel.',
      noSolution: 'Nenhuma solucao encontrada!',
      algorithmCompleted: 'O algoritmo ja foi concluido.'
    }
  },
  'es-ES': {
    app: {
      title: 'Juego 8-Puzzle con IA',
      menu: {
        contact: 'Contacto',
        documentation: 'Documentacion',
        about: 'Sobre el 8-Puzzle'
      },
      language: {
        ptBR: 'Portugues (Brasil)',
        esES: 'Espanol (Espana)',
        enEU: 'Ingles (Europa)'
      },
      footer: 'Juego 8-Puzzle con IA © 2023 Creado por Pumba Developer'
    },
    about: {
      title: 'Sobre el 8-Puzzle',
      paragraph1:
        'El 8-puzzle es un juego de fichas deslizantes en un tablero 3x3. Ocho fichas estan numeradas del 1 al 8, y una posicion queda vacia. Un estado se considera resuelto cuando el tablero coincide con la configuracion objetivo.',
      paragraph2:
        'En esta app, la posicion vacia se representa con 0 en el tablero de configuracion. Cada movimiento desliza una ficha adyacente hacia el espacio vacio, generando un nuevo estado para que los algoritmos lo exploren.',
      goalTitle: 'Estado Objetivo',
      goalDescription: 'La busqueda termina cuando se alcanza esta disposicion.',
      rule1:
        'Solo se permiten movimientos legales: arriba, abajo, izquierda y derecha respecto al espacio vacio.',
      rule2:
        'Cada algoritmo explora el espacio de estados de forma distinta, equilibrando velocidad y uso de memoria.',
      rule3:
        'Los metodos heuristicas en este proyecto usan Distancia Manhattan para guiar la busqueda.'
    },
    setup: {
      title: 'Configuracion del Juego',
      tooltip:
        'Haz clic en cada ficha del tablero para elegir valores de 0 a 8. El valor 0 representa el espacio vacio.'
    },
    algorithms: {
      title: 'Algoritmos de Busqueda',
      tooltip:
        'Selecciona el algoritmo para realizar la busqueda en la frontera de estados. La heuristica usada es Distancia Manhattan.',
      bfs: {
        label: 'Busqueda en Anchura',
        explanation: 'Explora todos los nodos vecinos antes de explorar los nodos hijos.'
      },
      dfs: {
        label: 'Busqueda en Profundidad',
        explanation: 'Explora todos los nodos hijos antes de explorar los nodos vecinos.'
      },
      gs: {
        label: 'Busqueda Voraz',
        explanation: 'Explora el nodo que parece mas prometedor segun una heuristica.'
      },
      aStar: {
        label: 'Busqueda A*',
        explanation: 'Explora el nodo mas prometedor segun heuristica y costo del camino.'
      }
    },
    actions: {
      randomValues: 'Valores Aleatorios',
      checkHValue: 'Comprobar h-value',
      startGame: 'Iniciar Juego',
      stepByStep: 'Paso a Paso',
      resetGame: 'Reiniciar Juego',
      nextStep: 'Siguiente Paso'
    },
    solution: {
      title: 'Solucion',
      stepTitle: 'Estado de Solucion Paso a Paso',
      stateBorder: 'Frontera de Estados'
    },
    stats: {
      solutionNodes: 'Nodos de Solucion',
      generatedNodes: 'Nodos Generados',
      openNodes: 'Nodos Abiertos',
      maxDepth: 'Profundidad Maxima',
      maxStatesBorderSize: 'Tamano Maximo de la Frontera de Estados',
      executionTime: 'Tiempo de Ejecucion',
      maxQueueSize: 'Tamano Maximo de la Cola',
      tooltip: {
        solutionNodes: 'Numero de operaciones necesarias para llegar al estado objetivo.',
        generatedNodes: 'Numero de nodos distintos generados durante la busqueda.',
        openNodes: 'Numero de nodos abiertos durante la busqueda.',
        maxDepth: 'Profundidad maxima alcanzada durante la busqueda.',
        maxStatesBorderSize: 'Numero maximo de nodos en la frontera de estados.',
        executionTime: 'Tiempo empleado para encontrar la solucion (en milisegundos).'
      }
    },
    boardInput: {
      emptyTile: 'Vacio (0)',
      clearCell: 'Limpiar Casilla',
      set: 'definir',
      hint: 'Haz clic en una ficha para elegir un valor de 0 a 8. 0 significa espacio vacio.'
    },
    board: {
      hValue: 'h = {value}'
    },
    messages: {
      hValue: 'h-value: {value}',
      invalidSetup: 'Por favor, inserta una configuracion valida del juego.',
      unsolvableSetup: 'Esta configuracion no tiene solucion. Inserta una configuracion resoluble.',
      noSolution: 'No se encontro solucion!',
      algorithmCompleted: 'El algoritmo ya fue completado.'
    }
  }
}

function getDefaultLocale(): AppLocale {
  if (typeof navigator === 'undefined') {
    return 'en-EU'
  }

  const browserLanguage = navigator.language.toLowerCase()

  if (browserLanguage.startsWith('pt')) {
    return 'pt-BR'
  }

  if (browserLanguage.startsWith('es')) {
    return 'es-ES'
  }

  return 'en-EU'
}

export const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: getDefaultLocale(),
  fallbackLocale: 'en-EU',
  messages
})

export function translate(key: string, values?: Record<string, unknown>) {
  return i18n.global.t(key, values ?? {}) as string
}
