

const imageColor = (image) => {
  
  let color = [255,255,255];

  if(image?.customData?.color)
    color = image.customData?.color.split(',')
  else if(image?.colors)
    color - [image.colors[0].red, image.colors[0].green, image.colors[0].blud];
  
  return color;
}

const imageBrightness = async (image) => {
  //if(process.env.NODE_ENV === 'development') return 0
  const pixelAverage = require('pixel-average')
	if(!image) return 1;
	const url = `${image.url}?fmt=jpg`
	return new Promise((resolve, reject)=> pixelAverage(url, (err, {brightness}) => err ? reject(err) : resolve(brightness/255)))
}

const generateMenu = ({artists, events, shows, about}) => {
  
  const menu = [
    {type:'artist', path:'/artists', label:'Artists', sub:artists.map(a => ({...a, slug:`artists/${a.slug}`, color:imageColor(a.image)}))}, 
    {type:'show', path:'/shows', label:'Shows', sub:shows.map(s => ({...s, slug:`shows/${s.slug}`, color:imageColor(s.image)}))}, 
    {type:'event', path:'/events', label:'Events', sub:events.map(e => ({...e, slug:`events/${e.slug}`, color:imageColor(e.image)}))},
    {type:'about', path:'/about', label:'About', image:about.image}
  ].map( m => ({
    ...m, 
    image: (m.sub ? m.sub[0]?.image : m.image), 
    color: imageColor( m.sub ? m.sub[0]?.image : m.image)
  }))
  return menu
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
	generateMenu
}