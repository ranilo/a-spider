import fetch from 'isomorphic-unfetch';
import { Guid } from "guid-typescript";
import { write } from '../../../lib/dbUtill'
import { send } from '../../../lib/RabbitClient';
import { isCrawlNeeded } from './checkNeeded';
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
                            .then(() => { console.log('all done') })
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


const extractLinks = async (request: RequestInfo): Promise<void> => {
    return new Promise((resolve, reject) => {
        fetch(request)
            .then((response: any) => {
                if (!response.ok) {
                    reject('Network response was not ok');
                }
                return response.text();
            })
            .then((body: any) => {
                const HTMLParser = require('node-html-parser');
                const root = HTMLParser.parse(body);
                return root.querySelectorAll('a');
            })
            .then((aObject: Array<any>) => {
                let data: any = [];
                aObject.forEach(a => {
                    //for simplify - only use full urls
                    if (RegExp(URL_REGEX).test(a.attributes.href)) {
                        data.push({ url: RegExp(URL_REGEX).exec(a.attributes.href)[0] })
                    }
                })
                resolve(data);
            })
            .catch((err: any) => reject(err));
    });
};

export { preformCrawl }