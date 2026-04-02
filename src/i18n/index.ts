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
        about: 'About the 8-Puzzle',
        play: 'Play Mode',
        simulation: 'Simulation Mode'
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
        'Fill the 3x3 board with values from 0 to 8, without repeating numbers. Use 0 as the empty tile and click Run Simulation when ready.'
    },
    play: {
      title: 'Play 8-Puzzle',
      subtitle: 'Move the tiles until you reach the goal state.',
      currentDifficulty: 'Difficulty: {difficulty}',
      notAvailable: 'N/A',
      optimalLoading: 'Calculating...',
      hintMessage: 'Hint: move tile {tile}.',
      difficulty: {
        easy: 'Easy',
        medium: 'Medium',
        hard: 'Hard'
      },
      actions: {
        hint: 'Hint',
        restart: 'Restart',
        generateInitial: 'Generate Initial State',
        newGame: 'New Game',
        newChallenge: 'New Challenge'
      },
      stats: {
        moves: 'Moves',
        time: 'Time',
        mpm: 'MPM',
        hintsUsed: 'Hints Used',
        bestTime: 'Best Time',
        optimalMoves: 'Optimal Moves',
        efficiency: 'Efficiency'
      },
      status: {
        idle: 'Ready to play. Make your first move.',
        playing: 'Game in progress.',
        won: 'Puzzle solved.'
      },
      board: {
        emptyTileAriaLabel: 'Empty tile',
        tileAriaLabel: 'Tile {tile}'
      },
      victory: {
        title: 'You Win!',
        subtitle: 'Puzzle solved successfully.',
        toast: 'Puzzle solved!'
      }
    },
    algorithms: {
      title: 'Search Algorithms',
      tooltip:
        'Choose how the solver explores states. BFS/DFS do not use heuristics, while Greedy and A* use Manhattan Distance.',
      bfs: {
        label: 'Breadth First Search',
        explanation:
          'Tests states level by level. Reliable for shortest path, but can use more memory.'
      },
      dfs: {
        label: 'Depth First Search',
        explanation:
          'Follows one branch deeply before backtracking. Usually fast to start, but may take longer to find the best path.'
      },
      gs: {
        label: 'Greedy Search',
        explanation:
          'Always chooses the state that seems closest to the goal (heuristic only). Fast, but not always optimal.'
      },
      aStar: {
        label: 'A* Search',
        explanation:
          'Balances current path cost and heuristic estimate. Usually the best trade-off for quality and performance.'
      }
    },
    actions: {
      randomValues: 'Random Values',
      checkHValue: 'Check h-value',
      startGame: 'Start Game',
      stepByStep: 'Step By Step',
      runSimulation: 'Run Simulation',
      pauseSimulation: 'Pause Simulation',
      resumeSimulation: 'Resume Simulation',
      newSimulation: 'Start New Simulation',
      cancelSimulation: 'Cancel Simulation',
      resetGame: 'Reset Game',
      nextStep: 'Next Step'
    },
    simulation: {
      loadingTitle: 'Solving puzzle in background',
      loadingDescription: 'The simulation is running in parallel. You can keep using the page.',
      pausedDescription: 'Simulation paused. Inspect the current state and continue when ready.',
      pausedBadge: 'Paused',
      liveBorderTitle: 'Live State Border',
      liveBorderEmpty: 'Waiting for first generated states...',
      liveBorderExpansion: 'Expansion #{tick}',
      liveBorderFromState: 'From state',
      liveBorderOpenedStates: 'Opened states',
      liveBorderNoNewStates: 'No new states opened in this expansion.',
      elapsed: 'Elapsed',
      cancelling: 'Cancelling...',
      speed: {
        label: 'State Opening Speed',
        slow: 'Slow',
        normal: 'Normal',
        fast: 'Fast',
        minimumDuration: 'Minimum simulation time: {seconds}s'
      }
    },
    solution: {
      title: 'Solution',
      stepTitle: 'Step by Step Solution State',
      stateBorder: 'State Border',
      routeTitle: 'Found Route',
      routeSummary: 'Solved in {steps} steps',
      initialStateLabel: 'Initial State'
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
        solutionNodes: 'Number of steps in the final route from initial state to goal.',
        generatedNodes: 'Total candidate states created by the algorithm.',
        openNodes: 'States actually expanded during the search.',
        maxDepth: 'Deepest level reached in the search tree.',
        maxStatesBorderSize: 'Largest frontier size kept in memory at once.',
        executionTime: 'Total time to find the result (milliseconds).'
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
      algorithmCompleted: 'Algorithm already completed.',
      simulationCancelled: 'Simulation cancelled.',
      simulationPaused: 'Simulation paused.',
      simulationResumed: 'Simulation resumed.',
      simulationError: 'An error happened while running the simulation.'
    }
  },
  'pt-BR': {
    app: {
      title: 'Jogo dos 8 com IA',
      menu: {
        contact: 'Contato',
        documentation: 'Documentacao',
        about: 'Sobre o 8-Puzzle',
        play: 'Modo Jogar',
        simulation: 'Modo Simulacao'
      },
      language: {
        ptBR: 'Portugues (Brasil)',
        esES: 'Espanhol (Espanha)',
        enEU: 'Ingles (Europa)'
      },
      footer: 'Jogo dos 8 com IA © 2023 Criado por Pumba Developer'
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
        'Preencha o tabuleiro 3x3 com valores de 0 a 8, sem repetir numeros. Use 0 como espaco vazio e clique em Executar Simulacao quando terminar.'
    },
    play: {
      title: 'Modo Jogar 8-Puzzle',
      subtitle: 'Mova as pecas ate chegar ao estado objetivo.',
      currentDifficulty: 'Dificuldade: {difficulty}',
      notAvailable: 'N/D',
      optimalLoading: 'Calculando...',
      hintMessage: 'Dica: mova a peca {tile}.',
      difficulty: {
        easy: 'Facil',
        medium: 'Medio',
        hard: 'Dificil'
      },
      actions: {
        hint: 'Dica',
        restart: 'Reiniciar',
        generateInitial: 'Gerar Inicial',
        newGame: 'Novo Jogo',
        newChallenge: 'Novo Desafio'
      },
      stats: {
        moves: 'Movimentos',
        time: 'Tempo',
        mpm: 'MPM',
        hintsUsed: 'Dicas Usadas',
        bestTime: 'Melhor Tempo',
        optimalMoves: 'Movimentos Otimos',
        efficiency: 'Eficiencia'
      },
      status: {
        idle: 'Pronto para jogar. Faca seu primeiro movimento.',
        playing: 'Partida em andamento.',
        won: 'Puzzle resolvido.'
      },
      board: {
        emptyTileAriaLabel: 'Casa vazia',
        tileAriaLabel: 'Peca {tile}'
      },
      victory: {
        title: 'Voce Venceu!',
        subtitle: 'Puzzle resolvido com sucesso.',
        toast: 'Puzzle resolvido!'
      }
    },
    algorithms: {
      title: 'Algoritmos de Busca',
      tooltip:
        'Escolha como o solver explora os estados. BFS/DFS nao usam heuristica; Gulosa e A* usam Distancia de Manhattan.',
      bfs: {
        label: 'Busca em Largura',
        explanation:
          'Explora nivel por nivel. Costuma encontrar o menor caminho, mas pode consumir mais memoria.'
      },
      dfs: {
        label: 'Busca em Profundidade',
        explanation:
          'Vai fundo em um ramo antes de voltar. Comeca rapido, mas pode demorar mais para achar o melhor caminho.'
      },
      gs: {
        label: 'Busca Gulosa',
        explanation:
          'Sempre escolhe o estado que parece mais perto do objetivo (apenas heuristica). E rapida, mas nem sempre otimiza o caminho.'
      },
      aStar: {
        label: 'Busca A*',
        explanation:
          'Combina custo do caminho com heuristica. Geralmente oferece melhor equilibrio entre qualidade e desempenho.'
      }
    },
    actions: {
      randomValues: 'Valores Aleatorios',
      checkHValue: 'Verificar h-value',
      startGame: 'Iniciar Jogo',
      stepByStep: 'Passo a Passo',
      runSimulation: 'Executar Simulacao',
      pauseSimulation: 'Pausar Simulacao',
      resumeSimulation: 'Continuar Simulacao',
      newSimulation: 'Fazer nova simulacao',
      cancelSimulation: 'Cancelar Simulacao',
      resetGame: 'Reiniciar Jogo',
      nextStep: 'Proximo Passo'
    },
    simulation: {
      loadingTitle: 'Resolvendo puzzle em segundo plano',
      loadingDescription:
        'A simulacao esta rodando em paralelo. Voce pode continuar usando a pagina.',
      pausedDescription: 'Simulacao pausada. Veja o estado atual e continue quando quiser.',
      pausedBadge: 'Pausada',
      liveBorderTitle: 'Borda de Estados em Tempo Real',
      liveBorderEmpty: 'Aguardando os primeiros estados gerados...',
      liveBorderExpansion: 'Expansao #{tick}',
      liveBorderFromState: 'Estado de origem',
      liveBorderOpenedStates: 'Estados abertos',
      liveBorderNoNewStates: 'Nenhum novo estado foi aberto nesta expansao.',
      elapsed: 'Tempo',
      cancelling: 'Cancelando...',
      speed: {
        label: 'Velocidade de Abertura dos Estados',
        slow: 'Lenta',
        normal: 'Normal',
        fast: 'Rapida',
        minimumDuration: 'Tempo minimo da simulacao: {seconds}s'
      }
    },
    solution: {
      title: 'Solucao',
      stepTitle: 'Estado da Solucao Passo a Passo',
      stateBorder: 'Borda de Estados',
      routeTitle: 'Rota Encontrada',
      routeSummary: 'Resolvido em {steps} passos',
      initialStateLabel: 'Estado Inicial'
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
        solutionNodes: 'Quantidade de passos da rota final do estado inicial ate o objetivo.',
        generatedNodes: 'Total de estados candidatos gerados pelo algoritmo.',
        openNodes: 'Estados que realmente foram expandidos na busca.',
        maxDepth: 'Maior nivel atingido na arvore de busca.',
        maxStatesBorderSize: 'Maior tamanho da fronteira mantida em memoria ao mesmo tempo.',
        executionTime: 'Tempo total para encontrar o resultado (em milissegundos).'
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
      algorithmCompleted: 'O algoritmo ja foi concluido.',
      simulationCancelled: 'Simulacao cancelada.',
      simulationPaused: 'Simulacao pausada.',
      simulationResumed: 'Simulacao continuada.',
      simulationError: 'Ocorreu um erro durante a simulacao.'
    }
  },
  'es-ES': {
    app: {
      title: 'Juego de los 8 con IA',
      menu: {
        contact: 'Contacto',
        documentation: 'Documentacion',
        about: 'Sobre el 8-Puzzle',
        play: 'Modo Juego',
        simulation: 'Modo Simulacion'
      },
      language: {
        ptBR: 'Portugues (Brasil)',
        esES: 'Espanol (Espana)',
        enEU: 'Ingles (Europa)'
      },
      footer: 'Juego de los 8 con IA © 2023 Creado por Pumba Developer'
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
        'Completa el tablero 3x3 con valores de 0 a 8 sin repetir numeros. Usa 0 como espacio vacio y pulsa Ejecutar Simulacion al terminar.'
    },
    play: {
      title: 'Modo Juego 8-Puzzle',
      subtitle: 'Mueve las fichas hasta llegar al estado objetivo.',
      currentDifficulty: 'Dificultad: {difficulty}',
      notAvailable: 'N/D',
      optimalLoading: 'Calculando...',
      hintMessage: 'Pista: mueve la ficha {tile}.',
      difficulty: {
        easy: 'Facil',
        medium: 'Medio',
        hard: 'Dificil'
      },
      actions: {
        hint: 'Pista',
        restart: 'Reiniciar',
        generateInitial: 'Generar Inicial',
        newGame: 'Nuevo Juego',
        newChallenge: 'Nuevo Desafio'
      },
      stats: {
        moves: 'Movimientos',
        time: 'Tiempo',
        mpm: 'MPM',
        hintsUsed: 'Pistas Usadas',
        bestTime: 'Mejor Tiempo',
        optimalMoves: 'Movimientos Optimos',
        efficiency: 'Eficiencia'
      },
      status: {
        idle: 'Listo para jugar. Haz tu primer movimiento.',
        playing: 'Partida en progreso.',
        won: 'Puzzle resuelto.'
      },
      board: {
        emptyTileAriaLabel: 'Casilla vacia',
        tileAriaLabel: 'Ficha {tile}'
      },
      victory: {
        title: 'Has Ganado!',
        subtitle: 'Puzzle resuelto con exito.',
        toast: 'Puzzle resuelto!'
      }
    },
    algorithms: {
      title: 'Algoritmos de Busqueda',
      tooltip:
        'Elige como el solver explora estados. BFS/DFS no usan heuristica; Voraz y A* usan Distancia Manhattan.',
      bfs: {
        label: 'Busqueda en Anchura',
        explanation:
          'Explora nivel por nivel. Suele hallar la ruta mas corta, pero puede usar mas memoria.'
      },
      dfs: {
        label: 'Busqueda en Profundidad',
        explanation:
          'Profundiza en una rama antes de retroceder. Arranca rapido, pero puede tardar mas en encontrar la mejor ruta.'
      },
      gs: {
        label: 'Busqueda Voraz',
        explanation:
          'Siempre elige el estado que parece mas cercano al objetivo (solo heuristica). Es rapida, pero no siempre optimiza la ruta.'
      },
      aStar: {
        label: 'Busqueda A*',
        explanation:
          'Combina costo de camino y heuristica. Normalmente ofrece el mejor equilibrio entre calidad y rendimiento.'
      }
    },
    actions: {
      randomValues: 'Valores Aleatorios',
      checkHValue: 'Comprobar h-value',
      startGame: 'Iniciar Juego',
      stepByStep: 'Paso a Paso',
      runSimulation: 'Ejecutar Simulacion',
      pauseSimulation: 'Pausar Simulacion',
      resumeSimulation: 'Continuar Simulacion',
      newSimulation: 'Hacer nueva simulacion',
      cancelSimulation: 'Cancelar Simulacion',
      resetGame: 'Reiniciar Juego',
      nextStep: 'Siguiente Paso'
    },
    simulation: {
      loadingTitle: 'Resolviendo puzzle en segundo plano',
      loadingDescription: 'La simulacion se ejecuta en paralelo. Puedes seguir usando la pagina.',
      pausedDescription: 'Simulacion pausada. Revisa el estado actual y continua cuando quieras.',
      pausedBadge: 'Pausada',
      liveBorderTitle: 'Frontera de Estados en Vivo',
      liveBorderEmpty: 'Esperando los primeros estados generados...',
      liveBorderExpansion: 'Expansion #{tick}',
      liveBorderFromState: 'Estado de origen',
      liveBorderOpenedStates: 'Estados abiertos',
      liveBorderNoNewStates: 'No se abrieron estados nuevos en esta expansion.',
      elapsed: 'Tiempo',
      cancelling: 'Cancelando...',
      speed: {
        label: 'Velocidad de Apertura de Estados',
        slow: 'Lenta',
        normal: 'Normal',
        fast: 'Rapida',
        minimumDuration: 'Tiempo minimo de simulacion: {seconds}s'
      }
    },
    solution: {
      title: 'Solucion',
      stepTitle: 'Estado de Solucion Paso a Paso',
      stateBorder: 'Frontera de Estados',
      routeTitle: 'Ruta Encontrada',
      routeSummary: 'Resuelto en {steps} pasos',
      initialStateLabel: 'Estado Inicial'
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
        solutionNodes:
          'Cantidad de pasos de la ruta final desde el estado inicial hasta el objetivo.',
        generatedNodes: 'Total de estados candidatos generados por el algoritmo.',
        openNodes: 'Estados que realmente se expandieron durante la busqueda.',
        maxDepth: 'Nivel mas profundo alcanzado en el arbol de busqueda.',
        maxStatesBorderSize: 'Tamano maximo de la frontera mantenida en memoria al mismo tiempo.',
        executionTime: 'Tiempo total para encontrar el resultado (en milisegundos).'
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
      algorithmCompleted: 'El algoritmo ya fue completado.',
      simulationCancelled: 'Simulacion cancelada.',
      simulationPaused: 'Simulacion pausada.',
      simulationResumed: 'Simulacion reanudada.',
      simulationError: 'Ocurrio un error durante la simulacion.'
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
