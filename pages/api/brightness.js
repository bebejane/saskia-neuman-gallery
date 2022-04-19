import { imageBrightness } from "/lib/utils"


export default async (req, res) => {
  
  const brightness = await imageBrightness({url:'https://www.datocms-assets.com/66482/1650306415-retail-space-for-rent-in-nj.jpg'})
  
  res.json({brightness})

}