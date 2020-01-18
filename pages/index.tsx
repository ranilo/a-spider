
import React, { useState } from 'react'
import CrawlForm from './components/crawl/crawlForm'
import CrawlView from './components/crawl/crawlView'

const homePage = (() => {
const [crawl, setCrawl] = useState({})

const callback = (values) => {
    setCrawl( {
        ...crawl, values
    })
}

    return <div>
        <CrawlForm setCrawl={callback} />
        <CrawlView crawl={crawl} />
        <style jsx>{``}</style>
    </div>
})
export default homePage;