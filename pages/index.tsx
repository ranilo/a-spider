import fetch from 'unfetch'
import useSWR from 'swr'
import { ICrawlRequest } from './api/crawl-request';

const fetchInit = ((data) => {
  return {
    method: 'POST',
    body: JSON.stringify(data)
  }
});

function HomePage() {
  const requestData:ICrawlRequest = {
    uri: 'https://www.github.com/developit/unfetch/tree/master/packages/isomorphic-unfetch',
    maxDepth: 2,
    maxPage: 0
  }

  const { data, error } = useSWR(
    "/api/crawl-request",
    url =>
      fetch(url, fetchInit(requestData))
        .then(_ => _.json())
  );

  if (error) return <div>failed to load </div>
  if (!data) return <div>loading...</div>
  if (!data.ok) {
    return <div><p>{data.error}</p></div>
  }
  return <div>
    <h1>{data.path}</h1>
    {data.links.map(link =>
      <li>{link.url}</li>)}
  </div>
}

export default HomePage