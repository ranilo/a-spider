# a-spider
My home test for ActiveFence :koala:

## stack
* next.js
* rabbitmq
* fierstore (replacing the DB and the websocket)
* typescript 
* docker :whale:

## build: 
**npm run dev**
~~docker-compose up~~ (see TODOS)

## links
[lucid chart](https://www.lucidchart.com/invitations/accept/79cd6621-5e01-41fd-a73c-682706e5a71c)

## TODOS:
* When running with docker compose the worker is not connecting to queue.
* For validating that the same url is not scaned more then once for the same scan, I need a cach solution.
* unit testing
* ui  