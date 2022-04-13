import { Dato } from "/lib/dato/api"

export default async (req, res) => {

  let path;

  try{
    
    const { entity } = req.body

    if(!entity) throw new Error(`Record payload missing!`);

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
      throw new Error(`Path not found for model ${model.apiKey}`);

    console.log('revalidate path:', path)
    await res.unstable_revalidate(path)
    res.json({ revalidated: true, path, model:model.apiKey })
  }catch(err){
    console.error(err)
    res.status(500).send(`Error revalidating path ${path}! ${err.message}`)
  }
}