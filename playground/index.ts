import { HexWithTerrain, highlightSelectedHex, renderAll } from './render'
import { tilesToArray } from './tiles'
import { createHexPrototype, Grid, rectangle } from '../src'
import { Player } from './player'
import { Tile } from './terrain'

console.log(new Date())

const hexPrototype = createHexPrototype<HexWithTerrain>({
  dimensions: { width: 60, height: 51.96 },
  orientation: 'flat',
  origin: 'topLeft',
})

let grid = new Grid(hexPrototype, rectangle({ width: 12, height: 9 }))
grid.run()
// .traverse([at({ q: 0, r: 0 }), move(Compass.SE), move(Compass.NE)])
// .filter(inStore)
// .each(render)
// .run()

let selectedHex = '0,0'
let numberOfPlayers = (document.querySelector('#number-of-players') as HTMLInputElement).value

const players: Player[] = []
for (let i = 0; i < numberOfPlayers.length; i++) {
  players.push(new Player())
}

const renderTiles = (hexagonsOrdered: HexWithTerrain[]) => {
  renderAll(hexagonsOrdered)
  highlightSelectedHex(grid.store.get(selectedHex))
}

const printActiveHintsForPlayer = (player: Player) => {
  console.table(player.hints, ['name', 'isActive'])
}

const setIsActive = (hexagonsOrdered: HexWithTerrain[]) => {
  hexagonsOrdered.forEach((hex) => {
    const allPlayersHintsArrays: number[] = []
    players.forEach((player) => {
      let hintsArray = 0
      player.hints.forEach((hint) => {
        const isPossibleOnHex = hint.isActive && hint.isPossibleOnHex(grid, hex)
        hintsArray = hintsArray * 2 + (isPossibleOnHex ? 1 : 0)
      })
      allPlayersHintsArrays.push(hintsArray)
    })

    // we have all hints for all players,
    // we need at least as many 1s as there are players
    const ones = allPlayersHintsArrays.reduce((accumulator, current) => accumulator | current)
    const numberOfOnes = ones
      .toString(2)
      .split('')
      .reduce((accumulator, current) => accumulator + (current === '1' ? 1 : 0), 0)
    hex.isActive = numberOfOnes >= players.length
  })
}

const gatherAndRender = () => {
  numberOfPlayers = (document.querySelector('#number-of-players') as HTMLInputElement).value

  const values: string[] = []
  const forEach = Array.prototype.forEach
  forEach.call(document.querySelectorAll('.js-tilesPosition'), (el, i) => values.push(el.value || i + 1))
  forEach.call(document.querySelectorAll('.js-tilesPositionCheckbox'), (el, i) => (values[i] += el.checked ? 'r' : ''))

  const hexagonsOrdered: HexWithTerrain[] = []
  const tilesInArray = tilesToArray(values)

  let index = 0
  grid = grid.each((hex) => {
    hex.terrain = new Tile(tilesInArray[index++])
    hexagonsOrdered.push(hex)
  })
  grid.run()

  printActiveHintsForPlayer(players[0])
  setIsActive(hexagonsOrdered)
  renderTiles(hexagonsOrdered)
}

document.querySelectorAll('.js-tilesPosition').forEach((el) => el.addEventListener('input', gatherAndRender))
document.querySelectorAll('.js-tilesPositionCheckbox').forEach((el) => el.addEventListener('change', gatherAndRender))

document.addEventListener('click', (e) => {
  const clickEl = e.target as Element
  const hexEl = (clickEl && clickEl.closest('[data-hex]')) as HTMLElement
  if (!hexEl) return

  selectedHex = hexEl.dataset.hex || '0,0'
  const hex = grid.store.get(selectedHex)!
  highlightSelectedHex(hex)
})

document.querySelector('.js-submit')?.addEventListener('click', () => {
  const gameplayEl = document.getElementById('gameplay')! as HTMLInputElement
  const playerColor = (document.querySelector('select[name="player"]')! as HTMLInputElement).value
  const habitat = document.querySelector('input[name="habitat"]')! as HTMLInputElement
  gameplayEl.value += `${playerColor} ${selectedHex} ${habitat.checked ? '✅' : '⛔️'}\n`
  gameplayEl.scrollTop = gameplayEl.scrollHeight

  const player = players[0]
  player.activeHints.forEach((hint) => hint.evaluate(grid, grid.store.get(selectedHex)!, habitat.checked))

  gatherAndRender()
})

gatherAndRender()
