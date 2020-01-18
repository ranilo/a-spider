
import React from 'react'
import fetch from 'unfetch'
import { useState } from 'react';
import CrawlForm from './crawlForm';
import CrawlOutcome from './crawlOutcome';

const fetchInit = ((data) => {
  return {
    method: 'POST',
    body: JSON.stringify(data)
  }
});

function CrawlView() {

  const [crawlResponse, setCrawlResponse] = useState({
    data: null,
    error: null
  });


  const getCrawl = async (requestData) => {
    fetch("/api/crawl-request", fetchInit(requestData))
      .then(response => response.json())
      .then(json => setCrawlResponse(json))
  }

  const requestDetails = (details) => {
    console.log(details);
    getCrawl(details);
  };

  const { data, error } = crawlResponse;

  return <div>
    <CrawlForm setCrawl={requestDetails} error={error} />

    <CrawlOutcome crawl={data} />

  </div>
}
export default CrawlView
