<template>
  <a-layout class="play-layout">
    <a-layout-header class="play-layout__header">
      <div class="header__title">
        <img src="@/assets/puzzle-icon.svg" />
        <h1>{{ t('play.title') }}</h1>
      </div>

      <div class="header__actions">
        <a-button @click="goToSimulation" class="header__button">
          {{ t('app.menu.simulation') }}
        </a-button>

        <a-select v-model:value="locale" class="header__language-select" size="small">
          <a-select-option
            :key="localeOption.value"
            :value="localeOption.value"
            v-for="localeOption in localeOptions"
          >
            {{ localeOption.label }}
          </a-select-option>
        </a-select>
      </div>
    </a-layout-header>

    <a-layout-content class="play-layout__content">
      <section class="play-panel">
        <div class="play-panel__intro">
          <div>
            <h2>{{ t('play.subtitle') }}</h2>
            <p>
              {{
                t('play.currentDifficulty', {
                  difficulty: t(`play.difficulty.${difficulty}`)
                })
              }}
            </p>
          </div>

          <a-radio-group
            v-model:value="difficulty"
            class="play-panel__difficulty-group"
            button-style="solid"
          >
            <a-radio-button
              :key="option.value"
              :value="option.value"
              v-for="option in difficultyOptions"
            >
              {{ option.label }}
            </a-radio-button>
          </a-radio-group>
        </div>

        <div class="play-panel__live-stats" aria-live="polite">
          <span>{{ t('play.stats.moves') }}: {{ movesCount }}</span>
          <span>{{ t('play.stats.time') }}: {{ formattedElapsedTime }}</span>
          <span>{{ t('play.stats.hintsUsed') }}: {{ hintsUsed }}</span>
          <span>{{ t('play.stats.bestTime') }}: {{ formattedBestTime }}</span>
          <span>
            {{ t('play.stats.optimalMoves') }}:
            {{ isOptimalLoading ? t('play.optimalLoading') : formattedOptimalMoves }}
          </span>
        </div>

        <div class="play-panel__board-wrapper">
          <TransitionGroup name="board-move" tag="div" class="play-board">
            <button
              :aria-label="
                tile === '0'
                  ? t('play.board.emptyTileAriaLabel')
                  : t('play.board.tileAriaLabel', { tile })
              "
              :class="{
                '--empty': tile === '0',
                '--movable': canMoveTile(index),
                '--hint': hintTileIndex === index,
                '--drop-target': isDropTarget(index),
                '--dragging': draggedTileIndex === index,
                '--locked': !canMoveTile(index) || gameStatus === 'won'
              }"
              :draggable="canMoveTile(index) && gameStatus !== 'won'"
              :key="`play-tile-${tile}`"
              class="play-board__tile"
              type="button"
              @click="handleTileClick(index)"
              @dragend="handleDragEnd"
              @dragenter="handleDragEnter(index)"
              @dragleave="handleDragLeave(index)"
              @dragover="handleDragOver(index, $event)"
              @dragstart="handleDragStart(index, $event)"
              @drop="handleDropOnTile(index, $event)"
              v-for="(tile, index) in currentBoard"
            >
              <span>{{ tile === '0' ? '' : tile }}</span>
            </button>
          </TransitionGroup>
        </div>

        <div class="play-panel__actions">
          <a-button @click="handleRequestHint" :disabled="gameStatus === 'won'">
            {{ t('play.actions.hint') }}
          </a-button>
          <a-button @click="handleRestartGame">{{ t('play.actions.restart') }}</a-button>
          <a-button type="primary" @click="handleNewGame">{{
            t('play.actions.generateInitial')
          }}</a-button>
        </div>

        <p class="play-panel__status" v-if="gameStatus !== 'won'">{{ currentStatusText }}</p>

        <Transition name="victory-reveal">
          <section class="victory-panel" v-if="gameStatus === 'won'">
            <div class="victory-panel__confetti" aria-hidden="true">
              <span
                :key="piece.id"
                class="victory-panel__confetti-piece"
                :style="{
                  '--left': piece.left,
                  '--delay': piece.delay,
                  '--duration': piece.duration,
                  '--color': piece.color
                }"
                v-for="piece in confettiPieces"
              ></span>
            </div>

            <div class="victory-panel__header">
              <h3>{{ t('play.victory.title') }}</h3>
              <p>{{ t('play.victory.subtitle') }}</p>
            </div>

            <div class="victory-panel__stats-grid">
              <article class="victory-stat">
                <h4>{{ t('play.stats.moves') }}</h4>
                <strong>{{ movesCount }}</strong>
              </article>
              <article class="victory-stat">
                <h4>{{ t('play.stats.time') }}</h4>
                <strong>{{ formattedElapsedTime }}</strong>
              </article>
              <article class="victory-stat">
                <h4>{{ t('play.stats.optimalMoves') }}</h4>
                <strong>{{ formattedOptimalMoves }}</strong>
              </article>
              <article class="victory-stat">
                <h4>{{ t('play.stats.efficiency') }}</h4>
                <strong>{{ formattedEfficiency }}</strong>
              </article>
              <article class="victory-stat">
                <h4>{{ t('play.stats.hintsUsed') }}</h4>
                <strong>{{ hintsUsed }}</strong>
              </article>
              <article class="victory-stat">
                <h4>{{ t('play.stats.bestTime') }}</h4>
                <strong>{{ formattedBestTime }}</strong>
              </article>
            </div>

            <div class="victory-panel__actions">
              <a-button @click="handleRestartGame">{{ t('play.actions.restart') }}</a-button>
              <a-button type="primary" @click="handleNewGame">{{
                t('play.actions.newChallenge')
              }}</a-button>
            </div>
          </section>
        </Transition>
      </section>
    </a-layout-content>

    <a-layout-footer class="play-layout__footer" @click="handleOpenWebsite">
      {{ t('app.footer') }}
    </a-layout-footer>
  </a-layout>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { message } from 'ant-design-vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

