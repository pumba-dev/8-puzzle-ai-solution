<template>
  <div class="setup-board">
    <div class="setup-board__grid">
      <a-popover
        :key="index"
        trigger="click"
        placement="bottom"
        :open="openCellIndex === index"
        @openChange="handlePopoverChange(index, $event)"
        v-for="(piece, index) in modelValue"
      >
        <template #content>
          <div class="setup-board__options">
            <button
              :key="option"
              class="setup-board__option"
              :class="{ '--selected': piece === option }"
              :disabled="isOptionDisabled(option, index)"
              @click="handleSelect(index, option)"
              type="button"
              v-for="option in tileOptions"
            >
              {{ option === '0' ? 'Empty (0)' : option }}
            </button>

            <button
              class="setup-board__option --clear"
              :disabled="piece === ''"
              @click="handleClear(index)"
              type="button"
            >
              Clear Cell
            </button>
          </div>
        </template>

        <button
          class="setup-board__cell"
          :class="{
            '--is-empty-tile': piece === '0',
            '--is-unset': piece === '',
            '--is-open': openCellIndex === index
          }"
          @click="openCell(index)"
          type="button"
        >
          <span>{{ piece === '' || piece === '0' ? '' : piece }}</span>
          <small v-if="piece === ''">set</small>
        </button>
      </a-popover>
    </div>

    <p class="setup-board__hint">
      Click a tile to choose a value from 0 to 8. 0 means the empty space.
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import type { IGameSetup } from '@/interfaces/IGameSetup'

type TileValue = Exclude<IGameSetup[number], ''>

interface Props {
  modelValue: IGameSetup
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (event: 'update:modelValue', value: IGameSetup): void
}>()

const tileOptions: TileValue[] = ['0', '1', '2', '3', '4', '5', '6', '7', '8']
const openCellIndex = ref<number | null>(null)

function openCell(index: number) {
  openCellIndex.value = openCellIndex.value === index ? null : index
}

function handlePopoverChange(index: number, isOpen: boolean) {
  if (!isOpen && openCellIndex.value === index) {
    openCellIndex.value = null
    return
  }

  if (isOpen) {
    openCellIndex.value = index
  }
}

function isOptionDisabled(option: TileValue, index: number) {
  return props.modelValue.some((piece, pieceIndex) => pieceIndex !== index && piece === option)
}

function handleSelect(index: number, value: TileValue) {
  const nextSetup = [...props.modelValue] as IGameSetup
  nextSetup[index] = value

  emit('update:modelValue', nextSetup)
  openCellIndex.value = null
}

function handleClear(index: number) {
  const nextSetup = [...props.modelValue] as IGameSetup
  nextSetup[index] = ''

  emit('update:modelValue', nextSetup)
  openCellIndex.value = null
}
</script>

<style scoped lang="scss">
.setup-board {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;

  .setup-board__grid {
    background: #6d3a3a;
    border: 2px solid #402121;
    border-radius: 12px;
    padding: 10px;

    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 4px;
  }

  .setup-board__cell {
    width: 72px;
    height: 72px;
    border: 1px solid #2e2e2e;
    background: #f3f3f3;
    color: #1a1a1a;

    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;

    transition:
      transform 0.2s ease,
      box-shadow 0.2s ease;

    &:hover {
      cursor: pointer;
      transform: translateY(-1px);
      box-shadow: 0 4px 8px rgb(0 0 0 / 15%);
    }

    &.--is-open {
      box-shadow: 0 0 0 2px #1890ff;
    }

    &.--is-empty-tile {
      background: #9e7a4b;
    }

    &.--is-unset {
      background: #ebe8e8;
    }

    span {
      font-size: 32px;
      font-weight: 600;
      line-height: 1;
    }

    small {
      font-size: 12px;
      color: #757575;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    @media (max-width: 425px) {
      width: 58px;
      height: 58px;

      span {
        font-size: 28px;
      }
    }
  }

  .setup-board__hint {
    max-width: 280px;
    text-align: center;
    line-height: 1.4;
    color: #595959;
    font-size: 13px;
  }
}

.setup-board__options {
  width: 210px;

  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;

  .setup-board__option {
    border: 1px solid #d9d9d9;
    border-radius: 6px;
    padding: 6px;
    background: #fff;
    color: #262626;
    font-size: 13px;

    &:hover:not(:disabled) {
      cursor: pointer;
      border-color: #1677ff;
      color: #1677ff;
    }

    &:disabled {
      cursor: not-allowed;
      color: #a8a8a8;
      background: #f5f5f5;
    }

    &.--selected {
      border-color: #1677ff;
      background: #e6f4ff;
      color: #1677ff;
      font-weight: 600;
    }

    &.--clear {
      grid-column: 1 / -1;
      font-weight: 500;
    }
  }
}
</style>
