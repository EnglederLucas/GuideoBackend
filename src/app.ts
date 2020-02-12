import { IUser, IGuide } from "./core/models";
import * as fbadmin from "firebase-admin";
import { DataInitializer } from "./persistence/initializers";

console.log('Hello World');

let userX: IUser = {
    name: 'Max',
    password: 'Hellome'
};

var defaultApp = fbadmin.initializeApp({
    credential: fbadmin.credential.applicationDefault(),
    databaseURL: " guideo-cf028.web.app"
});

let users: IUser[] = DataInitializer.getUsers();
let db = defaultApp.firestore();

// let docRef: FirebaseFirestore.DocumentReference = db.collection('Users').doc('masterrule21');

users.forEach(async (user) => {
    let docRef: FirebaseFirestore.DocumentReference = db.collection('Users').doc();
    docRef.set(user);
});