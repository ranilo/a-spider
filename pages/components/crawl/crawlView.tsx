
import React from 'react'
import fetch from 'unfetch'
import { useEffect, useState } from 'react';
import CrawlOutcome from './crawlOutcome';

const fetchInit = ((data) => {
  return {
    method: 'POST',
    body: JSON.stringify(data)
  }
});

function CrawlView(props) {

  const [crawl, setCrawl] = useState({
    data: null,
    error: null
  });
  const getCrawl = async (requestData) => {
    fetch("/api/crawl-request", fetchInit(requestData))
      .then(_ => _.json())
      .then(_ => setCrawl(_))
  }

  useEffect(() => {
    getCrawl(props.crawl);
  }, []);

  const { data, error } = crawl;

  if (error) return <div>failed to load {error.msg}</div>
  if (!data) return <div>loading...</div>
  return <div>
    <h1>loaded: {data.url}</h1>
    <CrawlOutcome crawlId={data.crawlId}/>
  </div>
}
export default CrawlView
