<template>
  <a-layout class="homepage-layout">
    <a-layout-header class="layout__header">
      <div class="header__title">
        <img src="@/assets/puzzle-icon.svg" />
        <h1>{{ t('app.title') }}</h1>
      </div>

      <div class="header__menu">
        <a-button @click="aboutModalOpen = true" class="menu__button">{{
          t('app.menu.about')
        }}</a-button>
        <a-button @click="handleOpenDocumentation" class="menu__button">{{
          t('app.menu.documentation')
        }}</a-button>
        <a-button @click="handleOpenContact" class="menu__button">{{
          t('app.menu.contact')
        }}</a-button>
        <a-button @click="handleOpenPlayModule" class="menu__button">{{
          t('app.menu.play')
        }}</a-button>

        <a-dropdown class="menu__dropdown">
          <MenuOutlined :style="{ color: '#fff', fontSize: '16px' }" />

          <template #overlay>
            <a-menu>
              <a-menu-item @click="aboutModalOpen = true">
                <span>{{ t('app.menu.about') }}</span>
              </a-menu-item>
              <a-menu-item @click="handleOpenDocumentation">
                <span>{{ t('app.menu.documentation') }}</span>
              </a-menu-item>
              <a-menu-item @click="handleOpenContact">
                <span>{{ t('app.menu.contact') }}</span>
              </a-menu-item>
              <a-menu-item @click="handleOpenPlayModule">
                <span>{{ t('app.menu.play') }}</span>
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>

        <a-select v-model:value="locale" class="menu__language-select" size="small">
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

    <a-layout-content class="layout__content">
      <a-modal
        :footer="null"
        :open="aboutModalOpen"
        :width="aboutModalWidth"
        @cancel="aboutModalOpen = false"
        centered
        :title="t('about.title')"
      >
        <section class="about-modal__content">
          <p>
            {{ t('about.paragraph1') }}
          </p>
          <p>
            {{ t('about.paragraph2') }}
          </p>

          <div class="about-modal__goal-state">
            <div class="goal-state__text">
              <h3>{{ t('about.goalTitle') }}</h3>
              <span>{{ t('about.goalDescription') }}</span>
            </div>
            <GameStateBoard :gameSetupData="goalStateTemplate" :showHeuristic="false" />
          </div>

          <ul class="about-modal__rules">
            <li>{{ t('about.rule1') }}</li>
            <li>{{ t('about.rule2') }}</li>
            <li>{{ t('about.rule3') }}</li>
          </ul>
        </section>
      </a-modal>

      <section class="content__game-container" v-show="!showSimulationScreen">
        <div class="game-container__header">
          <h2>{{ t('setup.title') }}</h2>

          <a-tooltip :title="t('setup.tooltip')">
            <img src="@/assets/info-icon.svg" />
          </a-tooltip>
        </div>

        <div class="game-container__setup-board">
          <GameSetupBoardInput v-model="gameSetupData" />
        </div>

        <div class="game-container__algorithms">
          <div class="algorithms__header">
            <h2>{{ t('algorithms.title') }}</h2>

            <a-tooltip :title="t('algorithms.tooltip')">
              <img src="@/assets/info-icon.svg" />
            </a-tooltip>
          </div>

          <a-radio-group v-model:value="algorithmSetup" class="algorithms__radio-group">
            <a-radio :key="index" :value="option.value" v-for="(option, index) in algorithmOptions">
              <div class="radio-group__options">
                <span>{{ option.label }}</span>
                <a-tooltip :title="option.explanation">
                  <img src="@/assets/info-icon.svg" />
                </a-tooltip>
              </div>
            </a-radio>
          </a-radio-group>
        </div>

        <div class="game-container__actions">
          <a-button type="dashed" :disabled="resultData.loading" @click="genRandomGameSetup">{{
            t('actions.randomValues')
          }}</a-button>
          <a-button type="dashed" :disabled="resultData.loading" @click="checkHValue">{{
            t('actions.checkHValue')
          }}</a-button>
          <a-button
            type="primary"
            :loading="resultData.loading && !isCancelling && !isPaused"
            :disabled="resultData.loading"
            @click="handleRunSimulation"
          >
            {{ t('actions.runSimulation') }}
          </a-button>
          <a-button
            v-show="resultData.loading && !isPaused"
            :disabled="isCancelling"
            @click="handlePauseSimulation"
          >
            {{ t('actions.pauseSimulation') }}
          </a-button>
          <a-button
            type="primary"
            v-show="resultData.loading && isPaused"
            :disabled="isCancelling"
            @click="handleResumeSimulation"
          >
            {{ t('actions.resumeSimulation') }}
          </a-button>
          <a-button danger v-show="resultData.loading" @click="handleCancelSimulation">
            {{ isCancelling ? t('simulation.cancelling') : t('actions.cancelSimulation') }}
          </a-button>
        </div>
      </section>

      <a-divider v-show="!showSimulationScreen"> </a-divider>

      <section class="content__simulation-container" v-show="resultData.loading">
        <LoadingSpinner
          :initialState="gameSetupData"
          :generatedNodes="resultData.generatedNodes"
          :openNodes="resultData.openNodes"
          :elapsedMs="resultData.executionTime"
          :isPaused="isPaused"
        />

        <div class="simulation-container__actions">
          <a-button
            v-show="!isPaused"
            :disabled="isCancelling"
            @click="handlePauseSimulation"
          >
            {{ t('actions.pauseSimulation') }}
          </a-button>
          <a-button
            type="primary"
            v-show="isPaused"
            :disabled="isCancelling"
            @click="handleResumeSimulation"
          >
            {{ t('actions.resumeSimulation') }}
          </a-button>
        </div>

        <StateBorderStream
          :expansions="liveBorderExpansions"
          :generatedNodes="resultData.generatedNodes"
          :openNodes="resultData.openNodes"
          :maxDepth="resultData.maxDepth"
          :maxStateBorder="resultData.maxStateBorder"
          :animationDurationMs="liveBorderAnimationDurationMs"
        />
      </section>

      <section v-show="showResult" class="content__result-panel">
        <div class="result-panel__actions">
          <a-button type="primary" @click="handleNewSimulation">{{
            t('actions.newSimulation')
          }}</a-button>
        </div>

        <div class="result-panel__hero">
          <div>
            <h3>{{ t('solution.title') }}</h3>
            <p>{{ t('solution.routeSummary', { steps: resultData.path.length }) }}</p>
          </div>
          <a-tooltip>
            <img src="@/assets/info-icon.svg" />
            <template #title>
              <div>
                <p>{{ t('stats.solutionNodes') }}: {{ t('stats.tooltip.solutionNodes') }}</p>
                <p>{{ t('stats.generatedNodes') }}: {{ t('stats.tooltip.generatedNodes') }}</p>
                <p>{{ t('stats.openNodes') }}: {{ t('stats.tooltip.openNodes') }}</p>
                <p>{{ t('stats.maxDepth') }}: {{ t('stats.tooltip.maxDepth') }}</p>
                <p>
                  {{ t('stats.maxStatesBorderSize') }}:
                  {{ t('stats.tooltip.maxStatesBorderSize') }}
                </p>
                <p>{{ t('stats.executionTime') }}: {{ t('stats.tooltip.executionTime') }}</p>
              </div>
            </template>
          </a-tooltip>
        </div>

        <div class="result-panel__stats-grid">
          <article class="stats-card --steps">
            <h4>{{ t('stats.solutionNodes') }}</h4>
            <strong>{{ resultData.path.length }}</strong>
          </article>
          <article class="stats-card --generated">
            <h4>{{ t('stats.generatedNodes') }}</h4>
            <strong>{{ resultData.generatedNodes }}</strong>
          </article>
          <article class="stats-card --open">
            <h4>{{ t('stats.openNodes') }}</h4>
            <strong>{{ resultData.openNodes }}</strong>
          </article>
          <article class="stats-card --depth">
            <h4>{{ t('stats.maxDepth') }}</h4>
            <strong>{{ resultData.maxDepth }}</strong>
          </article>
          <article class="stats-card --border">
            <h4>{{ t('stats.maxStatesBorderSize') }}</h4>
            <strong>{{ resultData.maxStateBorder }}</strong>
          </article>
          <article class="stats-card --time">
            <h4>{{ t('stats.executionTime') }}</h4>
            <strong>{{ resultData.executionTime.toFixed(2) }}ms</strong>
          </article>
        </div>

        <div class="result-panel__route">
          <h3>{{ t('solution.routeTitle') }}</h3>

          <div class="route-grid" :style="{ '--route-columns': routeColumns.toString() }">
            <template :key="`route-step-${index}`" v-for="(data, index) in resultData.path">
              <article
                :class="{ '--goal': index === resultData.path.length - 1 }"
                class="route-step"
              >
                <span class="route-step__index">{{
                  index === 0 ? t('solution.initialStateLabel') : index
                }}</span>
                <div class="route-step__mini-board">
                  <div
                    :key="`route-tile-${index}-${tileIndex}-${tile}`"
                    class="route-step__mini-tile"
                    :class="{ '--empty': tile === '0' || tile === '' }"
                    v-for="(tile, tileIndex) in data"
                  >
                    <span>{{ tile === '0' || tile === '' ? '' : tile }}</span>
                  </div>
                </div>

                <span
                  v-if="getRouteConnectorDirection(index, resultData.path.length) !== 'none'"
                  :class="`--${getRouteConnectorDirection(index, resultData.path.length)}`"
                  class="route-step__connector"
                >
                  {{
                    getRouteConnectorDirection(index, resultData.path.length) === 'down' ? '↓' : '→'
                  }}
                </span>
              </article>
            </template>
          </div>
        </div>
      </section>
    </a-layout-content>

    <a-layout-footer class="layout__footer" @click="handleOpenWebsite">
      {{ t('app.footer') }}
    </a-layout-footer>
  </a-layout>
