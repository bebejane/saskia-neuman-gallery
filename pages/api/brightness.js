import { imageBrightness } from "/lib/utils"

export default async (req, res) => {
  
  const url = req.query.url || 'https://www.datocms-assets.com/66482/1650306415-retail-space-for-rent-in-nj.jpg'
  const brightness = await imageBrightness({url})
  res.json({brightness, url})
}