const jimp = require('jimp')

const imageColor = (image) => {
  
  let color = [255,255,255];

  if(image?.customData?.color)
    color = image.customData?.color.split(',')
  else if(image?.colors)
    color - [image.colors[0].red, image.colors[0].green, image.colors[0].blud];
  
  return color;
}

global.brightnessCache = global.brightnessCache || {}
const imageBrightness = async (image) => {
  if(process.env.DEV_CACHE && image && global.brightnessCache[image.id])
    return global.brightnessCache[image.id]

  const url = `${image.url}?fmt=jpg&w=1000`
  const img  = await jimp.read(url)

  let avgR = 0
  let avgG = 0
  let avgB = 0
  let avgA = 0

  img.scan(0, 0, img.bitmap.width, img.bitmap.height, function (x, y, idx) {
    avgR += this.bitmap.data[ idx + 0 ]
    avgG += this.bitmap.data[ idx + 1 ]
    avgB += this.bitmap.data[ idx + 2 ]
    avgA += this.bitmap.data[ idx + 3 ]
  })

  const pixels = img.bitmap.width * img.bitmap.height
  avgR = avgR / pixels
  avgG = avgG / pixels
  avgB = avgB / pixels
  avgA = avgA / pixels

  const brightness = Math.floor((avgR + avgG + avgB) / 3)
  var results = {
    red: avgR,
    green: avgG,
    blue: avgB,
    alpha: avgA,
    brightness
  }
  
  brightnessCache[image.id] = (brightness/255)
  return brightness/255
}

const splitArray = (items, max) => {
  const arr = new Array(max)
  const itemsPerRow = Math.ceil(items.length/max)
  for (let i = 0, a = 0; i < items.length; i++, a++) {
    arr[a] = arr[a] ? arr[a] : []
    arr[a].push(items[i])
    if(a+1 >= max) a = -1
  }
  return arr
}

const rgbToHex = (rgb) => '#' + rgb.map(x => {
  const hex = x.toString(16)
  return hex.length === 1 ? '0' + hex : hex
}).join('')

const datePeriod = (startDate, endDate) => {
  if(new Date() >= new Date(startDate) && new Date() <= new Date(endDate)) return 'current'
  if(new Date(startDate) > new Date() && new Date(endDate) > new Date()) return 'upcoming'
  if(new Date(startDate) < new Date() && new Date(endDate) < new Date()) return 'past'
  return undefined
}

const sleep = async (ms = 0) => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export {
  imageColor,
  imageBrightness,
  splitArray,
  rgbToHex,
  datePeriod,
  sleep
}