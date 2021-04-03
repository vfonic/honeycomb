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
    isPossibleOnHex: (grid: Grid<HexWithTerrain>, hex: HexWithTerrain): boolean => {
      return hex.terrain.isForest() || hex.terrain.isDesert()
      // if (hints[ON_WATER_OR_SWAMP].isActive) return false
      // if (hints[ON_WATER_OR_MOUNTAIN].isActive) return false
      // if (hints[ON_SWAMP_OR_MOUNTAIN].isActive) return false
      // return hex.isActive
    },
    name: 'on forest or desert',
    // evaluate: (grid: Grid<HexWithTerrain>, hint: Hint, hex: HexWithTerrain, isHabitat: boolean) => {
    //   const isPossibleOnHex = hint.isPossibleOnHex(grid, hex)
    //   if (isPossibleOnHex != isHabitat) {
    //     hint.isActive = false
    //   }
    // },
  },
  {
    isPossibleOnHex: (grid: Grid<HexWithTerrain>, hex: HexWithTerrain): boolean => {
      return hex.terrain.isForest() || hex.terrain.isWater()
      // if (hints[ON_DESERT_OR_SWAMP].isActive) return false
      // if (hints[ON_DESERT_OR_MOUNTAIN].isActive) return false
      // if (hints[ON_SWAMP_OR_MOUNTAIN].isActive) return false
      // return hex.isActive
    },
    name: 'on forest or water',
    // evaluate: (grid: Grid<HexWithTerrain>, hint: Hint, hex: HexWithTerrain, isHabitat: boolean) => null,
  },
  {
    isPossibleOnHex: (grid: Grid<HexWithTerrain>, hex: HexWithTerrain): boolean => {
      return hex.terrain.isForest() || hex.terrain.isSwamp()
      // if (hints[ON_DESERT_OR_WATER].isActive) return false
      // if (hints[ON_DESERT_OR_MOUNTAIN].isActive) return false
      // if (hints[ON_WATER_OR_MOUNTAIN].isActive) return false
      // return hex.isActive
    },
    name: 'on forest or swamp',
    // evaluate: (grid: Grid<HexWithTerrain>, hint: Hint, hex: HexWithTerrain, isHabitat: boolean) => null,
  },
  {
    isPossibleOnHex: (grid: Grid<HexWithTerrain>, hex: HexWithTerrain): boolean => {
      return hex.terrain.isForest() || hex.terrain.isMountain()
      // if (hints[ON_DESERT_OR_WATER].isActive) return false
      // if (hints[ON_DESERT_OR_SWAMP].isActive) return false
      // if (hints[ON_WATER_OR_SWAMP].isActive) return false
      // return hex.isActive
    },
    name: 'on forest or mountain',
    // evaluate: (grid: Grid<HexWithTerrain>, hint: Hint, hex: HexWithTerrain, isHabitat: boolean) => null,
  },
  {
    isPossibleOnHex: (grid: Grid<HexWithTerrain>, hex: HexWithTerrain): boolean => {
      return hex.terrain.isDesert() || hex.terrain.isWater()
      // if (hints[ON_FOREST_OR_SWAMP].isActive) return false
      // if (hints[ON_FOREST_OR_MOUNTAIN].isActive) return false
      // if (hints[ON_SWAMP_OR_MOUNTAIN].isActive) return false
      // return hex.isActive
    },
    name: 'on desert or water',
    // evaluate: (grid: Grid<HexWithTerrain>, hint: Hint, hex: HexWithTerrain, isHabitat: boolean) => null,
  },
  {
    isPossibleOnHex: (grid: Grid<HexWithTerrain>, hex: HexWithTerrain): boolean => {
      return hex.terrain.isDesert() || hex.terrain.isSwamp()
      // if (hints[ON_FOREST_OR_WATER].isActive) return false
      // if (hints[ON_FOREST_OR_MOUNTAIN].isActive) return false
      // if (hints[ON_WATER_OR_MOUNTAIN].isActive) return false
      // return hex.isActive
    },
    name: 'on desert or swamp',
    // evaluate: (grid: Grid<HexWithTerrain>, hint: Hint, hex: HexWithTerrain, isHabitat: boolean) => null,
  },
  {
    isPossibleOnHex: (grid: Grid<HexWithTerrain>, hex: HexWithTerrain): boolean => {
      return hex.terrain.isDesert() || hex.terrain.isMountain()
      // if (hints[ON_FOREST_OR_WATER].isActive) return false
      // if (hints[ON_FOREST_OR_SWAMP].isActive) return false
      // if (hints[ON_WATER_OR_SWAMP].isActive) return false
      // return hex.isActive
    },
    name: 'on desert or mountain',
    // evaluate: (grid: Grid<HexWithTerrain>, hint: Hint, hex: HexWithTerrain, isHabitat: boolean) => null,
  },
  {
    isPossibleOnHex: (grid: Grid<HexWithTerrain>, hex: HexWithTerrain): boolean => {
      return hex.terrain.isWater() || hex.terrain.isSwamp()
      // if (hints[ON_FOREST_OR_DESERT].isActive) return false
      // if (hints[ON_FOREST_OR_MOUNTAIN].isActive) return false
      // if (hints[ON_DESERT_OR_MOUNTAIN].isActive) return false
      // return hex.isActive
    },
    name: 'on water or swamp',
    // evaluate: (grid: Grid<HexWithTerrain>, hint: Hint, hex: HexWithTerrain, isHabitat: boolean) => null,
  },
  {
    isPossibleOnHex: (grid: Grid<HexWithTerrain>, hex: HexWithTerrain): boolean => {
      return hex.terrain.isWater() || hex.terrain.isMountain()
      // if (hints[ON_FOREST_OR_DESERT].isActive) return false
      // if (hints[ON_FOREST_OR_SWAMP].isActive) return false
      // if (hints[ON_DESERT_OR_SWAMP].isActive) return false
      // return hex.isActive
    },
    name: 'on water or mountain',
    // evaluate: (grid: Grid<HexWithTerrain>, hint: Hint, hex: HexWithTerrain, isHabitat: boolean) => null,
  },
  {
    isPossibleOnHex: (grid: Grid<HexWithTerrain>, hex: HexWithTerrain): boolean => {
      return hex.terrain.isSwamp() || hex.terrain.isMountain()
      // if (hints[ON_FOREST_OR_DESERT].isActive) return false
      // if (hints[ON_FOREST_OR_WATER].isActive) return false
      // if (hints[ON_DESERT_OR_WATER].isActive) return false
      // return hex.isActive
    },
    name: 'on swamp or mountain',
    // evaluate: (grid: Grid<HexWithTerrain>, hint: Hint, hex: HexWithTerrain, isHabitat: boolean) => null,
  },
]

