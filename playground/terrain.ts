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
}
