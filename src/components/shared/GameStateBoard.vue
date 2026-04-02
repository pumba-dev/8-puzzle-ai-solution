<template>
  <div class="game-state-board">
    <span v-if="showHeuristic">{{
      t('board.hValue', { value: manhattanDistance(gameSetupData) })
    }}</span>

    <div class="gamestate-board" :class="`--${size}`">
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
  size?: 'compact' | 'regular' | 'large'
  gameSetupData: IGameSetup
}

withDefaults(defineProps<Props>(), {
  showHeuristic: true,
  size: 'compact'
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

    &.--compact {
      .board__peace {
        width: 25px;
        height: 25px;

        span {
          font-size: 18px;
        }
      }
    }

    &.--regular {
      .board__peace {
        width: 36px;
        height: 36px;

        span {
          font-size: 23px;
        }
      }
    }

    &.--large {
      .board__peace {
        width: 52px;
        height: 52px;

        span {
          font-size: 30px;
        }
      }
    }

    .board__peace {
      border: 1px solid black;
      display: flex;
      justify-content: center;
      align-items: center;

      span {
        color: black;
      }
    }
  }
}

@media (max-width: 425px) {
  .game-state-board {
    .gamestate-board {
      &.--compact {
        .board__peace {
          width: 22px;
          height: 22px;

          span {
            font-size: 15px;
          }
        }
      }

      &.--regular {
        .board__peace {
          width: 30px;
          height: 30px;

          span {
            font-size: 20px;
          }
        }
      }

      &.--large {
        .board__peace {
          width: 42px;
          height: 42px;

          span {
            font-size: 24px;
          }
        }
      }
    }
  }
}
</style>
