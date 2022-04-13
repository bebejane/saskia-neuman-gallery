import { datoError } from "lib/dato/api"
import { Dato } from "/lib/dato/api"

export default async (req, res) => {

  const { entity } = req.body
  
  try{
    
    const models = await Dato.itemTypes.all();
    const modelId = entity.relationships.item_type.data.id
    const model = models.filter(m => m.id === modelId)[0]
    const record = await Dato.items.all({filter: {id: entity.id }},{allPages: true})
    const path = ['show', 'event', 'artist'].includes(model.apiKey) ? `/${model.apiKey}s/${record.slug}` : null
    if(!path) return res.status(500).json({error:'Path failed'})
    await res.unstable_revalidate(path)
    res.json({ revalidated: true, path })
  }catch(err){
    res.json(err)
  }
  

}