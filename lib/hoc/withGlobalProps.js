import { apiQuery, SEOQuery } from "/lib/dato/api";
import { GetGlobal } from "/graphql";
import { imageColor } from "lib/utils";

const generateMenu = ({artists, events, shows}) => {
  return [
    {type:'artist', path:'/artists', label:'Artists', sub:artists.map(a => ({...a, slug:`artists/${a.slug}`, color:imageColor(a.image)}))}, 
    {type:'show', path:'/shows', label:'Shows', sub:shows.map(s => ({...s, slug:`shows/${s.slug}`, color:imageColor(s.image)}))}, 
    {type:'event', path:'/events', label:'Events', sub:events.map(e => ({...e, slug:`events/${e.slug}`, color:imageColor(e.image)}))},
    {type:'about', path:'/about', label:'About'}
  ]
}

export default function withGlobalProps(opt = {}, callback){
  
  callback = typeof opt === 'function' ? opt : callback;

  const revalidate = parseInt(process.env.REVALIDATE_TIME || 60)
  
  const queries = [GetGlobal]
  
  if(opt.query) 
    queries.push(opt.query)
  if(opt.queries) 
    queries.push.apply(queries, opt.queries)
  if(opt.model) 
    queries.push(SEOQuery(opt.model))
  
  return async (context) => {
    const props = await apiQuery(queries, {}, context.preview);
    props.menu = generateMenu(props)

    if(callback)
      return await callback({context, props: {...props}, revalidate});
    else
      return { props:{...props}, context, revalidate};
  }
}