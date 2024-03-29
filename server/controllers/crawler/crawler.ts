import { Guid } from "guid-typescript";
import { write } from '../../../lib/dbUtill'
import { send } from '../../../lib/RabbitClient';
import { isCrawlNeeded } from './checkNeeded';
import { extractLinks } from './preform';
export const URL_REGEX = 'http[^?#]*'

export interface ICrawlMessage {
    url: string,
    currentDepth: number,
    requestedDepth: number,
    requestedPages: number,
    crawlId: Guid
}

const preformCrawl = async (request: ICrawlMessage): Promise<void> => {
    return new Promise((resolve, reject) => {
        isCrawlNeeded(request)
            .then(() => {
                extractLinks(request.url)
                    .then((links) => {
                        saveCrawl(request, links)
                            .catch(err => reject(err));
                        crawlChildren(request, links)
                            .then(() => { console.log(request.currentDepth,'is done') })
                    })
                    .then(() => resolve())
                    .catch(error => reject(error))
            })
            .catch((err) => reject(err))
    });
}

const crawlChildren = async (request, links): Promise<void> => {
    return new Promise((resolve, reject) => {
        try {
            const linkData = {
                currentDepth: request.currentDepth + 1,
                requestedDepth: request.requestedDepth,
                requestedPages: request.requestedPages,
                crawlId: request.crawlId
            }
            links.forEach(async link => {
                send(JSON.stringify({ ...linkData, url: link.url }));
                resolve();
            })
        } catch (err) {
            console.log('error sending links to queue', err);
            reject(err);
        }
    });
}

const saveCrawl = async (request: ICrawlMessage, links: any): Promise<void> => {
    return new Promise((resolve, reject) => {
        const data = { ...request, links: links };
        write(data)
            .then(() => resolve())
            .catch(e => reject(e))
    });
}

export { preformCrawl }