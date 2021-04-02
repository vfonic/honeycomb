import { Grid } from '../src'
import { HexWithTerrain } from './render'
import { D, F } from './tiles'

type Hint = {
  isActive: boolean
  isPossibleOnHex: (grid: Grid<HexWithTerrain>, hex: HexWithTerrain, hints: Hint[]) => boolean
}

const ALL_HINTS: Hint[] = [
  //  on forest or desert
  {
    isPossibleOnHex: (grid: Grid<HexWithTerrain>, hex: HexWithTerrain, hints: Hint[]): boolean => {
      return [F, D].includes(hex.terrain)
    },
  },
].map((hint) => ({ ...hint, isActive: true }))

export class Player {
  hints: Hint[]

  constructor() {
    this.hints = ALL_HINTS.map((hint) => ({ ...hint }))
  }
}
