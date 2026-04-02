<template>
  <section class="state-stream" :style="streamStyle">
    <div class="state-stream__header">
      <h3>{{ t('simulation.liveBorderTitle') }}</h3>
      <div class="state-stream__stats">
        <span>{{ t('stats.generatedNodes') }}: {{ generatedNodes }}</span>
        <span>{{ t('stats.openNodes') }}: {{ openNodes }}</span>
        <span>{{ t('stats.maxDepth') }}: {{ maxDepth }}</span>
        <span>{{ t('stats.maxStatesBorderSize') }}: {{ maxStateBorder }}</span>
      </div>
    </div>

    <div class="state-stream__content">
      <TransitionGroup
        name="stream-expansion"
        tag="div"
        class="state-stream__timeline"
        :duration="transitionDurations"
        v-if="expansions.length"
      >
        <article
          :class="{ '--latest': index === expansions.length - 1 }"
          :key="expansion.tick"
          class="state-stream__expansion"
          v-for="(expansion, index) in expansions"
        >
          <div class="expansion__meta">
            <span>{{ t('simulation.liveBorderExpansion', { tick: expansion.tick }) }}</span>
          </div>

          <div class="expansion__flow">
            <div class="flow__group">
              <span class="flow__label">{{ t('simulation.liveBorderFromState') }}</span>
              <GameStateBoard
                :gameSetupData="expansion.parentState"
                :showHeuristic="false"
                size="regular"
              />
            </div>

            <span class="flow__arrow">→</span>

            <div class="flow__group --children">
              <span class="flow__label">{{ t('simulation.liveBorderOpenedStates') }}</span>

              <div class="flow__children-grid" v-if="expansion.openedStates.length">
                <GameStateBoard
                  :gameSetupData="openedState"
                  :key="`${expansion.tick}-${openedState.join('')}-${childIndex}`"
                  :showHeuristic="false"
                  size="compact"
                  v-for="(openedState, childIndex) in expansion.openedStates"
                />
              </div>

              <span class="flow__no-children" v-else>
                {{ t('simulation.liveBorderNoNewStates') }}
              </span>
            </div>
          </div>
        </article>
      </TransitionGroup>

      <div class="state-stream__empty" v-else>
        {{ t('simulation.liveBorderEmpty') }}
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import GameStateBoard from '@/components/shared/GameStateBoard.vue'
import type { WorkerStateExpansion } from '@/workers/workerProtocol'

interface Props {
  expansions: WorkerStateExpansion[]
  generatedNodes: number
  openNodes: number
  maxDepth: number
  maxStateBorder: number
  animationDurationMs?: number
}

const props = withDefaults(defineProps<Props>(), {
  animationDurationMs: 350
})

const streamStyle = computed(() => ({
  '--stream-animation-duration': `${props.animationDurationMs}ms`
}))

const transitionDurations = computed(() => ({
  enter: props.animationDurationMs,
  leave: 0
}))

const { t } = useI18n()
</script>

<style scoped lang="scss">
.state-stream {
  width: min(980px, 100%);
  border: 1px solid #d8d8d8;
  border-radius: 14px;
  background: linear-gradient(180deg, #fff 0%, #f8fafc 100%);
  padding: 14px;

  display: flex;
  flex-direction: column;
  gap: 12px;

  .state-stream__header {
    display: flex;
    flex-direction: column;
    gap: 10px;

    h3 {
      margin: 0;
      font-size: 18px;
    }

    .state-stream__stats {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;

      span {
        font-size: 12px;
        border: 1px solid #b8d4f5;
        color: #1d3f6d;
        background: #eef6ff;
        padding: 4px 8px;
        border-radius: 999px;
      }
    }
  }

  .state-stream__content {
    border: 1px dashed #bfc8d2;
    border-radius: 10px;
    padding: 10px;
    min-height: 170px;

    .state-stream__timeline {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .state-stream__expansion {
      border: 1px solid #d4deea;
      border-radius: 12px;
      background: linear-gradient(135deg, #ffffff 0%, #f7fbff 100%);
      padding: 10px;

      display: flex;
      flex-direction: column;
      gap: 10px;

      &.--latest {
        border-color: #6ea8e6;
        box-shadow: 0 0 0 2px rgba(110, 168, 230, 0.16);
      }

      .expansion__meta {
        display: flex;
        align-items: center;

        span {
          font-size: 12px;
          font-weight: 700;
          color: #1d4a78;
          border-radius: 999px;
          border: 1px solid #c4ddf6;
          background: #eef6ff;
          padding: 3px 9px;
        }
      }

      .expansion__flow {
        display: grid;
        grid-template-columns: auto 24px 1fr;
        align-items: center;
        gap: 8px;

        .flow__group {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 7px;

          .flow__label {
            font-size: 12px;
            color: #4e4e4e;
            font-weight: 600;
          }

          &.--children {
            align-items: flex-start;
            width: 100%;

            .flow__children-grid {
              width: 100%;
              display: flex;
              flex-wrap: wrap;
              gap: 8px;
            }

            .flow__no-children {
              font-size: 12px;
              color: #6b6b6b;
              font-style: italic;
            }
          }
        }

        .flow__arrow {
          font-size: 20px;
          color: #2a6fb6;
          font-weight: 700;
          text-align: center;
        }
      }
    }

    .state-stream__empty {
      min-height: 145px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #6f6f6f;
      text-align: center;
    }
  }
}

.stream-expansion-enter-active,
.stream-expansion-move {
  transition: all var(--stream-animation-duration) ease;
}

.stream-expansion-leave-active {
  transition: none;
}

.stream-expansion-enter-from {
  opacity: 0;
  transform: translateY(16px) scale(0.96);
}

.stream-expansion-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .state-stream {
    .state-stream__content {
      .state-stream__expansion {
        .expansion__flow {
          grid-template-columns: 1fr;

          .flow__arrow {
            transform: rotate(90deg);
            line-height: 1;
          }

          .flow__group {
            &.--children {
              align-items: center;

              .flow__children-grid {
                justify-content: center;
              }
            }
          }
        }
      }
    }

    .state-stream__header {
      .state-stream__stats {
        gap: 8px;

        span {
          font-size: 11px;
        }
      }
    }
  }
}
</style>
