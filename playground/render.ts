import { Hex } from '../dist'
import { D, F, M, S, W } from './tiles'

declare const SVG: any

const draw = SVG().addTo('body').size('100%', '100%')

export const render = (hex: Hex & { terrain?: string }): void => {
  let fill = 'none'
  if (hex.terrain?.includes(F)) {
    fill = 'green'
  } else if (hex.terrain?.includes(W)) {
    fill = '#426eff'
  } else if (hex.terrain?.includes(D)) {
    fill = 'yellow'
  } else if (hex.terrain?.includes(M)) {
    fill = 'gray'
  } else if (hex.terrain?.includes(S)) {
    fill = 'purple'
  }

  const polygon = draw
    .polygon(hex.corners.map(({ x, y }) => `${x},${y}`))
    .fill(fill)
    .stroke({ width: 1, color: '#999' })
  const text = draw
    .text(`${hex.q},${hex.r}`)
    // .text(`${hex.col},${hex.row}`)
    .font({
      size: hex.width * 0.25,
      anchor: 'middle',
      'dominant-baseline': 'central',
      leading: 0,
    })
    .translate(hex.x, hex.y)
  console.log({ custom: hex.terrain })
  draw.group().add(polygon)
  draw.add(text)

  return draw
}
