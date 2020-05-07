import { GuideoServer } from './application/GuideoServer';
import { GuideEndpoint, UserEndpoint, RatingEndpoint, TagEndpoint } from './application/rest/endpoints';

import { GuideController, UserController, RatingController, TagController } from "./logic/controllers";

import { UnitOfWork } from './persistence/firebase/unitofwork';

// import { IDataInitializer } from './core/contracts';
// import { InMemoryDataInitializer } from './persistence/initializers';

import * as admin from 'firebase-admin';

const port: number = 3030;
const enableCors: boolean = true;
// const dataInitializer: IDataInitializer = new InMemoryDataInitializer();

var serviceAccount = require(__dirname + '/../vyzerdb-736d7-firebase-adminsdk-vqpte-d08dfa582b.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://vyzerdb.firebaseio.com"
});

var db = admin.firestore();
const unitOfWork: UnitOfWork = new UnitOfWork(db, admin.auth());

// console.log('> initialize data ...');
// const result: number = dataInitializer.initDataSync();
// console.log(`> ${result} entries were initizialized`);

// unitOfWork.users.addRange(dataInitializer.getUsers());
// unitOfWork.guides.addRange(dataInitializer.getGuides());
// unitOfWork.tags.addRange(dataInitializer.getTags());
// unitOfWork.ratings.addRange(dataInitializer.getRatings());
// console.log('> added data to database');

const server: GuideoServer = new GuideoServer({
    port: port,
    routables: [ 
        new GuideEndpoint(new GuideController(unitOfWork)),
        new UserEndpoint(new UserController(unitOfWork)),
        new TagEndpoint(new TagController(unitOfWork)),
        new RatingEndpoint(new RatingController(unitOfWork))
    ],
    enableCors: enableCors,
    staticPaths: [
        { route: '/', paths: [ `${__dirname}\\..\\public` ] }
    ]
});


if (enableCors) console.log('> cors enabled');

console.log(`${__dirname}\\..\\public`);

server.start();