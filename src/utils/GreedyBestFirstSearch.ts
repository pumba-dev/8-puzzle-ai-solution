import type { IGameSetup } from '@/interfaces/IGameSetup'
import manhattanDistance from '@/utils/manhattanDistance'
import goalStateTemplate from '@/assets/goalStateTemplate'
import type IAlgorithmClass from '@/interfaces/IAlgorithmClass'
import { message } from 'ant-design-vue'
import { translate } from '@/i18n'

class Node {
  state: IGameSetup
  parent: Node | null
  heuristicValue: number

  constructor(state: IGameSetup, parent: Node | null) {
    this.state = state
    this.parent = parent
    this.heuristicValue = manhattanDistance(this.state)
  }
}

export default class GreedyBestFirstSearch implements IAlgorithmClass {
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
  private priorityQueue: Node[] = []
  private startTime: number = 0
  private algorithmEnd: boolean = false

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

    const priorityQueue: Node[] = [new Node(this.initialState, null)]

    while (priorityQueue.length > 0) {
      priorityQueue.sort((a, b) => a.heuristicValue - b.heuristicValue)

      const currentNode = priorityQueue.shift()!
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
            priorityQueue.push(new Node(nextState, currentNode))
          }
        }

        this.maxNodesInSpace = Math.max(this.maxNodesInSpace, priorityQueue.length)
      }
    }

    const endTime = performance.now()
    this.executionTime = endTime - startTime

    this.algorithmEnd = true
    message.error(translate('messages.noSolution'))
    return
  }

  resetState(): void {
    this.visitedStates = new Set()
    this.optimalPath = []
    this.maxNodesInSpace = 0
    this.maxDepth = 0
    this.solutionDepth = 0
    this.generatedNodes = 0
    this.executionTime = 0
    this.priorityQueue = []
    this.startTime = 0
    this.openNodes = 0
    this.algorithmEnd = false
  }

  advanceOneStep(): IGameSetup | null {
    if (this.algorithmEnd) {
      message.warning(translate('messages.algorithmCompleted'))
      return null
    }

    if (this.visitedStates.size === 0) {
      // Initialize the search
      const startTime = performance.now()
      this.priorityQueue.push(new Node(this.initialState, null))
      this.startTime = startTime
    }

    const currentNode = this.priorityQueue.shift()

    if (!currentNode) {
      const endTime = performance.now()
      this.executionTime = endTime - this.startTime

      this.algorithmEnd = true
      message.error(translate('messages.noSolution'))
      return null
    }

    const currentState = currentNode.state
    const currentStateString = currentState.join('')
    const depth = this.getPathFromRoot(currentNode).length

    if (this.isGoalState(currentState)) {
      this.solutionDepth = depth
      this.optimalPath = this.getPathFromRoot(currentNode)
      const endTime = performance.now()
      this.executionTime = endTime - this.startTime
      this.algorithmEnd = true
      return currentState
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
          this.priorityQueue.push(new Node(nextState, currentNode))
        }
      }

      this.priorityQueue.sort((a, b) => a.heuristicValue - b.heuristicValue)

      this.maxNodesInSpace = Math.max(this.maxNodesInSpace, this.priorityQueue.length)

      return currentState
    }

    return this.advanceOneStep()
  }

  getSearchQueue(): IGameSetup[] {
    return this.priorityQueue.map((node) => node.state)
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

  isSolved(): boolean {
    return this.algorithmEnd
  }
}
