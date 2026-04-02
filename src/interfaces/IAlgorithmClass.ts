import type { IGameSetup } from './IGameSetup'
import type IStateExpansion from './IStateExpansion'

export default interface IAlgorithmClass {
  solve(): void
  resetState(): void
  isSolved(): boolean
  advanceOneStep(): IGameSetup | null
  getSearchQueue(): IGameSetup[]
  getOptimalPath(): IGameSetup[]
  getMaxNodesInSpace(): number
  getMaxDepth(): number
  getSolutionDepth(): number
  getGeneratedNodesCount(): number
  getOpenNodesCount(): number
  getExecutionTime(): number
  getLastExpansion(): IStateExpansion | null
}