export type HintParams = {
  name: string
  isPossibleOnHex: (grid: Grid<HexWithTerrain>, hex: HexWithTerrain) => boolean
  // evaluate: (grid: Grid<HexWithTerrain>, hint: Hint, hex: HexWithTerrain, isHabitat: boolean) => null
}

export class Hint {
  isActive: boolean
  name: string
  isPossibleOnHex: (grid: Grid<HexWithTerrain>, hex: HexWithTerrain) => boolean

  // evaluateCb: (grid: Grid<HexWithTerrain>, hint: Hint, hex: HexWithTerrain, isHabitat: boolean) => null

  constructor(params: HintParams) {
    this.isPossibleOnHex = params.isPossibleOnHex
    this.isActive = true
    this.name = params.name
    // this.evaluateCb = params.evaluate
  }

  // evaluate(grid: Grid<HexWithTerrain>, hex: HexWithTerrain, isHabitat: boolean) {
  //   return this.evaluateCb(grid, this, hex, isHabitat)
  // }

  evaluate(grid: Grid<HexWithTerrain>, hex: HexWithTerrain, isHabitat: boolean) {
    const isPossibleOnHex = this.isPossibleOnHex(grid, hex)
    if (isPossibleOnHex != isHabitat) {
      this.isActive = false
    }
  }
}
