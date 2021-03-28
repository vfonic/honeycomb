import { at, Compass, createHexPrototype, Grid, Hex, inStore, move, rectangle } from '../dist'
import { render } from './render'
import { TILE_ONE } from './tiles'

interface CustomHex extends Hex {
  terrain: string
}

const hexPrototype = createHexPrototype<CustomHex>({
  dimensions: { width: 50, height: 50 },
  orientation: 'flat',
  origin: 'topLeft',
})
// const hex = createHex(hexPrototype, { q: 4, r: 3 })

const grid = new Grid(hexPrototype, rectangle({ width: 12, height: 9 }))
  .traverse([at({ q: 0, r: 0 }), move(Compass.SE), move(Compass.NE)])
  // .traverse([start({ q: 9, r: 0 }), line(Compass.SE, 4), line(Compass.SW, 4)])
  .filter(inStore)
  .each(render)

// TILE_ONE.forEach((terrain, index) => {
for (let i = 0; i < 3; i++) {
  const terrain = TILE_ONE[i]
  const index = i
  const hex = grid.getHex({ q: index, r: 0 })
  hex.terrain = terrain
  grid.store.set(`${index},${0}`, hex)
  console.log(`grid[${index}][${0}] = ${terrain}`)
}
// })

grid.traverse([move(Compass.SE)])

grid.run()
console.log(grid.store)
