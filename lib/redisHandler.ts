import { createClient, RedisClient } from 'redis'

const client: RedisClient = createClient(process.env.REDIS_PORT);

const countPagesAndInc = (async(name): Promise<Number> => {
        return new Promise<Number>((resolve, reject) => {
            client.incr(name, (err, value) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(value);
                }
            });
        });
});
export {countPagesAndInc}

const viewdPage = (async (name, link:String):Promise<Boolean>=> {
        const exists = '1';
        return new Promise<Boolean>((resolve, reject)=>{
            client.getset(name+link.toString(),exists, ((err,value)=>{
                if(err) reject(err)
                else resolve (value ===  exists)
            }));
        })
    })
export { viewdPage }


