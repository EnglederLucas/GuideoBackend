import express from 'express';
import { GuideoServer } from './application/GuideoServer';
import { GuideController } from "./logic/controllers";
//import { UnitOfWork } from './persistence/inmemory/unitofwork';
import { GuideEndpoint } from './application/rest/endpoints';
import { IDataInitializer } from './core/contracts';
import { InMemoryDataInitializer } from './persistence/initializers';
import { UnitOfWork } from './persistence/firebase/unitofwork';
import * as admin from 'firebase-admin';

const port: number = 3030;
const enableCors: boolean = true;
//const unitOfWork: UnitOfWork = new UnitOfWork();
const dataInitializer: IDataInitializer = new InMemoryDataInitializer();

var serviceAccount = require(__dirname + '..\\..\\..\\vyzerdb-firebase-adminsdk-02032020.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://vyzerdb.firebaseio.com"
})
var db = admin.firestore();
const unitOfWork: UnitOfWork = new UnitOfWork(db);

console.log('> initialize data ...');
const result: number = dataInitializer.initDataSync();
console.log(`> ${result} entries was initizialized`);

/*unitOfWork.users.addRange(dataInitializer.getUsers());
unitOfWork.guides.addRange(dataInitializer.getGuides());
unitOfWork.tags.addRange(dataInitializer.getTags());
unitOfWork.ratings.addRange(dataInitializer.getRatings());*/
//console.log('> added data to repositories');

const server: GuideoServer = new GuideoServer({
    port: port,
    routables: [ new GuideEndpoint(new GuideController(unitOfWork)) ],
    enableCors: enableCors
});

if (enableCors) console.log('> cors enabled');

server.app.use(express.static('D:\\Projects\\guideo_backend\\public'));
server.start();