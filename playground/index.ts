import { HexWithTerrain, highlightPossibleHexes, highlightSelectedHex, renderAll } from './render'
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
let isGameStarted = false

let players: Player[] = []

const renderTiles = (hexagonsOrdered: HexWithTerrain[]) => {
  renderAll(hexagonsOrdered)
  highlightSelectedHex(grid.store.get(selectedHexKey)!)
}

// const printActiveHintsForPlayers = () => {
//   players.forEach((player) => {
//     console.log(`${player.name}:`)
//     console.log(player.activeHints.map((h) => h.name).join('\n'))
//     console.log('')
//   })
// }

const renderPlayerHints = () => {
  players.forEach((player, i) => {
    if (i === 0) return

    document.querySelector('.js-player-' + i)!.innerHTML = `
      <h4>${players[i].name}</h4>
      ${player.activeHints.map((hint) => `<div>${hint}</div>`).join('')}
    `
  })
}

const renderPlayerHintsForHighlightedHex = () => {
  if (!isGameStarted) return

  const shortenName = (name: string) =>
    name
      .replace(' three ', ' 3 ')
      .replace(' two ', ' 2 ')
      .replace(' one ', ' 1 ')
      .replace('bear territory', 'bears')
      .replace('cougar territory', 'cougars')
      .replace('an abandoned shack', 'a shack')
      .replace(' structure', '')
      .replace(' either animal territory', 'any animal')

  const hex = grid.store.get(selectedHexKey)!

  players.forEach((player, i) => {
    document.querySelector('.js-playerHighlightedHex-' + i)!.innerHTML = `
      <h4>${players[i].name} [${selectedHexKey}]</h4>
      ${player.activeHints
        .filter((hint) => hint.isPossibleOnHex(grid, hex))
        .map((hint) => `<div>${shortenName(hint.name)}</div>`)
        .join('')}
    `
  })
}

