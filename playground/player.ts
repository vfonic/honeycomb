import { ALL_HINTS, Hint } from './hint'

export class Player {
  hints: Hint[]

  constructor() {
    this.hints = ALL_HINTS.map((hintParams) => new Hint(hintParams))
  }

  get activeHints() {
    return this.hints.filter((hint) => hint.isActive)
  }
}
