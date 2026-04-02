import type { IGameSetup } from '@/interfaces/IGameSetup'
import type IStateExpansion from '@/interfaces/IStateExpansion'

export type SolverAlgorithm = 'bfs' | 'dfs' | 'gs' | 'a*'

export interface StartSimulationMessage {
  type: 'START_SIMULATION'
  payload: {
    runId: number
    algorithm: SolverAlgorithm
    initialState: IGameSetup
    borderWindowSize: number
    progressIntervalMs: number
    minimumSimulationDurationMs: number
  }
}

export interface CancelSimulationMessage {
  type: 'CANCEL_SIMULATION'
  payload: {
    runId: number
  }
}

export interface PauseSimulationMessage {
  type: 'PAUSE_SIMULATION'
  payload: {
    runId: number
  }
}

export interface ResumeSimulationMessage {
  type: 'RESUME_SIMULATION'
  payload: {
    runId: number
  }
}

export type SolverWorkerRequest =
  | StartSimulationMessage
  | CancelSimulationMessage
  | PauseSimulationMessage
  | ResumeSimulationMessage

export interface WorkerStateExpansion extends IStateExpansion {
  tick: number
}

export interface ProgressMessage {
  type: 'PROGRESS'
  payload: {
    runId: number
    tick: number
    borderStates: IGameSetup[]
    expansions: WorkerStateExpansion[]
    generatedNodes: number
    openNodes: number
    maxDepth: number
    maxStateBorder: number
    elapsedMs: number
  }
}

export interface CompleteMessage {
  type: 'COMPLETE'
  payload: {
    runId: number
    solved: boolean
    path: IGameSetup[]
    generatedNodes: number
    openNodes: number
    maxDepth: number
    maxStateBorder: number
    executionTime: number
  }
}

export interface CancelledMessage {
  type: 'CANCELLED'
  payload: {
    runId: number
  }
}

export interface PausedMessage {
  type: 'PAUSED'
  payload: {
    runId: number
  }
}

export interface ResumedMessage {
  type: 'RESUMED'
  payload: {
    runId: number
  }
}

export interface ErrorMessage {
  type: 'ERROR'
  payload: {
    runId: number
    messageKey: 'messages.simulationError'
  }
}

export type SolverWorkerResponse =
  | ProgressMessage
  | CompleteMessage
  | CancelledMessage
  | PausedMessage
  | ResumedMessage
  | ErrorMessage
