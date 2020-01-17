// crawl-request.ts
import { send } from '../../lib/RabbitClient'
import { URL_REGEX, ICrawlMessage } from '../../server/controllers/crawler';

interface ICrawlResponse {
    data: ICrawlMessage,
    error: Array<String>
}

export interface ICrawlRequest {
    maxDepth: number,
    maxPage: number,
    uri: string
}

function isValid(body: ICrawlRequest): ICrawlResponse {
    let res = {
        data: {
            url: null,
            currentDepth: 0,
            requestedDepth: 0,
            requestedPages: 0,
            crawlId: null
        },
        error: []
    };
    try {
        
        if(body.maxDepth > Number(process.env.MAX_DEPTH_LIMIT || isNegatve(body.maxDepth))){
            res.error.push("Max Depth Excceeded");
            return res;
        }
        res.data.requestedDepth = body.maxDepth || 0;
        if(body.maxPage > Number(process.env.MAX_PAGE_LIMIT || isNegatve(body.maxPage))){
            res.error.push("Max Page Excceeded");
            return res;
        }
        res.data.requestedPages = body.maxPage || 0;
        if(!RegExp(URL_REGEX).test(body.uri)){
            res.error.push("URL is not valid");
            return res;
        }
        res.data.url =  RegExp(URL_REGEX).exec(body.uri)[0];
        res.data.currentDepth = 0;

    } catch (error) {
        res.error = error;
    }
    return res;
}

export default async (req, res) => {
    const body = JSON.parse(req.body);
    if (req.method === 'POST') {
        let validRequest = isValid(body);
        if (validRequest.error.length > 0) {
            return res.status(400).json({
                ok: false,
                error: "Error Parsing request " + validRequest.error
            })
        }
        //save to queue
        send(JSON.stringify(validRequest.data));
        return res.status(200).json(JSON.stringify(validRequest));
    }
}

const isNegatve = ((num) => num <= 0);