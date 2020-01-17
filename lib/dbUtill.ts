import db from './db'

const CRAWL_COLLECTION = 'crawls';
const write = async (data): Promise<void> => {
    return new Promise((resolve, reject) => {
        try {
            db.collection(CRAWL_COLLECTION)
                .add(data)//, timestamp: timestamp})
                .then(() => resolve())
                .catch(err => { reject(err) })
        } catch (err) {
            console.log('error in db connection', err);
            reject(err);
        }
    });
}

const listen = async (crawlId): Promise<Array<any>> => {
    return new Promise((resolve, reject) => {
        try {
            db.collection(CRAWL_COLLECTION).where("crawlId", "==", crawlId)
                .onSnapshot(function (querySnapshot) {
                    var crawls = [];
                    querySnapshot.forEach(function (doc) {
                        crawls.push(doc.data());
                    });
                    resolve(crawls);
                });
        } catch (err) {
            console.log('error reading from db', err);
            reject(err);
        }
    })
}


export { listen }
export { write }
