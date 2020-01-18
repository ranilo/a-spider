import fetch from 'unfetch'
import { ICrawlRequest } from './api/crawl-request';
import { useEffect, useState } from 'react';
import CrawlOutcome from './crawlOutcome';

const fetchInit = ((data) => {
  return {
    method: 'POST',
    body: JSON.stringify(data)
  }
});

function HomePage() {

  const requestData: ICrawlRequest = {
    uri: 'https://redis.io/commands/expire',
    maxDepth: 3,
    maxPage: 6
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
    <CrawlOutcome crawlId={data.crawlId}/>
  </div>
}

export default HomePage