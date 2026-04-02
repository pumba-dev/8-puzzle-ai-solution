import type { IGameSetup } from '@/interfaces/IGameSetup'
import goalStateTemplate from '@/assets/goalStateTemplate'
import type IAlgorithmClass from '@/interfaces/IAlgorithmClass'
import type IStateExpansion from '@/interfaces/IStateExpansion'

class Node {
  state: IGameSetup
  parent: Node | null

  constructor(state: IGameSetup, parent: Node | null) {
    this.state = state
    this.parent = parent
  }
}

export default class BreadthFirstSearch implements IAlgorithmClass {
  private goalState: IGameSetup = goalStateTemplate
  private initialState: IGameSetup
  private visitedStates: Set<string> = new Set()
  private optimalPath: IGameSetup[] = []
  private maxNodesInSpace: number = 0
  private openNodes: number = 0
  private maxDepth: number = 0
  private solutionDepth: number = 0
  private generatedNodes: number = 0
  private executionTime: number = 0
  private searchQueue: Node[] = []
  private startTime: number = 0
  private algorithmEnd: boolean = false
  private lastExpansion: IStateExpansion | null = null

  constructor(initialState: IGameSetup) {
    this.initialState = initialState
  }

  private isGoalState(state: IGameSetup): boolean {
    return state.join('') === this.goalState.join('')
  }

  private getEmptyTileIndex(state: IGameSetup): number {
    return state.indexOf('0')
  }

  private generateNextStates(state: IGameSetup): IGameSetup[] {
    const emptyTileIndex = this.getEmptyTileIndex(state)
    const possibleMoves = this.getPossibleMoves(emptyTileIndex)

    return possibleMoves.map((move) => this.swapTiles([...state], emptyTileIndex, move))
  }

  private getPossibleMoves(emptyTileIndex: number): number[] {
    const possibleMoves = []

    if (emptyTileIndex % 3 !== 0) possibleMoves.push(emptyTileIndex - 1) // Left
    if (emptyTileIndex % 3 !== 2) possibleMoves.push(emptyTileIndex + 1) // Right
    if (emptyTileIndex >= 3) possibleMoves.push(emptyTileIndex - 3) // Up
    if (emptyTileIndex < 6) possibleMoves.push(emptyTileIndex + 3) // Down

    return possibleMoves
  }

  private swapTiles(state: IGameSetup, indexA: number, indexB: number): IGameSetup {
    const temp = state[indexA]
    state[indexA] = state[indexB]
    state[indexB] = temp
    return state
  }

  private getPathFromRoot(node: Node): IGameSetup[] {
    const path: IGameSetup[] = []

    let currentNode = <Node | null>node

    while (currentNode !== null) {
      path.unshift(currentNode.state)
      currentNode = currentNode.parent
    }

    return path
  }

  solve(): void {
    const startTime = performance.now()

    const queue: Node[] = [new Node(this.initialState, null)]

    while (queue.length > 0) {
      const currentNode = queue.shift()!
      const currentState = currentNode.state
      const currentStateString = currentState.join('')
      const depth = this.getPathFromRoot(currentNode).length

      if (this.isGoalState(currentState)) {
        this.solutionDepth = depth
        this.optimalPath = this.getPathFromRoot(currentNode)
        const endTime = performance.now()
        this.executionTime = endTime - startTime
        this.algorithmEnd = true
        return
      }

      if (!this.visitedStates.has(currentStateString)) {
        this.visitedStates.add(currentStateString)
        this.openNodes++
        this.maxDepth = Math.max(this.maxDepth, depth)

        const nextStates = this.generateNextStates(currentState)

        this.generatedNodes += nextStates.length

        for (const nextState of nextStates) {
          const nextStateString = nextState.join('')
          if (!this.visitedStates.has(nextStateString)) {
            queue.push(new Node(nextState, currentNode))
          }
        }

        this.maxNodesInSpace = Math.max(this.maxNodesInSpace, queue.length)
      }
    }

    const endTime = performance.now()
    this.executionTime = endTime - startTime

    this.algorithmEnd = true
    return
  }

  advanceOneStep(): IGameSetup | null {
    if (this.algorithmEnd) {
      return null
    }

    this.lastExpansion = null

    if (this.searchQueue.length === 0) {
      const startTime = performance.now()
      this.startTime = startTime

      this.searchQueue.push(new Node(this.initialState, null))
    }

    const currentNode = this.searchQueue.shift()

    if (!currentNode) {
      // Se não houver mais nós na fila, a busca está completa
      const endTime = performance.now()
      this.executionTime = endTime - this.startTime

      this.algorithmEnd = true
      return null
    }

    const currentState = currentNode.state
    const currentStateString = currentState.join('')
    const depth = this.getPathFromRoot(currentNode).length

    if (this.isGoalState(currentState)) {
      // Se o estado atual for o estado objetivo, a busca está concluída
      this.solutionDepth = depth
      this.optimalPath = this.getPathFromRoot(currentNode)
      const endTime = performance.now()
      this.executionTime = endTime - this.startTime
      this.algorithmEnd = true
      return currentState
    }

    if (!this.visitedStates.has(currentStateString)) {
      // Se o estado não foi visitado ainda
      this.visitedStates.add(currentStateString)
      this.openNodes++
      this.maxDepth = Math.max(this.maxDepth, depth)

      const nextStates = this.generateNextStates(currentState)
      const openedStates: IGameSetup[] = []

      this.generatedNodes += nextStates.length

      for (const nextState of nextStates) {
        const nextStateString = nextState.join('')
        if (!this.visitedStates.has(nextStateString)) {
          this.searchQueue.push(new Node(nextState, currentNode))
          openedStates.push([...nextState] as IGameSetup)
        }
      }

      this.lastExpansion = {
        parentState: [...currentState] as IGameSetup,
        openedStates
      }

      this.maxNodesInSpace = Math.max(this.maxNodesInSpace, this.searchQueue.length)

      return currentState
    }

    // Se o estado já foi visitado, avança para o próximo estado
    return this.advanceOneStep()
  }

  resetState(): void {
    this.visitedStates = new Set()
    this.optimalPath = []
    this.maxNodesInSpace = 0
    this.maxDepth = 0
    this.solutionDepth = 0
    this.generatedNodes = 0
    this.executionTime = 0
    this.searchQueue = []
    this.openNodes = 0
    this.startTime = 0
    this.algorithmEnd = false
    this.lastExpansion = null
  }

  getSearchQueue(): IGameSetup[] {
    return this.searchQueue.map((node) => node.state)
  }

  getOptimalPath(): IGameSetup[] {
    return this.optimalPath
  }

  getMaxNodesInSpace(): number {
    return this.maxNodesInSpace
  }

  getMaxDepth(): number {
    return this.maxDepth
  }

  getSolutionDepth(): number {
    return this.solutionDepth
  }

  getGeneratedNodesCount(): number {
    return this.generatedNodes
  }

  getExecutionTime(): number {
    return this.executionTime
  }

  getOpenNodesCount(): number {
    return this.openNodes
  }

  getLastExpansion(): IStateExpansion | null {
    return this.lastExpansion
  }

  isSolved(): boolean {
    return this.algorithmEnd
  }
}
