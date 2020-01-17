import * as Amqp from "amqp-ts";

class RabbitClient {
    connection: Amqp.Connection;
    exchange: Amqp.Exchange;
    queue: Amqp.Queue;
    static _instance: RabbitClient;

    private constructor(server: string, queueName: string) {
        this.connection = new Amqp.Connection("amqp://" + server + "?heartbeat=60")
        this.exchange = this.connection.declareExchange("Exchange_" + queueName);
        this.queue = this.connection.declareQueue(queueName);
        this.queue.bind(this.exchange);
    }

    static getIstance(): RabbitClient {
        if (this._instance == null) {
            this._instance = new RabbitClient(process.env.RABBIT_SERVER, process.env.RABBIT_QUEUE_NAME)
        }
        return (this._instance);
    }
}

async function send(msg: any): Promise<void> {
    const message = new Amqp.Message(msg)
    return new Promise<void>((resolve) => {
        RabbitClient.getIstance().connection.completeConfiguration()
            .then(() => {
                RabbitClient.getIstance().exchange.send(message);
                resolve();
            });
    });
}

async function consume(callback: (message) => any): Promise<void> {
    return new Promise<void>((resolve) => {
        console.info(`> waiting for completeConfiguration`);

        RabbitClient.getIstance().connection.completeConfiguration()
            .then(() => {
                console.info(`> listning for meesseges on queue`);
                RabbitClient.getIstance().queue.activateConsumer(callback);
                resolve();
            }, { noAck: false });
    });
}


export { consume }
export { send }
