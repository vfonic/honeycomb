import { Hex } from '../dist'
import { D, F, M, S, W } from './tiles'

// declare const SVG: any

// const draw = SVG().addTo('.js-map').size('100%', '100%')

const mapWrapperEl = document.querySelector('.js-map')
if (!mapWrapperEl) {
  throw new Error('Map element not found')
}

export const renderAll = (hexes: HexWithTerrain[]) => {
  mapWrapperEl.innerHTML = `
    <svg xmlns='http://www.w3.org/2000/svg' version='1.1' width='555px' height='494px'>
      <g>
        ${hexes.map((hex) => render(hex)).join('')}
      </g>
    </svg>
  `
}

const fillHexagon = (hex: HexWithTerrain) => {
  let fill = 'none'
  if (hex.terrain?.includes(F)) {
    fill = '#009900'
  } else if (hex.terrain?.includes(W)) {
    fill = '#2596be'
  } else if (hex.terrain?.includes(D)) {
    fill = '#ffcc00'
  } else if (hex.terrain?.includes(M)) {
    fill = 'gray'
  } else if (hex.terrain?.includes(S)) {
    fill = 'purple'
  }
  // const polygon = draw.polygon(hex.corners.map(({ x, y }) => `${x},${y}`)).fill(fill)
  // draw.group().add(polygon)
  return ` 
    <polygon points='${hex.corners.map(({ x, y }) => `${x},${y}`).join(',')}' fill='${fill}'></polygon>
  `
}

export type HexWithTerrain = Hex & { terrain?: string }

const BORDER_DISTANCE = 3
const DX = [-0.75, -1, -0.75, 0.75, 1, 0.75]
const DY = [0.75, 0, -0.75, -0.75, 0, 0.75]
const addBearsAndCougars = (hex: HexWithTerrain) => {
  if (!hex.terrain?.includes('bears') && !hex.terrain?.includes('cougars')) {
    return
  }

  const stroke: any = { width: 1.5 }
  if (hex.terrain?.includes('bears')) {
    stroke.color = '#000'
    stroke.dasharray = 4
  } else if (hex.terrain?.includes('cougars')) {
    stroke.color = '#c00'
  }

  // const polygon2 = draw
  //   .polygon(
  //     hex.corners.map(({ x, y }, i) => {
  //       x += BORDER_DISTANCE * DX[i]
  //       y += BORDER_DISTANCE * DY[i]
  //       return `${x},${y}`
  //     }),
  //   )
  //   .fill('none')
  //   .stroke(stroke)
  // draw.group().add(polygon2)

  return `
    <polygon points='${hex.corners.map(({ x, y }, i) => {
      x += BORDER_DISTANCE * DX[i]
      y += BORDER_DISTANCE * DY[i]
      return `${x},${y}`
    })}' fill='none' stroke-width='1.5' stroke='${stroke.color}' />
  `
}

const addCoordinates = (hex: Hex) => {
  // const text = draw
  //   .text(`${hex.q},${hex.r}`)
  //   // .text(`${hex.col},${hex.row}`)
  //   .font({
  //     size: hex.width * 0.25,
  //     anchor: 'middle',
  //     'dominant-baseline': 'central',
  //     leading: 0,
  //   })
  //   .translate(hex.x, hex.y)
  // draw.add(text)
  return `
    <text font-size='${hex.width * 0.25}' text-anchor='middle' dominant-baseline='central' transform='matrix(1,0,0,1,${
    hex.x
  },${hex.y})'>
      <tspan dy='0' x='0'>${hex.q},${hex.r}</tspan>
    </text>
  `
}

export const render = (hex: HexWithTerrain): string => {
  let result = ''
  result += fillHexagon(hex)
  result += addBearsAndCougars(hex)
  result += addCoordinates(hex)
  return result
}
