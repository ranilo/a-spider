import fetch from 'unfetch'
import useSWR from 'swr'

const API_URL = '/api/'
async function fetcher(path) {
  const data = { uri: path };
  const res = await fetch(API_URL+"crawl-request", {
    method: 'POST',
    body: JSON.stringify(data)
  })
  const json = await res.json()
  return json
}

function HomePage() {
  const { data, error } = useSWR('https://www.github.com/developit/unfetch/tree/master/packages/isomorphic-unfetch', fetcher)

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