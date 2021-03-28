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
        ${hexes.map((hex) => render(hex)).join('')}
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
    <polygon class='js-highlightHex' points='${hex.corners
      .map(({ x, y }) => `${x},${y}`)
      .join(',')}' fill='${fill}'></polygon>
  `
}

export type HexWithTerrain = Hex & { terrain?: string }

const BORDER_DISTANCE = 3
const DX = [-0.75, -1, -0.75, 0.75, 1, 0.75]
const DY = [0.75, 0, -0.75, -0.75, 0, 0.75]
const addBearsAndCougars = (hex: HexWithTerrain) => {
  if (!hex.terrain?.includes('bears') && !hex.terrain?.includes('cougars')) {
    return ''
  }

  const color = hex.terrain?.includes('bears') ? '#000' : '#b00'

  return `
    <polygon points='${hex.corners.map(({ x, y }, i) => {
      x += BORDER_DISTANCE * DX[i]
      y += BORDER_DISTANCE * DY[i]
      return `${x},${y}`
    })}' fill='none' stroke-width='1.5' stroke='${color}' />
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

export const highlightSelectedHex = (hex?: Hex) => {
  if (!hex) return ''
  const graphicsEl = mapWrapperEl.querySelector(`g[data-hex="${hex.q},${hex.r}"]`)
  if (!graphicsEl) return ''

  const oldHighlightedEl = mapWrapperEl.querySelector('[highlighted]')
  oldHighlightedEl && oldHighlightedEl.remove()

  graphicsEl.innerHTML += `
    <polygon highlighted points='${hex.corners.map(({ x, y }, i) => {
      x += (BORDER_DISTANCE * DX[i]) / 3
      y += (BORDER_DISTANCE * DY[i]) / 3
      return `${x},${y}`
    })}' fill='none' stroke-width='2' stroke='#fff' />
  `
}

export const render = (hex: HexWithTerrain): string => {
  let result = ''
  result += fillHexagon(hex)
  result += addBearsAndCougars(hex)
  result += addCoordinates(hex)
  result += highlightSelectedHex(hex)
  return `<g data-hex='${hex.q},${hex.r}'>${result}</g>`
}
