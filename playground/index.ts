import { HexWithTerrain, renderAll } from './render'
import { TILES } from './tiles'
import { createHexPrototype, Grid, Hex, rectangle } from '../src'

interface CustomHex extends Hex {
  terrain: string
}

const hexPrototype = createHexPrototype<CustomHex>({
  dimensions: { width: 60, height: 51.96 },
  orientation: 'flat',
  origin: 'topLeft',
})

const grid = new Grid(hexPrototype, rectangle({ width: 12, height: 9 }))
// .traverse([at({ q: 0, r: 0 }), move(Compass.SE), move(Compass.NE)])
// .filter(inStore)
// .each(render)
// .run()
// console.log(grid.store)

const tilesToArray = (tilesOrder: string[]) => {
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
        const leftTiles = tiles[tilesIndex[pair * 2]]
        result.push(leftTiles[j * 6 + coordinate])
      }
      for (let coordinate = 0; coordinate < 6; coordinate++) {
        const rightTiles = tiles[tilesIndex[pair * 2 + 1]]
        result.push(rightTiles[j * 6 + coordinate])
      }
    }
  }

  return result
}

const renderTiles = (tilesOrder: string[]) => {
  const hexagonsOrdered: HexWithTerrain[] = []
  const tilesInArray = tilesToArray(tilesOrder)

  // grid.each(render)
  let index = 0
  grid
    .each((hex, grid) => {
      hex.terrain = tilesInArray[index]
      hexagonsOrdered.push(hex)
      // grid.store.set(`${hex.q},${hex.r}`, hex)
      // console.log('tilesInArray[' + index + ']:', tilesInArray[index])
      index++
      // render(hex)
    })
    .run()
  renderAll(hexagonsOrdered)
}

const gatherAndRender = () => {
  const values: string[] = []
  Array.prototype.forEach.call(document.querySelectorAll('.js-tilesPosition'), (el, i) =>
    values.push(el.value || i + 1),
  )
  document.querySelectorAll('.js-tilesPositionCheckbox').forEach((el, i) => {
    const element = el as HTMLInputElement
    values[i] += element.checked ? 'r' : ''
  })
  renderTiles(values)
}

document.querySelectorAll('.js-tilesPosition').forEach((el) => el.addEventListener('input', gatherAndRender))

document.querySelectorAll('.js-tilesPositionCheckbox').forEach((el) => {
  el.addEventListener('change', gatherAndRender)
})

gatherAndRender()
