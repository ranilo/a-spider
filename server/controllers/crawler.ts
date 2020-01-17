import fetch from 'isomorphic-unfetch';

export const URL_REGEX = 'http.*://[^?]*'

const preformCrawl = async (request: any):Promise<void> => {
    return new Promise((resolve, reject) => {
        //validate if needed
         extractLinks(request.url)
        .then((links)=>{console.log(links)})
            //save results
      //add to queue childern
      //await crawl(message.getContent()
      .then(()=> resolve())
      .catch((err) => reject(err))
    })
}

const extractLinks = async (request: RequestInfo): Promise<void> => {
    return new Promise((resolve, reject) => {
        fetch(request)
            .then((response: any) => {
                debugger
                if (!response.ok) {
                    throw new Error('Network response was not ok');
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
                resolve( data );
            })
            .catch((err: any) => reject(err));
    });
};
export {preformCrawl}