import moment from 'moment'

export const parameterizeName = (str) => str.toLowerCase().replace(/\s/g, '_')

export const capitalizeFirstLetter = str => `${str.charAt(0).toUpperCase()}${str.slice(1)}`

export const titleize = (string = '') => {
  return string.toLowerCase().split(/(\s|-)/).map(capitalizeFirstLetter).join('')
}

export const camelize = (str = '', index) => {
  return index > 0 ? capitalizeFirstLetter(str) : str
}

export const blendRGBs = (...colors) => {
  const GRAB_COLORS_RE = /.*\((.{5,})\)/

  const extractColors = rgb => rgb.replace(/\s/g, '').match(GRAB_COLORS_RE)[1].split(',').map(c => parseInt(c))

  const colorsCount = colors.length

  const [r, g, b] = colors.map(extractColors).reduce((acc, cur) => {
    return [acc[0] + cur[0], acc[1] + cur[1], acc[2] + cur[2]]
  })

  return `rgb(${r / colorsCount}, ${g / colorsCount}, ${b / colorsCount})`
}

export const toRGBA = (hex, a = 1) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return `rgba(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}, ${a})`
}

export const zeroOutTime = date => {
  date.setHours(0,0,0,0)
  return date
}

export const moneyFormat = num => {
  return `${num < 0 ? '-' : ''}$${Math.abs(num).toLocaleString()}`
}

export const uniqDays = (acc, cur) => {
  if (!!acc.find(o => o.isSame(cur, 'day'))) {
    return acc
  }
  return [...acc, cur]
}
