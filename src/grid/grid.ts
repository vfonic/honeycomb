import { createHex, Hex, HexCoordinates, Point, pointToCube } from '../hex'
import { flatTraverse } from './functions'
import { Callback, Traverser } from './types'
import { HexWithTerrain } from '../../playground/render'

export class Grid<T extends Hex> {
  static from<T extends Hex>(iterable: Map<string, T> | Iterable<T>) {
    let firstHex: T
    let store: Map<string, T>

    if (iterable instanceof Map) {
      firstHex = iterable.values()[Symbol.iterator]().next().value
      store = iterable
    } else {
      const array = Array.from(iterable)
      firstHex = array[0]
      store = new Map(array.map((hex) => [hex.toString(), hex]))
    }

    if (!firstHex) {
      throw new Error(`Can't create grid from empty iterable: ${iterable}`)
    }

    return new Grid<T>(Object.getPrototypeOf(firstHex), store)
  }

  get [Symbol.toStringTag]() {
    return 'Grid'
  }

  store = new Map<string, T>()
  getHex = (coordinates?: HexCoordinates) => {
    const hex = createHex(this.hexPrototype).clone(coordinates) // clone to enable users to make custom hexes
    return this.store.get(hex.toString()) ?? hex
  }

  private _getPrevHexes: GetHexesFn<T> = () => []

  constructor(hexPrototype: T, traversers?: Traverser<T> | Traverser<T>[])
  constructor(hexPrototype: T, store?: Map<string, T>)
  constructor(public hexPrototype: T, traversersOrStore?: Traverser<T> | Traverser<T>[] | Map<string, T>) {
    if (traversersOrStore instanceof Map) {
      this._getPrevHexes = () => Array.from(traversersOrStore.values())
      this.store = new Map(traversersOrStore)
    } else if (traversersOrStore) {
      const hexes = flatTraverse(traversersOrStore)(this.getHex(), this.getHex)
      this._getPrevHexes = () => hexes
      this.store = new Map(hexes.map((hex) => [hex.toString(), hex]))
    }
  }

  pointToHex(point: Point): T {
    return this.getHex(pointToCube(point, this.hexPrototype))
  }

  update(callback: (grid: Grid<T>) => Grid<T> | void) {
    let nextGrid = this._clone(this._getPrevHexes)
    nextGrid = callback(nextGrid) || nextGrid
    // reset hex state to iterate over nextGrid's store (fixes issue #68)
    nextGrid._getPrevHexes = () => Array.from(nextGrid.store.values())
    return nextGrid
  }

  each(callback: Callback<T, void>) {
    const each: GetHexesFn<T> = (currentGrid) => {
      const hexes = this._getPrevHexes(currentGrid)
      hexes.forEach((hex) => callback(hex, currentGrid))
      return hexes
    }

    return this._clone(each)
  }