</template>

<script setup lang="ts">
import GameStateBoard from '@/components/shared/GameStateBoard.vue'
import GameSetupBoardInput from '@/components/shared/GameSetupBoardInput.vue'
import LoadingSpinner from '@/components/shared/LoadingSpinner.vue'
import StateBorderStream from '@/components/shared/StateBorderStream.vue'

import { computed, onBeforeUnmount, onMounted, reactive, ref, watchEffect } from 'vue'
import { MenuOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

import type { IGameSetup } from '@/interfaces/IGameSetup'
import type { AppLocale } from '@/i18n'
import type {
  SolverWorkerRequest,
  SolverWorkerResponse,
  SolverAlgorithm,
  WorkerStateExpansion
} from '@/workers/workerProtocol'

import goalStateTemplate from '@/assets/goalStateTemplate'
import manhattanDistance from '@/utils/manhattanDistance'
import isSolvable from '@/utils/isSolvable'

const { t, locale } = useI18n()
const router = useRouter()

const aboutModalOpen = ref(false)
const gameSetupData = ref<IGameSetup>(Array(9).fill(''))
const algorithmSetup = ref<'bfs' | 'dfs' | 'gs' | 'a*'>('bfs')
const minimumSimulationDurationMs = 2000
const liveBorderProgressIntervalMs = 450
const liveBorderAnimationDurationMs = 250
const simulationWorker = ref<Worker | null>(null)
const activeRunId = ref(0)
const isCancelling = ref(false)
const isPaused = ref(false)
const liveBorderExpansions = ref<WorkerStateExpansion[]>([])
const routeColumns = ref(4)
const viewportWidth = ref(1200)

const resultData = reactive({
  show: false,
  loading: false,
  path: [] as IGameSetup[],
  generatedNodes: 0 as number,
  openNodes: 0 as number,
  maxDepth: 0 as number,
  maxStateBorder: 0 as number,
  executionTime: 0 as number
})
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

const algorithmOptions = computed(() => [
  {
    value: 'bfs',
    label: t('algorithms.bfs.label'),
    explanation: t('algorithms.bfs.explanation')
  },
  {
    value: 'dfs',
    label: t('algorithms.dfs.label'),
    explanation: t('algorithms.dfs.explanation')
  },
  {
    value: 'gs',
    label: t('algorithms.gs.label'),
    explanation: t('algorithms.gs.explanation')
  },
  {
    value: 'a*',
    label: t('algorithms.aStar.label'),
    explanation: t('algorithms.aStar.explanation')
  }
])

const showResult = computed(() => resultData.show && resultData.path.length > 0)
const showSimulationScreen = computed(() => resultData.loading || showResult.value)
const aboutModalWidth = computed(() => {
  if (viewportWidth.value <= 480) {
    return 'calc(100vw - 20px)'
  }

  if (viewportWidth.value <= 768) {
    return 'calc(100vw - 40px)'
  }

  return 700
})

watchEffect(() => {
  if (typeof document === 'undefined') {
    return
  }

  document.title = t('app.title')
  document.documentElement.lang = locale.value
})

function resetResult() {
  resultData.show = false
  resultData.loading = false
  resultData.path = []
  resultData.generatedNodes = 0
  resultData.openNodes = 0
  resultData.maxDepth = 0
  resultData.maxStateBorder = 0
  resultData.executionTime = 0
  liveBorderExpansions.value = []
  isCancelling.value = false
  isPaused.value = false
}

function genRandomGameSetup() {
  if (resultData.loading) {
    return
  }

  resetResult()

  let randomSetup = createShuffledSetup()

  while (!isSolvable(randomSetup)) {
    randomSetup = createShuffledSetup()
  }

  gameSetupData.value = randomSetup
}

function createShuffledSetup() {
  const randomSetup = ['0', '1', '2', '3', '4', '5', '6', '7', '8']

  for (let index = randomSetup.length - 1; index > 0; index--) {
    const randomIndex = Math.floor(Math.random() * (index + 1))
    const currentValue = randomSetup[index]
    randomSetup[index] = randomSetup[randomIndex]
    randomSetup[randomIndex] = currentValue
  }

  return randomSetup as IGameSetup
}

function createWorkerIfNeeded() {
  if (simulationWorker.value) {
    return
  }

  simulationWorker.value = new Worker(
    new URL('../../workers/puzzleSolver.worker.ts', import.meta.url),
    {
      type: 'module'
    }
  )

  simulationWorker.value.onmessage = (event: MessageEvent<SolverWorkerResponse>) => {
    handleWorkerMessage(event.data)
  }

  simulationWorker.value.onerror = () => {
    resultData.loading = false
    isCancelling.value = false
    isPaused.value = false
    message.error(t('messages.simulationError'))
  }
}

function handleWorkerMessage(workerMessage: SolverWorkerResponse) {
  if (workerMessage.payload.runId !== activeRunId.value) {
    return
  }

  if (workerMessage.type === 'PROGRESS') {
    resultData.generatedNodes = workerMessage.payload.generatedNodes
    resultData.openNodes = workerMessage.payload.openNodes
    resultData.maxDepth = workerMessage.payload.maxDepth
    resultData.maxStateBorder = workerMessage.payload.maxStateBorder
    resultData.executionTime = workerMessage.payload.elapsedMs
    liveBorderExpansions.value = workerMessage.payload.expansions

    return
  }

  if (workerMessage.type === 'CANCELLED') {
    resultData.loading = false
    isCancelling.value = false
    isPaused.value = false
    liveBorderExpansions.value = []
    message.info(t('messages.simulationCancelled'))

    return
  }

  if (workerMessage.type === 'PAUSED') {
    isPaused.value = true
    message.info(t('messages.simulationPaused'))

    return
  }

  if (workerMessage.type === 'RESUMED') {
    isPaused.value = false
    message.info(t('messages.simulationResumed'))

    return
  }

  if (workerMessage.type === 'ERROR') {
    resultData.loading = false
    isCancelling.value = false
    isPaused.value = false
    liveBorderExpansions.value = []
    message.error(t(workerMessage.payload.messageKey))

    return
  }

  if (workerMessage.type === 'COMPLETE') {
    resultData.loading = false
    isCancelling.value = false
    isPaused.value = false
    liveBorderExpansions.value = []

    resultData.generatedNodes = workerMessage.payload.generatedNodes
    resultData.openNodes = workerMessage.payload.openNodes
    resultData.maxDepth = workerMessage.payload.maxDepth
    resultData.maxStateBorder = workerMessage.payload.maxStateBorder
    resultData.executionTime = workerMessage.payload.executionTime
    resultData.path = workerMessage.payload.path

    if (!workerMessage.payload.solved) {
      resultData.show = false
      message.error(t('messages.noSolution'))
      return
    }

    resultData.show = true
  }
}

function handleRunSimulation() {
  if (resultData.loading || !gameSetupIsValid()) {
    return
  }

  resetResult()
  resultData.loading = true

  createWorkerIfNeeded()
  activeRunId.value += 1

  const workerMessage: SolverWorkerRequest = {
    type: 'START_SIMULATION',
    payload: {
      runId: activeRunId.value,
      algorithm: algorithmSetup.value as SolverAlgorithm,
      initialState: [...gameSetupData.value] as IGameSetup,
      borderWindowSize: 12,
      progressIntervalMs: liveBorderProgressIntervalMs,
      minimumSimulationDurationMs
    }
  }

  simulationWorker.value?.postMessage(workerMessage)
}

function handleCancelSimulation() {
  if (!resultData.loading || isCancelling.value) {
    return
  }

  isCancelling.value = true

  const workerMessage: SolverWorkerRequest = {
    type: 'CANCEL_SIMULATION',
    payload: {
      runId: activeRunId.value
    }
  }

  simulationWorker.value?.postMessage(workerMessage)
}

function handlePauseSimulation() {
  if (!resultData.loading || isPaused.value || isCancelling.value) {
    return
  }

  const workerMessage: SolverWorkerRequest = {
    type: 'PAUSE_SIMULATION',
    payload: {
      runId: activeRunId.value
    }
  }

  simulationWorker.value?.postMessage(workerMessage)
}

function handleResumeSimulation() {
  if (!resultData.loading || !isPaused.value || isCancelling.value) {
    return
  }

  const workerMessage: SolverWorkerRequest = {
    type: 'RESUME_SIMULATION',
    payload: {
      runId: activeRunId.value
    }
  }

  simulationWorker.value?.postMessage(workerMessage)
}

function checkHValue() {
  if (resultData.loading) {
    return
  }

  if (!gameSetupIsValid()) {
    return
  }
  message.info(t('messages.hValue', { value: manhattanDistance(gameSetupData.value) }))
}

// Verificar se o array possui apenas números de 0 a 8 sem repetição
function gameSetupIsValid() {
  const gameSetupDataNumbers = gameSetupData.value.map((value) => parseInt(value, 10))

  const isInvalid = gameSetupDataNumbers.some((value) => isNaN(value) || value < 0 || value > 8)

  const isRepeated = gameSetupDataNumbers.some(
    (value, index, array) => array.indexOf(value) !== index
  )

  if (isRepeated || isInvalid) {
    message.error(t('messages.invalidSetup'))
    return false
  }

  if (!isSolvable(gameSetupData.value)) {
    message.error(t('messages.unsolvableSetup'))
    return false
  }

  return true
}

function handleOpenDocumentation() {
  window.open('https://github.com/pumba-dev/8-puzzle-ai-solution', '_blank')
}

function handleOpenContact() {
  window.open('https://linktr.ee/pumbadev', '_blank')
}

function handleOpenPlayModule() {
  router.push('/play')
}

function handleOpenWebsite() {
  window.open('https://pumbadev.com', '_blank')
}

function handleNewSimulation() {
  resetResult()
}

function updateRouteColumns() {
  if (typeof window === 'undefined') {
    viewportWidth.value = 1200
    routeColumns.value = 4
    return
  }

  viewportWidth.value = window.innerWidth

  if (viewportWidth.value <= 560) {
    routeColumns.value = 1
    return
  }

  if (viewportWidth.value <= 860) {
    routeColumns.value = 2
    return
  }

  if (viewportWidth.value <= 1080) {
    routeColumns.value = 3
    return
  }

  routeColumns.value = 4
}

function getRouteConnectorDirection(index: number, pathLength: number): 'right' | 'down' | 'none' {
  if (index >= pathLength - 1) {
    return 'none'
  }

  if (routeColumns.value <= 1) {
    return 'down'
  }

  return (index + 1) % routeColumns.value === 0 ? 'down' : 'right'
}

onMounted(() => {
  updateRouteColumns()

  if (typeof window !== 'undefined') {
    window.addEventListener('resize', updateRouteColumns)
  }
})

onBeforeUnmount(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('resize', updateRouteColumns)
  }

  simulationWorker.value?.terminate()
  simulationWorker.value = null
})
</script>

