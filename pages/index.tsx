import fetch from 'unfetch'
import { ICrawlRequest } from './api/crawl-request';
import { useEffect, useState } from 'react';

const fetchInit = ((data) => {
  return {
    method: 'POST',
    body: JSON.stringify(data)
  }
});

function HomePage() {

  const requestData: ICrawlRequest = {
    uri: 'https://www.github.com/developit/unfetch/tree/master/packages/isomorphic-unfetch',
    maxDepth: 1,
    maxPage: 0
  }
  const [crawl, setCrawl] = useState({
    data: null,
    error: null
  });
  const getCrawl = async () => {
    fetch("/api/crawl-request", fetchInit(requestData))
      .then(_ => _.json())
      .then(_ => setCrawl(_))
  }

  useEffect(() => {
    getCrawl();
  }, []);

  const { data, error } = crawl;

  if (error) return <div>failed to load {error.msg}</div>
  if (!data) return <div>loading...</div>
  return <div>
    <h1>loaded: {data.url}</h1>
    <p>{data.crawlId}</p>
  </div>
}

export default HomePage