import type { IGameSetup } from '@/interfaces/IGameSetup'
import type { AppLocale } from '@/i18n'
import type { SolverWorkerRequest, SolverWorkerResponse } from '@/workers/workerProtocol'

import goalStateTemplate from '@/assets/goalStateTemplate'
import isSolvable from '@/utils/isSolvable'
import manhattanDistance from '@/utils/manhattanDistance'

type DifficultyLevel = 'easy' | 'medium' | 'hard'
type GameStatus = 'idle' | 'playing' | 'won'

interface BestTimesByDifficulty {
  easy: number | null
  medium: number | null
  hard: number | null
}

const BEST_TIMES_STORAGE_KEY = '8-puzzle-best-times-by-difficulty-v1'
const shuffleMovesByDifficulty: Record<DifficultyLevel, number> = {
  easy: 12,
  medium: 28,
  hard: 44
}

const confettiPalette = ['#f97171', '#55c3ff', '#ffc857', '#7ddf8f', '#9a8cff', '#ff9f40']
const confettiPieces = Array.from({ length: 28 }, (_, index) => ({
  id: index,
  left: `${(index * 13) % 100}%`,
  delay: `${(index % 7) * 0.09}s`,
  duration: `${1.45 + (index % 5) * 0.2}s`,
  color: confettiPalette[index % confettiPalette.length]
}))

const { t, locale } = useI18n()
const router = useRouter()

const difficulty = ref<DifficultyLevel>('easy')
const gameStatus = ref<GameStatus>('idle')
const initialBoard = ref<IGameSetup>([...goalStateTemplate] as IGameSetup)
const currentBoard = ref<IGameSetup>([...goalStateTemplate] as IGameSetup)
const movesCount = ref(0)
const hintsUsed = ref(0)
const hintTileIndex = ref<number | null>(null)
const draggedTileIndex = ref<number | null>(null)
const dropTargetIndex = ref<number | null>(null)
const elapsedMs = ref(0)
const bestTimesByDifficulty = ref<BestTimesByDifficulty>({
  easy: null,
  medium: null,
  hard: null
})
const optimalMoves = ref<number | null>(null)
const isOptimalLoading = ref(false)

