// crawl-request
interface CrawlRequest {
    valid: Boolean,
    url: String,
    maxDepth: Number,
    maxPage: Number,
    error: String
}

const URL_REGEX = '#\b(([\w-]+://?|www[.])[^\s()<>]+(?:\([\w\d]+\)|([^[:punct:]\s]|/)))#iS';

function isValid(body: any): CrawlRequest {
    let res = {
        valid: false,
        maxDepth: 0,
        maxPage: 0,
        url: null,
        error: ""
    };
    try {
        if(body.maxDepth > process.env.MAX_DEPTH_LIMIT){
            res.error = "Max Depth Excceeded";
            return res;
        }
        res.maxDepth = body.maxDepth;
        
        if(body.maxPage > process.env.MAX_PAGE_LIMIT){
            res.error = "Max Page Excceeded";
            return res;
        }
        res.maxPage = body.maxPage;
        console.log(body, RegExp(URL_REGEX).test(body.url));
        if(!RegExp(URL_REGEX).test(body.url)){
            res.error = "URL is not valid";
            return res;
        }
        res.url = body.url;

    } catch (error) {
        res.error = error;
    }
    return res;
}

export default async (req, res) => {
    const body = JSON.parse(req.body);
    if (req.method === 'POST') {
        let validRequest = isValid(req.body);
        if (!validRequest.valid) {
            return res.status(400).json({
                ok: false,
                error: "Error Parsing request " + validRequest.error
            })
        }
        //save to queue
        res.status(200);
    }
}