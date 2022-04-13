import { datoError } from "lib/dato/api"
import { Dato } from "/lib/dato/api"

export default async (req, res) => {

  const { entity } = req.body
  
  try{
    const record = await Dato.items.all({filter: {id: entity.id }},{allPages: true})
    res.json(record)
  }catch(err){
    res.json(err)
  }
  

}