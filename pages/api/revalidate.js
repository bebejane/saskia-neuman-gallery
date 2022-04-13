export default async (req, res) => {

  const { entity } = req.body
  console.log(entity)

  res.json({hej:'hej'})

}