import fetch from 'isomorphic-unfetch';
import { parse } from 'node-html-parser';

const links = async (request: RequestInfo): Promise<any> => {
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
                    if (RegExp('^http').test(a.attributes.href)) {
                        data.push({ url: a.attributes.href })
                    }
                })
                resolve( data );
            })
            .catch((err: any) => reject(err));
    });
};

export default async (req, res) => {
    const body = JSON.parse(req.body);
    console.log('req path:', body.path)
    if (req.method === 'POST') {
        res.status(200).json({
            ok:true,
            path: body.path,
            links: await links(body.path)
        })
    }
}
