import firebase from 'firebase'

const config = {
    apiKey: process.env.API_KEY,
    authDomain: process.env.AUTH_DOMAIN,
    databaseURL: process.env.DATABASE_URL,
    projectId: "a-spider-87921",
    storageBucket: process.env.STORAGE_BUCKET,
    messagingSenderId: process.env.MESSAGING_SENDER_ID,
    appId: process.env.APP_ID
};
export default !firebase.apps.length ? firebase.initializeApp(config).firestore() : firebase.app().firestore();
