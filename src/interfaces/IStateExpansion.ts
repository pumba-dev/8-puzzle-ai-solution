import type { IGameSetup } from './IGameSetup'

export default interface IStateExpansion {
  parentState: IGameSetup
  openedStates: IGameSetup[]
}
