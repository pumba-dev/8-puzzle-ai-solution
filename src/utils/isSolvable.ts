import type { IGameSetup } from '@/interfaces/IGameSetup'

export function countInversions(gameSetup: IGameSetup) {
  const tiles = gameSetup.filter((tile) => tile !== '' && tile !== '0')
  let inversions = 0

  for (let i = 0; i < tiles.length; i++) {
    for (let j = i + 1; j < tiles.length; j++) {
      if (Number(tiles[i]) > Number(tiles[j])) {
        inversions++
      }
    }
  }

  return inversions
}

export default function isSolvable(gameSetup: IGameSetup) {
  if (gameSetup.length !== 9) {
    return false
  }

  if (gameSetup.some((tile) => tile === '')) {
    return false
  }

  return countInversions(gameSetup) % 2 === 0
}
