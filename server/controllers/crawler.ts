import fetch from 'isomorphic-unfetch';

export const URL_REGEX = 'http.*://[^?]*'

export interface ICrawlMessage {
    url: string,
    currentDepth: number,
    requestedDepth: number,
    requestedPages: number,
    crawlId: any
}

const preformCrawl = async (request: ICrawlMessage): Promise<void> => {
    return new Promise((resolve, reject) => {
        //validate if needed
        isCrawlNeeded(request)
            .then(() => {extractLinks(request.url)
            .then((links) => { console.log(links) })
            //save results
            //add to queue childern
            //await crawl(message.getContent()
            .then(() => resolve())
            })
            .catch((err) => reject(err))
    });
}

const isCrawlNeeded = async (request: ICrawlMessage): Promise<void> => {
    return new Promise((resolve, reject) => {
        console.log('needed?', request);
        if (request.currentDepth >= request.requestedDepth) {
            reject('crawl reached depth');
        }
        if (request.requestedPages >= 10) { // todo: get the number from db
            reject('crawl reachd page count');
        }
        //todo: validate this url was not crawled in this scan
        if(false){
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