const optimalWorker = ref<Worker | null>(null)
const optimalRunId = ref(0)
let timerIntervalId: number | null = null
let timerStartMs: number | null = null

const localeOptions = computed(() => [
  {
    value: 'pt-BR' as AppLocale,
    label: t('app.language.ptBR')
  },
  {
    value: 'es-ES' as AppLocale,
    label: t('app.language.esES')
  },
  {
    value: 'en-EU' as AppLocale,
    label: t('app.language.enEU')
  }
])

const difficultyOptions = computed(() => [
  {
    value: 'easy' as DifficultyLevel,
    label: t('play.difficulty.easy')
  },
  {
    value: 'medium' as DifficultyLevel,
    label: t('play.difficulty.medium')
  },
  {
    value: 'hard' as DifficultyLevel,
    label: t('play.difficulty.hard')
  }
])

const bestTimeForCurrentDifficulty = computed(() => bestTimesByDifficulty.value[difficulty.value])

const formattedBestTime = computed(() => {
  if (!bestTimeForCurrentDifficulty.value) {
    return t('play.notAvailable')
  }

  return formatDuration(bestTimeForCurrentDifficulty.value)
})

const formattedElapsedTime = computed(() => formatDuration(elapsedMs.value))

const formattedOptimalMoves = computed(() => {
  if (isOptimalLoading.value) {
    return t('play.optimalLoading')
  }

  if (optimalMoves.value === null) {
    return t('play.notAvailable')
  }

  return optimalMoves.value.toString()
})

const efficiencyPercentage = computed(() => {
  if (optimalMoves.value === null || movesCount.value <= 0) {
    return null
  }

  return Math.min(100, (optimalMoves.value / movesCount.value) * 100)
})

const formattedEfficiency = computed(() => {
  if (efficiencyPercentage.value === null) {
    return t('play.notAvailable')
  }

  return `${efficiencyPercentage.value.toFixed(1)}%`
})

const currentStatusText = computed(() => {
  if (gameStatus.value === 'idle') {
    return t('play.status.idle')
  }

  if (gameStatus.value === 'playing') {
    return t('play.status.playing')
  }

  return t('play.status.won')
})

