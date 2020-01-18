import { RedisClient } from 'redis'

const opts = {
    host: process.env.REDIS_HOST || 'localhost',
    port: Number(process.env.REDIS_PORT) || 6379

}

class pageCounter{
    private counterName = 'page_counter';

    private client:RedisClient;
    static _instance:pageCounter;
    private constructor(){
        this.client = new RedisClient(opts);
        this.client.set(this.counterName, '0');
    }
    static getInstance(){
        if(!this._instance){
            this._instance = new pageCounter();
        }
        return this._instance;
    }
    increment(){
        this.client.incr(this.counterName);
    }

    count(cb){
        this.client.get(this.counterName,cb);
    }
}

export {pageCounter}


