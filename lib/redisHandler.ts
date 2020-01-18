import { createClient, RedisClient } from 'redis'

const client: RedisClient = createClient(process.env.REDIS_PORT);

class pageCounter {
    private counterName = 'page_counter';

    static _instance: pageCounter;
    private constructor() {

        client.set(this.counterName, '0');
    }
    static getInstance() {
        if (!this._instance) {
            this._instance = new pageCounter();
        }
        return this._instance;
    }

    async countAndInc(): Promise<Number> {
        return new Promise<Number>((resolve, reject) => {
            client.incr(this.counterName, (err, value) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(value);
                }
            });
        });
    }
}

export { pageCounter }

class ViewdLinks {
    static _instance: ViewdLinks;
    static getInstance() {
        if (!this._instance) {
            this._instance = new ViewdLinks();
        }
        return this._instance;
    }

    async add(link: String) {
        await client.set(link.toString(), link.toString(), 'EX', 1);
    }

    async wasViewd(link: String): Promise<Boolean> {
        return new Promise<Boolean>((resolve, reject) => {
            client.exists(link.toString(), (err, value) => {
                if (err) reject(err)
                else resolve(value == 1);
            })
        })
    }
}
export { ViewdLinks }


