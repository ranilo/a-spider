# a-spider
My home test for ActiveFence :koala:

## How this works in general:
1. client validates and sends reqest to api
2. server validates, create guid, push to quque and respond to client
3. worker listen to queue
- validate
- check if need to scrape
- scrapes
- pushes to queue the children.
4. client listen to firestore updates and render as it comes.


## stack
* next.js (SSR, node)
* rabbitmq
* fierstore (replacing the DB and the websocket)
* typescript 
* docker :whale:
* redis

## build: 
**npm run dev**
docker-compose up (running redis and rabbit)

## links
[lucid chart](https://www.lucidchart.com/invitations/accept/79cd6621-5e01-41fd-a73c-682706e5a71c)

## TODOS:
* becouse of mextjs and .env, When running with docker compose the worker is not connecting to queue.
* jest and puppeteer
* css - it's ugly!