export const D = 'desert',
  F = 'forest',
  M = 'mountain',
  S = 'swamp',
  W = 'water',
  DB = 'desert bears',
  FB = 'forest bears',
  MB = 'mountain bears',
  WB = 'water bears',
  FC = 'forest cougars',
  MC = 'mountain cougars',
  SC = 'swamp cougars',
  WC = 'water cougars'

export const TILE_ONE = [W, W, W, W, F, F, S, S, W, D, F, F, S, S, D, DB, DB, FB]
export const TILE_TWO = [SC, FC, FC, F, F, F, S, S, F, D, D, D, S, M, M, M, M, D]
export const TILE_THREE = [S, S, F, F, F, W, SC, SC, F, M, W, W, MC, M, M, M, W, W]
export const TILE_FOUR = [D, D, M, M, M, M, D, D, M, W, W, WC, D, D, D, F, F, FC]
export const TILE_FIVE = [S, S, S, M, M, M, S, D, D, W, M, MB, D, D, W, W, WB, WB]
export const TILE_SIX = [DB, D, S, S, S, F, MB, M, S, S, F, F, M, W, W, W, W, F]

export const TILES = [TILE_ONE, TILE_TWO, TILE_THREE, TILE_FOUR, TILE_FIVE, TILE_SIX]

export const tilesToArray = (tilesOrder: string[]) => {
  const tilesIndex: number[] = []

  const tiles: string[][] = []
  tilesOrder.forEach((tile) => {
    const tileIndex = Number(tile[0]) - 1 // convert to zero-based index
    tilesIndex.push(tileIndex)

    const isFlipped = !!tile[1]
    tiles.push(isFlipped ? [...TILES[tileIndex]].reverse() : TILES[tileIndex])
  })

  const result = []

  for (let pair = 0; pair < 3; pair++) {
    for (let j = 0; j < 3; j++) {
      for (let coordinate = 0; coordinate < 6; coordinate++) {
        const leftTiles = tiles[pair * 2]
        result.push(leftTiles[j * 6 + coordinate])
      }
      for (let coordinate = 0; coordinate < 6; coordinate++) {
        const rightTiles = tiles[pair * 2 + 1]
        result.push(rightTiles[j * 6 + coordinate])
      }
    }
  }
  return result
}
