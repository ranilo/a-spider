import * as Amqp from "amqp-ts";

class RabbitClient {
    connection: Amqp.Connection;
    exchange: Amqp.Exchange;
    queue: Amqp.Queue;
    static _instance: RabbitClient;

    private constructor(server: string, queueName: string) {
        this.connection = new Amqp.Connection("amqp://" + server)
        this.connection.initialized.then(() => {
            this.exchange = this.connection.declareExchange("Exchange_" + queueName);
            this.queue = this.connection.declareQueue(queueName);
            this.queue.bind(this.exchange);
        })
        this.connection.initialized.catch((err) => {
            // something went wrong
            console.log("error in rabbit connection!!!", err);
        })

    }

    static async getIstance(): Promise<RabbitClient> {
        return new Promise<RabbitClient>((resolve, reject) => {
            try {
                if (this._instance == null) {
                    this._instance = new RabbitClient(process.env.RABBIT_SERVER, process.env.RABBIT_QUEUE_NAME)
                }
            } catch (error) {
                reject(error);
            }
            resolve(this._instance);
        });
    }

    async consume(callback: (message) => any) {
        await this.connection.completeConfiguration()
            .then(() => {
                this.queue.activateConsumer(callback)
            }, { noAck: false })
    }

    async send(msg: Amqp.Message) {
        this.connection.completeConfiguration()
            .then(() => {
                this.exchange.send(msg);
            });
    }
}

export { RabbitClient }
