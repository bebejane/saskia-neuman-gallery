const imageColor = (image) => {
  
  let color = [255,255,255];

  if(image?.customData?.color)
    color = image.customData?.color.split(',')
  else if(image?.colors)
    color - [image.colors[0].red, image.colors[0].green, image.colors[0].blud];
  
  return color;
}

const imageBrightness = async (image) => {
	if(!image) return 100;

	const request = require('request')
	const gm = require('gm').subClass({ imageMagick: true });
	const url = `${image.url}?fmt=jpg`
	return new Promise((resolve, reject)=>{
		gm(request(url))
		.colorspace('HSL')
		.channel('B')
		.out('-format')
		.out('%[fx:mean*100]')
		.toBuffer('info', (err, buffer) =>  err ? reject(err) : resolve(parseFloat(buffer.toString()))) 
	})
}

export {
  imageColor,
  imageBrightness
}