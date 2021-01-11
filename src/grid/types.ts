import { Hex, HexCoordinates } from '../hex'

export enum PointyCompassDirection {
  E,
  SE,
  SW,
  W,
  NW,
  NE,
}

export enum FlatCompassDirection {
  SE,
  S,
  SW,
  NW,
  N,
  NE,
}

export type CompassDirection = PointyCompassDirection | FlatCompassDirection

export type GridGenerator<T extends Hex> = Iterable<T>

// export interface Traverser<T extends Hex> {
//   (currentHex: T): GridGenerator<T>
// }
export interface Traverser {
  (currentCoordinates: HexCoordinates): Iterable<HexCoordinates>
}
}