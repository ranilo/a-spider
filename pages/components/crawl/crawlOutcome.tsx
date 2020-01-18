import { useState, useEffect } from "react";
import { listen } from "../../../lib/dbUtill";
import CrawlNode from "./crawlNode";

const CrawlOutcome = (props) => {

    const [crawls, setCrawls] = useState([]);

    const getCrawls = (async (crawlId) => {
        listen(crawlId, (snapshot) => {
            const docs = [];
            if (!snapshot || snapshot.empty) return;
            snapshot.forEach(doc => {
                docs.push({ ...doc.data(), id: doc.ref.id });
            });
            setCrawls(docs)
        })
    })

    useEffect(() => {
        if (props.crawl) {
            getCrawls(props.crawl.crawlId);
        }
    }, [props.crawl]);

    return <div>
        {crawls.map((crawl, i) =>
            <CrawlNode crawl={crawl} count={i} />
        )}
    </div>
}

export default CrawlOutcome;