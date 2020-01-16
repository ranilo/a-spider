import fetch from 'unfetch'
import useSWR from 'swr'
import { ok } from 'assert';


const API_URL = '/api/'
async function fetcher(path) {
  const data = { path: path };
  const res = await fetch(API_URL+"links", {
    method: 'POST',
    body: JSON.stringify(data)
  })
  const json = await res.json()
  return json
}

async function crawl(path){
  const data = {uri: path,  maxDepth: 2, maxPage: 3};
  const res = await fetch(API_URL+"crawl-request", {
    method: 'POST',
    body: JSON.stringify(data)
  })
  // if(res.status != (200 || 422)){
  const json = await res.json()
  return json
}

function HomePage() {
  const { data, error } = useSWR('https://www.github.com/developit/unfetch/tree/master/packages/isomorphic-unfetch', crawl)

  if (error) return <div>failed to load </div>
  if (!data) return <div>loading...</div>
  if(!data.ok){
  return <div><p>{data.error}</p></div>
  }
  return <div>
    <h1>{data.path}</h1> 
    {data.links.map(link =>
    <li>{link.url}</li>)}
    </div>
}

export default HomePage