<template>
  <a-layout class="homepage-layout">
    <a-layout-header class="layout__header">
      <div class="header__title">
        <img src="@/assets/puzzle-icon.svg" />
        <h1>8-Puzzle AI Game</h1>
      </div>

      <div class="header__menu">
        <a-button @click="handleOpenContact" class="menu__button">Contact</a-button>
        <a-button @click="handleOpenDocumentation" class="menu__button">Documentation</a-button>

        <a-dropdown class="menu__dropdown">
          <MenuOutlined :style="{ color: '#fff', fontSize: '16px' }" />

          <template #overlay>
            <a-menu>
              <a-menu-item @click="handleOpenContact">
                <span>Contact</span>
              </a-menu-item>
              <a-menu-item @click="handleOpenDocumentation">
                <span>Documentation</span>
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </div>
    </a-layout-header>

    <a-layout-content class="layout__content">
      <div class="content__about-action">
        <a-button type="default" @click="aboutModalOpen = true">About the 8-Puzzle</a-button>
      </div>

      <a-modal
        :footer="null"
        :open="aboutModalOpen"
        :width="700"
        @cancel="aboutModalOpen = false"
        centered
        title="About the 8-Puzzle"
      >
        <section class="about-modal__content">
          <p>
            The 8-puzzle is a sliding-tile game played on a 3x3 board. Eight tiles are numbered from
            1 to 8, and one position is empty. A state is solved when the board matches the goal
            configuration.
          </p>
          <p>
            In this app, the empty position is represented by 0 in the setup board. Every move
            slides one adjacent tile into the empty space, generating a new state that algorithms
            can explore.
          </p>

          <div class="about-modal__goal-state">
            <div class="goal-state__text">
              <h3>Goal State</h3>
              <span>The search ends when this arrangement is reached.</span>
            </div>
            <GameStateBoard :gameSetupData="goalStateTemplate" :showHeuristic="false" />
          </div>

          <ul class="about-modal__rules">
            <li>
              Only legal moves are allowed: up, down, left, and right relative to the empty tile.
            </li>
            <li>
              Each algorithm explores the state space differently, balancing speed and memory usage.
            </li>
            <li>
              Heuristic-based methods in this project use Manhattan Distance to guide the search.
            </li>
          </ul>
        </section>
      </a-modal>

      <section class="content__game-container">
        <div class="game-container__header">
          <h2>Game Setup</h2>

          <a-tooltip
            title="Click each tile in the board to choose values from 0 to 8. Value 0 represents the empty spot."
          >
            <img src="@/assets/info-icon.svg" />
          </a-tooltip>
        </div>

        <div class="game-container__setup-board">
          <GameSetupBoardInput v-model="gameSetupData" />
        </div>

        <div class="game-container__algorithms">
          <div class="algorithms__header">
            <h2>Search Algorithms</h2>

            <a-tooltip
              title="Select the algorithm you want use to do the search in state border. The heuristic used is the Manhattan Distance."
            >
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

        <div class="game-container__footer-buttons">
          <a-button type="dashed" @click="genRandomGameSetup">Random Values</a-button>
          <a-button type="dashed" @click="checkHValue">Check h-value</a-button>
          <a-button type="primary" @click="handleStartGame">Start Game</a-button>
          <a-button type="primary" @click="handleStepGame">Step By Step</a-button>
        </div>
      </section>

      <a-divider> </a-divider>

      <template v-if="gameMode == 'result'">
        <LoadingSpinner v-if="resultData.loading"></LoadingSpinner>
        <section v-else-if="resultData.show" class="content__result-container">
          <div class="result__header">
            <h3>Solution</h3>
            <a-tooltip>
              <img src="@/assets/info-icon.svg" />
              <template #title>
                <div>
                  <p>Solution Nodes: The number of operations required to reach the goal state.</p>
                  <p>Generated Nodes: The number of different nodes generated during the search.</p>
                  <p>Open Nodes: The number of nodes opened during the search.</p>
                  <p>Max Depth: The maximum depth reached by the search.</p>
                  <p>Max States Border Size: The maximum number of nodes in the state border.</p>
                  <p>Execution Time: The time taken to find the solution (in millisecond).</p>
                </div>
              </template>
            </a-tooltip>
          </div>

          <div class="result__stats">
            <span
              >Solution Nodes: <br />
              {{ resultData.path.length }}</span
            >
            <span
              >Generated Nodes: <br />
              {{ resultData.generatedNodes }}</span
            >
            <span
              >Open Nodes: <br />
              {{ resultData.openNodes }}</span
            >
            <span
              >Max Depth: <br />
              {{ resultData.maxDepth }}</span
            >
            <span
              >Max States Border Size: <br />
              {{ resultData.maxStateBorder }}</span
            >
            <span v-if="resultData.executionTime != -1"
              >Execution Time: <br />
              {{ resultData.executionTime.toFixed(2) }}ms</span
            >
          </div>

          <div class="result__grid">
            <GameStateBoard
              showIndex
              :key="index"
              :index="Number(index)"
              :gameSetupData="data"
              class="result__grid-item"
              v-for="(data, index) in resultData.path"
            />
          </div>
        </section>
      </template>

      <template v-if="gameMode == 'step'">
        <section class="content__result-container">
          <h3>Step by Step Solution State</h3>

          <div class="result__stats">
            <span
              >Generated Nodes: <br />
              {{ resultData.generatedNodes }}</span
            >
            <span
              >Open Nodes: <br />
              {{ resultData.openNodes }}</span
            >
            <span
              >Max Depth: <br />
              {{ resultData.maxDepth }}</span
            >
            <span
              >Max Queue Size: <br />
              {{ resultData.maxStateBorder }}</span
            >
          </div>

          <div class="result__options">
            <a-button type="default" @click="resetResult">Reset Game</a-button>
            <a-button type="default" @click="handleAdvanceStepGame">Next Step</a-button>
          </div>

          <h3>State Border</h3>

          <div class="result__grid --bordered">
            <TransitionGroup name="gamestate-change">
              <GameStateBoard
                :key="index"
                :index="Number(index)"
                :gameSetupData="data"
                class="result__grid-item"
                v-for="(data, index) in resultData.stepPath"
              />
            </TransitionGroup>
          </div>
        </section>
      </template>
    </a-layout-content>

    <a-layout-footer class="layout__footer" @click="handleOpenWebsite">
      8-Puzzle AI Game © 2023 Created by Pumba Developer
    </a-layout-footer>
  </a-layout>
