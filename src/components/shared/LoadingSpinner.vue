<template>
  <div class="loading-container">
    <div class="loading__board" :class="{ '--paused': isPaused }">
      <div
        :key="`${index}-${tile.value}`"
        class="loading__tile"
        :class="{ '--empty': tile.value === '0' }"
        :style="{
          '--delay': tile.delay,
          '--dx': tile.dx,
          '--dy': tile.dy
        }"
        v-for="(tile, index) in loadingTiles"
      >
        <span>{{ tile.value === '0' ? '' : tile.value }}</span>
      </div>
    </div>

    <div class="loading__status">
      <h3>{{ t('simulation.loadingTitle') }}</h3>
      <p>{{ isPaused ? t('simulation.pausedDescription') : t('simulation.loadingDescription') }}</p>

      <div class="loading__metrics">
        <span>{{ t('stats.generatedNodes') }}: {{ generatedNodes }}</span>
        <span>{{ t('stats.openNodes') }}: {{ openNodes }}</span>
        <span>{{ t('simulation.elapsed') }}: {{ elapsedSeconds }}</span>
        <span v-if="isPaused">{{ t('simulation.pausedBadge') }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { IGameSetup } from '@/interfaces/IGameSetup'

interface Props {
  initialState: IGameSetup
  generatedNodes: number
  openNodes: number
  elapsedMs: number
  isPaused?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isPaused: false
})
const { t } = useI18n()

const isPaused = computed(() => props.isPaused)

const tileMotionProfile = [
  { delay: '0s', dx: '2px', dy: '-2px' },
  { delay: '0.08s', dx: '-2px', dy: '2px' },
  { delay: '0.16s', dx: '2px', dy: '2px' },
  { delay: '0.24s', dx: '-2px', dy: '-2px' },
  { delay: '0.32s', dx: '2px', dy: '0px' },
  { delay: '0.4s', dx: '-2px', dy: '0px' },
  { delay: '0.48s', dx: '2px', dy: '-2px' },
  { delay: '0.56s', dx: '-2px', dy: '2px' },
  { delay: '0.64s', dx: '0px', dy: '-2px' }
] as const

const loadingTiles = computed(() => {
  return props.initialState.map((value, index) => ({
    value,
    ...tileMotionProfile[index]
  }))
})

const elapsedSeconds = computed(() => `${(props.elapsedMs / 1000).toFixed(1)}s`)
</script>

<style scoped lang="scss">
.loading-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  gap: 16px;

  .loading__board {
    background: #6d3a3a;
    border: 2px solid #402121;
    border-radius: 14px;
    padding: 10px;

    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 4px;

    .loading__tile {
      width: 48px;
      height: 48px;
      border: 1px solid #2e2e2e;
      background: #f3f3f3;
      display: flex;
      align-items: center;
      justify-content: center;

      animation: tile-shift 0.9s ease-in-out infinite;
      animation-delay: var(--delay);

      &.--empty {
        background: #9e7a4b;
      }

      span {
        font-size: 26px;
        font-weight: 600;
      }
    }

    &.--paused {
      .loading__tile {
        animation-play-state: paused;
      }
    }
  }

  .loading__status {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;

    h3 {
      margin: 0;
      font-size: 20px;
    }

    p {
      margin: 0;
      color: #626262;
      text-align: center;
    }

    .loading__metrics {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
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
  }
}

@keyframes tile-shift {
  0%,
  100% {
    transform: translate(0, 0);
  }
  50% {
    transform: translate(var(--dx), var(--dy));
  }
}
</style>