const setActiveHexes = (hexagonsOrdered: HexWithTerrain[], force = false) => {
  hexagonsOrdered.forEach((hex) => {
    const allPlayersHintsArrays: number[] = []
    players.forEach((player) => {
      let hintsArray = 0
      player.hints.forEach((hint) => {
        const isPossibleOnHex = hint.isActive && hint.isPossibleOnHex(grid, hex)
        hintsArray = hintsArray * 2 + (isPossibleOnHex ? 1 : 0)
      })
      hintsArray && allPlayersHintsArrays.push(hintsArray)
    })

    // if we skipped one player because he didn't have a single hint possible on the hex, hex is inactive
    if (allPlayersHintsArrays.length !== players.length) {
      hex.isActive = false
      return
    }

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

const printAndHighlightBestHexes = (hexagonsOrdered: HexWithTerrain[]) => {
  let maxNumberOfOnes = -1
  let possibleHexes: HexWithTerrain[] = []
  const allPossibleHexes: HexWithTerrain[] = []

  hexagonsOrdered.forEach((hex) => {
    const allPlayersHintsArrays: number[] = []
    players.forEach((player) => {
      let hintsArray = 0
      player.hints.forEach((hint) => {
        const isPossibleOnHex = hint.isActive && hint.isPossibleOnHex(grid, hex)
        hintsArray = hintsArray * 2 + (isPossibleOnHex ? 1 : 0)
      })
      hintsArray && allPlayersHintsArrays.push(hintsArray)
    })

    // if we skipped one player because he didn't have a single hint possible on the hex, skip adding hex
    if (allPlayersHintsArrays.length !== players.length) return

    // count each possible hint only once:
    // 1010 | 1100 = 1110 => 3x 1 (three active hints)
    const ones = allPlayersHintsArrays.reduce((accumulator, current) => accumulator | current, 0)

    const numberOfOnes = ones
      .toString(2)
      .split('')
      .reduce((accumulator, current) => accumulator + (current === '1' ? 1 : 0), 0)

    allPossibleHexes.push(hex)

    if (numberOfOnes > maxNumberOfOnes) {
      maxNumberOfOnes = numberOfOnes
      possibleHexes = []
    }
    if (numberOfOnes === maxNumberOfOnes) {
      possibleHexes.push(hex)
    }
  })

  // remove past possible hexes
  document.querySelectorAll('.js-possibleHex').forEach((el) => el.remove())

  highlightPossibleHexes(possibleHexes)
}

const gatherAndRender = () => {
  const hexagonsOrdered = grid.hexes()

  isGameStarted && setActiveHexes(hexagonsOrdered)

  renderPlayerHints()
  // renderPlayerHintsForHighlightedHex()

  // printActiveHintsForPlayers()
  renderAll(hexagonsOrdered)
  highlightSelectedHex(grid.store.get(selectedHexKey)!)

  isGameStarted && printAndHighlightBestHexes(hexagonsOrdered)
}

document.addEventListener('click', (e) => {
  const clickEl = e.target as Element
  const hexEl = (clickEl && clickEl.closest('[data-hex]')) as HTMLElement
  if (!hexEl) return

  selectedHexKey = hexEl.dataset.hex || '0,0'
  const hex = grid.store.get(selectedHexKey)!
  highlightSelectedHex(hex)

  // renderPlayerHintsForHighlightedHex()
})

document.querySelector('.js-submit')?.addEventListener('click', () => {
  const gameplayEl = document.getElementById('gameplay')!
  const playerName = (document.querySelector('select[name="player"]')! as HTMLInputElement).value
  const habitat = document.querySelector('input[name="habitat"]')! as HTMLInputElement
  gameplayEl.innerHTML += `<div>${playerName} ${selectedHexKey} ${habitat.checked ? '✅' : '⛔️'}</div>`
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
  // create players
  const numberOfPlayers = Number((document.querySelector('#number-of-players') as HTMLInputElement).value!)
  players = []
  for (let i = 0; i < numberOfPlayers; i++) {
    players.push(new Player())
  }

  // disable current player hint for other players
  const currentPlayer = players[0]
  const hintSelected = (document.querySelector('.js-initialHint')! as HTMLInputElement).value
  players.forEach((player) => player.hints.forEach((hint) => (hint.isActive = hint.name !== hintSelected)))
  currentPlayer.hints.forEach((hint) => (hint.isActive = hint.name === hintSelected))

  // disable all other hints that are not compatible with current player's hint
  // for example, if current player has a hint "On forest or desert",
  // another player cannot have "On water or swamp"
  // because those two don't have shared tiles
  const activeHint = currentPlayer.activeHints[0]
  const activeHexes = grid.hexes().filter((hex) => activeHint.isPossibleOnHex(grid, hex))
  players.forEach((player) => {
    player.activeHints.forEach((hint) => {
      hint.isActive = activeHexes.some((hex) => hint.isPossibleOnHex(grid, hex))
    })
  })

  // render dropdown options
  // skip current player
  const playerPlayingDropdown = document.querySelector('.js-playerPlaying')!
  for (let i = 1; i < players.length; i++) {
    players[i].name = (document.querySelector('input[name="player-' + i + '"]')! as HTMLInputElement).value
    playerPlayingDropdown.innerHTML += '<option value="' + players[i].name + '">' + players[i].name + '</option>'
  }

  renderPlayerHints()

  // show gameplay
  isGameStarted = true
  document.querySelector('.js-gameSetup')!.setAttribute('hidden', '')
  document.querySelector('.js-gameplay')!.removeAttribute('hidden')

  gatherAndRender()

  // printBestHexToAsk(grid.hexes())
})
;(document.querySelector('#number-of-players') as HTMLInputElement).addEventListener('input', (el) => {
  const playersNumber = Number((el.target as HTMLInputElement).value)
  const playerNamesEl = document.querySelector('.js-playerNames')!
  const playersEl = document.querySelector('.js-players')!
  const playerHighlightedHexesEl = document.querySelector('.js-playerHighlightedHexes')!

  playerNamesEl.innerHTML = ''
  playersEl.innerHTML = ''
  playerHighlightedHexesEl.innerHTML = ''
  for (let i = 0; i < playersNumber; i++) {
    playerNamesEl.innerHTML += `
      <div class='col-4'>
        <input class='form-control' name='player-${i}' placeholder='Player ${i + 1} name' />
      </div>
    `

    if (i !== 0) playersEl.innerHTML += `<div class='col-4 mt-3 js-player-${i}'></div>`

    playerHighlightedHexesEl.innerHTML += `<div class='col-4 player-highlighted-hex js-playerHighlightedHex-${i}'></div>`
  }
})
