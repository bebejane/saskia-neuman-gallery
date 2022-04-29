
const imageColor = (image) => {
  
  let color = [255,255,255];

  if(image?.customData?.color)
    color = image.customData?.color.split(',')
  else if(image?.colors)
    color - [image.colors[0].red, image.colors[0].green, image.colors[0].blud];
  
  return color;
}

const imageBrightness = async (image) => {
  return 1
  const pixelAverage = require('pixel-average')
	if(!image) return 1;
	const url = `${image.url}?fmt=jpg&w=1000`
	return new Promise((resolve, reject)=> pixelAverage(url, (err, {brightness}) => err ? reject(err) : resolve(brightness/255)))
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

export {
  imageColor,
  imageBrightness,
  splitArray,
}