/// <reference lib="webworker" />

import BreadthFirstSearch from '@/utils/BreadthFirstSearch'
import DepthFirstSearch from '@/utils/DepthFirstSearch'
import GreedyBestFirstSearch from '@/utils/GreedyBestFirstSearch'
import AStarSearch from '@/utils/AStarSearch'

import type IAlgorithmClass from '@/interfaces/IAlgorithmClass'
import type { IGameSetup } from '@/interfaces/IGameSetup'
import type { SolverAlgorithm } from './workerProtocol'
import type { WorkerStateExpansion } from './workerProtocol'
import type { SolverWorkerRequest, SolverWorkerResponse } from './workerProtocol'

let activeRunId = 0
const cancelledRuns = new Set<number>()
const pausedRuns = new Set<number>()
const pauseNotifiedRuns = new Set<number>()

function createAlgorithm(algorithm: SolverAlgorithm, initialState: IGameSetup): IAlgorithmClass {
  switch (algorithm) {
    case 'bfs':
      return new BreadthFirstSearch(initialState)
    case 'dfs':
      return new DepthFirstSearch(initialState)
    case 'gs':
      return new GreedyBestFirstSearch(initialState)
    case 'a*':
      return new AStarSearch(initialState)
    default:
      throw new Error('Unknown algorithm')
  }
}

function postMessageToMain(message: SolverWorkerResponse) {
  self.postMessage(message)
}

function runSimulation(
  runId: number,
  algorithmInstance: IAlgorithmClass,
  borderWindowSize: number,
  progressIntervalMs: number,
  minimumSimulationDurationMs: number,
  startedAt: number
) {
  const stepsPerChunk = 400
  const safeProgressIntervalMs = Math.max(16, progressIntervalMs)
  const safeMinimumSimulationDurationMs = Math.max(2000, minimumSimulationDurationMs)
  const expansionHistory: WorkerStateExpansion[] = []
  let expansionTick = 0
  let tick = 0

  const processChunk = () => {
    if (activeRunId !== runId || cancelledRuns.has(runId)) {
      postMessageToMain({
        type: 'CANCELLED',
        payload: { runId }
      })
      cancelledRuns.delete(runId)
      pausedRuns.delete(runId)
      pauseNotifiedRuns.delete(runId)
      return
    }

    if (pausedRuns.has(runId)) {
      if (!pauseNotifiedRuns.has(runId)) {
        pauseNotifiedRuns.add(runId)

        postMessageToMain({
          type: 'PAUSED',
          payload: { runId }
        })
      }

      setTimeout(processChunk, safeProgressIntervalMs)
      return
    }

    if (pauseNotifiedRuns.has(runId)) {
      pauseNotifiedRuns.delete(runId)

      postMessageToMain({
        type: 'RESUMED',
        payload: { runId }
      })
    }

    let steps = 0

    while (steps < stepsPerChunk && !algorithmInstance.isSolved()) {
      algorithmInstance.advanceOneStep()

      const expansion = algorithmInstance.getLastExpansion()
      if (expansion) {
        expansionTick++
        expansionHistory.push({
          tick: expansionTick,
          parentState: [...expansion.parentState] as IGameSetup,
          openedStates: expansion.openedStates.map((state) => [...state] as IGameSetup)
        })

        if (expansionHistory.length > borderWindowSize) {
          expansionHistory.shift()
        }
      }

      steps++

      if (activeRunId !== runId || cancelledRuns.has(runId)) {
        break
      }
    }

    tick++

    const queueStates = algorithmInstance.getSearchQueue()
    const borderStates = queueStates.slice(Math.max(0, queueStates.length - borderWindowSize))

    postMessageToMain({
      type: 'PROGRESS',
      payload: {
        runId,
        tick,
        borderStates,
        expansions: [...expansionHistory],
        generatedNodes: algorithmInstance.getGeneratedNodesCount(),
        openNodes: algorithmInstance.getOpenNodesCount(),
        maxDepth: algorithmInstance.getMaxDepth(),
        maxStateBorder: algorithmInstance.getMaxNodesInSpace(),
        elapsedMs: performance.now() - startedAt
      }
    })

    if (activeRunId !== runId || cancelledRuns.has(runId)) {
      postMessageToMain({
        type: 'CANCELLED',
        payload: { runId }
      })
      cancelledRuns.delete(runId)
      pausedRuns.delete(runId)
      pauseNotifiedRuns.delete(runId)
      return
    }

    if (algorithmInstance.isSolved()) {
      const path = algorithmInstance.getOptimalPath()
      const algorithmExecutionTime =
        algorithmInstance.getExecutionTime() || performance.now() - startedAt
      const elapsedMs = performance.now() - startedAt
      const remainingTime = Math.max(0, safeMinimumSimulationDurationMs - elapsedMs)

      setTimeout(() => {
        if (activeRunId !== runId || cancelledRuns.has(runId)) {
          postMessageToMain({
            type: 'CANCELLED',
            payload: { runId }
          })
          cancelledRuns.delete(runId)
          pausedRuns.delete(runId)
          pauseNotifiedRuns.delete(runId)
          return
        }

        postMessageToMain({
          type: 'COMPLETE',
          payload: {
            runId,
            solved: path.length > 0,
            path,
            generatedNodes: algorithmInstance.getGeneratedNodesCount(),
            openNodes: algorithmInstance.getOpenNodesCount(),
            maxDepth: algorithmInstance.getMaxDepth(),
            maxStateBorder: algorithmInstance.getMaxNodesInSpace(),
            executionTime: Math.max(algorithmExecutionTime, safeMinimumSimulationDurationMs)
          }
        })

        pausedRuns.delete(runId)
        pauseNotifiedRuns.delete(runId)
      }, remainingTime)

      return
    }

    setTimeout(processChunk, safeProgressIntervalMs)
  }

  setTimeout(processChunk, safeProgressIntervalMs)
}

self.onmessage = (event: MessageEvent<SolverWorkerRequest>) => {
  const message = event.data

  if (message.type === 'CANCEL_SIMULATION') {
    cancelledRuns.add(message.payload.runId)
    pausedRuns.delete(message.payload.runId)
    pauseNotifiedRuns.delete(message.payload.runId)
    return
  }

  if (message.type === 'PAUSE_SIMULATION') {
    pausedRuns.add(message.payload.runId)
    return
  }

  if (message.type === 'RESUME_SIMULATION') {
    pausedRuns.delete(message.payload.runId)
    return
  }

  try {
    const {
      runId,
      algorithm,
      initialState,
      borderWindowSize,
      progressIntervalMs,
      minimumSimulationDurationMs
    } = message.payload

    activeRunId = runId
    cancelledRuns.delete(runId)
    pausedRuns.delete(runId)
    pauseNotifiedRuns.delete(runId)

    const algorithmInstance = createAlgorithm(algorithm, initialState)

    runSimulation(
      runId,
      algorithmInstance,
      borderWindowSize,
      progressIntervalMs,
      minimumSimulationDurationMs,
      performance.now()
    )
  } catch {
    postMessageToMain({
      type: 'ERROR',
      payload: {
        runId: message.payload.runId,
        messageKey: 'messages.simulationError'
      }
    })
  }
}
