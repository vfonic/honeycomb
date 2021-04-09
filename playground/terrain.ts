import { D, F, M, S, W } from './tiles'

export class Tile {
  type: string

  constructor(type: string) {
    this.type = type
  }

  isForest() {
    return this.type.includes(F)
  }

  isWater() {
    return this.type.includes(W)
  }

  isDesert() {
    return this.type.includes(D)
  }

  isMountain() {
    return this.type.includes(M)
  }

  isSwamp() {
    return this.type.includes(S)
  }

  hasBears() {
    return this.type.includes('bears')
  }

  hasCougars() {
    return this.type.includes('cougars')
  }

  hasSteppingStone() {
    return this.type.includes('stepping-stone')
  }

  get steppingStoneColor() {
    const types = this.type.split(' ')
    const steppingStone = types[types.length - 1]
    return steppingStone.split('-')[0]
  }

  hasAbandonedShack() {
    return this.type.includes('abandoned-shack')
  }

  get abandonedShackColor() {
    const types = this.type.split(' ')
    const abandonedShack = types[types.length - 1]
    return abandonedShack.split('-')[0]
  }

  hasBlueStructure() {
    return this.type.includes('Blue')
  }

  hasGreenStructure() {
    return this.type.includes('Green')
  }

  hasWhiteStructure() {
    return this.type.includes('White')
  }
}
