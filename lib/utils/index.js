const imageColor = (image) => {
  
  let color = [255,255,255];

  if(image?.customData?.color)
    color = image.customData?.color.split(',')
  else if(image?.colors)
    color - [image.colors[0].red, image.colors[0].green, image.colors[0].blud];
  
  return color;
}

export {
  imageColor
}