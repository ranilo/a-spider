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

const listen = async (crawlId, callback: Function) => {
    try {
        db.collection(CRAWL_COLLECTION)
            .orderBy('currentDepth', 'asc')
            .limit(100)
            .where("crawlId", "==", crawlId)
            .onSnapshot((querySnapshot) => {
                console.log(querySnapshot);
                callback(querySnapshot)
            });
    } catch (err) {
        console.log('error reading from db', err);
    }
}

const countPages = (crawlId): any => {
    try {
        db.collection(CRAWL_COLLECTION)
            .limit(1000)
            .where("crawlId", "==", crawlId)
            .get().then((querySnapshot) => {
                return querySnapshot.size;
            });
    } catch (err) {
        console.log('error reading from db', err);
    }
}

export { countPages }
export { listen }
export { write }