<style lang="scss" scoped>
.homepage-layout {
  min-height: 100vh;
  height: 100%;
  width: 100%;

  display: flex;
  flex-direction: column;
  gap: 20px;

  .layout__header {
    display: flex;
    flex-direction: row;
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
      flex-direction: row;
      gap: 10px;
      align-items: center;
      justify-content: flex-start;

      @media (min-width: 768px) {
        gap: 14px;
      }

      img {
        width: 24px;
        height: 24px;
        margin-bottom: 0;
        padding: 6px;
        border-radius: 10px;
        background: rgba(255, 255, 255, 0.18);
        border: 1px solid rgba(255, 255, 255, 0.36);
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.22);

        @media (min-width: 768px) {
          width: 26px;
          height: 26px;
        }

        @media (min-width: 1024px) {
          width: 30px;
          height: 30px;
        }
      }

      h1 {
        margin: 0;
        color: white;
        line-height: 1.1;
        letter-spacing: 0.2px;
        text-shadow: 0 2px 8px rgba(0, 0, 0, 0.35);

        font-size: 15px;
        font-weight: 700;

        @media (min-width: 768px) {
          font-size: 17px;
        }

        @media (min-width: 1024px) {
          font-size: 19px;
        }
      }

      @media (max-width: 560px) {
        width: 100%;
        justify-content: center;

        h1 {
          font-size: 14px;
          text-align: center;
        }
      }
    }

    .header__menu {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 8px;
      padding: 0;
      border: none;
      background: transparent;

      .menu__language-select {
        width: 182px;

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

      .menu__button {
        display: block;
        border: none;
        color: #fff;
        border-radius: 999px;
        font-weight: 600;
        background: rgba(255, 255, 255, 0.16);
        transition: all 0.2s ease;

        &:hover {
          color: #fff;
          background: rgba(255, 255, 255, 0.28);
          transform: translateY(-1px);
        }
      }

      .menu__dropdown {
        display: none;
        width: 34px;
        height: 34px;
        border-radius: 999px;
        align-items: center;
        justify-content: center;
        border: 1px solid rgba(255, 255, 255, 0.22);
        background: rgba(255, 255, 255, 0.16);
      }

      @media (max-width: 900px) {
        gap: 12px;

        .menu__button {
          display: none;
        }

        .menu__dropdown {
          display: flex;
        }
      }

      @media (max-width: 560px) {
        width: 100%;
        gap: 6px;
        padding: 4px;
        justify-content: center;

        .menu__language-select {
          width: min(160px, 64vw);
        }
      }
    }

    @media (max-width: 560px) {
      gap: 8px;
      padding: 8px 10px;
      flex-wrap: wrap;
      justify-content: center;
    }
  }

  .layout__content {
    width: 100%;
    height: 100%;
    padding: 15px;

    display: flex;
    flex-direction: column;
    gap: 28px;

    @media (max-width: 768px) {
      padding: 12px;
      gap: 20px;
    }

    @media (max-width: 425px) {
      padding: 10px;
      gap: 16px;
    }

    .about-modal__content {
      display: flex;
      flex-direction: column;
      gap: 12px;

      p {
        line-height: 1.5;
      }

      .about-modal__goal-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 14px;
        border: 1px dashed #b7b7b7;
        border-radius: 10px;
        padding: 14px;

        .goal-state__text {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;

          h3 {
            margin: 0;
            text-align: center;
          }

          span {
            text-align: center;
            line-height: 1.4;
          }
        }

        @media (min-width: 768px) {
          flex-direction: row;
        }
      }

      .about-modal__rules {
        display: flex;
        flex-direction: column;
        gap: 8px;
        line-height: 1.4;
        padding-left: 18px;
        list-style: disc;
      }
    }

    .content__game-container {
      margin: 0 auto;
      width: min(700px, 100%);

      display: flex;
      flex-direction: column;
      gap: 20px;
      align-items: center;
      justify-content: center;

      h2 {
        text-align: center;
        padding: 0;
        margin: 0;
      }

      .game-container__header {
        display: flex;
        flex-direction: row;
        gap: 8px;
        align-items: center;
        justify-content: center;

        img {
          width: 18px;
          height: 18px;
        }
      }

      .game-container__setup-board {
        width: 100%;

        display: flex;
        align-items: center;
        justify-content: center;
      }

      .game-container__algorithms {
        display: flex;
        flex-direction: column;
        gap: 20px;
        align-items: center;
        justify-content: center;

        .algorithms__header {
          display: flex;
          flex-direction: row;
          gap: 8px;
          align-items: center;
          justify-content: center;

          img {
            width: 18px;
            height: 18px;
          }
        }

        .algorithms__radio-group {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 6px 14px;

          @media (max-width: 768px) {
            flex-direction: column;
            align-items: flex-start;

            :deep(.ant-radio-wrapper) {
              margin-inline-end: 0;
            }
          }

          .radio-group__options {
            display: flex;
            flex-direction: row;
            gap: 5px;
            align-items: center;
            justify-content: center;

            span {
              line-height: 1.3;
            }

            img {
              width: 17px;
              height: 17px;
              padding-bottom: 2px;
            }
          }
        }
      }

      .game-container__actions {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 20px;

        @media (max-width: 640px) {
          gap: 10px;
          flex-direction: column;
          width: 100%;

          :deep(button) {
            width: 100%;
          }
        }
      }
    }

    .content__simulation-container {
      width: min(980px, 100%);
      margin: 0 auto;

      display: flex;
      flex-direction: column;
      gap: 20px;
      align-items: center;
      justify-content: center;

      .simulation-container__actions {
        width: min(980px, 100%);
        display: flex;
        justify-content: flex-end;

        @media (max-width: 640px) {
          justify-content: center;
          width: 100%;

          :deep(button) {
            width: 100%;
          }
        }
      }
    }

    .content__result-panel {
      width: min(1100px, 100%);
      margin: 0 auto;

      display: flex;
      flex-direction: column;
      gap: 18px;

      .result-panel__hero {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        padding: 14px;
        border-radius: 12px;
        border: 1px solid #bfdaf8;
        background: linear-gradient(135deg, #f3f8ff 0%, #e9f2ff 100%);

        h3 {
          margin: 0;
          font-size: 24px;
        }

        p {
          margin: 4px 0 0;
          color: #355f8f;
          font-weight: 500;
          line-height: 1.35;
        }

        img {
          width: 18px;
          height: 18px;
        }

        @media (max-width: 620px) {
          flex-direction: column;
          align-items: flex-start;
        }

        @media (max-width: 480px) {
          h3 {
            font-size: 20px;
          }

          p {
            font-size: 13px;
          }
        }
      }

      .result-panel__stats-grid {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 10px;

        @media (max-width: 768px) {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        @media (max-width: 480px) {
          grid-template-columns: 1fr;
        }

        .stats-card {
          border: 1px solid #d8d8d8;
          border-radius: 10px;
          padding: 12px;

          display: flex;
          flex-direction: column;
          gap: 6px;

          h4 {
            margin: 0;
            font-size: 13px;
            color: #4f4f4f;
          }

          strong {
            font-size: 24px;
            color: #1d1d1d;
          }

          &.--steps {
            background: #e8f4ff;
            border-color: #9ec8f3;
          }

          &.--generated {
            background: #f3ebff;
            border-color: #c8b0ff;
          }

          &.--open {
            background: #e9fff4;
            border-color: #93dfb3;
          }

          &.--depth {
            background: #fff4e8;
            border-color: #ffc27a;
          }

          &.--border {
            background: #f3f5ff;
            border-color: #aab4ff;
          }

          &.--time {
            background: #fff0f0;
            border-color: #f9abab;
          }
        }
      }

      .result-panel__route {
        border: 1px solid #d4d4d4;
        border-radius: 12px;
        background: #fff;
        padding: 14px;

        display: flex;
        flex-direction: column;
        gap: 12px;

        h3 {
          margin: 0;
          font-size: 20px;
        }

        .route-grid {
          --route-columns: 4;

          width: 100%;
          display: grid;
          grid-template-columns: repeat(var(--route-columns), minmax(0, 1fr));
          align-items: stretch;
          gap: 22px 26px;
          padding: 4px 2px;

          .route-step {
            width: 100%;
            border: 1px solid #d8e2ed;
            border-radius: 12px;
            background: linear-gradient(180deg, #ffffff 0%, #f8fbff 100%);
            padding: 10px;
            position: relative;

            display: flex;
            flex-direction: column;
            gap: 8px;
            align-items: center;

            &.--goal {
              border-color: #7ab686;
              background: linear-gradient(180deg, #f2fff4 0%, #e8f9eb 100%);
            }
          }

          .route-step__mini-board {
            background: #6d3a3a;
            border: 2px solid #402121;
            border-radius: 14px;
            padding: 10px;

            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 4px;
          }

          .route-step__mini-tile {
            width: 48px;
            height: 48px;
            border: 1px solid #2e2e2e;
            background: #f3f3f3;
            display: flex;
            align-items: center;
            justify-content: center;

            &.--empty {
              background: #9e7a4b;
            }

            span {
              font-size: 26px;
              font-weight: 600;
              line-height: 1;
            }
          }

          .route-step__index {
            min-width: 24px;
            height: 24px;
            border-radius: 999px;
            padding: 0 8px;

            display: flex;
            align-items: center;
            justify-content: center;

            font-size: 12px;
            font-weight: 700;
            background: #0d62b0;
            color: white;
          }

          .route-step__connector {
            position: absolute;
            color: #2e77bf;
            font-size: 18px;
            line-height: 1;
            font-weight: 700;

            &.--right {
              right: -20px;
              top: 50%;
              transform: translateY(-50%);
            }

            &.--down {
              left: 50%;
              bottom: -18px;
              transform: translateX(-50%);
            }
          }
        }

        @media (max-width: 1080px) {
          .route-grid {
            gap: 20px 20px;
          }
        }

        @media (max-width: 560px) {
          .route-grid {
            gap: 16px;

            .route-step {
              max-width: 260px;
              margin: 0 auto;
            }
          }
        }

        @media (max-width: 480px) {
          .route-grid {
            .route-step__mini-board {
              padding: 8px;
            }

            .route-step__mini-tile {
              width: 40px;
              height: 40px;

              span {
                font-size: 22px;
              }
            }
          }
        }
      }

      .result-panel__actions {
        display: flex;
        justify-content: flex-end;

        @media (max-width: 620px) {
          justify-content: center;
        }
      }
    }
  }
  .layout__footer {
    text-align: center;

    &:hover {
      cursor: pointer;
      text-decoration: underline;
    }
  }
}
</style>
