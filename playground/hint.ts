import { Grid } from '../src'
import { HexWithTerrain } from './render'

export const ALL_HINTS = [
  {
    isPossibleOnHex: (grid: Grid<HexWithTerrain>, hex: HexWithTerrain): boolean =>
      hex.terrain.isForest() || hex.terrain.isDesert(),
    name: 'On forest or desert',
  },
  {
    isPossibleOnHex: (grid: Grid<HexWithTerrain>, hex: HexWithTerrain): boolean =>
      hex.terrain.isForest() || hex.terrain.isWater(),
    name: 'On forest or water',
  },
  {
    isPossibleOnHex: (grid: Grid<HexWithTerrain>, hex: HexWithTerrain): boolean =>
      hex.terrain.isForest() || hex.terrain.isSwamp(),
    name: 'On forest or swamp',
  },
  {
    isPossibleOnHex: (grid: Grid<HexWithTerrain>, hex: HexWithTerrain): boolean =>
      hex.terrain.isForest() || hex.terrain.isMountain(),
    name: 'On forest or mountain',
  },
  {
    isPossibleOnHex: (grid: Grid<HexWithTerrain>, hex: HexWithTerrain): boolean =>
      hex.terrain.isDesert() || hex.terrain.isWater(),
    name: 'On desert or water',
  },
  {
    isPossibleOnHex: (grid: Grid<HexWithTerrain>, hex: HexWithTerrain): boolean =>
      hex.terrain.isDesert() || hex.terrain.isSwamp(),
    name: 'On desert or swamp',
  },
  {
    isPossibleOnHex: (grid: Grid<HexWithTerrain>, hex: HexWithTerrain): boolean =>
      hex.terrain.isDesert() || hex.terrain.isMountain(),
    name: 'On desert or mountain',
  },
  {
    isPossibleOnHex: (grid: Grid<HexWithTerrain>, hex: HexWithTerrain): boolean =>
      hex.terrain.isWater() || hex.terrain.isSwamp(),
    name: 'On water or swamp',
  },
  {
    isPossibleOnHex: (grid: Grid<HexWithTerrain>, hex: HexWithTerrain): boolean =>
      hex.terrain.isWater() || hex.terrain.isMountain(),
    name: 'On water or mountain',
  },
  {
    isPossibleOnHex: (grid: Grid<HexWithTerrain>, hex: HexWithTerrain): boolean =>
      hex.terrain.isSwamp() || hex.terrain.isMountain(),
    name: 'On swamp or mountain',
  },

  {
    isPossibleOnHex: (grid: Grid<HexWithTerrain>, hex: HexWithTerrain): boolean => {
      const hexes = grid.hexesInRange(hex, 1)
      return hexes.some((hex) => hex.terrain.isForest())
    },
    name: 'Within one space of forest',
  },
  {
    isPossibleOnHex: (grid: Grid<HexWithTerrain>, hex: HexWithTerrain): boolean => {
      const hexes = grid.hexesInRange(hex, 1)
      return hexes.some((hex) => hex.terrain.isDesert())
    },
    name: 'Within one space of desert',
  },
  {
    isPossibleOnHex: (grid: Grid<HexWithTerrain>, hex: HexWithTerrain): boolean => {
      const hexes = grid.hexesInRange(hex, 1)
      return hexes.some((hex) => hex.terrain.isSwamp())
    },
    name: 'Within one space of swamp',
  },
  {
    isPossibleOnHex: (grid: Grid<HexWithTerrain>, hex: HexWithTerrain): boolean => {
      const hexes = grid.hexesInRange(hex, 1)
      return hexes.some((hex) => hex.terrain.isMountain())
    },
    name: 'Within one space of mountain',
  },
  {
    isPossibleOnHex: (grid: Grid<HexWithTerrain>, hex: HexWithTerrain): boolean => {
      const hexes = grid.hexesInRange(hex, 1)
      return hexes.some((hex) => hex.terrain.isWater())
    },
    name: 'Within one space of water',
  },
  {
    isPossibleOnHex: (grid: Grid<HexWithTerrain>, hex: HexWithTerrain): boolean => {
      const hexes = grid.hexesInRange(hex, 1)
      return hexes.some((hex) => hex.terrain.hasBears() || hex.terrain.hasCougars())
    },
    name: 'Within one space of either animal territory',
  },

  {
    isPossibleOnHex: (grid: Grid<HexWithTerrain>, hex: HexWithTerrain): boolean => {
      const hexes = grid.hexesInRange(hex, 2)
      return hexes.some((hex) => hex.terrain.hasSteppingStone())
    },
    name: 'Within two spaces of a standing stone',
  },
  {
    isPossibleOnHex: (grid: Grid<HexWithTerrain>, hex: HexWithTerrain): boolean => {
      const hexes = grid.hexesInRange(hex, 2)
      return hexes.some((hex) => hex.terrain.hasAbandonedShack())
    },
    name: 'Within two spaces of an abandoned shack',
  },
  {
    isPossibleOnHex: (grid: Grid<HexWithTerrain>, hex: HexWithTerrain): boolean => {
      const hexes = grid.hexesInRange(hex, 2)
      return hexes.some((hex) => hex.terrain.hasBears())
    },
    name: 'Within two spaces of bear territory',
  },
  {
    isPossibleOnHex: (grid: Grid<HexWithTerrain>, hex: HexWithTerrain): boolean => {
      const hexes = grid.hexesInRange(hex, 2)
      return hexes.some((hex) => hex.terrain.hasCougars())
    },
    name: 'Within two spaces of cougar territory',
  },

  {
    isPossibleOnHex: (grid: Grid<HexWithTerrain>, hex: HexWithTerrain): boolean => {
      const hexes = grid.hexesInRange(hex, 3)
      return hexes.some((hex) => hex.terrain.hasBlueStructure())
    },
    name: 'Within three spaces of a blue structure',
  },
  {
    isPossibleOnHex: (grid: Grid<HexWithTerrain>, hex: HexWithTerrain): boolean => {
      const hexes = grid.hexesInRange(hex, 3)
      return hexes.some((hex) => hex.terrain.hasWhiteStructure())
    },
    name: 'Within three spaces of a white structure',
  },
  {
    isPossibleOnHex: (grid: Grid<HexWithTerrain>, hex: HexWithTerrain): boolean => {
      const hexes = grid.hexesInRange(hex, 3)
      return hexes.some((hex) => hex.terrain.hasGreenStructure())
    },
    name: 'Within three spaces of a green structure',
  },
  // {
  //   isPossibleOnHex: (grid: Grid<HexWithTerrain>, hex: HexWithTerrain): boolean => {
  //     const hexes = grid.hexesInRange(hex, 3)
  //     return hexes.some((hex) => hex.terrain.hasBlackStructure())
  //   },
  //   name: 'Within three spaces of a black structure',
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

  toString() {
    return this.name
  }
}
