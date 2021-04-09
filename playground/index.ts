import { HexWithTerrain, highlightSelectedHex, renderAll } from './render'
import { tilesToArray } from './tiles'
import { cloneHex, createHexPrototype, Grid, rectangle } from '../src'
import { Player } from './player'
import { Tile } from './terrain'

const hexPrototype = createHexPrototype<HexWithTerrain>({
  dimensions: { width: 60, height: 51.96 },
  orientation: 'flat',
  origin: 'topLeft',
})

let grid = new Grid(hexPrototype, rectangle({ width: 12, height: 9 }))

let selectedHexKey = '0,0'

let players: Player[] = []

const renderTiles = (hexagonsOrdered: HexWithTerrain[]) => {
  renderAll(hexagonsOrdered)
  highlightSelectedHex(grid.store.get(selectedHexKey)!)
}

const printActiveHintsForPlayers = () => {
  players.forEach((player) => console.log(player.activeHints.map((h) => h.name).join(', ')))
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
    const ones = allPlayersHintsArrays.reduce((accumulator, current) => accumulator | current, 0)
    const numberOfOnes = ones
      .toString(2)
      .split('')
      .reduce((accumulator, current) => accumulator + (current === '1' ? 1 : 0), 0)
    hex.isActive = numberOfOnes >= players.length
  })
}

const printBestHexToAsk = (hexagonsOrdered: HexWithTerrain[]) => {
  let maxNumberOfOnes = -1
  let possibleHexes: HexWithTerrain[] = []

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

    const ones = allPlayersHintsArrays.reduce((accumulator, current) => accumulator | current, 0)
    const numberOfOnes = ones
      .toString(2)
      .split('')
      .reduce((accumulator, current) => accumulator + (current === '1' ? 1 : 0), 0)
    if (numberOfOnes > maxNumberOfOnes) {
      maxNumberOfOnes = numberOfOnes
      possibleHexes = []
    }
    if (numberOfOnes === maxNumberOfOnes) {
      possibleHexes.push(hex)
    }
  })

  console.log('Possible hexes:', possibleHexes.length)
  const oneOfPossibleHexes = possibleHexes[Math.floor(Math.random() * possibleHexes.length)]
  console.log('Possible hex:', oneOfPossibleHexes)
}

const gatherAndRender = () => {
  const hexagonsOrdered = grid.hexes()

  printActiveHintsForPlayers()
  setIsActive(hexagonsOrdered)
  renderAll(hexagonsOrdered)
  highlightSelectedHex(grid.store.get(selectedHexKey)!)
  printBestHexToAsk(hexagonsOrdered)
}

document.addEventListener('click', (e) => {
  const clickEl = e.target as Element
  const hexEl = (clickEl && clickEl.closest('[data-hex]')) as HTMLElement
  if (!hexEl) return

  selectedHexKey = hexEl.dataset.hex || '0,0'
  const hex = grid.store.get(selectedHexKey)!
  highlightSelectedHex(hex)
})

document.querySelector('.js-submit')?.addEventListener('click', () => {
  const gameplayEl = document.getElementById('gameplay')! as HTMLInputElement
  const playerName = (document.querySelector('select[name="player"]')! as HTMLInputElement).value
  const habitat = document.querySelector('input[name="habitat"]')! as HTMLInputElement
  gameplayEl.value += `${playerName} ${selectedHexKey} ${habitat.checked ? '✅' : '⛔️'}\n`
  gameplayEl.scrollTop = gameplayEl.scrollHeight

  const player = players.find((player) => player.name === playerName)!
  player.activeHints.forEach((hint) => hint.evaluate(grid, grid.store.get(selectedHexKey)!, habitat.checked))

  gatherAndRender()
})

document.querySelector('.js-placeStandingStone')!.addEventListener('click', () => {
  const stoneColor = (document.getElementById('standing-stone-color')! as HTMLInputElement).value

  const hex = grid.store.get(selectedHexKey)!
  const newHex = cloneHex(hex)
  newHex.terrain = new Tile(`${newHex.terrain.type} ${stoneColor}-stepping-stone`)
  grid = grid.update((grid) => {
    grid.store.set(selectedHexKey, newHex)
  })

  gatherAndRender()
})

document.querySelector('.js-placeAbandonedShack')!.addEventListener('click', () => {
  const stoneColor = (document.getElementById('abandoned-shack-color')! as HTMLInputElement).value

  const hex = grid.store.get(selectedHexKey)!
  const newHex = cloneHex(hex)
  newHex.terrain = new Tile(`${newHex.terrain.type} ${stoneColor}-abandoned-shack`)
  grid = grid.update((grid) => {
    grid.store.set(selectedHexKey, newHex)
  })
  gatherAndRender()
})

const renderMap = () => {
  const values: string[] = []
  const forEach = Array.prototype.forEach
  forEach.call(document.querySelectorAll('.js-tilesPosition'), (el, i) => values.push(el.value || i + 1))
  forEach.call(document.querySelectorAll('.js-tilesPositionCheckbox'), (el, i) => (values[i] += el.checked ? 'r' : ''))

  const tilesInArray = tilesToArray(values)

  let index = 0
  grid = grid
    .each((hex) => {
      hex.terrain = new Tile(tilesInArray[index++])
    })
    .run()

  renderTiles(grid.hexes())
}

document.querySelectorAll('.js-tilesPosition').forEach((el) => el.addEventListener('input', renderMap))
document.querySelectorAll('.js-tilesPositionCheckbox').forEach((el) => el.addEventListener('change', renderMap))
renderMap()

document.querySelector('.js-startGame')!.addEventListener('click', () => {
  const numberOfPlayers = Number((document.querySelector('#number-of-players') as HTMLInputElement).value!)
  players = []
  for (let i = 0; i < numberOfPlayers; i++) {
    players.push(new Player())
  }

  const hintSelected = (document.querySelector('.js-initialHint')! as HTMLInputElement).value
  players.forEach((player) => player.hints.forEach((hint) => (hint.isActive = hint.name !== hintSelected)))
  players[0].hints.forEach((hint) => (hint.isActive = hint.name === hintSelected))

  const playerPlayingDropdown = document.querySelector('.js-playerPlaying')!

  for (let i = 0; i < players.length; i++) {
    players[i].name = (document.querySelector('input[name="player-' + i + '"]')! as HTMLInputElement).value
    playerPlayingDropdown.innerHTML += '<option value="' + players[i].name + '">' + players[i].name + '</option>'
  }

  document.querySelector('.js-gameSetup')!.setAttribute('hidden', '')
  document.querySelector('.js-gameplay')!.removeAttribute('hidden')

  printBestHexToAsk(grid.hexes())
})