</template>

<script setup lang="ts">
import GameStateBoard from '@/components/shared/GameStateBoard.vue'
import GameSetupBoardInput from '@/components/shared/GameSetupBoardInput.vue'
import LoadingSpinner from '@/components/shared/LoadingSpinner.vue'

import { reactive, ref } from 'vue'
import { MenuOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'

import type { IGameSetup } from '@/interfaces/IGameSetup'
import type IAlgorithmClass from '@/interfaces/IAlgorithmClass'

import goalStateTemplate from '@/assets/goalStateTemplate'
import manhattanDistance from '@/utils/manhattanDistance'
import isSolvable from '@/utils/isSolvable'
import BreadthFirstSearch from '@/utils/BreadthFirstSearch'
import DepthFirstSearch from '@/utils/DepthFirstSearch'
import GreedyBestFirstSearch from '@/utils/GreedyBestFirstSearch'
import AStarSearch from '@/utils/AStarSearch'

const gameMode = ref<'step' | 'result'>('result')
const aboutModalOpen = ref(false)
const gameSetupData = ref<IGameSetup>(Array(9).fill(''))
const algorithmSetup = ref<'bfs' | 'dfs' | 'gs' | 'a*'>('bfs')
const selectedAlgorithm = ref<IAlgorithmClass | null>(null)
const resultData = reactive({
  show: false,
  loading: false,
  path: [] as IGameSetup[],
  stepPath: [] as any,
  generatedNodes: 0 as number,
  openNodes: 0 as number,
  maxDepth: 0 as number,
  maxStateBorder: 0 as number,
  executionTime: 0 as number
})
const algorithmOptions = ref([
  {
    value: 'bfs',
    label: 'Breadth First Search',
    explanation: 'Explores all neighboring nodes before exploring child nodes.'
  },
  {
    value: 'dfs',
    label: 'Depth First Search',
    explanation: 'Explores all child nodes before exploring neighboring nodes.'
  },
  {
    value: 'gs',
    label: 'Greedy Search',
    explanation: 'Explores the node that appears to be the most promising according to a heuristic.'
  },
  {
    value: 'a*',
    label: 'A* Search',
    explanation:
      'Explores the node that appears to be the most promising according to a heuristic and the path cost.'
  }
])

function resetResult() {
  gameMode.value = 'result'
  resultData.show = false
  resultData.loading = false
  resultData.path = []
  resultData.stepPath = []
  resultData.generatedNodes = 0
  resultData.maxDepth = 0
  resultData.maxStateBorder = 0
  resultData.executionTime = 0

  selectedAlgorithm.value?.resetState()
}

function genRandomGameSetup() {
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

async function handleStepGame() {
  if (!gameSetupIsValid()) {
    return
  }

  resetResult()

  gameMode.value = 'step'

  switch (algorithmSetup.value) {
    case 'bfs':
      selectedAlgorithm.value = new BreadthFirstSearch(gameSetupData.value)
      break
    case 'dfs':
      selectedAlgorithm.value = new DepthFirstSearch(gameSetupData.value)
      break
    case 'gs':
      selectedAlgorithm.value = new GreedyBestFirstSearch(gameSetupData.value)
      break
    case 'a*':
      selectedAlgorithm.value = new AStarSearch(gameSetupData.value)
      break
  }

  handleAdvanceStepGame()
}

function handleAdvanceStepGame() {
  if (!selectedAlgorithm.value) {
    return
  }

  selectedAlgorithm.value.advanceOneStep()

  resultData.stepPath = selectedAlgorithm.value.getSearchQueue()
  resultData.generatedNodes = selectedAlgorithm.value.getGeneratedNodesCount()
  resultData.maxDepth = selectedAlgorithm.value.getMaxDepth()
  resultData.maxStateBorder = selectedAlgorithm.value.getMaxNodesInSpace()
  resultData.openNodes = selectedAlgorithm.value.getOpenNodesCount()
  resultData.path = selectedAlgorithm.value.getOptimalPath()
  resultData.executionTime = -1

  console.log(resultData.stepPath)

  if (selectedAlgorithm.value.isSolved()) {
    gameMode.value = 'result'
    resultData.show = true
  }
}

async function handleStartGame() {
  if (!gameSetupIsValid()) {
    return
  }

  resetResult()

  resultData.loading = true
  await sleep(1000)

  let algorithm

  switch (algorithmSetup.value) {
    case 'bfs':
      algorithm = new BreadthFirstSearch(gameSetupData.value)
      break
    case 'dfs':
      algorithm = new DepthFirstSearch(gameSetupData.value)
      break
    case 'gs':
      algorithm = new GreedyBestFirstSearch(gameSetupData.value)
      break
    case 'a*':
      algorithm = new AStarSearch(gameSetupData.value)
      break
  }

  algorithm.solve()

  resultData.path = algorithm.getOptimalPath()
  resultData.generatedNodes = algorithm.getGeneratedNodesCount()
  resultData.maxDepth = algorithm.getMaxDepth()
  resultData.maxStateBorder = algorithm.getMaxNodesInSpace()
  resultData.executionTime = algorithm.getExecutionTime()
  resultData.openNodes = algorithm.getOpenNodesCount()
  resultData.show = true
  resultData.loading = false
}

function checkHValue() {
  if (!gameSetupIsValid()) {
    return
  }
  message.info(`h-value: ${manhattanDistance(gameSetupData.value)}`)
}

// Verificar se o array possui apenas números de 0 a 8 sem repetição
function gameSetupIsValid() {
  const gameSetupDataNumbers = gameSetupData.value.map((value) => parseInt(value, 10))

  const isInvalid = gameSetupDataNumbers.some((value) => isNaN(value) || value < 0 || value > 8)

  const isRepeated = gameSetupDataNumbers.some(
    (value, index, array) => array.indexOf(value) !== index
  )

  if (isRepeated || isInvalid) {
    message.error('Please, insert a valid game setup.')
    return false
  }

  if (!isSolvable(gameSetupData.value)) {
    message.error('This setup is not solvable. Please, insert a solvable game setup.')
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

function handleOpenWebsite() {
  window.open('https://pumbadev.com', '_blank')
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
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
    justify-content: space-between;

    .header__title {
      display: flex;
      flex-direction: row;
      gap: 10px;
      align-items: center;
      justify-content: center;

      @media (min-width: 768px) {
        gap: 20px;
      }

      img {
        width: 20px;
        height: 20px;
        margin-bottom: 8px;

        @media (min-width: 768px) {
          width: 25px;
          height: 25px;
        }

        @media (min-width: 1024px) {
          width: 30px;
          height: 30px;
        }
      }

      h1 {
        color: white;

        font-size: 14px;

        @media (min-width: 768px) {
          font-size: 16px;
        }

        @media (min-width: 1024px) {
          font-size: 18px;
        }
      }
    }

    .header__menu {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 20px;

      .menu__button {
        display: block;
      }

      .menu__dropdown {
        display: none;
      }

      @media (max-width: 425px) {
        .menu__button {
          display: none;
        }

        .menu__dropdown {
          display: block;
        }
      }
    }
  }

  .layout__content {
    width: 100%;
    height: 100%;
    padding: 15px;

    display: flex;
    flex-direction: column;
    gap: 28px;

    .content__about-action {
      width: min(700px, 100%);
      margin: 0 auto;
      display: flex;
      justify-content: flex-end;

      @media (max-width: 425px) {
        justify-content: center;
      }
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

          @media (max-width: 425px) {
            flex-direction: column;
          }
          .radio-group__options {
            display: flex;
            flex-direction: row;
            gap: 5px;
            align-items: center;
            justify-content: center;

            img {
              width: 17px;
              height: 17px;
              padding-bottom: 2px;
            }
          }
        }
      }

      .game-container__footer-buttons {
        display: flex;
        gap: 20px;

        @media (max-width: 425px) {
          gap: 10px;
          flex-direction: column;
        }
      }
    }

    .content__result-container {
      margin: 0 auto;

      display: flex;
      flex-direction: column;
      gap: 20px;
      align-items: center;
      justify-content: center;

      .result__header {
        display: flex;
        flex-direction: row;
        gap: 5px;
        align-items: center;
        justify-content: center;

        h3 {
          text-align: center;
        }

        img {
          width: 17px;
          height: 17px;
          margin-bottom: 6px;
        }
      }

      .result__stats {
        display: flex;
        gap: 10px;
        flex-direction: column;

        br {
          display: none;
        }

        @media (min-width: 512px) {
          gap: 20px;
          flex-direction: row;

          br {
            display: block;
          }

          span {
            text-align: center;
          }
        }
      }

      .result__options {
        display: flex;
        gap: 20px;

        @media (max-width: 425px) {
          gap: 10px;
          flex-direction: column;
        }
      }

      .result__grid {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        gap: 20px;

        &.--bordered {
          border: 1px solid #bababa;
          border-radius: 5px;
          padding: 10px;
        }

        flex-wrap: wrap;

        max-width: 90vw;

        @media (min-width: 425px) {
          max-width: 80vw;
        }

        @media (min-width: 768px) {
          max-width: 70vw;
        }

        @media (min-width: 1024px) {
          max-width: 60vw;
        }

        @media (min-width: 1440px) {
          max-width: 50vw;
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

  .gamestate-change-enter-active,
  .gamestate-change-leave-active {
    transition: all 0.8s ease;
  }

  .gamestate-change-enter-from,
  .gamestate-change-leave-to {
    opacity: 0;
    transform: translateX(-15px);
  }
}
</style>
