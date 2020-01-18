import { ICrawlMessage } from "./crawler";

import { viewdPage, countPagesAndInc } from "../../../lib/redisHandler";

//in this is crawl needed function the order of the check is critical!
//1. preformence: check data from queue first
//2. logic: check cach for the page before incrementing
const isCrawlNeeded = async (request: ICrawlMessage): Promise<void> => {
    return new Promise(async (resolve, reject) => {
        if (!request) return reject('crawl data is missing');
        if (request.currentDepth > request.requestedDepth) {
            return reject('crawl reached depth');
        }
        await viewdPage(request.crawlId, request.url)
            .then(async (alreadyVisited) => {
                if (alreadyVisited) {
                    reject(`already crawled on ${request.url}`);
                } else {
                    await countPagesAndInc(request.crawlId)
                        .then((num) => {
                            if (request.requestedPages < num) {
                                reject('crawl reachd page count');
                            }
                        })
                        .catch((err) => reject(err));
                }
            })
            .catch((err) => reject(err));
        return resolve();
    });
}

export { isCrawlNeeded }