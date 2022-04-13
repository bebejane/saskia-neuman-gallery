import { datoError } from "lib/dato/api"
import { Dato } from "/lib/dato/api"

export default async (req, res) => {

  const { entity } = req.body
  
  try{
    const record = await Dato.items.all({
      filter:{
        type:'show,event',
        fields :{
          id:{eq:entity.id}
        }
      }
    })
  }catch(err){
    return res.json(err)
  }
  res.json(record)

}