import { datoError } from "lib/dato/api"
import { Dato } from "/lib/dato/api"

export default async (req, res) => {

  const { entity } = req.body
  
  try{
    let path;
    const models = await Dato.itemTypes.all();
    const modelId = entity.relationships.item_type.data.id
    const model = models.filter(m => m.id === modelId)[0]
    const record = (await Dato.items.all({filter: {type: model.apiKey, fields:{id: {eq:entity.id }}}},{allPages: true}))[0]
    
    if(!record) 
      throw new Error(`Error revalidating! Record not found with id ${entity.id}`);

    switch (model.apiKey) {
      case "start":
        path = `/`;
        break;
      case "about":
        path = `/about`;
        break;
      case "show":
        path = `/shows/${record.slug}`;
        break;
      case "event":
        path = `/events/${record.slug}`;
        break;
      case "artist":
        path = `/artists/${record.slug}`;
        break;
      default:
        break;
    }

    if(!path) 
      throw new Error(`Error revalidating! Path not found for model ${model.apiKey}`);

    console.log('revalidate path', path)
    await res.unstable_revalidate(path)
    res.json({ revalidated: true, path, model:model.apiKey })
  }catch(err){
    console.log(err)
    res.status(500).send(`Error revalidating path ${path}! ${err.message}`)
  }
}