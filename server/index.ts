import { createServer } from 'http'
import { parse } from 'url'
import next from 'next'
import { consume } from '../lib/RabbitClient'

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
  // })
  // .then(() => {
    console.info('attempt conncting rabbit');
    consume((message) => {
      console.info(`> INCOMING: ${ message.getContent()}`);
      message.ack();
    })
  })
