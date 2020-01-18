import { useState, useEffect } from "react";
import { listen } from "../../../lib/dbUtill";

const CrawlOutcome = (props) => {

    const [crawls, setCrawls] = useState([]);

    const getCrawls = (async (crawlId) => {
        listen(crawlId, (snapshot) => {
            const docs = [];
            if(!snapshot || snapshot.empty) return;
            snapshot.forEach(doc => {
                docs.push({...doc.data(), id: doc.ref.id });
            });
            console.log(docs);
            setCrawls(docs)
        })
    })

    useEffect(() => {
        getCrawls(props.crawlId);
    }, []);

    return <div>
        {crawls.map((crawl, i) =>
        <li key={crawl.id}>{i}->{crawl.currentDepth} {crawl.url}</li>)}
    </div>
}

export default CrawlOutcome;