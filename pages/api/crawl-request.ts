// crawl-request.ts
interface CrawlRequest {
    url: String,
    maxDepth: Number,
    maxPage: Number,
    error: Array<String>
}

const URL_REGEX = 'http.*://[^?]*'

function isValid(bodyPayload: string): CrawlRequest {
    const  body = JSON.parse(bodyPayload);
    let res = {
        maxDepth: 0,
        maxPage: 0,
        url: null,
        error: []
    };
    try {
        if(body.maxDepth > process.env.MAX_DEPTH_LIMIT){
            res.error.push("Max Depth Excceeded");
            return res;
        }
        res.maxDepth = body.maxDepth;
        if(body.maxPage > process.env.MAX_PAGE_LIMIT){
            res.error.push("Max Page Excceeded");
            return res;
        }
        res.maxPage = body.maxPage;
        if(!RegExp(URL_REGEX).test(body.uri)){
            res.error.push("URL is not valid");
            return res;
        }
        res.url =  RegExp(URL_REGEX).exec(body.uri)[0];

    } catch (error) {
        res.error = error;
    }
    return res;
}

export default async (req, res) => {
    const body = JSON.parse(req.body);
    if (req.method === 'POST') {
        let validRequest = isValid(req.body);
        if (validRequest.error.length > 0) {
            return res.status(400).json({
                ok: false,
                error: "Error Parsing request " + validRequest.error
            })
        }
        //save to queue
        return res.status(200).json(JSON.stringify(validRequest));
    }
}