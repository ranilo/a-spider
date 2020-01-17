import fetch from 'isomorphic-unfetch';
import { Guid } from "guid-typescript";
import { write } from '../../lib/dbUtill'
export const URL_REGEX = 'http.*://[^?]*'

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
                    })
                    .then(() => resolve())
                    .catch(error => reject(error))
                //add to queue childern
            })
            .catch((err) => reject(err))
    });
}

const saveCrawl = async (request: ICrawlMessage, links: any): Promise<void> => {
    return new Promise((resolve, reject) => {
        const data = { ...request, links: links };
        console.log(data);
        write(data)
            .then(() => resolve())
            .catch(e => reject(e))
    });
}

const isCrawlNeeded = async (request: ICrawlMessage): Promise<void> => {
    return new Promise((resolve, reject) => {
        if (!request) return reject('crawl data is missing');
        if (request.currentDepth >= request.requestedDepth) {
            reject('crawl reached depth');
        }
        if (request.requestedPages >= 10) { // todo: get the number from db
            reject('crawl reachd page count');
        }
        //todo: validate this url was not crawled in this scan
        if (false) {
            reject(`already crawled on ${request.url}`);
        }
        resolve();
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
                        data.push({ url: a.attributes.href })
                    }
                })
                resolve(data);
            })
            .catch((err: any) => reject(err));
    });
};
export { preformCrawl }