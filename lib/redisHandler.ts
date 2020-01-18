import { createClient, RedisClient } from 'redis'

class pageCounter {
    private counterName = 'page_counter';

    private client: RedisClient;
    static _instance: pageCounter;
    private constructor() {
        this.client = createClient(process.env.REDIS_PORT);
        this.client.set(this.counterName, '0');
    }
    static getInstance() {
        if (!this._instance) {
            this._instance = new pageCounter();
        }
        return this._instance;
    }
    increment() {
        this.client.incr(this.counterName);
    }

    async count(): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            this.client.get(this.counterName, (err, value) => {
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


