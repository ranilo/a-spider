import React from 'react'

const CrawlNode = ((props) => {

    return <div>
        <div>Page number {props.count}</div>
        <div>Depth: {props.crawl.currentDepth}</div>
        <div>URL: {props.crawl.url}</div>
        <div>
        {props.crawl.links.map((link, i) =>
        <li key={i+props.crawl.crawlId}>{link.url}</li>)}
        </div>
    </div>
})

export default CrawlNode;
