import { datoError } from "lib/dato/api"
import { Dato } from "/lib/dato/api"

export default async (req, res) => {

  const { entity } = req.body
  const record = await Dato.items.all({
    filter:{
      fields :{
        id:{eq:entity.id}
      }
    }
  })

  res.json(record)

}