import { createServer } from 'http'
import { parse } from 'url'
import next from 'next'
import { RabbitClient } from '../lib/RabbitClient'

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
    console.log(
      `> Server listening at http://localhost:${port} as ${
      dev ? 'development' : process.env.NODE_ENV
      }`
    )
  })
  .then(async () => {
    console.log('attempt conncting rabbit');
    await RabbitClient.getIstance()
      .then(async (client) => {
        console.log('connecion in hand', client);
        await client.consume((message) => {
            console.log("INCOMING: ", message.getContent());
            message.ack();
          })
          .catch(err => console.log("error crating consumer", err));
      })
      .catch(err => console.log("error connecting rabbit", err));
  })