function formatDuration(durationInMs: number) {
  const safeDuration = Math.max(0, durationInMs)
  const totalSeconds = Math.floor(safeDuration / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  const tenths = Math.floor((safeDuration % 1000) / 100)

  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${tenths}`
}

function isGoalState(state: IGameSetup) {
  return state.join('') === goalStateTemplate.join('')
}

function getEmptyTileIndex(state: IGameSetup) {
  return state.indexOf('0')
}

function getAdjacentIndices(emptyTileIndex: number): number[] {
  const adjacentIndices: number[] = []

  if (emptyTileIndex % 3 !== 0) {
    adjacentIndices.push(emptyTileIndex - 1)
  }

  if (emptyTileIndex % 3 !== 2) {
    adjacentIndices.push(emptyTileIndex + 1)
  }

  if (emptyTileIndex >= 3) {
    adjacentIndices.push(emptyTileIndex - 3)
  }

  if (emptyTileIndex < 6) {
    adjacentIndices.push(emptyTileIndex + 3)
  }

  return adjacentIndices
}

function swapTiles(state: IGameSetup, indexA: number, indexB: number) {
  const nextState = [...state] as IGameSetup
  const temporaryValue = nextState[indexA]
  nextState[indexA] = nextState[indexB]
  nextState[indexB] = temporaryValue

  return nextState
}

function areBoardsEqual(leftBoard: IGameSetup, rightBoard: IGameSetup) {
  return leftBoard.join('') === rightBoard.join('')
}

function createRandomSolvableBoard(excludedBoard?: IGameSetup) {
  const values = ['0', '1', '2', '3', '4', '5', '6', '7', '8'] as const
  let candidate = [...values] as IGameSetup

  do {
    candidate = [...values] as IGameSetup

    for (let index = candidate.length - 1; index > 0; index--) {
      const randomIndex = Math.floor(Math.random() * (index + 1))
      const currentValue = candidate[index]
      candidate[index] = candidate[randomIndex]
      candidate[randomIndex] = currentValue
    }
  } while (
    !isSolvable(candidate) ||
    isGoalState(candidate) ||
    (excludedBoard ? areBoardsEqual(candidate, excludedBoard) : false)
  )

  return candidate
}

function createGameBoardByDifficulty(level: DifficultyLevel, excludedBoard?: IGameSetup) {
  const maxAttempts = 30
  const shuffleMoves = shuffleMovesByDifficulty[level]

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    let state = [...goalStateTemplate] as IGameSetup
    let previousEmptyTileIndex = -1

    for (let move = 0; move < shuffleMoves; move++) {
      const emptyTileIndex = getEmptyTileIndex(state)
      const moveCandidates = getAdjacentIndices(emptyTileIndex)
      const filteredCandidates = moveCandidates.filter(
        (candidate) => candidate !== previousEmptyTileIndex
      )
      const validCandidates = filteredCandidates.length ? filteredCandidates : moveCandidates
      const selectedTileIndex = validCandidates[Math.floor(Math.random() * validCandidates.length)]

      state = swapTiles(state, emptyTileIndex, selectedTileIndex)
      previousEmptyTileIndex = emptyTileIndex
    }

    if (!isGoalState(state) && (!excludedBoard || !areBoardsEqual(state, excludedBoard))) {
      return state
    }
  }

  return createRandomSolvableBoard(excludedBoard)
}

function createOptimalWorkerIfNeeded() {
  if (optimalWorker.value) {
    return
  }

  optimalWorker.value = new Worker(
    new URL('../../workers/puzzleSolver.worker.ts', import.meta.url),
    {
      type: 'module'
    }
  )

  optimalWorker.value.onmessage = (event: MessageEvent<SolverWorkerResponse>) => {
    handleOptimalWorkerMessage(event.data)
  }

  optimalWorker.value.onerror = () => {
    isOptimalLoading.value = false
    optimalMoves.value = null
  }
}

function handleOptimalWorkerMessage(workerMessage: SolverWorkerResponse) {
  if (workerMessage.payload.runId !== optimalRunId.value) {
    return
  }

  if (workerMessage.type === 'COMPLETE') {
    isOptimalLoading.value = false
    optimalMoves.value = workerMessage.payload.solved
      ? Math.max(0, workerMessage.payload.path.length - 1)
      : null
    return
  }

  if (workerMessage.type === 'CANCELLED' || workerMessage.type === 'ERROR') {
    isOptimalLoading.value = false
    optimalMoves.value = null
  }
}

function requestOptimalPath(startState: IGameSetup) {
  createOptimalWorkerIfNeeded()

  optimalRunId.value += 1
  isOptimalLoading.value = true
  optimalMoves.value = null

  const workerMessage: SolverWorkerRequest = {
    type: 'START_SIMULATION',
    payload: {
      runId: optimalRunId.value,
      algorithm: 'a*',
      initialState: [...startState] as IGameSetup,
      borderWindowSize: 6,
      progressIntervalMs: 100,
      minimumSimulationDurationMs: 0
    }
  }

  optimalWorker.value?.postMessage(workerMessage)
}

function cancelOptimalPathRun() {
  if (!optimalWorker.value) {
    return
  }

  const workerMessage: SolverWorkerRequest = {
    type: 'CANCEL_SIMULATION',
    payload: {
      runId: optimalRunId.value
    }
  }

  optimalWorker.value.postMessage(workerMessage)
  isOptimalLoading.value = false
}

function stopTimer() {
  if (timerIntervalId !== null) {
    window.clearInterval(timerIntervalId)
    timerIntervalId = null
  }
}

function resetTimer() {
  stopTimer()
  elapsedMs.value = 0
  timerStartMs = null
}

function startTimerIfNeeded() {
  if (timerIntervalId !== null) {
    return
  }

  timerStartMs = Date.now() - elapsedMs.value

  timerIntervalId = window.setInterval(() => {
    if (timerStartMs !== null) {
      elapsedMs.value = Date.now() - timerStartMs
    }
  }, 100)
}

function resetGameState() {
  gameStatus.value = 'idle'
  movesCount.value = 0
  hintsUsed.value = 0
  hintTileIndex.value = null
  draggedTileIndex.value = null
  dropTargetIndex.value = null
  resetTimer()
}

function handleNewGame() {
  cancelOptimalPathRun()

  const newBoard = createGameBoardByDifficulty(difficulty.value, initialBoard.value)

  initialBoard.value = [...newBoard] as IGameSetup
  currentBoard.value = [...newBoard] as IGameSetup

  resetGameState()
  requestOptimalPath(initialBoard.value)
}

function handleRestartGame() {
  currentBoard.value = [...initialBoard.value] as IGameSetup
  resetGameState()
}

function canMoveTile(index: number) {
  if (currentBoard.value[index] === '0') {
    return false
  }

  const emptyTileIndex = getEmptyTileIndex(currentBoard.value)
  return getAdjacentIndices(emptyTileIndex).includes(index)
}

function canDropOnIndex(index: number) {
  if (draggedTileIndex.value === null || gameStatus.value === 'won') {
    return false
  }

  const isEmptyTarget = currentBoard.value[index] === '0'

  if (!isEmptyTarget) {
    return false
  }

  return canMoveTile(draggedTileIndex.value)
}

function isDropTarget(index: number) {
  return dropTargetIndex.value === index && canDropOnIndex(index)
}

function performMove(tileIndex: number) {
  if (!canMoveTile(tileIndex) || gameStatus.value === 'won') {
    return false
  }

  if (gameStatus.value === 'idle') {
    gameStatus.value = 'playing'
    startTimerIfNeeded()
  }

  hintTileIndex.value = null

  const emptyTileIndex = getEmptyTileIndex(currentBoard.value)
  currentBoard.value = swapTiles(currentBoard.value, emptyTileIndex, tileIndex)
  movesCount.value += 1

  if (isGoalState(currentBoard.value)) {
    gameStatus.value = 'won'
    stopTimer()
    updateBestTimeIfNeeded()
    message.success(t('play.victory.toast'))
  }

  return true
}

function handleTileClick(index: number) {
  performMove(index)
}

function handleDragStart(index: number, event: DragEvent) {
  if (!canMoveTile(index) || gameStatus.value === 'won') {
    event.preventDefault()
    return
  }

  draggedTileIndex.value = index
  dropTargetIndex.value = getEmptyTileIndex(currentBoard.value)

  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('text/plain', String(index))
  }
}

function handleDragOver(index: number, event: DragEvent) {
  if (!canDropOnIndex(index)) {
    return
  }

  event.preventDefault()
  dropTargetIndex.value = index
}

function handleDropOnTile(index: number, event: DragEvent) {
  if (!canDropOnIndex(index) || draggedTileIndex.value === null) {
    return
  }

  event.preventDefault()
  performMove(draggedTileIndex.value)
  handleDragEnd()
}

function handleDragEnter(index: number) {
  if (!canDropOnIndex(index)) {
    return
  }

  dropTargetIndex.value = index
}

function handleDragLeave(index: number) {
  if (dropTargetIndex.value === index) {
    dropTargetIndex.value = getEmptyTileIndex(currentBoard.value)
  }
}

function handleDragEnd() {
  draggedTileIndex.value = null
  dropTargetIndex.value = null
}

function handleRequestHint() {
  if (gameStatus.value === 'won') {
    return
  }

  const emptyTileIndex = getEmptyTileIndex(currentBoard.value)
  const legalMoves = getAdjacentIndices(emptyTileIndex)

  if (!legalMoves.length) {
    return
  }

  const bestHint = legalMoves
    .map((tileIndex) => {
      const nextState = swapTiles(currentBoard.value, emptyTileIndex, tileIndex)

      return {
        tileIndex,
        score: manhattanDistance(nextState)
      }
    })
    .sort((left, right) => left.score - right.score)[0]

  hintTileIndex.value = bestHint.tileIndex
  hintsUsed.value += 1

  const tileValue = currentBoard.value[bestHint.tileIndex]
  message.info(t('play.hintMessage', { tile: tileValue }))
}

function loadBestTimes() {
  if (typeof localStorage === 'undefined') {
    return
  }

  try {
    const rawBestTimes = localStorage.getItem(BEST_TIMES_STORAGE_KEY)

    if (!rawBestTimes) {
      return
    }

    const parsedBestTimes = JSON.parse(rawBestTimes) as Partial<BestTimesByDifficulty>
    const normalizeValue = (value: unknown) =>
      typeof value === 'number' && Number.isFinite(value) && value > 0 ? value : null

    bestTimesByDifficulty.value = {
      easy: normalizeValue(parsedBestTimes.easy),
      medium: normalizeValue(parsedBestTimes.medium),
      hard: normalizeValue(parsedBestTimes.hard)
    }
  } catch {
    bestTimesByDifficulty.value = {
      easy: null,
      medium: null,
      hard: null
    }
  }
}

function persistBestTimes() {
  if (typeof localStorage === 'undefined') {
    return
  }

  localStorage.setItem(BEST_TIMES_STORAGE_KEY, JSON.stringify(bestTimesByDifficulty.value))
}

function updateBestTimeIfNeeded() {
  const currentBestTime = bestTimesByDifficulty.value[difficulty.value]

  if (currentBestTime === null || elapsedMs.value < currentBestTime) {
    bestTimesByDifficulty.value = {
      ...bestTimesByDifficulty.value,
      [difficulty.value]: elapsedMs.value
    }

    persistBestTimes()
  }
}

function goToSimulation() {
  router.push('/solver')
}

function handleOpenWebsite() {
  window.open('https://pumbadev.com', '_blank')
}

watch(difficulty, () => {
  handleNewGame()
})

onMounted(() => {
  loadBestTimes()
  handleNewGame()
})

onBeforeUnmount(() => {
  stopTimer()
  cancelOptimalPathRun()
  optimalWorker.value?.terminate()
  optimalWorker.value = null
})
</script>

<style scoped lang="scss">
.play-layout {
  min-height: 100vh;
  width: 100%;

  display: flex;
  flex-direction: column;

  .play-layout__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;

    min-height: 74px;
    height: auto;
    padding: 10px clamp(10px, 2vw, 26px);

    position: sticky;
    top: 0;
    z-index: 30;

    background: linear-gradient(120deg, #0f2a4b 0%, #184273 62%, #0d5ea9 100%);
    border-bottom: 1px solid rgba(255, 255, 255, 0.18);
    box-shadow: 0 10px 24px rgba(8, 25, 46, 0.2);

    .header__title {
      display: flex;
      align-items: center;
      gap: 10px;

      img {
        width: 24px;
        height: 24px;
        padding: 6px;
        border-radius: 10px;
        background: rgba(255, 255, 255, 0.18);
        border: 1px solid rgba(255, 255, 255, 0.36);
      }

      h1 {
        margin: 0;
        color: #fff;
        font-size: 18px;
        line-height: 1.2;
      }
    }

    .header__actions {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 0;
      border: none;
      background: transparent;

      .header__button {
        border: none;
        color: #fff;
        border-radius: 999px;
        font-weight: 600;
        background: rgba(255, 255, 255, 0.16);

        &:hover {
          color: #fff;
          background: rgba(255, 255, 255, 0.28);
        }
      }

      .header__language-select {
        width: 172px;

        :deep(.ant-select-selector) {
          border-radius: 999px !important;
          border-color: rgba(255, 255, 255, 0.22) !important;
          background: rgba(255, 255, 255, 0.14) !important;
          min-height: 34px;
          display: flex;
          align-items: center;
        }

        :deep(.ant-select-selection-item) {
          color: #fff;
          font-weight: 600;
        }

        :deep(.ant-select-arrow) {
          color: #fff;
        }
      }
    }

    @media (max-width: 640px) {
      flex-wrap: wrap;
      justify-content: center;
      gap: 8px;
      padding: 8px 10px;

      .header__title {
        width: 100%;
        justify-content: center;

        h1 {
          font-size: 16px;
          text-align: center;
        }
      }

      .header__actions {
        width: 100%;
        justify-content: center;

        .header__language-select {
          width: min(160px, 62vw);
        }
      }
    }
  }

  .play-layout__content {
    width: 100%;
    padding: 16px;

    @media (max-width: 768px) {
      padding: 12px;
    }

    @media (max-width: 425px) {
      padding: 10px;
    }

    .play-panel {
      width: min(900px, 100%);
      margin: 0 auto;

      display: flex;
      flex-direction: column;
      gap: 16px;
      align-items: center;

      .play-panel__intro {
        width: 100%;
        border: 1px solid #bfdaf8;
        border-radius: 12px;
        background: linear-gradient(135deg, #f3f8ff 0%, #e9f2ff 100%);
        padding: 12px;

        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;

        h2 {
          margin: 0;
          font-size: 22px;
        }

        p {
          margin: 4px 0 0;
          color: #355f8f;
          font-weight: 500;
        }

        .play-panel__difficulty-group {
          :deep(.ant-radio-button-wrapper) {
            font-weight: 600;
          }
        }

        @media (max-width: 760px) {
          flex-direction: column;
          align-items: stretch;

          .play-panel__difficulty-group {
            display: flex;
            justify-content: center;
          }
        }
      }

      .play-panel__live-stats {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        justify-content: center;

        span {
          font-size: 12px;
          border: 1px solid #c6daf0;
          background: #eef6ff;
          color: #1d3f6d;
          border-radius: 999px;
          padding: 4px 8px;
        }
      }

      .play-panel__board-wrapper {
        width: 100%;
        display: flex;
        justify-content: center;
      }

      .play-board {
        background: #6d3a3a;
        border: 2px solid #402121;
        border-radius: 14px;
        padding: 10px;

        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 4px;

        .play-board__tile {
          width: 64px;
          height: 64px;
          border: 1px solid #2e2e2e;
          background: #f3f3f3;
          display: flex;
          align-items: center;
          justify-content: center;
          transition:
            transform 0.16s ease,
            box-shadow 0.16s ease,
            background-color 0.16s ease;

          span {
            font-size: 30px;
            font-weight: 600;
            line-height: 1;
            color: #1a1a1a;
          }

          &.--empty {
            background: #9e7a4b;
            cursor: default;
          }

          &.--movable {
            cursor: pointer;

            &:hover {
              transform: translateY(-1px);
              box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
            }
          }

          &.--dragging {
            opacity: 0.45;
          }

          &.--drop-target {
            outline: 2px dashed #68a9f0;
            outline-offset: -4px;
          }

          &.--hint {
            outline: 2px solid #1677ff;
            animation: hint-pulse 1s ease-in-out infinite;
          }

          &.--locked {
            opacity: 0.85;
          }
        }
      }

      .play-panel__actions {
        width: 100%;
        display: flex;
        gap: 10px;
        justify-content: center;
        flex-wrap: wrap;
      }

      .play-panel__status {
        margin: 0;
        color: #3b3b3b;
        font-weight: 500;
      }

      .victory-panel {
        width: 100%;
        border: 1px solid #bde5c8;
        border-radius: 14px;
        background: linear-gradient(180deg, #f5fff7 0%, #ebfaef 100%);
        padding: 14px;
        position: relative;
        overflow: hidden;

        display: flex;
        flex-direction: column;
        gap: 12px;

        .victory-panel__confetti {
          position: absolute;
          inset: 0;
          pointer-events: none;

          .victory-panel__confetti-piece {
            position: absolute;
            top: -16px;
            left: var(--left);
            width: 8px;
            height: 14px;
            border-radius: 2px;
            background: var(--color);
            opacity: 0;
            transform: translateY(0) rotate(0deg);
            animation: confetti-fall var(--duration) ease-out var(--delay) forwards;
          }
        }

        .victory-panel__header {
          position: relative;
          z-index: 1;

          h3 {
            margin: 0;
            font-size: 24px;
            color: #1d5f33;
          }

          p {
            margin: 4px 0 0;
            color: #2f7b48;
            font-weight: 500;
          }
        }

        .victory-panel__stats-grid {
          position: relative;
          z-index: 1;

          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 10px;

          .victory-stat {
            border: 1px solid #d2e5da;
            border-radius: 10px;
            background: #fff;
            padding: 10px;

            display: flex;
            flex-direction: column;
            gap: 4px;

            opacity: 0;
            transform: translateY(14px);
            animation: victory-card-in 0.45s ease forwards;

            h4 {
              margin: 0;
              color: #4f4f4f;
              font-size: 12px;
            }

            strong {
              font-size: 22px;
              color: #1f1f1f;
              line-height: 1.1;
            }
          }

          .victory-stat:nth-child(1) {
            animation-delay: 0.05s;
          }

          .victory-stat:nth-child(2) {
            animation-delay: 0.12s;
          }

          .victory-stat:nth-child(3) {
            animation-delay: 0.19s;
          }

          .victory-stat:nth-child(4) {
            animation-delay: 0.26s;
          }

          .victory-stat:nth-child(5) {
            animation-delay: 0.33s;
          }

          .victory-stat:nth-child(6) {
            animation-delay: 0.4s;
          }
        }

        .victory-panel__actions {
          position: relative;
          z-index: 1;

          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          justify-content: flex-end;
        }

        @media (max-width: 900px) {
          .victory-panel__stats-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 520px) {
          .victory-panel__header {
            h3 {
              font-size: 21px;
            }

            p {
              font-size: 13px;
            }
          }

          .victory-panel__stats-grid {
            grid-template-columns: 1fr;
          }

          .victory-panel__actions {
            justify-content: center;
          }
        }
      }

      @media (max-width: 520px) {
        .play-panel__live-stats {
          gap: 6px;

          span {
            font-size: 11px;
            padding: 3px 7px;
          }
        }

        .play-board {
          padding: 8px;

          .play-board__tile {
            width: 52px;
            height: 52px;

            span {
              font-size: 25px;
            }
          }
        }

        .play-panel__actions {
          flex-direction: column;

          :deep(button) {
            width: 100%;
          }
        }
      }
    }
  }

  .play-layout__footer {
    text-align: center;

    &:hover {
      cursor: pointer;
      text-decoration: underline;
    }
  }
}

.victory-reveal-enter-active {
  transition: all 0.3s ease;
}

.victory-reveal-enter-from {
  opacity: 0;
  transform: translateY(10px) scale(0.98);
}

.board-move-move {
  transition: transform 0.24s cubic-bezier(0.22, 1, 0.36, 1);
}

@keyframes hint-pulse {
  0%,
  100% {
    box-shadow: 0 0 0 0 rgba(22, 119, 255, 0.45);
  }

  50% {
    box-shadow: 0 0 0 8px rgba(22, 119, 255, 0);
  }
}

@keyframes confetti-fall {
  0% {
    transform: translateY(0) rotate(0deg);
    opacity: 1;
  }

  100% {
    transform: translateY(230px) rotate(380deg);
    opacity: 0;
  }
}

@keyframes victory-card-in {
  from {
    opacity: 0;
    transform: translateY(14px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
