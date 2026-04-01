<template>
  <div class="game-state-board">
    <span v-if="showHeuristic">{{
      t('board.hValue', { value: manhattanDistance(gameSetupData) })
    }}</span>

    <div class="gamestate-board">
      <template :key="index" v-for="(piece, index) in gameSetupData">
        <div class="board__peace">
          <span>{{ piece == '0' ? '' : piece }}</span>
        </div>
      </template>
    </div>

    <span v-if="showIndex">{{ `(${index})` }}</span>
  </div>
</template>

<script setup lang="ts">
import type { IGameSetup } from '../../interfaces/IGameSetup'
import manhattanDistance from '../../utils/manhattanDistance'
import { useI18n } from 'vue-i18n'

interface Props {
  index?: number
  showIndex?: boolean
  showHeuristic?: boolean
  gameSetupData: IGameSetup
}

withDefaults(defineProps<Props>(), {
  showHeuristic: true
})

const { t } = useI18n()
</script>

<style lang="scss" scoped>
.game-state-board {
  display: flex;
  flex-direction: column;
  align-items: center;

  // adicionar margem top no segundo span
  span:last-child {
    margin-top: 5px;
  }

  .gamestate-board {
    border: 1px solid black;

    display: grid;
    grid-template-columns: repeat(3, 1fr);

    .board__peace {
      border: 1px solid black;
      width: 25px;
      height: 25px;
      display: flex;
      justify-content: center;
      align-items: center;

      span {
        font-size: 18px;
        color: black;
      }
    }
  }
}
</style>
