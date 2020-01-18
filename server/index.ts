import { createServer } from 'http'
import { parse } from 'url'
import next from 'next'
import { consume } from '../lib/RabbitClient'
import { preformCrawl } from './controllers/crawler/crawler'

const port = parseInt(process.env.PORT || '3000', 10)
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()


app.prepare()
  .then(() => {
    createServer((req, res) => {
      const parsedUrl = parse(req.url!, true)
      handle(req, res, parsedUrl)
    }).listen(port)

    // tslint:disable-next-line:no-console
    console.info(
      `> Server listening at http://localhost:${port} as ${
      dev ? 'development' : process.env.NODE_ENV
      }`
    )
  })
  .then(() => {
    console.info('attempt conncting rabbit');
    consume((message) => {
      preformCrawl(JSON.parse(message.getContent()))
        .catch(err => console.log('did not crawl:', err))
        .finally(() => message.ack());
    })
  })

  // async function crawl(path: any){
  //   const data = {uri: path,  maxDepth: 2, maxPage: 3};
  //   const res = await fetch(API_URL+"crawl-request", {
  //     method: 'POST',
  //     body: JSON.stringify(data)
  //   })
  //   // if(res.status != (200 || 422)){
  //   const json = await res.json();
  //   console.log(`crawl resoult ${json}`);
  //   return json;
  // }
