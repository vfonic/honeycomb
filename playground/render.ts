import { Hex } from '../dist'
import { Tile } from './terrain'

const mapWrapperEl = document.querySelector('.js-map')
if (!mapWrapperEl) throw new Error('Map element not found')

export const renderAll = (hexes: HexWithTerrain[]) =>
  (mapWrapperEl.innerHTML = `
    <svg xmlns='http://www.w3.org/2000/svg' version='1.1' width='555px' height='494px'>
        ${hexes.map((hex) => render(hex)).join('')}
    </svg>
  `)

const fillHexagon = (hex: HexWithTerrain) => {
  let fill = 'none'
  if (hex.terrain.isForest()) {
    fill = '#33aa44'
  } else if (hex.terrain.isWater()) {
    fill = '#2596be'
  } else if (hex.terrain.isDesert()) {
    fill = '#ffc549'
  } else if (hex.terrain.isMountain()) {
    fill = 'gray'
  } else if (hex.terrain.isSwamp()) {
    fill = 'purple'
  }
  return ` 
    <polygon class='js-highlightHex' points='${hex.corners
      .map(({ x, y }) => `${x},${y}`)
      .join(',')}' fill='${fill}'></polygon>
  `
}

export type HexWithTerrain = Hex & { terrain: Tile; isActive: boolean }

const BORDER_DISTANCE = 3
const DX = [-0.75, -1, -0.75, 0.75, 1, 0.75]
const DY = [0.75, 0, -0.75, -0.75, 0, 0.75]
const addBearsAndCougars = (hex: HexWithTerrain) => {
  if (!hex.terrain.hasBears() && !hex.terrain.hasCougars()) return ''

  const color = hex.terrain.hasBears() ? '#000' : '#b00'

  return `
    <polygon points='${hex.corners.map(({ x, y }, i) => {
      x += BORDER_DISTANCE * DX[i]
      y += BORDER_DISTANCE * DY[i]
      return `${x},${y}`
    })}' fill='none' stroke-width='1.5' stroke='${color}' />
  `
}

const addCoordinates = (hex: HexWithTerrain) => {
  if (hex.terrain.hasSteppingStone() || hex.terrain.hasAbandonedShack()) return ''

  return `
    <text font-size='${hex.width * 0.25}' text-anchor='middle' dominant-baseline='central' transform='matrix(1,0,0,1,${
    hex.x
  },${hex.y})'>
      <tspan dy='0' x='0'>${hex.q},${hex.r}</tspan>
    </text>
  `
}

export const highlightSelectedHex = (hex: Hex) => {
  const graphicsEl = mapWrapperEl.querySelector(`g[data-hex="${hex.q},${hex.r}"]`)
  if (!graphicsEl) return ''

  const oldHighlightedEl = mapWrapperEl.querySelector('polygon[highlighted]')
  oldHighlightedEl && oldHighlightedEl.remove()

  graphicsEl.innerHTML += `
    <polygon highlighted points='${hex.corners.map(({ x, y }, i) => {
      x += (BORDER_DISTANCE * DX[i]) / 3
      y += (BORDER_DISTANCE * DY[i]) / 3
      return `${x},${y}`
    })}' fill='none' stroke-width='2' stroke='#fff' />
  `
}

export const highlightPossibleHexes = (hexes: HexWithTerrain[]) => {
  hexes.forEach((hex) => {
    const graphicsEl = mapWrapperEl.querySelector(`g[data-hex="${hex.q},${hex.r}"]`)
    if (!graphicsEl) return ''

    graphicsEl.innerHTML += `
      <polygon class='possible-hex js-possibleHex' points='${hex.corners.map(({ x, y }, i) => {
        x += (BORDER_DISTANCE * DX[i]) / 3.5
        y += (BORDER_DISTANCE * DY[i]) / 3.5
        return `${x},${y}`
      })}' fill='none' stroke-width='5' stroke='#f76bff' />
    `
  })
}

const addSteppingStone = (hex: HexWithTerrain) => {
  if (!hex.terrain.hasSteppingStone()) return ''

  const width = hex.width / 9

  return `
    <circle cx='${hex.x - width}' cy='${hex.y - width}' r='${width}' fill='${hex.terrain.steppingStoneColor}' />
  `
}

const addAbandonedShack = (hex: HexWithTerrain) => {
  if (!hex.terrain.hasAbandonedShack()) return ''

  const width = hex.width / 4
  const topY = hex.corners[0].y + width * 1.5
  const topX = (hex.corners[5].x + hex.corners[0].x) / 2

  const points = [
    `${topX + width / 2},${topY}`,
    hex.corners[2].x,
    hex.corners[2].y - width,
    hex.corners[3].x + width,
    hex.corners[3].y - width,
  ]

  return `
    <polygon points='${points}' fill='${hex.terrain.abandonedShackColor}'/>
  `
}

export const render = (hex: HexWithTerrain): string => {
  let result = ''
  result += fillHexagon(hex)
  result += addBearsAndCougars(hex)
  result += addCoordinates(hex)
  result += addSteppingStone(hex)
  result += addAbandonedShack(hex)
  highlightSelectedHex(hex)
  return `<g data-hex='${hex.q},${hex.r}' style='opacity: ${hex.isActive === false ? '0.5' : '1'}'>${result}</g>`
}
