// type Hint = {
//   isActive: ActiveType
//   isPossibleOnHex: (grid: Grid<HexWithTerrain>, hex: HexWithTerrain) => boolean
//   evaluate: (hex: HexWithTerrain, isHabitat: boolean) => void
//   name: string
// }

import { Grid } from '../src'
import { HexWithTerrain } from './render'

const ON_FOREST_OR_DESERT = 0
const ON_FOREST_OR_WATER = 1
const ON_FOREST_OR_SWAMP = 2
const ON_FOREST_OR_MOUNTAIN = 3

const ON_DESERT_OR_WATER = 4
const ON_DESERT_OR_SWAMP = 5
const ON_DESERT_OR_MOUNTAIN = 6
const ON_WATER_OR_SWAMP = 7
const ON_WATER_OR_MOUNTAIN = 8
const ON_SWAMP_OR_MOUNTAIN = 9

export const ALL_HINTS = [
  {
    isPossibleOnHex: (grid: Grid<HexWithTerrain>, hex: HexWithTerrain): boolean =>
      hex.terrain.isForest() || hex.terrain.isDesert(),
    name: 'on forest or desert',
  },
  {
    isPossibleOnHex: (grid: Grid<HexWithTerrain>, hex: HexWithTerrain): boolean =>
      hex.terrain.isForest() || hex.terrain.isWater(),
    name: 'on forest or water',
  },
  {
    isPossibleOnHex: (grid: Grid<HexWithTerrain>, hex: HexWithTerrain): boolean =>
      hex.terrain.isForest() || hex.terrain.isSwamp(),
    name: 'on forest or swamp',
  },
  {
    isPossibleOnHex: (grid: Grid<HexWithTerrain>, hex: HexWithTerrain): boolean =>
      hex.terrain.isForest() || hex.terrain.isMountain(),
    name: 'on forest or mountain',
  },
  {
    isPossibleOnHex: (grid: Grid<HexWithTerrain>, hex: HexWithTerrain): boolean =>
      hex.terrain.isDesert() || hex.terrain.isWater(),
    name: 'on desert or water',
  },
  {
    isPossibleOnHex: (grid: Grid<HexWithTerrain>, hex: HexWithTerrain): boolean =>
      hex.terrain.isDesert() || hex.terrain.isSwamp(),
    name: 'on desert or swamp',
  },
  {
    isPossibleOnHex: (grid: Grid<HexWithTerrain>, hex: HexWithTerrain): boolean =>
      hex.terrain.isDesert() || hex.terrain.isMountain(),
    name: 'on desert or mountain',
  },
  {
    isPossibleOnHex: (grid: Grid<HexWithTerrain>, hex: HexWithTerrain): boolean =>
      hex.terrain.isWater() || hex.terrain.isSwamp(),
    name: 'on water or swamp',
  },
  {
    isPossibleOnHex: (grid: Grid<HexWithTerrain>, hex: HexWithTerrain): boolean =>
      hex.terrain.isWater() || hex.terrain.isMountain(),
    name: 'on water or mountain',
  },
  {
    isPossibleOnHex: (grid: Grid<HexWithTerrain>, hex: HexWithTerrain): boolean =>
      hex.terrain.isSwamp() || hex.terrain.isMountain(),
    name: 'on swamp or mountain',
  },

  {
    isPossibleOnHex: (grid: Grid<HexWithTerrain>, hex: HexWithTerrain): boolean => {
      const hexes = grid.hexesInRange(hex, 1)
      return hexes.some((hex) => hex.terrain.isForest())
    },
    name: 'within one space of forest',
  },
  {
    isPossibleOnHex: (grid: Grid<HexWithTerrain>, hex: HexWithTerrain): boolean => {
      const hexes = grid.hexesInRange(hex, 1)
      return hexes.some((hex) => hex.terrain.isDesert())
    },
    name: 'within one space of desert',
  },
  {
    isPossibleOnHex: (grid: Grid<HexWithTerrain>, hex: HexWithTerrain): boolean => {
      const hexes = grid.hexesInRange(hex, 1)
      return hexes.some((hex) => hex.terrain.isSwamp())
    },
    name: 'within one space of swamp',
  },
  {
    isPossibleOnHex: (grid: Grid<HexWithTerrain>, hex: HexWithTerrain): boolean => {
      const hexes = grid.hexesInRange(hex, 1)
      return hexes.some((hex) => hex.terrain.isMountain())
    },
    name: 'within one space of mountain',
  },
  {
    isPossibleOnHex: (grid: Grid<HexWithTerrain>, hex: HexWithTerrain): boolean => {
      const hexes = grid.hexesInRange(hex, 1)
      return hexes.some((hex) => hex.terrain.isWater())
    },
    name: 'within one space of water',
  },
  {
    isPossibleOnHex: (grid: Grid<HexWithTerrain>, hex: HexWithTerrain): boolean => {
      const hexes = grid.hexesInRange(hex, 1)
      return hexes.some((hex) => hex.terrain.hasBears() || hex.terrain.hasCougars())
    },
    name: 'within one space of either animal territory',
  },

  // {
  //   isPossibleOnHex: (grid: Grid<HexWithTerrain>, hex: HexWithTerrain): boolean => {
  //     const hexes = grid.hexesInRange(hex, 1)
  //     return hexes.some((hex) => hex.terrain.hasBears() || hex.terrain.hasCougars())
  //   },
  //   name: 'within two spaces of a standing stone',
  // },
  // {
  //   isPossibleOnHex: (grid: Grid<HexWithTerrain>, hex: HexWithTerrain): boolean => {
  //     const hexes = grid.hexesInRange(hex, 1)
  //     return hexes.some((hex) => hex.terrain.hasBears() || hex.terrain.hasCougars())
  //   },
  //   name: 'within two spaces of an abandoned shack',
  // },
  {
    isPossibleOnHex: (grid: Grid<HexWithTerrain>, hex: HexWithTerrain): boolean => {
      const hexes = grid.hexesInRange(hex, 2)
      return hexes.some((hex) => hex.terrain.hasBears())
    },
    name: 'within two spaces of bear territory',
  },
  {
    isPossibleOnHex: (grid: Grid<HexWithTerrain>, hex: HexWithTerrain): boolean => {
      const hexes = grid.hexesInRange(hex, 2)
      return hexes.some((hex) => hex.terrain.hasCougars())
    },
    name: 'within two spaces of cougar territory',
  },

  // {
  //   isPossibleOnHex: (grid: Grid<HexWithTerrain>, hex: HexWithTerrain): boolean => {
  //     const hexes = grid.hexesInRange(hex, 3)
  //     return hexes.some((hex) => hex.terrain.hasCougars())
  //   },
  //   name: 'within three spaces of a blue structure',
  // },
  // {
  //   isPossibleOnHex: (grid: Grid<HexWithTerrain>, hex: HexWithTerrain): boolean => {
  //     const hexes = grid.hexesInRange(hex, 3)
  //     return hexes.some((hex) => hex.terrain.hasCougars())
  //   },
  //   name: 'within three spaces of a white structure',
  // },
  // {
  //   isPossibleOnHex: (grid: Grid<HexWithTerrain>, hex: HexWithTerrain): boolean => {
  //     const hexes = grid.hexesInRange(hex, 3)
  //     return hexes.some((hex) => hex.terrain.hasCougars())
  //   },
  //   name: 'within three spaces of a green structure',
  // },
  // {
  //   isPossibleOnHex: (grid: Grid<HexWithTerrain>, hex: HexWithTerrain): boolean => {
  //     const hexes = grid.hexesInRange(hex, 3)
  //     return hexes.some((hex) => hex.terrain.hasCougars())
  //   },
  //   name: 'within three spaces of a black structure',
  // },
]

export type HintParams = {
  name: string
  isPossibleOnHex: (grid: Grid<HexWithTerrain>, hex: HexWithTerrain) => boolean
}

export class Hint {
  isActive: boolean
  name: string
  isPossibleOnHex: (grid: Grid<HexWithTerrain>, hex: HexWithTerrain) => boolean

  constructor(params: HintParams) {
    this.isPossibleOnHex = params.isPossibleOnHex
    this.isActive = true
    this.name = params.name
  }

  evaluate(grid: Grid<HexWithTerrain>, hex: HexWithTerrain, isHabitat: boolean) {
    const isPossibleOnHex = this.isPossibleOnHex(grid, hex)
    if (isPossibleOnHex != isHabitat) {
      this.isActive = false
    }
  }
}
