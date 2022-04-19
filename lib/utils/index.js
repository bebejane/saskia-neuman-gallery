
const request = require('request')
const gm = require('gm')

const imageColor = (image) => {
  
  let color = [255,255,255];

  if(image?.customData?.color)
    color = image.customData?.color.split(',')
  else if(image?.colors)
    color - [image.colors[0].red, image.colors[0].green, image.colors[0].blud];
  
  return color;
}

const imageBrightness = async (image) => {
	if(!image) return 1;

	const url = `${image.url}?fmt=jpg&w=400`
	const g = gm.subClass({ imageMagick: true });
	return new Promise((resolve, reject)=>{
		g(request(url))
		.colorspace('HSL')
		.channel('B')
		.out('-format')
		.out('%[fx:mean*100]')
		.toBuffer('info', (err, buffer) =>  err ? reject(err) : resolve(parseFloat(buffer.toString())/100)) 
	})
}

export {
  imageColor,
  imageBrightness
}