  /**
   * @memberof Grid#
   * @instance
   * @see {@link https://www.redblobgames.com/grids/hexagons/#range-coordinate|redblobgames.com}
   *
   * @param {hex} centerHex                   A hex to get surrounding hexes from.
   * @param {number} [range=0]                The range (in hexes) surrounding the center hex.
   * @param {boolean} [includeCenterHex=true] Whether to include the center hex in the result
   *
   * @returns {hex[]}             An array with all hexes surrounding the passed center hex.
   *                              Only hexes that are present in the grid are returned.
   *
   * @throws {Error} When no valid hex is passed.
   *
   * @example
   * const Hex = Honeycomb.extendHex({ orientation: 'pointy' })
   * const Grid = Honeycomb.defineGrid(Hex)
   * const grid = Grid.rectangle({ width: 5, height: 5 })
   *
   * grid.hexesInRange(Hex(2, 2), 2)          // [
   *                                          //    { x: 0, y: 2 },
   *                                          //    { x: 0, y: 3 },
   *                                          //    { x: 1, y: 4 },
   *                                          //    ...
   *                                          //    { x: 3, y: 0 },
   *                                          //    { x: 3, y: 1 },
   *                                          //    { x: 4, y: 2 }
   *                                          // ]
   *
   * // only returns hexes that exist in the grid:
   * grid.hexesInRange(Hex(0, 0), 1)          // [
   *                                          //    { x: 0, y: 0 },
   *                                          //    { x: 0, y: 1 },
   *                                          //    { x: 1, y: 0 }
   *                                          // ]
   *
   * // exclude center hex:
   * grid.hexesInRange(Hex(2, 2), 1, false)   // [
   *                                          //    { x: 1, y: 2 },
   *                                          //    { x: 1, y: 3 },
   *                                          //    { x: 1, y: 1 },
   *                                          //    { x: 2, y: 3 },
   *                                          //    { x: 3, y: 2 }
   *                                          // ]
   */
  hexesInRange(centerHex: HexWithTerrain, range = 0): HexWithTerrain[] {
    if (!this.store.get(centerHex.toString())) {
      throw new Error(`Center hex with coordinates ${centerHex} not present in grid.`)
    }

    const hexes: HexWithTerrain[] = []

    // const coordinates = []

    // const DIRECTIONS_FLAT = [
    //   // 2,3
    //   { q: 0, r: -1 }, // N // 2,2
    //   { q: 1, r: -1 }, // NE // 3,2
    //   null, // ambiguous
    //   { q: 1, r: 0 }, // SE // 3,3
    //   { q: 0, r: 1 }, // S // 2,4
    //   { q: -1, r: 1 }, // SW // 1,4
    //   null, // ambiguous
    //   { q: -1, r: 0 }, // NW // 1,3
    // ]

    // 2,3
    //
    // 1,3
    // 1,4
    // 2,2
    // 2,3
    // 2,4
    // 3,2
    // 3,3

    for (let q = -range; q <= range; q++) {
      for (let r = Math.max(-range, -q - range); r <= Math.min(range, -q + range); r++) {
        // const offsetCoordinates = hexToOffset({
        //   q: centerHex.q + q,
        //   r: centerHex.r + r,
        //   offset: centerHex.offset,
        //   isPointy: centerHex.isPointy,
        // })
        // const coordinate = `${offsetCoordinates.col},${offsetCoordinates.row}`
        const coordinate = `${centerHex.q + q},${centerHex.r + r}`
        // if (coordinate === '2,1') {
        //   console.log({ q, r })
        // }
        // coordinates.push(coordinate)
        // coordinates.push(`${q},${r}`)
        const hex = (this.store.get(coordinate) as unknown) as HexWithTerrain
        hexes.push(hex)
      }
    }

    // console.log(coordinates)

    return hexes.filter(Boolean)
  }

  map(callback: Callback<T, T | void>) {
    const map: GetHexesFn<T> = (currentGrid) =>
      this._getPrevHexes(currentGrid).map((hex) => {
        const cursor = hex.clone()
        return callback(cursor, currentGrid) || cursor
      })

    return this._clone(map)
  }

  filter(predicate: Callback<T, boolean>) {
    const filter: GetHexesFn<T> = (currentGrid) =>
      this._getPrevHexes(currentGrid).filter((hex) => predicate(hex, currentGrid))

    return this._clone(filter)
  }

  takeWhile(predicate: Callback<T, boolean>) {
    const takeWhile: GetHexesFn<T> = (currentGrid) => {
      const hexes: T[] = []
      for (const hex of this._getPrevHexes(currentGrid)) {
        if (!predicate(hex, currentGrid)) {
          return hexes
        }
        hexes.push(hex)
      }
      return hexes
    }

    return this._clone(takeWhile)
  }

  traverse(traversers: Traverser<T>[] | Traverser<T>) {
    const traverse: GetHexesFn<T> = (currentGrid) => {
      // run any previous iterators
      this._getPrevHexes(currentGrid)
      return flatTraverse(traversers)(this.getHex(), this.getHex)
    }

    return this._clone(traverse)
  }

  hexes() {
    return this._getPrevHexes(this)
  }

  run(callback?: Callback<T, void>) {
    const hexes = this._getPrevHexes(this)
    hexes.forEach((hex) => callback && callback(hex, this))
    return this._clone(() => hexes)
  }

  private _clone(getHexState: GetHexesFn<T>) {
    const newGrid = new Grid(this.hexPrototype, this.store)
    newGrid._getPrevHexes = getHexState
    return newGrid
  }
}

interface GetHexesFn<T extends Hex> {
  (grid: Grid<T>): T[]
}
